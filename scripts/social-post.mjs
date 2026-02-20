import { chromium } from 'playwright';
import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs';

// --- Configuration ---
// These should be set via environment variables in GitHub Actions
const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET;

const TARGET_URLS = [
    {
        url: 'https://search-for-medicine.pages.dev/update/?period=3days&normal=1&limited=1&stopped=1&up=1&down=0',
        title: '【供給改善・回復】',
        filename: 'improvement.png'
    },
    {
        url: 'https://search-for-medicine.pages.dev/update/?period=3days&normal=1&limited=1&stopped=1&up=0&down=1',
        title: '【供給悪化・停止】',
        filename: 'worsening.png'
    }
];

async function main() {
    // 1. Setup Twitter Client
    if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
        console.error('Error: Twitter API credentials are missing.');
        process.exit(1);
    }

    const client = new TwitterApi({
        appKey: TWITTER_API_KEY,
        appSecret: TWITTER_API_SECRET,
        accessToken: TWITTER_ACCESS_TOKEN,
        accessSecret: TWITTER_ACCESS_SECRET,
    });

    // 2. Setup Playwright
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }, // Set initial viewport
        deviceScaleFactor: 2 // High DPI for better quality
    });
    const page = await context.newPage();

    const mediaIds = [];

    try {
        // 3. Take Screenshots
        for (const target of TARGET_URLS) {
            console.log(`Navigating to ${target.url}...`);
            await page.goto(target.url, { waitUntil: 'networkidle' });

            // Wait for any specific element if needed (e.g., table)
            // await page.waitForSelector('.your-target-element'); 

            console.log(`Taking full page screenshot for ${target.title}...`);
            await page.screenshot({ path: target.filename, fullPage: true });
            console.log(`Saved ${target.filename}`);

            // 4. Upload Media to Twitter
            console.log(`Uploading ${target.filename} to X...`);
            const mediaId = await client.v1.uploadMedia(target.filename);
            mediaIds.push(mediaId);
        }

        // 5. Post Tweet
        console.log('Posting tweet...');
        const text = `
【供給状況更新】
Google Driveのデータ更新を検知しました。
直近3日間の供給状況変化をお知らせします。

#医薬品供給 #薬不足 #search_for_medicine
    `.trim();

        await client.v2.tweet({
            text: text,
            media: { media_ids: mediaIds }
        });

        console.log('Successfully posted to X!');

    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    } finally {
        await browser.close();
        // Clean up files
        TARGET_URLS.forEach(target => {
            if (fs.existsSync(target.filename)) {
                fs.unlinkSync(target.filename);
            }
        });
    }
}

main();
