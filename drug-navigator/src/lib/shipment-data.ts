const SPREADSHEET_ID = '1ZyjtfiRjGoV9xHSA5Go4rJZr281gqfMFW883Y7s9mQU';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

export interface ShipmentInfo {
    productName: string;
    ingredientName: string;
    status: string; // '通常出荷', '限定出荷', '供給停止', etc.
    manufacturer: string;
    yjCode: string; // YJコード
    dosageRoute: string; // 投与経路 (例: '経口', '外用', '注射')
}

// 製品名から投与経路を推測する
export function getDosageRoute(productName: string): string {
    if (!productName) return '不明';

    if (productName.includes('錠') || productName.includes('カプセル') || productName.includes('散') || productName.includes('顆粒') || productName.includes('液') || productName.includes('OD')) {
        return '経口';
    }
    if (productName.includes('軟膏') || productName.includes('クリーム') || productName.includes('貼付') || productName.includes('ゲル') || productName.includes('ローション') || productName.includes('スプレー') || productName.includes('パッチ')) {
        return '外用';
    }
    if (productName.includes('注')) {
        return '注射';
    }
    if (productName.includes('点眼')) {
        return '点眼';
    }
    if (productName.includes('点鼻')) {
        return '点鼻';
    }
    if (productName.includes('坐剤') || productName.includes('座薬')) {
        return '坐剤';
    }
    return 'その他';
}

// 文字列の正規化（全角英数→半角、スペース削除、小文字化、カタカナはそのまま）
export function normalizeString(str: string): string {
    if (!str) return '';
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    })
        .replace(/\s+/g, '') // 空白削除
        .toLowerCase();
}

// キャッシュ変数
let cachedShipmentData: ShipmentInfo[] | null = null;
let lastFetchTime = 0;

export async function fetchShipmentData(): Promise<ShipmentInfo[]> {
    const now = Date.now();
    // 1時間キャッシュ
    if (cachedShipmentData && (now - lastFetchTime < 3600 * 1000)) {
        return cachedShipmentData;
    }

    try {
        console.log("Fetching Shipment CSV...");
        const response = await fetch(CSV_URL, { cache: 'no-store' });
        if (!response.ok) {
            console.error("Failed to fetch shipment data", response.status);
            return [];
        }
        const text = await response.text();
        const data = parseCsv(text);
        console.log(`Fetched ${data.length} rows.`);
        cachedShipmentData = data;
        lastFetchTime = now;
        return data;
    } catch (error) {
        console.error("Error fetching shipment CSV:", error);
        return [];
    }
}

function parseCsv(csvText: string): ShipmentInfo[] {
    const rows = csvText.trim().split('\n');
    if (rows.length < 2) return [];

    const dataRows = rows.slice(1);
    return dataRows.map(rowString => {
        // ダブルクォートで囲まれたCSVの簡易パース
        const row = rowString.slice(1, -1).split('","');

        return {
            productName: row[5] || "",
            ingredientName: row[2] || "",
            status: row[11] || "不明",
            manufacturer: row[6] || "",
            yjCode: row[4] || "",
            dosageRoute: getDosageRoute(row[5] || "") // productNameから投与経路を推測
        };
    });
}

export function getShipmentStatusPriority(status: string): number {
    if (!status) return 0; // 不明
    if (status.includes("通常出荷") || status.includes("通")) return 3; // High
    if (status.includes("限定出荷") || status.includes("出荷制限") || status.includes("限") || status.includes("制")) return 2; // Medium
    if (status.includes("供給停止") || status.includes("停止") || status.includes("停")) return -1; // Exclude
    return 0; // Others/Unknown
}

// 直接検索関数：入力されたキーワードを含む製品をリストから探す
export function searchShipmentList(list: ShipmentInfo[], keyword: string): ShipmentInfo[] {
    const normalizedKeyword = normalizeString(keyword);
    if (normalizedKeyword.length < 2) return []; // 1文字だとヒットしすぎるので除外

    return list.filter(item => {
        const prod = normalizeString(item.productName);
        const ing = normalizeString(item.ingredientName);
        // 部分一致
        return prod.includes(normalizedKeyword) || ing.includes(normalizedKeyword);
    });
}