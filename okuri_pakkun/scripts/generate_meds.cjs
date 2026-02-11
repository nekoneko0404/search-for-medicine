const fs = require('fs');
const path = require('path');

// ターゲットパス: okusuri-pakkun-app/public/meds_master.json
// __dirname (scripts directory) -> ../okusuri-pakkun-app/public/meds_master.json
const targetFile = path.resolve(__dirname, '../okusuri-pakkun-app/public/meds_master.json');

const meds = [
    // =========================================================================
    // 抗生物質 (セフェム系)
    // =========================================================================
    {
        yj_code: "6132016R1026",
        brand_name: "メイアクトMS小児用細粒10%",
        manufacturer: "Meiji Seika ファルマ",
        taste_smell: "バナナ風味。甘い。",
        good_compatibility: ["ヨーグルト", "アイスクリーム", "ジュース", "牛乳", "練乳", "チョコクリーム"],
        bad_compatibility: [],
        special_notes: "鉄剤と同時に飲むと吸収が悪くなることがある。便が赤っぽくなることがある。",
        source: "Meiji Seika ファルマ IF / 北信総合病院"
    },
    {
        yj_code: "6132013R1036",
        brand_name: "フロモックス小児用細粒100mg",
        manufacturer: "塩野義製薬",
        taste_smell: "イチゴ風味。甘い。",
        good_compatibility: ["水", "牛乳", "アイスクリーム", "ヨーグルト"],
        bad_compatibility: [],
        special_notes: "室温保存可。比較的飲みやすい。",
        source: "塩野義製薬 添付文書 / 愛知医科大学"
    },
    {
        yj_code: "6132009R1023",
        brand_name: "バナン小児用ドライシロップ10%",
        manufacturer: "第一三共",
        taste_smell: "オレンジ風味。甘い。",
        good_compatibility: ["牛乳", "アイスクリーム", "ヨーグルト"],
        bad_compatibility: [],
        special_notes: "便が赤っぽくなることがある（鉄分との反応）。コーティング配慮あり。",
        source: "第一三共 IF"
    },
    {
        yj_code: "6132005R1024",
        brand_name: "ケフラール細粒小児用",
        manufacturer: "塩野義製薬",
        taste_smell: "フルーツ風味。甘い。",
        good_compatibility: [],
        bad_compatibility: [],
        special_notes: "セフェム系。",
        source: "塩野義製薬"
    },
    {
        yj_code: "6132011R1020",
        brand_name: "トミロン細粒小児用10%／20%",
        manufacturer: "富山化学",
        taste_smell: "フルーツ（ヨーグルト？）風味。苦味コーティングあり。",
        good_compatibility: ["牛乳", "ヨーグルト", "アイス"],
        bad_compatibility: ["噛むと苦い"],
        special_notes: "ピボキシル基を持たないため低カルニチン血症のリスクが低い。",
        source: "IF"
    },
    {
        yj_code: "6132014R1030",
        brand_name: "セフゾン細粒小児用10%",
        manufacturer: "アステラス",
        taste_smell: "イチゴ風味。甘い。",
        good_compatibility: ["アイス", "ヨーグルト"],
        bad_compatibility: ["鉄剤（吸収低下・便変色）"],
        special_notes: "便が赤くなることがある。",
        source: "IF"
    },

    // =========================================================================
    // 抗生物質 (ペニシリン系)
    // =========================================================================
    {
        yj_code: "6113004R1038",
        brand_name: "ワイドシリン細粒20%",
        manufacturer: "Meiji Seika ファルマ",
        taste_smell: "ミックスフルーツ風味。甘い。",
        good_compatibility: ["牛乳", "アイスクリーム", "ヨーグルト"],
        bad_compatibility: [],
        special_notes: "ペニシリン系。比較的飲みやすい。",
        source: "Meiji Seika ファルマ IF"
    },
    {
        yj_code: "6113004R1046",
        brand_name: "アモキシシリン細粒10%「サワイ」",
        manufacturer: "沢井製薬",
        taste_smell: "パイナップル風味。",
        good_compatibility: ["ヨーグルト", "ジュース"],
        bad_compatibility: [],
        special_notes: "ワイドシリンのジェネリック。",
        source: "沢井製薬 IF"
    },
    {
        yj_code: "6113004R1054",
        brand_name: "アモキシシリン細粒10%「トーワ」",
        manufacturer: "東和薬品",
        taste_smell: "イチゴ風味。",
        good_compatibility: ["ヨーグルト"],
        bad_compatibility: [],
        special_notes: "ワイドシリンのジェネリック。",
        source: "東和薬品 IF"
    },
    {
        yj_code: "6111005R1020",
        brand_name: "パセトシン細粒10%",
        manufacturer: "協和キリン",
        taste_smell: "フルーツ風味。甘い。",
        good_compatibility: [],
        bad_compatibility: [],
        special_notes: "アモキシシリン製剤。",
        source: "IF"
    },
    {
        yj_code: "6119003R1034",
        brand_name: "ユナシン細粒小児用10%",
        manufacturer: "ファイザー",
        taste_smell: "コーラ風味。",
        good_compatibility: ["チョコアイス", "ココア"],
        bad_compatibility: [],
        special_notes: "コーラ風味だが苦味がある場合あり。",
        source: "愛知医科大学 PDF"
    },

    // =========================================================================
    // 抗生物質 (マクロライド系) - ※酸性飲料注意
    // =========================================================================
    {
        yj_code: "6149002R1020",
        brand_name: "クラリスロマイシンDS10%「タカタ」",
        manufacturer: "高田製薬",
        taste_smell: "バナナ風味。甘い。",
        good_compatibility: ["チョコアイス", "チョコクリーム", "ココア", "練乳", "バニラアイス"],
        bad_compatibility: ["オレンジジュース", "スポドリ", "アップルジュース", "乳酸菌飲料", "ヨーグルト"],
        special_notes: "酸性飲料でコーティングが剥がれ、激苦になるので注意。",
        source: "高田製薬 IF / 北信総合病院"
    },
    {
        yj_code: "6149002R2027",
        brand_name: "クラリスドライシロップ10%小児用",
        manufacturer: "大正製薬",
        taste_smell: "イチゴ風味。甘い。",
        good_compatibility: ["アイスクリーム", "練乳"],
        bad_compatibility: ["酸性飲料", "ヨーグルト", "スポーツドリンク"],
        special_notes: "先発品。酸性飲料注意。苦味が増す。",
        source: "大正製薬 IF / 北信総合病院"
    },
    {
        yj_code: "6149004R1029",
        brand_name: "ジスロマック細粒小児用10%",
        manufacturer: "ファイザー",
        taste_smell: "オレンジ風味（特異な芳香）。甘いが後味苦い。",
        good_compatibility: ["チョコアイス", "練乳", "冷たいもの", "牛乳"],
        bad_compatibility: ["酸味のあるジュース", "スポーツドリンク", "ヨーグルト"],
        special_notes: "効果が長い（3日間服用）。酸性飲料で苦味増す。",
        source: "ファイザー IF / 北信総合病院"
    },
    {
        yj_code: "6149001R1033",
        brand_name: "リカマイシンドライシロップ小児用",
        manufacturer: "旭化成",
        taste_smell: "オレンジ風味。",
        good_compatibility: ["チョコアイス"],
        bad_compatibility: ["酸性飲料"],
        special_notes: "苦味が強い傾向。",
        source: "IF"
    },
    {
        yj_code: "6141014R1030",
        brand_name: "エリスロシンドライシロップW20%",
        manufacturer: "ヴィアトリス",
        taste_smell: "甘い。",
        good_compatibility: ["チョコアイス"],
        bad_compatibility: ["酸性飲料（苦味増す）"],
        special_notes: "苦味強い。",
        source: "IF"
    },

    // =========================================================================
    // 抗生物質 (その他)
    // =========================================================================
    {
        yj_code: "6241013R1025",
        brand_name: "オゼックス小児用細粒15%",
        manufacturer: "富山化学",
        taste_smell: "イチゴ風味。苦味あり。",
        good_compatibility: ["チョコアイス", "ココア", "練乳"],
        bad_compatibility: ["スポーツドリンク（苦味増す可能性）", "カルシウム含有食品（吸収低下の恐れあり）"],
        special_notes: "苦味が強いのでチョコ系推奨。牛乳などCa含有食品との同時摂取は避ける（2時間空ける）。",
        source: "富山化学 IF / 神奈川県薬剤師会"
    },
    {
        yj_code: "6241014R1020",
        brand_name: "トスフロキサシントシル酸塩小児用細粒15%「タカタ」",
        manufacturer: "高田製薬",
        taste_smell: "イチゴ風味。甘い。",
        good_compatibility: ["アイスクリーム", "練乳", "ピーナッツクリーム", "ココア"],
        bad_compatibility: ["カルシウム含有食品（牛乳など）は多量だと吸収低下の可能性"],
        special_notes: "オゼックスのジェネリック。高田製薬は飲みやすい工夫あり。",
        source: "高田製薬 IF / rad-ar.or.jp"
    },
    {
        yj_code: "6192001C1037",
        brand_name: "ファロムドライシロップ小児用10%",
        manufacturer: "マルホ",
        taste_smell: "オレンジ風味。甘い。",
        good_compatibility: ["牛乳", "アイス", "ヨーグルト"],
        bad_compatibility: [],
        special_notes: "ペネム系。比較的飲みやすい。",
        source: "IF / 愛知医科大学"
    },
    {
        yj_code: "6134001R1021", // 仮コード
        brand_name: "ホスミシンドライシロップ400",
        manufacturer: "各種",
        taste_smell: "ヨーグルト風味（メーカーにより異なる）。",
        good_compatibility: ["ヨーグルト"],
        bad_compatibility: [],
        special_notes: "ホスホマイシン。",
        source: "愛知医科大学 PDF"
    },
    {
        yj_code: "6151001R1026",
        brand_name: "ミノマイシン顆粒2%",
        manufacturer: "ファイザー",
        taste_smell: "オレンジ風味。甘いが苦い。",
        good_compatibility: ["チョコアイス"],
        bad_compatibility: ["カルシウム含有食品（牛乳など）", "鉄剤"],
        special_notes: "テトラサイクリン系。Ca/Feとキレート形成し吸収低下。歯の着色リスク。",
        source: "神奈川県薬剤師会"
    },

    // =========================================================================
    // インフルエンザ・抗ウイルス
    // =========================================================================
    {
        yj_code: "6250021F1027",
        brand_name: "タミフルドライシロップ3%",
        manufacturer: "中外製薬",
        taste_smell: "ミックスフルーツ風味。苦味あり。",
        good_compatibility: ["チョコアイス", "ヨーグルト（イチゴ味など）", "ココア"],
        bad_compatibility: ["乳酸菌飲料（苦味増す報告あり）"],
        special_notes: "独特の苦味がある。冷たいものと混ぜると飲みやすい。",
        source: "中外製薬 IF"
    },
    {
        yj_code: "6250021F1035", // ジェネリック
        brand_name: "オセルタミビルDS3%「サワイ」",
        manufacturer: "沢井製薬",
        taste_smell: "ヨーグルト風味。",
        good_compatibility: ["チョコアイス"],
        bad_compatibility: [],
        special_notes: "タミフルのジェネリック。",
        source: "沢井製薬"
    },
    {
        yj_code: "6250004R1027",
        brand_name: "ゾビラックス顆粒40%",
        manufacturer: "GSK",
        taste_smell: "無味に近いか甘い。",
        good_compatibility: ["水"],
        bad_compatibility: [],
        special_notes: "水痘（水疱瘡）やヘルペスに使用。",
        source: "IF"
    },

    // =========================================================================
    // 抗アレルギー・鼻炎
    // =========================================================================
    {
        yj_code: "4490022R1027",
        brand_name: "ジルテックドライシロップ1.25%",
        manufacturer: "GSK",
        taste_smell: "イチゴ風味。甘い。",
        good_compatibility: ["水", "ヨーグルト"],
        bad_compatibility: [],
        special_notes: "眠気が出ることあり。",
        source: "GSK IF"
    },
    {
        yj_code: "4490022R1035",
        brand_name: "セチリジン塩酸塩DS1.25%「タカタ」",
        manufacturer: "高田製薬",
        taste_smell: "ヨーグルト風味。",
        good_compatibility: ["ヨーグルト", "ジュース"],
        bad_compatibility: [],
        special_notes: "ジルテックのジェネリック。",
        source: "高田製薬 IF"
    },
    {
        yj_code: "4490023F1027",
        brand_name: "アレグラドライシロップ5%",
        manufacturer: "サノフィ",
        taste_smell: "桃/ヨーグルト風味。甘いが後味にわずかな苦味。",
        good_compatibility: ["ヨーグルト", "ピーチネクター", "チョコアイス"],
        bad_compatibility: ["酸味の強いフルーツジュース（グレープフルーツ、オレンジ、アップル）"],
        special_notes: "フルーツジュースで吸収低下の可能性。",
        source: "サノフィ IF"
    },
    {
        yj_code: "4490028F1024",
        brand_name: "ザイザルシロップ0.05%",
        manufacturer: "GSK",
        taste_smell: "フルーツ風味。甘い。",
        good_compatibility: ["そのまま"],
        bad_compatibility: [],
        special_notes: "シロップ剤。計量が必要。",
        source: "GSK 添付文書"
    },
    {
        yj_code: "4490025R1026",
        brand_name: "アレロック顆粒0.5%",
        manufacturer: "協和キリン",
        taste_smell: "甘い（ゴマのような食感）。",
        good_compatibility: ["水", "ヨーグルト", "アイス"],
        bad_compatibility: [],
        special_notes: "噛むと苦い場合あり。眠気注意。",
        source: "協和キリン IF"
    },
    {
        yj_code: "4490014R1023",
        brand_name: "ザジテンドライシロップ0.1%",
        manufacturer: "ノバルティス",
        taste_smell: "甘く苦い味。",
        good_compatibility: ["水"],
        bad_compatibility: [],
        special_notes: "ケトチフェン。",
        source: "添付文書 / 愛知医科大学"
    },
    {
        yj_code: "4490018R1021", // 仮コード
        brand_name: "セルテクトドライシロップ",
        manufacturer: "杏林製薬",
        taste_smell: "弱い甘み。",
        good_compatibility: [],
        bad_compatibility: [],
        source: "愛知医科大学 PDF"
    },
    {
        yj_code: "4490019R1026", // 仮コード
        brand_name: "ゼスラン細粒小児用0.6%",
        manufacturer: "Meiji Seika",
        taste_smell: "フルーティーで甘い味。",
        good_compatibility: [],
        bad_compatibility: [],
        source: "愛知医科大学 PDF"
    },
    {
        yj_code: "2171022R1020",
        brand_name: "ペリアクチン散1%",
        manufacturer: "各種",
        taste_smell: "苦味あり。",
        good_compatibility: ["チョコアイス", "ジャム"],
        bad_compatibility: [],
        special_notes: "抗ヒスタミン。鼻炎や風邪、食欲増進作用も。",
        source: "IF"
    },
    {
        yj_code: "2171018R1024",
        brand_name: "ポララミン散1%",
        manufacturer: "各種",
        taste_smell: "苦い。",
        good_compatibility: ["チョコアイス", "ココア"],
        bad_compatibility: [],
        special_notes: "古典的な抗ヒスタミン薬。眠気。",
        source: "IF"
    },

    // =========================================================================
    // 咳・痰
    // =========================================================================
    {
        yj_code: "2249009F1022",
        brand_name: "ムコダインDS50%",
        manufacturer: "杏林製薬",
        taste_smell: "甘酸っぱい（ピーチ/ヨーグルト/バニラ風味）。",
        good_compatibility: ["ジュース", "アイス", "ココア"],
        bad_compatibility: ["クラリスロマイシンDS（混合で苦味増す）"],
        special_notes: "去痰剤。酸性のため、コーティングされた抗生物質と混ぜると苦味が出るので注意。",
        source: "杏林製薬 IF / 各種薬局情報"
    },
    {
        yj_code: "2249009F1030",
        brand_name: "カルボシステインDS50%「タカタ」",
        manufacturer: "高田製薬",
        taste_smell: "リンゴ風味。",
        good_compatibility: ["ジュース", "アイス"],
        bad_compatibility: [],
        special_notes: "ムコダインのジェネリック。",
        source: "高田製薬 IF"
    },
    {
        yj_code: "2233002F1043",
        brand_name: "ムコソルバンDS1.5%",
        manufacturer: "帝人ファーマ",
        taste_smell: "ヨーグルト風味（甘いがわずかに苦い）。",
        good_compatibility: ["牛乳", "スポーツドリンク", "麦茶", "アイスクリーム", "ヨーグルト"],
        bad_compatibility: [],
        special_notes: "去痰剤。白い粒。アイスやゼリーでサンドすると飲みやすい。",
        source: "帝人ファーマ IF / 岐阜大学病院"
    },
    {
        yj_code: "2223001C1071",
        brand_name: "アスベリン散10%",
        manufacturer: "田辺三菱",
        taste_smell: "甘い。",
        good_compatibility: ["水", "ジュース", "アイス", "ココア", "牛乳"],
        bad_compatibility: [],
        special_notes: "尿が赤っぽくなることがある。",
        source: "田辺三菱 添付文書 / 北信総合病院"
    },
    {
        yj_code: "2249010C1032",
        brand_name: "メジコン散10%",
        manufacturer: "塩野義製薬",
        taste_smell: "非常に苦い。",
        good_compatibility: ["チョコアイス", "ココア", "味の濃いもの"],
        bad_compatibility: [],
        special_notes: "非常に苦いため、味の濃いものに混ぜることを推奨。",
        source: "塩野義製薬 IF"
    },
    {
        yj_code: "2251001C1027",
        brand_name: "ホクナリンDS0.1%小児用",
        manufacturer: "ヴィアトリス",
        taste_smell: "甘い。",
        good_compatibility: ["水"],
        bad_compatibility: [],
        special_notes: "気管支拡張剤。手指の震えが出ることあり。",
        source: "IF"
    },
    {
        yj_code: "2251002F1030",
        brand_name: "ツロブテロールDS0.1%「タカタ」",
        manufacturer: "高田製薬",
        taste_smell: "ヨーグルト風味。",
        good_compatibility: ["ヨーグルト"],
        bad_compatibility: [],
        special_notes: "ホクナリンのジェネリック。",
        source: "高田製薬 IF"
    },
    {
        yj_code: "2254001F1029",
        brand_name: "テオドールドライシロップ20%",
        manufacturer: "各種",
        taste_smell: "苦い。コーティングあり。",
        good_compatibility: ["チョコアイス", "ココア"],
        bad_compatibility: ["噛むと苦い"],
        special_notes: "テオフィリン。徐放性製剤のため噛まずに飲むこと。",
        source: "IF"
    },

    // =========================================================================
    // 喘息
    // =========================================================================
    {
        yj_code: "4490026R1020",
        brand_name: "シングレア細粒4mg",
        manufacturer: "杏林製薬",
        taste_smell: "わずかに甘い（無香料）。",
        good_compatibility: ["水", "ヨーグルト", "リンゴソース"],
        bad_compatibility: ["温かい食事（熱に不安定）", "お茶（苦くなることあり）"],
        special_notes: "光に不安定。飲む直前に開封。熱いもの禁止。",
        source: "杏林製薬 IF / 国立成育医療研究センター"
    },
    {
        yj_code: "4490026R1038",
        brand_name: "キプレス細粒4mg",
        manufacturer: "杏林製薬（MSD）",
        taste_smell: "無味無臭に近い。",
        good_compatibility: ["水", "ヨーグルト"],
        bad_compatibility: ["温かい食事"],
        special_notes: "シングレアと同一成分。",
        source: "IF"
    },
    {
        yj_code: "4490026R1046",
        brand_name: "モンテルカスト細粒4mg「タカタ」",
        manufacturer: "高田製薬",
        taste_smell: "バナナ風味。",
        good_compatibility: ["水", "ヨーグルト"],
        bad_compatibility: ["温かい食事"],
        special_notes: "ジェネリック。バナナ風味付き。",
        source: "高田製薬 IF"
    },
    {
        yj_code: "4490020F1023",
        brand_name: "オノンDS10%",
        manufacturer: "小野薬品",
        taste_smell: "甘い（白色～微黄色顆粒）。",
        good_compatibility: ["水", "ジュース"],
        bad_compatibility: [],
        special_notes: "プランルカスト。",
        source: "小野薬品 IF / 愛知医科大学"
    },

    // =========================================================================
    // 解熱鎮痛
    // =========================================================================
    {
        yj_code: "1141007C1077",
        brand_name: "カロナール細粒20%",
        manufacturer: "あゆみ製薬",
        taste_smell: "オレンジ風味（最初は甘く後味苦い）。",
        good_compatibility: ["アイスクリーム（バニラ/チョコ）", "牛乳", "プリン", "練乳"],
        bad_compatibility: ["オレンジジュース", "ヨーグルト", "スポーツドリンク"],
        special_notes: "酸性食品と混ぜると苦味が増す。空腹時でも可。",
        source: "あゆみ製薬 IF / 中島医院"
    },
    {
        yj_code: "1141007C1085",
        brand_name: "カロナール細粒50%",
        manufacturer: "あゆみ製薬",
        taste_smell: "オレンジ風味（苦味あり）。",
        good_compatibility: ["チョコアイス", "アイスクリーム"],
        bad_compatibility: ["酸性食品"],
        special_notes: "20%より粉の量が少なくて済むが苦味は強い。",
        source: "あゆみ製薬 IF"
    },
    {
        yj_code: "1141007Q1056",
        brand_name: "カロナールシロップ2%",
        manufacturer: "あゆみ製薬",
        taste_smell: "オレンジ風味。甘い。",
        good_compatibility: ["そのまま"],
        bad_compatibility: [],
        special_notes: "シロップ。",
        source: "あゆみ製薬"
    },
    {
        yj_code: "1124009F1043",
        brand_name: "ブルフェン顆粒20%",
        manufacturer: "科研製薬",
        taste_smell: "甘い。",
        good_compatibility: [],
        bad_compatibility: [],
        special_notes: "イブプロフェン。空腹時避ける。",
        source: "IF"
    },

    // =========================================================================
    // 整腸剤・胃腸薬
    // =========================================================================
    {
        yj_code: "2316012F1023",
        brand_name: "ビオフェルミンR散",
        manufacturer: "ビオフェルミン製薬",
        taste_smell: "わずかに甘い。",
        good_compatibility: ["何でも可"],
        bad_compatibility: [],
        special_notes: "抗生物質耐性乳酸菌。抗生物質と併用する。",
        source: "添付文書"
    },
    {
        yj_code: "2316001C1052",
        brand_name: "ミヤBM細粒",
        manufacturer: "ミヤリサン",
        taste_smell: "わずかに甘い/無味。",
        good_compatibility: ["何でも可", "お茶", "牛乳"],
        bad_compatibility: [],
        special_notes: "宮入菌。抗生物質と併用可。味を損なわない。",
        source: "添付文書 / 愛知医科大学"
    },
    {
        yj_code: "2316008C1032",
        brand_name: "ラックビー微粒N",
        manufacturer: "興和",
        taste_smell: "わずかに甘い。",
        good_compatibility: ["何でも可"],
        bad_compatibility: [],
        special_notes: "ビフィズス菌。牛乳アレルギー注意（乳糖含む場合あり要確認）。",
        source: "添付文書"
    },
    {
        yj_code: "2399004C1045",
        brand_name: "ナウゼリンドライシロップ1%",
        manufacturer: "協和キリン",
        taste_smell: "甘い。",
        good_compatibility: ["水"],
        bad_compatibility: [],
        special_notes: "吐き気止め。食前投与が多い。",
        source: "IF"
    },

    // =========================================================================
    // その他
    // =========================================================================
    {
        yj_code: "3229002C1020",
        brand_name: "インクレミンシロップ5%",
        manufacturer: "日医工",
        taste_smell: "チェリー風味。鉄臭い。",
        good_compatibility: ["オレンジジュース（吸収良くなる）"],
        bad_compatibility: ["お茶（タンニン）"],
        special_notes: "鉄剤。歯が黒くなることあり（ストロー推奨）。便が黒くなる。",
        source: "添付文書"
    },
    {
        yj_code: "1179045F1022",
        brand_name: "イーケプラドライシロップ50%",
        manufacturer: "大塚製薬",
        taste_smell: "甘い（ブドウ風味）。",
        good_compatibility: ["水"],
        bad_compatibility: [],
        special_notes: "抗てんかん薬。水に溶けやすい。",
        source: "大塚製薬 Web"
    },
    {
        yj_code: "3929004F1030",
        brand_name: "デパケン細粒",
        manufacturer: "協和キリン",
        taste_smell: "甘い。",
        good_compatibility: [],
        bad_compatibility: ["炭酸飲料（発泡する）"],
        special_notes: "バルプロ酸。湿気に弱い。",
        source: "IF"
    },
    {
        yj_code: "1180001C1037",
        brand_name: "PL配合顆粒",
        manufacturer: "塩野義製薬",
        taste_smell: "苦い。",
        good_compatibility: ["チョコアイス"],
        bad_compatibility: [],
        special_notes: "総合感冒薬。サリチルアミド等配合。苦味あり。",
        source: "IF"
    }
];

// 既存ファイルがあれば読み込む（が、今回は上書きするロジック）
// publicディレクトリの確認
const publicDir = path.dirname(targetFile);
if (!fs.existsSync(publicDir)) {
    console.error(`Directory not found: ${publicDir}`);
    // Create directory if it doesn't exist
    try {
        fs.mkdirSync(publicDir, { recursive: true });
        console.log(`Created directory: ${publicDir}`);
    } catch (e) {
        console.error(`Failed to create directory: ${e.message}`);
        process.exit(1);
    }
}

// ファイル書き込み
try {
    fs.writeFileSync(targetFile, JSON.stringify(meds, null, 2), 'utf-8');
    console.log(`Successfully wrote ${meds.length} items to ${targetFile}`);
} catch (e) {
    console.error(`Failed to write file: ${e.message}`);
    process.exit(1);
}
