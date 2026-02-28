export async function onRequest(context: any) {
    const url = new URL(context.request.url);
    const path = context.params.path ? context.params.path.join('/') : '';
    const search = url.search;

    // 確実に新しいバックエンド Worker を指すように固定 (環境変数による不整合を回避)
    const backendBaseUrl = "https://watchlist-backend.neko-neko-0404.workers.dev";
    const targetUrl = `${backendBaseUrl}/api/${path}${search}`;

    console.log(`Proxying request: ${context.request.method} ${url.pathname} -> ${targetUrl}`);

    try {
        const headers = new Headers(context.request.headers);
        // 重要: オリジンへのリクエスト時に元の Host ヘッダーが残っていると 530 エラーの原因になるため削除する
        headers.delete("host");

        const requestData: any = {
            method: context.request.method,
            headers: headers,
            redirect: "follow"
        };

        if (["POST", "PUT", "PATCH"].includes(context.request.method)) {
            requestData.body = await context.request.arrayBuffer();
        }

        const response = await fetch(targetUrl, requestData as any);
        console.log(`Response from backend: ${response.status} ${response.statusText}`);

        // 新しい Response オブジェクトを作成して CORS ヘッダーを付与
        const newResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: new Headers(response.headers)
        });

        newResponse.headers.set('Access-Control-Allow-Origin', '*');
        newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return newResponse;
    } catch (err: any) {
        console.error(`Proxy Error for ${targetUrl}:`, err);
        return new Response(`Proxy Error: ${err?.message || String(err)}`, { status: 500 });
    }
}
