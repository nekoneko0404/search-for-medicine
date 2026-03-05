import { LineClient } from "./line.js";
import { CodeNormalizer } from "./normalizer.js";
import { NotificationFactory } from "./notify.js";
import { importMasterData } from "./import_master.js";
import Stripe from "stripe";

interface NotificationPayload {
    title: string;
    message: string;
    items: {
        yj_code: string;
        name: string;
        old_status: string;
        new_status: string;
    }[];
}

export interface Env {
    DB: D1Database;
    LINE_ACCESS_TOKEN: string;
    RESEND_API_KEY?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    ADMIN_PASSCODE: string; // Cloudflare Secret経由で設定 (wrangler secret put ADMIN_PASSCODE)
}

// ============================================================
//  パスコードのハッシュ化ユーティリティ (PBKDF2 + SHA-256)
//  Cloudflare Workers の Web Crypto API を使用
// ============================================================

const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH = 16; // bytes

/**
 * パスコードをPBKDF2でハッシュ化して "salt:hash" 形式の文字列を返す
 */
async function hashPasscode(passcode: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(passcode),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );
    const hashBuffer = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
        keyMaterial,
        256
    );
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${saltHex}:${hashHex}`;
}

/**
 * 入力パスコードとDBに保存されたハッシュ文字列を定数時間で比較する
 * 旧来の平文パスコードにも後方互換で対応（移行期間用）
 */
async function verifyPasscode(input: string, stored: string): Promise<boolean> {
    // 平文との後方互換（移行期間中のみ）
    if (!stored.includes(':')) {
        return input === stored;
    }
    const [saltHex, hashHex] = stored.split(':');
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)));
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(input),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );
    const hashBuffer = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
        keyMaterial,
        256
    );
    const computedHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    // 定数時間比較（タイミング攻撃対策）
    if (computedHex.length !== hashHex.length) return false;
    let diff = 0;
    for (let i = 0; i < computedHex.length; i++) {
        diff |= computedHex.charCodeAt(i) ^ hashHex.charCodeAt(i);
    }
    return diff === 0;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        try {
            const url = new URL(request.url);

            // --- CORS設定 ---
            // 許可オリジンを本番ドメインのみに制限（ワイルドカード「*」を禁止）
            const ALLOWED_ORIGINS = [
                'https://search-for-medicine.pages.dev',
                'https://debug-deploy.search-for-medicine.pages.dev',
                'http://localhost:5173',  // Vite 開発サーバー
                'http://127.0.0.1:5173'
            ];
            const origin = request.headers.get('Origin') || '';
            const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

            const corsHeaders = {
                'Access-Control-Allow-Origin': allowedOrigin,
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Passcode',
                'Vary': 'Origin'
            };

            // OPTIONSプリフライトリクエストに対応
            if (request.method === 'OPTIONS') {
                return new Response(null, { status: 204, headers: corsHeaders });
            }

            // 全レスポンスにCORSヘッダーを一括で付加するヘルパー
            const withCors = (response: Response): Response => {
                const newHeaders = new Headers(response.headers);
                for (const [k, v] of Object.entries(corsHeaders)) newHeaders.set(k, v);
                return new Response(response.body, { status: response.status, headers: newHeaders });
            };

            // --- 疏通確認用 API ---
            if (url.pathname === "/api/ping") {
                return withCors(new Response("pong"));
            }

            // --- 店舗登録 API (管理者/初期セットアップ用) ---
            if (url.pathname === "/api/stores/register" && request.method === "POST") {
                try {
                    const { id, name, passcode, planType } = await request.json() as {
                        id: string, name: string, passcode: string, planType?: string
                    };

                    // パスコードをハッシュ化してから保存
                    const hashedPasscode = await hashPasscode(passcode);

                    await env.DB.prepare(
                        "INSERT INTO stores (id, name, passcode, plan_type) VALUES (?, ?, ?, ?)"
                    ).bind(id, name, hashedPasscode, planType || 'free').run();

                    return withCors(new Response(JSON.stringify({ success: true }), {
                        headers: { "Content-Type": "application/json" }
                    }));
                } catch (err: any) {
                    return withCors(new Response(JSON.stringify({ success: false, error: err.message }), { status: 409 }));
                }
            }

            // --- 店舗退会・データ削除 API (個人情報保護法対応) ---
            if (url.pathname === "/api/stores/delete" && request.method === "POST") {
                const { storeId, passcode } = await request.json() as { storeId: string, passcode: string };

                const store = await env.DB.prepare(
                    "SELECT passcode FROM stores WHERE id = ?"
                ).bind(storeId || "").first<{ passcode: string }>();

                if (!store || !(await verifyPasscode(passcode, store.passcode))) {
                    return withCors(new Response("Unauthorized", { status: 401 }));
                }

                // watch_items は CASCADE削除されるので、stores削除だけでOK
                await env.DB.prepare("DELETE FROM stores WHERE id = ?").bind(storeId).run();

                return withCors(new Response(JSON.stringify({
                    success: true,
                    message: "連携された全データ（店舗情報・採用薬リスト・通知設定）を削除しました。"
                }), { headers: { "Content-Type": "application/json" } }));
            }

            // --- 医薬品登録・設定 取得 API (デバイス間同期用) ---
            if (url.pathname === "/api/watch-items/get" && request.method === "GET") {
                const storeId = url.searchParams.get("storeId");
                const passcode = url.searchParams.get("passcode");

                if (!storeId || !passcode) {
                    return new Response("Missing parameters", { status: 400 });
                }

                // 1. 店舗認証
                const store = await env.DB.prepare(
                    "SELECT * FROM stores WHERE id = ?"
                ).bind(storeId).first<any>();

                if (!store || !(await verifyPasscode(passcode, store.passcode))) {
                    return new Response("Unauthorized", { status: 401 });
                }

                // 2. 監視リストの取得
                const items = await env.DB.prepare(
                    "SELECT yj_code FROM watch_items WHERE store_id = ?"
                ).bind(storeId).all<{ yj_code: string }>();

                return new Response(JSON.stringify({
                    success: true,
                    store: {
                        name: store.name,
                        notifyFilter: store.notify_filter,
                        notifyLineEndpoints: store.notify_line_endpoints,
                        notifyEmailEndpoints: store.notify_email_endpoints,
                        notifyWebhookEndpoints: store.notify_webhook_endpoints,
                        notifyAllowedStart: store.notify_allowed_start,
                        notifyAllowedEnd: store.notify_allowed_end
                    },
                    yjCodes: items.results.map(i => i.yj_code)
                }), {
                    headers: { "Content-Type": "application/json" }
                });
            }

            // --- 監視リストの一括登録 & 設定更新 API ---
            if (url.pathname === "/api/watch-items/batch" && request.method === "POST") {
                const body = await request.json() as any;
                const {
                    storeId,
                    passcode,
                    yjCodes,
                    notifyFilter,
                    notifyLineEndpoints,
                    notifyEmailEndpoints,
                    notifyWebhookEndpoints,
                    notifyTime,
                    notifyAllowedStart,
                    notifyAllowedEnd
                } = body;

                // 1. 店舗認証の検証
                const store = await env.DB.prepare(
                    "SELECT plan_type, passcode FROM stores WHERE id = ?"
                ).bind(storeId || "").first<{ plan_type: string, passcode: string }>();

                if (!store || !(await verifyPasscode(passcode, store.passcode))) {
                    return new Response("Unauthorized", { status: 401 });
                }

                // 2. プランに基づいた上限チェック
                const limit = store.plan_type === 'standard' ? 3000 : 20;
                const codesToProcess = (yjCodes || []).slice(0, limit);

                // 3. コードの正規化（名寄せ）
                const normalizedCodes = CodeNormalizer.batchNormalize(codesToProcess);

                // 3.5 9桁コード（レセ電算）を12桁（YJ）に変換
                // ループ内のクエリを避け、一括で取得する
                const receiptCodes = normalizedCodes.filter(c => c.length === 9);
                const mappingMap = new Map<string, string>();

                if (receiptCodes.length > 0) {
                    // IN 句を使って一括取得 (D1のパラメータ上限を考慮し100件ずつ)
                    const chunkSize = 100;
                    for (let i = 0; i < receiptCodes.length; i += chunkSize) {
                        const chunk = receiptCodes.slice(i, i + chunkSize);
                        const placeholders = chunk.map(() => "?").join(",");
                        const results = await env.DB.prepare(
                            `SELECT receipt_code, yj_code FROM code_mappings WHERE receipt_code IN (${placeholders})`
                        ).bind(...chunk).all<{ receipt_code: string, yj_code: string }>();

                        if (results.results) {
                            for (const row of results.results) {
                                mappingMap.set(row.receipt_code, row.yj_code);
                            }
                        }
                    }
                }

                const finalCodes = normalizedCodes.map(code =>
                    code.length === 9 ? (mappingMap.get(code) || code) : code
                );

                const uniqueCodes = Array.from(new Set(finalCodes)).slice(0, limit);

                // 4. 既存リストをクリアして一括挿入 & 設定更新
                const statements = [];

                if (notifyFilter) {
                    statements.push(env.DB.prepare("UPDATE stores SET notify_filter = ? WHERE id = ?").bind(notifyFilter, storeId));
                }
                if (notifyLineEndpoints !== undefined) {
                    statements.push(env.DB.prepare("UPDATE stores SET notify_line_endpoints = ? WHERE id = ?").bind(notifyLineEndpoints, storeId));
                }
                if (notifyEmailEndpoints !== undefined) {
                    statements.push(env.DB.prepare("UPDATE stores SET notify_email_endpoints = ? WHERE id = ?").bind(notifyEmailEndpoints, storeId));
                }
                if (notifyWebhookEndpoints !== undefined) {
                    statements.push(env.DB.prepare("UPDATE stores SET notify_webhook_endpoints = ? WHERE id = ?").bind(notifyWebhookEndpoints, storeId));
                }
                if (notifyTime !== undefined) {
                    statements.push(env.DB.prepare("UPDATE stores SET notify_time = ? WHERE id = ?").bind(notifyTime, storeId));
                }
                if (notifyAllowedStart !== undefined) {
                    statements.push(env.DB.prepare("UPDATE stores SET notify_allowed_start = ? WHERE id = ?").bind(notifyAllowedStart, storeId));
                }
                if (notifyAllowedEnd !== undefined) {
                    statements.push(env.DB.prepare("UPDATE stores SET notify_allowed_end = ? WHERE id = ?").bind(notifyAllowedEnd, storeId));
                }

                statements.push(env.DB.prepare("DELETE FROM watch_items WHERE store_id = ?").bind(storeId));

                for (const code of uniqueCodes) {
                    statements.push(
                        env.DB.prepare(`
                            INSERT INTO watch_items (store_id, yj_code, last_notified_status) 
                            VALUES (?, ?, (SELECT status FROM market_status_snapshots WHERE yj_code = ?))
                        `).bind(storeId, code, code)
                    );
                }

                // D1 のバッチ制限（通常10,000ステートメント）を考慮し、1000件ずつ実行
                const batchSize = 1000;
                for (let i = 0; i < statements.length; i += batchSize) {
                    const chunk = statements.slice(i, i + batchSize);
                    await env.DB.batch(chunk);
                }

                return new Response(JSON.stringify({
                    success: true,
                    count: uniqueCodes.length,
                    codes: uniqueCodes
                }), {
                    headers: { "Content-Type": "application/json" }
                });
            }

            // --- テスト通知送信 API ---
            if (url.pathname === "/api/notifications/test" && request.method === "POST") {
                const { storeId, passcode, channel, target } = await request.json() as {
                    storeId: string, passcode: string, channel: string, target: string
                };

                const store = await env.DB.prepare(
                    "SELECT passcode, name FROM stores WHERE id = ?"
                ).bind(storeId || "").first<{ passcode: string, name: string }>();

                if (!store || !(await verifyPasscode(passcode, store.passcode))) {
                    return new Response("Unauthorized", { status: 401 });
                }

                const notifier = NotificationFactory.getNotifier(channel, env);
                await notifier.send(target, {
                    title: `【テスト送信】${store.name}様、設定の確認です。`,
                    message: "このメッセージが表示されていれば、通知設定は正常です。",
                    items: [
                        { yj_code: "TEST-CODE", name: "テスト用医薬品", old_status: "不明", new_status: "正常動作中" }
                    ]
                });

                return new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                });
            }

            // --- LINE Webhook API (ID取得サポート用) ---
            if (url.pathname === "/api/notifications/line-webhook" && request.method === "POST") {
                const body = await request.json() as any;
                const events = body.events || [];

                for (const event of events) {
                    if ((event.type === "message" || event.type === "follow") && event.replyToken) {
                        const userId = event.source.userId;
                        const client = new LineClient(env.LINE_ACCESS_TOKEN);

                        await client.replyMessage(event.replyToken, [{
                            type: "text",
                            text: `あなたのLINEユーザーID：\n\n${userId}`
                        }]);
                    }
                }
                return new Response("OK");
            }

            // --- 即時同期トリガー API (管理者用) ---
            if (url.pathname === "/api/admin/trigger-sync" && request.method === "POST") {
                const adminPasscode = request.headers.get("X-Admin-Passcode");
                // 環境変数から取得（Cloudflare Secret: wrangler secret put ADMIN_PASSCODE）
                if (!adminPasscode || adminPasscode !== env.ADMIN_PASSCODE) {
                    return new Response("Unauthorized", { status: 401 });
                }

                // waitUntil を使用して、レスポンス返却後にバックグラウンドで実行
                ctx.waitUntil(performSyncAndNotify(env));

                return new Response(JSON.stringify({ success: true, message: "Sync triggered" }), {
                    headers: { "Content-Type": "application/json" }
                });
            }

            return new Response("Not Found", { status: 404 });

        } catch (err: any) {
            // スタックトレースはサーバーログにのみ記録し、クライアントには返さない
            console.error("Global Error:", err.message, err.stack);
            return new Response(JSON.stringify({
                success: false,
                error: "Internal Server Error"
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    },

    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
        ctx.waitUntil(performSyncAndNotify(env));
    }
};

/**
 * 市場ステータスの更新と通知送信のコアロジック
 */
async function performSyncAndNotify(env: Env) {
    console.log("Sync Task Starting: Updating market status and sending notifications...");

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
            s.notify_time,
            s.notify_allowed_start,
            s.notify_allowed_end,
            s.last_notified_at,
            w.yj_code, 
            m.name as drug_name,
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
        const notifyTime = firstItem.notify_time; // HH:mm format
        const lastNotifiedAt = firstItem.last_notified_at;

        const notifyStart = firstItem.notify_allowed_start || "00:00";
        const notifyEnd = firstItem.notify_allowed_end || "24:00";

        // --- 通知時間判定ロジック ---
        const now = new Date();
        // JSTに変換（Cloudflare WorkersはUTC）
        const jstNow = new Date(now.getTime() + (9 * 60 * 60 * 1000));
        const currentHour = jstNow.getUTCHours();
        const currentMin = jstNow.getUTCMinutes();
        const currentTimeVal = currentHour * 60 + currentMin;

        if (notifyTime) {
            // 1. 固定時間設定 (Legacy / 指定時間ちょうど付近で送る)
            const [targetHour, targetMin] = notifyTime.split(':').map(Number);
            const targetTimeToday = new Date(jstNow);
            targetTimeToday.setUTCHours(targetHour, targetMin, 0, 0);

            const lastNotifiedDate = lastNotifiedAt ? new Date(new Date(lastNotifiedAt).getTime() + (9 * 60 * 60 * 1000)) : new Date(0);

            const isAfterTargetTime = jstNow >= targetTimeToday;
            const notYetNotifiedToday = lastNotifiedDate < targetTimeToday;

            if (!(isAfterTargetTime && notYetNotifiedToday)) {
                console.log(`Skipping store ${storeId}: notifyTime is ${notifyTime}, JST is ${jstNow.toISOString()}`);
                continue;
            }
        } else {
            // 2. 範囲判定 (通知許可時間帯)
            const [startH, startM] = notifyStart.split(':').map(Number);
            const [endH, endM] = notifyEnd.split(':').map(Number);
            const startTimeVal = startH * 60 + startM;
            const endTimeVal = endH * 60 + endM;

            let isAllowed = false;
            if (startTimeVal < endTimeVal) {
                // 同一日内 (例: 09:00 - 21:00)
                isAllowed = currentTimeVal >= startTimeVal && currentTimeVal < endTimeVal;
            } else if (startTimeVal > endTimeVal) {
                // 夜間許可 (例: 21:00 - 06:00)
                isAllowed = currentTimeVal >= startTimeVal || currentTimeVal < endTimeVal;
            } else {
                isAllowed = true; // 00:00 - 00:00 など
            }

            if (!isAllowed) {
                console.log(`Skipping store ${storeId}: Out of allowed range ${notifyStart}-${notifyEnd}, JST is ${currentHour}:${currentMin}`);
                continue;
            }
        }

        const filteredItems = filter === 'restored_only'
            ? items.filter(i => i.new_status === '通常')
            : items;

        if (filteredItems.length === 0) continue;

        const payload: NotificationPayload = {
            title: `${firstItem.store_name}様、以下の採用薬のステータスが変化しました：`,
            message: "",
            items: filteredItems.map(i => ({
                yj_code: i.yj_code,
                name: i.drug_name || '名称不明',
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

        // 5. 通知後、一括でステータスを更新
        const updateStatements = [];
        // ステータス更新
        for (const item of items) {
            updateStatements.push(
                env.DB.prepare(
                    "UPDATE watch_items SET last_notified_status = ? WHERE store_id = ? AND yj_code = ?"
                ).bind(item.new_status, storeId, item.yj_code)
            );
        }
        // 通知日時更新
        updateStatements.push(
            env.DB.prepare("UPDATE stores SET last_notified_at = CURRENT_TIMESTAMP WHERE id = ?").bind(storeId)
        );

        if (updateStatements.length > 0) {
            const batchSize = 500;
            for (let i = 0; i < updateStatements.length; i += batchSize) {
                await env.DB.batch(updateStatements.slice(i, i + batchSize));
            }
        }
    }
}

/**
 * 外部データソース（Google Spreadsheet）から供給状況をフェッチし、D1を更新する
 */
async function updateMarketStatusSnapshot(env: Env) {
    const FILE_ID_MAIN = '1ZyjtfiRjGoV9xHSA5Go4rJZr281gqfMFW883Y7s9mQU';
    const columns = 'E,F,L'; // YJコード (E), 品名 (F), 出荷状況 (L)
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
        if (row.length < 3) continue;

        const yjCode = row[0].replace(/"/g, '').trim();
        const name = row[1].replace(/"/g, '').trim();
        const status = row[2].replace(/"/g, '').trim();

        if (yjCode && status) {
            statements.push(
                env.DB.prepare(
                    "INSERT INTO market_status_snapshots (yj_code, name, status, last_updated) VALUES (?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(yj_code) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status, last_updated = CURRENT_TIMESTAMP"
                ).bind(yjCode, name, status)
            );
        }
    }

    // D1 のバッチ制限を考慮し、1000件ずつ実行
    const chunkSize = 1000;
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
