
// Phase 23: Modern UI & Multi-Drug Calculation Logic

// State
const state = {
    selectedDrugIds: new Set(),
    params: {
        age: '',
        weight: ''
    },
    // Drug-specific options (sub-option, disease, etc.)
    // Key: drugId, Value: { subOptionId: ..., diseaseId: ... }
    drugOptions: {}
};

// --- Storage ---
const STORAGE_KEY = 'kusuri_compass_calc_v2_state';

function saveState() {
    const data = {
        selected: Array.from(state.selectedDrugIds),
        params: state.params,
        options: state.drugOptions
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { console.error("Save failed", e); }
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
            if (wInput) wInput.value = state.params.weight;
            if (aInput) aInput.value = state.params.age;
        }
    } catch (e) {
        console.error("Load failed", e);
    }
}

// --- UI Rendering ---

let currentCategory = 'all';
let currentSearchQuery = '';

function renderCategoryTabs() {
    const container = document.getElementById('category-tabs');
    if (!container) return;

    const tabs = [
        { id: 'all', label: 'すべて' },
        ...Object.entries(DRUG_CATEGORIES).map(([Key, Label]) => ({ id: Key, label: Label }))
    ];

    container.innerHTML = tabs.map(tab => `
        <button class="cat-tab ${currentCategory === tab.id ? 'active' : ''}" data-cat="${tab.id}">
            ${tab.label}
        </button>
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
        return `
        <div class="drug-card ${isSelected ? 'selected' : ''}" data-id="${d.id}">
            <div class="indicator"><i class="fas fa-check"></i></div>
            <span class="tag">${DRUG_CATEGORIES[d.category] || 'その他'}</span>
            <h3>${d.name}</h3>
        </div>
        `;
    }).join('');

    container.querySelectorAll('.drug-card').forEach(card => {
        card.addEventListener('click', () => toggleDrug(card.dataset.id));
    });
}

function toggleDrug(id) {
    if (state.selectedDrugIds.has(id)) {
        state.selectedDrugIds.delete(id);
    } else {
        state.selectedDrugIds.add(id);
    }
    saveState();
    renderDrugList(); // update selection visual
    updatePrescriptionSheet();
}

// --- Calculation Logic ---

function calculateDrug(drug, age, weight) {
    // Basic validation
    if (!weight || weight <= 0) return { error: '体重を入力してください' };

    // Get options for this drug
    const opts = state.drugOptions[drug.id] || {};

    // Potency
    let potency = drug.potency; // mg/g or mg/tablet
    let unit = drug.unit || 'g'; // default g for powders

    // Check sub-options
    if (drug.hasSubOptions) {
        const subId = opts.subOptionId || (drug.subOptions[0] ? drug.subOptions[0].id : null);
        const sub = drug.subOptions.find(o => o.id === subId);
        if (sub) {
            potency = sub.potency;
            unit = sub.unit || unit; // override if needed
        }
    }

    // Check Disease
    const diseaseId = opts.diseaseId || (drug.diseases ? drug.diseases[0].id : null);
    let dosageConfig = drug.dosage;
    let diseaseLabel = '';

    if (drug.diseases && diseaseId) {
        const dis = drug.diseases.find(d => d.id === diseaseId);
        if (dis) {
            dosageConfig = dis.dosage; // Override dosage config
            diseaseLabel = dis.label;
        }
    }

    // Calc Logic
    // 1. Determine mg/day or mg/time
    let mgPerDay = 0;
    let method = '';

    if (drug.calcType === 'fixed-age' && drug.fixedDoses) {
        // Fixed dose based on age
        if (!age && age !== 0) return { error: '年齢が必要です' };
        const fixed = drug.fixedDoses.find(f => age >= f.ageMin && age < f.ageMax);
        if (fixed) {
            return {
                result: `${fixed.label}`,
                detail: fixed.dose + (fixed.unit || ''),
                isFixed: true
            };
        } else {
            return { error: '該当年齢の用量設定なし' };
        }
    }
    else if (drug.calcType === 'weight-step' && drug.weightSteps) {
        const step = drug.weightSteps.find(s => weight >= s.weightMin && weight < s.weightMax);
        if (step) {
            return {
                result: step.label,
                detail: step.dose + (step.unit || ''),
                isFixed: true
            };
        } else {
            // Check max (assumed adult/large child)
            const last = drug.weightSteps[drug.weightSteps.length - 1];
            if (weight >= last.weightMax) {
                return { result: last.label, detail: last.dose + (last.unit || ''), isFixed: true };
            }
            return { error: '該当体重の用量設定なし' };
        }
    }

    // Standard mg/kg calc
    let minMg = 0, maxMg = 0;

    if (dosageConfig.isByTime) {
        // mg/kg/time * times
        const doseTime = dosageConfig.timeMgKg || 0;
        const times = dosageConfig.timesPerDay || 3;
        const total = doseTime * times * weight;

        // Limits
        let dailyMax = dosageConfig.absoluteMaxMgPerDay;
        // Check per time limit
        if (dosageConfig.absoluteMaxMgPerTime) {
            const timeMax = dosageConfig.absoluteMaxMgPerTime;
            if (doseTime * weight > timeMax) {
                // Cap at per time max
                // Actually we should display standard range
            }
        }

        mgPerDay = total;
        method = `${doseTime}mg/kg/回 × ${times}回`;
    } else {
        // mg/kg/day standard
        const minK = dosageConfig.minMgKg || 0;
        const maxK = dosageConfig.maxMgKg || 0;
        minMg = minK * weight;
        maxMg = maxK * weight;
        method = `${minK}〜${maxK}mg/kg/日`;
    }

    // Apply absolute max (Adult dose caps)
    if (dosageConfig.absoluteMaxMgPerDay) {
        if (minMg > dosageConfig.absoluteMaxMgPerDay) minMg = dosageConfig.absoluteMaxMgPerDay;
        if (maxMg > dosageConfig.absoluteMaxMgPerDay) maxMg = dosageConfig.absoluteMaxMgPerDay;
        if (mgPerDay > dosageConfig.absoluteMaxMgPerDay) mgPerDay = dosageConfig.absoluteMaxMgPerDay;
    }

    // Convert to product amount (g or mL or tablets)
    // potency is mg per unit (e.g. 100mg/g -> potency 100)

    if (dosageConfig.isByTime) {
        // Fixed per time logic usually implies single point? 
        // Or do we have range for per-time? 
        // Simplification: We usually have single value for isByTime in our data
        // except Valtrex has simple timeMgKg.

        let productTotal = mgPerDay / potency; // Total product per day
        let productPerTime = productTotal / dosageConfig.timesPerDay;

        // Rounding (2 decimals)
        productTotal = Math.round(productTotal * 100) / 100;
        productPerTime = Math.round(productPerTime * 100) / 100;

        return {
            total: productTotal, // g/day
            perTime: productPerTime, // g/time
            times: dosageConfig.timesPerDay,
            unit: unit,
            disease: diseaseLabel,
            note: dosageConfig.note
        };

    } else {
        // Range Logic
        let minProd = minMg / potency;
        let maxProd = maxMg / potency;

        // Rounding
        minProd = Math.round(minProd * 100) / 100;
        maxProd = Math.round(maxProd * 100) / 100;

        let times = dosageConfig.timesPerDay || 3;

        let minPerTime = Math.round((minProd / times) * 100) / 100;
        let maxPerTime = Math.round((maxProd / times) * 100) / 100;

        return {
            totalRange: `${minProd}〜${maxProd}`,
            perTimeRange: `${minPerTime}〜${maxPerTime}`,
            times: times,
            unit: unit,
            disease: diseaseLabel,
            note: dosageConfig.note
        };
    }
}

// --- Prescription Sheet UI ---

function updatePrescriptionSheet() {
    const sheet = document.getElementById('prescription-sheet');
    const content = document.getElementById('sheet-content');
    const fab = document.getElementById('fab');
    const fabBadge = document.getElementById('fab-badge');

    if (state.selectedDrugIds.size === 0) {
        sheet.classList.remove('active');
        document.getElementById('sheet-overlay').classList.remove('active');
        fab.classList.add('hidden');
        // Reset inputs if needed? No, keep input.
        return;
    } else {
        fab.classList.remove('hidden');
        fabBadge.textContent = state.selectedDrugIds.size;
    }

    // Render Items
    const age = parseFloat(state.params.age);
    const weight = parseFloat(state.params.weight);

    const itemsHtml = Array.from(state.selectedDrugIds).map(id => {
        const drug = PEDIATRIC_DRUGS.find(d => d.id === id);
        if (!drug) return '';

        const calc = calculateDrug(drug, age, weight);
        let resultHtml = '';

        if (calc.error) {
            resultHtml = `<div style="color:#ef4444; font-weight:bold;"><i class="fas fa-exclamation-circle"></i> ${calc.error}</div>`;
        } else if (calc.isFixed) {
            resultHtml = `<div><strong>${calc.result}</strong>: ${calc.detail}</div>`;
        } else if (calc.totalRange) {
            resultHtml = `
                <div style="font-size:1rem; font-weight:bold; color:#4f46e5;">
                    1回 ${calc.perTimeRange} ${calc.unit}
                </div>
                <div style="font-size:0.8rem; color:#64748b;">
                    (1日 ${calc.totalRange} ${calc.unit} / 分${calc.times})
                </div>
            `;
        } else {
            resultHtml = `
                <div style="font-size:1rem; font-weight:bold; color:#4f46e5;">
                    1回 ${calc.perTime} ${calc.unit}
                </div>
                <div style="font-size:0.8rem; color:#64748b;">
                    (1日 ${calc.total} ${calc.unit} / 分${calc.times})
                </div>
            `;
        }

        // Sub Options / Disease Selectors if needed
        // For simplicity in Phase 23, we default to first option but show label.
        // Advanced: Add dropdowns here to update state.drugOptions

        return `
        <div class="rx-item">
            <div class="rx-header">
                <div class="rx-title">${drug.name}</div>
                <div class="rx-remove" onclick="removeDrug('${drug.id}')"><i class="fas fa-trash"></i></div>
            </div>
            ${calc.disease ? `<div style="font-size:0.7rem; color:#f59e0b; margin-bottom:0.2rem;">${calc.disease}</div>` : ''}
            <div class="rx-result">
                ${resultHtml}
            </div>
            <div style="font-size:0.6rem; color:#94a3b8; margin-top:0.2rem;">${calc.note || ''}</div>
        </div>
        `;
    }).join('');

    content.innerHTML = itemsHtml.length ? itemsHtml : '<div class="empty-state">エラー</div>';

    // Re-attach listeners for remove
    // Note: onclick inline above is simpler but requires global scope. 
    // We should bind via JS.
    content.querySelectorAll('.rx-remove').forEach(btn => {
        // Logic handled by onclick in string for now, need valid export or global
    });
}

// Global scope expose for inline handlers
window.removeDrug = (id) => toggleDrug(id);

// --- Sheet Toggle ---

const sheet = document.getElementById('prescription-sheet');
const overlay = document.getElementById('sheet-overlay');
const closeBtn = document.getElementById('close-sheet');
const fab = document.getElementById('fab');

function openSheet() {
    sheet.classList.add('active');
    overlay.classList.add('active');
}

function closeSheet() {
    // Only close on mobile (if not PC layout)
    if (window.innerWidth < 1024) {
        sheet.classList.remove('active');
        overlay.classList.remove('active');
    }
}

if (fab) fab.addEventListener('click', openSheet);
if (closeBtn) closeBtn.addEventListener('click', closeSheet);
if (overlay) overlay.addEventListener('click', closeSheet);


// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    // Search
    document.getElementById('drug-search').addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        renderDrugList();
    });

    // Params
    const wInput = document.getElementById('weight-input');
    const aInput = document.getElementById('age-input');

    const updateParams = () => {
        state.params.weight = wInput.value;
        state.params.age = aInput.value;
        saveState();
        updatePrescriptionSheet(); // Realtime update
    };

    wInput.addEventListener('input', updateParams);
    aInput.addEventListener('input', updateParams);

    loadState();
    renderCategoryTabs();
    renderDrugList();
    updatePrescriptionSheet();

    // PC: Always open sheet if items exist? 
    // In CSS, sheet is sticky on PC.
});
