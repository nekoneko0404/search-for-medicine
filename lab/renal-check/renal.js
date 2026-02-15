const DRUG_ADJUSTMENT_DATA = [
    {
        name: "ファモチジン (ガスター等)",
        thresholds: [
            { limit: 50, advice: "1回10mgを1日2回、または1回20mgを1日1回に減量を検討。" },
            { limit: 10, advice: "1回10mgを2〜3日に1回、または5mgを1日1回に減量を検討。" }
        ]
    },
    {
        name: "ロキソプロフェン (ロキソニン等)",
        thresholds: [
            { limit: 60, advice: "長期投与は避け、必要最小限の期間に留める。" },
            { limit: 30, advice: "禁忌または原則禁忌。高度な腎機能障害では副作用が出やすいため避ける。" }
        ]
    },
    {
        name: "シタグリプチン (ジャヌビア等)",
        thresholds: [
            { limit: 45, advice: "1日25mg（通常量の半分）に減量。" },
            { limit: 30, advice: "1日12.5mgに減量を検討。" }
        ]
    },
    {
        name: "ガレノキサシン (ジェニナック)",
        thresholds: [
            { limit: 30, advice: "1日200mg（通常400mg）に減量。" }
        ]
    },
    {
        name: "レボフロキサシン (クラビット)",
        thresholds: [
            { limit: 50, advice: "初回500mg、その後250mgを24時間ごと。" },
            { limit: 20, advice: "初回500mg、その後250mgを48時間ごと。" }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const ageInput = document.getElementById('age');
    const scrInput = document.getElementById('scr');
    const sexInputs = document.getElementsByName('sex');
    const egfrResult = document.getElementById('egfr-result');
    const stageBadge = document.getElementById('stage-badge');
    const drugGuidance = document.getElementById('drug-guidance');

    function getStageInfo(egfr) {
        if (egfr >= 90) return { label: "Stage G1 (正常)", class: "stage-g1" };
        if (egfr >= 60) return { label: "Stage G2 (軽度低下)", class: "stage-g2" };
        if (egfr >= 45) return { label: "Stage G3a (軽〜中度低下)", class: "stage-g3a" };
        if (egfr >= 30) return { label: "Stage G3b (中〜高度低下)", class: "stage-g3b" };
        if (egfr >= 15) return { label: "Stage G4 (高度低下)", class: "stage-g4" };
        return { label: "Stage G5 (末期腎不全)", class: "stage-g5" };
    }

    function calculate() {
        const age = parseInt(ageInput.value) || 0;
        const scr = parseFloat(scrInput.value) || 0;
        let isFemale = false;
        for (const input of sexInputs) {
            if (input.checked && input.value === 'female') isFemale = true;
        }

        if (age < 18 || scr <= 0) {
            egfrResult.textContent = "--";
            stageBadge.textContent = "対象外 (18歳以上/Cr入力)";
            stageBadge.className = "stage-badge stage-g1";
            drugGuidance.innerHTML = "";
            return;
        }

        // Japanese eGFR formula
        // 194 * Cr^-1.094 * Age^-0.287 (* 0.739 if female)
        let egfr = 194 * Math.pow(scr, -1.094) * Math.pow(age, -0.287);
        if (isFemale) egfr *= 0.739;

        const roundedEgfr = Math.round(egfr * 10) / 10;
        egfrResult.textContent = roundedEgfr;

        const stage = getStageInfo(roundedEgfr);
        stageBadge.textContent = stage.label;
        stageBadge.className = `stage-badge ${stage.class}`;

        // Populate Drug Guidance
        drugGuidance.innerHTML = "";
        DRUG_ADJUSTMENT_DATA.forEach(drug => {
            // Find applicable threshold (priority low limit)
            const applicable = drug.thresholds
                .filter(t => roundedEgfr < t.limit)
                .sort((a, b) => a.limit - b.limit)[0];

            if (applicable) {
                const card = document.createElement('div');
                card.className = "guidance-card";
                card.innerHTML = `
                    <div class="drug-name">
                        <span>${drug.name}</span>
                        <span class="warning-tag">eGFR < ${applicable.limit}</span>
                    </div>
                    <div class="text-xs text-gray-600">${applicable.advice}</div>
                `;
                drugGuidance.appendChild(card);
            }
        });

        if (drugGuidance.innerHTML === "") {
            drugGuidance.innerHTML = '<p class="text-xs text-center py-4 text-gray-400">特記すべき調整（このリスト内の薬剤）はありません</p>';
        }
    }

    ageInput.addEventListener('input', calculate);
    scrInput.addEventListener('input', calculate);
    sexInputs.forEach(radio => radio.addEventListener('change', calculate));

    // Initial calc
    calculate();
});
