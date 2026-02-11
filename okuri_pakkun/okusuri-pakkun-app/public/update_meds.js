const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'kiyoshi', 'Github_repository', 'okuri_pakkun', 'okusuri-pakkun-app', 'public', 'meds_master.json');

const updates = {
    "6241010C1024": {
        "manufacturer": "富士フイルム富山化学",
        "taste_smell": "イチゴ風味で甘い。淡赤色の細粒。",
        "good_compatibility": ["プリン", "ジャム", "ピーナッツバター", "ココア", "チョコクリーム"],
        "bad_compatibility": ["バニラアイス", "ヨーグルト", "スポーツ飲料", "牛乳（吸収低下注意）", "鉄剤（吸収低下注意）"],
        "special_notes": "イチゴ風味で飲みやすく工夫されています。牛乳や鉄剤と同時に飲むと薬の吸収が悪くなるため、2時間以上間隔を空けてください。メーカー指導箋あり。",
        "source": "富士フイルム富山化学 インタビューフォーム / 指導箋"
    },
    "6132015C1103": {
        "taste_smell": "バナナ風味で甘い。わずかに苦味がある. オレンジ色の細粒。",
        "good_compatibility": ["アイスクリーム", "ヨーグルト", "プリン", "牛乳", "ココア", "練乳", "チョコクリーム", "リンゴジュース"],
        "bad_compatibility": ["スポーツ飲料", "乳酸菌飲料"],
        "special_notes": "バナナ風味で比較的飲みやすい抗生物質です。鉄剤と同時に飲むと吸収が悪くなることがあるため、時間を空けてください。メーカー指導箋あり。",
        "source": "Meiji Seika ファルマ インタビューフォーム / 指導箋"
    },
    "6132016C1027": {
        "taste_smell": "イチゴ風味で甘い。後味にわずかな苦味がある。赤白色の細粒。",
        "good_compatibility": ["バニラアイス", "ヨーグルト", "プリン", "牛乳", "練乳"],
        "bad_compatibility": ["スポーツ飲料", "乳酸菌飲料", "果汁ジュース", "酸味のあるもの"],
        "special_notes": "イチゴ風味ですが、時間が経つと苦味が出るため、混ぜたらすぐに飲ませてください。酸性のものと混ぜると苦味が増すことがあります。メーカー指導箋あり。",
        "source": "塩野義製薬 インタビューフォーム / 指導箋"
    },
    "6132011R1078": {
        "taste_smell": "オレンジ風味で甘い。水に混ぜると苦味が出やすい。",
        "good_compatibility": ["アイスクリーム", "ヨーグルト", "プリン", "牛乳", "練乳", "チョコクリーム", "オレンジジュース", "リンゴジュース"],
        "bad_compatibility": ["水（苦味が増す）"],
        "special_notes": "オレンジ風味ですが、水に混ぜると苦味を感じやすくなるため、アイスやジュースに混ぜるのがおすすめです。便が赤っぽくなることがあります。メーカー指導箋あり。",
        "source": "第一三共 インタビューフォーム / 指導箋"
    },
    "6149003R1062": {
        "taste_smell": "バナナ風味で甘い。薄い黄色の粉末。",
        "good_compatibility": ["バニラアイス", "チョコクリーム", "ココア", "練乳", "牛乳", "プリン"],
        "bad_compatibility": ["オレンジジュース", "リンゴジュース", "スポーツ飲料", "乳酸菌飲料", "ヨーグルト"],
        "special_notes": "【重要】酸性のもの（ジュースやヨーグルト）と混ぜると、苦味を抑えるコーティングが剥がれて非常に苦くなります。混ぜたらすぐに飲ませてください。",
        "source": "高田製薬 インタビューフォーム / 指導箋"
    },
    "6149004C1030": {
        "taste_smell": "パイン・オレンジ風味で甘い。後味に苦味がある. 淡いだいだい色の細粒。",
        "good_compatibility": ["バニラアイス", "チョコ", "ココア", "メープルシロップ", "牛乳", "練乳", "プリン", "ピーナッツクリーム"],
        "bad_compatibility": ["柑橘系ジュース", "リンゴジュース", "スポーツ飲料", "乳酸菌飲料", "ヨーグルト"],
        "special_notes": "後味に苦味が残りやすいため、味が濃く甘みの強いものと混ぜるのがおすすめです。酸性のものと混ぜると苦味が増します。メーカー指導箋あり。",
        "source": "ファイザー インタビューフォーム / 指導箋"
    },
    "1141007C1075": {
        "taste_smell": "オレンジ風味で甘い。後味にわずかな苦味がある. 淡橙色の細粒。",
        "good_compatibility": ["アイスクリーム", "プリン", "練乳", "チョコクリーム", "ジャム", "牛乳", "ココア"],
        "bad_compatibility": ["オレンジジュース", "リンゴジュース", "ヨーグルト"],
        "special_notes": "はじめは甘いですが、後味に苦味が残ることがあります。酸性のものと混ぜると苦味を感じやすくなるため、甘いものに混ぜるのがおすすめです。空腹時でも服用可能です。",
        "source": "あゆみ製薬 インタビューフォーム / 指導箋"
    },
    "1141007C2020": {
        "taste_smell": "オレンジ風味で甘い。後味に苦味がある. 淡橙色の細粒。",
        "good_compatibility": ["アイスクリーム", "チョコクリーム", "練乳", "プリン"],
        "bad_compatibility": ["酸性食品（ジュース、ヨーグルト等）"],
        "special_notes": "20%製剤よりも高濃度のため、粉の量は少なくて済みますが、苦味はより強く感じられることがあります。甘いものに混ぜて服用してください。",
        "source": "あゆみ製薬 インタビューフォーム / 指導箋"
    }
};

try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);

    let updatedCount = 0;
    data.forEach(med => {
        if (updates[med.yj_code]) {
            Object.assign(med, updates[med.yj_code]);
            updatedCount++;
        }
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully updated ${updatedCount} entries.`);
} catch (error) {
    console.error("Error updating meds:", error.message);
    process.exit(1);
}
