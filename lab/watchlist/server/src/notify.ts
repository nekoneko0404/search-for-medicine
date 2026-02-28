/// <reference types="@cloudflare/workers-types" />
import { LineClient } from "./line.js";

export interface NotificationPayload {
    title: string;
    message: string;
    items: Array<{
        yj_code: string;
        old_status: string;
        new_status: string;
    }>;
}

export interface Notifier {
    send(endpoint: string, payload: NotificationPayload): Promise<void>;
}

/**
 * LINE 通知の実装
 */
export class LineNotifier implements Notifier {
    constructor(private accessToken: string) { }

    async send(endpoint: string, payload: NotificationPayload): Promise<void> {
        const client = new LineClient(this.accessToken);
        const text = `【供給状況アラート】\n${payload.title}\n\n` +
            payload.items.map(i => `・コード: ${i.yj_code}\n  ${i.old_status || '不明'} → ${i.new_status}`).join("\n\n");

        await client.pushMessage(endpoint, [{ type: "text", text }]);
    }
}

/**
 * Webhook (Slack/Discord) 通知の実装
 */
export class WebhookNotifier implements Notifier {
    async send(endpoint: string, payload: NotificationPayload): Promise<void> {
        const text = `*【供給状況アラート】*\n${payload.title}\n\n` +
            payload.items.map(i => `• コード: \`${i.yj_code}\`\n  ${i.old_status || '不明'} → *${i.new_status}*`).join("\n\n");

        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: text, // Slack
                content: text // Discord
            })
        });

        if (!response.ok) {
            throw new Error(`Webhook failed: ${response.status} ${await response.text()}`);
        }
    }
}

/**
 * メール (Resend) 通知の実装
 */
export class EmailNotifier implements Notifier {
    constructor(private apiKey: string) { }

    async send(endpoint: string, payload: NotificationPayload): Promise<void> {
        const html = `
            <h3>【供給状況アラート】</h3>
            <p>${payload.title}</p>
            <ul>
                ${payload.items.map(i => `
                    <li>
                        <strong>コード: ${i.yj_code}</strong><br>
                        ${i.old_status || '不明'} &rarr; <span style="color: red;">${i.new_status}</span>
                    </li>
                `).join("")}
            </ul>
        `;

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: "Medicine Alert <alerts@medicine-scanner.pages.dev>",
                to: [endpoint],
                subject: `供給状況アラート: ${payload.items.length}件の変化`,
                html: html
            })
        });

        if (!response.ok) {
            throw new Error(`Email failed: ${response.status} ${await response.text()}`);
        }
    }
}

/**
 * 通知ファクトリ
 */
export class NotificationFactory {
    static getNotifier(channel: string, env: { LINE_ACCESS_TOKEN?: string, RESEND_API_KEY?: string }): Notifier {
        switch (channel) {
            case 'line':
                return new LineNotifier(env.LINE_ACCESS_TOKEN || "");
            case 'webhook':
                return new WebhookNotifier();
            case 'email':
                return new EmailNotifier(env.RESEND_API_KEY || "");
            default:
                throw new Error(`Unsupported channel: ${channel}`);
        }
    }
}
