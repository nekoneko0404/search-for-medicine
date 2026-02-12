import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { fetchShipmentData, getShipmentStatusPriority, ShipmentInfo, normalizeString, searchShipmentList } from "@/lib/shipment-data";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { context } = body;
    let { drugName } = body;

    // 0. Input Validation & Sanitization
    if (typeof drugName !== 'string') {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Truncate to 30 chars to prevent token exhaustion / DoS
    drugName = drugName.slice(0, 30);

    // Remove newlines and control characters to mitigate prompt injection
    drugName = drugName.replace(/[\r\n\x00-\x1F\x7F]/g, "");

    // Properly escape for usage inside a double-quoted string in the prompt
    // JSON.stringify handles backslashes and quotes correctly.
    // We slice(1, -1) to remove the surrounding quotes added by JSON.stringify
    drugName = JSON.stringify(drugName).slice(1, -1);

    if (!drugName.trim()) {
       return NextResponse.json({ error: "Drug name is required" }, { status: 400 });
    }

    const contextStrings = [];
    if (context.isChild) contextStrings.push("Patient is a CHILD (Pediatric dosage/safety required)");
    if (context.isPregnant) contextStrings.push("Patient is PREGNANT");
    if (context.isLactating) contextStrings.push("Patient is LACTATING (Breastfeeding)");
    if (context.isRenal) contextStrings.push("Patient has RENAL IMPAIRMENT");

    const contextDesc = contextStrings.length > 0 ? contextStrings.join(", ") : "Adult, no specific conditions";

    // 1. Fetch Shipment Data
    const shipmentList = await fetchShipmentData();

    // 2. Direct Search from CSV (Target Identification)
    // Find stock items that match the user input (e.g. "ロキソニン" -> "ロキソニン錠60mg", "ロキソニン細粒")
    const directMatches = searchShipmentList(shipmentList, drugName);
    
    // Determine the dosage route of the input drug
    const inputDosageRoute = directMatches.length > 0 ? directMatches[0].dosageRoute : '不明';

    // Prepare names for AI to evaluate
    // We pass the EXACT stock names to the AI to ensure linkage
    let candidateNames = directMatches.map(item => item.productName);
    
    // Limit to avoid token overflow
    candidateNames = candidateNames.slice(0, 10);

    // 3. AI Prompt
    const prompt = "You are an expert pharmacist in Japan.\n" +
      `Target Drug Input: "${drugName}"\n` +
      `Input Dosage Route: "${inputDosageRoute}"\n` +
      `Patient Context: ${contextDesc}\n\n` +
      "Task: Suggest alternative **ETHICAL** medications (医療用医薬品) available in Japan.\n\n" +
      "I have found the following specific products in our STOCK that match the input:\n" +
      "LIST A (STOCK DIRECT MATCHES):\n" +
      `[${candidateNames.map(name => JSON.stringify(name)).join(", ")}]\n\n` +
      "INSTRUCTIONS:\n" +
      "Use the following criteria and reference materials for safety assessment: 添付文書 (Package Insert), FDA薬剤胎児危険度分類基準 (https://boku-clinic.com/pdf/d3.pdf), オーストラリア基準, 虎ノ門病院の基準, 国立成育医療研究センター「授乳中に安全に使用できると思われる薬」 (https://www.ncchd.go.jp/kusuri/lactation/druglist_yakkou.html), 母乳とくすりハンドブック, 日本腎臓病薬物療法学会「腎機能低下時の薬剤投与量一覧」(https://www.jsnp.org/files/dosage_recommendations_38.pdf) 等.\n\n" +
      "1. **EVALUATE LIST A (MANDATORY)**:\n" +
      "   - You **MUST** output a JSON object for **EVERY SINGLE ITEM** in LIST A.\n" +
      "   - Check the \"Patient Context\" against each drug.\n" +
      "   - **CRITICAL SAFETY CHECK:**\n" +
      "     - If the drug is contraindicated or requires extreme caution for the specific \"Patient Context\" (e.g., PREGNANT, LACTATING, CHILD, RENAL IMPAIRMENT) based on the reference materials, mark \"safety_assessment\" as \"**❌ CONTRAINDICATED (禁忌)**\" or \"**⚠️ CAUTION (要注意)**\".\n" +
      "     - Provide a clear, specific, and concise \"doctor_explanation\" detailing *why* it's contraindicated/cautious, referencing the relevant criteria (e.g., \"妊娠中の使用は胎児に影響を及ぼす可能性があるため禁忌 [FDA分類C]\", \"腎機能低下患者では代謝遅延により副作用増強の恐れ [JSNPガイドライン]\").\n" +
      "     - Provide a simple and understandable \"patient_explanation\" for the safety concern.\n" +
      "   - **If the drug is considered safe** for the \"Patient Context\", mark \"safety_assessment\" as \"**✅ SAFE (安全)**\" or \"**△ CAUTION (要確認)**\" if minor concerns exist, and explain why.\n" +
      "   - **DO NOT EXCLUDE** these items just because they are unsafe. You must include them to warn the user.\n\n" +
      "2. **SUGGEST ALTERNATIVES (LIST B)**:\n" +
      "   - Suggest 15 other safe(r) alternative ethical drugs (Generics or different chemical class).\n" +
      "   - **Priority:**\n" +
      "     - **Highest Priority:** Prioritize alternative drugs with the same active ingredient as Target Drug Input and favorable shipment status (Normal Shipment > Limited Shipment).\n" +
      "     - If multiple products with the same active ingredient exist, select one from a major manufacturer and format it as \"Product Name (Other manufacturers available)\" in the `drug_name` field.\n" +
      "     - **Secondary Priority:** Suggest alternative drugs with different active ingredients whose efficacy and indications are identical or similar to Target Drug Input according to package inserts, and whose YJ code (first 3 or 4 digits indicating therapeutic category) is identical or similar to that of Target Drug Input.\n" +
      "   - **STRICTLY adhere to the \"Input Dosage Route\". Only suggest drugs with the same dosage route.\n" +
      "   - **Matching Therapeutic Category:** Only suggest drugs from the same therapeutic category as Target Drug Input. Do not suggest drugs from different categories (e.g., do not suggest cough medicine for pain relief). Select alternative drugs that fulfill the efficacy and indications of Target Drug Input.\n" +
      "   - **Shipment Status:** Do not suggest drugs with \"Shipment Stopped\" or \"Supply Stopped\" status. Prioritize \"Normal Shipment\" as much as possible, followed by \"Limited Shipment\".\n" +
      "   - No OTC.\n\n" +
      "Output JSON:\n" +
      "[" +
      "  {\n" +
      "    \"drug_name\": \"string\", // Copy exact name from LIST A if applicable, or new name for LIST B\n" +
      "    \"general_name\": \"string\",\n" +
      "    \"mechanism\": \"string\",\n" +
      "    \"safety_assessment\": \"string\", // e.g. \"❌ 禁忌 (添付文書)\", \"✅ 安全 (虎ノ門基準)\"\n" +
      "    \"doctor_explanation\": \"string\", // Specific clinical reasoning\n" +
      "    \"patient_explanation\": \"string\"\n" +
      "  }\n" +
      "]\n" +
      "`;"

    // 4. Generate AI Content
    let aiSuggestions: any[] = [];
    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        try {
            aiSuggestions = JSON.parse(responseText);
        } catch {
             const match = responseText.match(new RegExp("`json\n([\s\S]*)\n`"));
             if (match) aiSuggestions = JSON.parse(match[1]);
        }
        if (aiSuggestions && !Array.isArray(aiSuggestions) && (aiSuggestions as any).alternatives) {
            aiSuggestions = (aiSuggestions as any).alternatives;
        }
    } catch (e: any) {
        console.error("AI Generation failed", e);
        // Handle Gemini Quota Limit (429)
        if (e.toString().includes("429") || e.message?.includes("429") || e.status === 429) {
            return NextResponse.json(
                { error: "無料版の利用枠を超過したため、現在AI機能を利用できません。時間を置くか、明日以降再度お試しください。" }, 
                { status: 429 }
            );
        }
    }

    if (!Array.isArray(aiSuggestions)) aiSuggestions = [];

    // 5. Merge Logic (Crucial Step)
    const finalResultsMap = new Map();

    // Helper to normalize for matching
    const norm = (s: string) => normalizeString(s);

    // First, process AI suggestions
    aiSuggestions.forEach((aiItem: any) => {
        // Try to link AI suggestion to Stock Data
        // 1. Exact Name Match?
        let stockItem = findShipmentInfo(shipmentList, aiItem.drug_name);
        
        // 2. If not found, try to match against Direct Matches (List A) using fuzzy logic
        //    (AI might have shortened "ロキソニン錠６０ｍｇ" to "ロキソニン錠")
        if (!stockItem) {
            stockItem = directMatches.find(dm => 
                norm(dm.productName).includes(norm(aiItem.drug_name)) || 
                norm(aiItem.drug_name).includes(norm(dm.productName))
            );
        }
        
        // 3. If still not found, search general shipment list
        if (!stockItem && aiItem.general_name) {
             stockItem = findShipmentInfo(shipmentList, aiItem.general_name);
        }

        const status = stockItem ? stockItem.status : "不明";
        const yjCode = stockItem ? stockItem.yjCode : "";
        const priority = getShipmentStatusPriority(status);
        const officialName = stockItem ? stockItem.productName : aiItem.drug_name;

        const mergedItem = {
            ...aiItem,
            drug_name: officialName,
            shipment_status: status,
            yj_code: yjCode,
            priority: priority
        };

        // Key for deduplication
        finalResultsMap.set(norm(officialName), mergedItem);
    });

    // Second, Force-Add Direct Matches (List A) if AI forgot them
    // But this time, use a Default "Warning" template if AI missed it, 
    // to prompt user to check manually, but ideally AI catches it.
    directMatches.forEach(stockItem => {
        const key = norm(stockItem.productName);
        if (!finalResultsMap.has(key)) {
            // AI missed this stock item. Add it with fallback text.
            finalResultsMap.set(key, {
                drug_name: stockItem.productName,
                general_name: stockItem.ingredientName,
                mechanism: "同一成分・規格違い (AI未評価)",
                safety_assessment: "⚠️ AI評価エラー - 安全性を確認してください", 
                doctor_explanation: "在庫リストにありますが、AIによる詳細評価が生成されませんでした。添付文書を確認してください。",
                patient_explanation: "在庫のあるお薬です。",
                shipment_status: stockItem.status,
                yj_code: stockItem.yjCode,
                priority: getShipmentStatusPriority(stockItem.status) + 2 // Keep high priority so it's seen
            });
        }
    });

    // 6. Filter and Sort
    const finalList = Array.from(finalResultsMap.values())
        .filter((item: any) => item.priority > 0) // Exclude stopped/unknown
        .sort((a: any, b: any) => b.priority - a.priority)
        .slice(0, 15); 

    return NextResponse.json({ alternatives: finalList });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}

function findShipmentInfo(list: ShipmentInfo[], query: string): ShipmentInfo | undefined {
    if (!query) return undefined;
    const q = normalizeString(query);
    return list.find(item => {
        const prod = normalizeString(item.productName);
        const ing = normalizeString(item.ingredientName);
        return prod === q || ing === q || prod.includes(q); 
    });
}