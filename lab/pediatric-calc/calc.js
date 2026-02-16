const PEDIATRIC_DRUGS = [
    {
    id: "ms-10",
    name: "メイアクトMS小児用細粒10%",
    yjCode: "6132015C1103",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132015C1103?user=1",
    potency: 100,
    dosage: {
        minMgKg: 9,
        maxMgKg: 18,
        absoluteMaxMgKg: 18,
        note: "通常1日9〜18mg/kgを3回。1回上限6mg/kg。"
    },
    piSnippet: "バナナ風味で比較的飲みやすい抗生物質です。鉄剤と同時に飲むと吸収が悪くなることがあるため、時間を空けてください。ヨーグルトとの相性が特に良いです。メーカー指導箋あり。"
},
    {
    id: "100mg",
    name: "フロモックス小児用細粒100mg",
    yjCode: "6132016C1027",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1027?user=1",
    potency: 100,
    dosage: {
        minMgKg: 9,
        maxMgKg: 18,
        note: "通常1日9〜18mg/kgを3回。"
    },
    piSnippet: "イチゴ風味ですが、時間が経つと苦味が出るため、混ぜたらすぐに飲ませてください。酸性のものと混ぜると苦味が増すことがあります。メーカー指導箋あり。"
},
    {
    id: "10",
    name: "バナン小児用ドライシロップ10%",
    yjCode: "6132011R1078",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132011R1078?user=1",
    potency: 100,
    dosage: {
        minMgKg: 9,
        maxMgKg: 18,
        note: "通常1日9〜18mg/kgを2〜3回。"
    },
    piSnippet: "オレンジ風味ですが、水に混ぜると苦味を感じやすくなるため、アイスやジュースに混ぜるのがおすすめです。便が赤っぽくなることがあります。メーカー指導箋あり。"
},
    {
    id: "10",
    name: "セフゾン細粒小児用10%",
    yjCode: "6132013C1031",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013C1031?user=1",
    potency: 100,
    dosage: {
        minMgKg: 9,
        maxMgKg: 18,
        note: "1日9〜18mg/kgを3回。"
    },
    piSnippet: "非常に飲みやすい。便が赤くなることがある。"
},
    {
    id: "drug-kzz6l",
    name: "ケフラール細粒小児用",
    yjCode: "6132005C1053",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132005C1053?user=1",
    potency: 100,
    dosage: {
        minMgKg: 20,
        maxMgKg: 40,
        absoluteMaxMgKg: 100,
        note: "通常1日20〜40mg/kgを3回。"
    },
    piSnippet: "セフェム系。"
},
    {
    id: "10-20",
    name: "トミロン細粒小児用10%／20%",
    yjCode: "6132009C2023",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132009C2023?user=1",
    potency: 100,
    dosage: {
        minMgKg: 9,
        maxMgKg: 18,
        note: "1日9〜18mg/kgを3回。"
    },
    piSnippet: "ピボキシル基を持たないため低カルニチン血症のリスクが低い。"
},
    {
    id: "10",
    name: "サワシリン細粒10%",
    yjCode: "6131001C1210",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C1210?user=1",
    potency: 100,
    dosage: {
        minMgKg: 20,
        maxMgKg: 40,
        note: "1日20〜40mg/kgを3〜4回。"
    },
    piSnippet: "ペニシリン系。"
},
    {
    id: "20",
    name: "ワイドシリン細粒20%",
    yjCode: "6131001C2100",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C2100?user=1",
    potency: 200,
    dosage: {
        minMgKg: 20,
        maxMgKg: 40,
        absoluteMaxMgKg: 90,
        note: "1日最大90mg/kg。"
    },
    piSnippet: "オレンジジュースとの相性は悪くない（サワシリンとは異なる）。"
},
    {
    id: "10",
    name: "パセトシン細粒10%",
    yjCode: "6131001C1228",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C1228?user=1",
    potency: 100,
    dosage: {
        minMgKg: 20,
        maxMgKg: 40,
        note: "1日20〜40mg/kgを3〜4回。"
    },
    piSnippet: "ペニシリン系。"
},
    {
    id: "10",
    name: "アモキシシリン細粒10%「タツミ」",
    yjCode: "6131001C1260",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C1260?user=1",
    potency: 100,
    dosage: {
        minMgKg: 20,
        maxMgKg: 40,
        note: "1日20〜40mg/kgを3〜4回。"
    },
    piSnippet: "ジェネリック。"
},
    {
    id: "10",
    name: "ユナシン細粒小児用10%",
    yjCode: "6131008C1033",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131008C1033?user=1",
    potency: 100,
    dosage: {
        minMgKg: 30,
        maxMgKg: 60,
        note: "通常1日30〜60mg/kgを3回。"
    },
    piSnippet: "コーラ風味だが苦味がある場合あり。相性の悪いものが多いので注意。"
},
    {
    id: "ds10",
    name: "クラリスロマイシンDS10%「タカタ」",
    yjCode: "6149003R1062",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149003R1062?user=1",
    potency: 100,
    dosage: {
        minMgKg: 10,
        maxMgKg: 15,
        isByTime: true,
        timeMgKg: 5,
        timesPerDay: 2,
        note: "1日10〜15mg/kgを2回。"
    },
    piSnippet: "【重要】酸性のもの（ジュースやヨーグルト）と混ぜると、苦味を抑えるコーティングが剥がれて非常に苦くなります。混ぜたらすぐに飲ませてください。"
},
    {
    id: "10",
    name: "クラリスドライシロップ10%小児用",
    yjCode: "6149003R1143",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149003R1143?user=1",
    potency: 100,
    dosage: {
        minMgKg: 10,
        maxMgKg: 15,
        isByTime: true,
        timeMgKg: 5,
        timesPerDay: 2,
        note: "1日10〜15mg/kgを2回。"
    },
    piSnippet: "【最重要】酸性のものと混ぜるとコーティングが剥がれ激苦になる。ムコダイン（酸性）との混合も注意。メーカー指導箋あり。"
},
    {
    id: "zithromac-ds",
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
            label: "15kg〜25kg未満: 2g(200mg)"
        },
        {
            weightMin: 25,
            weightMax: 35,
            dose: 3,
            unit: "g",
            label: "25kg〜35kg未満: 3g(300mg)"
        },
        {
            weightMin: 35,
            weightMax: 45,
            dose: 4,
            unit: "g",
            label: "35kg〜45kg未満: 4g(400mg)"
        },
        {
            weightMin: 45,
            weightMax: 1000,
            dose: 5,
            unit: "g",
            label: "45kg以上: 5g(500mg)"
        }
    ],
    dosage: {
        note: "1日1回10mg/kg(最大500mg)を3日間。15kg以上は段階的用量設定。"
    },
    piSnippetSource: "アジスロマイシン水和物として1日1回10mg/kgを3日間経口投与する。ただし、1日最大500mgとする。体重15kg以上の小児には専用の用量設定表がある。",
    piSnippet: "アジスロマイシン水和物として1日1回10mg/kgを3日間経口投与する。ただし、1日最大500mgとする。体重15kg以上の小児には専用の用量設定表がある。"
},
    {
    id: "10-jg",
    name: "アジスロマイシン細粒小児用10%「JG」",
    yjCode: "6149004C1048",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004C1048?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "ジェネリック。"
},
    {
    id: "10",
    name: "アジスロマイシン小児用細粒10%「タカタ」",
    yjCode: "6149004C1080",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004C1080?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "ジェネリック。バナナ味。"
},
    {
    id: "10",
    name: "アジスロマイシン細粒小児用10%「トーワ」",
    yjCode: "6149004C1102",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004C1102?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "ジェネリック。イチゴ味。"
},
    {
    id: "w20",
    name: "エリスロシンドライシロップW20%",
    yjCode: "6141001R2053",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6141001R2053?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "苦味強い。酸性飲料で苦味増す。"
},
    {
    id: "15",
    name: "オゼックス小児用細粒15%",
    yjCode: "6241010C1024",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6241010C1024?user=1",
    potency: 150,
    dosage: {
        minMgKg: 12,
        maxMgKg: 24,
        isByTime: true,
        timeMgKg: 6,
        timesPerDay: 2,
        note: "通常1回6mg/kgを1日2回。最大1回12mg/kg。"
    },
    piSnippet: "イチゴ風味で飲みやすく工夫されています。牛乳や鉄剤と同時に飲むと薬の吸収が悪くなるため、2時間以上間隔を空けてください。メーカー指導箋あり。"
},
    {
    id: "15",
    name: "トスフロキサシントシル酸塩小児用細粒15%「タカタ」",
    yjCode: "6241010C1032",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6241010C1032?user=1",
    potency: 150,
    dosage: {
        minMgKg: 12,
        maxMgKg: 24,
        isByTime: true,
        timeMgKg: 6,
        timesPerDay: 2,
        note: "通常1回6mg/kgを1日2回。最大1回12mg/kg。"
    },
    piSnippet: "オゼックスのジェネリック。高田製薬は飲みやすい工夫あり。"
},
    {
    id: "10",
    name: "ファロムドライシロップ小児用10%",
    yjCode: "6139001R1032",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6139001R1032?user=1",
    potency: 100,
    dosage: {
        minMgKg: 15,
        maxMgKg: 30,
        isByTime: true,
        timeMgKg: 5,
        timesPerDay: 3,
        note: "通常1回5mg/kgを3回。最大1回10mg/kg。"
    },
    piSnippet: "ペネム系。比較的飲みやすい。"
},
    {
    id: "400",
    name: "ホスミシンドライシロップ400",
    yjCode: "6135001R2110",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6135001R2110?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "ホスホマイシン。"
},
    {
    id: "2",
    name: "ミノマイシン顆粒2%",
    yjCode: "6152005D1094",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6152005D1094?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "【吸収低下注意】乳製品（Ca）や鉄剤とは混ぜない。歯の着色リスク。"
},
    {
    id: "tamiflu-ds",
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
            piSnippet: "1回2mg/kgを1日2回、5日間経口投与する。ただし、1回最高用量は75mgとする。"
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
            piSnippet: "1回3mg/kgを1日2回、5日間経口投与する。ただし、1回最高用量は75mgとする。"
        }
    ],
    piSnippet: "独特の苦味がある。冷たいもの、味の濃いものと混ぜる。チョコアイスが推奨される。"
},
    {
    id: "ds3",
    name: "オセルタミビルDS3%「サワイ」",
    yjCode: "6250021R1032",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250021R1032?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "タミフルのジェネリック。メーカー推奨の飲み合わせ。"
},
    {
    id: "40",
    name: "ゾビラックス顆粒40%",
    yjCode: "6250002D1024",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250002D1024?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "水痘（水疱瘡）やヘルペスに使用。"
},
    {
    id: "1-25",
    name: "ジルテックドライシロップ1.25%",
    yjCode: "4490020R1027",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490020R1027?user=1",
    potency: 12.5,
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
    piSnippet: "眠気が出ることあり。"
},
    {
    id: "ds1-25",
    name: "セチリジン塩酸塩DS1.25%「タカタ」",
    yjCode: "4490020R1035",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490020R1035?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "ジルテックのジェネリック。"
},
    {
    id: "5",
    name: "アレグラドライシロップ5%",
    yjCode: "4490023R2027",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490023R2027?user=1",
    potency: 50,
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
            ageMax: 12,
            dose: 1.2,
            unit: "g",
            label: "7-12歳未満"
        }
    ],
    piSnippet: "抗アレルギー薬。"
},
    {
    id: "1",
    name: "クラリチンドライシロップ1%",
    yjCode: "4490027R1029",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490027R1029?user=1",
    potency: 10,
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
    piSnippet: "抗アレルギー薬。"
},
    {
    id: "0-05",
    name: "ザイザルシロップ0.05%",
    yjCode: "4490028Q1028",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490028Q1028?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "シロップ剤。計量が必要。"
},
    {
    id: "0-5",
    name: "アレロック顆粒0.5%",
    yjCode: "4490025D1022",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490025D1022?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "噛むと苦い場合あり。眠気注意。"
},
    {
    id: "0-1",
    name: "ザジテンドライシロップ0.1%",
    yjCode: "4490003R1228",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490003R1228?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "ケトチフェン。苦味がでやすい。"
},
    {
    id: "0-6",
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
    id: "1",
    name: "ペリアクチン散1%",
    yjCode: "4419005B1045",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4419005B1045?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "抗ヒスタミン。鼻炎や風邪、食欲増進作用も。"
},
    {
    id: "1",
    name: "ポララミン散1%",
    yjCode: "4419002B1033",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4419002B1033?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "古典的な抗ヒスタミン薬。眠気。"
},
    {
    id: "1",
    name: "アレジオンドライシロップ1%",
    yjCode: "4490022R1025",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490022R1025?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "抗アレルギー薬。"
},
    {
    id: "ds50",
    name: "ムコダインDS50%",
    yjCode: "2233002R2029",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2233002R2029?user=1",
    potency: 500,
    dosage: {
        minMgKg: 30,
        maxMgKg: 30,
        isByTime: true,
        timeMgKg: 10,
        timesPerDay: 3,
        note: "通常1回10mg/kgを3回。"
    },
    piSnippet: "酸性のため、コーティングされた抗生物質（クラリス等）と混ぜると苦味が出るので注意。ヨーグルトは△（味悪化報告あり）。"
},
    {
    id: "ds50",
    name: "カルボシステインDS50%「タカタ」",
    yjCode: "2233002R2037",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2233002R2037?user=1",
    potency: 500,
    dosage: {
        minMgKg: 30,
        maxMgKg: 30,
        isByTime: true,
        timeMgKg: 10,
        timesPerDay: 3,
        note: "通常1回10mg/kgを3回。"
    },
    piSnippet: "ムコダインのジェネリック。牛乳やココアと混ぜると増粘（ドロドロ）する。酸性のためクラリスロマイシン等と混ぜると苦味が出る。"
},
    {
    id: "ds1-5",
    name: "ムコソルバンDS1.5%",
    yjCode: "2239001Q1166",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2239001Q1166?user=1",
    potency: 15,
    dosage: {
        minMgKg: 0.9,
        maxMgKg: 1.2,
        isByTime: true,
        timeMgKg: 0.3,
        timesPerDay: 3,
        note: "通常1日0.9〜1.2mg/kgを3回。"
    },
    piSnippet: "去痰剤。白い粒。アイスやゼリーでサンドすると飲みやすい。"
},
    {
    id: "10",
    name: "アスベリン散10%",
    yjCode: "2249003B1037",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2249003B1037?user=1",
    potency: 100,
    dosage: {
        minMgKg: 1,
        maxMgKg: 1,
        isByTime: true,
        timeMgKg: 0.33,
        timesPerDay: 3,
        note: "通常1日1mg/kgを3回。"
    },
    piSnippet: "尿が赤っぽくなることがある。"
},
    {
    id: "10",
    name: "メジコン散10%",
    yjCode: "2223001B1210",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2223001B1210?user=1",
    potency: 100,
    dosage: {
        minMgKg: 1,
        maxMgKg: 2,
        isByTime: true,
        timeMgKg: 0.33,
        timesPerDay: 3,
        note: "通常1日1〜2mg/kgを3〜4回。"
    },
    piSnippet: "非常に苦いため、味の濃いものに混ぜることを推奨。"
},
    {
    id: "ds0-1",
    name: "ホクナリンDS0.1%小児用",
    yjCode: "2259002R1061",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2259002R1061?user=1",
    potency: 1,
    dosage: {
        minMgKg: 0.04,
        maxMgKg: 0.04,
        isByTime: true,
        timeMgKg: 0.02,
        timesPerDay: 2,
        note: "通常1回0.02mg/kgを2回。"
    },
    piSnippet: "気管支拡張剤。手指の震えが出ることあり。"
},
    {
    id: "ds0-1",
    name: "ツロブテロールDS0.1%「タカタ」",
    yjCode: "2259002R1118",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2259002R1118?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "ホクナリンのジェネリック。"
},
    {
    id: "20",
    name: "テオドールドライシロップ20%",
    yjCode: "2251001D1061",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2251001D1061?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "テオフィリン。徐放性製剤のため噛まずに飲むこと。"
},
    {
    id: "0-01",
    name: "メプチン顆粒0.01%",
    yjCode: "2254001D1030",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2254001D1030?user=1",
    potency: 0.1,
    unit: "g",
    calcType: "age-weight-switch",
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
                note: "通常1回1.25μg/kgを1日2回、朝及び就寝前ないしは1日3回。"
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
                note: "通常1回25μg（0.25g）を1日1回就寝前ないしは1日2回、朝及び就寝前。"
            }
        }
    ],
    piSnippet: "気管支拡張剤。"
},
    {
    id: "4mg",
    name: "シングレア細粒4mg",
    yjCode: "4490026C1030",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490026C1030?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "光に不安定。飲む直前に開封。熱いもの禁止。"
},
    {
    id: "4mg",
    name: "キプレス細粒4mg",
    yjCode: "4490026C1021",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490026C1021?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "シングレアと同一成分。"
},
    {
    id: "4mg",
    name: "モンテルカスト細粒4mg「タカタ」",
    yjCode: "4490026C1129",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490026C1129?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "ジェネリック。バナナ風味付き。"
},
    {
    id: "ds10",
    name: "オノンDS10%",
    yjCode: "4490017R1033",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490017R1033?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "プランルカスト。"
},
    {
    id: "20",
    name: "カロナール細粒20%",
    yjCode: "1141007C1075",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007C1075?user=1",
    potency: 200,
    dosage: {
        minMgKg: 10,
        maxMgKg: 15,
        absoluteMaxMgKg: 60,
        isByTime: true,
        timeMgKg: 10,
        timesPerDay: 4,
        note: "1回10〜15mg/kg。原則4時間空ける。"
    },
    piSnippet: "はじめは甘いですが、後味に苦味が残ることがあります。酸性のものと混ぜると苦味を感じやすくなるため、甘いものに混ぜるのがおすすめです。空腹時でも服用可能です。"
},
    {
    id: "50",
    name: "カロナール細粒50%",
    yjCode: "1141007C2020",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007C2020?user=1",
    potency: 200,
    dosage: {
        minMgKg: 10,
        maxMgKg: 15,
        absoluteMaxMgKg: 60,
        isByTime: true,
        timeMgKg: 10,
        timesPerDay: 4,
        note: "1回10〜15mg/kg。原則4時間空ける。"
    },
    piSnippet: "20%製剤よりも高濃度のため、粉の量は少なくて済みますが、苦味はより強く感じられることがあります。甘いものに混ぜて服用してください。"
},
    {
    id: "2",
    name: "カロナールシロップ2%",
    yjCode: "1141007Q1048",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007Q1048?user=1",
    potency: 200,
    dosage: {
        minMgKg: 10,
        maxMgKg: 15,
        absoluteMaxMgKg: 60,
        isByTime: true,
        timeMgKg: 10,
        timesPerDay: 4,
        note: "1回10〜15mg/kg。原則4時間空ける。"
    },
    piSnippet: "シロップ。"
},
    {
    id: "20",
    name: "ブルフェン顆粒20%",
    yjCode: "1149001D1160",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1149001D1160?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "イブプロフェン。空腹時避ける。"
},
    {
    id: "pl",
    name: "PL配合顆粒",
    yjCode: "1180107D1131",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1180107D1131?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "総合感冒薬。サリチルアミド等配合。苦味あり。"
},
    {
    id: "r",
    name: "ビオフェルミンR散",
    yjCode: "2316004B1036",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316004B1036?user=1",
    calcType: "age",
    adultDose: 3,
    unit: "g",
    dosage: {
        note: "目安1日1.5〜3g(3回)。"
    },
    piSnippet: "抗生物質耐性乳酸菌。抗生物質と併用する。"
},
    {
    id: "bm",
    name: "ミヤBM細粒",
    yjCode: "2316009C1026",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316009C1026?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "宮入菌。抗生物質と併用可。味を損なわない。"
},
    {
    id: "n",
    name: "ラックビー微粒N",
    yjCode: "2316014B1030",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316014B1030?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "ビフィズス菌。"
},
    {
    id: "1",
    name: "ナウゼリンドライシロップ1%",
    yjCode: "2399005R1163",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2399005R1163?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "吐き気止め。食前投与が多い。"
},
    {
    id: "drug-1mv7m",
    name: "アドソルビン原末",
    yjCode: "2331004B1046",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2331004B1046?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "天然ケイ酸アルミニウム。下痢止め。水には溶けない。"
},
    {
    id: "5",
    name: "インクレミンシロップ5%",
    yjCode: "3222012Q1030",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/3222012Q1030?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "鉄剤。歯が黒くなることあり（ストロー推奨）。便が黒くなる。"
},
    {
    id: "50",
    name: "イーケプラドライシロップ50%",
    yjCode: "1139010R1020",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1139010R1020?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "抗てんかん薬。水に溶けやすい。"
},
    {
    id: "drug-6zfnn",
    name: "デパケン細粒",
    yjCode: "1139004C2061",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1139004C2061?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "バルプロ酸。湿気に弱い。カルバペネム系抗生物質と併用禁忌。"
},
    {
    id: "drug-jfvdk",
    name: "抑肝散エキス顆粒",
    yjCode: "5200139D1037",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200139D1037?user=1",
    calcType: "age",
    adultDose: 7.5,
    unit: "g",
    dosage: {
        note: "Augsberger式。7.5g/日基準。"
    },
    piSnippet: "漢方薬。神経の高ぶりを抑える。"
},
    {
    id: "drug-h275j",
    name: "葛根湯エキス顆粒",
    yjCode: "5200013D1123",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200013D1123?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "漢方薬。風邪の初期に。"
},
    {
    id: "drug-ajvh7",
    name: "小建中湯エキス顆粒",
    yjCode: "5200072D1058",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200072D1058?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "漢方薬。小児虚弱体質に。"
},
    {
    id: "clavamox-ds",
    name: "クラバモックス小児用配合ドライシロップ",
    yjCode: "6139100R1036",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6139100R1036?user=1",
    potency: 42.9,
    calcType: "weight-step",
    weightSteps: [
        {
            weightMin: 6,
            weightMax: 10,
            dose: 1.01,
            unit: "g",
            label: "6kg 〜 10kg"
        },
        {
            weightMin: 10,
            weightMax: 12,
            dose: 1.34,
            unit: "g",
            label: "10kg 〜 12kg"
        },
        {
            weightMin: 12,
            weightMax: 15,
            dose: 1.68,
            unit: "g",
            label: "12kg 〜 15kg"
        },
        {
            weightMin: 15,
            weightMax: 20,
            dose: 2.18,
            unit: "g",
            label: "15kg 〜 20kg"
        },
        {
            weightMin: 20,
            weightMax: 22,
            dose: 2.68,
            unit: "g",
            label: "20kg 〜 22kg"
        },
        {
            weightMin: 22,
            weightMax: 25,
            dose: 3.02,
            unit: "g",
            label: "22kg 〜 25kg"
        },
        {
            weightMin: 25,
            weightMax: 30,
            dose: 3.69,
            unit: "g",
            label: "25kg 〜 30kg"
        },
        {
            weightMin: 30,
            weightMax: 34,
            dose: 4.36,
            unit: "g",
            label: "30kg 〜 34kg"
        },
        {
            weightMin: 34,
            weightMax: 37,
            dose: 5.03,
            unit: "g",
            label: "34kg 〜 37kg"
        },
        {
            weightMin: 37,
            weightMax: 40,
            dose: 5.53,
            unit: "g",
            label: "37kg 〜 40kg"
        }
    ],
    dosage: {
        note: "1回12時間ごと(1日2回)。表に基づく固定量。"
    },
    piSnippetSource: "通常、小児には、アモキシシリン水和物及びクラブラン酸カリウムとして1回20mg/kg（アモキシシリン計量）を12時間ごとに経口投与する。専用の用量調節表が設定されている。",
    piSnippet: "通常、小児には、アモキシシリン水和物及びクラブラン酸カリウムとして1回20mg/kg（アモキシシリン計量）を12時間ごとに経口投与する。専用の用量調節表が設定されている。"
},
    {
    id: "20",
    name: "テオフィリン徐放ドライシロップ小児用20％「サワイ」",
    yjCode: "2251001R1123",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2251001R1123?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "【重要】噛み砕かないこと（徐放性が失われ苦味が出る）。作り置き厳禁。"
},
    {
    id: "ds-2",
    name: "オキサトミドDS小児用2％「サワイ」",
    yjCode: "4490005R1448",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490005R1448?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "酸性飲料と混ぜると苦く感じることがある。"
},
    {
    id: "10-tw",
    name: "セフカペンピボキシル塩酸塩細粒小児用10%「TW」",
    yjCode: "6132016C1132",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1132?user=1",
    potency: 100,
    dosage: {
        minMgKg: 9,
        maxMgKg: 18,
        note: "通常1日9〜18mg/kgを3回。"
    },
    piSnippet: "つぶしたり練ったりしないこと（苦味が出る）。飲む直前に混ぜる。"
},
    {
    id: "50",
    name: "バラシクロビル顆粒50%「トーワ」",
    yjCode: "6250019D1046",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250019D1046?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "サラサラした液体では沈殿して飲み残すリスクがあるため、粘度のある食品推奨。"
},
    {
    id: "10",
    name: "セフジトレンピボキシル細粒10%小児用「日医工」",
    yjCode: "6132015C1090",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132015C1090?user=1",
    potency: 100,
    dosage: {
        minMgKg: 0,
        maxMgKg: 0,
        note: "用量データ未設定"
    },
    piSnippet: "メイアクトのジェネリック。"
},
    {
    id: "ds-nig",
    name: "カルボシステインDS小児用「NIG」",
    yjCode: "2233002Q1159",
    piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2233002Q1159?user=1",
    potency: 500,
    dosage: {
        minMgKg: 30,
        maxMgKg: 30,
        isByTime: true,
        timeMgKg: 10,
        timesPerDay: 3,
        note: "通常1回10mg/kgを3回。"
    },
    piSnippet: "ムコダインのジェネリック。麦茶と混ぜると飲みにくくなることがある。"
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
    } else if (drug.calcType === 'weight-step') {
        const found = drug.weightSteps.find(ws => weight >= ws.weightMin && weight < ws.weightMax);
        if (found) {
            let dailyDose = found.isPerKg ? (weight * found.dose) : found.dose;
            resultArea.innerHTML = `
                <div class="bg-emerald-600 text-white p-6 rounded-xl shadow-lg border-b-4 border-emerald-800">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">体重段階別用量 (${found.label})</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-black">${dailyDose.toFixed(2)}</span>
                        <span class="text-xl font-bold">${found.unit} / 日</span>
                    </div>
                    <div class="mt-4 pt-4 border-t border-white/20">
                        <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">1回分量 (2分服)</div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-xl font-black">${(dailyDose / 2).toFixed(2)}</span>
                            <span class="text-lg font-bold">${found.unit} / 回</span>
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
            let displayDose = '';
            let subText = '';

            if (info.isFixed) {
                const dosePerTime = info.dosePerTime;
                const gPerTime = dosePerTime / drug.potency;
                displayDose = `${gPerTime.toFixed(3)} ${drug.unit || 'g'} / 回`;
                subText = `(固定量: 1回${dosePerTime}${info.unit || 'μg'})`;
            } else {
                const mgPerTime = weight * info.timeMgKg;
                const gPerTime = mgPerTime / drug.potency;
                displayDose = `${gPerTime.toFixed(3)} ${drug.unit || 'g'} / 回`;
                subText = `(体重換算: 1回${info.timeMgKg}${info.unit || 'μg'}/kg)`;
            }

            resultArea.innerHTML = `
                <div class="bg-sky-600 text-white p-6 rounded-xl shadow-lg border-b-4 border-sky-800">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">${branch.label}</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-black">${displayDose}</span>
                    </div>
                    <div class="mt-2 text-xs opacity-70">${subText}</div>
                    <div class="mt-4 pt-4 border-t border-white/20">
                        <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">用法: ${info.timesPerDay || '1-3'}回 / 日</div>
                        <div class="text-[10px] opacity-80 leading-tight">${info.note}</div>
                    </div>
                </div>
            `;
        } else {
            resultArea.innerHTML = '<p class="text-center text-rose-500 py-10 font-bold bg-rose-50 rounded-xl">対象年齢範囲外</p>';
        }
    } else {
        let doseInfo = drug.hasSubOptions ? drug.subOptions.find(o => o.id === selectedSubOptionId).dosage : drug.dosage;
        let minMgPerTime = weight * (doseInfo.timeMgKg || (doseInfo.minMgKg / (doseInfo.timesPerDay || 1)));
        let maxMgPerTime = weight * (doseInfo.timeMgKg || (doseInfo.maxMgKg / (doseInfo.timesPerDay || 1)));

        // 上限値制限（タミフル等）
        if (doseInfo.absoluteMaxMgPerTime) {
            minMgPerTime = Math.min(minMgPerTime, doseInfo.absoluteMaxMgPerTime);
            maxMgPerTime = Math.min(maxMgPerTime, doseInfo.absoluteMaxMgPerTime);
        }

        const minG = minMgPerTime / drug.potency;
        const maxG = maxMgPerTime / drug.potency;
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
