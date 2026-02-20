import { chromium } from 'playwright';
import { BskyAgent, RichText } from '@atproto/api';
import fs from 'fs';

// --- Configuration ---
const BSKY_HANDLE = process.env.BSKY_HANDLE; // e.g., yourname.bsky.social
const BSKY_PASSWORD = process.env.BSKY_PASSWORD; // App Password

const TARGET_URLS = [
    {
        url: 'https://search-for-medicine.pages.dev/update/?period=3days&normal=1&limited=1&stopped=1&up=1&down=0',
        title: '【供給改善・回復】',
        filename: 'improvement.jpg'
    },
    {
        url: 'https://search-for-medicine.pages.dev/update/?period=3days&normal=1&limited=1&stopped=1&up=0&down=1',
        title: '【供給悪化・停止】',
        filename: 'worsening.jpg'
    }
];

async function main() {
    // 1. Setup Bluesky Agent
    if (!BSKY_HANDLE || !BSKY_PASSWORD) {
        console.error('Error: BSKY_HANDLE or BSKY_PASSWORD is missing.');
        process.exit(1);
    }

    const agent = new BskyAgent({ service: 'https://bsky.social' });

    try {
        console.log('Logging in to Bluesky...');
        await agent.login({
            identifier: BSKY_HANDLE,
            password: BSKY_PASSWORD,
        });

        // 2. Setup Playwright
        const browser = await chromium.launch();
        const context = await browser.newContext({
            viewport: { width: 1280, height: 1600 },
            deviceScaleFactor: 2.4 // 3.0だと1.2MBになるため、2.4に調整
        });
        const page = await context.newPage();

        const images = [];

        try {
            // 3. Take Screenshots
            for (const target of TARGET_URLS) {
                console.log(`Navigating to ${target.url}...`);
                await page.goto(target.url, { waitUntil: 'networkidle' });

                // アニメーションの完了を待つ
                console.log('Waiting for animations to complete...');
                await page.waitForTimeout(2000);

                console.log(`Taking full page screenshot for ${target.title}...`);
                await page.screenshot({
                    path: target.filename,
                    type: 'jpeg',
                    quality: 80, // 90から80に下げてサイズを稼ぐ
                    clip: { x: 0, y: 0, width: 1280, height: 1600 } // 上部1600pxを切り取る
                });
                console.log(`Saved ${target.filename}`);

                // ファイルサイズをチェックしてログに残す
                const stats = fs.statSync(target.filename);
                console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);

                // 4. Upload Image to Bluesky as Blob
                console.log(`Uploading ${target.filename} to Bluesky...`);
                const imageContent = fs.readFileSync(target.filename);
                const { data } = await agent.uploadBlob(imageContent, {
                    encoding: 'image/jpeg',
                });

                images.push({
                    image: data.blob,
                    alt: `${target.title}の一覧スクリーンショット`,
                });
            }

            // 5. Post to Bluesky with RichText Link
            console.log('Posting to Bluesky...');
            const text = `
【医薬品供給状況 更新通知】
厚生労働省データの更新を検知しました。
更新情報を一部抜粋しています。

厚労省データはメーカー公表より1～2日遅れます。
速報はXなどでメーカー公表をご覧ください。

アプリで詳細を確認：
https://search-for-medicine.pages.dev/

#医薬品供給 #薬不足 #search_for_medicine
            `.trim();

            // リッチテキスト（リンク）の処理
            const rt = new RichText({ text });
            await rt.detectFacets(agent);

            await agent.post({
                text: rt.text,
                facets: rt.facets,
                embed: {
                    $type: 'app.bsky.embed.images',
                    images: images,
                },
                createdAt: new Date().toISOString(),
            });

            console.log('Successfully posted to Bluesky!');

        } finally {
            await browser.close();
            // Clean up files
            TARGET_URLS.forEach(target => {
                if (fs.existsSync(target.filename)) {
                    fs.unlinkSync(target.filename);
                }
            });
        }

    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
}

main();
