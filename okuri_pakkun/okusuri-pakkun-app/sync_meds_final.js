const fs = require('fs');

const MASTER_PATH = 'c:\\Users\\kiyoshi\\Github_repository\\search-for-medicine\\okuri_pakkun\\okusuri-pakkun-app\\public\\meds_master.json';
const CALC_JS_PATH = 'c:\\Users\\kiyoshi\\Github_repository\\search-for-medicine\\lab\\pediatric-calc\\calc.js';

const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));

// 特殊ロジックが必要な薬剤の定義
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

// 漢方等の年齢比例計算用
const KAMPO_LIST = {
    '抑肝散エキス顆粒': 7.5,
    '葛根湯エキス顆粒': 7.5,
    '小建中湯エキス顆粒': 7.5,
};

const INHERITANCE_MAP = {
    'オセルタミビル': 'タミフルドライシロップ3%',
    'アジスロマイシン': 'ジスロマック細粒小児用10%',
    'セフカペン': 'フロモックス', // 既存データからマッピング
    'セフジトレン': 'メイアクト'
};

function getBaseData(name) {
    if (SPECIALIZED_LOGIC[name]) return SPECIALIZED_LOGIC[name];
    for (const [key, sourceName] of Object.entries(INHERITANCE_MAP)) {
        if (name.includes(key) && SPECIALIZED_LOGIC[sourceName]) return SPECIALIZED_LOGIC[sourceName];
    }
    return null;
}

const newDrugs = masterData.map(m => {
    const base = getBaseData(m.brand_name);
    let id = m.brand_name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!id) id = 'drug-' + Math.random().toString(36).substr(2, 5);

    let potency = 100;
    if (m.brand_name.includes('10%')) potency = 100;
    else if (m.brand_name.includes('15%')) potency = 150;
    else if (m.brand_name.includes('20%')) potency = 200;
    else if (m.brand_name.includes('50%')) potency = 500;
    else if (m.brand_name.includes('5%')) potency = 50;

    let drug = {
        id: base ? base.id + '-' + id : id,
        name: m.brand_name,
        yjCode: m.yj_code,
        potency: base ? base.potency : potency,
        piUrl: `https://www.pmda.go.jp/PmdaSearch/rdSearch/02/${m.yj_code}?user=1`
    };

    if (base) {
        Object.assign(drug, base);
        if (base.piSnippetSource) drug.piSnippet = base.piSnippetSource;
        drug.name = m.brand_name; // 名前は保持
        drug.id = id; // IDは一意にする
    } else if (KAMPO_LIST[m.brand_name]) {
        drug.calcType = 'age';
        drug.adultDose = KAMPO_LIST[m.brand_name];
        drug.unit = 'g';
        drug.dosage = { note: `Augsberger式。${drug.adultDose}g/日基準。` };
        drug.piSnippet = m.special_notes || '';
    } else {
        drug.dosage = { minMgKg: 0, maxMgKg: 0, note: "用量データ未設定" };
        drug.piSnippet = m.special_notes || '';
    }

    return JSON.stringify(drug, null, 4).replace(/"(\w+)":/g, '$1:'); // Key quotes remove
});

const calcJsContent = fs.readFileSync(CALC_JS_PATH, 'utf8');
const finalContent = calcJsContent.replace(/const PEDIATRIC_DRUGS = \[[\s\S]*?\];/, `const PEDIATRIC_DRUGS = [\n    ${newDrugs.join(',\n    ')}\n];`);

fs.writeFileSync(CALC_JS_PATH, finalContent, 'utf8');
console.log('Final Sync and Reset complete.');
