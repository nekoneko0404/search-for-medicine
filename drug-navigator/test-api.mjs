import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// .env.local から APIキーを簡易的に読み込む
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch (e) {
    console.error(".env.local ファイルが見つかりません。", e);
  }
  return null;
}

async function testGemini() {
  console.log("--- Gemini API 接続テスト ---");
  const apiKey = loadEnv();

  if (!apiKey) {
    console.error("❌ エラー: .env.local から GEMINI_API_KEY が読み込めませんでした。");
    console.error("   .env.local ファイルが存在し、GEMINI_API_KEY=... の形式で記述されているか確認してください。");
    return;
  }

  // マスキングして表示
  const maskedKey = apiKey.substring(0, 4) + "****" + apiKey.substring(apiKey.length - 4);
  console.log(`🔑 API Key found: ${maskedKey}`);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  try {
    console.log("📡 Google Gemini API にリクエストを送信中...");
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    const text = response.text();
    console.log("✅ 成功! AIからの応答:");
    console.log(text);
  } catch (error) {
    console.error("❌ API呼び出しに失敗しました。");
    console.error("エラー詳細:", error.message);
    if (error.message.includes("API_KEY_INVALID")) {
        console.error("👉 原因: APIキーが無効です。コピーミスがないか確認してください。");
    }
  }
}

testGemini();
