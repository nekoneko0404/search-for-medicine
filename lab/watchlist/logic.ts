import { normalizeString } from '../../js/utils';

/**
 * YJコードからルート（内/注/外）を判定する
 */
export function getRouteFromYJCode(yjCode: string | number | null): string | null {
    if (!yjCode) return null;
    const yjStr = String(yjCode);
    if (yjStr.length < 5) return null;
    const digit = parseInt(yjStr.charAt(4));
    if (isNaN(digit)) return null;
    if (digit >= 0 && digit <= 3) return '内';
    if (digit >= 4 && digit <= 6) return '注';
    if (digit >= 7 && digit <= 9) return '外';
    return null;
}

/**
 * 検索クエリを正規化し、包含・除外キーワードに分割する
 */
export function processQuery(query: string) {
    if (!query) return { include: [], exclude: [] };
    const terms = query.split(/[\s　]+/).filter(t => t.length > 0);
    const include: string[] = [];
    const exclude: string[] = [];
    terms.forEach(term => {
        if ((term.startsWith('ー') || term.startsWith('-') || term.startsWith('－')) && term.length > 1) {
            exclude.push(normalizeString(term.substring(1)));
        } else {
            include.push(normalizeString(term));
        }
    });
    return { include, exclude };
}

/**
 * データをYJコード上9桁ごとに集計する（周辺品目の供給状況を算出するため）
 */
export function summarizeBy9DigitYJ(allFilteredData: any[]) {
    const summary: Record<string, { normal: number, limited: number, stopped: number }> = {};

    allFilteredData.forEach(item => {
        if (!item.yjCode) return;
        const yj9 = String(item.yjCode).substring(0, 9);
        if (!summary[yj9]) {
            summary[yj9] = { normal: 0, limited: 0, stopped: 0 };
        }

        const s = (item.shipmentStatus || '').trim();
        if (s.includes('通常') || s.includes('通')) {
            summary[yj9].normal++;
        } else if (s.includes('限定') || s.includes('制限') || s.includes('限') || s.includes('制')) {
            summary[yj9].limited++;
        } else if (s.includes('停止') || s.includes('停')) {
            summary[yj9].stopped++;
        }
    });

    return summary;
}

/**
 * 出荷ステータスが選択された区分に一致するか判定する
 */
export function matchStatusFilter(itemStatus: string, selectedStatuses: string[]): boolean {
    const s = (itemStatus || '').trim();
    if (s === 'データなし') return true;

    if (selectedStatuses.includes('通常出荷') && (s.includes('通常') || s.includes('通'))) return true;
    if (selectedStatuses.includes('限定出荷') && (s.includes('限定') || s.includes('制限') || s.includes('限') || s.includes('制'))) return true;
    if (selectedStatuses.includes('供給停止') && (s.includes('停止') || s.includes('停'))) return true;

    return false;
}

/**
 * データを成分・区分ごとにグループ化する（サマリー表示用 - 必要に応じて残すが、今回は9桁YJが主）
 */
export function groupDataByIngredient(data: any[]) {
    const grouped: Record<string, any> = {};
    data.forEach(item => {
        const ingredient = item.ingredientName || '不明';
        const route = item.route || '-';
        const groupKey = `${ingredient}|${route}`;

        if (!grouped[groupKey]) {
            grouped[groupKey] = {
                ingredientName: ingredient,
                route: route,
                category: item.category,
                yjCode9: item.yjCode ? String(item.yjCode).substring(0, 9) : null,
                counts: { normal: 0, limited: 0, stopped: 0 },
                hasChanges: false,
                hasRestored: false
            };
        }

        const status = (item.shipmentStatus || '').trim();
        if (status.includes('通常') || status.includes('通')) {
            grouped[groupKey].counts.normal++;
        } else if (status.includes('限定') || status.includes('制限') || status.includes('限') || status.includes('制')) {
            grouped[groupKey].counts.limited++;
        } else if (status.includes('停止') || status.includes('停')) {
            grouped[groupKey].counts.stopped++;
        }

        if (item.isStatusChanged) {
            grouped[groupKey].hasChanges = true;
            if (item.isRestored) grouped[groupKey].hasRestored = true;
        }
    });
    return grouped;
}
