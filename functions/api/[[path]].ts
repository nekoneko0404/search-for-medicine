export async function onRequest(context) {
    const url = new URL(context.request.url);
    const path = context.params.path ? context.params.path.join('/') : '';
    const search = url.search;

    // バックエンド Worker の URL
    // Pages の環境変数 BACKEND_URL が定義されている場合はそれを使用し、
    // 未定義の場合はデフォルトの URL を使用します。
    const backendBaseUrl = context.env.BACKEND_URL || "https://watchlist-backend.kiyoshi-23b.workers.dev";

    // /api/[[path]] をキャッチしているため、リクエスト URL に合わせて構築
    const targetUrl = `${backendBaseUrl}/api/${path}${search}`;

    try {
        const requestData = {
            method: context.request.method,
            headers: new Headers(context.request.headers),
        };

        // POST/PUT の場合はボディを転送
        if (["POST", "PUT", "PATCH"].includes(context.request.method)) {
            requestData.body = await context.request.arrayBuffer();
        }

        const response = await fetch(targetUrl, requestData);

        // CORS ヘッダーを付与してレスポンスを返す
        const newResponse = new Response(response.body, response);
        newResponse.headers.set('Access-Control-Allow-Origin', '*');
        newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return newResponse;
    } catch (err) {
        return new Response(`Proxy Error: ${err.message}`, { status: 500 });
    }
}
