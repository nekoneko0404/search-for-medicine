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
        piUrl: "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/780009_6131001C1252_1_10#HDR_InfoDoseAdmin"
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
        piSnippet: "小児：通常、1日9〜18mg（力価）/kgを3回に分割して経口投与する。なお、年齢、症状により適宜増減するが、1回6mg（力価）/kg、1日18mg（力価）/kgを上限とする。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/780009_6132016C1020_1_13#HDR_InfoDoseAdmin"
    },
    {
        id: "tamiflu-capsule-oseltamivir",
        name: "タミフルドライシロップ3%",
        yjCode: "6250021B1021",
        potency: 30, // 30mg/g (3%)
        dosage: {
            minMgKg: 2,
            maxMgKg: 2,
            absoluteMaxMgKg: null,
            isByTime: true,
            note: "1回2mg/kg（オセルタミビルとして）を1日2回、5日間経口投与する。1回最高用量は75mg。"
        },
        piSnippet: "小児：通常、オセルタミビルとして1回2mg/kg（ドライシロップ剤として66.7mg/kg）を1日2回、5日間経口投与する。ただし、1回最高用量は75mgとする。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/780009_6250021B1021_1_25#HDR_InfoDoseAdmin"
    },
    {
        id: "mucodyne-fine-granules",
        name: "ムコダイン細粒33.3%",
        yjCode: "2239001C1077",
        potency: 333, // 333mg/g (33.3%)
        dosage: {
            minMgKg: 30,
            maxMgKg: 30,
            absoluteMaxMgKg: null,
            note: "通常、小児に1日量30mg/kgを3回に分割して経口投与する。"
        },
        piSnippet: "小児：通常、1日量30mg/kgを3回に分割して経口投与する。なお、年齢、症状により適宜増減する。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/780009_2239001C1077_1_12#HDR_InfoDoseAdmin"
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
        piUrl: "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/780009_6132005C1021_1_05#HDR_InfoDoseAdmin"
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
            note: "1日1回10mg/kgを3日間経口投与する。1日量は成人最大量500mgを超えないこと。"
        },
        piSnippet: "小児：通常、1日1回、10mg（力価）/kgを3日間経口投与する。なお、1日量は成人での最大投与量500mg（力価）を超えないものとする。",
        piUrl: "https://www.pmda.go.jp/PmdaSearch/iyakuDetail/780009_6149004C1025_1_18#HDR_InfoDoseAdmin"
    }
];

let selectedDrugId = null;

function renderDrugCards() {
    const container = document.getElementById('drug-cards-container');
    if (!container) return;

    container.innerHTML = PEDIATRIC_DRUGS.map(d => `
        <div class="drug-card ${selectedDrugId === d.id ? 'active' : ''}" data-id="${d.id}">
            <div class="potency-tag">${d.potency >= 100 ? (d.potency / 10).toFixed(1) : d.potency}% 含有</div>
            <h3>${d.name}</h3>
            <div class="text-[10px] text-gray-400 mt-auto">YJ: ${d.yjCode}</div>
        </div>
    `).join('');

    document.querySelectorAll('.drug-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedDrugId = card.dataset.id;
            document.getElementById('calc-main-area').classList.remove('hidden');
            document.getElementById('initial-guide').classList.add('hidden');
            renderDrugCards();
            updateCalculations();
        });
    });
}

function updateCalculations() {
    const weightInput = document.getElementById('body-weight');
    const piContainer = document.getElementById('pi-container');
    const resultArea = document.getElementById('result-area');

    const drug = PEDIATRIC_DRUGS.find(d => d.id === selectedDrugId);
    const weight = parseFloat(weightInput.value);

    if (!drug || isNaN(weight) || weight <= 0) {
        resultArea.innerHTML = '<p class="text-center text-gray-400 py-10">体重を正しく入力してください</p>';
        return;
    }

    // Update PI Display
    piContainer.innerHTML = `
        <div class="pi-card bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 mt-6">
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold text-amber-800 uppercase tracking-widest"><i class="fas fa-file-alt"></i> 添付文書 引用 (用法・用量)</span>
                <a href="${drug.piUrl}" target="_blank" class="text-xs text-blue-600 hover:underline">PMDAで開く <i class="fas fa-external-link-alt"></i></a>
            </div>
            <div class="text-sm text-gray-800 leading-relaxed italic mb-2">
                「${drug.piSnippet}」
            </div>
            <div class="text-[10px] text-gray-500 text-right">YJコード: ${drug.yjCode}</div>
        </div>
    `;

    // Calculate
    const minMg = weight * drug.dosage.minMgKg;
    const maxMg = weight * drug.dosage.maxMgKg;
    const absMaxMg = drug.dosage.absoluteMaxMgKg ? weight * drug.dosage.absoluteMaxMgKg : null;

    const minG = minMg / drug.potency;
    const maxG = maxMg / drug.potency;
    const absMaxG = absMaxMg ? absMaxMg / drug.potency : null;

    let resultHtml = '';

    if (drug.dosage.isByTime) {
        resultHtml = `
            <div class="space-y-4">
                <div class="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">推奨される 1回用量 (${drug.dosage.minMgKg}mg/kg)</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-5xl font-black">${minG.toFixed(2)}</span>
                        <span class="text-xl font-bold">g / 回</span>
                    </div>
                    <div class="text-sm opacity-80 mt-1">(${minMg.toFixed(1)} mg / 回)</div>
                    <div class="mt-4 text-sm font-bold bg-white/20 p-2 rounded text-center">※ この薬剤は「1回量基準」です</div>
                </div>
            </div>
        `;
    } else {
        const isRange = drug.dosage.minMgKg !== drug.dosage.maxMgKg;

        resultHtml = `
            <div class="grid grid-cols-1 gap-4">
                <div class="bg-indigo-700 text-white p-6 rounded-xl shadow-lg">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">通常用量 (1日総量: ${drug.dosage.minMgKg}${isRange ? '-' + drug.dosage.maxMgKg : ''}mg/kg)</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-5xl font-black">${minG.toFixed(2)}${isRange ? ' 〜 ' + maxG.toFixed(2) : ''}</span>
                        <span class="text-xl font-bold">g / 日</span>
                    </div>
                    <div class="text-sm opacity-80 mt-1">(${minMg.toFixed(1)} 〜 ${maxMg.toFixed(1)} mg / 日)</div>
                </div>
        `;

        if (absMaxMg) {
            resultHtml += `
                <div class="bg-rose-600 text-white p-6 rounded-xl shadow-lg">
                    <div class="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">最大用量 (1日総量: ${drug.dosage.absoluteMaxMgKg}mg/kg)</div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-5xl font-black">${absMaxG.toFixed(2)}</span>
                        <span class="text-xl font-bold">g / 日</span>
                    </div>
                    <div class="text-sm opacity-80 mt-1">(${absMaxMg.toFixed(1)} mg / 日)</div>
                </div>
            `;
        }

        resultHtml += `</div>`;
    }

    resultHtml += `
        <div class="mt-6 bg-white border-2 border-slate-100 p-5 rounded-xl">
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <i class="fas fa-info-circle"></i> 調剤・監査上の留意点
            </h4>
            <div class="text-sm text-slate-700 font-bold leading-relaxed">
                ${drug.dosage.note}
            </div>
        </div>
    `;

    resultArea.innerHTML = resultHtml;
}

document.addEventListener('DOMContentLoaded', () => {
    renderDrugCards();
    document.getElementById('body-weight').addEventListener('input', updateCalculations);
});
