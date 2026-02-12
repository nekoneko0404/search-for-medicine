
import fs from 'fs';
import path from 'path';

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

async function testGemini(modelName) {
    console.log(`\n--- Test: ${modelName} ---`);
    const apiKey = loadEnv();
    if (!apiKey) return;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{ parts: [{ text: "Hello, answer in JSON format: {\"status\":\"ok\"}" }] }],
        generationConfig: { response_mime_type: "application/json" }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const data = await response.json();
        console.log("Response Data:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

async function runTests() {
    await testGemini("gemini-3-flash-preview");
    await testGemini("gemini-1.5-flash");
}

runTests();
