import { Medication } from '@/types';

/**
 * YJコード3桁に基づくカテゴリランクを返す
 * 1. 抗生剤 (611-624)
 * 2. 抗ウイルス薬 (625)
 * 3. 抗アレルギー薬 (44)
 * 4. その他の薬効分類 (YJコード順)
 * 5. 漢方薬 (52)
 */
const getCategoryRank = (yjCode: string): number => {
  if (!yjCode || yjCode.startsWith('UNKNOWN')) return 40; // その他

  const prefix3 = yjCode.substring(0, 3);
  const prefix2 = yjCode.substring(0, 2);
  const prefix3Num = parseInt(prefix3, 10);

  // 1. 抗生剤 (611-624)
  if (prefix3Num >= 611 && prefix3Num <= 624) return 10;

  // 2. 抗ウイルス薬 (625)
  if (prefix3 === '625') return 20;

  // 3. 抗アレルギー薬 (44)
  if (prefix2 === '44') return 30;

  // 5. 漢方薬 (52)
  if (prefix2 === '52') return 50;

  // 4. その他 (薬効分類順)
  return 40;
};

export const fetchMedications = async (): Promise<Medication[]> => {
  try {
    const response = await fetch('/okuri_pakkun/meds_master.json');
    if (!response.ok) {
      throw new Error('Failed to fetch medication data');
    }
    const data: Medication[] = await response.json();

    // カスタムソート
    return data.sort((a, b) => {
      const rankA = getCategoryRank(a.yj_code);
      const rankB = getCategoryRank(b.yj_code);

      // まずカテゴリランクで比較
      if (rankA !== rankB) {
        return rankA - rankB;
      }

      // 同じカテゴリ内ならYJコード順
      return a.yj_code.localeCompare(b.yj_code);
    });
  } catch (error) {
    console.error('Error loading medications:', error);
    return [];
  }
};

export const searchMedications = (medications: Medication[], query: string): Medication[] => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  // 全角数字を半角に変換するなどの正規化も将来的には検討
  return medications.filter((med) =>
    med.brand_name.toLowerCase().includes(lowerQuery) ||
    med.yj_code.includes(query)
  );
};
