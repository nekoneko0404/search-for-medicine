const PEDIATRIC_DRUGS = [
    // --- 抗生物質 (セフェム系) ---
    { id: "meiact-ms", name: "メイアクトMS小児用細粒10%", yjCode: "6132016C1020", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, absoluteMaxMgKg: 18, note: "通常1日9〜18mg/kgを3回。1回上限6mg/kg。" }, piSnippet: "セフジトレン ピボキシルとして1日9〜18mg/kgを3回。なお、1回6mg/kg、1日18mg/kgを上限とする。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1020?user=1" },
    { id: "meiact-amel", name: "セフジトレンピボキシル細粒10%「アメル」", yjCode: "6132016C1046", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "メイアクトAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1046?user=1" },
    { id: "meiact-nichiiko", name: "セフジトレンピボキシル細粒10%「日医工」", yjCode: "6132016C1038", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "メイアクトAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1038?user=1" },
    { id: "flomox-ds", name: "フロモックス小児用細粒100mg", yjCode: "6132013R1036", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを3回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013R1036?user=1" },
    { id: "flomox-sawai", name: "セフカペンピボキシル塩酸塩細粒10%「サワイ」", yjCode: "6132013R1044", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "フロモックスAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013R1044?user=1" },
    { id: "flomox-towa", name: "セフカペンピボキシル塩酸塩細粒10%「トーワ」", yjCode: "6132013R1052", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "フロモックスAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013R1052?user=1" },
    { id: "vanan-ds", name: "バナン小児用ドライシロップ10%", yjCode: "6132009R1023", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを2〜3回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132009R1023?user=1" },
    { id: "tomiron-ds-10", name: "トミロン細粒小児用10%", yjCode: "6132011R1020", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを3回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132011R1020?user=1" },
    { id: "tomiron-ds-20", name: "トミロン細粒小児用20%", yjCode: "6132011R3022", potency: 200, dosage: { minMgKg: 9, maxMgKg: 18, note: "20%製剤。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132011R3022?user=1" },
    { id: "cefdinir-astellas", name: "セフゾン細粒小児用10%", yjCode: "6132014R1030", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "1日9〜18mg/kgを3回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132014R1030?user=1" },
    { id: "cefdinir-sawai", name: "セフジニル細粒10%「サワイ」", yjCode: "6132014R1057", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "セフゾンAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132014R1057?user=1" },
    { id: "cefdinir-towa", name: "セフジニル細粒10%「トーワ」", yjCode: "6132014R1065", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "セフゾンAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132014R1065?user=1" },
    { id: "kefral-fine", name: "ケフラール細粒小児用100mg", yjCode: "6132005R1024", potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, absoluteMaxMgKg: 100, note: "通常1日20〜40mg/kgを3回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132005R1024?user=1" },

    // --- 抗生物質 (ペニシリン系) ---
    { id: "widecillin-fine-20", name: "ワイドシリン細粒20%", yjCode: "6113004R1038", potency: 200, dosage: { minMgKg: 20, maxMgKg: 40, absoluteMaxMgKg: 90, note: "1日最大90mg/kg。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6113004R1038?user=1" },
    { id: "widecillin-fine-10", name: "ワイドシリン細粒10%", yjCode: "6113004R1020", potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, note: "10%製剤。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6113004R1020?user=1" },
    { id: "sawacillin-fine", name: "サワシリン細粒10%", yjCode: "6113004R1011", potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, note: "アモキシシリン先発品。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6113004R1011?user=1" },
    { id: "paserocin-fine", name: "パセトシン細粒10%", yjCode: "6111005R1020", potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, note: "アモキシシリン先発品。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6111005R1020?user=1" },
    { id: "amoxicillin-sawai", name: "アモキシシリン細粒10%「サワイ」", yjCode: "6113004R1046", potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, note: "ワイドシリンAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6113004R1046?user=1" },
    { id: "amoxicillin-towa", name: "アモキシシリン細粒10%「トーワ」", yjCode: "6113004R1054", potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, note: "ワイドシリンAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6113004R1054?user=1" },
    { id: "amoxicillin-tatsumi", name: "アモキシシリン細粒10%「タツミ」", yjCode: "6113004R1038-T", potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, note: "AG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6113004R1038?user=1" },
    { id: "unasyn-ds", name: "ユナシン細粒小児用10%", yjCode: "6119003R1034", potency: 100, dosage: { minMgKg: 30, maxMgKg: 60, note: "通常1日30〜60mg/kgを3回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6119003R1034?user=1" },
    { id: "clavamox-ds", name: "クラバモックス小児用配合DS", yjCode: "6139502R1026", potency: 44.4, dosage: { minMgKg: 40, maxMgKg: 44.4, isByTime: true, timeMgKg: 20, timesPerDay: 2, note: "1回20mg(Amox換算)/kgを1日2回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6139502R1026?user=1" },

    // --- 抗生物質 (マクロライド系) ---
    { id: "claris-takata", name: "クラリスロマイシンDS10%「タカタ」", yjCode: "6149002R1020", potency: 100, dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 5, timesPerDay: 2, note: "1日10〜15mg/kgを2回。酸性飲料注意。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149002R1020?user=1" },
    { id: "claris-ds", name: "クラリスドライシロップ10%小児用", yjCode: "6149002R2027", potency: 100, dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 5, timesPerDay: 2, note: "通常1日10〜15mg/kgを2回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149002R2027?user=1" },
    { id: "claris-fine", name: "クラリス細粒10%小児用", yjCode: "6149002C1052", potency: 100, dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 5, timesPerDay: 2, note: "10%細粒製剤。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149002C1052?user=1" },
    { id: "claris-towa", name: "クラリスロマイシン細粒10%「トーワ」", yjCode: "6149002C1079", potency: 100, dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 5, timesPerDay: 2, note: "クラリスAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149002C1079?user=1" },
    { id: "clarisid-ds", name: "クラリシッド・ドライシロップ10%小児用", yjCode: "6149002R1038", potency: 100, dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 5, timesPerDay: 2, note: "クラリス先発同等品。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149002R1038?user=1" },
    { id: "zithromac-ds", name: "ジスロマック細粒小児用10%", yjCode: "6149004R1029", potency: 100, dosage: { minMgKg: 10, maxMgKg: 10, isByTime: true, timeMgKg: 10, timesPerDay: 1, note: "1日10mg/kgを1日1回3日間。最大500mg。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004R1029?user=1" },
    { id: "ricamycin-ds", name: "リカマイシンドライシロップ小児用", yjCode: "6149001R1033", potency: 100, dosage: { minMgKg: 30, maxMgKg: 30, note: "通常1日30mg/kgを3〜4回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149001R1033?user=1" },
    { id: "erythrocin-ds-w20", name: "エリスロシンドライシロップW20%", yjCode: "6141014R1030", potency: 200, dosage: { minMgKg: 25, maxMgKg: 50, note: "通常1日25〜50mg/kgを4〜6回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6141014R1030?user=1" },

    // --- 抗生物質 (その他) ---
    { id: "ozex-fine", name: "オゼックス小児用細粒15%", yjCode: "6241013R1025", potency: 150, dosage: { minMgKg: 12, maxMgKg: 24, isByTime: true, timeMgKg: 6, timesPerDay: 2, note: "通常1回6mg/kgを1日2回。最大1回12mg/kg。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6241013R1025?user=1" },
    { id: "tosufloxacin-takata", name: "トスフロキサシン細粒15%「タカタ」", yjCode: "6241014R1020", potency: 150, dosage: { minMgKg: 12, maxMgKg: 24, isByTime: true, timeMgKg: 6, timesPerDay: 2, note: "オゼックスAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6241014R1020?user=1" },
    { id: "farom-ds", name: "ファロムドライシロップ小児用10%", yjCode: "6192001C1037", potency: 100, dosage: { minMgKg: 15, maxMgKg: 30, isByTime: true, timeMgKg: 5, timesPerDay: 3, note: "通常1回5mg/kgを3回。最大1回10mg/kg。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6192001C1037?user=1" },
    { id: "fosmicin-ds-400", name: "ホスミシンドライシロップ400", yjCode: "6134001R1021", potency: 400, dosage: { minMgKg: 40, maxMgKg: 120, note: "1日40〜120mg/kgを3〜4回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6134001R1021?user=1" },
    { id: "minomycin-granule", name: "ミノマイシン顆粒2%", yjCode: "6151001R1026", potency: 20, dosage: { minMgKg: 4, maxMgKg: 4, isByTime: true, timeMgKg: 2, timesPerDay: 2, note: "初回4mg/kg、以後12時間ごとに2mg/kg。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6151001R1026?user=1" },

    // --- 抗ウイルス ---
    {
        id: "tamiflu-ds", name: "タミフルドライシロップ3%", yjCode: "6250021F1027", potency: 30, hasSubOptions: true, subOptions: [
            { id: "over1y", label: "1歳以上", dosage: { minMgKg: 4, maxMgKg: 4, isByTime: true, timeMgKg: 2, timesPerDay: 2, absoluteMaxMgPerTime: 75, note: "1回2mg/kgを2回。" } },
            { id: "under1y", label: "1歳未満", dosage: { minMgKg: 6, maxMgKg: 6, isByTime: true, timeMgKg: 3, timesPerDay: 2, absoluteMaxMgPerTime: 75, note: "1回3mg/kgを2回。" } }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250021F1027?user=1"
    },
    { id: "oseltamivir-sawai", name: "オセルタミビルDS3%「サワイ」", yjCode: "6250021F1035", potency: 30, dosage: { minMgKg: 4, maxMgKg: 4, isByTime: true, timeMgKg: 2, timesPerDay: 2, absoluteMaxMgPerTime: 75, note: "タミフルのジェネリック。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250021F1035?user=1" },
    { id: "valtrex-granule", name: "バラシクロビル顆粒50%「トーワ」", yjCode: "6250002D1024", potency: 500, dosage: { minMgKg: 50, maxMgKg: 50, isByTime: true, timeMgKg: 25, timesPerDay: 2, note: "通常1回25mg/kgを2回。最大500mg。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250002D1024?user=1" },
    { id: "zovirax-granule", name: "ゾビラックス顆粒40%", yjCode: "6250004R1027", potency: 400, dosage: { minMgKg: 80, maxMgKg: 80, isByTime: true, timeMgKg: 20, timesPerDay: 4, note: "通常1回20mg/kgを4回。最大800mg。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250004R1027?user=1" },

    // --- 抗アレルギー・鼻炎 ---
    {
        id: "zyrtec-ds", name: "ジルテックドライシロップ1.25%", yjCode: "4490022R1027", potency: 12.5, calcType: "fixed-age", fixedDoses: [
            { ageMin: 2, ageMax: 7, dose: 0.2, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 0.4, unit: "g", label: "7-15歳未満" }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490022R1027?user=1"
    },
    {
        id: "cetirizine-takata", name: "セチリジン塩酸塩DS1.25%「タカタ」", yjCode: "4490022R1035", potency: 12.5, calcType: "fixed-age", fixedDoses: [
            { ageMin: 2, ageMax: 7, dose: 0.2, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 0.4, unit: "g", label: "7-15歳未満" }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490022R1035?user=1"
    },
    {
        id: "allegra-ds", name: "アレグラドライシロップ5%", yjCode: "4490023F1027", potency: 50, calcType: "fixed-age", fixedDoses: [
            { ageMin: 2, ageMax: 7, dose: 0.6, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 12, dose: 1.2, unit: "g", label: "7-12歳未満" }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490023F1027?user=1"
    },
    {
        id: "fexofenadine-takata", name: "フェキソフェナジン塩酸塩DS5%「タカタ」", yjCode: "4490023F1108", potency: 50, calcType: "fixed-age", fixedDoses: [
            { ageMin: 2, ageMax: 7, dose: 0.6, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 12, dose: 1.2, unit: "g", label: "7-12歳未満" }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490023F1108?user=1"
    },
    {
        id: "xyzal-syrup", name: "ザイザルシロップ0.05%", yjCode: "4490028F1024", potency: 0.5, unit: "mL", calcType: "fixed-age", fixedDoses: [
            { ageMin: 0.5, ageMax: 1, dose: 2.5, unit: "mL", label: "6ヶ月-1歳未満(1日1回)" },
            { ageMin: 1, ageMax: 7, dose: 2.5, unit: "mL", label: "1-7歳未満(1回2回)" },
            { ageMin: 7, ageMax: 15, dose: 5.0, unit: "mL", label: "7-15歳未満(1回2回)" }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490028F1024?user=1"
    },
    {
        id: "allelock-granule", name: "アレロック顆粒0.5%", yjCode: "4490025R1026", potency: 5, calcType: "fixed-age", fixedDoses: [
            { ageMin: 2, ageMax: 7, dose: 0.5, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 1.0, unit: "g", label: "7歳以上" }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490025R1026?user=1"
    },
    { id: "alegion-ds", name: "アレジオンDS1%", yjCode: "4490021R1022", potency: 10, dosage: { minMgKg: 0.25, maxMgKg: 0.5, note: "通常1日1回0.25〜0.5mg/kg。最大1日2g(20mg)。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490021R1022?user=1" },
    { id: "zaditen-ds", name: "ザジテンドライシロップ0.1%", yjCode: "4490014R1023", potency: 1, dosage: { minMgKg: 0.06, maxMgKg: 0.06, isByTime: true, timeMgKg: 0.03, timesPerDay: 2, note: "1回0.03mg/kgを1日2回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490014R1023?user=1" },
    { id: "celtect-ds", name: "オキサトミドDS小児用2%", yjCode: "4490004R1030", potency: 20, dosage: { minMgKg: 1, maxMgKg: 1, isByTime: true, timeMgKg: 0.5, timesPerDay: 2, note: "通常1日1mg/kgを2回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490004R1030?user=1" },
    { id: "seslan-fine", name: "ゼスラン細粒小児用0.6%", yjCode: "4490019R1026", potency: 6, dosage: { minMgKg: 0.12, maxMgKg: 0.24, isByTime: true, timeMgKg: 0.06, timesPerDay: 2, note: "鼻炎時:1回0.06mg/kg。喘息時:1回0.12mg/kg。1日2回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490019R1026?user=1" },
    { id: "periactin-powder", name: "ペリアクチン散1%", yjCode: "2171022R1020", potency: 10, dosage: { minMgKg: 0.25, maxMgKg: 0.25, note: "通常1日0.25mg/kgを1〜3回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2171022R1020?user=1" },
    { id: "polaramine-powder", name: "ポララミン散1%", yjCode: "2171018R1024", potency: 10, dosage: { minMgKg: 0.125, maxMgKg: 0.25, note: "通常1日0.125〜0.25mg/kgを3〜4回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2171018R1024?user=1" },

    // --- 咳・痰 ---
    { id: "mucodyne-ds", name: "ムコダインDS50%", yjCode: "2249009F1022", potency: 500, dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "通常1回10mg/kgを3回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2249009F1022?user=1" },
    { id: "carbocisteine-takata", name: "カルボシステインDS50%「タカタ」", yjCode: "2249009F1030", potency: 500, dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "ムコダインAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2249009F1030?user=1" },
    { id: "carbocisteine-nichiiko", name: "カルボシステインDS小児用「日医工」", yjCode: "2249009F1110", potency: 333, dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "33.3%製剤。1回10mg/kg。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2249009F1110?user=1" },
    { id: "carbocisteine-towa", name: "カルボシステインDS50%「トーワ」", yjCode: "2249009F1057", potency: 500, dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "ムコダインAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2249009F1057?user=1" },
    { id: "carbocisteine-jg", name: "カルボシステインDS50%「JG」", yjCode: "2249009F1128", potency: 500, dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "AG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2249009F1128?user=1" },
    { id: "mucosolvan-ds", name: "ムコソルバンDS1.5%", yjCode: "2233002F1043", potency: 15, dosage: { minMgKg: 0.9, maxMgKg: 0.9, isByTime: true, timeMgKg: 0.3, timesPerDay: 3, note: "通常1回0.3mg/kgを3回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2233002F1043?user=1" },
    { id: "asverin-powder", name: "アスベリン散10%", yjCode: "2223001C1071", potency: 100, dosage: { minMgKg: 1, maxMgKg: 1, isByTime: true, timeMgKg: 0.33, timesPerDay: 3, note: "通常1日1mg/kgを3回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2223001C1071?user=1" },
    { id: "medicon-powder", name: "メジコン散10%", yjCode: "2249010C1032", potency: 100, dosage: { minMgKg: 1, maxMgKg: 2, note: "通常1日1〜2mg/kgを3〜4回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2249010C1032?user=1" },
    { id: "hokunalin-ds", name: "ホクナリンDS0.1%小児用", yjCode: "2251001C1027", potency: 1, dosage: { minMgKg: 0.04, maxMgKg: 0.04, isByTime: true, timeMgKg: 0.02, timesPerDay: 2, note: "通常1回0.02mg/kgを2回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2251001C1027?user=1" },
    { id: "tulobuterol-takata", name: "ツロブテロールDS0.1%「タカタ」", yjCode: "2251002F1030", potency: 1, dosage: { minMgKg: 0.04, maxMgKg: 0.04, isByTime: true, timeMgKg: 0.02, timesPerDay: 2, note: "ホクナリンAG。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2251002F1030?user=1" },
    { id: "theophylline-ds", name: "テオドールドライシロップ20%", yjCode: "2254001F1029", potency: 200, dosage: { minMgKg: 20, maxMgKg: 20, isByTime: true, timeMgKg: 10, timesPerDay: 2, note: "1日20mg/kgを2回。除放性。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2254001F1029?user=1" },

    // --- 喘息 ---
    {
        id: "singulair-fine", name: "シングレア細粒4mg", yjCode: "4490026R1020", potency: 1, unit: "包", calcType: "fixed-age", fixedDoses: [
            { ageMin: 1, ageMax: 6, dose: 1.0, unit: "包", label: "1-6歳未満" }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490026R1020?user=1"
    },
    {
        id: "kipres-fine", name: "キプレス細粒4mg", yjCode: "4490026R1038", potency: 1, unit: "包", calcType: "fixed-age", fixedDoses: [
            { ageMin: 1, ageMax: 6, dose: 1.0, unit: "包", label: "1-6歳未満" }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490026R1038?user=1"
    },
    {
        id: "montelukast-takata", name: "モンテルカスト細粒4mg「タカタ」", yjCode: "4490026R1046", potency: 1, unit: "包", calcType: "fixed-age", fixedDoses: [
            { ageMin: 1, ageMax: 6, dose: 1.0, unit: "包", label: "1-6歳未満" }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490026R1046?user=1"
    },
    { id: "onon-ds", name: "オノンDS10%", yjCode: "4490020F1023", potency: 100, dosage: { minMgKg: 7, maxMgKg: 7, isByTime: true, timeMgKg: 3.5, timesPerDay: 2, note: "1日7mg/kgを朝食後・夕食後。最大450mg。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490020F1023?user=1" },

    // --- 解熱鎮痛 ---
    { id: "calonal-20", name: "カロナール細粒20%", yjCode: "1141007C1077", potency: 200, dosage: { minMgKg: 10, maxMgKg: 15, absoluteMaxMgKg: 60, isByTime: true, timeMgKg: 10, timesPerDay: 4, note: "1回10〜15mg/kg。原則4時間空ける。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007C1077?user=1" },
    { id: "calonal-50", name: "カロナール細粒50%", yjCode: "1141007C1085", potency: 500, dosage: { minMgKg: 10, maxMgKg: 15, absoluteMaxMgKg: 60, isByTime: true, timeMgKg: 10, timesPerDay: 4, note: "1回10〜15mg/kg。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007C1085?user=1" },
    { id: "calonal-syrup", name: "カロナールシロップ2%", yjCode: "1141007Q1056", potency: 20, unit: "mL", dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 10, timesPerDay: 4, note: "1回10〜15mg/kg。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007Q1056?user=1" },
    { id: "brufen-granule", name: "ブルフェン顆粒20%", yjCode: "1124009F1043", potency: 200, dosage: { minMgKg: 20, maxMgKg: 30, note: "通常1日20〜30mg/kgを3回。空腹時避ける。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1124009F1043?user=1" },

    // --- 整腸剤・胃腸薬 ---
    { id: "miya-bm", name: "ミヤBM細粒", yjCode: "2316001C1052", potency: 1, calcType: "age", adultDose: 3, unit: "g", dosage: { note: "目安1日1.5〜3g(3回)。Augsberger式参考。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316001C1052?user=1" },
    { id: "biofermin-r", name: "ビオフェルミンR散", yjCode: "2316012F1023", potency: 1, calcType: "fixed-age", fixedDoses: [{ ageMin: 0, ageMax: 15, dose: 1.0, unit: "g", label: "目安1日1g(3回)" }], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316012F1023?user=1" },
    { id: "luck-b-n", name: "ラックビー微粒N", yjCode: "2316008C1032", potency: 1, calcType: "fixed-age", fixedDoses: [{ ageMin: 0, ageMax: 15, dose: 1.5, unit: "g", label: "目安1日1.5g(3回)" }], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316008C1032?user=1" },
    { id: "nauzelin-ds", name: "ナウゼリンドライシロップ1%", yjCode: "2399004C1045", potency: 10, dosage: { minMgKg: 1, maxMgKg: 2, isByTime: true, timeMgKg: 0.33, timesPerDay: 3, note: "1日1〜2mg/kgを3回。食前。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2399004C1045?user=1" },

    // --- その他 ---
    { id: "incremin-syrup", name: "インクレミンシロップ5%", yjCode: "3229002C1020", potency: 6, unit: "mL", dosage: { minMgKg: 3, maxMgKg: 6, note: "1日3〜6mg(鉄換算)/kg。シロップ剤。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/3229002C1020?user=1" },
    { id: "keppra-ds", name: "イーケプラドライシロップ50%", yjCode: "1179045F1022", potency: 500, dosage: { minMgKg: 20, maxMgKg: 60, isByTime: true, timeMgKg: 10, timesPerDay: 2, note: "1回10〜30mg/kg。12時間間隔。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1179045F1022?user=1" },
    { id: "depakene-fine-40", name: "デパケン細粒40%", yjCode: "3929004F1030", potency: 400, dosage: { minMgKg: 15, maxMgKg: 40, isByTime: true, timeMgKg: 7.5, timesPerDay: 2, note: "通常1日15〜40mg/kgを2〜3回。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/3929004F1030?user=1" },
    { id: "pl-granule", name: "PL配合顆粒", yjCode: "1180001C1037", potency: 1, calcType: "age", adultDose: 3, unit: "g", dosage: { note: "2歳未満禁忌。Augsberger式参考。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1180001C1037?user=1" },
    { id: "kakkonto", name: "ツムラ葛根湯エキス顆粒", yjCode: "5200001D1024", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式による算出。7.5g/日基準。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200001D1024?user=1" },
    { id: "yokukansan", name: "ツムラ抑肝散エキス顆粒", yjCode: "5200138D1022", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式による算出。7.5g/日基準。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200138D1022?user=1" },
    { id: "shakuyaku", name: "ツムラ芍薬甘草湯エキス顆粒", yjCode: "5200067D1025", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式による算出。7.5g/日基準。" }, piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200067D1025?user=1" }
];

let selectedDrugId = null;
let selectedSubOptionId = null;
let currentSearchQuery = '';

function renderDrugCards() {
    const container = document.getElementById('drug-cards-container');
    if (!container) return;
    const query = currentSearchQuery.toLowerCase();
    const filteredDrugs = PEDIATRIC_DRUGS.filter(d =>
        d.name.toLowerCase().includes(query) || d.yjCode.toLowerCase().includes(query)
    );
    if (filteredDrugs.length === 0) {
        container.innerHTML = '<div class="col-span-full py-10 text-center text-gray-400 font-bold">該当する薬剤が見つかりません</div>';
        return;
    }
    container.innerHTML = filteredDrugs.map(d => `
        <div class="drug-card ${selectedDrugId === d.id ? 'active' : ''}" data-id="${d.id}">
            <div class="potency-tag text-[8px]">${d.calcType === 'age' ? '漢方・年齢' : (d.calcType === 'fixed-age' ? '固定量' : (d.potency >= 100 ? (d.potency / 10).toFixed(1) + '%' : d.potency + (d.unit || 'mg') + '/g'))}</div>
            <h3 class="text-[9px] sm:text-xs font-black leading-tight mb-1 h-8 overflow-hidden">${d.name}</h3>
            <div class="text-[7px] text-gray-400 mt-auto font-mono">YJ: ${d.yjCode}</div>
        </div>
    `).join('');
    document.querySelectorAll('.drug-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedDrugId = card.dataset.id;
            const drug = PEDIATRIC_DRUGS.find(d => d.id === selectedDrugId);
            if (drug.hasSubOptions) {
                selectedSubOptionId = drug.subOptions[0].id;
                renderSubOptions(drug);
                document.getElementById('sub-option-area').classList.remove('hidden');
            } else {
                selectedSubOptionId = null;
                document.getElementById('sub-option-area').classList.add('hidden');
            }
            const ageGroup = document.getElementById('age').closest('.form-group');
            const weightGroup = document.getElementById('body-weight').closest('.form-group');
            if (drug.calcType === 'age' || drug.calcType === 'fixed-age') {
                ageGroup.classList.add('ring-2', 'ring-indigo-400', 'bg-indigo-50/30');
                weightGroup.classList.remove('ring-2', 'ring-blue-400', 'bg-blue-50/30');
            } else {
                weightGroup.classList.add('ring-2', 'ring-blue-400', 'bg-blue-50/30');
                ageGroup.classList.remove('ring-2', 'ring-indigo-400', 'bg-indigo-50/30');
            }
            document.getElementById('calc-main-area').classList.remove('hidden');
            document.getElementById('initial-guide').classList.add('hidden');
            renderDrugCards();
            updateCalculations();
            document.getElementById('result-area').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
}

function renderSubOptions(drug) {
    const container = document.getElementById('sub-option-container');
    container.innerHTML = drug.subOptions.map(opt => `
        <label class="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition ${selectedSubOptionId === opt.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}">
            <input type="radio" name="sub-option" value="${opt.id}" ${selectedSubOptionId === opt.id ? 'checked' : ''} class="w-4 h-4 text-indigo-600">
            <span class="text-sm font-bold">${opt.label}</span>
        </label>
    `).join('');
    document.querySelectorAll('input[name="sub-option"]').forEach(input => {
        input.addEventListener('change', (e) => {
            selectedSubOptionId = e.target.value;
            renderSubOptions(drug);
            updateCalculations();
        });
    });
}

function updateCalculations() {
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('body-weight');
    const piContainer = document.getElementById('pi-container');
    const resultArea = document.getElementById('result-area');
    let drug = PEDIATRIC_DRUGS.find(d => d.id === selectedDrugId);
    if (!drug) return;
    const age = parseFloat(ageInput.value) || 0;
    const weight = parseFloat(weightInput.value) || 0;
    piContainer.innerHTML = `
        <div class="pi-card bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 mt-6 shadow-sm">
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold text-amber-800 uppercase tracking-widest"><i class="fas fa-file-alt"></i> 添付文書 引用</span>
                <a href="${drug.piUrl}" target="_blank" class="text-xs text-blue-600 hover:underline font-bold">PMDAリダイレクト <i class="fas fa-external-link-alt"></i></a>
            </div>
            <div class="text-[10px] text-gray-800 leading-relaxed italic mb-2 font-medium">
                「${drug.hasSubOptions ? drug.subOptions.find(o => o.id === selectedSubOptionId)?.piSnippet || '詳細はリンク先参照' : drug.piSnippet || '詳細はリンク先参照'}」
            </div>
            <div class="text-[8px] text-gray-400 text-right font-mono">YJ: ${drug.yjCode}</div>
        </div>
    `;
    if (drug.calcType === 'age') {
        const factor = (age * 4 + 20) / 100;
        const childDose = drug.adultDose * factor;
        resultArea.innerHTML = `
            <div class="bg-indigo-600 text-white p-6 rounded-xl shadow-lg border-b-4 border-indigo-800">
                <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Augsberger式算出 (${age}歳 | 成人量の${(factor * 100).toFixed(0)}%)</div>
                <div class="flex items-baseline gap-2">
                    <span class="text-2xl font-black">${childDose.toFixed(2)}</span>
                    <span class="text-xl font-bold">${drug.unit || 'g'} / 日</span>
                </div>
                <div class="text-[10px] opacity-70">(成人量 ${drug.adultDose}${drug.unit || 'g'}/日 基準)</div>
            </div>
        `;
    } else if (drug.calcType === 'fixed-age') {
        const found = drug.fixedDoses.find(fd => age >= fd.ageMin && age < fd.ageMax);
        if (found) {
            resultArea.innerHTML = `
                <div class="bg-purple-600 text-white p-6 rounded-xl shadow-lg border-b-4 border-purple-800">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">年齢別基準量 (${found.label})</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-black">${found.dose}</span>
                        <span class="text-xl font-bold">${found.unit} / 回</span>
                    </div>
                </div>
            `;
        } else {
            resultArea.innerHTML = '<p class="text-center text-rose-500 py-10 font-bold bg-rose-50 rounded-xl">対象年齢範囲外、またはデータなし</p>';
        }
    } else {
        if (!weight) {
            resultArea.innerHTML = '<p class="text-center text-blue-500 py-10 font-bold bg-blue-50 rounded-xl">体重を入力してください</p>';
            return;
        }
        let dose = drug.hasSubOptions ? drug.subOptions.find(o => o.id === selectedSubOptionId).dosage : drug.dosage;
        const minG = (weight * dose.minMgKg) / drug.potency;
        const maxG = (weight * dose.maxMgKg) / drug.potency;
        if (dose.isByTime) {
            let timeG = (weight * dose.timeMgKg) / drug.potency;
            if (dose.absoluteMaxMgPerTime && (weight * dose.timeMgKg) > dose.absoluteMaxMgPerTime) {
                timeG = dose.absoluteMaxMgPerTime / drug.potency;
            }
            resultArea.innerHTML = `
                <div class="bg-blue-600 text-white p-6 rounded-xl shadow-lg border-b-4 border-blue-800">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">1回分量 (${dose.timeMgKg}mg/kg)</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-black">${timeG.toFixed(2)}</span>
                        <span class="text-xl font-bold">${drug.unit || 'g'} / 回</span>
                    </div>
                </div>
            `;
        } else {
            const isRange = minG !== maxG;
            resultArea.innerHTML = `
                <div class="bg-indigo-700 text-white p-6 rounded-xl shadow-lg border-b-4 border-indigo-900">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">通常1日用量 (${dose.minMgKg}${isRange ? '-' + dose.maxMgKg : ''}mg/kg)</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-black">${minG.toFixed(2)}${isRange ? ' 〜 ' + maxG.toFixed(2) : ''}</span>
                        <span class="text-xl font-bold">${drug.unit || 'g'} / 日</span>
                    </div>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('medicine-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            renderDrugCards();
        });
    }
    document.getElementById('body-weight').addEventListener('input', updateCalculations);
    document.getElementById('age').addEventListener('input', updateCalculations);
    renderDrugCards();
});
