const PEDIATRIC_DRUGS = [
    {
        id: "yj-6132015C1103",
        name: "メイアクトMS小児用細粒10%",
        yjCode: "6132015C1103",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132015C1103?user=1",
        potency: 100,
        piSnippetSource: "通常1回3mg/kgを1日3回。必要に応じて1回6mg/kgまで増量可。ただし、成人最大量(1回200mg, 1日600mg)を超えないこと。",
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgPerTime: 200,
            absoluteMaxMgPerDay: 600,
            note: "通常1日9〜18mg/kgを3回。1回上限200mg(成人量)。"
        },
        piSnippet: "通常1回3mg/kgを1日3回。必要に応じて1回6mg/kgまで増量可。ただし、成人最大量(1回200mg, 1日600mg)を超えないこと。"
    },
    {
        id: "yj-6132016C1027",
        name: "フロモックス小児用細粒100mg",
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
        piSnippet: "通常1回3mg/kgを1日3回。年齢、体重および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6132011R1078",
        name: "バナン小児用ドライシロップ10%",
        yjCode: "6132011R1078",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132011R1078?user=1",
        potency: 100,
        piSnippetSource: "通常1回3mg/kgを1日3回（または2回）。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgPerDay: 200,
            note: "通常1日9〜18mg/kgを2〜3回。1日上限200mg(成人量)。"
        },
        piSnippet: "通常1回3mg/kgを1日3回（または2回）。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6132013C1031",
        name: "セフゾン細粒小児用10%",
        yjCode: "6132013C1031",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013C1031?user=1",
        potency: 100,
        piSnippetSource: "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgPerDay: 300,
            note: "1日9〜18mg/kgを3回。1日上限300mg(成人量)。"
        },
        piSnippet: "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6132005C1053",
        name: "ケフラール細粒小児用",
        yjCode: "6132005C1053",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132005C1053?user=1",
        potency: 100,
        piSnippetSource: "通常1日20〜40mg/kgを3回。重症等の場合は1日100mg/kgまで。",
        dosage: {
            minMgKg: 20,
            maxMgKg: 40,
            absoluteMaxMgKg: 100,
            note: "通常1日20〜40mg/kgを3回。"
        },
        piSnippet: "通常1日20〜40mg/kgを3回。重症等の場合は1日100mg/kgまで。"
    },
    {
        id: "yj-6132009C2023",
        name: "トミロン細粒小児用10%／20%",
        yjCode: "6132009C2023",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132009C2023?user=1",
        potency: 100,
        piSnippetSource: "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            note: "1日9〜18mg/kgを3回。"
        },
        piSnippet: "通常1日9〜18mg/kgを3回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6131001C1210",
        name: "サワシリン細粒10%",
        yjCode: "6131001C1210",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C1210?user=1",
        potency: 100,
        piSnippetSource: "通常1日20〜40mg/kgを3〜4回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 20,
            maxMgKg: 40,
            note: "1日20〜40mg/kgを3〜4回。"
        },
        piSnippet: "通常1日20〜40mg/kgを3〜4回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6131001C2100",
        name: "ワイドシリン細粒20%",
        yjCode: "6131001C2100",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C2100?user=1",
        potency: 200,
        piSnippetSource: "通常1日20〜40mg/kgを3〜4回。1日最大90mg/kg(成人最大2g)を超えないこと。",
        dosage: {
            minMgKg: 20,
            maxMgKg: 40,
            absoluteMaxMgKg: 90,
            note: "1日最大90mg/kg。"
        },
        piSnippet: "通常1日20〜40mg/kgを3〜4回。1日最大90mg/kg(成人最大2g)を超えないこと。"
    },
    {
        id: "yj-6131001C1228",
        name: "パセトシン細粒10%",
        yjCode: "6131001C1228",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C1228?user=1",
        potency: 100,
        piSnippetSource: "通常1日20〜40mg/kgを3〜4回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 20,
            maxMgKg: 40,
            note: "1日20〜40mg/kgを3〜4回。"
        },
        piSnippet: "通常1日20〜40mg/kgを3〜4回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6131001C1260",
        name: "アモキシシリン細粒10%「タツミ」",
        yjCode: "6131001C1260",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C1260?user=1",
        potency: 100,
        piSnippetSource: "通常1日20〜40mg/kgを3〜4回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 20,
            maxMgKg: 40,
            note: "1日20〜40mg/kgを3〜4回。"
        },
        piSnippet: "通常1日20〜40mg/kgを3〜4回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6131008C1033",
        name: "ユナシン細粒小児用10%",
        yjCode: "6131008C1033",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131008C1033?user=1",
        potency: 100,
        piSnippetSource: "通常1日30〜60mg/kgを3回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 30,
            maxMgKg: 60,
            note: "通常1日30〜60mg/kgを3回。"
        },
        piSnippet: "通常1日30〜60mg/kgを3回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6149003R1062",
        name: "クラリスロマイシンDS10%「タカタ」",
        yjCode: "6149003R1062",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149003R1062?user=1",
        potency: 100,
        piSnippetSource: "通常1日10〜15mg/kgを2回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 10,
            maxMgKg: 15,
            isByTime: true,
            timeMgKg: 5,
            timesPerDay: 2,
            note: "1日10〜15mg/kgを2回。"
        },
        piSnippet: "通常1日10〜15mg/kgを2回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6149003R1143",
        name: "クラリスドライシロップ10%小児用",
        yjCode: "6149003R1143",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149003R1143?user=1",
        potency: 100,
        piSnippetSource: "通常1日10〜15mg/kgを2回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 10,
            maxMgKg: 15,
            isByTime: true,
            timesPerDay: 2,
            note: "1日10〜15mg/kgを2回。"
        },
        piSnippet: "通常1日10〜15mg/kgを2回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6149004C1030",
        name: "ジスロマック細粒小児用10%",
        yjCode: "6149004C1030",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004C1030?user=1",
        potency: 100,
        calcType: "weight-step",
        weightSteps: [
            {
                weightMin: 0.1,
                weightMax: 15,
                dose: 0.1,
                isPerKg: true,
                unit: "g",
                label: "15kg未満: 10mg/kg"
            },
            {
                weightMin: 15,
                weightMax: 25,
                dose: 2,
                unit: "g",
                label: "15kg〜25kg未満: 2g"
            },
            {
                weightMin: 25,
                weightMax: 35,
                dose: 3,
                unit: "g",
                label: "25kg〜35kg未満: 3g"
            },
            {
                weightMin: 35,
                weightMax: 45,
                dose: 4,
                unit: "g",
                label: "35kg〜45kg未満: 4g"
            },
            {
                weightMin: 45,
                weightMax: 1000,
                dose: 5,
                unit: "g",
                label: "45kg以上: 5g"
            }
        ],
        dosage: {
            note: "1日1回10mg/kg(最大500mg)を3日間。15kg以上は段階的用量設定。"
        },
        piSnippetSource: "1日1回10mg/kgを3日間投与。最大500mg。体重15kg以上の小児には専用の用量設定表がある。",
        piSnippet: "1日1回10mg/kgを3日間投与。最大500mg。体重15kg以上の小児には専用の用量設定表がある。"
    },
    {
        id: "yj-6149004C1048",
        name: "アジスロマイシン細粒小児用10%「JG」",
        yjCode: "6149004C1048",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004C1048?user=1",
        potency: 100,
        piSnippetSource: "通常1日1回10mg/kgを3日間投与。最大500mg。",
        dosage: {
            minMgKg: 10,
            maxMgKg: 10,
            absoluteMaxMgPerDay: 500,
            note: "1日1回10mg/kg(最大500mg)を3日間。"
        },
        piSnippet: "通常1日1回10mg/kgを3日間投与。最大500mg。"
    },
    {
        id: "yj-6149004C1080",
        name: "アジスロマイシン小児用細粒10%「タカタ」",
        yjCode: "6149004C1080",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004C1080?user=1",
        potency: 100,
        piSnippetSource: "通常1日1回10mg/kgを3日間投与。最大500mg。",
        dosage: {
            minMgKg: 10,
            maxMgKg: 10,
            absoluteMaxMgPerDay: 500,
            note: "1日1回10mg/kg(最大500mg)を3日間。"
        },
        piSnippet: "通常1日1回10mg/kgを3日間投与。最大500mg。"
    },
    {
        id: "yj-6149004C1102",
        name: "アジスロマイシン細粒小児用10%「トーワ」",
        yjCode: "6149004C1102",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004C1102?user=1",
        potency: 100,
        piSnippetSource: "通常1日1回10mg/kgを3日間投与。最大500mg。",
        dosage: {
            minMgKg: 10,
            maxMgKg: 10,
            absoluteMaxMgPerDay: 500,
            note: "1日1回10mg/kg(最大500mg)を3日間。"
        },
        piSnippet: "通常1日1回10mg/kgを3日間投与。最大500mg。"
    },
    {
        id: "yj-6141001R2053",
        name: "エリスロシンドライシロップW20%",
        yjCode: "6141001R2053",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6141001R2053?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-6241010C1024",
        name: "オゼックス小児用細粒15%",
        yjCode: "6241010C1024",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6241010C1024?user=1",
        potency: 150,
        piSnippetSource: "通常1回6mg/kgを1日2回。最大1回12mg/kgまで。",
        dosage: {
            minMgKg: 12,
            maxMgKg: 24,
            isByTime: true,
            timeMgKg: 6,
            timesPerDay: 2,
            note: "通常1回6mg/kgを1日2回。最大1回12mg/kg。"
        },
        piSnippet: "通常1回6mg/kgを1日2回。最大1回12mg/kgまで。"
    },
    {
        id: "yj-6241010C1032",
        name: "トスフロキサシントシル酸塩小児用細粒15%「タカタ」",
        yjCode: "6241010C1032",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6241010C1032?user=1",
        potency: 150,
        piSnippetSource: "通常1回6mg/kgを1日2回。最大1回12mg/kgまで。",
        dosage: {
            minMgKg: 12,
            maxMgKg: 24,
            isByTime: true,
            timeMgKg: 6,
            timesPerDay: 2,
            note: "通常1回6mg/kgを1日2回。最大1回12mg/kg。"
        },
        piSnippet: "通常1回6mg/kgを1日2回。最大1回12mg/kgまで。"
    },
    {
        id: "yj-6139001R1032",
        name: "ファロムドライシロップ小児用10%",
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
            note: "通常1回5mg/kgを3回。最大1回10mg/kg。"
        },
        piSnippet: "通常1回5mg/kgを3回。最大1回10mg/kg。年齢、体重、症状により適宜増減する。"
    },
    {
        id: "yj-6135001R2110",
        name: "ホスミシンドライシロップ400",
        yjCode: "6135001R2110",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6135001R2110?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-6152005D1094",
        name: "ミノマイシン顆粒2%",
        yjCode: "6152005D1094",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6152005D1094?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-6250021R1024",
        name: "タミフルドライシロップ3%",
        yjCode: "6250021R1024",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250021R1024?user=1",
        potency: 30,
        hasSubOptions: true,
        subOptions: [
            {
                id: "over1y",
                label: "1歳以上",
                dosage: {
                    minMgKg: 4,
                    maxMgKg: 4,
                    isByTime: true,
                    timeMgKg: 2,
                    timesPerDay: 2,
                    absoluteMaxMgPerTime: 75,
                    note: "1回2mg/kgを2回。5日間。"
                },
                piSnippet: "1回2mg/kgを1日2回、5日間投与。1回最高75mg。"
            },
            {
                id: "under1y",
                label: "1歳未満",
                dosage: {
                    minMgKg: 6,
                    maxMgKg: 6,
                    isByTime: true,
                    timeMgKg: 3,
                    timesPerDay: 2,
                    absoluteMaxMgPerTime: 75,
                    note: "1回3mg/kgを2回。5日間。"
                },
                piSnippet: "1回3mg/kgを1日2回、5日間投与。1回最高75mg。"
            }
        ],
        piSnippet: ""
    },
    {
        id: "yj-6250021R1032",
        name: "オセルタミビルDS3%「サワイ」",
        yjCode: "6250021R1032",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250021R1032?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-6250002D1024",
        name: "ゾビラックス顆粒40%",
        yjCode: "6250002D1024",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250002D1024?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4490020R1027",
        name: "ジルテックドライシロップ1.25%",
        yjCode: "4490020R1027",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490020R1027?user=1",
        potency: 12.5,
        piSnippetSource: "2歳以上7歳未満：1回0.2gを1日2回。7歳以上15歳未満：1回0.4gを1日2回。",
        calcType: "fixed-age",
        fixedDoses: [
            {
                ageMin: 2,
                ageMax: 7,
                dose: 0.2,
                unit: "g",
                label: "2-7歳未満"
            },
            {
                ageMin: 7,
                ageMax: 15,
                dose: 0.4,
                unit: "g",
                label: "7-15歳未満"
            }
        ],
        piSnippet: "2歳以上7歳未満：1回0.2gを1日2回。7歳以上15歳未満：1回0.4gを1日2回。"
    },
    {
        id: "yj-4490020R1035",
        name: "セチリジン塩酸塩DS1.25%「タカタ」",
        yjCode: "4490020R1035",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490020R1035?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4490023R2027",
        name: "アレグラドライシロップ5%",
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
        id: "yj-4490027R1029",
        name: "クラリチンドライシロップ1%",
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
        name: "ザイザルシロップ0.05%",
        yjCode: "4490028Q1028",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490028Q1028?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4490025D1022",
        name: "アレロック顆粒0.5%",
        yjCode: "4490025D1022",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490025D1022?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4490003R1228",
        name: "ザジテンドライシロップ0.1%",
        yjCode: "4490003R1228",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490003R1228?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4413004C2022",
        name: "ゼスラン細粒小児用0.6%",
        yjCode: "4413004C2022",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4413004C2022?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4419005B1045",
        name: "ペリアクチン散1%",
        yjCode: "4419005B1045",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4419005B1045?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4419002B1033",
        name: "ポララミン散1%",
        yjCode: "4419002B1033",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4419002B1033?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4490022R1025",
        name: "アレジオンドライシロップ1%",
        yjCode: "4490022R1025",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490022R1025?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-2233002R2029",
        name: "ムコダインDS50%",
        yjCode: "2233002R2029",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2233002R2029?user=1",
        potency: 500,
        piSnippetSource: "通常1回10mg/kgを3回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 30,
            maxMgKg: 30,
            isByTime: true,
            timeMgKg: 10,
            timesPerDay: 3,
            note: "通常1回10mg/kgを3回。"
        },
        piSnippet: "通常1回10mg/kgを3回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-2233002R2037",
        name: "カルボシステインDS50%「タカタ」",
        yjCode: "2233002R2037",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2233002R2037?user=1",
        potency: 500,
        piSnippetSource: "通常1回10mg/kgを3回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 30,
            maxMgKg: 30,
            isByTime: true,
            timeMgKg: 10,
            timesPerDay: 3,
            note: "通常1回10mg/kgを3回。"
        },
        piSnippet: "通常1回10mg/kgを3回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-2239001Q1166",
        name: "ムコソルバンDS1.5%",
        yjCode: "2239001Q1166",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2239001Q1166?user=1",
        potency: 15,
        piSnippetSource: "通常1日0.9〜1.2mg/kgを3回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 0.9,
            maxMgKg: 1.2,
            isByTime: true,
            timeMgKg: 0.3,
            timesPerDay: 3,
            note: "通常1日0.9〜1.2mg/kgを3回。"
        },
        piSnippet: "通常1日0.9〜1.2mg/kgを3回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-2249003B1037",
        name: "アスベリン散10%",
        yjCode: "2249003B1037",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2249003B1037?user=1",
        potency: 100,
        piSnippetSource: "通常1日1mg/kgを3回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 1,
            maxMgKg: 1,
            isByTime: true,
            timeMgKg: 0.33,
            timesPerDay: 3,
            note: "通常1日1mg/kgを3回。"
        },
        piSnippet: "通常1日1mg/kgを3回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-2223001B1210",
        name: "メジコン散10%",
        yjCode: "2223001B1210",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2223001B1210?user=1",
        potency: 100,
        calcType: "age",
        adultDose: 90,
        unit: "mg",
        isAdultOnly: true,
        piSnippetSource: "通常、成人には1回15〜30mgを1日1〜4回経口投与。年齢、症状により適宜増減する。",
        dosage: {
            note: "添付文書に小児用量なし。Augsberger式算定。"
        },
        piSnippet: "通常、成人には1回15〜30mgを1日1〜4回経口投与。年齢、症状により適宜増減する。"
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
            note: "通常1回0.02mg/kgを2回。"
        },
        piSnippet: "通常1回0.02mg/kgを2回。年齢および症状に応じて適宜増減する。"
    },
    {
        id: "yj-2259002R1118",
        name: "ツロブテロールDS0.1%「タカタ」",
        yjCode: "2259002R1118",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2259002R1118?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-2251001D1061",
        name: "テオドールドライシロップ20%",
        yjCode: "2251001D1061",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2251001D1061?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-2254001D1030",
        name: "メプチン顆粒0.01%",
        yjCode: "2254001D1030",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2254001D1030?user=1",
        potency: 0.1,
        unit: "g",
        calcType: "age-weight-switch",
        piSnippetSource: "6歳以上：1回25μg(0.25g)を1日2回。6歳未満：1回1.25μg/kg(0.025g/kg)を1日2〜3回。",
        ageBranches: [
            {
                ageMin: 0,
                ageMax: 6,
                label: "6歳未満: 体重換算 (1.25μg/kg)",
                dosage: {
                    isFixed: false,
                    timeMgKg: 1.25,
                    unit: "μg",
                    timesPerDay: 2,
                    note: "通常1回1.25μg/kgを1日2回（または3回）。"
                }
            },
            {
                ageMin: 6,
                ageMax: 100,
                label: "6歳以上: 固定量 (1回25μg)",
                dosage: {
                    isFixed: true,
                    dosePerTime: 25,
                    unit: "μg",
                    timesPerDay: 1,
                    note: "通常1回25μg(0.25g)を1日1〜2回。"
                }
            }
        ],
        piSnippet: "6歳以上：1回25μg(0.25g)を1日2回。6歳未満：1回1.25μg/kg(0.025g/kg)を1日2〜3回。"
    },
    {
        id: "yj-4490026C1030",
        name: "シングレア細粒4mg",
        yjCode: "4490026C1030",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490026C1030?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4490026C1021",
        name: "キプレス細粒4mg",
        yjCode: "4490026C1021",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490026C1021?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4490026C1129",
        name: "モンテルカスト細粒4mg「タカタ」",
        yjCode: "4490026C1129",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490026C1129?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4490017R1033",
        name: "オノンDS10%",
        yjCode: "4490017R1033",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490017R1033?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-1141007C1075",
        name: "カロナール細粒20%",
        yjCode: "1141007C1075",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007C1075?user=1",
        potency: 200,
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
        id: "yj-1141007C2020",
        name: "カロナール細粒50%",
        yjCode: "1141007C2020",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007C2020?user=1",
        potency: 500,
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
        id: "yj-1141007Q1048",
        name: "カロナールシロップ2%",
        yjCode: "1141007Q1048",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007Q1048?user=1",
        potency: 200,
        piSnippetSource: "1回10〜15mg/kg。投与間隔は4〜6時間以上。1日総量60mg/kg限度。成人最大量(1回500mg, 1日1500mg)を超えないこと。",
        dosage: {
            minMgKg: 10,
            maxMgKg: 15,
            absoluteMaxMgKg: 60,
            isByTime: true,
            timeMgKg: 10,
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
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-1180107D1131",
        name: "PL配合顆粒",
        yjCode: "1180107D1131",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1180107D1131?user=1",
        calcType: "age",
        adultDose: 3,
        unit: "g",
        isAdultOnly: true,
        piSnippetSource: "通常、成人には1回1gを1日3回経口投与。年齢、症状により適宜増減する。",
        dosage: {
            note: "添付文書に小児用量なし。Augsberger式算定。"
        },
        piSnippet: "通常、成人には1回1gを1日3回経口投与。年齢、症状により適宜増減する。"
    },
    {
        id: "yj-2316004B1036",
        name: "ビオフェルミンR散",
        yjCode: "2316004B1036",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316004B1036?user=1",
        calcType: "age",
        adultDose: 3,
        unit: "g",
        piSnippetSource: "通常1日1.5〜3gを3回。年齢、症状により適宜増減する。",
        dosage: {
            note: "目安1日1.5〜3g(3回)。"
        },
        piSnippet: "通常1日1.5〜3gを3回。年齢、症状により適宜増減する。"
    },
    {
        id: "yj-2316009C1026",
        name: "ミヤBM細粒",
        yjCode: "2316009C1026",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316009C1026?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-2316014B1030",
        name: "ラックビー微粒N",
        yjCode: "2316014B1030",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316014B1030?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-2399005R1163",
        name: "ナウゼリンドライシロップ1%",
        yjCode: "2399005R1163",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2399005R1163?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-2331004B1046",
        name: "アドソルビン原末",
        yjCode: "2331004B1046",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2331004B1046?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-3222012Q1030",
        name: "インクレミンシロップ5%",
        yjCode: "3222012Q1030",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/3222012Q1030?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-1139010R1020",
        name: "イーケプラドライシロップ50%",
        yjCode: "1139010R1020",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1139010R1020?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-1139004C2061",
        name: "デパケン細粒",
        yjCode: "1139004C2061",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1139004C2061?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-5200139D1037",
        name: "抑肝散エキス顆粒",
        yjCode: "5200139D1037",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200139D1037?user=1",
        calcType: "age",
        adultDose: 7.5,
        unit: "g",
        piSnippetSource: "通常1日7.5gを2〜3回。年齢、体重、症状により適宜増減する(Augsberger式等)。",
        dosage: {
            note: "Augsberger式。7.5g/日基準。"
        },
        piSnippet: "通常1日7.5gを2〜3回。年齢、体重、症状により適宜増減する(Augsberger式等)。"
    },
    {
        id: "yj-5200013D1123",
        name: "葛根湯エキス顆粒",
        yjCode: "5200013D1123",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200013D1123?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-5200072D1058",
        name: "小建中湯エキス顆粒",
        yjCode: "5200072D1058",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200072D1058?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
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
                label: "6〜10kg: 1.01g(2パウチ)"
            },
            {
                weightMin: 11,
                weightMax: 17,
                dose: 2.02,
                unit: "g",
                label: "11〜16kg: 2.02g(4パウチ)"
            },
            {
                weightMin: 17,
                weightMax: 24,
                dose: 3.03,
                unit: "g",
                label: "17〜23kg: 3.03g(6パウチ)"
            },
            {
                weightMin: 24,
                weightMax: 31,
                dose: 4.04,
                unit: "g",
                label: "24〜30kg: 4.04g(8パウチ)"
            },
            {
                weightMin: 31,
                weightMax: 37,
                dose: 5.05,
                unit: "g",
                label: "31〜36kg: 5.05g(10パウチ)"
            },
            {
                weightMin: 37,
                weightMax: 40,
                dose: 6.06,
                unit: "g",
                label: "37〜39kg: 6.06g(12パウチ)"
            }
        ],
        dosage: {
            note: "1日量を12時間ごと(1日2回)に投与。添付文書の分包用量表に準拠。"
        },
        piSnippetSource: "通常、1日96.4mg/kgを2回に分けて経口投与。分包製剤(パウチ)の場合は体重区分(6-10kg, 11-16kg等)ごとの固定量を投与する。",
        piSnippet: "通常、1日96.4mg/kgを2回に分けて経口投与。分包製剤(パウチ)の場合は体重区分(6-10kg, 11-16kg等)ごとの固定量を投与する。"
    },
    {
        id: "yj-2251001R1123",
        name: "テオフィリン徐放ドライシロップ小児用20％「サワイ」",
        yjCode: "2251001R1123",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2251001R1123?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-4490005R1448",
        name: "オキサトミドDS小児用2％「サワイ」",
        yjCode: "4490005R1448",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490005R1448?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-6132016C1132",
        name: "セフカペンピボキシル塩酸塩細粒小児用10%「TW」",
        yjCode: "6132016C1132",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1132?user=1",
        potency: 100,
        piSnippetSource: "通常1回3mg/kgを1日3回。年齢、体重および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            note: "通常1日9〜18mg/kgを3回。"
        },
        piSnippet: "通常1回3mg/kgを1日3回。年齢、体重および症状に応じて適宜増減する。"
    },
    {
        id: "yj-6250019D1046",
        name: "バラシクロビル顆粒50%「トーワ」",
        yjCode: "6250019D1046",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250019D1046?user=1",
        potency: 500,
        piSnippetSource: "体重1kgあたり1回25mgを1日2回経口投与する。1回最大用量は500mgとする。",
        dosage: {
            minMgKg: 50,
            maxMgKg: 50,
            isByTime: true,
            timeMgKg: 25,
            timesPerDay: 2,
            absoluteMaxMgPerTime: 500,
            note: "通常1回25mg/kg(最大500mg)を2回。"
        },
        piSnippet: "体重1kgあたり1回25mgを1日2回経口投与する。1回最大用量は500mgとする。"
    },
    {
        id: "yj-6132015C1090",
        name: "セフジトレンピボキシル細粒10%小児用「日医工」",
        yjCode: "6132015C1090",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132015C1090?user=1",
        potency: 100,
        dosage: {
            minMgKg: 0,
            maxMgKg: 0,
            note: "用量データ未設定"
        },
        piSnippet: ""
    },
    {
        id: "yj-2233002Q1159",
        name: "カルボシステインDS小児用「NIG」",
        yjCode: "2233002Q1159",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2233002Q1159?user=1",
        potency: 500,
        piSnippetSource: "通常1回10mg/kgを3回。年齢および症状に応じて適宜増減する。",
        dosage: {
            minMgKg: 30,
            maxMgKg: 30,
            isByTime: true,
            timeMgKg: 10,
            timesPerDay: 3,
            note: "通常1回10mg/kgを3回。"
        },
        piSnippet: "通常1回10mg/kgを3回。年齢および症状に応じて適宜増減する。"
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
            <div class="potency-tag">${d.calcType === 'age' ? '漢方' : (d.calcType === 'fixed-age' ? '固定' : (d.potency >= 100 ? (d.potency / 10).toFixed(1) + '%' : d.potency + (d.unit || 'mg') + '/g'))}</div>
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
    const currentPi = drug.hasSubOptions ? drug.subOptions.find(o => o.id === selectedSubOptionId)?.piSnippet : drug.piSnippet;

    // PMDAリンク：rdSearch/02/形式は安定しているが、代表コードでないと検索結果一覧に止まる場合がある。
    // 「iyakuDetail/result/[YJコード]」は直接詳細へ飛ばす可能性が高い。
    // ここでは rdSearch/02/ を維持しつつ、YJコードを Okusuri Pakkun の定義に合わせる。
    piContainer.innerHTML = `
        <div class="pi-card bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4 mt-2">
            <div class="flex justify-between items-start mb-1">
                <span class="text-[10px] font-black text-amber-800 uppercase tracking-widest"><i class="fas fa-file-alt"></i> 添付文書 引用</span>
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
            let dailyDose = found.isPerKg ? (weight * found.dose) : found.dose;
            resultArea.innerHTML = `
                <div class="bg-emerald-600 text-white p-5 rounded-xl shadow-lg border-b-4 border-emerald-800">
                    <div class="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">体重区分: ${found.label}</div>
                    <div class="flex flex-col gap-3">
                        <div class="bg-white/10 p-3 rounded-lg">
                            <div class="text-[9px] font-bold opacity-80 mb-1">1回量 (目安)</div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-3xl font-black">${formatDose(dailyDose / 2, drug)}</span>
                                <span class="text-xl font-bold">${found.unit} / 回</span>
                            </div>
                        </div>
                        <div class="bg-white/10 p-2 px-3 rounded-lg">
                            <div class="text-[9px] font-bold opacity-80 mb-1">1日合計量</div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-xl font-black">${formatDose(dailyDose, drug)}</span>
                                <span class="text-base font-bold">${found.unit} / 日</span>
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
                displayDosePerTime = info.dosePerTime / drug.potency;
                subText = `(固定量: 1回${info.dosePerTime}${info.unit || 'μg'})`;
            } else {
                displayDosePerTime = (weight * info.timeMgKg) / drug.potency;
                subText = `(体重換算: 1回${info.timeMgKg}${info.unit || 'μg'}/kg)`;
            }

            const dailyTotal = displayDosePerTime * (info.timesPerDay || 1);

            resultArea.innerHTML = `
                <div class="bg-sky-600 text-white p-5 rounded-xl shadow-lg border-b-4 border-sky-800">
                    <div class="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">${branch.label}</div>
                    <div class="flex flex-col gap-3">
                        <div class="bg-white/10 p-3 rounded-lg">
                            <div class="text-[9px] font-bold opacity-80 mb-1">1回量</div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-3xl font-black">${formatDose(displayDosePerTime, drug)}</span>
                                <span class="text-xl font-bold">${drug.unit || 'g'} / 回</span>
                            </div>
                        </div>
                        <div class="bg-white/10 p-2 px-3 rounded-lg">
                            <div class="text-[9px] font-bold opacity-80 mb-1">1日合計量 (${info.timesPerDay || '1-3'}回)</div>
                            <div class="flex items-baseline gap-2">
                                <span class="text-xl font-black">${formatDose(dailyTotal, drug)}</span>
                                <span class="text-base font-bold">${drug.unit || 'g'} / 日</span>
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
        let doseInfo = drug.hasSubOptions ? drug.subOptions.find(o => o.id === selectedSubOptionId).dosage : drug.dosage;
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

        const minGPerTime = minMgPerTime / drug.potency;
        const maxGPerTime = maxMgPerTime / drug.potency;
        const isRange = minGPerTime.toFixed(3) !== maxGPerTime.toFixed(3);

        const dailyMinG = minGPerTime * tpd;
        const dailyMaxG = maxGPerTime * tpd;

        const badgeHtml = (isMaxPerTimeReached || isMaxPerDayReached)
            ? `<div class="bg-amber-400 text-indigo-950 text-[10px] px-2 py-0.5 rounded-full font-black inline-block mb-2 animate-pulse shadow-sm border border-amber-500/20">成人用量にて上限調整済</div>`
            : '';

        resultArea.innerHTML = `
            <div class="bg-indigo-700 text-white p-5 rounded-xl shadow-lg border-b-4 border-indigo-900 transition-all duration-300">
                <div class="flex flex-col mb-2">
                    <div class="text-[10px] font-black uppercase tracking-widest opacity-80">体重あたり計算 (1日${tpd}回)</div>
                    ${badgeHtml}
                </div>
                <div class="flex flex-col gap-3">
                    <div class="bg-white/10 p-3 rounded-lg border border-white/10">
                        <div class="text-[9px] font-bold opacity-80 mb-1">1回量</div>
                        <div class="flex items-baseline gap-1">
                            <span class="text-3xl font-black">${formatDose(minGPerTime, drug)}${isRange ? '〜' + formatDose(maxGPerTime, drug) : ''}</span>
                            <span class="text-xl font-bold">${drug.unit || 'g'} / 回</span>
                        </div>
                    </div>
                    <div class="bg-white/10 p-2 px-3 rounded-lg">
                        <div class="text-[9px] font-bold opacity-80 mb-1">1日合計量</div>
                        <div class="flex items-baseline gap-1">
                            <span class="text-xl font-black">${formatDose(dailyMinG, drug)}${isRange ? '〜' + formatDose(dailyMaxG, drug) : ''}</span>
                            <span class="text-base font-bold">${drug.unit || 'g'} / 日</span>
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
