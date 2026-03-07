export interface Env {
    DB: D1Database;
}

/**
 * CSVの1行をパースする（引用符対応）
 */
function parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = "";
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

/**
 * マスタデータをD1にインポートする
 * 
 * @param csvText CSVデータの文字列
 * @param env Cloudflare Workersの環境オブジェクト
 */
export async function importMasterData(csvText: string, env: Env) {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return { success: true, count: 0 };

    // ヘッダーをスキップ
    const rows = lines.slice(1);

    // メモリ効率のため、有効なデータのみを抽出する一時マップ（レセ -> YJ）
    // 同じレセ電算コードがあれば最新の更新年月日を優先
    const mapping = new Map<string, { yj: string, date: string }>();

    for (const line of rows) {
        const cols = parseCsvLine(line);
        if (cols.length < 24) continue;

        const yjCode = cols[6].trim();    // 第7列: 薬価基準 (12桁)
        const receiptCode = cols[8].trim(); // 第9列: レセ電算 (9桁)
        const updateType = cols[22].trim(); // 第23列: 更新区分
        const updateDate = cols[23].trim(); // 第24列: 更新年月日

        // 有効なコードであり、かつ廃止(4)でないものを対象
        if (yjCode.length === 12 && receiptCode.length === 9 && updateType !== '4') {
            const existing = mapping.get(receiptCode);
            if (!existing || updateDate >= existing.date) {
                mapping.set(receiptCode, { yj: yjCode, date: updateDate });
            }
        }
    }

    // D1 へのバッチ挿入
    const statements: D1PreparedStatement[] = [];
    const BATCH_SIZE = 1000; // D1のサブリクエスト制限回避のため拡大

    let count = 0;
    for (const [receiptCode, info] of mapping.entries()) {
        statements.push(
            env.DB.prepare(
                "INSERT INTO code_mappings (receipt_code, yj_code, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(receipt_code) DO UPDATE SET yj_code = EXCLUDED.yj_code, updated_at = CURRENT_TIMESTAMP"
            ).bind(receiptCode, info.yj)
        );
        count++;

        if (statements.length >= BATCH_SIZE) {
            await env.DB.batch(statements);
            statements.length = 0;
        }
    }

    if (statements.length > 0) {
        await env.DB.batch(statements);
    }

    return { success: true, count };
}
