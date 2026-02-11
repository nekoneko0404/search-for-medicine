
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
        contents: [{ parts: [{ text: "Hello. Answer in simple JSON: {\"reply\":\"hi\"}" }] }],
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
        console.log("FULL DATA TYPE:", typeof data);
        console.log("KEYS:", Object.keys(data));
        if (data.candidates) {
            console.log("CANDIDATES COUNT:", data.candidates.length);
            if (data.candidates[0].content) {
                console.log("CONTENT PARTS:", JSON.stringify(data.candidates[0].content.parts));
            } else {
                console.log("CANDIDATES[0] Content is missing. Finish Reason:", data.candidates[0].finishReason);
            }
        } else {
            console.log("CANDIDATES is missing.");
            console.log("DATA:", JSON.stringify(data));
        }
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

async function runTests() {
    const models = ["gemini-3-flash-preview", "gemini-1.5-flash", "gemini-1.5-flash-latest"];
    for (const model of models) {
        await testGemini(model);
    }
}

runTests();
