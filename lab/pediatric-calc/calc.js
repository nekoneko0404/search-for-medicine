const PEDIATRIC_DRUGS = [
    {
        id: "amoxicillin-group",
        name: "サワシリン／アモキシシリン",
        brandName: "サワシリン",
        yjCode: "6131001C1210", // 代表としてサワシリン10%
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C1210?user=1",
        potency: 100, // デフォルト
        hasSubOptions: true,
        subOptions: [
            { id: "amox-10", label: "10%細粒", potency: 100 },
            { id: "amox-20", label: "20%細粒 (ワイドシリン等)", potency: 200 }
        ],
        piSnippetSource: "通常1日20〜40mg(力価)/kgを3〜4回に分割経口投与する。なお、年齢、症状により適宜増減するが、1日量として最大90mg(力価)/kgを超えないこと。",
        dosage: {
            minMgKg: 20,
            maxMgKg: 40,
            absoluteMaxMgKg: 90,
            absoluteMaxMgPerDay: 2000, // 成人最大量: 2000mg
            note: "1日20〜40mg/kgを3〜4回。通常最大90mg/kg。成人最大2000mg。"
        },
        piSnippet: "通常1日20〜40mg(力価)/kgを3〜4回に分割経口投与する。なお、年齢、症状により適宜増減するが、1日量として最大90mg(力価)/kgを超えないこと。"
    },
    {
        id: "yj-6131008C1033",
        name: "ユナシン／スルタミシリン",
        brandName: "ユナシン",
        yjCode: "6131008C1033",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131008C1033?user=1",
        potency: 100,
        piSnippetSource: "通常小児に対しスルタミシリンとして、1日量15〜30mg(力価)/kgを3回に分割して経口投与する。なお、年齢、症状により適宜増減する。",
        dosage: {
            minMgKg: 15,
            maxMgKg: 30,
            absoluteMaxMgPerDay: 1125,
            note: "通常1日15〜30mg/kgを3回。最大1125mg(375mg×3)/日。"
        },
        piSnippet: "通常小児に対しスルタミシリンとして、1日量15〜30mg(力価)/kgを3回に分割して経口投与する。なお、年齢、症状により適宜増減する。"
    },
    {
        id: "yj-6132005C1053",
        name: "ケフラール／セファクロル",
        brandName: "ケフラール",
        yjCode: "6132005C1053",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132005C1053?user=1",
        potency: 100,
        piSnippetSource: "通常1日20〜40mg/kgを3回。重症等の場合は1日100mg/kgまで。",
        dosage: {
            minMgKg: 20,
            maxMgKg: 40,
            absoluteMaxMgKg: 100,
            absoluteMaxMgPerDay: 1500,
            note: "通常1日20〜40mg/kgを3回。最大1500mg/日。"
        },
        piSnippet: "通常1日20〜40mg/kgを1日3回に分割して服用する。重症等の場合には1日100mg/kgまで増量できる。"
    },
    {
        id: "yj-6132009C2023",
        name: "トミロン細粒小児用20%",
        brandName: "トミロン",
        yjCode: "6132009C2023",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132009C2023?user=1",
        potency: 200,
        piSnippetSource: "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgPerDay: 600,
            note: "1日9〜18mg/kgを3回。最大600mg(成人量)/日。"
        },
        piSnippet: "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6132011R1078",
        name: "バナン／セフポドキシム",
        brandName: "バナン",
        yjCode: "6132011R1078",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132011R1078?user=1",
        potency: 100,
        piSnippetSource: "通常1回3mg/kgを1日3回。重症時1回4.5mg/kgを1日3回。年齢および症状に応じて適宜増減する。ただし1日量200mg(力価)を超えないこと。",
        dosage: {
            minMgKg: 9,
            maxMgKg: 13.5,
            absoluteMaxMgPerDay: 200,
            note: "通常1日9〜13.5mg/kgを3回。重症時1回4.5mg/kg(13.5mg/kg/日)。上限200mg/日。"
        },
        piSnippet: "通常1回3mg/kgを1日3回。重症時、1回4.5mg(力価)/kgを1日3回経口投与する。ただし、1日量として200mg(力価)を超えないこと。"
    },
    {
        id: "yj-6132013C1031",
        name: "セフゾン／セフジニル",
        brandName: "セフゾン",
        yjCode: "6132013C1031",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013C1031?user=1",
        potency: 100,
        piSnippetSource: "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgPerDay: 300,
            note: "1日9〜18mg/kgを3回。1日上限300mg/日。"
        },
        piSnippet: "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6132015C1103",
        name: "メイアクト／セフジトレン",
        brandName: "メイアクト",
        yjCode: "6132015C1103",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132015C1103?user=1",
        potency: 100,
        piSnippetSource: "通常1回3mg/kgを1日3回。必要に応じて1回6mg/kgまで増量可。ただし、1日最大600mgを超えないこと。",
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgPerTime: 200,
            absoluteMaxMgPerDay: 600,
            note: "通常1日9〜18mg/kgを3回。1回上限200mg(成人量)。"
        },
        piSnippet: "通常1回3mg/kgを1日3回。必要に応じて1回6mg(力価)/kgまで増量できる。ただし、1日量として600mg(力価)を超えないこと。"
    },
    {
        id: "yj-6132016C1027",
        name: "フロモックス／フロモキセフ",
        brandName: "フロモックス",
        yjCode: "6132016C1027",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1027?user=1",
        potency: 100,
        piSnippetSource: "通常1回3mg/kgを1日3回。年齢、体重および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgPerDay: 300,
            note: "通常1日9〜18mg/kgを3回。1日上限300mg(成人量)。"
        },
        piSnippet: "通常1回3mg/kgを1日3回経口投与する。なお、年齢、体重および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6135001R2110",
        name: "ホスミシン／ホスホマイシン",
        brandName: "ホスミシン",
        yjCode: "6135001R2110",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6135001R2110?user=1",
        potency: 100,
        piSnippetSource: "通常1日40〜120mg/kg(製剤0.1〜0.3g/kg)を3〜4回に分けて経口投与する。",
        dosage: {
            minMgKg: 40,
            maxMgKg: 120,
            timesPerDay: 4,
            absoluteMaxMgPerDay: 4000,
            note: "通常1日40〜120mg/kgを3〜4回。1日最大4g(成人量)。"
        },
        piSnippet: "通常、小児には1日40〜120mg(力価)/kgを3〜4回に分割して服用する。"
    },
    {
        id: "yj-6139001R1032",
        name: "ファロム／ファロペネム",
        brandName: "ファロム",
        yjCode: "6139001R1032",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6139001R1032?user=1",
        potency: 100,
        piSnippetSource: "通常1回5mg/kgを3回。最大1回10mg/kg。年齢、体重、症状により適宜増減する。",
        dosage: {
            minMgKg: 15,
            maxMgKg: 30,
            isByTime: true,
            timeMgKg: 5,
            timesPerDay: 3,
            absoluteMaxMgPerTime: 300,
            absoluteMaxMgPerDay: 900,
            note: "通常1回5mg/kgを3回。最大1回10mg/kg。上限900mg(300mg×3)/日。"
        },
        piSnippet: "通常1回5mg(力価)/kgを1日3回経口投与する。なお、年齢、体重、症状により適宜増減するが、増量は1回10mg(力価)/kgまでとする。"
    },
    {
        id: "yj-6139100R1036",
        name: "クラバモックス小児用配合ドライシロップ",
        yjCode: "6139100R1036",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6139100R1036?user=1",
        potency: 42.9,
        calcType: "weight-step",
        weightSteps: [
            {
                weightMin: 6,
                weightMax: 11,
                dose: 1.01,
                unit: "g",
                label: "6〜10kg: 1.01g"
            },
            {
                weightMin: 11,
                weightMax: 17,
                dose: 2.02,
                unit: "g",
                label: "11〜16kg: 2.02g"
            },
            {
                weightMin: 17,
                weightMax: 24,
                dose: 3.03,
                unit: "g",
                label: "17〜23kg: 3.03g"
            },
            {
                weightMin: 24,
                weightMax: 31,
                dose: 4.04,
                unit: "g",
                label: "24〜30kg: 4.04g"
            },
            {
                weightMin: 31,
                weightMax: 37,
                dose: 5.05,
                unit: "g",
                label: "31〜36kg: 5.05g"
            },
            {
                weightMin: 37,
                weightMax: 40,
                dose: 6.06,
                unit: "g",
                label: "37〜39kg: 6.06g"
            }
        ],
        dosage: {
            note: "1日量を12時間ごと(1日2回)に投与。添付文書の分包用量表に準拠。"
        },
        piSnippetSource: "通常、1日96.4mg/kgを2回に分けて経口投与。分包製剤(パウチ)の場合は体重区分(6-10kg, 11-16kg等)ごとの固定量を投与する。",
        piSnippet: "通常、1日96.4mg/kgを2回に分けて経口投与。分包製剤(パウチ)の場合は体重区分(6-10kg, 11-16kg等)ごとの固定量を投与する。"
    },
    {
        id: "yj-6141001R2053",
        name: "エリスロシン／エリスロマイシン",
        brandName: "エリスロシン",
        yjCode: "6141001R2053",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6141001R2053?user=1",
        potency: 200,
        hasSubOptions: true,
        subOptions: [
            { id: "ery-10", label: "10%細粒", potency: 100 },
            { id: "ery-20", label: "20%細粒", potency: 200 }
        ],
        piSnippetSource: "小児には1日体重1kgあたり25〜50mg(力価)を4〜6回に分割経口投与。なお、年齢、症状により適宜増減する。ただし、小児用量は成人量(1日800〜1200mg)を上限とする。",
        dosage: {
            minMgKg: 25,
            maxMgKg: 50,
            timesPerDay: 4,
            absoluteMaxMgPerDay: 1200,
            note: "1日25〜50mg/kgを4〜6回。成人量(1200mg)を上限とする。"
        },
        piSnippet: "小児には1日体重1kgあたり25〜50mg(力価)を4〜6回に分割経口投与。なお、年齢、症状により適宜増減する。ただし、小児用量は成人量(1日800〜1200mg)を上限とする。"
    },
    {
        id: "clarith-group",
        name: "クラリス／クラリスロマイシン",
        brandName: "クラリス",
        yjCode: "6149003R1143",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149003R1143?user=1",
        potency: 100,
        hasSubOptions: false,
        subOptions: [],
        piSnippetSource: "通常1日10〜15mg/kgを2回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 10,
            maxMgKg: 15,
            isByTime: true,
            timesPerDay: 2,
            absoluteMaxMgPerDay: 400,
            note: "1日10〜15mg/kgを2回。最大400mg/日。"
        },
        piSnippet: "通常、小児には1日10〜15mg(力価)/kgを2回に分けて服用する。なお、年齢、症状により適宜増減する。"
    },
    {
        id: "azithromycin-group",
        name: "ジスロマック／アジスロマイシン",
        brandName: "ジスロマック",
        yjCode: "6149004C1030",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004C1030?user=1",
        potency: 100,
        calcType: "weight-step",
        weightSteps: [
            { weightMin: 0.1, weightMax: 15, dose: 0.1, isPerKg: true, unit: "g", label: "15kg未満: 10mg/kg" },
            { weightMin: 15, weightMax: 25, dose: 2, unit: "g", label: "15kg〜25kg未満: 2g" },
            { weightMin: 25, weightMax: 35, dose: 3, unit: "g", label: "25kg〜35kg未満: 3g" },
            { weightMin: 35, weightMax: 45, dose: 4, unit: "g", label: "35kg〜45kg未満: 4g" },
            { weightMin: 45, weightMax: 1000, dose: 5, unit: "g", label: "45kg以上: 5g" }
        ],
        dosage: {
            timesPerDay: 1,
            note: "1日1回10mg/kg(最大500mg)を3日間。15kg以上は段階的用量設定。"
        },
        piSnippetSource: "通常、1日1回10mg/kgを3日間経口投与する。最大量として成人の1日量500mgを超えない。また、体重15kg以上の小児には専用の用量設定表がある。",
        piSnippet: "通常、1日1回10mg(力価)/kgを3日間経口投与する。ただし、1日最大500mg(力価)を超えないこと。体重15kg以上の小児には専用の用量設定表がある。"
    },
    {
        id: "yj-6152005D1094",
        name: "ミノマイシン／ミノサイクリン",
        brandName: "ミノマイシン",
        yjCode: "6152005D1094",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6152005D1094?user=1",
        potency: 100,
        piSnippetSource: "通常、初回1回2mg/kg(力価)とし、以後1mg/kg(力価)を12時間ごとに経口投与する。",
        dosage: {
            minMgKg: 2,
            maxMgKg: 4,
            isByTime: true,
            timeMgKg: 1,
            timesPerDay: 2,
            absoluteMaxMgPerDay: 200,
            note: "初回2mg/kg、以後1mg/kgを12時間ごと。1日2〜4mg/kg。上限200mg/日。"
        },
        piSnippet: "通常、初回1回2mg/kg(力価)とし、以後1mg/kg(力価)を12時間ごとに服用する。"
    },
    {
        id: "yj-6250002D1024",
        name: "ゾビラックス／アシクロビル",
        brandName: "ゾビラックス",
        yjCode: "6250002D1024",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250002D1024?user=1",
        potency: 400,
        piSnippetSource: "通常1回20mg/kgを1日4回。1日最大80mg/kg。ただし成人最大量(1回400mg)を超えないこと。",
        dosage: {
            minMgKg: 80,
            maxMgKg: 80,
            isByTime: true,
            timeMgKg: 20,
            timesPerDay: 4,
            absoluteMaxMgPerTime: 400,
            absoluteMaxMgPerDay: 1600,
            note: "通常1回20mg/kgを1日4回。最大20mg/kg/回。上限400mg/回。"
        },
        piSnippet: "通常、小児には1回20mg/kgを1日4回服用する。ただし、1日最大80mg/kg、あるいは成人最大量(1回400mg)を超えないこと。"
    },
    {
        id: "valaciclovir-group",
        name: "バルトレックス／バラシクロビル",
        brandName: "バルトレックス",
        yjCode: "6250003C1023",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250003C1023?user=1",
        potency: 500,
        hasSubOptions: false,
        subOptions: [],
        piSnippetSource: "通常1回25mg/kgを1日3回(水痘は2回)。ただし1回500mg(成人量)を超えないこと。",
        dosage: {
            minMgKg: 75,
            maxMgKg: 75,
            isByTime: true,
            timeMgKg: 25,
            timesPerDay: 3,
            absoluteMaxMgPerTime: 500,
            absoluteMaxMgPerDay: 1500,
            note: "通常1回25mg/kgを1日3回。上限500mg/回。水痘は1日2回。"
        },
        piSnippet: "通常、小児には1回25mg/kgを1日3回(水痘は2回)経口投与する。ただし、1回量として500mgを超えないこと。"
    },
    {
        id: "tamiflu-group",
        name: "タミフル／オセルタミビル",
        brandName: "タミフル",
        yjCode: "6250021R1024",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250021R1024?user=1",
        potency: 30,
        hasSubOptions: true,
        subOptions: [
            { id: "over1y", label: "1歳以上", potency: 30 },
            { id: "under1y", label: "1歳未満", potency: 30 }
        ],
        piSnippetSource: "通常1回2mg/kgを1日2回(治療)あるいは1日1回(予防)。最大1回75mg。",
        dosage: {
            minMgKg: 4,
            maxMgKg: 4,
            isByTime: true,
            timeMgKg: 2,
            timesPerDay: 2,
            absoluteMaxMgPerTime: 75,
            absoluteMaxMgPerDay: 150,
            note: "通常1回2mg/kg(製剤66.7mg/kg)を1日2回。上限75mg(2.5g)/回。"
        },
        piSnippet: "通常、小児には1回2mg(力価)/kgを1日2回、5日間経口投与する。ただし、1回最高用量は75mg(力価)とする。"
    },
    {
        id: "medicon-group",
        name: "メジコン／デキストロメトルファン",
        brandName: "メジコン",
        yjCode: "2223001B1210",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2223001B1210?user=1",
        potency: 100,
        piSnippetSource: "通常、小児には1日量として、1〜2歳4.5〜9mg、3〜4歳6〜12mg、5〜6歳8〜16mg。3〜4回分割。",
        dosage: {
            minMgKg: 1,
            maxMgKg: 2,
            timesPerDay: 3,
            absoluteMaxMgPerDay: 60,
            note: "1日1〜2mg/kg(目安)。1-2歳4.5-9mg, 3-4歳6-12mg, 5-6歳8-16mg。3-4回分割。"
        },
        piSnippet: "通常、小児には以下の1日量を3〜4回に分割し服用する。1〜2歳：4.5〜9mg、3〜4歳：6〜12mg、5〜6歳：8〜16mg。"
    },
    {
        id: "carbocisteine-group",
        name: "ムコダイン／カルボシステイン",
        brandName: "ムコダイン",
        yjCode: "2233002R2029",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2233002R2029?user=1",
        potency: 500, // 50%
        hasSubOptions: false,
        subOptions: [],
        piSnippetSource: "通常1回10mg/kgを3回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 30,
            maxMgKg: 30,
            isByTime: true,
            timeMgKg: 10,
            timesPerDay: 3,
            note: "通常1回10mg/kg(33.3mg=0.1g/kg)を3回。"
        },
        piSnippet: "通常、小児には1回10mg/kgを1日3回経口投与する。なお、年齢、症状により適宜増減する。"
    },
    {
        id: "yj-2239001Q1166",
        name: "ムコソルバン／アンブロキソール",
        brandName: "ムコソルバン",
        yjCode: "2239001Q1166",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2239001Q1166?user=1",
        potency: 15,
        piSnippetSource: "通常1日0.9mg/kgを3回。3回分割経口投与する。",
        dosage: {
            minMgKg: 0.9,
            maxMgKg: 0.9,
            isByTime: true,
            timeMgKg: 0.3,
            timesPerDay: 3,
            absoluteMaxMgPerDay: 45,
            note: "通常1日0.9mg/kg(製剤0.06g/kg)を3回。上限45mg(成人量)/日。"
        },
        piSnippet: "通常、小児には1日0.9mg/kgを3回に分割して経口投与する。"
    },
    {
        id: "asverin-group",
        name: "アスベリン／チペピジン",
        brandName: "アスベリン",
        yjCode: "2249003B1037",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2249003B1037?user=1",
        potency: 100,
        hasSubOptions: true,
        subOptions: [
            { id: "asv-10", label: "10%散", potency: 100 },
            { id: "asv-2", label: "2%DS", potency: 20 }
        ],
        piSnippetSource: "通常小児1歳未満5〜20mg、1〜3歳未満10〜25mg、3〜6歳未満15〜40mgを3回に分割。",
        dosage: {
            minMgKg: 1,
            maxMgKg: 1,
            isByTime: true,
            timeMgKg: 0.33,
            timesPerDay: 3,
            absoluteMaxMgPerDay: 90,
            note: "通常1日1mg/kgを3回(目安)。1歳未満5-20mg, 1-3歳10-25mg, 3-6歳15-40mg。"
        },
        piSnippet: "通常、小児には1日1歳未満5〜20mg、1歳以上3歳未満10〜25mg、3歳以上6歳未満15〜40mgを3回に分割経口投与する。なお、年齢、症状により適宜増減する。"
    },
    {
        id: "yj-2251001D1061",
        name: "テオドールドライシロップ20%",
        yjCode: "2251001D1061",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2251001D1061?user=1",
        potency: 200,
        piSnippetSource: "通常、1日回1kgあたり8〜20mgを2回に分けて、朝及び夕食後に経口投与する。",
        dosage: {
            minMgKg: 8,
            maxMgKg: 20,
            timesPerDay: 2,
            absoluteMaxMgPerDay: 400,
            note: "通常1日8〜20mg/kg(製剤0.04〜0.1g/kg)を2回。上限400mg/日。"
        },
        piSnippet: "通常、1日1kgあたり8〜20mg(製剤0.04〜0.1g)を2回に分けて服用する。"
    },
    {
        id: "meptin-group",
        name: "メプチン／プロカテロール",
        brandName: "メプチン",
        yjCode: "2254001R1053",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2254001R1053?user=1",
        potency: 0.05,
        hasSubOptions: true,
        subOptions: [
            { id: "mep-ds", label: "0.005%DS", potency: 0.05 },
            { id: "mep-gr", label: "0.01%顆粒", potency: 0.1 }
        ],
        piSnippetSource: "通常、小児には1回体重1kgあたり1.25μgを1日2回経口投与する。6歳以上の小児には1回25μgを1日2回経口投与する。",
        calcType: "age-weight-switch",
        ageBranches: [
            {
                ageMin: 0,
                ageMax: 6,
                label: "6歳未満: 体重換算 (1.25μg/kg)",
                dosage: {
                    isFixed: false,
                    timeMgKg: 0.00125,
                    unit: "g",
                    timesPerDay: 2,
                    note: "通常1回1.25μg/kg(0.00125mg/kg)を1日2回。"
                }
            },
            {
                ageMin: 6,
                ageMax: 100,
                label: "6歳以上: 固定量 (1回25μg)",
                dosage: {
                    isFixed: true,
                    dosePerTime: 0.5, // 0.005%DSの場合の0.5g = 25μg
                    unit: "g",
                    timesPerDay: 2,
                    note: "通常1回25μgを1日2回。"
                }
            }
        ],
        piSnippet: "6歳以上：1回25μgを1日2回。6歳未満：1回1.25μg/kgを1日2回。"
    },
    {
        id: "yj-2259002R1061",
        name: "ホクナリンDS0.1%小児用",
        yjCode: "2259002R1061",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2259002R1061?user=1",
        potency: 1,
        piSnippetSource: "通常1回0.02mg/kgを2回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 0.04,
            maxMgKg: 0.04,
            isByTime: true,
            timeMgKg: 0.02,
            timesPerDay: 2,
            absoluteMaxMgPerDay: 2,
            note: "通常1回0.02mg/kgを2回。上限2mg/日。"
        },
        piSnippet: "通常1回0.02mg/kgを2回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-4413004C2022",
        name: "ゼスラン細粒小児用0.6%",
        yjCode: "4413004C2022",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4413004C2022?user=1",
        potency: 100,
        piSnippetSource: "通常、小児にはメキタジンとして体重1kgあたり1回0.06mg（製剤0.01g）を1日2回経口投与する。年齢、症状により適宜増減する。",
        dosage: {
            minMgKg: 0.12,
            maxMgKg: 0.24,
            isByTime: true,
            timeMgKg: 0.06,
            timesPerDay: 2,
            absoluteMaxMgPerDay: 12,
            note: "通常1回0.06mg/kg(製剤0.01g/kg)を2回。上限12mg/日。"
        },
        piSnippet: "通常、小児には1回体重1kgあたり0.06mg（製剤0.01g）を1日2回経口投与する。"
    },
    {
        id: "yj-4419002B1033",
        name: "ポララミン散1%",
        yjCode: "4419002B1033",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4419002B1033?user=1",
        potency: 100,
        calcType: "age",
        adultDose: 0.6,
        unit: "g",
        isAdultOnly: true,
        piSnippetSource: "通常、成人には1回2mg(0.2g)を1日1〜4回経口投与する。なお、年齢、症状により適宜増減する。",
        dosage: {
            note: "成人1回2mg(0.2g)。小児用量記載なし、Augsberger式等で算出。"
        },
        piSnippet: "通常、成人1回2mg(0.2g)を1日1〜4回。小児は年齢・症状により適宜増減。"
    },
    {
        id: "yj-4419005B1045",
        name: "ペリアクチン散1%",
        yjCode: "4419005B1045",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4419005B1045?user=1",
        potency: 100,
        calcType: "age",
        adultDose: 1.2,
        unit: "g",
        isAdultOnly: true,
        piSnippetSource: "通常、成人には1回4mg(0.4g)を1日1〜3回経口投与する。なお、年齢、症状により適宜増減する。",
        dosage: {
            note: "成人1回4mg(0.4g)。小児用量記載なし、Augsberger式等で算出。"
        },
        piSnippet: "通常、成人1回4mg(0.4g)を1日1〜3回。小児は年齢・症状により適宜増減。"
    },
    {
        id: "yj-4490003R1228",
        name: "ザジテンドライシロップ0.1%",
        yjCode: "4490003R1228",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490003R1228?user=1",
        potency: 1,
        piSnippetSource: "通常、小児には1日量体重1kgあたり0.06g（ケトチフェンとして0.06mg）を2回に分けて、朝食後及び就寝前に用時溶解して経口投与する。",
        dosage: {
            minMgKg: 0.06,
            maxMgKg: 0.06,
            timesPerDay: 2,
            absoluteMaxMgPerDay: 2,
            note: "1日0.06mg/kg(製剤0.06g/kg)を2回。上限2mg/日(成人量)。"
        },
        piSnippet: "通常、小児には1日量0.06mg/kg（製剤0.06g/kg）を2回に分けて朝食後及び就寝前に服用する。"
    },
    {
        id: "celtect-group",
        name: "セルテクト／オキサトミド",
        brandName: "セルテクト",
        yjCode: "4490005R1448",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490005R1448?user=1",
        potency: 20,
        hasSubOptions: true,
        subOptions: [
            { id: "yj-4490005R1448", label: "DS小児用2%「サワイ」", potency: 20 }
        ],
        piSnippetSource: "通常1回0.5mg/kgを1日2回。朝食後及び就寝前。年齢、症状により適宜増減。",
        dosage: {
            minMgKg: 1,
            maxMgKg: 1,
            isByTime: true,
            timeMgKg: 0.5,
            timesPerDay: 2,
            absoluteMaxMgPerDay: 60,
            note: "通常1回0.5mg/kgを1日2回。最大1回30mg(成人量)。"
        },
        piSnippet: "通常、小児には1回0.5mg/kgを1日2回(朝食後、就寝前)服用する。なお、年齢、症状により適宜増減する。"
    },
    {
        id: "yj-4490017R1033",
        name: "オノン／プランルカスト",
        brandName: "オノン",
        yjCode: "4490017R1033",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490017R1033?user=1",
        potency: 100,
        piSnippetSource: "通常、小児には1回体重1kgあたり本剤0.07g（プランルカスト水和物として7mg）を1日2回、朝食後及び夕食後に経口投与する。",
        dosage: {
            minMgKg: 14,
            maxMgKg: 14,
            isByTime: true,
            timeMgKg: 7,
            timesPerDay: 2,
            absoluteMaxMgPerDay: 450,
            note: "通常1回7mg/kg(製剤0.07g/kg)を2回。1日14mg/kg。上限450mg/日。"
        },
        piSnippet: "通常、小児には1回体重1kgあたり0.07g（プランルカストとして7mg）を1日2回服用する。"
    },
    {
        id: "cetirizine-group",
        name: "ジルテック・セチリジン／セチリジン",
        brandName: "ジルテック",
        yjCode: "4490020R1027",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490020R1027?user=1",
        potency: 12.5,
        hasSubOptions: true,
        subOptions: [
            { id: "zyrtec-ds", label: "ジルテックドライシロップ1.25%", potency: 12.5, unit: "g" },
            { id: "cetirizine-ds", label: "セチリジン塩酸塩DS1.25%「タカタ」", potency: 12.5, unit: "g" }
        ],
        calcType: "fixed-age",
        fixedDoses: [
            { ageMin: 2, ageMax: 7, dose: 0.2, unit: "g", label: "2-7歳未満" },
            { ageMin: 7, ageMax: 15, dose: 0.4, unit: "g", label: "7-15歳未満" }
        ],
        piSnippetSource: "2歳以上7歳未満：1回0.2gを1日2回。7歳以上15歳未満：1回0.4gを1日2回。",
        dosage: {
            note: "2-7歳未満:1回0.2g、7-15歳未満:1回0.4gを1日2回。"
        },
        piSnippet: "通常、2歳以上7歳未満：1回0.2g、7歳以上15歳未満：1回0.4gを1日2回。"
    },
    {
        id: "yj-4490022R1025",
        name: "アレジオン／エピナスチン",
        brandName: "アレジオン",
        yjCode: "4490022R1025",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490022R1025?user=1",
        potency: 100,
        piSnippetSource: "通常、小児には1日1回0.025〜0.05g/kg（エピナスチン塩酸塩として0.25〜0.5mg/kg）を用時溶解して経口投与する。",
        dosage: {
            minMgKg: 0.25,
            maxMgKg: 0.5,
            timesPerDay: 1,
            note: "1日1回0.25〜0.5mg/kg(製剤0.025〜0.05g/kg)。"
        },
        piSnippet: "通常、1日1回0.025〜0.05g/kg(0.25〜0.5mg/kg)を用時溶解して服用。7歳以上標準1〜2g。"
    },
    {
        id: "yj-4490023R2027",
        name: "アレグラ／フェキソフェナジン",
        brandName: "アレグラ",
        yjCode: "4490023R2027",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490023R2027?user=1",
        potency: 50,
        piSnippetSource: "2歳以上7歳未満：1回0.6gを1日2回。7歳以上12歳未満：1回1.2gを1日2回。12歳以上：1回1.2gを1日2回。",
        calcType: "fixed-age",
        fixedDoses: [
            {
                ageMin: 2,
                ageMax: 7,
                dose: 0.6,
                unit: "g",
                label: "2-7歳未満"
            },
            {
                ageMin: 7,
                ageMax: 100,
                dose: 1.2,
                unit: "g",
                label: "7歳以上"
            }
        ],
        piSnippet: "2歳以上7歳未満：1回0.6gを1日2回。7歳以上12歳未満：1回1.2gを1日2回。12歳以上：1回1.2gを1日2回。"
    },
    {
        id: "yj-4490025D1022",
        name: "アレロック／オロパタジン",
        brandName: "アレロック",
        yjCode: "4490025D1022",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490025D1022?user=1",
        potency: 100,
        calcType: "fixed-age",
        fixedDoses: [
            { ageMin: 2, ageMax: 7, dose: 0.5, unit: "g", label: "2-7歳未満" },
            { ageMin: 7, ageMax: 100, dose: 1.0, unit: "g", label: "7歳以上" }
        ],
        piSnippetSource: "通常、7歳以上の小児には1回5mg(1g)、2歳以上7歳未満の小児には1回2.5mg(0.5g)を1日2回、朝及び就寝前に経口投与する。",
        dosage: {
            note: "2〜7歳未満:1回0.5g、7歳以上:1回1gを1日2回。"
        },
        piSnippet: "通常、2〜7歳未満：1回2.5mg(0.5g)、7歳以上：1回5mg(1g)を朝・就寝前の1日2回服用する。"
    },
    {
        id: "montelukast-group",
        name: "キプレス・シングレア／モンテルカスト",
        brandName: "キプレス",
        yjCode: "4490026C1021",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490026C1021?user=1",
        potency: 1,
        unit: "包",
        calcType: "fixed-age",
        fixedDoses: [
            { ageMin: 1, ageMax: 6, dose: 1.0, unit: "包", label: "1歳以上6歳未満(4mg)" }
        ],
        piSnippetSource: "1歳以上6歳未満の小児：通常、1日1回1包（モンテルカストとして4mg）を就寝前に経口投与する。",
        dosage: {
            note: "1歳以上6歳未満：1日1回1包(4mg)。"
        },
        piSnippet: "1歳以上6歳未満：1日1回1包（4mg）を就寝前に経口投与する。"
    },
    {
        id: "yj-4490027R1029",
        name: "クラリチン／ロラタジン",
        brandName: "クラリチン",
        yjCode: "4490027R1029",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490027R1029?user=1",
        potency: 10,
        piSnippetSource: "3歳以上7歳未満：1回0.5gを1日1回。7歳以上：1回1.0gを1日1回。",
        calcType: "fixed-age",
        fixedDoses: [
            {
                ageMin: 3,
                ageMax: 7,
                dose: 0.5,
                unit: "g",
                label: "3-7歳未満"
            },
            {
                ageMin: 7,
                ageMax: 15,
                dose: 1,
                unit: "g",
                label: "7歳以上"
            }
        ],
        piSnippet: "3歳以上7歳未満：1回0.5gを1日1回。7歳以上：1回1.0gを1日1回。"
    },
    {
        id: "yj-4490028Q1028",
        name: "ザイザル／レボセチリジン",
        brandName: "ザイザル",
        yjCode: "4490028Q1028",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490028Q1028?user=1",
        potency: 0.5,
        unit: "mL",
        calcType: "fixed-age",
        fixedDoses: [
            { ageMin: 0.5, ageMax: 1, dose: 2.5, unit: "mL", label: "6ヶ月-1歳未満(1日1回)" },
            { ageMin: 1, ageMax: 15, dose: 2.5, unit: "mL", label: "1歳-15歳未満(1日2回)" }
        ],
        piSnippetSource: "通常、1回量として、6ヶ月以上1歳未満には2.5mLを1日1回。1歳以上15歳未満には2.5mLを1日2回経口投与する。",
        dosage: {
            note: "6ヶ月-1歳未満:2.5mL(1回)、1歳-15歳未満:2.5mL(2回)。"
        },
        piSnippet: "6ヶ月以上1歳未満：2.5mLを1日1回。1歳以上15歳未満：2.5mLを1日2回服用する。"
    },
    {
        id: "yj-1139004C2061",
        name: "デパケン細粒",
        yjCode: "1139004C2061",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1139004C2061?user=1",
        potency: 100,
        piSnippetSource: "通常1日15mg/kgを1〜3回に分けて経口投与する。なお、年齢・症状により適宜増減するが、通常1日20〜30mg/kgまでとする。",
        dosage: {
            minMgKg: 15,
            maxMgKg: 30,
            timesPerDay: 2,
            note: "通常1日15mg/kgを1〜3回。標準1日20〜30mg/kg。"
        },
        piSnippet: "通常1日15mg/kgを1〜3回に分けて服用する。標準1日20〜30mg/kg。"
    },
    {
        id: "yj-1139010R1020",
        name: "イーケプラドライシロップ50%",
        yjCode: "1139010R1020",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1139010R1020?user=1",
        potency: 500,
        piSnippetSource: "通常、4歳以上の小児には1日20mg/kg(製剤0.04g/kg)を2回に分けて経口投与する。症状により1日60mg/kg(製剤0.12g/kg)を超えない範囲で増減する。",
        dosage: {
            minMgKg: 20,
            maxMgKg: 60,
            timesPerDay: 2,
            note: "通常1日20mg/kg(製剤0.04g/kg)を2回。最大1日60mg/kg。"
        },
        piSnippet: "通常、1日20mg/kg(製剤0.04g/kg)を2回に分けて服用する。最大1日60mg/kg。"
    },
    {
        id: "acetaminophen-group",
        name: "カロナール／アセトアミノフェン",
        brandName: "カロナール",
        yjCode: "1141007C1075",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007C1075?user=1",
        potency: 200,
        hasSubOptions: true,
        subOptions: [
            { id: "cal-20", label: "20%細粒", potency: 200 },
            { id: "cal-40", label: "40%細粒", potency: 400 },
            { id: "cal-50", label: "50%細粒", potency: 500 },
            { id: "cal-100", label: "原末(100%)", potency: 1000 },
            { id: "cal-syr", label: "2%シロップ", potency: 20, unit: "mL" }
        ],
        piSnippetSource: "1回10〜15mg/kg。投与間隔は4〜6時間以上。1日総量60mg/kg限度。成人最大量(1回500mg, 1日1500mg)を超えないこと。",
        dosage: {
            minMgKg: 10,
            maxMgKg: 15,
            absoluteMaxMgKg: 60,
            isByTime: true,
            timesPerDay: 4,
            note: "1回10〜15mg/kg。原則4時間空ける。"
        },
        piSnippet: "1回10〜15mg/kg。投与間隔は4〜6時間以上。1日総量60mg/kg限度。成人最大量(1回500mg, 1日1500mg)を超えないこと。"
    },
    {
        id: "yj-1149001D1160",
        name: "ブルフェン顆粒20%",
        yjCode: "1149001D1160",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1149001D1160?user=1",
        potency: 200,
        piSnippetSource: "通常、小児には1日量本剤0.1〜0.15g/kg（イブプロフェンとして20〜30mg/kg）を3回に分けて経口投与する。なお、年齢、症状により適宜増減する。",
        dosage: {
            minMgKg: 20,
            maxMgKg: 30,
            timesPerDay: 3,
            note: "1日量20〜30mg/kg(製剤0.1〜0.15g/kg)を3回。"
        },
        piSnippet: "通常、小児には1日量0.1〜0.15g/kg（イブプロフェンとして20〜30mg/kg）を3回に分けて服用する。"
    },
    {
        id: "yj-1180107D1131",
        name: "PL配合顆粒",
        brandName: "PL配合顆粒",
        yjCode: "1180107D1131",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1180107D1131?user=1",
        calcType: "age",
        adultDose: 4,
        unit: "g",
        isAdultOnly: true,
        piSnippetSource: "通常、成人には1回1gを1日4回経口投与。なお、年齢、症状により適宜増減する。",
        dosage: {
            note: "通常、成人1回1gを1日4回。添付文書に小児用量なし。Augsberger式で算出。"
        },
        piSnippet: "通常、成人には1回1gを1日4回経口投与する。なお、年齢、症状により適宜増減する。"
    },
    {
        id: "yj-2316004B1036",
        name: "ビオフェルミンR散",
        brandName: "ビオフェルミンR",
        yjCode: "2316004B1036",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316004B1036?user=1",
        calcType: "age",
        adultDose: 3,
        unit: "g",
        piSnippetSource: "通常1日1.5〜3gを3回。年齢、症状により適宜増減する。",
        dosage: {
            note: "目安1日1.5〜3g(3回)。"
        },
        piSnippet: "通常、小児には1日1.5〜3gを3回に分割して服用する。なお、年齢、症状により適宜増減する。"
    },
    {
        id: "yj-2316009C1026",
        name: "ミヤBM細粒",
        brandName: "ミヤBM",
        yjCode: "2316009C1026",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316009C1026?user=1",
        potency: 100,
        calcType: "age",
        adultDose: 1.5,
        unit: "g",
        piSnippetSource: "通常1日0.3〜1.5gを3回に分割経口投与する。なお、年齢、症状により適宜増減する。",
        dosage: {
            note: "目安1日0.3〜1.5g(3回)。"
        },
        piSnippet: "通常、小児には1日0.3〜1.5gを3回に分割して経口投与する。なお、年齢、症状により適宜増減する。"
    },
    {
        id: "yj-2316014B1030",
        name: "ラックビー微粒N",
        brandName: "ラックビー",
        yjCode: "2316014B1030",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316014B1030?user=1",
        potency: 100,
        calcType: "age",
        adultDose: 3,
        unit: "g",
        piSnippetSource: "通常、1日2〜3gを3回に分割経口投与する。なお、年齢、症状により適宜増減する。",
        dosage: {
            note: "目安1日2〜3g(3回)。"
        },
        piSnippet: "通常、小児には1日2〜3gを3回に分割して経口投与する。なお、年齢、症状により適宜増減する。"
    },
    {
        id: "yj-2331004B1046",
        name: "アドソルビン原末",
        brandName: "アドソルビン",
        yjCode: "2331004B1046",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2331004B1046?user=1",
        potency: 100,
        calcType: "age",
        adultDose: 6,
        unit: "g",
        piSnippetSource: "通常、1日3〜6gを3回に分割経口投与する。なお、年齢、症状により適宜増減する。",
        dosage: {
            note: "1日3〜6g(3回)。隔日投与可。"
        },
        piSnippet: "通常、小児には1日3〜6gを3回に分割して服用する。なお、年齢、症状により適宜増減する。"
    },
    {
        id: "yj-2399005R1163",
        name: "ナウゼリン／ドンペリドン",
        brandName: "ナウゼリン",
        yjCode: "2399005R1163",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2399005R1163?user=1",
        potency: 10,
        piSnippetSource: "通常、小児には1日ドンペリドンとして1.0〜2.0mg/kg（本剤0.1〜0.2g/kg）を3回に分けて食前に経口投与する。なお、年齢、体重、症状により適宜増減する。ただし、1日最大投与量は30mg（本剤3g）を限度とする。",
        dosage: {
            minMgKg: 1,
            maxMgKg: 2,
            timesPerDay: 3,
            absoluteMaxMgPerDay: 30,
            note: "1日1〜2mg/kg(製剤0.1〜0.2g/kg)を3回食前。最大30mg(3g)。"
        },
        piSnippet: "通常、小児には1日ドンペリドンとして1.0〜2.0mg/kg(製剤0.1〜0.2g/kg)を3回に分けて食前に服用する。ただし、1日最大30mg(製剤3g)を限度とする。"
    },
    {
        id: "yj-3222012Q1030",
        name: "インクレミン／溶性ピロリン酸第二鉄",
        brandName: "インクレミン",
        yjCode: "3222012Q1030",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/3222012Q1030?user=1",
        potency: 6,
        unit: "mL",
        piSnippetSource: "通常、小児には1日0.1〜0.3mL/kg（鉄として2〜6mg/kg）を3回に分けて食後に経口投与する。",
        dosage: {
            minMgKg: 2,
            maxMgKg: 6,
            timesPerDay: 3,
            note: "1日0.1〜0.3mL/kg(鉄として2〜6mg/kg)を3回。食後。"
        },
        piSnippet: "通常、小児には1日鉄として2〜6mg/kg（本剤0.1〜0.3mL/kg）を3回に分けて服用する。"
    },
    {
        id: "yj-5200013D1123",
        name: "ツムラ葛根湯エキス顆粒",
        brandName: "ツムラ葛根湯",
        yjCode: "5200013D1123",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200013D1123?user=1",
        calcType: "age",
        adultDose: 7.5,
        unit: "g",
        isKampo: true,
        piSnippetSource: "通常、成人1日7.5gを2〜3回に分割し、食前又は食間に経口投与。小児は年齢に基づき減量。",
        dosage: {
            note: "成人1日7.5gを基準に算定。"
        },
        piSnippet: "通常、成人1日7.5gを2〜3回に分割し、食前又は食間に経口投与する。小児は年齢により適宜減量する。"
    },
    {
        id: "yj-5200072D1058",
        name: "ツムラ小建中湯エキス顆粒",
        brandName: "ツムラ小建中湯",
        yjCode: "5200072D1058",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200072D1058?user=1",
        calcType: "age",
        adultDose: 15,
        unit: "g",
        isKampo: true,
        piSnippetSource: "通常、成人1日15.0gを2〜3回に分割し、経口投与する。小児は年齢に基づき減量。",
        dosage: {
            note: "成人1日15.0gを基準に算定。"
        },
        piSnippet: "通常、成人1日15.0gを2〜3回に分割し、服用する。小児は年齢により適宜減量する。"
    },
    {
        id: "yj-5200139D1037",
        name: "ツムラ抑肝散エキス顆粒",
        brandName: "ツムラ抑肝散",
        yjCode: "5201139D1037",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200139D1037?user=1",
        calcType: "age",
        adultDose: 7.5,
        unit: "g",
        isKampo: true,
        piSnippetSource: "通常1日7.5gを2〜3回。年齢、体重、症状により適宜増減する(Augsberger式等)。",
        dosage: {
            note: "Augsberger式。7.5g/日基準。"
        },
        piSnippet: "通常1日7.5gを2〜3回に分割して服用する。なお、年齢、体重、症状により適宜増減する。"
    }
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
            <div class="potency-tag">${getPharmaClass(d.yjCode)}</div>
            <h3 class="line-clamp-2">${d.name}</h3>
            <div class="text-[7px] text-gray-400 mt-auto font-mono opacity-60">YJ: ${d.yjCode}</div>
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
            document.getElementById('empty-state-side').classList.add('hidden');
            document.getElementById('initial-guide').classList.add('hidden');
            renderDrugCards();
            updateCalculations();
            updateCalculations();
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
    const selectedSubOption = drug.hasSubOptions ? drug.subOptions.find(o => o.id === selectedSubOptionId) : null;
    const currentPi = drug.hasSubOptions ? (selectedSubOption?.piSnippet || drug.piSnippet) : drug.piSnippet;
    const currentBrand = drug.brandName || drug.name.split('／')[0];
    const currentPotency = selectedSubOption?.potency || drug.potency || 100;
    const currentUnit = selectedSubOption?.unit || drug.unit || 'g';

    // PMDAリンク：rdSearch/02/形式は安定しているが、代表コードでないと検索結果一覧に止まる場合がある。
    piContainer.innerHTML = `
        <div class="pi-card bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4 mt-2">
            <div class="flex justify-between items-start mb-1">
                <span class="text-[10px] font-black text-amber-800 uppercase tracking-widest"><i class="fas fa-file-alt"></i> 添付文書 引用（${currentBrand}）</span>
                <a href="${drug.piUrl}" target="_blank" class="text-[9px] text-blue-600 hover:underline font-bold">PMDA詳細 <i class="fas fa-external-link-alt"></i></a>
            </div>
            <div class="text-[11px] text-gray-800 leading-relaxed italic mb-1 font-medium">
                「${currentPi || '詳細はリンク先参照'}」
            </div>
            <div class="text-[8px] text-gray-400 text-right font-mono opacity-50">YJ: ${drug.yjCode}</div>
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

    const formatDose = (val, d) => {
        // クラバモックス (yj-6139100R1036) は小数点第2位、他は第1位
        return d.id === 'yj-6139100R1036' ? val.toFixed(2) : val.toFixed(1);
    };

    if (drug.calcType === 'age') {
        const factor = (age * 4 + 20) / 100;
        const childDose = drug.adultDose * factor;
        const augLabel = drug.isAdultOnly ? `
            <div class="bg-amber-400/20 text-amber-200 text-[9px] p-2 rounded mb-3 border border-amber-400/30">
                <i class="fas fa-info-circle"></i> 添付文書に小児用量の記載がないため、成人量(${drug.adultDose}${drug.unit}/日)に基づきAugsberger式で算出。
            </div>
        ` : '';
        resultArea.innerHTML = `
            <div class="bg-indigo-600 text-white p-6 rounded-xl shadow-lg border-b-4 border-indigo-800">
                <div class="text-xl font-black mb-4 border-b border-white/20 pb-2">${drug.name}</div>
                <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Augsberger式算出 (${age}歳 | 成人量の${(factor * 100).toFixed(0)}%)</div>
                ${augLabel}
                <div class="flex items-baseline gap-2">
                    <span class="text-3xl font-black">${formatDose(childDose, drug)}</span>
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
                        <span class="text-3xl font-black">${formatDose(found.dose, drug)}</span>
                        <span class="text-xl font-bold">${found.unit} / 回</span>
                    </div>
                </div>
            `;
        } else {
            resultArea.innerHTML = '<p class="text-center text-rose-500 py-10 font-bold bg-rose-50 rounded-xl">対象年齢範囲外、またはデータなし</p>';
        }
    } else if (drug.calcType === 'weight-step') {
        const found = drug.weightSteps.find(ws => weight >= ws.weightMin && weight < ws.weightMax);
        if (found) {
            const dailyDose = found.isPerKg ? (weight * found.dose) : found.dose;
            const tpd = drug.dosage?.timesPerDay || 2;
            resultArea.innerHTML = `
                <div class="bg-emerald-600 text-white p-6 rounded-xl shadow-lg border-b-4 border-emerald-800">
                    <div class="text-xl font-black mb-4 border-b border-white/20 pb-2">${drug.name}</div>
                    <div class="text-xs font-bold uppercase tracking-widest mb-3 opacity-80">体重区分: ${found.label}</div>
                    <div class="flex flex-col gap-4">
                        <div class="bg-white/10 p-3 rounded-lg opacity-80 border border-white/5">
                            <div class="text-[9px] font-bold opacity-80 mb-1">1回量 (目安)</div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-xl font-black">${formatDose(dailyDose / tpd, drug)}</span>
                                <span class="text-lg font-bold">${found.unit} / 回</span>
                            </div>
                        </div>
                        <div class="bg-white/20 p-4 rounded-lg ring-1 ring-white/30">
                            <div class="text-[10px] font-black opacity-90 mb-1 tracking-wider">1日合計量</div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-3xl font-black">${formatDose(dailyDose, drug)}</span>
                                <span class="text-xl font-bold">${found.unit} / 日</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultArea.innerHTML = '<p class="text-center text-rose-500 py-10 font-bold bg-rose-50 rounded-xl">対象体重範囲外 (用量表なし)</p>';
        }
    } else if (drug.calcType === 'age-weight-switch') {
        const branch = drug.ageBranches.find(b => age >= b.ageMin && age < b.ageMax);
        if (branch) {
            let info = branch.dosage;
            let displayDosePerTime = 0;
            let subText = '';

            if (info.isFixed) {
                displayDosePerTime = info.dosePerTime / currentPotency;
                subText = `(固定量: 1回${info.dosePerTime}${info.unit || 'μg'})`;
            } else {
                displayDosePerTime = (weight * info.timeMgKg) / currentPotency;
                subText = `(体重換算: 1回${info.timeMgKg}${info.unit || 'μg'}/kg)`;
            }

            const dailyTotal = displayDosePerTime * (info.timesPerDay || 1);

            resultArea.innerHTML = `
                <div class="bg-sky-600 text-white p-5 rounded-xl shadow-lg border-b-4 border-sky-800">
                    <div class="text-xl font-black mb-4 border-b border-white/20 pb-2">${drug.name}</div>
                    <div class="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">${branch.label}</div>
                    <div class="flex flex-col gap-3">
                        <div class="bg-white/10 p-3 rounded-lg">
                            <div class="text-[9px] font-bold opacity-80 mb-1">1回量</div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-xl font-black">${formatDose(displayDosePerTime, drug)}</span>
                                <span class="text-lg font-bold">${drug.unit || 'g'} / 回</span>
                            </div>
                        </div>
                        <div class="bg-white/10 p-2 px-3 rounded-lg">
                            <div class="text-[9px] font-bold opacity-80 mb-1">1日合計量 (${info.timesPerDay || '1-3'}回)</div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-3xl font-black">${formatDose(dailyTotal, drug)}</span>
                                <span class="text-xl font-bold">${drug.unit || 'g'} / 日</span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-2 text-[9px] opacity-70 italic">${subText}</div>
                </div>
            `;
        } else {
            resultArea.innerHTML = '<p class="text-center text-rose-500 py-10 font-bold bg-rose-50 rounded-xl">対象年齢範囲外</p>';
        }
    } else {
        let doseInfo = drug.hasSubOptions ? (drug.subOptions.find(o => o.id === selectedSubOptionId)?.dosage || drug.dosage) : drug.dosage;
        const tpd = doseInfo.timesPerDay || 3; // デフォルト3回

        // 1回量の算出
        let minMgPerTime, maxMgPerTime;
        if (doseInfo.isByTime || doseInfo.timeMgKg) {
            minMgPerTime = weight * (doseInfo.timeMgKg || doseInfo.minMgKg);
            maxMgPerTime = weight * (doseInfo.timeMgKg || doseInfo.maxMgKg);
        } else {
            minMgPerTime = (weight * doseInfo.minMgKg) / tpd;
            maxMgPerTime = (weight * doseInfo.maxMgKg) / tpd;
        }

        // 成人上限値制限 (1回量)
        let isMaxPerTimeReached = false;
        if (doseInfo.absoluteMaxMgPerTime) {
            if (minMgPerTime >= doseInfo.absoluteMaxMgPerTime || maxMgPerTime >= doseInfo.absoluteMaxMgPerTime) {
                isMaxPerTimeReached = true;
            }
            minMgPerTime = Math.min(minMgPerTime, doseInfo.absoluteMaxMgPerTime);
            maxMgPerTime = Math.min(maxMgPerTime, doseInfo.absoluteMaxMgPerTime);
        }

        // 成人上限値制限 (1日量からの逆算)
        let isMaxPerDayReached = false;
        if (doseInfo.absoluteMaxMgPerDay) {
            const currentDailyMin = minMgPerTime * tpd;
            const currentDailyMax = maxMgPerTime * tpd;
            if (currentDailyMin >= doseInfo.absoluteMaxMgPerDay || currentDailyMax >= doseInfo.absoluteMaxMgPerDay) {
                isMaxPerDayReached = true;
                minMgPerTime = Math.min(minMgPerTime, doseInfo.absoluteMaxMgPerDay / tpd);
                maxMgPerTime = Math.min(maxMgPerTime, doseInfo.absoluteMaxMgPerDay / tpd);
            }
        }


        const minGPerTime = minMgPerTime / currentPotency;
        const maxGPerTime = maxMgPerTime / currentPotency;
        const isRange = minGPerTime.toFixed(3) !== maxGPerTime.toFixed(3);

        const dailyMinG = minGPerTime * tpd;
        const dailyMaxG = maxGPerTime * tpd;

        const badgeHtml = (isMaxPerTimeReached || isMaxPerDayReached)
            ? `<div class="bg-amber-400 text-indigo-950 text-[10px] px-2 py-0.5 rounded-full font-black inline-block mb-2 animate-pulse shadow-sm border border-amber-500/20">成人通常用量にて上限調整済</div>`
            : '';

        resultArea.innerHTML = `
            <div class="bg-indigo-700 text-white p-5 rounded-xl shadow-lg border-b-4 border-indigo-900 transition-all duration-300">
                <div class="text-xl font-black mb-4 border-b border-white/20 pb-2">${drug.name}</div>
                <div class="flex flex-col mb-2">
                    <div class="text-[10px] font-black uppercase tracking-widest opacity-80">体重あたり計算 (1日${tpd}回)</div>
                    ${badgeHtml}
                </div>
                <div class="flex flex-col gap-3">
                        <div class="bg-white/10 p-3 rounded-lg opacity-80 border border-white/5">
                        <div class="text-[9px] font-bold opacity-80 mb-1">1回量</div>
                        <div class="flex items-baseline gap-1">
                            <span class="text-xl font-black">${formatDose(minGPerTime, drug)}${isRange ? '〜' + formatDose(maxGPerTime, drug) : ''}</span>
                            <span class="text-lg font-bold">${currentUnit} / 回</span>
                        </div>
                    </div>
                    <div class="bg-white/20 p-4 rounded-lg ring-1 ring-white/30">
                        <div class="text-[10px] font-black opacity-90 mb-1 tracking-wider">1日合計量</div>
                        <div class="flex items-baseline gap-1">
                            <span class="text-3xl font-black">${formatDose(dailyMinG, drug)}${isRange ? '〜' + formatDose(dailyMaxG, drug) : ''}</span>
                            <span class="text-xl font-bold">${currentUnit} / 日</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
    const searchInput = document.getElementById('drug-search');
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


import { PHARMA_CLASSIFICATION_MAP } from './pharma_classification.js';

function getPharmaClass(yjCode) {
    if (!yjCode) return '';
    const code = yjCode.replace('yj-', '');
    const p3 = code.substring(0, 3);
    const p4 = code.substring(0, 4);

    const name3 = PHARMA_CLASSIFICATION_MAP[p3] || '';
    const name4 = PHARMA_CLASSIFICATION_MAP[p4] || '';

    // 両方ない場合
    if (!name3 && !name4) return 'その他';

    // 4桁がない、または3桁と4桁が「ほぼ同じ」場合は4桁（または3桁）のみ表示
    // 「ほぼ同じ」判定：一方が他方の文字列を含んでいる場合（例：去痰剤 と その他の去痰剤）
    if (!name4) return name3;
    if (!name3) return name4;

    if (name4.includes(name3) || name3.includes(name4)) {
        return name4;
    }

    // 異なる場合は連結して表示
    return `${name3}ー${name4}`;
}
