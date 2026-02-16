const PEDIATRIC_DRUGS = [
    {
        id: "widecillin-fine-granules",
        name: "ワイドシリン細粒10%",
        yjCode: "6131001C1252",
        potency: 100, // mg/g (10%)
        dosage: {
            minMgKg: 20,
            maxMgKg: 40,
            absoluteMaxMgKg: 90,
            note: "1日量を3〜4回に分割経口投与。1回用量の最大量は記載なし（通常、成人用量を超えない）。"
        },
        piSnippet: "通常、小児には1日20〜40mg（力価）/kgを3〜4回に分割経口投与する。なお、年齢、症状により適宜増減するが、1日量として最大90mg（力価）/kgを超えないこと。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131001C1252?user=1"
    },
    {
        id: "meiact-ms-fine-granules",
        name: "メイアクトMS小児用細粒10%",
        yjCode: "6132016C1020",
        potency: 100,
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgKg: 18,
            note: "通常、1日9〜18mg（力価）/kgを3回に分割して経口投与する。増量が必要な場合は1回6mg/kg（1日18mg/kg）まで可能。"
        },
        piSnippet: "小児：通常、アモキシシリン水和物として1日9〜18mg（力価）/kgを3回に分割して経口投与する。なお、年齢、症状により適宜増減するが、1回6mg（力価）/kg、1日18mg（力価）/kgを上限とする。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132016C1020?user=1"
    },
    {
        id: "tamiflu-ds",
        name: "タミフルドライシロップ3%",
        yjCode: "6250021B1021",
        potency: 30, // 30mg/g (3%)
        hasSubOptions: true,
        subOptions: [
            {
                id: "over1y",
                label: "1歳以上",
                dosage: {
                    minMgKg: 4, // 2mg/kg * 2 times
                    maxMgKg: 4,
                    isByTime: true,
                    timeMgKg: 2,
                    timesPerDay: 2,
                    absoluteMaxMgPerTime: 75,
                    note: "1回2mg/kgを1日2回、5日間経口投与。1回最高用量は75mg。"
                },
                piSnippet: "1歳以上の小児：通常、オセルタミビルとして1回2mg/kgを1日2回、5日間経口投与する。ただし、1回最高用量は75mgとする。"
            },
            {
                id: "under1y",
                label: "1歳未満 (新生児、乳児)",
                dosage: {
                    minMgKg: 6, // 3mg/kg * 2 times
                    maxMgKg: 6,
                    isByTime: true,
                    timeMgKg: 3,
                    timesPerDay: 2,
                    absoluteMaxMgPerTime: 75,
                    note: "1回3mg/kgを1日2回、5日間経口投与。1回最高用量は75mg。"
                },
                piSnippet: "1歳未満の小児：通常、オセルタミビルとして1回3mg/kgを1日2回、5日間経口投与する。ただし、1回最高用量は75mgとする。"
            }
        ],
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250021B1021?user=1"
    },
    {
        id: "mucodyne-ds",
        name: "ムコダインDS50%",
        yjCode: "2233002R2029",
        potency: 500, // 500mg/g (50%)
        dosage: {
            minMgKg: 30,
            maxMgKg: 30,
            absoluteMaxMgKg: null,
            isByTime: true,
            timeMgKg: 10,
            timesPerDay: 3,
            note: "通常、幼・小児には1回10mg/kg（1日30mg/kg）を1日3回、用時懸濁して経口投与する。"
        },
        piSnippet: "幼・小児：通常、L-カルボシステインとして体重1kgあたり1回10mg（本剤0.02g）を用時懸濁し、1日3回経口投与する。なお、年齢、症状により適宜増減する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/2233002R2029?user=1"
    },
    {
        id: "claris-ds",
        name: "クラリスドライシロップ10%",
        yjCode: "6149002R1058",
        potency: 100,
        dosage: {
            minMgKg: 10,
            maxMgKg: 15,
            absoluteMaxMgKg: null,
            isByTime: true,
            timeMgKg: 5, // 10mg/kg/day / 2 = 5mg/kg/time
            timesPerDay: 2,
            note: "通常、小児には1日10〜15mg（力価）/kgを2回に分割して経口投与する。レジオネラ症には1日15mg/kgを2回分割。"
        },
        piSnippet: "小児：通常、クラリスロマイシンとして1日10〜15mg（力価）/kgを2回に分割経口投与する。なお、年齢、症状により適宜増減する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149002R1058?user=1"
    },
    {
        id: "flomox-ds",
        name: "フロモックス小児用細粒100mg",
        yjCode: "6132013R1038",
        potency: 100,
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgKg: 18,
            note: "通常、小児には1日9〜18mg（力価）/kgを3回に分割して経口投与する。"
        },
        piSnippet: "小児：通常、セフカペン ピボキシル塩酸塩水和物として1日9〜18mg（力価）/kgを3回に分割経口投与する。なお、年齢、症状により適宜増減する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013R1038?user=1"
    },
    {
        id: "calonal-fine-granules-20",
        name: "カロナール細粒20%",
        yjCode: "1141007C1077",
        potency: 200, // 200mg/g (20%)
        dosage: {
            minMgKg: 10,
            maxMgKg: 15,
            absoluteMaxMgKg: 60,
            isByTime: true,
            timeMgKg: 10, // 1回10〜15mg/kg
            timesPerDay: 4, // 1日4回まで
            note: "1回10〜15mg/kg。投与間隔は4〜6時間以上空けること。1日総量として60mg/kgを上限とする。"
        },
        piSnippet: "小児：通常、1回10〜15mg/kgを、4〜6時間以上あけて経口投与する。なお、年齢、症状により適宜増減するが、1日総量として60mg/kgを上限とする。成人の用量を超えないこと。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007C1077?user=1"
    },
    {
        id: "kefral-fine-granules",
        name: "ケフラール細粒100mg(10%)",
        yjCode: "6132005C1021",
        potency: 100,
        dosage: {
            minMgKg: 20,
            maxMgKg: 40,
            absoluteMaxMgKg: 100,
            note: "通常、1日20〜40mg（力価）/kgを3回に分割して経口投与する。重症等の場合には1日100mg/kgまで増量できる。"
        },
        piSnippet: "小児：通常、1日20〜40mg（力価）/kgを3回に分割して経口投与する。重症等の場合には1日100mg（力価）/kgまで増量できる。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132005C1021?user=1"
    },
    {
        id: "unasyn-ds",
        name: "ユナシン細粒10%",
        yjCode: "6131011C1042",
        potency: 100,
        dosage: {
            minMgKg: 30,
            maxMgKg: 60,
            absoluteMaxMgKg: 60,
            note: "通常、小児には1日30〜60mg（力価）/kgを3回に分割して経口投与する。"
        },
        piSnippet: "小児：通常、1日30〜60mg（力価）/kgを3回に分割して経口投与する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6131011C1042?user=1"
    },
    {
        id: "tomiron-ds",
        name: "トミロン細粒小児用10%",
        yjCode: "6132012C1020",
        potency: 100,
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgKg: 18,
            note: "通常、小児には1日9〜18mg（力価）/kgを3回に分割して経口投与する。"
        },
        piSnippet: "小児：通常、セフチブテンとして1日9〜18mg（力価）/kgを3回に分割経口投与する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132012C1020?user=1"
    },
    {
        id: "vanan-ds",
        name: "バナンドライシロップ5%小児用",
        yjCode: "6132013R1038",
        potency: 50,
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgKg: 18,
            note: "通常、小児には1日9〜18mg（力価）/kgを2〜3回に分割して経口投与する。"
        },
        piSnippet: "小児：通常、セフポドキシム プロキセチルとして1日9〜18mg（力価）/kgを2〜3回に分割経口投与する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132013R1038?user=1"
    },
    {
        id: "clavamox-ds",
        name: "クラバモックス小児用配合DS",
        yjCode: "6139502R1026",
        potency: 44.4, // Amoxicillinベース
        dosage: {
            minMgKg: 40,
            maxMgKg: 44.4,
            absoluteMaxMgKg: 44.4,
            isByTime: true,
            timeMgKg: 20, // 40mg/kg/day / 2
            timesPerDay: 2,
            note: "通常、小児にはアモキシシリン換算で1日40〜44.4mg/kgを2回に分割して12時間ごとに経口投与する。"
        },
        piSnippet: "小児：通常、アモキシシリン水和物として1日40〜44.4mg（力価）/kgを2回に分割して12時間ごとに経口投与する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6139502R1026?user=1"
    },
    {
        id: "ozex-fine-granules",
        name: "オゼックス小児用細粒15%",
        yjCode: "6241013C1022",
        potency: 150,
        dosage: {
            minMgKg: 12,
            maxMgKg: 12,
            absoluteMaxMgKg: 24,
            isByTime: true,
            timeMgKg: 6,
            timesPerDay: 2,
            note: "通常、小児には1回6mg/kg（1日12mg/kg）を1日2回経口投与する。重症時には1回12mg/kg（1日24mg/kg）まで増量可能。"
        },
        piSnippet: "小児：通常、トスフロキサシンとして1回6mg（力価）/kgを1日2回経口投与する。なお、必要に応じて1回12mg（力価）/kgまで増量できる。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6241013C1022?user=1"
    },
    {
        id: "valtrex-granules",
        name: "バラシクロビル顆粒50%「トーワ」",
        yjCode: "6250002D1024",
        potency: 500,
        dosage: {
            minMgKg: 50,
            maxMgKg: 50,
            absoluteMaxMgKg: null,
            isByTime: true,
            timeMgKg: 25,
            timesPerDay: 2,
            note: "通常、小児には1回25mg/kg（1日50mg/kg）を1日2回経口投与する。1回最高用量は成人と同じ500mg。"
        },
        piSnippet: "小児：通常、バラシクロビルとして1回25mg/kgを1日2回経口投与する。ただし、1回最高用量は500mgとする。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6250002D1024?user=1"
    },
    {
        id: "calonal-fine-granules-50",
        name: "カロナール細粒50%",
        yjCode: "1141007C2037",
        potency: 500,
        dosage: {
            minMgKg: 10,
            maxMgKg: 15,
            absoluteMaxMgKg: 60,
            isByTime: true,
            timeMgKg: 10,
            timesPerDay: 4,
            note: "1回10〜15mg/kg。投与間隔は4〜6時間以上空けること。1日総量として60mg/kgを上限とする。"
        },
        piSnippet: "小児：通常、1回10〜15mg/kgを、4〜6時間以上あけて経口投与する。なお、年齢、症状により適宜増減するが、1日総量として60mg/kgを上限とする。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/1141007C2037?user=1"
    },
    {
        id: "celtect-ds",
        name: "オキサトミドDS小児用2%",
        yjCode: "4490004R1030",
        potency: 20,
        dosage: {
            minMgKg: 1,
            maxMgKg: 1,
            absoluteMaxMgKg: 1,
            isByTime: true,
            timeMgKg: 0.5,
            timesPerDay: 2,
            note: "通常、小児には1日1mg/kgを2回に分けて朝及び就寝前に用時懸濁して経口投与する。"
        },
        piSnippet: "小児：通常、オキサトミドとして1日量1mg/kgを2回、朝及び就寝前に用時懸濁して経口投与する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4490004R1030?user=1"
    },
    {
        id: "theophylline-ds",
        name: "テオドールドライシロップ20%",
        yjCode: "4419001R1020",
        potency: 200,
        dosage: {
            minMgKg: 20,
            maxMgKg: 20,
            absoluteMaxMgKg: null,
            isByTime: true,
            timeMgKg: 10,
            timesPerDay: 2,
            note: "通常、小児には1日20mg/kgを2回に分割して経口投与する。年齢、症状により適宜増減する。"
        },
        piSnippet: "小児：通常、テオフィリンとして1日20mg/kgを2回に分割して経口投与する。なお、年齢、症状により適宜増減する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/4419001R1020?user=1"
    },
    {
        id: "cefdinir-ds",
        name: "セフゾン細粒小児用10%",
        yjCode: "6132011C1026",
        potency: 100,
        dosage: {
            minMgKg: 9,
            maxMgKg: 18,
            absoluteMaxMgKg: 18,
            note: "通常、1日9〜18mg（力価）/kgを3回に分割して経口投与する。"
        },
        piSnippet: "小児：通常、セフジニルとして1日9〜18mg（力価）/kgを3回に分割経口投与する。なお、年齢、症状により適宜増減する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6132011C1026?user=1"
    },
    {
        id: "zithromac-fine-granules",
        name: "ジスロマック小児用細粒10%",
        yjCode: "6149004C1025",
        potency: 100,
        dosage: {
            minMgKg: 10,
            maxMgKg: 10,
            absoluteMaxMgKg: null,
            isByTime: true,
            timeMgKg: 10,
            timesPerDay: 1,
            note: "1日1回10mg/kgを3日間経口投与する。1日量は成人最大量500mgを超えないこと。"
        },
        piSnippet: "小児：通常、1日1回、10mg（力価）/kgを3日間経口投与する。なお、1日量は成人での最大投与量500mg（力価）を超えないものとする。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/6149004C1025?user=1"
    },
    {
        id: "kakkonto-extract",
        name: "ツムラ葛根湯エキス顆粒",
        yjCode: "5200001D1024",
        potency: 1, // 漢方はgそのものを扱うため便宜上1
        calcType: "age",
        adultDose: 7.5,
        unit: "g",
        dosage: {
            note: "アウグスバーガー式（年齢ベース）による算出 (成人量 7.5g/日)"
        },
        piSnippet: "通常、成人1日7.5gを2〜3回に分割して経口投与する。小児には年齢に応じて適宜減量する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200001D1024?user=1"
    },
    {
        id: "yokukansan-extract",
        name: "ツムラ抑肝散エキス顆粒",
        yjCode: "5200138D1022",
        potency: 1,
        calcType: "age",
        adultDose: 7.5,
        unit: "g",
        dosage: {
            note: "アウグスバーガー式（年齢ベース）による算出 (成人量 7.5g/日)"
        },
        piSnippet: "通常、成人1日7.5gを2〜3回に分割して経口投与する。小児には年齢に応じて適宜減量する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200138D1022?user=1"
    },
    {
        id: "shakuyaku-extract",
        name: "ツムラ芍薬甘草湯エキス顆粒",
        yjCode: "5200067D1025",
        potency: 1,
        calcType: "age",
        adultDose: 7.5,
        unit: "g",
        dosage: {
            note: "アウグスバーガー式（年齢ベース）による算出 (成人量 7.5g/日)"
        },
        piSnippet: "通常、成人1日7.5gを2〜3回に分割して経口投与する。小児には年齢に応じて適宜減量する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/rdSearch/02/5200067D1025?user=1"
    }
];

let selectedDrugId = null;
let selectedSubOptionId = null;
let currentSearchQuery = '';

function renderDrugCards() {
    const container = document.getElementById('drug-cards-container');
    if (!container) return;

    const query = currentSearchQuery.toLowerCase();
    const filteredDrugs = PEDIATRIC_DRUGS.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.yjCode.includes(query)
    );

    if (filteredDrugs.length === 0) {
        container.innerHTML = '<div class="col-span-full py-10 text-center text-gray-400 font-bold">該当する薬剤が見つかりません</div>';
        return;
    }

    container.innerHTML = filteredDrugs.map(d => `
        <div class="drug-card ${selectedDrugId === d.id ? 'active' : ''}" data-id="${d.id}">
            <div class="potency-tag">${d.calcType === 'age' ? '漢方・年齢' : (d.potency >= 100 ? (d.potency / 10).toFixed(1) + '%' : d.potency + 'mg/g')}</div>
            <h3 class="text-sm font-black leading-tight mb-1">${d.name}</h3>
            <div class="text-[9px] text-gray-400 mt-auto font-mono">YJ: ${d.yjCode}</div>
        </div>
    `).join('');

    document.querySelectorAll('.drug-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedDrugId = card.dataset.id;
            const drug = PEDIATRIC_DRUGS.find(d => d.id === selectedDrugId);

            // Handle sub-options
            if (drug.hasSubOptions) {
                selectedSubOptionId = drug.subOptions[0].id;
                renderSubOptions(drug);
                document.getElementById('sub-option-area').classList.remove('hidden');
            } else {
                selectedSubOptionId = null;
                document.getElementById('sub-option-area').classList.add('hidden');
            }

            // UI Feedback for input priority
            const ageGroup = document.getElementById('age').closest('.form-group');
            const weightGroup = document.getElementById('body-weight').closest('.form-group');

            if (drug.calcType === 'age') {
                ageGroup.classList.add('ring-2', 'ring-indigo-400', 'bg-indigo-50/30');
                weightGroup.classList.remove('ring-2', 'ring-blue-400', 'bg-blue-50/30');
                // Focus age?
            } else {
                weightGroup.classList.add('ring-2', 'ring-blue-400', 'bg-blue-50/30');
                ageGroup.classList.remove('ring-2', 'ring-indigo-400', 'bg-indigo-50/30');
                // Focus weight?
            }

            document.getElementById('calc-main-area').classList.remove('hidden');
            document.getElementById('initial-guide').classList.add('hidden');
            renderDrugCards();
            updateCalculations();

            // Auto scroll to results
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

    const age = parseInt(ageInput.value);
    const weight = parseFloat(weightInput.value);

    // Update PI Display
    piContainer.innerHTML = `
        <div class="pi-card bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 mt-6 shadow-sm">
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold text-amber-800 uppercase tracking-widest"><i class="fas fa-file-alt"></i> 添付文書 引用 (用法・用量)</span>
                <a href="${drug.piUrl}" target="_blank" class="text-xs text-blue-600 hover:underline font-bold">PMDAで開く <i class="fas fa-external-link-alt"></i></a>
            </div>
            <div class="text-sm text-gray-800 leading-relaxed italic mb-2 font-medium">
                「${drug.hasSubOptions ? drug.subOptions.find(o => o.id === selectedSubOptionId)?.piSnippet : drug.piSnippet}」
            </div>
            <div class="text-[10px] text-gray-500 text-right">YJコード: ${drug.yjCode}</div>
        </div>
    `;

    if (drug.calcType === 'age') {
        if (isNaN(age) || age < 0) {
            resultArea.innerHTML = '<p class="text-center text-gray-400 py-10">年齢を正しく入力してください</p>';
            return;
        }

        // Augsberger Formula: (Age * 4 + 20) % of Adult Dose
        const factor = (age * 4 + 20) / 100;
        const childDose = drug.adultDose * factor;

        resultArea.innerHTML = `
            <div class="space-y-4">
                <div class="bg-indigo-600 text-white p-6 rounded-xl shadow-lg border-b-4 border-indigo-800">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">アウグスバーガー式による算出 (${age}歳 ｜ 成人量の${(factor * 100).toFixed(0)}%)</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-black">${childDose.toFixed(2)}</span>
                        <span class="text-xl font-bold">${drug.unit} / 日</span>
                    </div>
                    <div class="text-sm opacity-80 mt-1">(参考: 成人量 ${drug.adultDose}${drug.unit} / 日)</div>
                </div>
            </div>
            <div class="mt-6 bg-white border-2 border-slate-100 p-5 rounded-xl border-dashed">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <i class="fas fa-info-circle"></i> 算出基準
                </h4>
                <div class="text-sm text-slate-700 font-bold leading-relaxed">
                    アウグスバーガーII式 [(年齢×4＋20)/100] を適用しています。漢方薬や小児用量設定のない薬剤の目安として使用されます。個別の用法（毎食前等）に従って分割してください。
                </div>
            </div>
        `;
        return;
    }

    // Weight-based calculation (Existing Logic)
    let dosageInfo = drug.dosage;
    if (drug.hasSubOptions && selectedSubOptionId) {
        const sub = drug.subOptions.find(o => o.id === selectedSubOptionId);
        if (sub) dosageInfo = sub.dosage;
    }

    if (isNaN(weight) || weight <= 0) {
        resultArea.innerHTML = '<p class="text-center text-gray-400 py-10">体重を正しく入力してください</p>';
        return;
    }

    const minMg = weight * dosageInfo.minMgKg;
    const maxMg = weight * dosageInfo.maxMgKg;
    const absMaxMg = dosageInfo.absoluteMaxMgKg ? weight * dosageInfo.absoluteMaxMgKg : null;

    const minG = minMg / drug.potency;
    const maxG = maxMg / drug.potency;
    const absMaxG = absMaxMg ? absMaxMg / drug.potency : null;

    let resultHtml = '<div class="space-y-4">';

    if (dosageInfo.isByTime) {
        const perTimeMg = weight * dosageInfo.timeMgKg;
        let perTimeG = perTimeMg / drug.potency;
        let warningMax = '';
        if (dosageInfo.absoluteMaxMgPerTime && perTimeMg > dosageInfo.absoluteMaxMgPerTime) {
            perTimeG = dosageInfo.absoluteMaxMgPerTime / drug.potency;
            warningMax = `<div class="mt-2 text-[10px] bg-yellow-100 text-yellow-800 p-1 rounded font-bold">※ 1回最高用量(${dosageInfo.absoluteMaxMgPerTime}mg)を適用</div>`;
        }
        resultHtml += `
            <div class="bg-blue-600 text-white p-6 rounded-xl shadow-lg border-b-4 border-blue-800">
                <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">1回あたりの分量 (${dosageInfo.timeMgKg}mg/kg基準)</div>
                <div class="flex items-baseline gap-2">
                    <span class="text-2xl font-black">${perTimeG.toFixed(2)}</span>
                    <span class="text-xl font-bold">g / 回</span>
                </div>
                <div class="text-sm opacity-80 mt-1">(${(perTimeG * drug.potency).toFixed(1)} mg / 回)</div>
                ${warningMax}
            </div>
            <div class="bg-slate-700 text-white p-4 rounded-xl shadow border-b-4 border-slate-900">
                <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">1日あたりの総量 (参考値)</div>
                <div class="flex items-baseline gap-2">
                    <span class="text-2xl font-black">${(perTimeG * dosageInfo.timesPerDay).toFixed(2)}</span>
                    <span class="text-lg font-bold">g / 日</span>
                </div>
                <div class="text-xs opacity-70 mt-1">(${(perTimeG * drug.potency * dosageInfo.timesPerDay).toFixed(1)} mg / 日 ｜ 1日${dosageInfo.timesPerDay}回分)</div>
            </div>
        `;
    } else {
        const isRange = dosageInfo.minMgKg !== dosageInfo.maxMgKg;
        resultHtml += `
            <div class="bg-indigo-700 text-white p-6 rounded-xl shadow-lg border-b-4 border-indigo-900">
                <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">通常用量 (1日総量: ${dosageInfo.minMgKg}${isRange ? '-' + dosageInfo.maxMgKg : ''}mg/kg)</div>
                <div class="flex items-baseline gap-2">
                    <span class="text-2xl font-black">${minG.toFixed(2)}${isRange ? ' 〜 ' + maxG.toFixed(2) : ''}</span>
                    <span class="text-xl font-bold">g / 日</span>
                </div>
                <div class="text-sm opacity-80 mt-1">(${minMg.toFixed(1)} 〜 ${maxMg.toFixed(1)} mg / 日)</div>
            </div>
        `;
        if (absMaxMg) {
            resultHtml += `
                <div class="bg-rose-600 text-white p-6 rounded-xl shadow-lg border-b-4 border-rose-800">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">最大用量 (1日総量: ${dosageInfo.absoluteMaxMgKg}mg/kg)</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-black">${absMaxG.toFixed(2)}</span>
                        <span class="text-xl font-bold">g / 日</span>
                    </div>
                    <div class="text-sm opacity-80 mt-1">(${absMaxMg.toFixed(1)} mg / 日)</div>
                </div>
            `;
        }
    }
    resultHtml += `</div>
    <div class="mt-6 bg-white border-2 border-slate-100 p-5 rounded-xl border-dashed">
        <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <i class="fas fa-info-circle"></i> 調剤・監査上の留意点
        </h4>
        <div class="text-sm text-slate-700 font-bold leading-relaxed">
            ${dosageInfo.note}
        </div>
    </div>`;
    resultArea.innerHTML = resultHtml;
}

document.addEventListener('DOMContentLoaded', () => {
    renderDrugCards();

    const searchInput = document.getElementById('medicine-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            renderDrugCards();
        });
    }

    document.getElementById('body-weight').addEventListener('input', updateCalculations);
    document.getElementById('age').addEventListener('input', updateCalculations);
});
