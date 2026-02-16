const fs = require('fs');

const MASTER_PATH = 'c:\\Users\\kiyoshi\\Github_repository\\search-for-medicine\\okuri_pakkun\\okusuri-pakkun-app\\public\\meds_master.json';
const CALC_JS_PATH = 'c:\\Users\\kiyoshi\\Github_repository\\search-for-medicine\\lab\\pediatric-calc\\calc.js';

const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));

// 標準用量データベース (calc.jsの既存データに基づく)
const DOSAGE_DB = {
    'メイアクト': { potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, absoluteMaxMgKg: 18, note: "通常1日9〜18mg/kgを3回。1回上限6mg/kg。" } },
    'フロモックス': { potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを3回。" } },
    'セフカペン': { potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを3回。" } },
    'バナン': { potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを2〜3回。" } },
    'セフゾン': { potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "1日9〜18mg/kgを3回。" } },
    'トミロン': { potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "1日9〜18mg/kgを3回。" } },
    'ケフラール': { potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, absoluteMaxMgKg: 100, note: "通常1日20〜40mg/kgを3回。" } },
    'ワイドシリン': { potency: 200, dosage: { minMgKg: 20, maxMgKg: 40, absoluteMaxMgKg: 90, note: "1日最大90mg/kg。" } },
    'サワシリン': { potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, note: "1日20〜40mg/kgを3〜4回。" } },
    'パセトシン': { potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, note: "1日20〜40mg/kgを3〜4回。" } },
    'アモキシシリン': { potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, note: "1日20〜40mg/kgを3〜4回。" } },
    'ユナシン': { potency: 100, dosage: { minMgKg: 30, maxMgKg: 60, note: "通常1日30〜60mg/kgを3回。" } },
    'クラリス': { potency: 100, dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 5, timesPerDay: 2, note: "1日10〜15mg/kgを2回。" } },
    'クラリスロマイシン': { potency: 100, dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 5, timesPerDay: 2, note: "1日10〜15mg/kgを2回。" } },
    'オゼックス': { potency: 150, dosage: { minMgKg: 12, maxMgKg: 24, isByTime: true, timeMgKg: 6, timesPerDay: 2, note: "通常1回6mg/kgを1日2回。最大1回12mg/kg。" } },
    'トスフロキサシン': { potency: 150, dosage: { minMgKg: 12, maxMgKg: 24, isByTime: true, timeMgKg: 6, timesPerDay: 2, note: "通常1回6mg/kgを1日2回。最大1回12mg/kg。" } },
    'ファロム': { potency: 100, dosage: { minMgKg: 15, maxMgKg: 30, isByTime: true, timeMgKg: 5, timesPerDay: 3, note: "通常1回5mg/kgを3回。最大1回10mg/kg。" } },
    'ザジテン': { potency: 1, dosage: { minMgKg: 0.04, maxMgKg: 0.04, isByTime: true, timeMgKg: 0.02, timesPerDay: 2, note: "11ヶ月まで：1回0.02mg/kg、1歳以上：1回0.03mg/kgを2回。" } }, // 簡易化
    'ジルテック': { potency: 12.5, calcType: "fixed-age", fixedDoses: [{ ageMin: 2, ageMax: 7, dose: 0.2, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 0.4, unit: "g", label: "7-15歳未満" }] },
    'セチリジン': { potency: 12.5, calcType: "fixed-age", fixedDoses: [{ ageMin: 2, ageMax: 7, dose: 0.2, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 0.4, unit: "g", label: "7-15歳未満" }] },
    'アレグラ': { potency: 50, calcType: "fixed-age", fixedDoses: [{ ageMin: 2, ageMax: 7, dose: 0.6, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 12, dose: 1.2, unit: "g", label: "7-12歳未満" }] },
    'フェキソフェナジン': { potency: 50, calcType: "fixed-age", fixedDoses: [{ ageMin: 2, ageMax: 7, dose: 0.6, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 12, dose: 1.2, unit: "g", label: "7-12歳未満" }] },
    'クラリチン': { potency: 10, calcType: "fixed-age", fixedDoses: [{ ageMin: 3, ageMax: 7, dose: 0.5, unit: "g", label: "3-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 1.0, unit: "g", label: "7歳以上" }] },
    'ロラタジン': { potency: 10, calcType: "fixed-age", fixedDoses: [{ ageMin: 3, ageMax: 7, dose: 0.5, unit: "g", label: "3-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 1.0, unit: "g", label: "7歳以上" }] },
    'ムコダイン': { potency: 500, dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "通常1回10mg/kgを3回。" } },
    'カルボシステイン': { potency: 500, dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "通常1回10mg/kgを3回。" } },
    'ムコソルバン': { potency: 15, dosage: { minMgKg: 0.9, maxMgKg: 1.2, isByTime: true, timeMgKg: 0.3, timesPerDay: 3, note: "通常1日0.9〜1.2mg/kgを3回。" } },
    'アンブロキソール': { potency: 15, dosage: { minMgKg: 0.9, maxMgKg: 1.2, isByTime: true, timeMgKg: 0.3, timesPerDay: 3, note: "通常1日0.9〜1.2mg/kgを3回。" } },
    'アスベリン': { potency: 100, dosage: { minMgKg: 1, maxMgKg: 1, isByTime: true, timeMgKg: 0.33, timesPerDay: 3, note: "通常1日1mg/kgを3回。" } },
    'メジコン': { potency: 100, dosage: { minMgKg: 1, maxMgKg: 2, isByTime: true, timeMgKg: 0.33, timesPerDay: 3, note: "通常1日1〜2mg/kgを3〜4回。" } },
    'ホクナリン': { potency: 1, dosage: { minMgKg: 0.04, maxMgKg: 0.04, isByTime: true, timeMgKg: 0.02, timesPerDay: 2, note: "通常1回0.02mg/kgを2回。" } },
    'ツロブテロール': { potency: 1, dosage: { minMgKg: 0.04, maxMgKg: 0.04, isByTime: true, timeMgKg: 0.02, timesPerDay: 2, note: "通常1回0.02mg/kgを2回。" } },
    'メプチン': { potency: 0.1, dosage: { minMgKg: 0.0025, maxMgKg: 0.0025, isByTime: true, timeMgKg: 0.00125, timesPerDay: 2, note: "通常1回1.25μg/kgを2回。" } },
    'カロナール': { potency: 200, dosage: { minMgKg: 10, maxMgKg: 15, absoluteMaxMgKg: 60, isByTime: true, timeMgKg: 10, timesPerDay: 4, note: "1回10〜15mg/kg。原則4時間空ける。" } },
    'アセトアミノフェン': { potency: 200, dosage: { minMgKg: 10, maxMgKg: 15, absoluteMaxMgKg: 60, isByTime: true, timeMgKg: 10, timesPerDay: 4, note: "1回10〜15mg/kg。" } },
    'ミヤBM': { calcType: 'age', adultDose: 3, unit: 'g', dosage: { note: "目安1日1.5〜3g(3回)。" } },
    'ビオフェルミン': { calcType: 'age', adultDose: 3, unit: 'g', dosage: { note: "目安1日1.5〜3g(3回)。" } },
    'ラックビー': { calcType: 'age', adultDose: 6, unit: 'g', dosage: { note: "目安1日2〜6g(3回)。" } },
    '抑肝散': { calcType: 'age', adultDose: 7.5, unit: 'g', dosage: { note: "Augsberger式。7.5g/日基準。" } },
    '葛根湯': { calcType: 'age', adultDose: 7.5, unit: 'g', dosage: { note: "Augsberger式。7.5g/日基準。" } },
    '小建中湯': { calcType: 'age', adultDose: 7.5, unit: 'g', dosage: { note: "Augsberger式。7.5g/日基準。" } },
};

const SPECIALIZED_LOGIC = {
    'クラバモックス小児用配合ドライシロップ': {
        id: "clavamox-ds",
        potency: 42.9,
        calcType: "weight-step",
        weightSteps: [
            { weightMin: 6, weightMax: 10, dose: 1.01, unit: "g", label: "6kg 〜 10kg" },
            { weightMin: 10, weightMax: 12, dose: 1.34, unit: "g", label: "10kg 〜 12kg" },
            { weightMin: 12, weightMax: 15, dose: 1.68, unit: "g", label: "12kg 〜 15kg" },
            { weightMin: 15, weightMax: 20, dose: 2.18, unit: "g", label: "15kg 〜 20kg" },
            { weightMin: 20, weightMax: 22, dose: 2.68, unit: "g", label: "20kg 〜 22kg" },
            { weightMin: 22, weightMax: 25, dose: 3.02, unit: "g", label: "22kg 〜 25kg" },
            { weightMin: 25, weightMax: 30, dose: 3.69, unit: "g", label: "25kg 〜 30kg" },
            { weightMin: 30, weightMax: 34, dose: 4.36, unit: "g", label: "30kg 〜 34kg" },
            { weightMin: 34, weightMax: 37, dose: 5.03, unit: "g", label: "34kg 〜 37kg" },
            { weightMin: 37, weightMax: 40, dose: 5.53, unit: "g", label: "37kg 〜 40kg" }
        ],
        dosage: { note: "1回12時間ごと(1日2回)。表に基づく固定量。" },
        piSnippetSource: "通常、小児には、アモキシシリン水和物及びクラブラン酸カリウムとして1回20mg/kg（アモキシシリン計量）を12時間ごとに経口投与する。専用の用量調節表が設定されている。"
    },
    'ジスロマック細粒小児用10%': {
        id: "zithromac-ds",
        potency: 100,
        calcType: "weight-step",
        weightSteps: [
            { weightMin: 0.1, weightMax: 15, dose: 0.1, isPerKg: true, unit: "g", label: "15kg未満: 10mg/kg" },
            { weightMin: 15, weightMax: 25, dose: 2, unit: "g", label: "15kg〜25kg未満: 2g(200mg)" },
            { weightMin: 25, weightMax: 35, dose: 3, unit: "g", label: "25kg〜35kg未満: 3g(300mg)" },
            { weightMin: 35, weightMax: 45, dose: 4, unit: "g", label: "35kg〜45kg未満: 4g(400mg)" },
            { weightMin: 45, weightMax: 1000, dose: 5, unit: "g", label: "45kg以上: 5g(500mg)" }
        ],
        dosage: { note: "1日1回10mg/kg(最大500mg)を3日間。15kg以上は段階的用量設定。" },
        piSnippetSource: "アジスロマイシン水和物として1日1回10mg/kgを3日間経口投与する。ただし、1日最大500mgとする。体重15kg以上の小児には専用の用量設定表がある。"
    },
    'タミフルドライシロップ3%': {
        id: "tamiflu-ds",
        potency: 30,
        hasSubOptions: true,
        subOptions: [
            { id: "over1y", label: "1歳以上", dosage: { minMgKg: 4, maxMgKg: 4, isByTime: true, timeMgKg: 2, timesPerDay: 2, absoluteMaxMgPerTime: 75, note: "1回2mg/kgを2回。5日間。" }, piSnippet: "1回2mg/kgを1日2回、5日間経口投与する。ただし、1回最高用量は75mgとする。" },
            { id: "under1y", label: "1歳未満", dosage: { minMgKg: 6, maxMgKg: 6, isByTime: true, timeMgKg: 3, timesPerDay: 2, absoluteMaxMgPerTime: 75, note: "1回3mg/kgを2回。5日間。" }, piSnippet: "1回3mg/kgを1日2回、5日間経口投与する。ただし、1回最高用量は75mgとする。" }
        ]
    }
};

const newDrugs = masterData.map(m => {
    let id = m.brand_name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!id) id = 'drug-' + Math.random().toString(36).substr(2, 5);

    let drug = {
        id: id,
        name: m.brand_name,
        yjCode: m.yj_code,
        piUrl: `https://www.pmda.go.jp/PmdaSearch/rdSearch/02/${m.yj_code}?user=1`
    };

    // 用量検索
    let dosageInfo = SPECIALIZED_LOGIC[m.brand_name];
    if (!dosageInfo) {
        for (const [key, info] of Object.entries(DOSAGE_DB)) {
            if (m.brand_name.includes(key)) {
                dosageInfo = info;
                break;
            }
        }
    }

    if (dosageInfo) {
        Object.assign(drug, dosageInfo);
        if (dosageInfo.piSnippetSource) drug.piSnippet = dosageInfo.piSnippetSource;
        else drug.piSnippet = m.special_notes || '';
        drug.name = m.brand_name; // 名前保持
        drug.id = id; // ID保持
    } else {
        drug.potency = 100; // デフォルト
        drug.dosage = { minMgKg: 0, maxMgKg: 0, note: "用量データ未設定" };
        drug.piSnippet = m.special_notes || '';
    }

    return JSON.stringify(drug, null, 4).replace(/"(\w+)":/g, '$1:');
});

const calcJsContent = fs.readFileSync(CALC_JS_PATH, 'utf8');
const finalContent = calcJsContent.replace(/const PEDIATRIC_DRUGS = \[[\s\S]*?\];/, `const PEDIATRIC_DRUGS = [\n    ${newDrugs.join(',\n    ')}\n];`);

fs.writeFileSync(CALC_JS_PATH, finalContent, 'utf8');
console.log('Final Sync with recursive dosage mapping complete.');
