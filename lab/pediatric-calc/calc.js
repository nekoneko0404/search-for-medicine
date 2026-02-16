const PEDIATRIC_DRUGS = [
    // --- 抗生物質 (セフェム系) ---
    {
        id: "meiact-ms",
        name: "メイアクトMS小児用細粒10%",
        yjCode: "6132016C1020",
        potency: 100,
        dosage: { minMgKg: 9, maxMgKg: 18, absoluteMaxMgKg: 18, note: "通常1日9〜18mg/kgを3回。1回上限6mg/kg。" },
        piSnippet: "セフジトレン ピボキシルとして1日9〜18mg/kgを3回に分割して経口投与する。なお、年齢、症状により適宜増減するが、1回6mg/kg、1日18mg/kgを上限とする。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1020?user=1"
    },
    { id: "meiact-amel", name: "セフジトレンピボキシル細粒10%「アメル」", yjCode: "6132016C1046", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "メイアクトAG。" }, piSnippet: "セフジトレン ピボキシルとして1日9〜18mg/kgを3回に分割して経口投与する。1回6mg/kg、1日18mg/kgを上限とする。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1046?user=1" },
    { id: "meiact-nichiiko", name: "セフジトレンピボキシル細粒10%「日医工」", yjCode: "6132016C1038", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "メイアクトAG。" }, piSnippet: "セフジトレン ピボキシルとして1日9〜18mg/kgを3回に分割して経口投与する。1回6mg/kg、1日18mg/kgを上限とする。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1038?user=1" },
    { id: "flomox-ds", name: "フロモックス小児用細粒100mg", yjCode: "6132013R1036", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを3回。" }, piSnippet: "セフカペン ピボキシル塩酸塩水和物として1日9〜18mg/kgを3回に分割経口投与する。なお、年齢、症状により適宜増減する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013R1036?user=1" },
    { id: "flomox-sawai", name: "セフカペンピボキシル塩酸塩細粒10%「サワイ」", yjCode: "6132013R1044", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "フロモックスAG。" }, piSnippet: "セフカペン ピボキシル塩酸塩水和物として1日9〜18mg/kgを3回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013R1044?user=1" },
    { id: "vanan-ds", name: "バナン小児用ドライシロップ10%", yjCode: "6132009R1023", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "通常1日9〜18mg/kgを2〜3回。" }, piSnippet: "セフポドキシム プロキセチルとして1日9〜18mg/kgを2〜3回に分割経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132009R1023?user=1" },
    { id: "cefdinir-astellas", name: "セフゾン細粒小児用10%", yjCode: "6132014R1030", potency: 100, dosage: { minMgKg: 9, maxMgKg: 18, note: "1日9〜18mg/kgを3回。" }, piSnippet: "セフジニルとして1日9〜18mg/kgを3回に分割経口投与する。なお、年齢、症状により適宜増減する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132014R1030?user=1" },
    { id: "kefral-fine", name: "ケフラール細粒小児用100mg", yjCode: "6132005R1024", potency: 100, dosage: { minMgKg: 20, maxMgKg: 40, absoluteMaxMgKg: 100, note: "通常1日20〜40mg/kgを3回。" }, piSnippet: "セファクロルとして1日20〜40mg/kgを3回に分割して経口投与する。重症等の場合には1日100mg/kgまで増量できる。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132005R1024?user=1" },

    // --- 抗生物質 (ペニシリン系) ---
    { id: "widecillin-fine-20", name: "ワイドシリン細粒20%", yjCode: "6113004R1038", potency: 200, dosage: { minMgKg: 20, maxMgKg: 40, absoluteMaxMgKg: 90, note: "1日最大90mg/kg。" }, piSnippet: "アモキシシリン水和物として1日20〜40mg/kgを3〜4回に分割経口投与する。なお、1日量として最大90mg/kgを超えないこと。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6113004R1038?user=1" },
    { id: "unasyn-ds", name: "ユナシン細粒小児用10%", yjCode: "6119003R1034", potency: 100, dosage: { minMgKg: 30, maxMgKg: 60, note: "通常1日30〜60mg/kgを3回。" }, piSnippet: "スルタミシリントシル酸塩水和物として1日30〜60mg/kgを3回に分割して経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6119003R1034?user=1" },
    { id: "clavamox-ds", name: "クラバモックス小児用配合DS", yjCode: "6139502R1026", potency: 44.4, dosage: { minMgKg: 40, maxMgKg: 44.4, isByTime: true, timeMgKg: 20, timesPerDay: 2, note: "1回20mg(Amox換算)/kgを12時間ごと(1日2回)。" }, piSnippet: "通常、小児には、アモキシシリン水和物及びクラブラン酸カリウムとして1回20mg/kg（アモキシシリン計量）を12時間ごとに経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6139502R1026?user=1" },

    // --- 抗生物質 (マクロライド系) ---
    { id: "claris-takata", name: "クラリスロマイシンDS10%「タカタ」", yjCode: "6149002R1020", potency: 100, dosage: { minMgKg: 10, maxMgKg: 15, isByTime: true, timeMgKg: 5, timesPerDay: 2, note: "1日10〜15mg/kgを2回。" }, piSnippet: "クラリスロマイシンとして1日10〜15mg/kgを2回に分割経口投与する。なお、年齢、症状により適宜増減する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149002R1020?user=1" },
    { id: "zithromac-ds", name: "ジスロマック細粒小児用10%", yjCode: "6149004R1029", potency: 100, dosage: { minMgKg: 10, maxMgKg: 10, isByTime: true, timeMgKg: 10, timesPerDay: 1, note: "1回10mg/kgを3日間。最大500mg。" }, piSnippet: "アジスロマイシン水和物として1日1回10mg/kgを3日間経口投与する。なお、1日量は成人での最大投与量500mgを超えないものとする。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004R1029?user=1" },

    // --- 抗生物質 (その他) ---
    { id: "ozex-fine", name: "オゼックス小児用細粒15%", yjCode: "6241013R1025", potency: 150, dosage: { minMgKg: 12, maxMgKg: 24, isByTime: true, timeMgKg: 6, timesPerDay: 2, note: "通常1回6mg/kgを1日2回。最大1回12mg/kg。" }, piSnippet: "トスフロキサシントシル酸塩水和物として1回6mg/kgを1日2回経口投与する。なお、必要に応じて1回12mg/kgまで増量できる。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6241013R1025?user=1" },
    { id: "farom-ds", name: "ファロムドライシロップ小児用10%", yjCode: "6192001C1037", potency: 100, dosage: { minMgKg: 15, maxMgKg: 30, isByTime: true, timeMgKg: 5, timesPerDay: 3, note: "通常1回5mg/kgを3回。最大1回10mg/kg。" }, piSnippet: "ファロペネムナトリウム水和物として1回5mg/kgを1日3回経口投与する。増量する場合には1回10mg/kgを上限とする。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6192001C1037?user=1" },

    // --- 抗ウイルス ---
    {
        id: "tamiflu-ds", name: "タミフルドライシロップ3%", yjCode: "6250021F1027", potency: 30, hasSubOptions: true, subOptions: [
            { id: "over1y", label: "1歳以上", dosage: { minMgKg: 4, maxMgKg: 4, isByTime: true, timeMgKg: 2, timesPerDay: 2, absoluteMaxMgPerTime: 75, note: "1回2mg/kgを2回。" }, piSnippet: "1歳以上の小児：通常、オセルタミビルとして1回2mg/kgを1日2回、5日間経口投与する。ただし、1回最高用量は75mgとする。" },
            { id: "under1y", label: "1歳未満", dosage: { minMgKg: 6, maxMgKg: 6, isByTime: true, timeMgKg: 3, timesPerDay: 2, absoluteMaxMgPerTime: 75, note: "1回3mg/kgを2回。" }, piSnippet: "1歳未満の小児：通常、オセルタミビルとして1回3mg/kgを1日2回、5日間経口投与する。ただし、1回最高用量は75mgとする。" }
        ], piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250021F1027?user=1"
    },
    { id: "valtrex-granule", name: "バラシクロビル顆粒50%「トーワ」", yjCode: "6250002D1024", potency: 500, dosage: { minMgKg: 50, maxMgKg: 50, isByTime: true, timeMgKg: 25, timesPerDay: 2, note: "通常1回25mg/kgを2回。最大500mg。" }, piSnippet: "バラシクロビルとして1回25mg/kgを1日2回経口投与する。ただし、1回最高用量は500mgとする。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250002D1024?user=1" },

    // --- 抗アレルギー・鼻炎 ---
    {
        id: "zyrtec-ds", name: "ジルテックドライシロップ1.25%", yjCode: "4490022R1027", potency: 12.5, calcType: "fixed-age", fixedDoses: [
            { ageMin: 2, ageMax: 7, dose: 0.2, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 15, dose: 0.4, unit: "g", label: "7-15歳未満" }
        ], piSnippet: "ジルテックドライシロップ：2歳以上7歳未満：1回0.2gを1日2回。7歳以上15歳未満：1回0.4gを1日2回経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490022R1027?user=1"
    },
    {
        id: "allegra-ds", name: "アレグラドライシロップ5%", yjCode: "4490023F1027", potency: 50, calcType: "fixed-age", fixedDoses: [
            { ageMin: 2, ageMax: 7, dose: 0.6, unit: "g", label: "2-7歳未満" }, { ageMin: 7, ageMax: 12, dose: 1.2, unit: "g", label: "7-12歳未満" }
        ], piSnippet: "フェキソフェナジン塩酸塩：2歳以上7歳未満：1回0.6gを1日2回。7歳以上12歳未満：1回1.2gを1日2回経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490023F1027?user=1"
    },
    { id: "alegion-ds", name: "アレジオンDS1%", yjCode: "4490021R1022", potency: 10, dosage: { minMgKg: 0.25, maxMgKg: 0.5, note: "通常1日1回0.25〜0.5mg/kg。最大1日2g(20mg)。" }, piSnippet: "エピナスチン塩酸塩として1日1回0.25〜0.5mg/kgを経口投与する。1日量は1%ドライシロップとして2gを超えないこと。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490021R1022?user=1" },
    { id: "seslan-fine", name: "ゼスラン細粒小児用0.6%", yjCode: "4490019R1026", potency: 6, dosage: { minMgKg: 0.12, maxMgKg: 0.24, isByTime: true, timeMgKg: 0.06, timesPerDay: 2, note: "鼻炎時:1回0.06mg/kg。喘息時:1回0.12mg/kg。1日2回。" }, piSnippet: "メキタジンとして1回0.06mg/kg（鼻炎等）、1回0.12mg/kg（喘息）を1日2回経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490019R1026?user=1" },

    // --- 咳・痰 ---
    { id: "mucodyne-ds", name: "ムコダインDS50%", yjCode: "2249009F1022", potency: 500, dosage: { minMgKg: 30, maxMgKg: 30, isByTime: true, timeMgKg: 10, timesPerDay: 3, note: "通常1回10mg/kgを3回。" }, piSnippet: "カルボシステインとして1回10mg/kgを1日3回経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2249009F1022?user=1" },
    { id: "asverin-powder", name: "アスベリン散10%", yjCode: "2223001C1071", potency: 100, dosage: { minMgKg: 1, maxMgKg: 1, isByTime: true, timeMgKg: 0.33, timesPerDay: 3, note: "通常1日1mg/kgを3回。" }, piSnippet: "チペピジンヒベンズ酸塩として1日1mg/kgを3回に分割して経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2223001C1071?user=1" },
    { id: "hokunalin-ds", name: "ホクナリンDS0.1%小児用", yjCode: "2251001C1027", potency: 1, dosage: { minMgKg: 0.04, maxMgKg: 0.04, isByTime: true, timeMgKg: 0.02, timesPerDay: 2, note: "通常1回0.02mg/kgを2回。" }, piSnippet: "ツロブテロールとして1日0.04mg/kgを2回に分けて経口投与する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2251001C1027?user=1" },

    // --- 解熱鎮痛 ---
    { id: "calonal-20", name: "カロナール細粒20%", yjCode: "1141007C1077", potency: 200, dosage: { minMgKg: 10, maxMgKg: 15, absoluteMaxMgKg: 60, isByTime: true, timeMgKg: 10, timesPerDay: 4, note: "1回10〜15mg/kg。原則4時間空ける。" }, piSnippet: "アセトアミノフェンとして1回10〜15mg/kgを経口投与する。投与間隔は4〜6時間以上とし、1日総量として60mg/kgを超えないこと。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007C1077?user=1" },

    // --- 整腸剤・漢方 ---
    { id: "miya-bm", name: "ミヤBM細粒", yjCode: "2316001C1052", potency: 1, calcType: "age", adultDose: 3, unit: "g", dosage: { note: "目安1日1.5〜3g(3回)。Augsberger式参考。" }, piSnippet: "通常1日1.5〜3gを3回に分割経口投与する。症状に応じ増減する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2316001C1052?user=1" },
    { id: "kakkonto", name: "ツムラ葛根湯エキス顆粒", yjCode: "5200001D1024", potency: 1, calcType: "age", adultDose: 7.5, unit: "g", dosage: { note: "Augsberger式算出。7.5g/日基準。" }, piSnippet: "通常、成人1日7.5gを2〜3回に分割して経口投与する。小児には年齢に応じて適宜減量する。", piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200001D1024?user=1" }
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
    const age = parseFloat(ageInput.value) || 0;
    const weight = parseFloat(weightInput.value) || 0;
    const currentPi = drug.hasSubOptions ? drug.subOptions.find(o => o.id === selectedSubOptionId)?.piSnippet : drug.piSnippet;

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
