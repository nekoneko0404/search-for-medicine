const DRUG_DATA = {
    amoxicillin_30: {
        name: "アモキシシリン",
        dosePerKg: 30,
        freq: 3,
        notes: "1日30-50mg/kgを3回に分けて服用。中耳炎などでは高用量が選ばれることがあります。",
        formulations: [
            { name: "サワシリン細粒10% (100mg/g)", ratio: 0.1 },
            { name: "パセトシン細粒10% (100mg/g)", ratio: 0.1 }
        ]
    },
    amoxicillin_40: {
        name: "アモキシシリン (中用量)",
        dosePerKg: 40,
        freq: 3,
        notes: "標準的な中耳炎の第1選択などで用いられる量です。",
        formulations: [
            { name: "サワシリン細粒10% (100mg/g)", ratio: 0.1 },
            { name: "パセトシン細粒10% (100mg/g)", ratio: 0.1 }
        ]
    },
    amoxicillin_50: {
        name: "アモキシシリン (高用量)",
        dosePerKg: 50,
        freq: 3,
        notes: "耐性菌が疑われる中耳炎などで用いられる上限に近い量です。",
        formulations: [
            { name: "サワシリン細粒10% (100mg/g)", ratio: 0.1 },
            { name: "パセトシン細粒10% (100mg/g)", ratio: 0.1 }
        ]
    },
    clarithromycin: {
        name: "クラリスロマイシン",
        dosePerKg: 10,
        freq: 2,
        notes: "通常1日10-15mg/kgを2回。1日最大400mg(力価)まで。",
        formulations: [
            { name: "クラリスドライシロップ10% (100mg/g)", ratio: 0.1 },
            { name: "クラリシッドドライシロップ10% (100mg/g)", ratio: 0.1 }
        ]
    },
    cefditoren: {
        name: "セフジトレンピボキシル",
        dosePerKg: 9,
        freq: 3,
        notes: "通常1日9-18mg/kgを3回。重症時は18mg/kgまで増量。",
        formulations: [
            { name: "メイアクトMS小児用細粒10% (100mg/g)", ratio: 0.1 }
        ]
    },
    azithromycin: {
        name: "アジスロマイシン",
        dosePerKg: 10,
        freq: 1,
        notes: "1日1回10mg/kgを3日間のみ服用。3日間で7日間持続する薬です。",
        formulations: [
            { name: "ジスロマック小児用細粒10% (100mg/g)", ratio: 0.1 }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const weightInput = document.getElementById('child-weight');
    const drugSelect = document.getElementById('drug-select');
    const formSelect = document.getElementById('formulation-select');
    const dailyDoseDisplay = document.getElementById('daily-dose-mg');
    const singleDoseDisplay = document.getElementById('single-dose-mg');
    const singleDoseFormDisplay = document.getElementById('single-dose-form');
    const drugMeta = document.getElementById('drug-meta');
    const calcNotes = document.getElementById('calc-notes');

    function populateFormulations() {
        const drugKey = drugSelect.value;
        const drug = DRUG_DATA[drugKey];
        formSelect.innerHTML = '';

        drug.formulations.forEach((f, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = f.name;
            formSelect.appendChild(option);
        });

        drugMeta.textContent = `1日${drug.freq}回服用 (${drug.dosePerKg}mg/kg/日)`;
        calcNotes.textContent = drug.notes;
    }

    function calculate() {
        const weight = parseFloat(weightInput.value) || 0;
        const drugKey = drugSelect.value;
        const drug = DRUG_DATA[drugKey];
        const formulationIndex = parseInt(formSelect.value) || 0;
        const formulation = drug.formulations[formulationIndex];

        if (!formulation) return;

        // Daily Dose (mg)
        const dailyDoseMg = weight * drug.dosePerKg;

        // Single Dose (mg)
        const singleDoseMg = dailyDoseMg / drug.freq;

        // Single Dose (g or mL)
        // ratio is mg/g or mg/mL factor. e.g., 10% = 100mg/g. 
        // formulation.ratio is 0.1 (fraction).
        // 1g contains 100mg. 
        // to get g: mg / (ratio * 1000)
        const singleDoseForm = singleDoseMg / (formulation.ratio * 1000);

        // Update UI
        dailyDoseDisplay.innerHTML = `${dailyDoseMg.toFixed(1)}<span class="dose-unit">mg/日</span>`;
        singleDoseDisplay.innerHTML = `${singleDoseMg.toFixed(2)}<span class="dose-unit">mg</span>`;

        // Unit check (often g for particles, mL for liquids)
        const unit = formulation.name.includes('シロップ') && !formulation.name.includes('ドライ') ? 'mL' : 'g';
        singleDoseFormDisplay.textContent = `${singleDoseForm.toFixed(2)}${unit} / 回`;
    }

    weightInput.addEventListener('input', calculate);
    drugSelect.addEventListener('change', () => {
        populateFormulations();
        calculate();
    });
    formSelect.addEventListener('change', calculate);

    // Initial load
    populateFormulations();
    calculate();
});
