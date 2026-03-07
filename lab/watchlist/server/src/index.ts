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
    ENCRYPTION_KEY: string; // 暗号化用マスターキー (wrangler secret put ENCRYPTION_KEY)
}

// ============================================================
//  個人情報（PII）の保護用ユーティリティ (AES-256-GCM / SHA-256)
// ============================================================

const ENCRYPTION_ALGO = 'AES-GCM';

/**
 * 文字列をAES-256-GCMで暗号化する
 * 形式: "iv_hex:encrypted_hex"
 */
async function encrypt(text: string | null, keyString: string): Promise<string | null> {
    if (!text) return text;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // キーの生成（文字列から32バイトの鍵を作成）
    const keyData = encoder.encode(keyString.padEnd(32, '0').slice(0, 32));
    const cryptoKey = await crypto.subtle.importKey(
        'raw', keyData, { name: ENCRYPTION_ALGO }, false, ['encrypt']
    );

    const encrypted = await crypto.subtle.encrypt(
        { name: ENCRYPTION_ALGO, iv },
        cryptoKey,
        data
    );

    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    const encryptedHex = Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${ivHex}:${encryptedHex}`;
}

/**
 * 暗号化された文字列を復号する
 */
async function decrypt(encryptedData: string | null, keyString: string): Promise<string | null> {
    if (!encryptedData || !encryptedData.includes(':')) return encryptedData;

    try {
        const [ivHex, encryptedHex] = encryptedData.split(':');
        const iv = new Uint8Array(ivHex.match(/.{2}/g)!.map(b => parseInt(b, 16)));
        const encrypted = new Uint8Array(encryptedHex.match(/.{2}/g)!.map(b => parseInt(b, 16)));

        const encoder = new TextEncoder();
        const keyData = encoder.encode(keyString.padEnd(32, '0').slice(0, 32));
        const cryptoKey = await crypto.subtle.importKey(
            'raw', keyData, { name: ENCRYPTION_ALGO }, false, ['decrypt']
        );

        const decrypted = await crypto.subtle.decrypt(
            { name: ENCRYPTION_ALGO, iv },
            cryptoKey,
            encrypted
        );
        return new TextDecoder().decode(decrypted);
    } catch (e) {
        console.error("Decryption failed:", e);
        return encryptedData; // 復号失敗時は元の値を返す（平文データの可能性）
    }
}

/**
 * 通知先（メール・LINE）のハッシュ値を生成（統計・名寄せ用、復元不可）
 */
async function hashRecipient(text: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(text.trim().toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================
//  パスコードのハッシュ化ユーティリティ (PBKDF2 + SHA-256)
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
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
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

/**
 * CORS設定
 */
const ALLOWED_ORIGINS = [
    'https://search-for-medicine.pages.dev',
    'https://debug-deploy.search-for-medicine.pages.dev',
    'http://localhost:5173',  // Vite 開発サーバー
    'http://127.0.0.1:5173'
];

/**
 * 全レスポンスにCORSヘッダーを一括で付加するヘルパー
 */
function withCors(response: Response, request?: Request): Response {
    const origin = request?.headers.get('Origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Passcode');
    newHeaders.set('Vary', 'Origin');

    return new Response(response.body, { status: response.status, headers: newHeaders });
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        try {
            const url = new URL(request.url);

            // OPTIONSプリフライトリクエストに対応
            if (request.method === 'OPTIONS') {
                return withCors(new Response(null, { status: 204 }), request);
            }

            // --- 疏通確認用 API ---
            if (url.pathname === "/api/ping") {
                return withCors(new Response("pong"));
            }

            // --- 店舗登録 API (管理者/初期セットアップ用) ---
            if (url.pathname === "/api/stores/register" && request.method === "POST") {
                const adminPasscode = request.headers.get("X-Admin-Passcode");
                if (!adminPasscode || adminPasscode !== env.ADMIN_PASSCODE) {
                    return withCors(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
                }

                try {
                    const { id, name, passcode, planType, usageLimit } = await request.json() as {
                        id: string, name: string, passcode: string, planType?: string, usageLimit?: number
                    };

                    // パスコードをハッシュ化してから保存
                    const hashedPasscode = await hashPasscode(passcode);

                    const defaultLimit = (planType === 'standard') ? 3000 : 20;
                    await env.DB.prepare(
                        "INSERT INTO stores (id, name, passcode, plan_type, usage_limit) VALUES (?, ?, ?, ?, ?)"
                    ).bind(id, name, hashedPasscode, planType || 'free', usageLimit || defaultLimit).run();

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
                    return withCors(new Response(JSON.stringify({ success: false, error: "店舗IDまたはパスコードが正しくありません。" }), {
                        status: 401,
                        headers: { "Content-Type": "application/json" }
                    }));
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
                    return withCors(new Response("Missing parameters", { status: 400 }), request);
                }

                // 1. 店舗認証
                const store = await env.DB.prepare(
                    "SELECT * FROM stores WHERE id = ?"
                ).bind(storeId).first<any>();

                if (!store || !(await verifyPasscode(passcode, store.passcode))) {
                    return withCors(new Response(JSON.stringify({ success: false, error: "店舗IDまたはパスコードが正しくありません。" }), {
                        status: 401,
                        headers: { "Content-Type": "application/json" }
                    }));
                }

                // 暗号化キーの取得（Cloudflare Secret）
                const encKey = env.ENCRYPTION_KEY || "";

                // 2. 監視リストの取得
                const items = await env.DB.prepare(
                    "SELECT yj_code FROM watch_items WHERE store_id = ?"
                ).bind(storeId).all<{ yj_code: string }>();

                return withCors(new Response(JSON.stringify({
                    success: true,
                    store: {
                        name: store.name,
                        planType: store.plan_type,
                        usageLimit: store.usage_limit,
                        notifyFilter: store.notify_filter,
                        notifyLineEndpoints: await decrypt(store.notify_line_endpoints, encKey),
                        notifyEmailEndpoints: await decrypt(store.notify_email_endpoints, encKey),
                        notifyWebhookEndpoints: await decrypt(store.notify_webhook_endpoints, encKey),
                        notifyAllowedStart: store.notify_allowed_start,
                        notifyAllowedEnd: store.notify_allowed_end
                    },
                    yjCodes: items.results.map(i => i.yj_code)
                }), {
                    headers: { "Content-Type": "application/json" }
                }), request);
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
                    "SELECT plan_type, usage_limit, passcode FROM stores WHERE id = ?"
                ).bind(storeId || "").first<{ plan_type: string, usage_limit: number, passcode: string }>();

                if (!store || !(await verifyPasscode(passcode, store.passcode))) {
                    return withCors(new Response(JSON.stringify({ success: false, error: "店舗IDまたはパスコードが正しくありません。" }), {
                        status: 401,
                        headers: { "Content-Type": "application/json" }
                    }));
                }

                // 2. プランに基づいた上限チェック (DBの値を優先、なければフォールバック)
                const limit = store.usage_limit || (store.plan_type === 'standard' ? 3000 : 20);
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

                const encKey = env.ENCRYPTION_KEY || "";

                // 4. 既存リストをクリアして一括挿入 & 設定更新
                const statements = [];

                if (notifyFilter) {
                    statements.push(env.DB.prepare("UPDATE stores SET notify_filter = ? WHERE id = ?").bind(notifyFilter, storeId));
                }
                if (notifyLineEndpoints !== undefined) {
                    const encrypted = await encrypt(notifyLineEndpoints, encKey);
                    statements.push(env.DB.prepare("UPDATE stores SET notify_line_endpoints = ? WHERE id = ?").bind(encrypted, storeId));
                }
                if (notifyEmailEndpoints !== undefined) {
                    const encrypted = await encrypt(notifyEmailEndpoints, encKey);
                    statements.push(env.DB.prepare("UPDATE stores SET notify_email_endpoints = ? WHERE id = ?").bind(encrypted, storeId));
                }
                if (notifyWebhookEndpoints !== undefined) {
                    const encrypted = await encrypt(notifyWebhookEndpoints, encKey);
                    statements.push(env.DB.prepare("UPDATE stores SET notify_webhook_endpoints = ? WHERE id = ?").bind(encrypted, storeId));
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

                return withCors(new Response(JSON.stringify({
                    success: true,
                    count: uniqueCodes.length,
                    codes: uniqueCodes
                }), {
                    headers: { "Content-Type": "application/json" }
                }), request);
            }

            // --- [管理者専用] 店舗一覧取得 API ---
            if (url.pathname === "/api/admin/stores" && request.method === "GET") {
                const adminPass = request.headers.get("X-Admin-Passcode");
                if (adminPass !== env.ADMIN_PASSCODE) {
                    return withCors(new Response("Unauthorized", { status: 401 }));
                }

                const stores = await env.DB.prepare(`
                    SELECT id, name, plan_type, usage_limit, subscription_status, created_at, updated_at
                    FROM stores 
                    ORDER BY created_at DESC
                `).all();

                return withCors(new Response(JSON.stringify({ success: true, stores: stores.results }), {
                    headers: { "Content-Type": "application/json" }
                }));
            }

            // --- [管理者専用] 店舗設定更新 API ---
            if (url.pathname === "/api/admin/stores/update" && request.method === "POST") {
                const adminPass = request.headers.get("X-Admin-Passcode");
                if (adminPass !== env.ADMIN_PASSCODE) {
                    return withCors(new Response("Unauthorized", { status: 401 }));
                }

                const { storeId, name, planType, usageLimit, subscriptionStatus } = await request.json() as any;
                if (!storeId) return withCors(new Response("Missing storeId", { status: 400 }));

                await env.DB.prepare(`
                    UPDATE stores 
                    SET name = COALESCE(?, name),
                        plan_type = COALESCE(?, plan_type), 
                        usage_limit = COALESCE(?, usage_limit),
                        subscription_status = COALESCE(?, subscription_status),
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                `).bind(name || null, planType || null, usageLimit || null, subscriptionStatus || null, storeId).run();

                return withCors(new Response(JSON.stringify({ success: true }), {
                    headers: { "Content-Type": "application/json" }
                }));
            }

            // --- [管理者専用] 店舗削除 API ---
            if (url.pathname === "/api/admin/stores/delete" && request.method === "POST") {
                const adminPass = request.headers.get("X-Admin-Passcode");
                if (adminPass !== env.ADMIN_PASSCODE) {
                    return withCors(new Response("Unauthorized", { status: 401 }));
                }

                const { storeId } = await request.json() as { storeId: string };
                if (!storeId) return withCors(new Response("Missing storeId", { status: 400 }));

                // watch_items は CASCADE削除される想定だが、D1の設定に依存
                await env.DB.prepare("DELETE FROM stores WHERE id = ?").bind(storeId).run();

                return withCors(new Response(JSON.stringify({ success: true, message: "Store deleted by admin" }), {
                    headers: { "Content-Type": "application/json" }
                }));
            }

            // --- 即時同期トリガー API (管理者用) ---
            if (url.pathname === "/api/admin/trigger-sync" && request.method === "POST") {
                const adminPasscode = request.headers.get("X-Admin-Passcode");
                // 環境変数から取得（Cloudflare Secret: wrangler secret put ADMIN_PASSCODE）
                if (!adminPasscode || adminPasscode !== env.ADMIN_PASSCODE) {
                    return withCors(new Response("Unauthorized", { status: 401 }));
                }

                // waitUntil を使用して、レスポンス返却後にバックグラウンドで実行
                ctx.waitUntil(performSyncAndNotify(env, { isImmediate: true }));

                return withCors(new Response(JSON.stringify({ success: true, message: "Sync triggered" }), {
                    headers: { "Content-Type": "application/json" }
                }));
            }

            // --- Stripe Webhook API ---
            if (url.pathname === "/api/stripe/webhook" && request.method === "POST") {
                const signature = request.headers.get("stripe-signature");
                if (!signature || !env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
                    return new Response("Webhook configuration missing or invalid request", { status: 400 });
                }

                const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
                    httpClient: Stripe.createFetchHttpClient(),
                });

                const body = await request.text();
                let event;

                try {
                    event = await stripe.webhooks.constructEventAsync(
                        body,
                        signature,
                        env.STRIPE_WEBHOOK_SECRET
                    );
                } catch (err: any) {
                    console.error(`Webhook signature verification failed: ${err.message}`);
                    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
                }

                if (event.type === "checkout.session.completed") {
                    const session = event.data.object as any;
                    const storeId = session.client_reference_id;

                    if (storeId) {
                        console.log(`Payment completed for store: ${storeId}`);
                        // プランをスタンダードに更新
                        await env.DB.prepare(`
                            UPDATE stores 
                            SET plan_type = 'standard', 
                                usage_limit = 3000, 
                                subscription_status = 'active',
                                updated_at = CURRENT_TIMESTAMP 
                            WHERE id = ?
                        `).bind(storeId).run();
                    }
                }

                return new Response(JSON.stringify({ received: true }), {
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
                    return withCors(new Response(JSON.stringify({ success: false, error: "店舗IDまたはパスコードが正しくありません。" }), {
                        status: 401,
                        headers: { "Content-Type": "application/json" }
                    }));
                }

                const encKey = env.ENCRYPTION_KEY || "";
                // 複数の宛先（カンマ区切り）に対応
                const targets = target.split(',').map(t => t.trim()).filter(Boolean);

                if (targets.length === 0) {
                    return withCors(new Response(JSON.stringify({ success: false, error: "宛先を入力してください。" }), { status: 400 }));
                }

                const errors: string[] = [];
                let successCount = 0;

                try {
                    const notifier = NotificationFactory.getNotifier(channel, env);

                    for (const t of targets) {
                        try {
                            // 既に暗号化されている可能性を考慮して復号を試みる
                            const decrypted = await decrypt(t, encKey);
                            await notifier.send(decrypted || t, {
                                title: `【テスト送信】${store.name}様、設定の確認です。`,
                                message: "このメッセージが表示されていれば、通知設定は正常です。",
                                items: [
                                    { yj_code: "TEST-CODE", name: "テスト用医薬品", old_status: "不明", new_status: "正常動作中" }
                                ]
                            });
                            successCount++;
                        } catch (err: any) {
                            console.error(`Test notification failed for ${t}:`, err);
                            errors.push(`${t}: ${err.message}`);
                        }
                    }

                    if (successCount > 0) {
                        return withCors(new Response(JSON.stringify({
                            success: true,
                            message: `${successCount}件の送信に成功しました。`,
                            errors: errors.length > 0 ? errors : undefined
                        }), { headers: { "Content-Type": "application/json" } }));
                    } else {
                        return withCors(new Response(JSON.stringify({
                            success: false,
                            error: `送信に失敗しました。\n${errors.join('\n')}`
                        }), { status: 500, headers: { "Content-Type": "application/json" } }));
                    }

                } catch (notifyErr: any) {
                    console.error("Test notification fatal error:", notifyErr);
                    return withCors(new Response(JSON.stringify({
                        success: false,
                        error: notifyErr.message || "予期せぬエラーが発生しました。"
                    }), {
                        status: 500,
                        headers: { "Content-Type": "application/json" }
                    }));
                }
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
                return withCors(new Response("OK"));
            }

            // --- 通知履歴取得 API (C要件) ---
            if (url.pathname === "/api/notifications/logs" && request.method === "GET") {
                const storeId = url.searchParams.get("storeId");
                const passcode = url.searchParams.get("passcode");

                if (!storeId || !passcode) {
                    return withCors(new Response("Missing parameters", { status: 400 }));
                }

                // 1. 店舗認証
                const store = await env.DB.prepare(
                    "SELECT passcode FROM stores WHERE id = ?"
                ).bind(storeId).first<{ passcode: string }>();

                if (!store || !(await verifyPasscode(passcode, store.passcode))) {
                    return withCors(new Response(JSON.stringify({ success: false, error: "店舗IDまたはパスコードが正しくありません。" }), {
                        status: 401,
                        headers: { "Content-Type": "application/json" }
                    }));
                }

                // 2. 履歴の取得（直近100件）
                const logs = await env.DB.prepare(`
                    SELECT 
                        id, channel, status, error_message, title, content_summary, created_at, recipient_hash
                    FROM notification_logs 
                    WHERE store_id = ? 
                    ORDER BY created_at DESC 
                    LIMIT 100
                `).bind(storeId).all();

                return withCors(new Response(JSON.stringify({
                    success: true,
                    logs: logs.results
                }), {
                    headers: { "Content-Type": "application/json" }
                }));
            }

            return withCors(new Response("Not Found", { status: 404 }), request);

        } catch (err: any) {
            console.error("Global Error:", err.message, err.stack);
            return withCors(new Response(JSON.stringify({
                success: false,
                error: "Internal Server Error"
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }), request);
        }
    },

    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
        ctx.waitUntil(performSyncAndNotify(env, { isImmediate: false }));
    }
};

/**
 * 市場ステータスの更新と通知送信のコアロジック
 */
async function performSyncAndNotify(env: Env, options: { isImmediate?: boolean } = {}) {
    const isImmediate = options.isImmediate || false;
    console.log(`Sync Task Starting (isImmediate: ${isImmediate}): Updating market status and sending notifications...`);

    // 1. 市場全体のステータスを外部ソースから更新
    try {
        await updateMarketStatusSnapshot(env, { forceUpdate: isImmediate });
        console.log("Market status snapshot update process completed.");
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
                // 即時同期（トリガー）の場合は、時間外（特に夜間）でも送信を許可する
                // ただし、早朝など「開始時間」前は配慮が必要かもしれないが、
                // 現状の課題は「23:00を数分過ぎてスキップされた」ことなので、isImmediateなら許可する
                if (isImmediate) {
                    console.log(`Store ${storeId}: Out of allowed range ${notifyStart}-${notifyEnd}, but proceeding due to isImmediate trigger.`);
                } else {
                    console.log(`Skipping store ${storeId}: Out of allowed range ${notifyStart}-${notifyEnd}, JST is ${currentHour}:${currentMin}`);
                    continue;
                }
            }
        }

        const filteredItems = filter === 'restored_only'
            ? items.filter(i => i.new_status === '通常')
            : items;

        if (filteredItems.length === 0) continue;

        // --- 2重通知防止チェック (DBの状態を再確認) ---
        // まれに競合が発生した場合、ここまでの処理中に別のプロセスが更新している可能性があるため
        const reCheck = await env.DB.prepare(`
            SELECT COUNT(*) as cnt FROM watch_items 
            WHERE store_id = ? AND yj_code IN (${filteredItems.map(() => "?").join(",")})
            AND (last_notified_status IS NULL OR last_notified_status != ?)
        `).bind(storeId, ...filteredItems.map(i => i.yj_code), "DUPLICATE_CHECK_DUMMY_NEVER_MATCH").first<{ cnt: number }>();
        // ※実際には fetch 時の WHERE 句でフィルタされているが、バッチ更新前に最終防衛線として機能

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

        const encKey = env.ENCRYPTION_KEY || "";

        // 各チャネルごとに送信
        const channelConfigs = [
            { type: 'line', data: firstItem.notify_line_endpoints, limit: 3 },
            { type: 'email', data: firstItem.notify_email_endpoints, limit: 3 },
            { type: 'webhook', data: firstItem.notify_webhook_endpoints, limit: 0 }
        ];

        for (const ch of channelConfigs) {
            if (!ch.data) continue;
            // 復号
            const decrypted = await decrypt(ch.data, encKey);
            if (!decrypted) continue;

            const endpoints = decrypted.split(',')
                .map((e: string) => e.trim())
                .filter((e: string) => e.length > 0);

            const targets = ch.limit > 0 ? endpoints.slice(0, ch.limit) : endpoints;

            for (const target of targets) {
                try {
                    const notifier = NotificationFactory.getNotifier(ch.type, env);
                    await notifier.send(target, payload);

                    // 通知履歴の保存 (C要件)
                    const recipientHash = await hashRecipient(target);
                    await env.DB.prepare(`
                        INSERT INTO notification_logs (store_id, channel, recipient_hash, title, content_summary)
                        VALUES (?, ?, ?, ?, ?)
                    `).bind(
                        storeId,
                        ch.type,
                        recipientHash,
                        payload.title,
                        payload.items.map(i => `${i.name}(${i.new_status})`).join(', ').slice(0, 500)
                    ).run();

                } catch (err: any) {
                    console.error(`Failed to notify store ${storeId} via ${ch.type} at ${target}:`, err?.message || err);
                    // 失敗ログ
                    try {
                        await env.DB.prepare(`
                            INSERT INTO notification_logs (store_id, channel, status, error_message)
                            VALUES (?, ?, 'failed', ?)
                        `).bind(storeId, ch.type, err?.message || "Unknown error").run();
                    } catch (ignore) { }
                }
            }
        }

        // 5. 通知後、一括でステータスを更新 (これが2重通知防止の鍵)
        const updateStatements = [];
        // ステータス更新
        for (const item of filteredItems) {
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
async function updateMarketStatusSnapshot(env: Env, options: { forceUpdate?: boolean } = {}) {
    const FILE_ID_MAIN = '1ZyjtfiRjGoV9xHSA5Go4rJZr281gqfMFW883Y7s9mQU';
    const sheetName = '医薬品供給状況_比較結果';
    const columns = 'E,F,L'; // YJコード (E), 品名 (F), 出荷状況 (L)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${FILE_ID_MAIN}/gviz/tq?tqx=out:csv&t=${Date.now()}&sheet=${encodeURIComponent(sheetName)}&tq=${encodeURIComponent('SELECT ' + columns)}`;

    console.log(`Fetching market status from ${sheetName}...`);
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

    const csvText = await response.text();

    // ハッシュチェック
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(csvText));
    const currentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    const lastHash = await env.DB.prepare("SELECT value FROM system_config WHERE key = 'last_csv_hash'").first<{ value: string }>();
    if (!options.forceUpdate && lastHash && lastHash.value === currentHash) {
        console.log("CSV has not changed and forceUpdate is false. Skipping DB update.");
        return;
    }

    const rows = csvText.trim().split('\n').slice(1); // ヘッダーをスキップ

    const statements = [];
    for (const rowText of rows) {
        const row = parseCSVLine(rowText);
        if (row.length < 3) continue;

        const yjCode = row[0].replace(/"/g, '').trim().padStart(12, '0');
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
