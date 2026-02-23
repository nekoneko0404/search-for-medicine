
import { PHARMA_CLASSIFICATION_MAP } from './pharma_classification.js';

export const DRUG_CATEGORIES = {
    antibiotics: "抗生剤",
    antiviral: "抗ウイルス",
    respiratory: "呼吸器・鎮咳",
    allergy: "抗アレルギー",
    cns: "神経・てんかん",
    antipyretic: "解熱鎮痛",
    gi: "消化器・整腸",
    others: "その他・漢方"
};

export const YJ_CATEGORY_MAP = {
    '1139': '抗てんかん剤', '1141': '解熱鎮痛剤', '1190': '入眠改善剤',
    '2223': '鎮咳剤', '2233': '去痰剤', '2249': '鎮咳去痰剤',
    '2251': '気管支拡張剤', '2259': '気管支拡張剤', '2316': '整腸剤',
    '2399': '制吐剤', '4413': '抗ヒスタミン剤', '4419': '抗ヒスタミン剤',
    '4490': '抗アレルギー剤', '5200': '漢方製剤', '6131': 'ペニシリン系',
    '6132': 'セフェム系', '6139': '配合ペニシリン系', '6141': 'マクロライド系',
    '6149': 'マクロライド系', '6152': 'テトラサイクリン系', '6241': 'ニューキノロン系',
    '6250': '抗ウイルス剤', '3327': '抗プラスミン剤'
};

export const STANDARD_WEIGHTS = [{ "age": 0, "month": 0, "w": 3 }, { "age": 0, "month": 1, "w": 4.2 }, { "age": 0, "month": 2, "w": 5.3 }, { "age": 0, "month": 3, "w": 6.2 }, { "age": 0, "month": 4, "w": 6.9 }, { "age": 0, "month": 5, "w": 7.5 }, { "age": 0, "month": 6, "w": 7.9 }, { "age": 0, "month": 7, "w": 8.3 }, { "age": 0, "month": 8, "w": 8.6 }, { "age": 0, "month": 9, "w": 8.9 }, { "age": 0, "month": 10, "w": 9.2 }, { "age": 0, "month": 11, "w": 9.4 }, { "age": 1, "month": 0, "w": 9.6 }, { "age": 1, "month": 6, "w": 10.7 }, { "age": 2, "month": 0, "w": 12 }, { "age": 3, "month": 0, "w": 14 }, { "age": 4, "month": 0, "w": 16 }, { "age": 5, "month": 0, "w": 18.5 }, { "age": 6, "month": 0, "w": 21 }, { "age": 7, "month": 0, "w": 24 }, { "age": 8, "month": 0, "w": 27 }, { "age": 9, "month": 0, "w": 30.5 }, { "age": 10, "month": 0, "w": 34 }, { "age": 11, "month": 0, "w": 38 }, { "age": 12, "month": 0, "w": 43 }, { "age": 13, "month": 0, "w": 49 }, { "age": 14, "month": 0, "w": 54 }, { "age": 15, "month": 0, "w": 58 }];

export function getPharmaClass(yjCode) {
    if (!yjCode || yjCode.length < 3) return null;
    const category = yjCode.substring(0, 3);
    return PHARMA_CLASSIFICATION_MAP[category] || null;
}

export const PEDIATRIC_DRUGS = [
    {
        "id": "amoxicillin-group",
        "name": "サワシリン／アモキシシリン (規格選択)",
        "brandName": "サワシリン",
        "yjCode": "6131001C1210",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6131001C1210",
        "potency": 100,
        "hasSubOptions": true,
        "subOptions": [
            {
                "id": "amox-10",
                "label": "10%細粒",
                "potency": 100
            },
            {
                "id": "amox-20",
                "label": "20%細粒 (ワイドシリン等)",
                "potency": 200
            }
        ],
        "piSnippetSource": "通常1日20〜40mg(力価)/kgを3〜4回に分割経口投与する。なお、年齢、症状により適宜増減するが、1日量として最大90mg(力価)/kgを超えないこと。",
        "dosage": {
            "minMgKg": 20,
            "maxMgKg": 40,
            "absoluteMaxMgKg": 90,
            "absoluteMaxMgPerDay": 2000,
            "absoluteMaxMinMgPerDay": 750,
            "note": "1日20〜40mg/kgを3〜4回。通常最大90mg/kg。成人最大2000mg。"
        },
        "piSnippet": "通常1日20〜40mg(力価)/kgを3〜4回に分割経口投与する。なお、年齢、症状により適宜増減するが、1日量として最大90mg(力価)/kgを超えないこと。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6131008C1033",
        "name": "ユナシン／スルタミシリン 10%",
        "brandName": "ユナシン",
        "yjCode": "6131008C1033",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6131008C1033",
        "potency": 100,
        "piSnippetSource": "通常小児に対しスルタミシリンとして、1日量15〜30mg(力価)/kgを3回に分割して経口投与する。なお、年齢、症状により適宜増減する。",
        "dosage": {
            "minMgKg": 15,
            "maxMgKg": 30,
            "absoluteMaxMgPerDay": 1125,
            "note": "通常1日15〜30mg/kgを3回。最大1125mg(375mg×3)/日。"
        },
        "piSnippet": "通常小児に対しスルタミシリンとして、1日量15〜30mg(力価)/kgを3回に分割して経口投与する。なお、年齢、症状により適宜増減する。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6139100R1036",
        "name": "クラバモックス小児用配合ドライシロップ",
        "yjCode": "6139100R1036",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6139100R1036",
        "potency": 42.9,
        "calcType": "weight-step",
        "weightSteps": [
            {
                "weightMin": 6,
                "weightMax": 11,
                "dose": 1.01,
                "unit": "g",
                "label": "6〜10kg: 1.01g"
            },
            {
                "weightMin": 11,
                "weightMax": 17,
                "dose": 2.02,
                "unit": "g",
                "label": "11〜16kg: 2.02g"
            },
            {
                "weightMin": 17,
                "weightMax": 24,
                "dose": 3.03,
                "unit": "g",
                "label": "17〜23kg: 3.03g"
            },
            {
                "weightMin": 24,
                "weightMax": 31,
                "dose": 4.04,
                "unit": "g",
                "label": "24〜30kg: 4.04g"
            },
            {
                "weightMin": 31,
                "weightMax": 37,
                "dose": 5.05,
                "unit": "g",
                "label": "31〜36kg: 5.05g"
            },
            {
                "weightMin": 37,
                "weightMax": 40,
                "dose": 6.06,
                "unit": "g",
                "label": "37〜39kg: 6.06g"
            }
        ],
        "dosage": {
            "timesPerDay": 2,
            "hidePerTime": true,
            "note": "1日量を12時間ごと(1日2回)に投与。添付文書の分包用量表に準拠。"
        },
        "piSnippetSource": "通常、1日96.4mg/kgを2回に分けて経口投与。分包製剤(パウチ)の場合は体重区分(6-10kg, 11-16kg等)ごとの固定量を投与する。",
        "piSnippet": "通常、1日96.4mg/kgを2回に分けて経口投与。分包製剤(パウチ)の場合は体重区分(6-10kg, 11-16kg等)ごとの固定量を投与する。",
        "category": "antibiotics"
    },

    {
        "id": "yj-6132005C1053",
        "name": "ケフラール／セファクロル 10%",
        "brandName": "ケフラール",
        "yjCode": "6132005C1053",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6132005C1053",
        "potency": 100,
        "piSnippetSource": "通常1日20〜40mg/kgを3回。重症等の場合は1日100mg/kgまで。",
        "dosage": {
            "minMgKg": 20,
            "maxMgKg": 40,
            "absoluteMaxMgKg": 100,
            "absoluteMaxMgPerDay": 1500,
            "absoluteMaxMinMgPerDay": 750,
            "note": "通常1日20〜40mg/kgを3回。最大1500mg/日。"
        },
        "piSnippet": "通常1日20〜40mg/kgを1日3回に分割して服用する。重症等の場合には1日100mg/kgまで増量できる。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6132009C2023",
        "name": "トミロン／セフテラム 20%",
        "brandName": "トミロン",
        "yjCode": "6132009C2023",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6132009C2023",
        "potency": 200,
        "piSnippetSource": "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。",
        "dosage": {
            "minMgKg": 9,
            "maxMgKg": 18,
            "absoluteMaxMgPerDay": 600,
            "absoluteMaxMinMgPerDay": 300,
            "note": "1日9〜18mg/kgを3回。最大600mg(成人量)/日。"
        },
        "piSnippet": "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6132011R1078",
        "name": "バナン／セフポドキシム 10%",
        "brandName": "バナン",
        "yjCode": "6132011R1078",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6132011R1078",
        "potency": 100,
        "piSnippetSource": "通常1回3mg/kgを1日3回。重症時1回4.5mg/kgを1日3回。年齢および症状に応じて適宜増減する。ただし1日量200mg(力価)を超えないこと。",
        "dosage": {
            "isByTime": true,
            "timeMgKg": 3,
            "timesPerDay": 3,
            "absoluteMaxMgPerDay": 400,
            "absoluteMaxMinMgPerDay": 200,
            "note": "通常1回3mg/kgを1日2〜3回。重症時1回4.5mg/kgを1日3回。上限400mg(成人量)/日。"
        },
        "calcType": "age-weight-switch",
        "ageBranches": [
            {
                "ageMin": 0,
                "ageMax": 15,
                "label": "15歳未満 (体重換算/最大200mg)",
                "dosage": {
                    "isByTime": true,
                    "timeMgKg": 3,
                    "timesPerDay": 3,
                    "absoluteMaxMgPerDay": 200,
                    "note": "小児：通常1回3mg/kgを1日3回(または2回)。上限200mg/日。"
                }
            },
            {
                "ageMin": 15,
                "ageMax": 100,
                "label": "成人 (100〜200mg 1日2回)",
                "dosage": {
                    "calcType": "fixed-age",
                    "fixedDoses": [
                        {
                            "ageMin": 15,
                            "ageMax": 100,
                            "doseMg": 100,
                            "unit": "g",
                            "times": 2,
                            "label": "成人 100mg x 2回"
                        }
                    ],
                    "timesPerDay": 2,
                    "note": "成人：通常1回100〜200mg(力価)を1日2回。適宜増減。"
                }
            }
        ],
        "piSnippet": "通常1回3mg/kgを1日3回。重症時、1回4.5mg(力価)/kgを1日3回経口投与する。ただし、1日量として200mg(力価)を超えないこと。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6132013C1031",
        "name": "セフゾン／セフジニル 10%",
        "brandName": "セフゾン",
        "yjCode": "6132013C1031",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6132013C1031",
        "potency": 100,
        "piSnippetSource": "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。",
        "dosage": {
            "minMgKg": 9,
            "maxMgKg": 18,
            "absoluteMaxMgPerDay": 300,
            "absoluteMaxMinMgPerDay": 300,
            "note": "1日9〜18mg/kgを3回。1日上限300mg/日。"
        },
        "piSnippet": "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6132015C1103",
        "name": "メイアクト／セフジトレン 10%",
        "brandName": "メイアクト",
        "yjCode": "6132015C1103",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6132015C1103",
        "potency": 100,
        "piSnippetSource": "通常1回3mg/kgを1日3回。必要に応じて1回6mg/kgまで増量可。ただし、1日最大600mgを超えないこと。",
        "dosage": {
            "minMgKg": 9,
            "maxMgKg": 18,
            "absoluteMaxMgPerTime": 200,
            "absoluteMaxMgPerDay": 600,
            "absoluteMaxMinMgPerDay": 300,
            "note": "通常1日9〜18mg/kgを3回。1回上限200mg(成人量)。"
        },
        "piSnippet": "通常1回3mg/kgを1日3回。必要に応じて1回6mg(力価)/kgまで増量できる。ただし、1日量として600mg(力価)を超えないこと。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6132016C1027",
        "name": "フロモックス／セフカペン 10%",
        "brandName": "フロモックス",
        "yjCode": "6132016C1027",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6132016C1027",
        "potency": 100,
        "piSnippetSource": "通常1回3mg/kgを1日3回。年齢、体重および症状に応じて適宜増減する。",
        "dosage": {
            "minMgKg": 9,
            "maxMgKg": 9,
            "timeMgKg": 3,
            "isByTime": true,
            "timesPerDay": 3,
            "absoluteMaxMgPerDay": 300,
            "absoluteMaxMinMgPerDay": 300,
            "note": "通常1回3mg/kgを1日3回。1日上限300mg(成人量)。"
        },
        "piSnippet": "通常1回3mg/kgを1日3回経口投与する。なお、年齢、体重および症状に応じて適宜増減する。",
        "category": "antibiotics"
    },
    {
        "id": "keflex-group",
        "name": "Ｌ－ケフレックス／セファレキシン 10%",
        "brandName": "Ｌ－ケフレックス",
        "yjCode": "6132002E1034",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6132002E1034",
        "potency": 100,
        "piSnippetSource": "通常1日25〜50mg/kgを朝夕2回。重症時は50〜100mg/kg。",
        "diseases": [
            {
                "id": "keflex-standard",
                "label": "通常 (25-50mg/kg)",
                "dosage": {
                    "minMgKg": 25,
                    "maxMgKg": 50,
                    "timesPerDay": 2,
                    "absoluteMaxMgPerDay": 1000,
                    "note": "1日25〜50mg/kgを2回(朝夕)。成人最大1000mg/日。"
                },
                "piSnippet": "通常、幼小児にはセファレキシンとして体重kgあたり1日25〜50mg（力価）を2回に分割して、朝、夕食後に経口投与する。"
            },
            {
                "id": "keflex-severe",
                "label": "重症・感受性低 (50-100mg/kg)",
                "dosage": {
                    "minMgKg": 50,
                    "maxMgKg": 100,
                    "timesPerDay": 2,
                    "absoluteMaxMgPerDay": 2000,
                    "note": "1日50〜100mg/kgを2回(朝夕)。成人最大2000mg/日。"
                },
                "piSnippet": "重症の場合や分離菌の感受性が比較的低い症例にはセファレキシンとして体重kgあたり1日50〜100mg（力価）を2回に分割して、朝、夕食後に経口投与する。"
            }
        ],
        "dosage": {
            "minMgKg": 25,
            "maxMgKg": 50,
            "absoluteMaxMgKg": 100,
            "timesPerDay": 2,
            "absoluteMaxMgPerTime": 500,
            "absoluteMaxMgPerDay": 1000,
            "absoluteMaxMinMgPerDay": 1000,
            "note": "通常1日25〜50mg/kgを2回(朝夕)。重症時50〜100mg/kg。"
        },
        "piSnippet": "通常、幼小児には1日25〜50mg(力価)/kgを2回に分割して、朝、夕食後に経口投与する。重症時は1日50〜100mg(力価)/kg。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6135001R2110",
        "name": "ホスミシン／ホスホマイシン (規格選択)",
        "brandName": "ホスミシン",
        "yjCode": "6135001R2110",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6135001R2110",
        "potency": 200,
        "hasSubOptions": true,
        "subOptions": [
            {
                "id": "fos-20",
                "label": "20%顆粒",
                "potency": 200
            },
            {
                "id": "fos-40",
                "label": "40%顆粒",
                "potency": 400
            }
        ],
        "piSnippetSource": "通常1日40〜120mg/kg(製剤0.2〜0.6g/kg)を3〜4回に分けて経口投与する。",
        "dosage": {
            "minMgKg": 40,
            "maxMgKg": 120,
            "timesPerDay": 3,
            "absoluteMaxMgPerDay": 3000,
            "absoluteMaxMinMgPerDay": 2000,
            "note": "通常1日40〜120mg/kgを3回。1日最大3000mg。"
        },
        "piSnippet": "通常、1日40〜120mg/kgを3〜4回に分けて服用する。1日最大3000mg。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6139001R1032",
        "name": "ファロム／ファロペネム 10%",
        "brandName": "ファロム",
        "yjCode": "6139001R1032",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6139001R1032",
        "potency": 100,
        "piSnippetSource": "通常1回5mg/kgを3回。最大1回10mg/kg。年齢、体重、症状により適宜増減する。",
        "dosage": {
            "minMgKg": 15,
            "maxMgKg": 30,
            "isByTime": true,
            "timeMgKg": 5,
            "timesPerDay": 3,
            "absoluteMaxMgPerTime": 300,
            "absoluteMaxMgPerDay": 900,
            "note": "通常1回5mg/kgを3回。最大1回10mg/kg。上限900mg(300mg×3)/日。"
        },
        "piSnippet": "通常1回5mg(力価)/kgを1日3回経口投与する。なお、年齢、体重、症状により適宜増減するが、増量は1回10mg(力価)/kgまでとする。",
        "category": "antibiotics"
    },
    {
        "id": "orapenem-group",
        "name": "オラペネム／テビペネム 10%",
        "brandName": "オラペネム",
        "yjCode": "6139002C1026",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6139002C1026",
        "potency": 100,
        "piSnippetSource": "通常、小児にはテビペネム　ピボキシルとして1回4mg（力価）/kgを1日2回食後に経口投与する。なお、必要に応じて1回6mg（力価）/kgまで増量できる。",
        "dosage": {
            "minMgKg": 8,
            "maxMgKg": 12,
            "isByTime": true,
            "timeMgKg": 4,
            "timesPerDay": 2,
            "absoluteMaxMgPerTime": 250,
            "absoluteMaxMgPerDay": 500,
            "note": "通常1回4mg/kgを1日2回。必要に応じて1回6mg/kgまで。成人最大250mg/回。"
        },
        "piSnippet": "通常、小児にはテビペネム　ピボキシルとして1回4mg（力価）/kgを1日2回食後に経口投与する。なお、必要に応じて1回6mg（力価）/kgまで増量できる。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6141001R2053",
        "name": "エリスロシン／エリスロマイシン (規格選択)",
        "brandName": "エリスロシン",
        "yjCode": "6141001R2053",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6141001R2053",
        "potency": 200,
        "hasSubOptions": true,
        "subOptions": [
            {
                "id": "ery-10",
                "label": "10%細粒",
                "potency": 100
            },
            {
                "id": "ery-20",
                "label": "20%細粒",
                "potency": 200
            }
        ],
        "piSnippetSource": "小児には1日体重1kgあたり25〜50mg(力価)を4〜6回に分割経口投与。なお、年齢、症状により適宜増減する。ただし、小児用量は成人量(1日800〜1200mg)を上限とする。",
        "dosage": {
            "minMgKg": 25,
            "maxMgKg": 50,
            "timesPerDay": 4,
            "absoluteMaxMgPerDay": 1200,
            "absoluteMaxMinMgPerDay": 800,
            "note": "1日25〜50mg/kgを4〜6回。成人量(1200mg)を上限とする。"
        },
        "piSnippet": "小児には1日体重1kgあたり25〜50mg(力価)を4〜6回に分割経口投与。なお、年齢、症状により適宜増減する。ただし、小児用量は成人量(1日800〜1200mg)を上限とする。",
        "category": "antibiotics"
    },
    {
        "id": "clarith-group",
        "name": "クラリス／クラリスロマイシン 10%",
        "brandName": "クラリス",
        "yjCode": "6149003R1143",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6149003R1143",
        "potency": 100,
        "hasSubOptions": false,
        "subOptions": [],
        "piSnippetSource": "通常1日10〜15mg/kgを2〜3回に分けて服用する。年齢および症状に応じて適宜増減する。",
        "dosage": {
            "minMgKg": 10,
            "maxMgKg": 15,
            "isByTime": false,
            "timesPerDay": 2,
            "absoluteMaxMgPerDay": 400,
            "absoluteMaxMinMgPerDay": 400,
            "note": "1日10〜15mg/kgを2〜3回。最大400mg/日。"
        },
        "piSnippet": "通常、小児には1日10〜15mg(力価)/kgを2〜3回に分けて服用する。なお、年齢、症状により適宜増減する。",
        "category": "antibiotics"
    },
    {
        "id": "azithromycin-group",
        "name": "ジスロマック／アジスロマイシン (10%)",
        "brandName": "ジスロマック",
        "yjCode": "6149004C1030",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6149004C1030",
        "potency": 100,
        "calcType": "weight-step",
        "weightSteps": [
            {
                "weightMin": 0.1,
                "weightMax": 15,
                "dose": 0.1,
                "isPerKg": true,
                "unit": "g",
                "label": "15kg未満: 10mg/kg",
                "display": "10mg/kg"
            },
            {
                "weightMin": 15,
                "weightMax": 25,
                "dose": 2,
                "unit": "g",
                "label": "15kg〜25kg未満: 2g"
            },
            {
                "weightMin": 25,
                "weightMax": 35,
                "dose": 3,
                "unit": "g",
                "label": "25kg〜35kg未満: 3g"
            },
            {
                "weightMin": 35,
                "weightMax": 45,
                "dose": 4,
                "unit": "g",
                "label": "35kg〜45kg未満: 4g"
            },
            {
                "weightMin": 45,
                "weightMax": 1000,
                "dose": 5,
                "unit": "g",
                "label": "45kg以上: 5g"
            }
        ],
        "dosage": {
            "timesPerDay": 1,
            "note": "1日1回10mg/kg(最大500mg)を3日間。15kg以上は段階的用量設定。"
        },
        "piSnippetSource": "通常、1日1回10mg/kgを3日間経口投与する。最大量として成人の1日量500mgを超えない。また、体重15kg以上の小児には専用の用量設定表がある。",
        "piSnippet": "通常、1日1回10mg(力価)/kgを3日間経口投与する。ただし、1日最大500mg(力価)を超えないこと。体重15kg以上の小児には専用の用量設定表がある。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6152005D1094",
        "name": "ミノマイシン／ミノサイクリン 2%",
        "brandName": "ミノマイシン",
        "yjCode": "6152005D1094",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6152005D1094",
        "potency": 20,
        "piSnippetSource": "通常、小児には体重1kgあたり、2〜4mg(力価)を1日量として、12あるいは24時間ごとに経口投与する。",
        "dosage": {
            "minMgKg": 2,
            "maxMgKg": 4,
            "timesPerDay": 2,
            "absoluteMaxMgPerDay": 200,
            "absoluteMaxMinMgPerDay": 100,
            "note": "1日量2〜4mg/kg(製剤0.1〜0.2g/kg)を1〜2回。上限200mg/日。"
        },
        "piSnippet": "通常、小児には体重1kgあたり、2〜4mg(力価)を1日量として、12あるいは24時間ごとに経口投与する。",
        "category": "antibiotics"
    },
    {
        "id": "ozex-group",
        "name": "オゼックス／トスフロキサシン 15%",
        "brandName": "オゼックス",
        "yjCode": "6241010C1024",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6241010C1024",
        "potency": 150,
        "piSnippetSource": "小児に対してはトスフロキサシントシル酸塩水和物として1回6mg/kgを1日2回経口投与する。ただし、1回180mg、1日360mgを超えないこととする。",
        "dosage": {
            "minMgKg": 12,
            "maxMgKg": 12,
            "timeMgKg": 6,
            "isByTime": true,
            "timesPerDay": 2,
            "absoluteMaxMgPerTime": 180,
            "absoluteMaxMgPerDay": 360,
            "absoluteMaxMinMgPerDay": 300,
            "note": "1回6mg/kgを1日2回。1回上限180mg、1日上限360mg。"
        },
        "piSnippet": "小児に対してはトスフロキサシントシル酸塩水和物として1回6mg/kgを1日2回経口投与する。ただし、1回180mg、1日360mgを超えないこととする。",
        "category": "antibiotics"
    },
    {
        "id": "yj-6250002D1024",
        "name": "ゾビラックス／アシクロビル 40%",
        "brandName": "ゾビラックス",
        "yjCode": "6250002D1024",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6250002D1024",
        "potency": 400,
        "diseases": [
            {
                "id": "chickenpox",
                "label": "水痘・帯状疱疹",
                "dosage": {
                    "isByTime": true,
                    "timeMgKg": 20,
                    "timesPerDay": 4,
                    "absoluteMaxMgPerTime": 800,
                    "absoluteMaxMgPerDay": 3200,
                    "note": "通常1回20mg/kgを1日4回。上限800mg/回。"
                },
                "piSnippet": "通常、小児には1回20mg/kgを1日4回服用する。ただし、1回最大用量は800mgを超えないこと。"
            },
            {
                "id": "hsv",
                "label": "単純ヘルペス",
                "dosage": {
                    "isByTime": true,
                    "timeMgKg": 20,
                    "timesPerDay": 4,
                    "absoluteMaxMgPerTime": 200,
                    "absoluteMaxMgPerDay": 800,
                    "note": "通常1回20mg/kgを1日4回。上限200mg/回。"
                },
                "piSnippet": "通常、小児には1回20mg/kgを1日4回服用する。ただし、1回最大用量は200mgを超えないこと。"
            }
        ],
        "dosage": {
            "note": "通常1回20mg/kgを1日4回。疾患により1回量の上限が異なります。"
        },
        "piSnippet": "通常、小児には1回20mg/kgを1日4回服用する。疾患により1回量上限（200mg/800mg）が異なります。",
        "category": "antiviral"
    },
    {
        "id": "yj-6250019D1020",
        "name": "バルトレックス顆粒50%",
        "brandName": "バルトレックス",
        "yjCode": "6250019D1020",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6250019D1020",
        "potency": 500,
        "diseases": [
            {
                "id": "val-standard",
                "label": "水痘・帯状疱疹",
                "dosage": {
                    "isByTime": true,
                    "timeMgKg": 25,
                    "timesPerDay": 3,
                    "absoluteMaxMgPerTime": 1000,
                    "absoluteMaxMgPerDay": 3000,
                    "note": "通常1回25mg/kgを1日3回。上限1000mg/回。"
                },
                "piSnippet": "通常、小児には1回25mg/kgを1日3回服用する。ただし、1回最大用量は1000mgを超えないこと。"
            },
            {
                "id": "hsv",
                "label": "単純ヘルペス",
                "dosage": {
                    "timeMgKg": 25,
                    "timesPerDay": 2,
                    "absoluteMaxMgPerTime": 500,
                    "isByTime": true,
                    "weightBasedOverrides": [
                        {
                            "weightMin": 0,
                            "weightMax": 10,
                            "timesPerDay": 3,
                            "absoluteMaxMgPerTime": 500,
                            "note": "10kg未満:1回25mg/kgを1日3回。上限500mg/回。"
                        },
                        {
                            "weightMin": 10,
                            "weightMax": 1000,
                            "timesPerDay": 2,
                            "absoluteMaxMgPerTime": 500,
                            "note": "10kg以上:1回25mg/kgを1日2回。上限500mg/回。"
                        }
                    ]
                },
                "piSnippet": "通常、10kg未満の小児：1回25mg/kgを1日3回、10kg以上の小児：1回25mg/kgを1日2回服用する。ただし、1回最大500mg。"
            }
        ],
        "dosage": {
            "note": "通常1回25mg/kg。疾患や体重により回数・上限が異なります。"
        },
        "piSnippet": "通常、小児には1回25mg/kgを1日3回服用する。ただし、1回量として1000mgを超えないこと。",
        "category": "antiviral"
    },
    {
        "id": "tamiflu-group",
        "name": "タミフル／オセルタミビル (規格選択)",
        "brandName": "タミフル",
        "yjCode": "6250021R1024",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6250021R1024",
        "potency": 30,
        "hasSubOptions": true,
        "autoSelectByAge": true,
        "subOptions": [
            {
                "id": "over1y",
                "label": "幼小児 (1歳以上)",
                "ageMin": 1,
                "ageMax": 100,
                "potency": 30,
                "dosage": {
                    "isByTime": true,
                    "timeMgKg": 2,
                    "timesPerDay": 2,
                    "absoluteMaxMgPerTime": 75,
                    "absoluteMaxMgPerDay": 150
                },
                "piSnippet": "通常、幼小児には1回2mg/kgを1日2回、5日間服用する、1回最高75mg。"
            },
            {
                "id": "under1y",
                "label": "新生児・乳児 (1歳未満)",
                "ageMin": 0,
                "ageMax": 1,
                "potency": 30,
                "dosage": {
                    "isByTime": true,
                    "timeMgKg": 3,
                    "timesPerDay": 2,
                    "absoluteMaxMgPerTime": 75,
                    "absoluteMaxMgPerDay": 150
                },
                "piSnippet": "通常、新生児・乳児には1回3mg/kgを1日2回、5日間服用する、1回最高75mg。"
            }
        ],
        "dosage": {
            "note": "幼小児:1回2mg/kg、1歳未満:1回3mg/kg、1日2回。上限75mg/回。"
        },
        "piSnippet": "1回2mg/kg(1歳以上)または3mg/kg(1歳未満)を1日2回、1回最高用量は75mg。",
        "category": "antiviral"
    },
    {
        "id": "zofluza-group",
        "name": "ゾフルーザ顆粒2%",
        "brandName": "ゾフルーザ",
        "yjCode": "6250047F1022",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6250047D1021",
        "potency": 10,
        "unit": "g",
        "calcType": "age-weight-switch",
        "ageBranches": [
            {
                "ageMin": 0,
                "ageMax": 12,
                "label": "12歳未満: 体重別段階投与",
                "dosage": {
                    "calcType": "weight-step",
                    "weightSteps": [
                        { "weightMin": 0, "weightMax": 10, "dose": 0.5, "unit": "g", "label": "10kg未満: 10mg (0.5g)", "display": "0.5g (1包)" },
                        { "weightMin": 10, "weightMax": 20, "dose": 0.5, "unit": "g", "label": "10-20kg: 10mg (0.5g)", "display": "0.5g (1包)" },
                        { "weightMin": 20, "weightMax": 40, "dose": 1.0, "unit": "g", "label": "20-40kg: 20mg (1.0g)", "display": "1.0g (2包)" },
                        { "weightMin": 40, "weightMax": 1000, "dose": 2.0, "unit": "g", "label": "40kg以上: 40mg (2.0g)", "display": "2.0g (4包)" }
                    ],
                    "timesPerDay": 1,
                    "isSingleDose": true,
                    "note": "12歳未満の小児。単回投与。"
                }
            },
            {
                "ageMin": 12,
                "ageMax": 100,
                "label": "12歳以上: 成人量基準",
                "dosage": {
                    "calcType": "weight-step",
                    "weightSteps": [
                        { "weightMin": 0, "weightMax": 20, "dose": 0.5, "unit": "g", "label": "20kg未満: 10mg (0.5g)", "display": "0.5g (1包)" },
                        { "weightMin": 20, "weightMax": 40, "dose": 1.0, "unit": "g", "label": "20-40kg: 20mg (1.0g)", "display": "1.0g (2包)" },
                        { "weightMin": 40, "weightMax": 80, "dose": 2.0, "unit": "g", "label": "40-80kg: 40mg (2.0g)", "display": "2.0g (4包)" },
                        { "weightMin": 80, "weightMax": 1000, "dose": 4.0, "unit": "g", "label": "80kg以上: 80mg (4.0g)", "display": "4.0g (8包)" }
                    ],
                    "timesPerDay": 1,
                    "isSingleDose": true,
                    "note": "12歳以上の小児・成人。単回投与。"
                }
            }
        ],
        "dosage": {
            "timesPerDay": 1,
            "isSingleDose": true,
            "note": "原則、12歳以上で80kg以上は80mg(4.0g)。"
        },
        "piSnippet": "通常、単回経口投与する。12歳以上の小児及び成人：80kg以上は80mg(4.0g)、80kg未満は40mg(2.0g)。12歳未満の小児：40kg以上は40mg(2.0g)、20kg以上40kg未満は20mg(1.0g)、10kg以上20kg未満は10mg(0.5g)。",
        "category": "antiviral"
    },
    {
        "id": "inavir-group",
        "name": "イナビル吸入粉末剤20mg",
        "brandName": "イナビル",
        "yjCode": "6250022G1022",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6250022G1022",
        "potency": 1,
        "unit": "容器",
        "calcType": "fixed-age",
        "fixedDoses": [
            {
                "ageMin": 0,
                "ageMax": 10,
                "dose": 1,
                "unit": "容器",
                "label": "10歳未満: 20mg (1容器)",
                "display": "20mg (1容器)"
            },
            {
                "ageMin": 10,
                "ageMax": 100,
                "dose": 2,
                "unit": "容器",
                "label": "10歳以上: 40mg (2容器)",
                "display": "40mg (2容器)"
            }
        ],
        "dosage": {
            "timesPerDay": 1,
            "isSingleDose": true,
            "note": "単回吸入。10歳未満:20mg(1容器)、10歳以上:40mg(2容器)。"
        },
        "piSnippet": "通常、単回吸入投与する。10歳未満：20mg（1容器）、10歳以上：40mg（2容器）。",
        "category": "antiviral"
    },
    {
        "id": "relenza-group",
        "name": "リレンザカプセル5mg (吸入用)",
        "brandName": "リレンザ",
        "yjCode": "6250019G1022",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/6250019G1022",
        "potency": 5,
        "unit": "ブリスター",
        "dosage": {
            "minMgKg": 0,
            "maxMgKg": 0,
            "isByTime": true,
            "timeMgKg": 0,
            "isFixed": true,
            "dosePerTime": 10,
            "timesPerDay": 2,
            "note": "1回10mg(2ブリスター)を1日2回、5日間。専用吸入器を使用。"
        },
        "piSnippet": "通常、1回10mg（2ブリスター）を、1日2回、5日間、専用の吸入器を用いて吸入する。",
        "category": "antiviral"
    },
    {
        "id": "medicon-group",
        "name": "メジコン／デキストロメトルファン (10%)",
        "brandName": "メジコン",
        "yjCode": "2223001B1210",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2223001B1210",
        "potency": 100,
        "piSnippetSource": "通常、小児には1日量として、1〜2歳4.5〜9mg、3〜4歳6〜12mg、5〜6歳8〜16mg。3〜4回分割。",
        "dosage": {
            "minMgKg": 1,
            "maxMgKg": 2,
            "timesPerDay": 3,
            "absoluteMaxMgPerDay": 60,
            "absoluteMaxMinMgPerDay": 45,
            "note": "1日1〜2mg/kg(目安)。1-2歳4.5-9mg, 3-4歳6-12mg, 5-6歳8-16mg。3-4回分割。"
        },
        "piSnippet": "通常、小児には以下の1日量を3〜4回に分割し服用する。1〜2歳：4.5〜9mg、3〜4歳：6〜12mg、5〜6歳：8〜16mg。",
        "category": "respiratory"
    },
    {
        "id": "carbocisteine-group",
        "name": "ムコダイン／カルボシステイン DS50%",
        "brandName": "ムコダイン",
        "yjCode": "2233002R2029",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2233002R2029",
        "potency": 500,
        "hasSubOptions": false,
        "subOptions": [],
        "piSnippetSource": "通常1回10mg/kgを3回。年齢および症状に応じて適宜増減する。",
        "dosage": {
            "minMgKg": 30,
            "maxMgKg": 30,
            "isByTime": true,
            "timeMgKg": 10,
            "timesPerDay": 3,
            "absoluteMaxMgPerDay": 1500,
            "absoluteMaxMinMgPerDay": 1500,
            "note": "通常1回10mg/kgを3回。1日最大1500mg(成人量)。"
        },
        "piSnippet": "通常、小児には1回10mg/kgを1日3回経口投与する。なお、年齢、症状により適宜増減する。",
        "category": "respiratory"
    },
    {
        "id": "yj-2239001Q1166",
        "name": "ムコソルバン／アンブロキソール 1.5%",
        "brandName": "ムコソルバン",
        "yjCode": "2239001Q1166",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2239001Q1166",
        "potency": 15,
        "piSnippetSource": "通常1日0.9mg/kgを3回。3回分割経口投与する。",
        "dosage": {
            "minMgKg": 0.9,
            "maxMgKg": 0.9,
            "isByTime": true,
            "timeMgKg": 0.3,
            "timesPerDay": 3,
            "absoluteMaxMgPerDay": 45,
            "absoluteMaxMinMgPerDay": 45,
            "note": "通常1日0.9mg/kg(製剤0.06g/kg)を3回。上限45mg(成人量)/日。"
        },
        "piSnippet": "通常、小児には1日0.9mg/kgを3回に分割して経口投与する。",
        "category": "respiratory"
    },
    {
        "id": "asverin-group",
        "name": "アスベリン／チペピジン (規格選択)",
        "brandName": "アスベリン",
        "yjCode": "2249003B1037",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2249003B1037",
        "potency": 100,
        "hasSubOptions": true,
        "subOptions": [
            {
                "id": "asv-10",
                "label": "10%散",
                "potency": 100
            },
            {
                "id": "asv-2",
                "label": "2%DS",
                "potency": 20
            }
        ],
        "piSnippetSource": "通常小児1歳未満5〜20mg、1〜3歳未満10〜25mg、3〜6歳未満15〜40mgを3回に分割。",
        "dosage": {
            "minMgKg": 1,
            "maxMgKg": 1,
            "isByTime": true,
            "timeMgKg": 0.33,
            "timesPerDay": 3,
            "absoluteMaxMgPerDay": 120,
            "note": "通常1日1mg/kgを3回(目安)。上限120mg(成人量)。"
        },
        "piSnippet": "通常、小児には1日1歳未満5〜20mg、1歳以上3歳未満10〜25mg、3歳以上6歳未満15〜40mgを3回に分割経口投与する。なお、年齢、症状により適宜増減する。",
        "category": "respiratory"
    },
    {
        "id": "yj-2251001D1061",
        "name": "テオドール／テオフィリン (20%)",
        "yjCode": "2251001D1061",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2251001D1061",
        "potency": 200,
        "piSnippetSource": "通常、1日1kgあたり8〜20mgを2回に分けて、朝及び夕食後に経口投与する。6〜15歳では8〜10mg/kg/日から開始する。",
        "dosage": {
            "minMgKg": 8,
            "maxMgKg": 20,
            "timesPerDay": 2,
            "absoluteMaxMgPerDay": 400,
            "note": "通常1日8〜20mg/kgを1日2回。6〜15歳は8〜10mg/kg/日から開始。小児1回100〜200mg(製剤0.5〜1g)を1日2回。"
        },
        "piSnippet": "通常、小児1回100〜200mg（本剤0.5〜1g）を1日2回服用する。6〜15歳では8〜10mg/kg/日より開始する。",
        "category": "respiratory"
    },
    {
        "id": "meptin-group",
        "name": "メプチン／プロカテロール (規格選択)",
        "brandName": "メプチン",
        "yjCode": "2259004R2024",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2259004R2024",
        "potency": 0.05,
        "unit": "g",
        "hasSubOptions": true,
        "subOptions": [
            {
                "id": "meptin-0005",
                "label": "メプチンドライシロップ0.005%",
                "potency": 0.05,
                "unit": "g",
                "yjCode": "2259004R2024",
                "dosage": {
                    "note": "【0.005%】通常1回1.25μg/kg(DSとして0.025g/kg)を1日2回。"
                }
            },
            {
                "id": "procaterol-001",
                "label": "プロカテロール塩酸塩DS0.01%「タカタ」",
                "potency": 0.1,
                "unit": "g",
                "dosage": {
                    "note": "【0.01%】通常1回1.25μg/kg(DSとして0.0125g/kg)を1日2回。"
                }
            }
        ],
        "piSnippetSource": "通常、1回1.25μg/kgを1日2〜3回. 6歳以上は1回25μgを1日1〜2回。年齢および症状に応じて適宜増減する。",
        "calcType": "age-weight-switch",
        "ageBranches": [
            {
                "ageMin": 0,
                "ageMax": 6,
                "label": "6歳未満: 1.25μg/kg",
                "dosage": {
                    "isFixed": false,
                    "timeMgKg": 0.00125,
                    "unit": "g",
                    "timesPerDay": 2,
                    "isByTime": true,
                    "absoluteMaxMgPerDay": 0.05,
                    "note": "6歳未満:通常1回1.25μg/kgを1日2〜3回。"
                }
            },
            {
                "ageMin": 6,
                "ageMax": 15,
                "label": "6歳以上: 25μg 固定",
                "dosage": {
                    "calcType": "fixed-age",
                    "fixedDoses": [
                        {
                            "ageMin": 6,
                            "ageMax": 15,
                            "doseMg": 0.025,
                            "unit": "g",
                            "times": 2,
                            "label": "6歳以上15歳未満: 1回25μg"
                        }
                    ],
                    "timesPerDay": 2,
                    "note": "6歳以上:通常1回25μgを1日1〜2回。"
                }
            },
            {
                "ageMin": 15,
                "ageMax": 100,
                "label": "15歳以上(成人): 50μg 固定",
                "dosage": {
                    "calcType": "fixed-age",
                    "fixedDoses": [
                        {
                            "ageMin": 15,
                            "ageMax": 100,
                            "doseMg": 0.05,
                            "unit": "g",
                            "times": 2,
                            "label": "15歳以上: 1回50μg"
                        }
                    ],
                    "timesPerDay": 2,
                    "note": "成人:通常1回50μgを1日1〜2回。"
                }
            }
        ],
        "piSnippet": "6歳以上の小児：1回25μgを1日1回就寝前ないしは1日2回（朝及び就寝前）経口投与。6歳未満：1回1.25μg/kgを1日2回（朝及び就寝前）ないしは1日3回（朝、昼及び就寝前）経口投与。",
        "category": "respiratory"
    },
    {
        "id": "yj-2259002R1061",
        "name": "ホクナリン／ツロブテロール 0.1%",
        "yjCode": "2259002R1061",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2259002R1061",
        "potency": 1,
        "piSnippetSource": "通常1回0.02mg/kgを2回。年齢および症状に応じて適宜増減する。",
        "dosage": {
            "minMgKg": 0.04,
            "maxMgKg": 0.04,
            "isByTime": true,
            "timeMgKg": 0.02,
            "timesPerDay": 2,
            "absoluteMaxMgPerDay": 2,
            "note": "通常1回0.02mg/kgを2回。上限2mg/日。"
        },
        "piSnippet": "通常1回0.02mg/kgを2回。年齢および症状に応じて適宜増減する。",
        "category": "respiratory"
    },
    {
        "id": "yj-4413004C2022",
        "name": "ゼスラン／メキタジン (0.6%)",
        "yjCode": "4413004C2022",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4413004C2022",
        "potency": 6,
        "diseases": [
            {
                "id": "zes-asthma",
                "label": "気管支喘息",
                "dosage": {
                    "isByTime": true,
                    "timeMgKg": 0.12,
                    "timesPerDay": 2,
                    "absoluteMaxMgPerDay": 12,
                    "note": "通常1回0.12mg/kgを1日2回。上限12mg(成人量)。"
                },
                "piSnippet": "通常、気管支喘息にはメキタジンとして1回0.12mg/kgを1日2回服用する。"
            },
            {
                "id": "zes-rhinitis",
                "label": "鼻炎・じん麻疹・痒み",
                "dosage": {
                    "isByTime": true,
                    "timeMgKg": 0.06,
                    "timesPerDay": 2,
                    "absoluteMaxMgPerDay": 6,
                    "note": "通常1回0.06mg/kgを1日2回。上限6mg(成人量)。"
                },
                "piSnippet": "通常、アレルギー性鼻炎、じん麻疹等にはメキタジンとして1回0.06mg/kgを1日2回服用する。"
            }
        ],
        "dosage": {
            "note": "通常1日2回。喘息(1回0.12mg/kg・上限12mg)、その他(1回0.06mg/kg・上限6mg)。"
        },
        "piSnippet": "疾患により1回投与量が異なります（喘息 0.12mg/kg、その他 0.06mg/kg）。",
        "category": "allergy"
    },
    {
        "id": "polaramine-group",
        "name": "ポララミン／d-クロルフェニラミン (規格選択)",
        "brandName": "ポララミン",
        "potency": 10,
        "hasSubOptions": true,
        "subOptions": [
            {
                "id": "polaramine-powder",
                "label": "ポララミン散1%",
                "potency": 10,
                "yjCode": "4419002B1033"
            },
            {
                "id": "polaramine-ds",
                "label": "ポララミンドライシロップ0.2%",
                "potency": 2,
                "yjCode": "4419002R1031"
            }
        ],
        "calcType": "age",
        "adultDose": 6,
        "unit": "g",
        "isAdultOnly": false,
        "piSnippetSource": "通常、成人には1回2mg(0.2g)を1日1〜4回経口投与する。なお、年齢、症状により適宜増減する。",
        "dosage": {
            "note": "成人1日6mg(2mg×3回)。小児用量記載なし、Augsberger式等で算出。"
        },
        "piSnippet": "通常、成人1回2mg(散1%:0.2g, DS0.2%:1g)を1日1〜4回。小児は年齢・症状により適宜増減。",
        "category": "allergy"
    },
    {
        "id": "yj-4419005B1045",
        "name": "ペリアクチン散1%",
        "yjCode": "4419005B1045",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4419005B1045",
        "potency": 10,
        "calcType": "age",
        "adultDose": 12,
        "unit": "g",
        "isAdultOnly": true,
        "piSnippetSource": "通常、成人には1回4mg(0.4g)を1日1〜3回経口投与する。なお、年齢、症状により適宜増減する。",
        "dosage": {
            "note": "成人1回4mg(0.4g)。小児用量記載なし、Augsberger式等で算出。"
        },
        "piSnippet": "通常、成人1回4mg(0.4g)を1日1〜3回。小児は年齢・症状により適宜増減。",
        "category": "allergy"
    },
    {
        "id": "yj-4490003R1228",
        "name": "ザジテン／ケトチフェン (0.1%)",
        "yjCode": "4490003R1228",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4490003R1228",
        "potency": 1,
        "piSnippetSource": "通常、小児には1日量体重1kgあたり0.06g（ケトチフェンとして0.06mg）を2回に分けて、朝食後及び就寝前に用時溶解して経口投与する。",
        "dosage": {
            "minMgKg": 0.06,
            "maxMgKg": 0.06,
            "timesPerDay": 2,
            "absoluteMaxMgPerDay": 2,
            "note": "1日0.06mg/kg(製剤0.06g/kg)を2回。上限2mg/日(成人量)。"
        },
        "piSnippet": "通常、小児には1日量0.06mg/kg（製剤0.06g/kg）を2回に分けて朝食後及び就寝前に服用する。",
        "category": "allergy"
    },
    {
        "id": "oxatomide-group",
        "name": "オキサトミドドライシロップ小児用2%",
        "brandName": "オキサトミド",
        "yjCode": "4490005R1430",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4490005R1430",
        "potency": 20,
        "piSnippetSource": "通常1回0.5mg/kgを1日2回。年齢、症状により適宜増減する。",
        "dosage": {
            "minMgKg": 1,
            "maxMgKg": 1,
            "isByTime": true,
            "timeMgKg": 0.5,
            "timesPerDay": 2,
            "absoluteMaxMgPerDay": 60,
            "note": "通常1回0.5mg/kgを1日2回。上限60mg(成人量)。"
        },
        "piSnippet": "通常、小児には1回0.5mg/kgを1日2回(朝食後、就寝前)服用する。",
        "category": "allergy"
    },
    {
        "id": "yj-4490017R1033",
        "name": "オノン／プランルカスト (10%)",
        "brandName": "オノン",
        "yjCode": "4490017R1033",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4490017R1033",
        "potency": 100,
        "piSnippetSource": "通常、小児には1回体重1kgあたり本剤0.07g（プランルカスト水和物として7mg）を1日2回、朝食後及び夕食後に経口投与する。",
        "dosage": {
            "minMgKg": 14,
            "maxMgKg": 14,
            "isByTime": true,
            "timeMgKg": 7,
            "timesPerDay": 2,
            "absoluteMaxMgPerDay": 450,
            "note": "通常1回7mg/kg(製剤0.07g/kg)を2回。1日14mg/kg。上限450mg/日。"
        },
        "piSnippet": "通常、小児には1回体重1kgあたり0.07g（プランルカストとして7mg）を1日2回服用する。",
        "category": "allergy"
    },
    {
        "id": "cetirizine-group",
        "name": "ジルテック／セチリジン (1.25%)",
        "brandName": "ジルテック",
        "yjCode": "4490020R1027",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4490020R1027",
        "potency": 12.5,
        "calcType": "fixed-age",
        "fixedDoses": [
            {
                "ageMin": 2,
                "ageMax": 7,
                "dose": 0.2,
                "unit": "g",
                "label": "2-7歳未満"
            },
            {
                "ageMin": 7,
                "ageMax": 100,
                "dose": 0.4,
                "unit": "g",
                "label": "7歳以上"
            }
        ],
        "piSnippetSource": "2歳以上7歳未満：1回0.2gを1日2回。7歳以上15歳未満：1回0.4gを1日2回。",
        "dosage": {
            "timesPerDay": 2,
            "note": "2-7歳未満:1回0.2g、7-15歳未満:1回0.4gを1日2回。"
        },
        "piSnippet": "通常、2歳以上7歳未満：1回0.2g、7歳以上15歳未満：1回0.4gを1日2回。",
        "category": "allergy"
    },
    {
        "id": "yj-4490023R2027",
        "name": "フェキソフェナジンDS5% (旧アレグラ)",
        "brandName": "フェキソフェナジン",
        "yjCode": "4490023R2035",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4490023R2035",
        "potency": 50,
        "calcType": "fixed-age",
        "fixedDoses": [
            {
                "ageMin": 0.5,
                "ageMax": 2,
                "dose": 0.3,
                "unit": "g",
                "label": "6ヶ月以上2歳未満 (1回15mg)"
            },
            {
                "ageMin": 2,
                "ageMax": 7,
                "dose": 0.6,
                "unit": "g",
                "label": "2歳以上7歳未満 (1回30mg)"
            },
            {
                "ageMin": 7,
                "ageMax": 12,
                "dose": 0.6,
                "unit": "g",
                "label": "7歳以上12歳未満 (1回30mg / 適宜増減)"
            },
            {
                "ageMin": 12,
                "ageMax": 100,
                "dose": 1.2,
                "unit": "g",
                "label": "12歳以上 (1回60mg / 適宜増減)"
            }
        ],
        "dosage": {
            "timesPerDay": 2,
            "note": "6ヶ月-2歳:15mg(0.3g)、2-7歳:30mg(0.6g)、7-12歳:30mg(0.6g)・12歳以上:60mg(1.2g)［適宜増減］。"
        },
        "piSnippet": "通常（1回量）：12歳以上 60mg(1.2g)・7-12歳 30mg(0.6g) ［適宜増減あり］。2-7歳 30mg(0.6g)、6ヶ月-2歳 15mg(0.3g) を1日2回経口投与する。",
        "category": "allergy"
    },
    {
        "id": "yj-4490025D1022",
        "name": "アレロック／オロパタジン (0.5%)",
        "brandName": "アレロック",
        "yjCode": "4490025D1022",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4490025D1022",
        "potency": 100,
        "calcType": "fixed-age",
        "fixedDoses": [
            {
                "ageMin": 2,
                "ageMax": 7,
                "dose": 0.5,
                "unit": "g",
                "label": "2-7歳未満"
            },
            {
                "ageMin": 7,
                "ageMax": 100,
                "dose": 1,
                "unit": "g",
                "label": "7歳以上"
            }
        ],
        "dosage": {
            "timesPerDay": 2,
            "note": "2〜7歳未満:1回0.5g、7歳以上:1回1gを1日2回。"
        },
        "piSnippet": "通常、2〜7歳未満：1回2.5mg(0.5g)、7歳以上：1回5mg(1g)を朝・就寝前の1日2回服用する。",
        "category": "allergy"
    },
    {
        "id": "montelukast-group",
        "name": "キプレス／モンテルカスト",
        "brandName": "キプレス",
        "yjCode": "4490026C1021",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4490026C1021",
        "potency": 1,
        "unit": "包",
        "calcType": "fixed-age",
        "fixedDoses": [
            {
                "ageMin": 1,
                "ageMax": 6,
                "dose": 1,
                "unit": "包",
                "label": "1歳以上6歳未満 (4mg)"
            }
        ],
        "dosage": {
            "timesPerDay": 1,
            "note": "1歳以上6歳未満：1日1回1包(4mg)。"
        },
        "piSnippet": "1歳以上6歳未満：通常、1日1回1包（4mg）を就寝前に服用する。",
        "category": "allergy"
    },
    {
        "id": "yj-4490027R1029",
        "name": "クラリチン／ロラタジン 1%",
        "brandName": "クラリチン",
        "yjCode": "4490027R1029",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4490027R1029",
        "potency": 10,
        "piSnippetSource": "3歳以上7歳未満：1回0.5gを1日1回。7歳以上：1回1.0gを1日1回。",
        "calcType": "fixed-age",
        "fixedDoses": [
            {
                "ageMin": 3,
                "ageMax": 7,
                "dose": 0.5,
                "unit": "g",
                "label": "3-7歳未満"
            },
            {
                "ageMin": 7,
                "ageMax": 100,
                "dose": 1,
                "unit": "g",
                "label": "7歳以上"
            }
        ],
        "dosage": {
            "timesPerDay": 1,
            "note": "3-7歳未満:1回0.5g、7歳以上:1回1.0gを1日1回。"
        },
        "piSnippet": "3歳以上7歳未満：1回0.5gを1日1回。7歳以上：1回1.0gを1日1回。",
        "category": "allergy"
    },
    {
        "id": "yj-4490028Q1028",
        "name": "ザイザル／レボセチリジン (0.05%)",
        "brandName": "ザイザル",
        "yjCode": "4490028Q1028",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/4490028Q1028",
        "potency": 0.5,
        "unit": "mL",
        "calcType": "fixed-age",
        "fixedDoses": [
            {
                "ageMin": 0.5,
                "ageMax": 1,
                "dose": 2.5,
                "unit": "mL",
                "label": "6ヶ月以上1歳未満 (1日1回)",
                "times": 1
            },
            {
                "ageMin": 1,
                "ageMax": 7,
                "dose": 2.5,
                "unit": "mL",
                "label": "1歳以上7歳未満 (1日2回)",
                "times": 2
            },
            {
                "ageMin": 7,
                "ageMax": 15,
                "dose": 5,
                "unit": "mL",
                "label": "7歳以上15歳未満 (1日2回)",
                "times": 2
            },
            {
                "ageMin": 15,
                "ageMax": 100,
                "dose": 10,
                "unit": "mL",
                "label": "15歳以上 (1日1回)",
                "times": 1
            }
        ],
        "piSnippetSource": "6ヶ月以上1歳未満:1回2.5mL(1日1回)。1歳以上7歳未満:1回2.5mL(1日2回)。7歳以上15歳未満:1回5mL(1日2回)。",
        "dosage": {
            "note": "6ヶ月-1歳未満:2.5mL(1回)、1-7歳:2.5mL(2回)、7-15歳:5mL(2回)、15歳以上:10mL(1回)。"
        },
        "piSnippet": "6ヵ月以上1歳未満：1回2.5mLを1日1回。1歳以上7歳未満：1回2.5mLを1日2回。7歳以上15歳未満：1回5mLを1日2回服用する。",
        "category": "allergy"
    },
    {
        "id": "yj-1139010R1020",
        "name": "イーケプラ／レベチラセタム 50%",
        "yjCode": "1139010R1020",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/1139010R1020",
        "potency": 500,
        "piSnippetSource": "通常、4歳以上の小児には1日20mg/kg(製剤0.04g/kg)を2回に分けて経口投与する。症状により1日60mg/kg(製剤0.12g/kg)を超えない範囲で増減する。生後6ヵ月以上4歳未満の小児：通常、1日20mg/kgを1日2回に分 けて経口投与する。症状により1日60mg/kgを超えない範囲で増減する。生後1ヵ月以上6ヵ月未満の小児：通常、1日14mg/kgを1日2回に分けて経口投与する。症状により1日42mg/kgを超えない範囲で増減する。",
        "diseases": [
            {
                "id": "partial",
                "label": "部分発作"
            },
            {
                "id": "tonic",
                "label": "強直間代発作",
                "ageMin": 4,
                "dosage": {
                    "note": "4歳以上の小児。他の抗てんかん薬と併用すること。"
                }
            }
        ],
        "calcType": "age-weight-switch",
        "ageBranches": [
            {
                "ageMin": 0,
                "ageMax": 0.5,
                "label": "生後6ヶ月未満 (14-42mg/kg)",
                "dosage": {
                    "minMgKg": 14,
                    "maxMgKg": 42,
                    "timesPerDay": 2,
                    "absoluteMaxMgPerDay": 3000,
                    "note": "通常1日14mg/kg(製剤0.028g/kg)を2回。最大1日42mg/kg。"
                }
            },
            {
                "ageMin": 0.5,
                "ageMax": 100,
                "label": "生後6ヶ月以上 (20-60mg/kg)",
                "dosage": {
                    "minMgKg": 20,
                    "maxMgKg": 60,
                    "timesPerDay": 2,
                    "absoluteMaxMgPerDay": 3000,
                    "note": "通常1日20mg/kg(製剤0.04g/kg)を2回。最大1日60mg/kg。"
                }
            }
        ],
        "piSnippet": "年齢により異なります。通常、4歳以上および生後6ヶ月以上：1日20mg/kg(製剤0.04g/kg)を2回。最大1日60mg/kg。生後1ヶ月-6ヶ月未満：1日14mg/kg(製剤0.028g/kg)を2回。最大1日42mg/kg。",
        "category": "cns"
    },
    {
        "id": "melatobel-group",
        "name": "メラトベル顆粒0.2%小児用",
        "brandName": "メラトベル",
        "yjCode": "1190028D1026",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/1190028D1026",
        "potency": 2,
        "calcType": "fixed-age",
        "fixedDoses": [
            {
                "ageMin": 6,
                "ageMax": 100,
                "dose": 0.5,
                "unit": "g",
                "label": "1mg (0.5g)",
                "display": "1mg (0.5g)"
            }
        ],
        "dosage": {
            "timesPerDay": 1,
            "note": "6歳以上。1日1回就寝前1mg(0.5g)から開始。最大4mg(2g)。"
        },
        "piSnippet": "通常、6歳以上の小児には1日1回1mg(0.5g)を就寝前に服用する。最大4mg(2g)。",
        "category": "cns"
    },
    {
        "id": "acetaminophen-group",
        "name": "カロナール／アセトアミノフェン (規格選択)",
        "brandName": "カロナール",
        "yjCode": "1141007C1075",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/1141007C1075",
        "potency": 200,
        "hasSubOptions": true,
        "subOptions": [
            {
                "id": "cal-20",
                "label": "20%細粒",
                "potency": 200
            },
            {
                "id": "cal-40",
                "label": "40%細粒",
                "potency": 400
            },
            {
                "id": "cal-50",
                "label": "50%細粒",
                "potency": 500
            },
            {
                "id": "cal-100",
                "label": "原末(100%)",
                "potency": 1000
            },
            {
                "id": "cal-syr",
                "label": "2%シロップ",
                "potency": 20,
                "unit": "mL"
            }
        ],
        "piSnippetSource": "1回10〜15mg/kg。投与間隔は4〜6時間以上。1日総量60mg/kg限度。成人最大量(1回500mg, 1日1500mg)を超えないこと。",
        "dosage": {
            "absoluteMaxMgKg": 60,
            "absoluteMaxMgPerTime": 500,
            "absoluteMaxMgPerDay": 1500,
            "absoluteMaxMinMgPerDay": 900,
            "isByTime": true,
            "timesPerDay": 3,
            "note": "1回10〜15mg/kg。原則4時間空ける。15歳以上：1回300〜500mg。上限：500mg/回、1500mg/日。",
            "minTimeMgKg": 10,
            "maxTimeMgKg": 15
        },
        "piSnippet": "1回10〜15mg/kg。投与間隔は4〜6時間以上。1日総量60mg/kg限度。成人最大量(1回500mg, 1日1500mg)を超えないこと。",
        "category": "antipyretic"
    },
    {
        "id": "yj-2316004B1036",
        "name": "ビオフェルミンR散",
        "brandName": "ビオフェルミンR",
        "yjCode": "2316004B1036",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2316004B1036",
        "calcType": "age",
        "adultDose": 3,
        "unit": "g",
        "piSnippetSource": "通常1日1.5〜3gを3回。年齢、症状により適宜増減する。",
        "dosage": {
            "note": "目安1日1.5〜3g(3回)。"
        },
        "piSnippet": "通常、小児には1日1.5〜3gを3回に分割して服用する。なお、年齢、症状により適宜増減する。",
        "category": "gi"
    },
    {
        "id": "yj-2316009C1026",
        "name": "ミヤBM",
        "brandName": "ミヤBM",
        "yjCode": "2316009C1026",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2316009C1026",
        "potency": 1,
        "calcType": "age",
        "adultDose": 1.5,
        "unit": "g",
        "piSnippetSource": "通常1日0.3〜1.5gを3回に分割経口投与する。なお、年齢、症状により適宜増減する。",
        "dosage": {
            "note": "目安1日0.3〜1.5g(3回)。"
        },
        "piSnippet": "通常、小児には1日0.3〜1.5gを3回に分割して経口投与する。なお、年齢、症状により適宜増減する。",
        "category": "gi"
    },
    {
        "id": "yj-2316014B1030",
        "name": "ラックビー",
        "brandName": "ラックビー",
        "yjCode": "2316014B1030",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2316014B1030",
        "potency": 1,
        "calcType": "age",
        "adultDose": 3,
        "unit": "g",
        "piSnippetSource": "通常、1日2〜3gを3回に分割経口投与する。なお、年齢、症状により適宜増減する。",
        "dosage": {
            "note": "目安1日2〜3g(3回)。"
        },
        "piSnippet": "通常、小児には1日2〜3gを3回に分割して経口投与する。なお、年齢、症状により適宜増減する。",
        "category": "gi"
    },
    {
        "id": "yj-2399005R1163",
        "name": "ナウゼリンDS1%",
        "brandName": "ナウゼリン",
        "yjCode": "2399005R1163",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2399005R1163",
        "potency": 10,
        "calcType": "age-weight-switch",
        "ageBranches": [
            {
                "ageMin": 0,
                "ageMax": 6,
                "label": "6歳未満: 1.0〜2.0mg/kg/日",
                "dosage": {
                    "minMgKg": 1,
                    "maxMgKg": 2,
                    "timesPerDay": 3,
                    "absoluteMaxMgPerDay": 30,
                    "note": "1日1〜2mg/kgを3回食前。最大30mg/日。"
                }
            },
            {
                "ageMin": 6,
                "ageMax": 100,
                "label": "6歳以上: 1.0mg/kg/日限度",
                "dosage": {
                    "minMgKg": 1,
                    "maxMgKg": 1,
                    "timesPerDay": 3,
                    "absoluteMaxMgPerDay": 30,
                    "note": "1日最大1.0mg/kgを3回食前。最大30mg/日。"
                }
            }
        ],
        "piSnippet": "通常1日1.0〜2.0mg/kgを3回食前。6歳以上は1日最高1.0mg/kgを限度とする。1日最大30mg。",
        "category": "gi"
    },
    {
        "id": "magnesium-oxide-group",
        "name": "酸化マグネシウム細粒83%",
        "brandName": "酸化マグネシウム",
        "yjCode": "2344009C1039",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2344009C1039",
        "potency": 830,
        "dosage": {
            "minMgKg": 25,
            "maxMgKg": 50,
            "timesPerDay": 3,
            "absoluteMaxMgPerDay": 1000,
            "note": "通常1日25-50mg/kg(力価)を3〜4回。成人最大1000mg/日。"
        },
        "piSnippet": "通常、1日25-50mg/kg(力価)を3〜4回に分けて服用する。成人最大1000mg/日。",
        "category": "gi"
    },
    {
        "id": "movicol-group",
        "name": "モビコールHD／LD",
        "brandName": "モビコール",
        "yjCode": "2359110B1037",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/2359110B1037",
        "potency": 1,
        "unit": "包",
        "calcType": "fixed-age",
        "fixedDoses": [
            {
                "ageMin": 2,
                "ageMax": 7,
                "dose": 1,
                "unit": "包",
                "label": "1包（LD）",
                "display": "1包（LD）"
            },
            {
                "ageMin": 7,
                "ageMax": 100,
                "dose": 2,
                "unit": "包",
                "label": "2包（LD）",
                "display": "2包（LD）"
            }
        ],
        "dosage": {
            "timesPerDay": 1,
            "note": "初回量：2-7歳未満1包(LD)、7歳以上2包(LD)。HDはLD2包分に相当します。"
        },
        "piSnippet": "2歳以上7歳未満：初回1包(LD)。7歳以上：初回2包(LD)。HD製剤はLDの2倍量（LD2包=HD1包）。",
        "category": "gi"
    },
    {
        "id": "yj-3222012Q1030",
        "name": "インクレミン／溶性ピロリン酸第二鉄 (0.6%)",
        "brandName": "インクレミン",
        "yjCode": "3222012Q1030",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3222012Q1030",
        "potency": 20,
        "unit": "mL",
        "piSnippetSource": "鉄として、小児には1回1〜2mg（シロップ剤として0.05〜0.1mL）/kgを1日3回、食後に経口投与する。年齢、症状により適宜増減する。",
        "dosage": {
            "minMgKg": 3,
            "maxMgKg": 6,
            "timesPerDay": 3,
            "absoluteMaxMgPerDay": 300,
            "note": "通常1日3〜6mg/kg(0.15〜0.3mL/kg)を3回。最大15mL/日。"
        },
        "piSnippet": "通常、1日3〜6mg/kg(シロップ0.15〜0.3mL/kg)を3回に分けて服用する。最大15mL。",
        "category": "others"
    },
    {
        "id": "transamin-group",
        "name": "トランサミン／トラネキサム酸 50%",
        "brandName": "トランサミン",
        "yjCode": "3327002B1027",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/3327002B1027",
        "potency": 500,
        "dosage": {
            "minMgKg": 25,
            "maxMgKg": 100,
            "timesPerDay": 3,
            "absoluteMaxMgPerDay": 2000,
            "absoluteMaxMinMgPerDay": 1500,
            "note": "通常1日25〜100mg/kgを3〜4回。1日最大2000mg。"
        },
        "piSnippet": "通常、1日20〜50mg/kgを3〜4回に分けて服用する。1日最大2000mg。",
        "category": "respiratory"
    },
    {
        "id": "yj-5200013D1123",
        "name": "ツムラ葛根湯エキス顆粒",
        "brandName": "ツムラ葛根湯",
        "yjCode": "5200013D1123",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/5200013D1123",
        "calcType": "age",
        "adultDose": 7.5,
        "unit": "g",
        "isKampo": true,
        "piSnippetSource": "通常、成人1日7.5gを2〜3回に分割し、食前又は食間に経口投与。小児は年齢に基づき減量。",
        "dosage": {
            "note": "成人1日7.5gを基準に算定。"
        },
        "piSnippet": "通常、成人1日7.5gを2〜3回に分割し、食前又は食間に経口投与する。小児は年齢により適宜減量する。",
        "category": "others"
    },
    {
        "id": "yj-5200072D1058",
        "name": "ツムラ小建中湯エキス顆粒",
        "brandName": "ツムラ小建中湯",
        "yjCode": "5200072D1058",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/5200072D1058",
        "calcType": "age",
        "adultDose": 15,
        "unit": "g",
        "isKampo": true,
        "piSnippetSource": "通常、成人1日15.0gを2〜3回に分割し、経口投与する。小児は年齢に基づき減量。",
        "dosage": {
            "note": "成人1日15.0gを基準に算定。"
        },
        "piSnippet": "通常、成人1日15.0gを2〜3回に分割し、服用する。小児は年齢により適宜減量する。",
        "category": "others"
    },
    {
        "id": "yj-5200139D1037",
        "name": "ツムラ抑肝散エキス顆粒",
        "brandName": "ツムラ抑肝散",
        "yjCode": "5200139D1037",
        "piUrl": "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/GeneralList/5200139D1037",
        "calcType": "age",
        "adultDose": 7.5,
        "unit": "g",
        "isKampo": true,
        "piSnippetSource": "通常1日7.5gを2〜3回。年齢、体重、症状により適宜増減する(Augsberger式等)。",
        "dosage": {
            "note": "標準的な漢方の年齢比率（1/4, 1/3, 1/2, 2/3）で算出。"
        },
        "piSnippet": "通常1日7.5gを2〜3回に分割して服用する。なお、年齢、体重、症状により適宜増減する。",
        "category": "others"
    }
];
