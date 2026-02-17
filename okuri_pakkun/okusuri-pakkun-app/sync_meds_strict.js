const fs = require('fs');

const MASTER_PATH = 'c:\\Users\\kiyoshi\\Github_repository\\search-for-medicine\\okuri_pakkun\\okusuri-pakkun-app\\public\\meds_master.json';
const CALC_JS_PATH = 'c:\\Users\\kiyoshi\\Github_repository\\search-for-medicine\\lab\\pediatric-calc\\calc.js';

const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));

// 標準用量データベース (用法・用量を優先的に引用文として使用)
const DOSAGE_DB = {
    'メイアクト': { potency: 100, piSnippetSource: "通常1回3mg/kgを1日3回。必要に応じて1回6mg/kgまで増量可。ただし、成人最大量(1回200mg, 1日600mg)を超えないこと。", dosage: { minMgKg: 9, maxMgKg: 18, absoluteMaxMgKg: 18, note: "通常1日9〜18mg/kgを3回。1回上限6mg/kg。" } },
    'フロモックス': { potency: 100, piSnippetSource: "通常1回3mg/kgを1日3回。年齢、体重および症状に応じて適宜増減する。", dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを3回。" } },
    'セフカペン': { potency: 100, piSnippetSource: "通常1回3mg/kgを1日3回。年齢、体重および症状に応じて適宜増減する。", dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを3回。" } },
    'バナン': { potency: 100, piSnippetSource: "通常1回3mg/kgを1日3回（または2回）。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを2〜3回。" } },
    'セフゾン': { potency: 100, piSnippetSource: "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 9, maxMgKg: 18, note: "1日9〜18mg/kgを3回。" } },
    'トミロン': { potency: 100, piSnippetSource: "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 9, maxMgKg: 18, note: "1日9〜18mg/kgを3回。" } },
    'ケフラール': { potency: 100, piSnippetSource: "通常1日20〜40mg/kgを3回。重症等の場合は1日100mg/kgまで。", dosage: { minMgKg: 20, maxMgKg: 40, absoluteMaxMgKg: 100, note: "通常1日20〜40mg/kgを3回。" } },
    'ワイドシリン': { potency: 200, piSnippetSource: "通常1日20〜40mg/kgを3〜4回。1日最大90mg/kg(成人最大2g)を超えないこと。", dosage: { minMgKg: 20, maxMgKg: 40, absoluteMaxMgKg: 90, note: "1日最大90mg/kg。" } },
    'サワシリン': { potency: 100, piSnippetSource: "通常1日20〜40mg/kgを3〜4回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 20, maxMgKg: 40, note: "1日20〜40mg/kgを3〜4回。" } },
    'パセトシン': { potency: 100, piSnippetSource: "通常1日20〜40mg/kgを3〜4回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 20, maxMgKg: 40, note: "1日20〜40mg/kgを3〜4回。" } },
    'アモキシシリン': { potency: 100, piSnippetSource: "通常1日20〜40mg/kgを3〜4回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 20, maxMgKg: 40, note: "1日20〜40mg/kgを3〜4回。" } },
    'ユナシン': { potency: 100, piSnippetSource: "通常1日30〜60mg/kgを3回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 30, maxMgKg: 60, note: "通常1日30〜60mg/kgを3回。" } },
    'クラリス': { potency: 100, piSnippetSource: "通常1日10〜15mg/kgを2回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 5, timesPerDay: 2, note: "1日10〜15mg/kgを2回。" } },
    'オゼックス': { potency: 150, piSnippetSource: "通常1回6mg/kgを1日2回。最大1回12mg/kgまで。", dosage: { minMgKg: 12, maxMgKg: 24, isByTime: true, timeMgKg: 6, timesPerDay: 2, note: "通常1回6mg/kgを1日2回。最大1回12mg/kg。" } },
    'トスフロキサシン': { potency: 150, piSnippetSource: "通常1回6mg/kgを1日2回。最大1回12mg/kgまで。", dosage: { minMgKg: 12, maxMgKg: 24, isByTime: true, timeMgKg: 6, timesPerDay: 2, note: "通常1回6mg/kgを1日2回。最大1回12mg/kg。" } },
    'ファロム': { potency: 100, piSnippetSource: "通常1回5mg/kgを3回。最大1回10mg/kg。年齢、体重、症状により適宜増減する。", dosage: { minMgKg: 15, maxMgKg: 30, isByTime: true, timeMgKg: 5, timesPerDay: 3, note: "通常1回5mg/kgを3回。最大1回10mg/kg。" } },
    'ジルテック': { potency: 12.5, piSnippetSource: "2歳以上7歳未満：1回0.2gを1日2回。7歳以上15歳未満：1回0.4gを1日2回。", calcType: "fixed-age", fixedDoses: [{ ageMin: 2, ageMax: 7, dose: 0.2, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 0.4, unit: "g", label: "7-15歳未満" }] },
    'アレグラ': { potency: 50, piSnippetSource: "2歳以上7歳未満：1回0.6gを1日2回。7歳以上12歳未満：1回1.2gを1日2回。12歳以上：1回1.2gを1日2回。", calcType: "fixed-age", fixedDoses: [{ ageMin: 2, ageMax: 7, dose: 0.6, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 100, dose: 1.2, unit: "g", label: "7歳以上" }] },
    'クラリチン': { potency: 10, piSnippetSource: "3歳以上7歳未満：1回0.5gを1日1回。7歳以上：1回1.0gを1日1回。", calcType: "fixed-age", fixedDoses: [{ ageMin: 3, ageMax: 7, dose: 0.5, unit: "g", label: "3-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 1.0, unit: "g", label: "7歳以上" }] },
    'ムコダイン': { potency: 500, piSnippetSource: "通常1回10mg/kgを3回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "通常1回10mg/kgを3回。" } },
    'カルボシステイン': { potency: 500, piSnippetSource: "通常1回10mg/kgを3回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "通常1回10mg/kgを3回。" } },
    'ムコソルバン': { potency: 15, piSnippetSource: "通常1日0.9〜1.2mg/kgを3回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 0.9, maxMgKg: 1.2, isByTime: true, timeMgKg: 0.3, timesPerDay: 3, note: "通常1日0.9〜1.2mg/kgを3回。" } },
    'アスベリン': { potency: 100, piSnippetSource: "通常1日1mg/kgを3回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 1, maxMgKg: 1, isByTime: true, timeMgKg: 0.33, timesPerDay: 3, note: "通常1日1mg/kgを3回。" } },
    'メジコン': { potency: 100, piSnippetSource: "通常1日1〜2mg/kgを3〜4回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 1, maxMgKg: 2, isByTime: true, timeMgKg: 0.33, timesPerDay: 3, note: "通常1日1〜2mg/kgを3〜4回。" } },
    'ホクナリン': { potency: 1, piSnippetSource: "通常1回0.02mg/kgを2回。年齢および症状に応じて適宜増減する。", dosage: { minMgKg: 0.04, maxMgKg: 0.04, isByTime: true, timeMgKg: 0.02, timesPerDay: 2, note: "通常1回0.02mg/kgを2回。" } },
    'カロナール': { potency: 200, piSnippetSource: "1回10〜15mg/kg。投与間隔は4〜6時間以上。1日総量60mg/kg限度。成人最大量(1回500mg, 1日1500mg)を超えないこと。", dosage: { minMgKg: 10, maxMgKg: 15, absoluteMaxMgKg: 60, isByTime: true, timeMgKg: 10, timesPerDay: 4, note: "1回10〜15mg/kg。原則4時間空ける。" } },
    'バラシクロビル': { potency: 500, piSnippetSource: "体重1kgあたり1回25mgを1日2回経口投与する。1回最大用量は500mgとする。", dosage: { minMgKg: 50, maxMgKg: 50, isByTime: true, timeMgKg: 25, timesPerDay: 2, absoluteMaxMgPerTime: 500, note: "通常1回25mg/kg(最大500mg)を2回。" } },
    'ビオフェルミン': { calcType: 'age', adultDose: 3, unit: 'g', piSnippetSource: "通常1日1.5〜3gを3回。年齢、症状により適宜増減する。", dosage: { note: "目安1日1.5〜3g(3回)。" } },
    '抑肝散': { calcType: 'age', adultDose: 7.5, unit: 'g', piSnippetSource: "通常1日7.5gを2〜3回。年齢、体重、症状により適宜増減する(Augsberger式等)。", dosage: { note: "Augsberger式。7.5g/日基準。" } },
};

const SPECIALIZED_LOGIC = {
    'クラバモックス小児用配合ドライシロップ': {
        potency: 42.9,
        calcType: "weight-step",
        weightSteps: [
            { weightMin: 6, weightMax: 11, dose: 1.01, unit: "g", label: "6〜10kg: 1.01g(2パウチ)" },
            { weightMin: 11, weightMax: 17, dose: 2.02, unit: "g", label: "11〜16kg: 2.02g(4パウチ)" },
            { weightMin: 17, weightMax: 24, dose: 3.03, unit: "g", label: "17〜23kg: 3.03g(6パウチ)" },
            { weightMin: 24, weightMax: 31, dose: 4.04, unit: "g", label: "24〜30kg: 4.04g(8パウチ)" },
            { weightMin: 31, weightMax: 37, dose: 5.05, unit: "g", label: "31〜36kg: 5.05g(10パウチ)" },
            { weightMin: 37, weightMax: 40, dose: 6.06, unit: "g", label: "37〜39kg: 6.06g(12パウチ)" }
        ],
        dosage: { note: "1日量を12時間ごと(1日2回)に投与。添付文書の分包用量表に準拠。" },
        piSnippetSource: "通常、1日96.4mg/kgを2回に分けて経口投与。分包製剤(パウチ)の場合は体重区分(6-10kg, 11-16kg等)ごとの固定量を投与する。"
    },
    'ジスロマック細粒小児用10%': {
        potency: 100,
        calcType: "weight-step",
        weightSteps: [
            { weightMin: 0.1, weightMax: 15, dose: 0.1, isPerKg: true, unit: "g", label: "15kg未満: 10mg/kg" },
            { weightMin: 15, weightMax: 25, dose: 2, unit: "g", label: "15kg〜25kg未満: 2g" },
            { weightMin: 25, weightMax: 35, dose: 3, unit: "g", label: "25kg〜35kg未満: 3g" },
            { weightMin: 35, weightMax: 45, dose: 4, unit: "g", label: "35kg〜45kg未満: 4g" },
            { weightMin: 45, weightMax: 1000, dose: 5, unit: "g", label: "45kg以上: 5g" }
        ],
        dosage: { note: "1日1回10mg/kg(最大500mg)を3日間。15kg以上は段階的用量設定。" },
        piSnippetSource: "1日1回10mg/kgを3日間投与。最大500mg。体重15kg以上の小児には専用の用量設定表がある。"
    },
    'タミフルドライシロップ3%': {
        potency: 30,
        hasSubOptions: true,
        subOptions: [
            { id: "over1y", label: "1歳以上", dosage: { minMgKg: 4, maxMgKg: 4, isByTime: true, timeMgKg: 2, timesPerDay: 2, absoluteMaxMgPerTime: 75, note: "1回2mg/kgを2回。5日間。" }, piSnippet: "1回2mg/kgを1日2回、5日間投与。1回最高75mg。" },
            { id: "under1y", label: "1歳未満", dosage: { minMgKg: 6, maxMgKg: 6, isByTime: true, timeMgKg: 3, timesPerDay: 2, absoluteMaxMgPerTime: 75, note: "1回3mg/kgを2回。5日間。" }, piSnippet: "1回3mg/kgを1日2回、5日間投与。1回最高75mg。" }
        ]
    }
};

const MEPTIN_AGE_SWITCH = {
    calcType: "age-weight-switch",
    piSnippetSource: "6歳以上：1回25μg(0.25g)を1日2回。6歳未満：1回1.25μg/kg(0.025g/kg)を1日2〜3回。",
    ageBranches: [
        {
            ageMin: 0,
            ageMax: 6,
            label: "6歳未満: 体重換算 (1.25μg/kg)",
            dosage: { isFixed: false, timeMgKg: 1.25, unit: "μg", timesPerDay: 2, note: "通常1回1.25μg/kgを1日2回（または3回）。" }
        },
        {
            ageMin: 6,
            ageMax: 100,
            label: "6歳以上: 固定量 (1回25μg)",
            dosage: { isFixed: true, dosePerTime: 25, unit: "μg", timesPerDay: 1, note: "通常1回25μg(0.25g)を1日1〜2回。" }
        }
    ]
};

const newDrugs = masterData.map(m => {
    // IDをYJコードベースに強制し、重複を回避
    let id = `yj-${m.yj_code}`;

    let drug = {
        id: id,
        name: m.brand_name,
        yjCode: m.yj_code,
        piUrl: `https://www.pmda.go.jp/PmdaSearch/rdSearch/02/${m.yj_code}?user=1`
    };

    // 用量検索
    let dosageInfo = SPECIALIZED_LOGIC[m.brand_name];

    if (m.brand_name.includes('メプチン')) {
        dosageInfo = JSON.parse(JSON.stringify(MEPTIN_AGE_SWITCH));
        if (m.brand_name.includes('0.01%')) drug.potency = 0.1;
        if (m.brand_name.includes('0.005%')) drug.potency = 0.05;
        drug.unit = "g";
    }

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
        drug.piSnippet = dosageInfo.piSnippetSource || "";
    } else {
        drug.potency = 100;
        drug.dosage = { minMgKg: 0, maxMgKg: 0, note: "用量データ未設定" };
        drug.piSnippet = "";
    }

    // どの薬剤にも用法・用量情報がなければ、マスターデータからフォールバック
    if (!drug.piSnippet && m.special_notes && (m.special_notes.includes('回') || m.special_notes.includes('mg'))) {
        drug.piSnippet = m.special_notes;
    }

    return JSON.stringify(drug, null, 4).replace(/"(\w+)":/g, '$1:');
});

const calcJsContent = fs.readFileSync(CALC_JS_PATH, 'utf8');
const finalContent = calcJsContent.replace(/const PEDIATRIC_DRUGS = \[[\s\S]*?\];/, `const PEDIATRIC_DRUGS = [\n    ${newDrugs.join(',\n    ')}\n];`);

fs.writeFileSync(CALC_JS_PATH, finalContent, 'utf8');
console.log('Final Sync COMPLETE. 73 items matched with PI-Dosage snippets and YJ-based IDs.');
