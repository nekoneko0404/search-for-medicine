export class LineClient {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    /**
     * LINE のプッシュメッセージを送信する
     * @param to ユーザーID (LINE)
     * @param messages 送信するメッセージの配列
     */
    async pushMessage(to: string, messages: { type: string, text: string }[]) {
        const response = await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.accessToken}`
            },
            body: JSON.stringify({
                to,
                messages
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("LINE Push Error:", error);
            throw new Error(`LINE API failed: ${error}`);
        }

        return await response.json();
    }

    /**
     * LINE のリプライメッセージを送信する
     * @param replyToken リプライトークン
     * @param messages 送信するメッセージの配列
     */
    async replyMessage(replyToken: string, messages: { type: string, text: string }[]) {
        const response = await fetch("https://api.line.me/v2/bot/message/reply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.accessToken}`
            },
            body: JSON.stringify({
                replyToken,
                messages
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error("LINE Reply Error:", error);
            throw new Error(`LINE API failed: ${error}`);
        }

        return await response.json();
    }
}
