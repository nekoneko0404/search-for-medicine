const ALLOWED_ORIGINS = [
    "http://127.0.0.1:5500", // Localhost (Live Server)
    "http://localhost:5500",
    "http://localhost:3000", // Localhost (React/Next.js)
    "https://search-for-medicine.pages.dev", // Production
    "https://search-for-medicine-test03.pages.dev", // Test environment
    "https://kusuri-compass.pages.dev" // Custom domain (potential)
];

// Start
const SYSTEM_PROMPT = `あなたは料理と健康の専門家です。
ユーザーの体調や症状、手持ちの食材、希望する料理ジャンル、調理時間に合わせて、最適なレシピを提案してください。

# 制約事項
- 「治療」や「治癒」などの医学的表現は避け、「健康をサポートする」「体に優しい」といった表現を用いてください。
- 医師法に抵触するような断定的な健康効果の主張は避けてください。
- レシピは具体的（材料と分量、簡単な手順）に記述してください。
- 明るく、励ますようなトーンで回答してください。

# データ形式の定義
- **cuisine_region**: 料理のルーツとなる地域や国を記載してください。
  - 日本に馴染みのある国（日本、イタリア、フランス、中国、韓国、アメリカ、インドなど）の場合は、国名だけでなく地域名まで詳しく記載してください。（例: 「日本・長野」「イタリア・シチリア」「中国・四川」）
  - 日本に馴染みのない国や特定が難しい場合は、広域地域名で記載してください。（例: 「東南アジア」「地中海」「中東」）
- **ingredients**: 各食材の情報をオブジェクトの配列で記載してください。
  - name: 食材名
  - amount: 分量（必ず2人分で記載してください）
  - estimated_price: その食材の概算価格（日本円、例: "約100円"）。家庭にある調味料は "0円" または "家にあるもの" と記載可。
  - substitute: 代替食材（日本で入手困難な本格食材を使用する場合のみ、日本で購入可能な代替案を記載）。例: "レモン汁(大さじ1) + ショウガ薄切り"

{
  "message": "ユーザーへの励ましやアドバイス",
  "recipes": [
    {
      "name": "料理名",
      "time": "調理時間",
      "cuisine_region": "料理の地域・国",
      "calories": "カロリー (1人分)",
      "carbs": "糖質 (g) (1人分)",
      "fat": "脂質 (g) (1人分)",
      "protein": "タンパク質 (g) (1人分)",
      "salt": "塩分 (g) (1人分)",
      "ingredients": [
        { "name": "食材1", "amount": "分量", "estimated_price": "概算価格" },
        { "name": "食材2", "amount": "分量", "estimated_price": "概算価格", "substitute": "代替食材" }
      ],
      "steps": ["手順1", "手順2"],
      "estimated_cost": "材料費の概算（円）※調味料除く",
      "health_point": "このレシピの健康ポイント"
    }
  ]
}`;

export default {
    async fetch(request, env, ctx) {
        const origin = request.headers.get("Origin");
        let allowOrigin = null;

        if (ALLOWED_ORIGINS.includes(origin)) {
            allowOrigin = origin;
        } else if (!origin) {
            allowOrigin = null;
        }

        const corsHeaders = {
            "Access-Control-Allow-Origin": allowOrigin || "",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-User-Key",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: corsHeaders,
            });
        }

        if (request.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } });
        }

        try {
            const body = await request.json();
            const userKey = request.headers.get("X-User-Key");

            // --- DEBUG LOGGING ---
            console.log("Request received for provider:", body.provider);
            console.log("Has User Key:", !!userKey);
            console.log("Has GEMINI_API_KEY in env:", !!env.GEMINI_API_KEY);
            console.log("Has OPENAI_API_KEY in env:", !!env.OPENAI_API_KEY);
            // ---------------------

            // Determine Request Type
            if (body.drugName) {
                // --- DRUG NAVIGATOR LOGIC ---
                return await handleDrugNavigatorRequest(body, env, corsHeaders, userKey);
            } else {
                // --- RECIPE APP LOGIC ---
                return await handleRecipeAppRequest(body, env, corsHeaders, userKey);
            }

        } catch (e) {
            console.error("Worker Error:", e);

            // Handle Rate Limit specifically
            if (e.message.includes('429') || e.message.includes('Quota')) {
                return new Response(JSON.stringify({
                    error: "AIサービスの利用制限(429)です。しばらく待ってから再試行してください。",
                    details: e.message
                }), {
                    status: 429,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                });
            }

            // Return detailed error for debugging
            return new Response(JSON.stringify({
                error: e.message || "Internal Server Error",
                stack: e.stack,
                debug: {
                    hasGeminiEnv: !!env.GEMINI_API_KEY,
                    hasOpenAIEnv: !!env.OPENAI_API_KEY
                }
            }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            });
        }
    }
};

// --- HANDLERS ---



// --- SHIPMENT DATA LOGIC (Ported from drug-navigator) ---
const SPREADSHEET_ID = '1ZyjtfiRjGoV9xHSA5Go4rJZr281gqfMFW883Y7s9mQU';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

let cachedShipmentData = null;
let lastFetchTime = 0;

async function fetchShipmentData() {
    const now = Date.now();
    if (cachedShipmentData && (now - lastFetchTime < 3600 * 1000)) {
        return cachedShipmentData;
    }
    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) return [];
        const text = await response.text();
        const data = parseCsv(text);
        cachedShipmentData = data;
        lastFetchTime = now;
        return data;
    } catch (e) {
        return [];
    }
}

function parseCsv(csvText) {
    const rows = csvText.trim().split('\n');
    if (rows.length < 2) return [];
    return rows.slice(1).map(rowString => {
        const row = rowString.slice(1, -1).split('","');
        return {
            productName: row[5] || "",
            ingredientName: row[2] || "",
            status: row[11] || "不明",
            manufacturer: row[6] || "",
            yjCode: row[4] || "",
            dosageRoute: getDosageRoute(row[5] || "")
        };
    }).filter(i => i.productName);
}

function getDosageRoute(productName) {
    if (!productName) return '不明';
    if (productName.includes('錠') || productName.includes('カプセル') || productName.includes('散') || productName.includes('顆粒') || productName.includes('液') || productName.includes('OD')) return '経口';
    if (productName.includes('軟膏') || productName.includes('クリーム') || productName.includes('貼付') || productName.includes('ゲル') || productName.includes('ローション') || productName.includes('スプレー') || productName.includes('パッチ')) return '外用';
    if (productName.includes('注')) return '注射';
    if (productName.includes('点眼')) return '点眼';
    if (productName.includes('点鼻')) return '点鼻';
    if (productName.includes('坐剤') || productName.includes('座薬')) return '坐剤';
    return 'その他';
}

function normalizeString(str) {
    if (!str) return '';
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
        .replace(/\s+/g, '')
        .toLowerCase();
}

function searchShipmentList(list, keyword) {
    const normalizedKeyword = normalizeString(keyword);
    if (normalizedKeyword.length < 2) return [];
    return list.filter(item => {
        return normalizeString(item.productName).includes(normalizedKeyword) || normalizeString(item.ingredientName).includes(normalizedKeyword);
    });
}

function getShipmentStatusPriority(status) {
    if (!status) return 0;
    if (status.includes("通常出荷") || status.includes("通")) return 3;
    if (status.includes("限定出荷") || status.includes("出荷制限") || status.includes("限") || status.includes("制")) return 2;
    if (status.includes("供給停止") || status.includes("停止") || status.includes("停")) return -1;
    return 0;
}

// --- DRUG NAVIGATOR HANDLER ---

async function handleDrugNavigatorRequest(body, env, corsHeaders, userApiKeyFromHeader) {
    const { context, provider } = body;
    let { drugName } = body;
    const userApiKey = userApiKeyFromHeader; // Need to pass this from main

    if (!drugName || typeof drugName !== 'string') throw new Error("Drug name is required");

    // Sanitize
    drugName = drugName.replace(/[\r\n\x00-\x1F\x7F]/g, "").trim();
    const safeDrugName = drugName;

    // Context
    const contextStrings = [];
    if (context?.isChild) contextStrings.push("Patient is a CHILD (Needs Pediatric dosage/safety check)");
    if (context?.isPregnant) contextStrings.push("Patient is PREGNANT (Check FDA/Australia categories)");
    if (context?.isLactating) contextStrings.push("Patient is LACTATING (Breastfeeding)");
    if (context?.isRenal) contextStrings.push("Patient has RENAL IMPAIRMENT");
    const contextDesc = contextStrings.length > 0 ? contextStrings.join(", ") : "Adult, General";

    // Fetch Data
    const shipmentList = await fetchShipmentData();
    const directMatches = searchShipmentList(shipmentList, safeDrugName);
    const inputDosageRoute = directMatches.length > 0 ? directMatches[0].dosageRoute : '不明';
    const candidateNames = directMatches.map(item => item.productName).slice(0, 10);

    // Prompt
    const systemPrompt = `You are a professional pharmacist in Japan. 
Suggest 5 alternative ETHICAL medications (医療用医薬品) available in Japan.
Strictly check safety for the patient context: ${contextDesc}.
Input Drug: "${safeDrugName}" (Route: ${inputDosageRoute})
Existing Stock Matches: ${JSON.stringify(candidateNames)}

Format: JSON Array of objects with keys: drug_name, general_name, mechanism, safety_assessment, doctor_explanation, patient_explanation.
Response must be ONLY valid JSON.`;

    const userPrompt = `Suggest alternatives for "${safeDrugName}". Context: ${contextDesc}.`;

    // AI Call
    let aiSuggestions = [];

    // Determine Logic mainly for Gemini (Unified Rotation)
    // Note: Provider logic from recipe app:
    // User Key provided? -> Use it.
    // No User Key? -> Use System Key (env).

    let keyToUse = userApiKey;
    let usingSystemKey = false;

    if (provider === 'openai') {
        keyToUse = userApiKey || env.OPENAI_API_KEY;
    } else {
        // Gemini
        keyToUse = userApiKey || env.GEMINI_API_KEY;
        if (!userApiKey && env.GEMINI_API_KEY) usingSystemKey = true;
    }

    if (!keyToUse) throw new Error(`API Key missing for ${provider}`);

    if (provider === 'openai') {
        aiSuggestions = await callOpenAI(keyToUse, systemPrompt + "\n" + userPrompt); // Simplification using existing helper? 
        // existing callOpenAI takes (apiKey, userContent) where userContent is put in user role.
        // We should format it correctly.
        // Actually existing helper has hardcoded system prompt! usage: callOpenAI(apiKey, userContent)
        // We need to modify the helpers to accept system prompt or genericize them.

        // For now, let's create a generic helper or modify existing.
        // To avoid breaking recipe app, I will create new generic helpers or overload.
        aiSuggestions = await callOpenAIGeneric(keyToUse, systemPrompt, userPrompt);
    } else {
        // Gemini
        // Unified Rotation Logic
        const geminiKeys = getGeminiApiKeys(env, keyToUse);
        let lastError;

        // Retry Loop
        for (let i = 0; i < geminiKeys.length; i++) {
            try {
                // Call Generic Gemini
                aiSuggestions = await callGeminiGeneric(geminiKeys[i], systemPrompt, userPrompt);
                lastError = null;
                break;
            } catch (e) {
                lastError = e;
                if (e.message.includes('429') && i < geminiKeys.length - 1) {
                    continue;
                }
                throw e;
            }
        }
        if (lastError) throw lastError;
    }

    // Merge
    const finalResults = mergeWithStock(aiSuggestions, shipmentList, directMatches);
    return new Response(JSON.stringify({ alternatives: finalResults }), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
    });
}

function mergeWithStock(aiSuggestions, shipmentList, directMatches) {
    const map = new Map();
    const norm = (s) => normalizeString(s);

    if (Array.isArray(aiSuggestions)) {
        aiSuggestions.forEach(ai => {
            const key = norm(ai.drug_name);
            let stock = shipmentList.find(s => norm(s.productName) === key || norm(s.ingredientName) === key || norm(s.productName).includes(key));
            const status = stock ? stock.status : "不明";
            const priority = getShipmentStatusPriority(status);
            map.set(key, { ...ai, shipment_status: status, priority, yj_code: stock?.yjCode || "" });
        });
    }

    directMatches.forEach(stock => {
        const key = norm(stock.productName);
        if (!map.has(key)) {
            map.set(key, {
                drug_name: stock.productName,
                general_name: stock.ingredientName,
                mechanism: "同一成分・規格違い",
                safety_assessment: "⚠️ AI未評価",
                doctor_explanation: "在庫にありますがAI評価が生成されませんでした。",
                patient_explanation: "在庫のあるお薬です。",
                shipment_status: stock.status,
                yj_code: stock.yjCode,
                priority: getShipmentStatusPriority(stock.status) + 1
            });
        }
    });

    return Array.from(map.values())
        .filter(i => i.priority > 0)
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 15);
}


async function callGeminiGeneric(apiKey, systemPrompt, userPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    const requestBody = {
        contents: [{
            role: "user",
            parts: [{ text: systemPrompt + "\n\n" + userPrompt }]
        }],
        generationConfig: { response_mime_type: "application/json" }
    };
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    if (response.status === 429) throw new Error("429: Too Many Requests");
    if (data.error) {
        if (response.status === 404) {
            // Fallback to flash-1.5 if needed, but let's stick to simple for now or throw
            throw new Error("Model not found (404)");
        }
        throw new Error(data.error.message || "Gemini Error");
    }
    try {
        return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (e) {
        return [];
    }
}

async function callOpenAIGeneric(apiKey, systemPrompt, userPrompt) {
    const url = "https://api.openai.com/v1/chat/completions";
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
            response_format: { type: "json_object" }
        })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return JSON.parse(data.choices[0].message.content);
}


// --- REST OF RECIPE APP HANDLER ---
async function handleRecipeAppRequest(body, env, corsHeaders, userApiKeyFromHeader) {
    // INPUT VALIDATION (Security Fix)
    const MAX_INPUT_LENGTH = 2000;
    const fullContent = JSON.stringify(body);
    if (fullContent.length > MAX_INPUT_LENGTH) {
        return new Response(JSON.stringify({ error: "Request too large" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    if (body.symptoms && (!Array.isArray(body.symptoms))) {
        return new Response(JSON.stringify({ error: "Invalid parameters" }), { status: 400, headers: corsHeaders });
    }

    const userKey = userApiKeyFromHeader;
    const provider = body.provider || 'openai';

    let apiKey;
    let usingSystemKey = false;

    if (provider === 'gemini') {
        apiKey = userKey || env.GEMINI_API_KEY;
        if (!userKey && env.GEMINI_API_KEY) usingSystemKey = true;
    } else {
        apiKey = userKey || env.OPENAI_API_KEY;
        if (!userKey && env.OPENAI_API_KEY) usingSystemKey = true;
    }

    if (!apiKey) {
        throw new Error(`No API Key found for ${provider}`);
    }

    if (usingSystemKey) await new Promise(r => setTimeout(r, 2000));

    // Construct user prompt (Original logic)
    const symptomText = body.symptoms && body.symptoms.length > 0 ? body.symptoms.join("、") : "特になし";
    const ingredientText = body.ingredients && body.ingredients.filter(i => i).length > 0 ? body.ingredients.filter(i => i).join("、") : "おまかせ";
    const excludedText = body.excludedIngredients && body.excludedIngredients.filter(i => i).length > 0 ? body.excludedIngredients.filter(i => i).join("、") : "なし";
    const limitSupermarket = "【食材の制約】現地の本格的な食材を積極的に使用してください。ただし、日本で入手困難な食材には、必ず日本で購入可能な代替食材を提案してください（ingredientsにsubstituteを含める）。";
    const isCourse = body.time === 'コース';

    const defaultModeInstruction = `
# レシピ構成の指示
ユーザーの希望するジャンルに基づき、以下の3つのバリエーションを必ず含めて合計3つのレシピを提案してください。
1. 定番の味: 家庭的な王道レシピ。
2. おしゃれ: カフェやレストラン風の華やかなレシピ。
3. 変化球: 意外な組み合わせや新しい味付けのレシピ。
※出力内には「定番」等のカテゴリ名は表示しないでください。
※料理ジャンルが「アジア料理」の場合、日本・中華・韓国料理は含めず、東南アジアや中央アジア等の料理を中心に提案してください。
`;
    const courseInstruction = `
# 重要: フルコース提案の指示
- 調理時間に『コース』が選択されているため、その国の料理でコース形式のレシピを提案してください。
- **必ず全てのレシピの国を統一してください。**
- **可能であれば、同じ国の中の同じ地域のレシピで構成してください。**
- **コースの構成**:
  - レシピの品数や構成（前菜、スープ、メイン、デザート等）は固定せず、その国の食文化や慣習に合わせた適切な構成で提案してください（例: イタリア料理ならプリモ・セコンド等）。
  - 各レシピの「料理名 (name)」の先頭に、コース内での役割を【】で付記してください（例: 【前菜】季節のサラダ）。
- **味の重複禁止（重要）**: 特徴的な調味料や味付けを複数の料理で繰り返さず、味のバリエーションを重視してください。
- **食材の扱い**:
  - 【使いたい食材】は、コース全体のどこか1つのレシピに含まれていればよく、無理に全ての料理に含めないでください。
  - 【除外したい食材】は、全てのレシピで絶対に使用しないでください。
- **食前酒や食後の飲みものは含めないでください。**
- recipes配列には、提供順序に従って格納してください。
`;

    const modeSelectedInstruction = isCourse ? courseInstruction : defaultModeInstruction;

    const userContent = `
【体調・気になること】${symptomText}
【使いたい食材】${ingredientText}
【除外したい食材】${excludedText}
【ジャンル】${body.cuisine}
【希望調理時間】${body.time}
${limitSupermarket}

${modeSelectedInstruction}

# 追加指示
- 「estimated_cost」には、調味料（塩、砂糖、醤油、油、スパイス類など家に常備されているもの）を除いた、このレシピ（2人分）の材料費の概算（日本円）を算出・記載してください（例: "約800円"）。
`;

    let resultJson;

    if (provider === 'gemini') {
        const geminiKeys = getGeminiApiKeys(env, apiKey);
        let lastError;

        for (let i = 0; i < geminiKeys.length; i++) {
            try {
                console.log(`Attempting with Gemini Key ${i + 1}/${geminiKeys.length}`);
                resultJson = await callGemini(geminiKeys[i], userContent);
                lastError = null;
                break;
            } catch (e) {
                lastError = e;
                if (e.message.includes('429') && i < geminiKeys.length - 1) {
                    console.warn(`Key ${i + 1} hit rate limit. Switching to next key...`);
                    continue;
                }
                throw e;
            }
        }
        if (lastError) throw lastError;

    } else {
        resultJson = await callOpenAI(apiKey, userContent);
    }

    return new Response(JSON.stringify(resultJson), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
    });
}


/**
     * 複数のGemini APIキーを取得するヘルパー関数
     */
function getGeminiApiKeys(env, primaryKey) {
    const keys = [];
    if (primaryKey) keys.push(primaryKey);

    // GEMINI_API_KEY, GEMINI_API_KEY_1, GEMINI_API_KEY_2... と連番で探し出す
    if (env.GEMINI_API_KEY && !keys.includes(env.GEMINI_API_KEY)) {
        keys.push(env.GEMINI_API_KEY);
    }

    for (let i = 1; i <= 10; i++) {
        const keyName = `GEMINI_API_KEY_${i}`;
        if (env[keyName]) {
            keys.push(env[keyName]);
        } else {
            break; // 見つからなくなったら終了
        }
    }
    return keys;
}

async function callOpenAI(apiKey, userContent) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userContent }
            ],
            response_format: { type: "json_object" }
        })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    try {
        return JSON.parse(data.choices[0].message.content);
    } catch (e) {
        console.error("JSON Parse Error (OpenAI):", data.choices[0].message.content);
        throw new Error("Failed to parse AI response.");
    }
}

async function callGemini(apiKey, userContent) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [
                { text: SYSTEM_PROMPT },
                { text: userContent }
            ]
        }],
        generationConfig: {
            response_mime_type: "application/json"
        }
    };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // Explicitly handle 429
    if (response.status === 429) {
        throw new Error("429: Too Many Requests");
    }

    if (data.error) throw new Error(data.error.message || "Gemini API Error");

    try {
        const text = data.candidates[0].content.parts[0].text;
        return JSON.parse(text);
    } catch (e) {
        console.error("JSON Parse Error (Gemini):", data);
        throw new Error("Failed to parse AI response.");
    }
}
