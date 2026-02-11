import { NextRequest, NextResponse } from "next/server";
import { fetchShipmentData, getShipmentStatusPriority, ShipmentInfo, normalizeString, searchShipmentList } from "@/lib/shipment-data";

export const runtime = 'edge';
// Trigger redeploy to apply new environment variables

// Types
type SuggestionItem = {
    drug_name: string;
    general_name: string;
    mechanism: string;
    safety_assessment: string;
    doctor_explanation: string;
    patient_explanation: string;
};

// Main API Handler
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { context, provider } = body;
        let { drugName } = body;
        const userApiKey = req.headers.get("X-User-Key");

        // 1. Input Validation
        if (!drugName || typeof drugName !== 'string') {
            return NextResponse.json({ error: "Drug name is required" }, { status: 400 });
        }
        if (drugName.length > 50) {
            return NextResponse.json({ error: "Drug name too long (max 50 chars)" }, { status: 400 });
        }

        // Strict Context Validation
        if (context) {
            if (typeof context !== 'object') return NextResponse.json({ error: "Invalid context format" }, { status: 400 });
            // Check known keys if strict validation is needed, but for now type check is minimal
        }

        // Sanitize
        drugName = drugName.replace(/[\r\n\x00-\x1F\x7F]/g, "").trim();
        const safeDrugName = drugName;

        // Context check
        const contextStrings = [];
        if (context.isChild) contextStrings.push("Patient is a CHILD (Needs Pediatric dosage/safety check)");
        if (context.isPregnant) contextStrings.push("Patient is PREGNANT (Check FDA/Australia categories)");
        if (context.isLactating) contextStrings.push("Patient is LACTATING (Breastfeeding)");
        if (context.isRenal) contextStrings.push("Patient has RENAL IMPAIRMENT");
        const contextDesc = contextStrings.length > 0 ? contextStrings.join(", ") : "Adult, General";

        // 2. Fetch Shipment Data & Match
        // Note: fetchShipmentData uses 'fetch' internally, compatible with Edge
        const shipmentList = await fetchShipmentData();
        const directMatches = searchShipmentList(shipmentList, safeDrugName);

        const inputDosageRoute = directMatches.length > 0 ? directMatches[0].dosageRoute : '不明';
        const candidateNames = directMatches.map(item => item.productName).slice(0, 10);

        // 3. Prepare Prompt
        const systemPrompt = `You are a professional pharmacist in Japan. 
Suggest 5 alternative ETHICAL medications (医療用医薬品) available in Japan.
Strictly check safety for the patient context: ${contextDesc}.
Input Drug: "${safeDrugName}" (Route: ${inputDosageRoute})
Existing Stock Matches: ${JSON.stringify(candidateNames)}

Format: JSON Array of objects with keys: drug_name, general_name, mechanism, safety_assessment, doctor_explanation, patient_explanation.
Response must be ONLY valid JSON.`;

        const userPrompt = `Suggest alternatives for "${safeDrugName}". Context: ${contextDesc}.`;

        // 4. Call AI (REST API)
        let aiSuggestions: SuggestionItem[] = [];
        const apiKey = userApiKey || (provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.GEMINI_API_KEY) || "";

        if (!apiKey) {
            // Using specifically descriptive error for configuration issues to help identifying environment setup problems
            console.error("API Key not found. Provider:", provider, "Preview Env:", !!process.env.CF_PAGES);
            const missingKeyName = (provider === 'openai' ? "OPENAI_API_KEY" : "GEMINI_API_KEY");
            return NextResponse.json({
                error: `サーバーの設定エラー: ${missingKeyName} が設定されていません。Cloudflareの環境変数設定を確認してください。自身のAPIキーをお持ちの場合は詳細設定から入力して回避できます。`
            }, { status: 500 });
        }

        try {
            if (provider === 'gemini' || (!provider || provider === 'system')) {
                // Use Gemini (Default)
                // Use env key if system, or user key if provided
                const keyToUse = userApiKey || process.env.GEMINI_API_KEY;
                if (!keyToUse) throw new Error("Gemini API Key missing");

                aiSuggestions = await callGeminiREST(keyToUse, systemPrompt, userPrompt);
            } else if (provider === 'openai') {
                // Use OpenAI
                if (!userApiKey && !process.env.OPENAI_API_KEY) throw new Error("OpenAI API Key missing");
                aiSuggestions = await callOpenAIREST(userApiKey || process.env.OPENAI_API_KEY || "", systemPrompt, userPrompt);
            }
        } catch (e: any) {
            console.error("AI Call Failed:", e);
            // Handle common error codes
            if (e.message.includes('429')) {
                return NextResponse.json({ error: "AI利用制限(429)を超過しました。しばらく待つか、設定から自分のAPIキーを使用してください。" }, { status: 429 });
            }
            // SANITIZED ERROR MESSAGE
            return NextResponse.json({ error: "AI processing failed." }, { status: 500 });
        }

        // 5. Merge with Stock Data
        const finalResults = mergeWithStock(aiSuggestions, shipmentList, directMatches);

        return NextResponse.json({ alternatives: finalResults });

    } catch (error: any) {
        console.error("Route Error:", error);
        // SANITIZED ERROR MESSAGE
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// --- Helper Functions ---

async function callGeminiREST(apiKey: string, systemPrompt: string, userPrompt: string): Promise<SuggestionItem[]> {
    const model = 'gemini-3-flash-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const body = {
        contents: [{
            role: "user",
            parts: [
                { text: systemPrompt + "\n\n" + userPrompt }
            ]
        }],
        generationConfig: {
            response_mime_type: "application/json"
        }
    };

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        // Fallback for 404 (model not found) -> try old flash
        if (res.status === 404) {
            return callGeminiRESTFallback(apiKey, systemPrompt, userPrompt, 'gemini-1.5-flash');
        }
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Gemini Error ${res.status}`);
    }

    const data = await res.json();
    try {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty response");
        return parseJSON(text);
    } catch (e) {
        console.error("Gemini Parse Error", data);
        return [];
    }
}

async function callGeminiRESTFallback(apiKey: string, systemPrompt: string, userPrompt: string, model: string): Promise<SuggestionItem[]> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    // Same body logic
    const body = { contents: [{ role: "user", parts: [{ text: systemPrompt + "\n" + userPrompt }] }] };
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Fallback Gemini Error ${res.status}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return parseJSON(text);
}

async function callOpenAIREST(apiKey: string, systemPrompt: string, userPrompt: string): Promise<SuggestionItem[]> {
    const url = "https://api.openai.com/v1/chat/completions";
    const body = {
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
    };

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `OpenAI Error ${res.status}`);
    }

    const data = await res.json();
    try {
        const text = data.choices[0].message.content;
        return parseJSON(text);
    } catch (e) {
        console.error("OpenAI Parse Error", data);
        return [];
    }
}

function parseJSON(text: string): any[] {
    try {
        // Try direct parse
        return JSON.parse(text);
    } catch {
        // Try extract json block
        const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/{[\s\S]*}/);
        if (match) {
            const inner = match[1] || match[0];
            const parsed = JSON.parse(inner);
            // Handle wrappers
            if (parsed.alternatives) return parsed.alternatives;
            if (Array.isArray(parsed)) return parsed;
            return [];
        }
    }
    return [];
}

function mergeWithStock(aiSuggestions: any[], shipmentList: ShipmentInfo[], directMatches: ShipmentInfo[]) {
    const map = new Map();
    const norm = (s: string) => normalizeString(s);

    // AI suggestions
    if (Array.isArray(aiSuggestions)) {
        aiSuggestions.forEach(ai => {
            const key = norm(ai.drug_name);
            let stock = shipmentList.find(s => norm(s.productName) === key || norm(s.ingredientName) === key || norm(s.productName).includes(key));

            const status = stock ? stock.status : "不明";
            const priority = getShipmentStatusPriority(status);

            map.set(key, { ...ai, shipment_status: status, priority, yj_code: stock?.yjCode || "" });
        });
    }

    // Direct Matches (Ensure they are included)
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
                priority: getShipmentStatusPriority(stock.status) + 1 // High priority
            });
        }
    });

    return Array.from(map.values())
        .filter((i: any) => i.priority > 0)
        .sort((a: any, b: any) => b.priority - a.priority)
        .slice(0, 15);
}