import { LineClient } from "./line.js";
import { CodeNormalizer } from "./normalizer.js";
import { NotificationFactory } from "./notify.js";
import Stripe from "stripe";

export interface Env {
    DB: D1Database;
    LINE_ACCESS_TOKEN: string;
    RESEND_API_KEY?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // --- 店舗登録 API (管理者/初期セットアップ用) ---
        if (url.pathname === "/api/stores/register" && request.method === "POST") {
            try {
                const { id, name, passcode, planType } = await request.json() as {
                    id: string, name: string, passcode: string, planType?: string
                };

                await env.DB.prepare(
                    "INSERT INTO stores (id, name, passcode, plan_type) VALUES (?, ?, ?, ?)"
                ).bind(id, name, passcode, planType || 'free').run();

                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (err) {
                return new Response("Conflict or Error", { status: 409 });
            }
        }

        // --- 監視リストの一括登録 & 設定更新 API ---
        if (url.pathname === "/api/watch-items/batch" && request.method === "POST") {
            try {
                const {
                    storeId,
                    passcode,
                    yjCodes,
                    notifyFilter,
                    notifyLineEndpoints,
                    notifyEmailEndpoints,
                    notifyWebhookEndpoints
                } = await request.json() as {
                    storeId: string,
                    passcode: string,
                    yjCodes: string[],
                    notifyFilter?: string,
                    notifyLineEndpoints?: string,
                    notifyEmailEndpoints?: string,
                    notifyWebhookEndpoints?: string
                };

                // 1. 店舗認証の検証
                const store = await env.DB.prepare(
                    "SELECT plan_type, passcode FROM stores WHERE id = ?"
                ).bind(storeId).first<{ plan_type: string, passcode: string }>();

                if (!store || store.passcode !== passcode) {
                    return new Response("Unauthorized", { status: 401 });
                }

                // 2. プランに基づいた上限チェック
                const limit = store.plan_type === 'standard' ? 3000 : 20;
                if (yjCodes.length > limit) {
                    return new Response(`Limit exceeded. ${store.plan_type} plan limit is ${limit}.`, { status: 403 });
                }

                // 3. コードの正規化（名寄せ）
                const normalizedCodes = CodeNormalizer.batchNormalize(yjCodes);
                const uniqueCodes = Array.from(new Set(normalizedCodes)).slice(0, limit);

                // 4. 既存リストをクリアして一括挿入 & 設定更新
                const statements = [];

                // 通知設定の更新
                if (notifyFilter) {
                    statements.push(
                        env.DB.prepare("UPDATE stores SET notify_filter = ? WHERE id = ?")
                            .bind(notifyFilter, storeId)
                    );
                }
                if (notifyLineEndpoints !== undefined) {
                    statements.push(
                        env.DB.prepare("UPDATE stores SET notify_line_endpoints = ? WHERE id = ?")
                            .bind(notifyLineEndpoints, storeId)
                    );
                }
                if (notifyEmailEndpoints !== undefined) {
                    statements.push(
                        env.DB.prepare("UPDATE stores SET notify_email_endpoints = ? WHERE id = ?")
                            .bind(notifyEmailEndpoints, storeId)
                    );
                }
                if (notifyWebhookEndpoints !== undefined) {
                    statements.push(
                        env.DB.prepare("UPDATE stores SET notify_webhook_endpoints = ? WHERE id = ?")
                            .bind(notifyWebhookEndpoints, storeId)
                    );
                }

                // 監視リストの更新 (全削除後に再挿入)
                statements.push(env.DB.prepare("DELETE FROM watch_items WHERE store_id = ?").bind(storeId));

                for (const code of uniqueCodes) {
                    statements.push(
                        env.DB.prepare("INSERT INTO watch_items (store_id, yj_code) VALUES (?, ?)")
                            .bind(storeId, code)
                    );
                }

                await env.DB.batch(statements);

                return new Response(JSON.stringify({ success: true, count: uniqueCodes.length }), {
                    headers: { "Content-Type": "application/json" }
                });

            } catch (err) {
                console.error("Batch update error:", err);
                return new Response("Internal Server Error", { status: 500 });
            }
        }

        // --- テスト通知送信 API ---
        if (url.pathname === "/api/notifications/test" && request.method === "POST") {
            try {
                const { storeId, passcode, channel, target } = await request.json() as {
                    storeId: string, passcode: string, channel: string, target: string
                };

                const store = await env.DB.prepare(
                    "SELECT passcode, name FROM stores WHERE id = ?"
                ).bind(storeId).first<{ passcode: string, name: string }>();

                if (!store || store.passcode !== passcode) {
                    return new Response("Unauthorized", { status: 401 });
                }

                const notifier = NotificationFactory.getNotifier(channel, env);
                await notifier.send(target, {
                    title: `【テスト送信】${store.name}様、設定の確認です。`,
                    message: "このメッセージが表示されていれば、通知設定は正常です。",
                    items: [
                        { yj_code: "TEST-CODE", old_status: "不明", new_status: "正常動作中" }
                    ]
                });

                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            } catch (err: any) {
                return new Response(JSON.stringify({ success: false, error: err.message }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

        return new Response("Not Found", { status: 404 });
    },

    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
        console.log("Cron Running: Updating market status and sending notifications...");

        // 1. 市場全体のステータスを外部ソースから更新
        try {
            await updateMarketStatusSnapshot(env);
            console.log("Market status snapshot updated successfully.");
        } catch (err) {
            console.error("Failed to update market status snapshot:", err);
            // スナップショット更新に失敗しても、既存データでの通知は試みる
        }


        // 2. ステータスが変化した品目を監視している店舗とその品目を取得
        const changes = await env.DB.prepare(`
            SELECT 
                s.id as store_id,
                s.name as store_name,
                s.notify_filter,
                s.notify_line_endpoints,
                s.notify_email_endpoints,
                s.notify_webhook_endpoints,
                w.yj_code, 
                m.status as new_status,
                w.last_notified_status as old_status
            FROM watch_items w
            JOIN stores s ON w.store_id = s.id
            JOIN market_status_snapshots m ON w.yj_code = m.yj_code
            WHERE m.status != COALESCE(w.last_notified_status, '')
        `).all();

        if (changes.results.length === 0) {
            console.log("No status changes detected.");
            return;
        }

        // 3. 店舗ごとに通知を集約
        const notificationsByStore: Record<string, any[]> = {};
        for (const row of changes.results as any[]) {
            if (!notificationsByStore[row.store_id]) {
                notificationsByStore[row.store_id] = [];
            }
            notificationsByStore[row.store_id].push(row);
        }

        // 4. 通知送信
        for (const [storeId, items] of Object.entries(notificationsByStore)) {
            const firstItem = items[0];
            const filter = firstItem.notify_filter;

            const filteredItems = filter === 'restored_only'
                ? items.filter(i => i.new_status === '通常')
                : items;

            if (filteredItems.length === 0) continue;

            const payload: NotificationPayload = {
                title: `${firstItem.store_name}様、以下の採用薬のステータスが変化しました：`,
                message: "",
                items: filteredItems.map(i => ({
                    yj_code: i.yj_code,
                    old_status: i.old_status,
                    new_status: i.new_status
                }))
            };

            // 各チャネルごとに送信
            const channels = [
                { type: 'line', data: firstItem.notify_line_endpoints, limit: 3 },
                { type: 'email', data: firstItem.notify_email_endpoints, limit: 3 },
                { type: 'webhook', data: firstItem.notify_webhook_endpoints, limit: 0 }
            ];

            for (const ch of channels) {
                if (!ch.data) continue;
                const endpoints = ch.data.split(',')
                    .map((e: string) => e.trim())
                    .filter((e: string) => e.length > 0);

                const targets = ch.limit > 0 ? endpoints.slice(0, ch.limit) : endpoints;

                for (const target of targets) {
                    try {
                        const notifier = NotificationFactory.getNotifier(ch.type, env);
                        await notifier.send(target, payload);
                    } catch (err: any) {
                        console.error(`Failed to notify store ${storeId} via ${ch.type} at ${target}:`, err?.message || err);
                    }
                }
            }

            // 5. 通知後、商品ごとにステータスを更新
            for (const item of items) {
                await env.DB.prepare(
                    "UPDATE watch_items SET last_notified_status = ? WHERE store_id = ? AND yj_code = ?"
                ).bind(item.new_status, storeId, item.yj_code).run();
            }
        }
    }
};

/**
 * 外部データソース（Google Spreadsheet）から供給状況をフェッチし、D1を更新する
 */
async function updateMarketStatusSnapshot(env: Env) {
    const FILE_ID_MAIN = '1ZyjtfiRjGoV9xHSA5Go4rJZr281gqfMFW883Y7s9mQU';
    const columns = 'E,L'; // YJコード (E), 出荷状況 (L)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${FILE_ID_MAIN}/gviz/tq?tqx=out:csv&t=${Date.now()}&tq=${encodeURIComponent('SELECT ' + columns)}`;

    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

    const csvText = await response.text();

    // ハッシュチェック
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(csvText));
    const currentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    const lastHash = await env.DB.prepare("SELECT value FROM system_config WHERE key = 'last_csv_hash'").first<{ value: string }>();
    if (lastHash && lastHash.value === currentHash) {
        console.log("CSV has not changed. Skipping DB update.");
        return;
    }

    const rows = csvText.trim().split('\n').slice(1); // ヘッダーをスキップ

    const statements = [];
    for (const rowText of rows) {
        const row = parseCSVLine(rowText);
        if (row.length < 2) continue;

        const yjCode = row[0].replace(/"/g, '').trim();
        const status = row[1].replace(/"/g, '').trim();

        if (yjCode && status) {
            statements.push(
                env.DB.prepare(
                    "INSERT INTO market_status_snapshots (yj_code, status, last_updated) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(yj_code) DO UPDATE SET status = EXCLUDED.status, last_updated = CURRENT_TIMESTAMP"
                ).bind(yjCode, status)
            );
        }
    }

    // D1 のバッチ制限（通常100KB、または数千KB/数千ステートメント）を考慮し、分割実行
    const chunkSize = 100;
    for (let i = 0; i < statements.length; i += chunkSize) {
        await env.DB.batch(statements.slice(i, i + chunkSize));
    }

    // ハッシュを更新
    await env.DB.prepare(
        "INSERT INTO system_config (key, value, updated_at) VALUES ('last_csv_hash', ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP"
    ).bind(currentHash).run();
}

/**
 * CSV 行をパースする（クォート対応）
 */
function parseCSVLine(text: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            if (inQuote && text[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}
