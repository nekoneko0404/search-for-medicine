const PEDIATRIC_DRUGS = [
    // --- 抗生物質 (セフェム系) ---
    {
        id: "meiact-ms",
        name: "メイアクトMS小児用細粒10%",
        yjCode: "6132016R1026",
        potency: 100,
        dosage: { minMgKg: 9, maxMgKg: 18, absoluteMaxMgKg: 18, note: "通常1日9〜18mg/kgを3回。1回上限6mg/kg。" },
        piSnippet: "セフジトレン ピボキシルとして1日9〜18mg/kgを3回に分割して経口投与する。なお、年齢、症状により適宜増減するが、1回6mg/kg、1日18mg/kgを上限とする。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016R1026?user=1"
    },
    { id: "meiact-amel", name: "セフジトレンピボキシル細粒10%「アメル」", yjCode: "6132016C1046", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "メイアクトAG。" }, piSnippet: "セフジトレン ピボキシルとして1日9〜18mg/kgを3回に分割して経口投与する。1回6mg/kg、1日18mg/kgを上限とする。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1046?user=1" },
    { id: "meiact-nichiiko", name: "セフジトレンピボキシル細粒10%「日医工」", yjCode: "6132015C1090", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "メイアクトAG。" }, piSnippet: "セフジトレン ピボキシルとして1日9〜18mg/kgを3回に分割して経口投与する。1回6mg/kg、1日18mg/kgを上限とする。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132015C1090?user=1" },
    { id: "flomox-ds", name: "フロモックス小児用細粒100mg", yjCode: "6132013R1036", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを3回。" }, piSnippet: "セフカペン ピボキシル塩酸塩水和物として1日9〜18mg/kgを3回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013R1036?user=1" },
    { id: "flomox-sawai", name: "セフカペンピボキシル塩酸塩細粒10%「サワイ」", yjCode: "6132013R1044", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを3回。" }, piSnippet: "セフカペン ピボキシル塩酸塩水和物として1日9〜18mg/kgを3回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013R1044?user=1" },
    { id: "flomox-towa", name: "セフカペンピボキシル塩酸塩細粒10%「トーワ」", yjCode: "6132013R1079", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを3回。" }, piSnippet: "セフカペン ピボキシル塩酸塩水和物として1日9〜18mg/kgを3回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013R1079?user=1" },
    { id: "vanan-ds", name: "バナン小児用ドライシロップ10%", yjCode: "6132009R1023", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを2〜3回。" }, piSnippet: "セフポドキシム プロキセチルとして1日9〜18mg/kgを2〜3回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132009R1023?user=1" },
    { id: "cefdinir-astellas", name: "セフゾン細粒小児用10%", yjCode: "6132014R1030", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "1日9〜18mg/kgを3回。" }, piSnippet: "セフジニルとして1日9〜18mg/kgを3回に分割経口投与する。なお、年齢、症状により適宜増減する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132014R1030?user=1" },
    { id: "tomilon-fine", name: "トミロン細粒小児用10%", yjCode: "6132012C1020", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "1日9〜18mg/kgを3回。" }, piSnippet: "セフテラム ピボキシルとして1日9〜18mg/kgを3回に分割して経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132012C1020?user=1" },
    { id: "kefral-fine", name: "ケフラール細粒小児用100mg", yjCode: "6132005R1024", potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, absoluteMaxMgKg: 100, note: "通常1日20〜40mg/kgを3回。" }, piSnippet: "セファクロルとして1日20〜40mg/kgを3回に分割して経口投与する。重症等の場合には1日100mg/kgまで増量できる。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132005R1024?user=1" },

    // --- 抗生物質 (ペニシリン系) ---
    { id: "widecillin-fine-20", name: "ワイドシリン細粒20%", yjCode: "6113004R1038", potency: 200, dosage: { minMgKg: 20, maxMgKg: 40, absoluteMaxMgKg: 90, note: "1日最大90mg/kg。" }, piSnippet: "アモキシシリン水和物として1日20〜40mg/kgを3〜4回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6113004R1038?user=1" },
    { id: "sawacillin-fine", name: "サワシリン細粒10%", yjCode: "6131001C1022", potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, note: "1日20〜40mg/kgを3〜4回。" }, piSnippet: "アモキシシリン水和物として1日20〜40mg/kgを3〜4回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C1022?user=1" },
    { id: "pasetocin-fine", name: "パセトシン細粒10%", yjCode: "6131001C1030", potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, note: "1日20〜40mg/kgを3〜4回。" }, piSnippet: "アモキシシリン水和物として1日20〜40mg/kgを3〜4回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C1030?user=1" },
    { id: "unasyn-ds", name: "ユナシン細粒小児用10%", yjCode: "6119003R1034", potency: 100, dosage: { minMgKg: 30, maxMgKg: 60, note: "通常1日30〜60mg/kgを3回。" }, piSnippet: "スルタミシリントシル酸塩水和物として1日30〜60mg/kgを3回に分割して経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6119003R1034?user=1" },
    { id: "clavamox-ds", name: "クラバモックス小児用配合DS", yjCode: "6139100R1036", potency: 44.4, dosage: { minMgKg: 40, maxMgKg: 44.4, isByTime: true, timeMgKg: 20, timesPerDay: 2, note: "1回20mg(Amox換算)/kgを12時間ごと(1日2回)。" }, piSnippet: "通常、小児には、アモキシシリン水和物及びクラブラン酸カリウムとして1回20mg/kg（アモキシシリン計量）を12時間ごとに経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6139100R1036?user=1" },

    // --- 抗生物質 (マクロライド系) ---
    { id: "claris-takata", name: "クラリスロマイシンDS10%「タカタ」", yjCode: "6149002R1020", potency: 100, dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 5, timesPerDay: 2, note: "1日10〜15mg/kgを2回。" }, piSnippet: "クラリスロマイシンとして1日10〜15mg/kgを2回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149002R1020?user=1" },
    { id: "clarith-ds-abbott", name: "クラリスロマイシンDS10%「アボット」", yjCode: "6149002R1040", potency: 100, dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 5, timesPerDay: 2, note: "1日10〜15mg/kgを2回。" }, piSnippet: "クラリスロマイシンとして1日10〜15mg/kgを2回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149002R1040?user=1" },
    { id: "zithromac-ds", name: "ジスロマック細粒小児用10%", yjCode: "6149004R1029", potency: 100, dosage: { minMgKg: 10, maxMgKg: 10, isByTime: true, timeMgKg: 10, timesPerDay: 1, note: "1回10mg/kgを3日間。" }, piSnippet: "アジスロマイシン水和物として1日1回10mg/kgを3日間経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004R1029?user=1" },

    // --- 抗生物質 (その他) ---
    { id: "ozex-fine", name: "オゼックス小児用細粒15%", yjCode: "6241013R1025", potency: 150, dosage: { minMgKg: 12, maxMgKg: 24, isByTime: true, timeMgKg: 6, timesPerDay: 2, note: "通常1回6mg/kgを1日2回。最大1回12mg/kg。" }, piSnippet: "トスフロキサシントシル酸塩水和物として1回6mg/kgを1日2回経口投与する。なお、必要に応じて1回12mg/kgまで増量できる。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6241013R1025?user=1" },
    { id: "farom-ds", name: "ファロムドライシロップ小児用10%", yjCode: "6192001C1037", potency: 100, dosage: { minMgKg: 15, maxMgKg: 30, isByTime: true, timeMgKg: 5, timesPerDay: 3, note: "通常1回5mg/kgを3回。最大1回10mg/kg。" }, piSnippet: "ファロペネムナトリウム水和物として1回5mg/kgを1日3回経口投与する。増量する場合には1回10mg/kgを上限とする。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6192001C1037?user=1" },

    // --- 抗ウイルス ---
    {
        id: "tamiflu-ds", name: "タミフルドライシロップ3%", yjCode: "6250021R1020", potency: 30, hasSubOptions: true, subOptions: [
            { id: "over1y", label: "1歳以上", dosage: { minMgKg: 4, maxMgKg: 4, isByTime: true, timeMgKg: 2, timesPerDay: 2, absoluteMaxMgPerTime: 75, note: "1回2mg/kgを2回。5日間。" }, piSnippet: "1回2mg/kgを1日2回、5日間経口投与する。ただし、1回最高用量は75mgとする。" },
            { id: "under1y", label: "1歳未満", dosage: { minMgKg: 6, maxMgKg: 6, isByTime: true, timeMgKg: 3, timesPerDay: 2, absoluteMaxMgPerTime: 75, note: "1回3mg/kgを2回。5日間。" }, piSnippet: "1回3mg/kgを1日2回、5日間経口投与する。ただし、1回最高用量は75mgとする。" }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250021R1020?user=1"
    },
    { id: "valtrex-granule", name: "バラシクロビル顆粒50%「トーワ」", yjCode: "6250002D1024", potency: 500, dosage: { minMgKg: 50, maxMgKg: 50, isByTime: true, timeMgKg: 25, timesPerDay: 2, note: "通常1回25mg/kgを2回。" }, piSnippet: "バラシクロビルとして1回25mg/kgを1日2回経口投与する。ただし、1回最高用量は500mgとする。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250002D1024?user=1" },
    { id: "zovirax-granule", name: "ゾビラックス顆粒40%", yjCode: "6250001D1020", potency: 400, dosage: { minMgKg: 40, maxMgKg: 80, isByTime: true, timeMgKg: 20, timesPerDay: 4, note: "通常1回20mg/kgを4回。" }, piSnippet: "アシクロビルとして1回20mg/kgを1日4回経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250001D1020?user=1" },

    // --- 抗アレルギー・鼻炎 ---
    {
        id: "zyrtec-ds", name: "ジルテックドライシロップ1.25%", yjCode: "4490022R1027", potency: 12.5, calcType: "fixed-age", fixedDoses: [
            { ageMin: 2, ageMax: 7, dose: 0.2, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 0.4, unit: "g", label: "7-15歳未満" }
        ], piSnippet: "2歳以上7歳未満：1回0.2gを1日2回。7歳以上15歳未満：1回0.4gを1日2回。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490022R1027?user=1"
    },
    {
        id: "allegra-ds", name: "アレグラドライシロップ5%", yjCode: "4490023F1027", potency: 50, calcType: "fixed-age", fixedDoses: [
            { ageMin: 2, ageMax: 7, dose: 0.6, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 12, dose: 1.2, unit: "g", label: "7-12歳未満" }
        ], piSnippet: "2歳以上7歳未満：1回0.6gを1日2回。7歳以上12歳未満：1回1.2gを1日2回。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490023F1027?user=1"
    },
    { id: "alegion-ds", name: "アレジオンDS1%", yjCode: "4490021R1022", potency: 10, dosage: { minMgKg: 0.25, maxMgKg: 0.5, note: "通常1日1回0.25〜0.5mg/kg。" }, piSnippet: "エピナスチン塩酸塩として1回0.25〜0.5mg/kgを1日1回経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490021R1022?user=1" },
    { id: "seslan-fine", name: "ゼスラン細粒小児用0.6%", yjCode: "4490019R1026", potency: 6, dosage: { minMgKg: 0.12, maxMgKg: 0.24, isByTime: true, timeMgKg: 0.06, timesPerDay: 2, note: "通常1回0.06(鼻炎)〜0.12(喘息)mg/kgを2回。" }, piSnippet: "メキタジンとして1回0.06mg/kg（鼻炎等）、1回0.12mg/kg（喘息）を1日2回経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490019R1026?user=1" },
    {
        id: "clara-ds", name: "クラリチンドライシロップ1%", yjCode: "4490026R1025", potency: 10, calcType: "fixed-age", fixedDoses: [
            { ageMin: 3, ageMax: 7, dose: 0.5, unit: "g", label: "3-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 1.0, unit: "g", label: "7歳以上" }
        ], piSnippet: "3歳以上7歳未満：1回0.5g（ロラタジンとして5mg）を1日1回。7歳以上：1回1g（ロラタジンとして10mg）を1日1回。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490026R1025?user=1"
    },
    {
        id: "bilanoa-ds", name: "ビラノアドライシロップ3%", yjCode: "4490033F1023", potency: 30, calcType: "fixed-age", fixedDoses: [
            { ageMin: 12, ageMax: 100, dose: 0.67, unit: "g", label: "12歳以上" }
        ], piSnippet: "12歳以上の小児：1回0.67g（ビラスチンとして20mg）を1日1回空腹時に経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490033F1023?user=1"
    },

    // --- 咳・痰 ---
    { id: "mucodyne-ds", name: "ムコダインDS50%", yjCode: "2249009F1022", potency: 500, dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "通常1回10mg/kgを3回。" }, piSnippet: "カルボシステインとして1回10mg/kgを1日3回経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2249009F1022?user=1" },
    { id: "carbocisteine-nichiiko", name: "カルボシステインDS50%「日医工」", yjCode: "2233002R2070", potency: 500, dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "通常1回10mg/kgを3回。" }, piSnippet: "カルボシステインとして1回10mg/kgを1日3回経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2233002R2070?user=1" },
    { id: "asverin-powder", name: "アスベリン散10%", yjCode: "2223001C1071", potency: 100, dosage: { minMgKg: 1, maxMgKg: 1, isByTime: true, timeMgKg: 0.33, timesPerDay: 3, note: "通常1日1mg/kgを3回。" }, piSnippet: "チペピジンヒベンズ酸塩として1日1mg/kgを3回に分割して経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2223001C1071?user=1" },
    { id: "メジコン散", name: "メジコン散10%", yjCode: "2229001B1030", potency: 100, dosage: { minMgKg: 1, maxMgKg: 2, isByTime: true, timeMgKg: 0.33, timesPerDay: 3, note: "通常1日1〜2mg/kgを3〜4回。" }, piSnippet: "デキストロメトルファン臭化水素酸塩水和物として1日1〜2mg/kgを3〜4回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2229001B1030?user=1" },
    { id: "hokunalin-ds", name: "ホクナリンDS0.1%小児用", yjCode: "2251001C1027", potency: 1, dosage: { minMgKg: 0.04, maxMgKg: 0.04, isByTime: true, timeMgKg: 0.02, timesPerDay: 2, note: "通常1回0.02mg/kgを2回。" }, piSnippet: "ツロブテロールとして1日0.04mg/kgを2回に分けて経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2251001C1027?user=1" },
    { id: "meptin-granule", name: "メプチン顆粒0.01%", yjCode: "2259002D1024", potency: 0.1, dosage: { minMgKg: 0.0025, maxMgKg: 0.0025, isByTime: true, timeMgKg: 0.00125, timesPerDay: 2, note: "通常1回1.25μg/kgを2回。" }, piSnippet: "プロカテロール塩酸塩水和物として1回1.25μg/kgを1日2回、経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2259002D1024?user=1" },

    // --- 解熱鎮痛 ---
    { id: "calonal-20", name: "カロナール細粒20%", yjCode: "1141007C1077", potency: 200, dosage: { minMgKg: 10, maxMgKg: 15, absoluteMaxMgKg: 60, isByTime: true, timeMgKg: 10, timesPerDay: 4, note: "1回10〜15mg/kg。原則4時間空ける。" }, piSnippet: "アセトアミノフェンとして1回10〜15mg/kgを経口投与する。投与間隔は4〜6時間以上とし、1日総量として60mg/kgを超えないこと。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007C1077?user=1" },

    // --- 整腸剤・漢方 ---
    { id: "miya-bm", name: "ミヤBM細粒", yjCode: "2316001C1052", potency: 1, calcType: "age", adultDose: 3, unit: "g", dosage: { note: "目安1日1.5〜3g(3回)。" }, piSnippet: "通常1日1.5〜3gを3回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316001C1052?user=1" },
    { id: "bio-three", name: "ビオスリー配合散", yjCode: "2316101B1030", potency: 1, calcType: "age", adultDose: 3, unit: "g", dosage: { note: "目安1日1.5〜3g(3回)。" }, piSnippet: "通常1日1.5〜3gを3回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316101B1030?user=1" },
    { id: "rackby-fine", name: "ラックビー微粒N", yjCode: "2316009C1032", potency: 1, calcType: "age", adultDose: 6, unit: "g", dosage: { note: "目安1日2〜6g(3回)。" }, piSnippet: "通常小児1日2〜6gを3回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316009C1032?user=1" },
    { id: "kakkonto", name: "ツムラ葛根湯エキス顆粒", yjCode: "5200001D1024", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "成人1日7.5gを2〜3回に分割投与。小児には年齢に応じて適宜減量。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200001D1024?user=1" },
    { id: "shoseiryuto", name: "ツムラ小青竜湯エキス顆粒", yjCode: "5200025D1020", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200025D1020?user=1" },
    { id: "bakumondoto", name: "ツムラ麦門冬湯エキス顆粒", yjCode: "5200034D1029", potency: 1, calcType: "age", adultDose: 9, unit: "g", dosage: { note: "Augsberger式。9g/日基準。" }, piSnippet: "成人1日9gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200034D1029?user=1" },
    { id: "makyokansekito", name: "ツムラ麻杏甘石湯エキス顆粒", yjCode: "5200122D1021", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200122D1021?user=1" },
    { id: "gokosanto", name: "ツムラ五虎湯エキス顆粒", yjCode: "5200022D1026", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200022D1026?user=1" },
    { id: "shosaikoto", name: "ツムラ小柴胡湯エキス顆粒", yjCode: "5200054D1028", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200054D1028?user=1" },
    { id: "hangeshashinto", name: "ツムラ半夏瀉心湯エキス顆粒", yjCode: "5200094D1028", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200094D1028?user=1" },
    { id: "orengedokuto", name: "ツムラ黄連解毒湯エキス顆粒", yjCode: "5200003D1023", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200003D1023?user=1" },
    { id: "hochuekkito", name: "ツムラ補中益気湯エキス顆粒", yjCode: "5200108D1029", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200108D1029?user=1" },
    { id: "rokumiogan", name: "ツムラ六味丸エキス顆粒", yjCode: "5200143D1023", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200143D1023?user=1" },
    { id: "hachimijiogan", name: "ツムラ八味地黄丸エキス顆粒", yjCode: "5200091D1021", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200091D1021?user=1" },
    { id: "goreisan", name: "ツムラ五苓散エキス顆粒", yjCode: "5200021D1030", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200021D1030?user=1" },
    { id: "maoto", name: "ツムラ麻黄湯エキス顆粒", yjCode: "5200026D1024", potency: 1, calcType: "age", adultDose: 5, unit: "g", dosage: { note: "Augsberger式。5g/日基準。" }, piSnippet: "通常成人1日5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200026D1024?user=1" },
    { id: "senkyuchachosan", name: "ツムラ川芎茶調散エキス顆粒", yjCode: "5200002D1028", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200002D1028?user=1" },
    { id: "hangekobokuto", name: "ツムラ半夏厚朴湯エキス顆粒", yjCode: "5200031D1025", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200031D1025?user=1" },
    { id: "kamikihito", name: "ツムラ加味帰脾湯エキス顆粒", yjCode: "5200010D1022", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200010D1022?user=1" },
    { id: "keishikashakuyakuto", name: "ツムラ桂枝加芍薬湯エキス顆粒", yjCode: "5200041D1022", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200041D1022?user=1" },
    { id: "keishito", name: "ツムラ桂枝湯エキス顆粒", yjCode: "5200043D1020", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200043D1020?user=1" },
    { id: "orengedokuto-p", name: "ツムラ黄連解毒湯(小児用)", yjCode: "5200003D1023", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。重複注意。" }, piSnippet: "成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200003D1023?user=1" },
    { id: "shakuyakukanzonto", name: "ツムラ芍薬甘草湯エキス顆粒", yjCode: "5200067D1025", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200067D1025?user=1" },

    // --- その他 ---
    { id: "incremin-syrup", name: "インクレミンシロップ5%", yjCode: "3229002C1020", potency: 6, unit: "mL", dosage: { minMgKg: 3, maxMgKg: 6, note: "通常1日3〜6mg(鉄換算)/kgを3回。" }, piSnippet: "通常1日3〜6mg/kgを食後3回に分けて経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/3229002C1020?user=1" },
    { id: "keppra-ds", name: "イーケプラドライシロップ50%", yjCode: "1179045F1022", potency: 500, dosage: { minMgKg: 20, maxMgKg: 60, isByTime: true, timeMgKg: 10, timesPerDay: 2, note: "通常1回10〜30mg/kgを2回。" }, piSnippet: "通常1回10mg/kgを1日2回。症状により1回30mg/kgまで増量可。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1179045F1022?user=1" },
    { id: "depakene-fine-40", name: "デパケン細粒40%", yjCode: "3929004F1030", potency: 400, dosage: { minMgKg: 15, maxMgKg: 40, isByTime: true, timeMgKg: 7.5, timesPerDay: 2, note: "通常1日15〜40mg/kgを2〜3回。" }, piSnippet: "通常1日15〜40mg/kgを1日2〜3回に分けて経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/3929004F1030?user=1" },
    { id: "pl-granule", name: "PL配合顆粒", yjCode: "1180001C1037", potency: 1, calcType: "age", adultDose: 3, unit: "g", dosage: { note: "2歳未満禁忌。Augsberger式参考。" }, piSnippet: "通常成人1回1gを1日3〜4回。年齢、症状により適宜増減。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1180001C1037?user=1" },
    { id: "peon-granule", name: "ピーエイ配合顆粒", yjCode: "1180001C1096", potency: 1, calcType: "age", adultDose: 3, unit: "g", dosage: { note: "2歳未満禁忌。Augsberger式参考。" }, piSnippet: "通常成人1回1gを1日3〜4回。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1180001C1096?user=1" },
    {
        id: "singulair-fine", name: "シングレア細粒4mg", yjCode: "4490027C1021", potency: 1, calcType: "fixed-age", fixedDoses: [
            { ageMin: 1, ageMax: 6, dose: 1, unit: "個", label: "1歳-6歳未満(4mg)" }
        ], piSnippet: "1歳以上6歳未満の小児：通常、1日1回1包（モンテルカストとして4mg）を経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490027C1021?user=1"
    },
    { id: "onon-ds", name: "オノンドライシロップ10%小児用", yjCode: "4490013R1036", potency: 100, dosage: { minMgKg: 14, maxMgKg: 14, isByTime: true, timeMgKg: 7, timesPerDay: 2, note: "通常1回7mg/kgを1日2回。" }, piSnippet: "通常、小児にはプランルカスト水和物として1日量14mg/kgを朝食後及び夕食後の2回に分け経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490013R1036?user=1" },
    { id: "strong-sanmiyari", name: "強ミヤリサン錠", yjCode: "2316001F1024", potency: 1, calcType: "age", adultDose: 9, unit: "錠", dosage: { note: "Augsberger式。9錠/日基準。" }, piSnippet: "通常1日9錠を3回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316001F1024?user=1" },
    { id: "decadron-elixir", name: "デカドロンエリキシル0.01%", yjCode: "2454002S1021", potency: 0.1, dosage: { minMgKg: 0.05, maxMgKg: 0.2, isByTime: true, timeMgKg: 0.05, timesPerDay: 3, note: "通常1日0.05〜0.2mg/kgを1〜4回。" }, piSnippet: "通常、小児にはデキサメタゾンとして1日0.05〜0.2mg/kgを1〜4回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2454002S1021?user=1" },
    { id: "yokukansan", name: "ツムラ抑肝散エキス顆粒", yjCode: "5200138D1022", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200138D1022?user=1" },
    { id: "shakuyaku", name: "ツムラ芍薬甘草湯エキス顆粒", yjCode: "5200067D1025", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200067D1025?user=1" },
    { id: "daikenchuto", name: "ツムラ大建中湯エキス顆粒", yjCode: "5200021D1021", potency: 1, calcType: "age", adultDose: 15, unit: "g", dosage: { note: "Augsberger式。15g/日基準。" }, piSnippet: "通常1日15gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200021D1021?user=1" },
    { id: "onshinto", name: "ツムラ温清飲エキス顆粒", yjCode: "5200006D1027", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200006D1027?user=1" },
    { id: "kamikihito", name: "ツムラ加味帰脾湯エキス顆粒", yjCode: "5200010D1022", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常成人1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200010D1022?user=1" },
    {
        id: "rupafin-tablet", name: "ルパフィン錠10mg", yjCode: "4490032F1029", potency: 1, calcType: "fixed-age", fixedDoses: [
            { ageMin: 12, ageMax: 100, dose: 1, unit: "錠", label: "12歳以上" }
        ], piSnippet: "12歳以上の小児：通常、1回1錠（ルパタジンとして10mg）を1日1回経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490032F1029?user=1"
    },
    {
        id: "desalex-tablet", name: "デザレックス錠5mg", yjCode: "4490029F1020", potency: 1, calcType: "fixed-age", fixedDoses: [
            { ageMin: 12, ageMax: 100, dose: 1, unit: "錠", label: "12歳以上" }
        ], piSnippet: "12歳以上の小児：通常、1回1錠（デスロラタジンとして5mg）を1日1回経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490029F1020?user=1"
    },
    { id: "adsorbin-powder", name: "アドソルビン散", yjCode: "2391001B1030", potency: 1, dosage: { minMgKg: 50, maxMgKg: 100, isByTime: true, timeMgKg: 30, timesPerDay: 3, note: "通常1日1.5〜3gを3回。" }, piSnippet: "通常1日1.5〜3gを3回に分割経口投与する。小児には適宜減量する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2391001B1030?user=1" },
    { id: "aspara-tablet", name: "アスパラ錠300mg", yjCode: "3251001F1070", potency: 1, calcType: "age", adultDose: 3, unit: "錠", dosage: { note: "Augsberger式。3錠/日基準。" }, piSnippet: "通常成人1日3錠を3回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/3251001F1070?user=1" },
    { id: "kami-shoyosan", name: "ツムラ加味逍遙散エキス顆粒", yjCode: "5200011D1027", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式。7.5g/日基準。" }, piSnippet: "通常1日7.5gを2〜3回に分割投与。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200011D1027?user=1" }
];

// ※ 実際の実装では上記のリストが75種類以上展開されますが、
// 引用メッセージの可読性のため主要な構造を示すのみに留めています。
// JavaScriptコードの後半部分は変更ありません。

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
    const age = parseFloat(ageInput.value);
    const weight = parseFloat(weightInput.value);
    const currentPi = drug.hasSubOptions ? drug.subOptions.find(o => o.id === selectedSubOptionId)?.piSnippet : drug.piSnippet;

    // PMDAリンク：rdSearch/02/形式は安定しているが、代表コードでないと検索結果一覧に止まる場合がある。
    // 「iyakuDetail/result/[YJコード]」は直接詳細へ飛ばす可能性が高い。
    // ここでは rdSearch/02/ を維持しつつ、YJコードを Okusuri Pakkun の定義に合わせる。
    piContainer.innerHTML = `
        <div class="pi-card bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 mt-6 shadow-sm">
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold text-amber-800 uppercase tracking-widest"><i class="fas fa-file-alt"></i> 添付文書 引用</span>
                <a href="${drug.piUrl}" target="_blank" class="text-xs text-blue-600 hover:underline font-bold">PMDAリダイレクト <i class="fas fa-external-link-alt"></i></a>
            </div>
            <div class="text-[10px] text-gray-800 leading-relaxed italic mb-2 font-medium">
                「${currentPi || '詳細はリンク先参照'}」
            </div>
            <div class="text-[8px] text-gray-400 text-right font-mono">YJ: ${drug.yjCode}</div>
        </div>
    `;

    if (isNaN(age) && (drug.calcType === 'age' || drug.calcType === 'fixed-age')) {
        resultArea.innerHTML = '<p class="text-center text-indigo-500 py-10 font-bold bg-indigo-50 rounded-xl">年齢を入力してください</p>';
        return;
    }
    if (isNaN(weight) && (drug.calcType !== 'age' && drug.calcType !== 'fixed-age')) {
        resultArea.innerHTML = '<p class="text-center text-blue-500 py-10 font-bold bg-blue-50 rounded-xl">体重を入力してください</p>';
        return;
    }

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
        let doseInfo = drug.hasSubOptions ? drug.subOptions.find(o => o.id === selectedSubOptionId).dosage : drug.dosage;
        const minG = (weight * doseInfo.minMgKg) / drug.potency;
        const maxG = (weight * doseInfo.maxMgKg) / drug.potency;
        const isRange = minG !== maxG;

        if (doseInfo.isByTime) {
            // 1回量の表示（範囲対応：数値計算結果ではなく定義値の有無で判定）
            const minTimeG = (weight * doseInfo.minMgKg) / drug.potency;
            const maxTimeG = (weight * doseInfo.maxMgKg) / drug.potency;
            const isTimeRange = doseInfo.minMgKg !== doseInfo.maxMgKg;

            let resultHtml = `
                <div class="bg-blue-600 text-white p-6 rounded-xl shadow-lg border-b-4 border-blue-800">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">1回分量 (${doseInfo.minMgKg}${isTimeRange ? '〜' + doseInfo.maxMgKg : ''}mg/kg)</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-black">${minTimeG.toFixed(2)}${isTimeRange ? ' 〜 ' + maxTimeG.toFixed(2) : ''}</span>
                        <span class="text-xl font-bold">${drug.unit || 'g'} / 回</span>
                    </div>
            `;

            if (doseInfo.timesPerDay) {
                const dayMinG = minTimeG * doseInfo.timesPerDay;
                const dayMaxG = maxTimeG * doseInfo.timesPerDay;
                resultHtml += `
                    <div class="mt-4 pt-4 border-t border-white/20">
                        <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">1日合計量 (${doseInfo.timesPerDay}回分)</div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-xl font-black">${dayMinG.toFixed(2)}${isTimeRange ? ' 〜 ' + dayMaxG.toFixed(2) : ''}</span>
                            <span class="text-lg font-bold">${drug.unit || 'g'} / 日</span>
                        </div>
                    </div>
                `;
            }
            resultHtml += `</div>`;
            resultArea.innerHTML = resultHtml;
        } else {
            resultArea.innerHTML = `
                <div class="bg-indigo-700 text-white p-6 rounded-xl shadow-lg border-b-4 border-indigo-900">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">通常1日用量 (${doseInfo.minMgKg}${isRange ? '-' + doseInfo.maxMgKg : ''}mg/kg)</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-black">${minG.toFixed(2)}${isRange ? ' 〜 ' + maxG.toFixed(2) : ''}</span>
                        <span class="text-xl font-bold">${drug.unit || 'g'} / 日</span>
                    </div>
                </div>
            `;
        }
    }
}

function calcStandardWeight() {
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('body-weight');
    const age = parseFloat(ageInput.value);
    if (isNaN(age)) return;

    let stdWeight = 0;
    if (age < 1) {
        stdWeight = age * 0.5 + 3; // 乳児の簡易式
    } else if (age <= 6) {
        stdWeight = age * 2 + 8;
    } else {
        stdWeight = age * 3 + 5;
    }
    weightInput.value = stdWeight.toFixed(1);
    updateCalculations();
}

function calcApproxAge() {
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('body-weight');
    const weight = parseFloat(weightInput.value);
    if (isNaN(weight)) return;

    let approxAge = 0;
    if (weight < 10) {
        approxAge = (weight - 3) / 0.5;
    } else if (weight <= 20) {
        approxAge = (weight - 8) / 2;
    } else {
        approxAge = (weight - 5) / 3;
    }
    ageInput.value = Math.max(0, Math.round(approxAge));
    updateCalculations();
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

    const stdWeightBtn = document.getElementById('calc-std-weight');
    if (stdWeightBtn) stdWeightBtn.addEventListener('click', calcStandardWeight);

    const stdAgeBtn = document.getElementById('calc-std-age');
    if (stdAgeBtn) stdAgeBtn.addEventListener('click', calcApproxAge);

    renderDrugCards();
});
