
// Phase 24: Enhanced Logic & Details

// State
const state = {
    selectedDrugIds: new Set(),
    params: {
        ageYear: '',
        ageMonth: '',
        weight: ''
    },
    // Drug-specific options (sub-option, disease, etc.)
    drugOptions: {}
};

const STORAGE_KEY = 'kusuri_compass_calc_v24_state';

// --- Standard Weight Data (Simplified from MHLW/JPS) ---
// 50th percentile (Boy/Girl average approx)
const STANDARD_WEIGHTS = [
    { age: 0, month: 0, w: 3.0 },
    { age: 0, month: 1, w: 4.2 },
    { age: 0, month: 2, w: 5.3 },
    { age: 0, month: 3, w: 6.2 },
    { age: 0, month: 4, w: 6.9 },
    { age: 0, month: 5, w: 7.5 },
    { age: 0, month: 6, w: 7.9 },
    { age: 0, month: 7, w: 8.3 },
    { age: 0, month: 8, w: 8.6 },
    { age: 0, month: 9, w: 8.9 },
    { age: 0, month: 10, w: 9.2 },
    { age: 0, month: 11, w: 9.4 },
    { age: 1, month: 0, w: 9.6 },
    { age: 1, month: 6, w: 10.7 },
    { age: 2, month: 0, w: 12.0 },
    { age: 3, month: 0, w: 14.0 },
    { age: 4, month: 0, w: 16.0 },
    { age: 5, month: 0, w: 18.5 },
    { age: 6, month: 0, w: 21.0 },
    { age: 7, month: 0, w: 24.0 },
    { age: 8, month: 0, w: 27.0 },
    { age: 9, month: 0, w: 30.5 },
    { age: 10, month: 0, w: 34.0 },
    { age: 11, month: 0, w: 38.0 },
    { age: 12, month: 0, w: 43.0 },
    { age: 13, month: 0, w: 49.0 },
    { age: 14, month: 0, w: 54.0 },
    { age: 15, month: 0, w: 58.0 } // Approx adult transition
];

function getStandardWeight(years, months) {
    const y = parseInt(years) || 0;
    const m = parseInt(months) || 0;

    // Exact match
    const exact = STANDARD_WEIGHTS.find(d => d.age === y && d.month === m);
    if (exact) return exact.w;

    // Closest below
    const sorted = [...STANDARD_WEIGHTS].sort((a, b) => (a.age * 12 + a.month) - (b.age * 12 + b.month));
    const targetMonths = y * 12 + m;

    let closest = sorted[0];
    for (let d of sorted) {
        if (d.age * 12 + d.month <= targetMonths) {
            closest = d;
        } else {
            break;
        }
    }

    // Linear interpolation could be better, but step is fine for now
    return closest.w;
}

// --- Storage ---
function saveState() {
    const data = {
        selected: Array.from(state.selectedDrugIds),
        params: state.params,
        options: state.drugOptions
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { }
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            if (data.selected) state.selectedDrugIds = new Set(data.selected);
            if (data.params) state.params = data.params;
            if (data.options) state.drugOptions = data.options;

            // Restore inputs
            const wInput = document.getElementById('weight-input');
            const aInput = document.getElementById('age-input');
            const mInput = document.getElementById('month-input');
            if (wInput) wInput.value = state.params.weight;
            if (aInput) aInput.value = state.params.ageYear;
            if (mInput) mInput.value = state.params.ageMonth;
        }
    } catch (e) { }
}

// --- UI Rendering ---

let currentCategory = 'all';
let currentSearchQuery = '';

function renderCategoryTabs() {
    const container = document.getElementById('category-tabs');
    if (!container) return;
    const tabs = [{ id: 'all', label: 'すべて' }, ...Object.entries(DRUG_CATEGORIES).map(([Key, Label]) => ({ id: Key, label: Label }))];
    container.innerHTML = tabs.map(tab => `
        <button class="cat-tab ${currentCategory === tab.id ? 'active' : ''}" data-cat="${tab.id}">${tab.label}</button>
    `).join('');
    container.querySelectorAll('.cat-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.cat;
            renderCategoryTabs();
            renderDrugList();
        });
    });
}

function getFilteredDrugs() {
    const query = currentSearchQuery.toLowerCase();
    return PEDIATRIC_DRUGS.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(query) || d.yjCode.toLowerCase().includes(query);
        const matchesCategory = currentCategory === 'all' || d.category === currentCategory;
        return matchesSearch && matchesCategory;
    });
}

function renderDrugList() {
    const container = document.getElementById('drug-grid');
    if (!container) return;
    const filtered = getFilteredDrugs();
    if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#94a3b8; padding:2rem;">該当なし</div>';
        return;
    }
    container.innerHTML = filtered.map(d => {
        const isSelected = state.selectedDrugIds.has(d.id);
        const potLabel = d.potency ? (d.unit === 'g' ? `${d.potency}mg/g` : `${d.potency}mg`) : '';
        // Check active sub-option for label? For list view, keep simple.
        return `
        <div class="drug-card ${isSelected ? 'selected' : ''}" data-id="${d.id}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <span class="tag">${DRUG_CATEGORIES[d.category]}</span>
                <div class="indicator"><i class="fas fa-check"></i></div>
            </div>
            <div>
                <h3>${d.name}</h3>
                <div style="font-size:0.75rem; color:#64748b; margin-top:0.25rem;">${potLabel}</div>
            </div>
        </div>`;
    }).join('');
    container.querySelectorAll('.drug-card').forEach(card => card.addEventListener('click', () => toggleDrug(card.dataset.id)));
}

function toggleDrug(id) {
    if (state.selectedDrugIds.has(id)) state.selectedDrugIds.delete(id);
    else state.selectedDrugIds.add(id);
    saveState();
    renderDrugList();
    updatePrescriptionSheet();
}

// --- Calculation Logic ---

function calculateDrug(drug, years, months, weight) {
    if (!weight || weight <= 0) return { error: '体重を入力してください' };

    // Effective Age
    const age = (parseInt(years) || 0) + (parseInt(months) || 0) / 12.0;

    // Options
    if (!state.drugOptions[drug.id]) state.drugOptions[drug.id] = {};
    const opts = state.drugOptions[drug.id];

    // Determine config based on selection
    let potency = drug.potency;
    let unit = drug.unit || 'g';
    let subOptionLabel = '';

    if (drug.hasSubOptions) {
        // Default to first if not set
        if (!opts.subOptionId && drug.subOptions.length > 0) opts.subOptionId = drug.subOptions[0].id;
        const sub = drug.subOptions.find(o => o.id === opts.subOptionId);
        if (sub) {
            potency = sub.potency;
            unit = sub.unit || unit;
            subOptionLabel = sub.label;
            // Also sub might override dosage? Usually potency only.
            // But Tamiflu has dosage override in subOptions!
            if (sub.dosage) {
                // If sub-option has specific dosage (Tamiflu case), it takes precedence?
                // Wait, Tamiflu logic is unique. 
            }
        }
    }

    let dosageConfig = drug.dosage;
    let diseaseLabel = '';

    // Disease Selection
    if (drug.diseases) {
        if (!opts.diseaseId && drug.diseases.length > 0) opts.diseaseId = drug.diseases[0].id;
        const dis = drug.diseases.find(d => d.id === opts.diseaseId);
        if (dis) {
            dosageConfig = dis.dosage;
            diseaseLabel = dis.label;
        }
    }

    // Tamiflu Special Handling (SubOptions are actually Age/Type categories)
    // Actually Tamiflu subOptions in data currently is: over1y, under1y.
    // This should probably be Auto-selected by age, OR user selected?
    // User requested "Diseases selection", but Tamiflu is "Age category".
    // Let's treat it as subOption selection for now.

    // If suboption has dosage, use it (Tamiflu)
    if (drug.hasSubOptions) {
        const sub = drug.subOptions.find(o => o.id === opts.subOptionId);
        if (sub && sub.dosage) {
            dosageConfig = sub.dosage;
        }
    }

    // Logic
    if (drug.calcType === 'fixed-age' && drug.fixedDoses) {
        const fixed = drug.fixedDoses.find(f => age >= f.ageMin && age < f.ageMax);
        if (fixed) return { result: fixed.label, detail: fixed.dose + (fixed.unit || ''), isFixed: true, note: dosageConfig.note };
        return { error: '該当年齢の用量設定なし' };
    }
    else if (drug.calcType === 'weight-step' && drug.weightSteps) {
        // Find step
        let step = drug.weightSteps.find(s => weight >= s.weightMin && weight < s.weightMax);
        if (!step) {
            const last = drug.weightSteps[drug.weightSteps.length - 1];
            if (weight >= last.weightMax) step = last;
        }
        if (step) return { result: step.label, detail: step.dose + (step.unit || ''), isFixed: true, note: dosageConfig.note };
        return { error: '該当体重の用量設定なし' };
    }

    // mg/kg Calc
    let minMg = 0, maxMg = 0, mgPerDay = 0;

    if (dosageConfig.isByTime) {
        const timeMg = dosageConfig.timeMgKg || 0;
        const times = dosageConfig.timesPerDay || 3;
        mgPerDay = timeMg * times * weight;

        // Apply Time Max
        if (dosageConfig.absoluteMaxMgPerTime) {
            if (mgPerDay / times > dosageConfig.absoluteMaxMgPerTime) {
                mgPerDay = dosageConfig.absoluteMaxMgPerTime * times;
            }
        }
    } else {
        minMg = (dosageConfig.minMgKg || 0) * weight;
        maxMg = (dosageConfig.maxMgKg || 0) * weight;
    }

    // Apply Day Max
    if (dosageConfig.absoluteMaxMgPerDay) {
        if (minMg > dosageConfig.absoluteMaxMgPerDay) minMg = dosageConfig.absoluteMaxMgPerDay;
        if (maxMg > dosageConfig.absoluteMaxMgPerDay) maxMg = dosageConfig.absoluteMaxMgPerDay;
        if (mgPerDay > dosageConfig.absoluteMaxMgPerDay) mgPerDay = dosageConfig.absoluteMaxMgPerDay;
    }

    // Create Result Object
    const times = dosageConfig.timesPerDay || 3;

    if (dosageConfig.isByTime) {
        let totalProd = mgPerDay / potency;
        let perTimeProd = totalProd / times;

        // Rounding (2 decimals)
        totalProd = Math.round(totalProd * 100) / 100;
        perTimeProd = Math.round(perTimeProd * 100) / 100;

        return {
            total: totalProd,
            perTime: perTimeProd,
            times: times,
            unit: unit,
            disease: diseaseLabel,
            subOption: subOptionLabel,
            note: dosageConfig.note,
            piUrl: drug.piUrl,
            piSnippet: drug.piSnippet
        };
    } else {
        let minProd = Math.round((minMg / potency) * 100) / 100;
        let maxProd = Math.round((maxMg / potency) * 100) / 100;

        let minPerTime = Math.round((minProd / times) * 100) / 100;
        let maxPerTime = Math.round((maxProd / times) * 100) / 100;

        return {
            totalRange: `${minProd}〜${maxProd}`,
            perTimeRange: `${minPerTime}〜${maxPerTime}`,
            times: times,
            unit: unit,
            disease: diseaseLabel,
            subOption: subOptionLabel,
            note: dosageConfig.note,
            piUrl: drug.piUrl,
            piSnippet: drug.piSnippet
        };
    }
}

// --- Prescription Sheet UI Detailed ---

function updatePrescriptionSheet() {
    const sheet = document.getElementById('prescription-sheet');
    const content = document.getElementById('sheet-content');
    const fab = document.getElementById('fab');
    const fabBadge = document.getElementById('fab-badge');

    if (state.selectedDrugIds.size === 0) {
        sheet.classList.remove('active');
        document.getElementById('sheet-overlay').classList.remove('active');
        fab.classList.add('hidden');
        return;
    }

    fab.classList.remove('hidden');

    // Count ONLY valid selected drugs (some might be stale ids)
    const validCount = Array.from(state.selectedDrugIds).filter(id => PEDIATRIC_DRUGS.find(d => d.id === id)).length;
    fabBadge.textContent = validCount;


    const y = state.params.ageYear;
    const m = state.params.ageMonth;
    const w = parseFloat(state.params.weight);

    const itemsHtml = Array.from(state.selectedDrugIds).map(id => {
        const drug = PEDIATRIC_DRUGS.find(d => d.id === id);
        if (!drug) return '';

        // Ensure options object exists
        if (!state.drugOptions[id]) state.drugOptions[id] = {};
        const opts = state.drugOptions[id];

        const calc = calculateDrug(drug, y, m, w);

        // Helpers for Selectors
        let selectorsHtml = '';

        // SubOption Selector
        if (drug.hasSubOptions) {
            const options = drug.subOptions.map(o =>
                `<option value="${o.id}" ${opts.subOptionId === o.id ? 'selected' : ''}>${o.label}</option>`
            ).join('');
            selectorsHtml += `
                <select class="rx-select" onchange="updateDrugOption('${id}', 'subOptionId', this.value)">
                    ${options}
                </select>
            `;
        }

        // Disease Selector
        if (drug.diseases) {
            const options = drug.diseases.map(d =>
                `<option value="${d.id}" ${opts.diseaseId === d.id ? 'selected' : ''}>${d.label}</option>`
            ).join('');
            selectorsHtml += `
                <select class="rx-select" onchange="updateDrugOption('${id}', 'diseaseId', this.value)">
                    ${options}
                </select>
            `;
        }

        // Result Display
        let resultMain = '';
        if (calc.error) {
            resultMain = `<div style="color:#ef4444; font-weight:bold;"><i class="fas fa-exclamation-triangle"></i> ${calc.error}</div>`;
        } else if (calc.isFixed) {
            resultMain = `
                <div class="result-row">
                    <span class="result-label">固定用量</span>
                    <span class="result-val">${calc.detail}</span>
                </div>`;
        } else if (calc.totalRange) {
            resultMain = `
                <div class="result-row">
                    <span class="result-label">1回量</span>
                    <span class="result-val">${calc.perTimeRange} ${calc.unit}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">1日量</span>
                    <span class="result-sub">${calc.totalRange} ${calc.unit} / 分${calc.times}</span>
                </div>`;
        } else {
            resultMain = `
                <div class="result-row">
                    <span class="result-label">1回量</span>
                    <span class="result-val">${calc.perTime} ${calc.unit}</span>
                </div>
                <div class="result-row">
                    <span class="result-label">1日量</span>
                    <span class="result-sub">${calc.total} ${calc.unit} / 分${calc.times}</span>
                </div>`;
        }

        return `
        <div class="rx-item">
            <div class="rx-header">
                <div class="rx-title">${drug.name}</div>
                <div class="rx-remove" onclick="removeDrug('${drug.id}')"><i class="fas fa-trash-alt"></i></div>
            </div>
            
            <div class="rx-config">
                ${selectorsHtml}
            </div>

            <div class="rx-result-box">
                ${resultMain}
            </div>

            <div class="rx-meta">
                <div>${calc.note || ''}</div>
                ${drug.piUrl ? `<a href="${drug.piUrl}" target="_blank" class="pmda-link"><i class="fas fa-file-pdf"></i> PMDA</a>` : ''}
            </div>
            
            ${calc.piSnippet ? `<details style="margin-top:0.5rem; font-size:0.7rem; color:#64748b; cursor:pointer;"><summary>添付文書(抜粋)</summary><div style="padding:4px; background:#f8fafc; border-radius:4px; margin-top:4px;">${calc.piSnippet}</div></details>` : ''}
        </div>
        `;
    }).join('');

    content.innerHTML = itemsHtml.length ? itemsHtml : '<div style="text-align:center; padding:2rem;">選択してください</div>';
}

window.updateDrugOption = (drugId, key, value) => {
    if (!state.drugOptions[drugId]) state.drugOptions[drugId] = {};
    state.drugOptions[drugId][key] = value;
    saveState();
    updatePrescriptionSheet();
}

window.removeDrug = (id) => toggleDrug(id);

// --- Event Handlers ---

document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const ageInput = document.getElementById('age-input');
    const monthInput = document.getElementById('month-input');
    const weightInput = document.getElementById('weight-input');
    const autoWeightBtn = document.getElementById('auto-weight-btn');

    const updateParams = () => {
        state.params.ageYear = ageInput.value;
        state.params.ageMonth = monthInput.value;
        state.params.weight = weightInput.value;
        saveState();
        updatePrescriptionSheet();
    };

    ageInput.addEventListener('input', updateParams);
    monthInput.addEventListener('input', updateParams);
    weightInput.addEventListener('input', updateParams);

    // Auto Weight
    autoWeightBtn.addEventListener('click', () => {
        const w = getStandardWeight(ageInput.value, monthInput.value);
        weightInput.value = w;
        updateParams();
        // Visual feedback
        autoWeightBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => autoWeightBtn.innerHTML = '<i class="fas fa-magic"></i>', 1000);
    });

    // Search
    document.getElementById('drug-search').addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderDrugList();
    });

    // Sheet toggle
    const sheet = document.getElementById('prescription-sheet');
    const overlay = document.getElementById('sheet-overlay');
    const closeBtn = document.getElementById('close-sheet');
    const fab = document.getElementById('fab');

    const toggleSheet = (show) => {
        if (show) { sheet.classList.add('active'); overlay.classList.add('active'); }
        else { sheet.classList.remove('active'); overlay.classList.remove('active'); }
    };

    fab.addEventListener('click', () => toggleSheet(true));
    closeBtn.addEventListener('click', () => toggleSheet(false));
    overlay.addEventListener('click', () => toggleSheet(false));

    // Initial Load
    loadState();
    renderCategoryTabs();
    renderDrugList();
    updatePrescriptionSheet();
});
