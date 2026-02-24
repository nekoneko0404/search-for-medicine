
import { DRUG_CATEGORIES, YJ_CATEGORY_MAP, PEDIATRIC_DRUGS, getPharmaClass } from './data.js';
import { calculateDrug, getStandardWeight } from './logic.js';
import { state, saveState, loadState, subscribe } from './state.js';
import DOSAGE_DATA from './data/dosage_details.js';

let currentCategory = 'all';
let currentSearchQuery = '';

window.state = state;
window.saveState = saveState;
window.loadState = loadState;
window.calculateDrug = calculateDrug;

window.showNotification = (message) => {
    // Deprecated: old orange notification banner removed.
};

export function initUsageGuide() {
    const banner = document.getElementById('usage-guide-banner');
    const closeBtn = document.getElementById('usage-guide-close');
    const neverShowCheck = document.getElementById('usage-guide-never-show-check');
    const showBtn = document.getElementById('show-usage-btn');

    if (!banner || !closeBtn || !neverShowCheck || !showBtn) return;

    if (!localStorage.getItem('pedCalcUsageGuideHidden')) {
        setTimeout(() => {
            banner.style.opacity = '1';
            banner.style.pointerEvents = 'auto';
        }, 1000);
    }

    if (showBtn) {
        showBtn.addEventListener('click', () => {
            banner.style.opacity = '1';
            banner.style.pointerEvents = 'auto';
        });
    }

    closeBtn.addEventListener('click', () => {
        banner.style.opacity = '0';
        banner.style.pointerEvents = 'none';
        if (neverShowCheck.checked) {
            localStorage.setItem('pedCalcUsageGuideHidden', 'true');
        }
    });

    neverShowCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            localStorage.setItem('pedCalcUsageGuideHidden', 'true');
        } else {
            localStorage.removeItem('pedCalcUsageGuideHidden');
        }
    });
}

export function setSearchQuery(q) {
    currentSearchQuery = q;
    renderDrugList();
}

export function setCategory(cat) {
    currentCategory = cat;
    renderCategoryTabs();
    renderDrugList();
}

export function updatePrescriptionSheet() {
    const sheet = document.getElementById('prescription-sheet');
    const content = document.getElementById('sheet-content');
    const closeBtn = document.getElementById('close-sheet');

    if (!content || !closeBtn) return;

    // Update Close Button to Delete
    closeBtn.onclick = window.clearAllDrugs;
    closeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    closeBtn.style.color = '#ef4444';

    const emptyHtml = `
        <div class="empty-rx-container">
            <i class="fas fa-hand-pointer empty-rx-icon"></i>
            <p>薬剤を選択してください</p>
        </div>`;

    if (state.selectedDrugIds.length === 0) {
        content.innerHTML = emptyHtml;
        return;
    }

    const y = state.params.ageYear;
    const m = state.params.ageMonth;
    const w = parseInt(state.params.weight) || 0;

    const itemsHtml = state.selectedDrugIds.map(id => {
        const drug = PEDIATRIC_DRUGS.find(d => d.id === id);
        if (!drug) return '';

        if (!state.drugOptions[id]) state.drugOptions[id] = {};
        const opts = state.drugOptions[id];

        const calc = calculateDrug(drug, y, m, w);

        // Selectors
        let selectorsHtml = '';
        if (drug.hasSubOptions) {
            const options = drug.subOptions.map(o =>
                `<option value="${o.id}" ${opts.subOptionId === o.id ? 'selected' : ''}>${o.label}</option>`
            ).join('');
            selectorsHtml += `<select class="rx-select" onchange="updateDrugOption('${id}', 'subOptionId', this.value)">${options}</select>`;
        }
        if (drug.diseases) {
            const options = drug.diseases.map(d =>
                `<option value="${d.id}" ${opts.diseaseId === d.id ? 'selected' : ''}>${d.label}</option>`
            ).join('');
            selectorsHtml += `<select class="rx-select" onchange="updateDrugOption('${id}', 'diseaseId', this.value)">${options}</select>`;
        }

        let resultMain = '';
        if (calc.error) {
            resultMain = `<div style="color:#ef4444; font-weight:bold;"><i class="fas fa-exclamation-triangle"></i> ${calc.error}</div>`;
        } else if (calc.isFixed && !calc.totalRange) {
            const label = calc.isSingleDose ? '単回投与' : '固定用量';
            resultMain = `
                <div class="result-row">
                    <span class="result-label">${label}</span>
                    <span class="result-val">${calc.detail}</span>
                </div>`;
        } else {
            resultMain = `
                <div class="result-row" style="border-bottom:1px dashed #cbd5e1; padding-bottom:0.25rem; margin-bottom:0.5rem; align-items: baseline;">
                    <span class="result-label">1日量</span>
                    <span class="result-val rx-result-main-val">${calc.totalRange} <span class="rx-result-unit">${calc.unit}</span></span>
                </div>
                ${!calc.hidePerTime ? `
                <div class="result-row" style="align-items: baseline;">
                    <span class="result-label">1回量</span>
                    <span class="result-sub" style="font-weight:bold; color:#475569;">${calc.perTimeRange} ${calc.unit} / 分${calc.times}</span>
                </div>` : ''}`;
        }

        let displayName = drug.name;
        if (drug.hasSubOptions && opts.subOptionId) {
            const subOpt = drug.subOptions.find(o => o.id === opts.subOptionId);
            if (subOpt) {
                displayName = displayName.replace('(規格選択)', subOpt.label);
            }
        }

        return `
        <div class="rx-item" data-id="${drug.id}" style="position: relative; cursor: pointer;" onclick="window.handleRxItemClick('${drug.id}', event)">
            <div class="rx-remove" onclick="removeDrug('${drug.id}'); event.stopPropagation();" style="position: absolute; top: 0.3rem; right: 0.3rem; font-size: 1.2rem; color: #94a3b8; cursor: pointer; padding: 4px; line-height: 1; z-index: 10;"><i class="fas fa-times"></i></div>
            <div class="rx-header" style="padding: 0.4rem 0.6rem; align-items: flex-start;">
                <div style="flex:1; min-width:0; pointer-events: none; padding-right: 1.5rem;">
                    <div class="rx-title" style="font-weight:bold; font-size:1.1rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; white-space: normal;">${displayName}</div>
                </div>
            </div>
            <div class="rx-config" style="padding: 0.4rem; gap: 0.4rem;" onclick="event.stopPropagation()">${selectorsHtml}</div>
            <div class="rx-result-box" style="padding: 0.5rem; margin: 0 0.5rem 0.5rem; font-size: 0.85rem; pointer-events: none;">${resultMain}</div>
            <div class="rx-meta" style="padding: 0 0.6rem 0.6rem; pointer-events: none;">
                <div style="font-size:0.7rem; color:#64748b; line-height: 1.2;">${calc.note || ''}</div>
            </div>
            <div style="position: absolute; right: 0.6rem; bottom: 0.6rem; display: flex; align-items: center; gap: 0.3rem;">
                ${(() => {
                const ct = drug.calcType;
                const usesAge = ct === 'age' || ct === 'fixed-age' || ct === 'age-weight-switch';
                const usesWeight = !ct || ct === 'weight-step' || ct === 'age-weight-switch' ||
                    (!ct && drug.dosage && (drug.dosage.minMgKg || drug.dosage.isByTime));

                let badges = '';
                if (usesAge) badges += `<span class="param-badge-age"><i class="fas fa-birthday-cake" style="font-size:0.6rem;"></i> 年齢</span>`;
                if (usesWeight) badges += `<span class="param-badge-weight"><i class="fas fa-weight" style="font-size:0.6rem;"></i> 体重</span>`;
                return badges;
            })()}
            </div>
        </div>`;
    }).join('');

    const finalHtml = itemsHtml.length ? itemsHtml : emptyHtml;
    content.innerHTML = finalHtml;

    if (itemsHtml.length > 1 && window.Sortable) {
        if (window.rxSortable) window.rxSortable.destroy();
        window.rxSortable = new Sortable(content, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            delay: 300,
            delayOnTouchOnly: true,
            touchStartThreshold: 5,
            onEnd: function (evt) {
                const newOrder = Array.from(content.querySelectorAll('.rx-item')).map(el => el.dataset.id);
                state.selectedDrugIds = newOrder;
                saveState();
            }
        });
    }
}

export function renderCategoryTabs() {
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

export function normalizeText(text) {
    if (!text) return '';
    if (text.length > 100) return '';
    let t = text.trim();
    t = t.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    const kanaMap = {
        'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
        'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
        'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
        'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
        'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プロ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
        'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
        'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
        'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
        'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
        'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
        'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
        'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
        'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
        'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
        'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
        'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
        'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
        'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
        'ｰ': 'ー', '｡': '。', '｢': '「', '｣': '」', '､': '、', '･': '・'
    };
    const reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
    t = t.replace(reg, match => kanaMap[match]);
    t = t.replace(/[\u3041-\u3096]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60));
    return t.toLowerCase();
}

export function getFilteredDrugs() {
    const query = normalizeText(currentSearchQuery);
    return PEDIATRIC_DRUGS.filter(d => {
        const name = normalizeText(d.name);
        const yj = normalizeText(d.yjCode);
        return (name.includes(query) || yj.includes(query)) && (currentCategory === 'all' || d.category === currentCategory);
    });
}

export function renderDrugList() {
    const container = document.getElementById('drug-grid');
    if (!container) return;
    const filtered = getFilteredDrugs();
    if (filtered.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:#94a3b8; padding:2rem;">該当なし</div>';
        return;
    }
    const html = filtered.map(d => {
        const isSelected = state.selectedDrugIds.includes(d.id);
        const potLabel = d.potency ? (d.unit === 'g' ? `${d.potency}mg/g` : `${d.potency}mg`) : '';
        const yjPrefix = d.yjCode ? d.yjCode.substring(0, 4) : '';
        const categoryLabel = YJ_CATEGORY_MAP[yjPrefix] || DRUG_CATEGORIES[d.category] || d.category;
        return `
        <div class="drug-card ${isSelected ? 'selected' : ''}" data-id="${d.id}" onclick="window.handleDrugClick('${d.id}', event)">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <span class="tag">${categoryLabel}</span>
            </div>
            <div>
                <h3>${d.name}</h3>
                <div style="font-size:0.75rem; color:#64748b; margin-top:0.25rem;">${potLabel}</div>
            </div>
        </div>`;
    }).join('');
    container.innerHTML = html;
}

export function initDialPicker() {
    const overlay = document.getElementById('dial-overlay');
    const wheelLeft = document.getElementById('wheel-left');
    const wheelRight = document.getElementById('wheel-right');
    const title = document.getElementById('dial-title');
    const labelLeft = document.getElementById('label-left');
    const labelRight = document.getElementById('label-right');
    const confirmBtn = document.getElementById('dial-confirm');

    if (!overlay || !wheelLeft || !wheelRight || !confirmBtn) return;

    let currentMode = 'age';
    let tempValues = { left: 0, right: 0 };

    const populateWheel = (wheel, min, max, current) => {
        let html = '';
        for (let i = min; i <= max; i++) {
            html += `<div class="dial-item" data-value="${i}">${i}</div>`;
        }
        wheel.innerHTML = html;
        setTimeout(() => {
            const item = wheel.querySelector(`[data-value="${current}"]`);
            if (item) {
                wheel.scrollTop = item.offsetTop - 60;
                item.classList.add('active');
            }
        }, 50);
    };

    const handleScroll = (e) => {
        const wheel = e.target;
        const items = wheel.querySelectorAll('.dial-item');
        const scrollCenter = wheel.scrollTop + 75;
        let closest = null;
        let minDiff = Infinity;
        items.forEach(item => {
            const diff = Math.abs(scrollCenter - (item.offsetTop + 15));
            if (diff < minDiff) { minDiff = diff; closest = item; }
            item.classList.remove('active');
        });
        if (closest) {
            closest.classList.add('active');
            const val = parseInt(closest.dataset.value);
            if (wheel === wheelLeft) tempValues.left = val; else tempValues.right = val;
        }
    };

    wheelLeft.onscroll = handleScroll;
    wheelRight.onscroll = handleScroll;

    const openPicker = (mode) => {
        currentMode = mode;
        if (mode === 'age') {
            title.textContent = '年齢を選択';
            labelLeft.textContent = '歳';
            labelRight.style.display = 'block';
            wheelRight.style.display = 'block';
            tempValues = { left: parseInt(state.params.ageYear) || 0, right: parseInt(state.params.ageMonth) || 0 };
            populateWheel(wheelLeft, 0, 15, tempValues.left);
            populateWheel(wheelRight, 0, 11, tempValues.right);
        } else {
            title.textContent = '体重を選択';
            labelLeft.textContent = 'kg';
            labelRight.style.display = 'none';
            wheelRight.style.display = 'none';
            const w = parseInt(state.params.weight) || 10;
            tempValues = { left: w, right: 0 };
            populateWheel(wheelLeft, 0, 100, tempValues.left);
        }
        overlay.classList.add('active');
    };

    document.getElementById('age-dial-trigger')?.addEventListener('click', () => openPicker('age'));
    document.getElementById('weight-dial-trigger')?.addEventListener('click', () => openPicker('weight'));
    confirmBtn.onclick = () => {
        if (currentMode === 'age') {
            state.params.ageYear = tempValues.left;
            state.params.ageMonth = tempValues.right;
        } else {
            state.params.weight = tempValues.left;
        }
        syncInputDisplays();
        updatePrescriptionSheet();
        overlay.classList.remove('active');
    };
    overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('active'); };
}

export function initPcSelects() {
    const ageSelect = document.getElementById('age-select');
    const monthSelect = document.getElementById('month-select');
    const weightSelect = document.getElementById('weight-select');

    if (ageSelect) {
        let ageHtml = '';
        for (let i = 0; i <= 15; i++) {
            ageHtml += `<option value="${i}">${i}</option>`;
        }
        ageSelect.innerHTML = ageHtml;
    }

    if (monthSelect) {
        let monthHtml = '';
        for (let i = 0; i <= 11; i++) {
            monthHtml += `<option value="${i}">${i}</option>`;
        }
        monthSelect.innerHTML = monthHtml;
    }

    if (weightSelect) {
        let weightHtml = '';
        for (let i = 1; i <= 80; i++) {
            weightHtml += `<option value="${i}">${i}</option>`;
        }
        weightSelect.innerHTML = weightHtml;
    }
}

export function syncInputDisplays() {
    const { ageYear, ageMonth, weight } = state.params;

    const ageSelect = document.getElementById('age-select');
    const monthSelect = document.getElementById('month-select');
    const weightSelect = document.getElementById('weight-select');

    if (ageSelect) ageSelect.value = ageYear;
    if (monthSelect) monthSelect.value = ageMonth;
    if (weightSelect) weightSelect.value = Math.round(weight) || 10;

    const ageDisp = document.getElementById('age-val-display');
    const monthDisp = document.getElementById('month-val-display');
    const weightDisp = document.getElementById('weight-val-display');
    if (ageDisp) ageDisp.textContent = ageYear;
    if (monthDisp) monthDisp.textContent = ageMonth;
    if (weightDisp) weightDisp.textContent = weight;
}


window.handleDrugClick = (drugId, e) => { window.toggleDrug(drugId); };

window.handleRxItemClick = (drugId, e) => {
    if (window.innerWidth <= 768) { window.viewDosageDetails(drugId); }
};

window.viewDosageDetails = (idOrYjCode) => {
    let drug = PEDIATRIC_DRUGS.find(d => d.id === idOrYjCode);
    if (!drug) drug = PEDIATRIC_DRUGS.find(d => d.yjCode === idOrYjCode);
    const yjCode = drug ? drug.yjCode : idOrYjCode;
    const modal = document.getElementById('dosage-modal');
    const body = document.getElementById('dosage-modal-body');
    const title = document.getElementById('dosage-modal-title');
    const sourceSpan = document.getElementById('dosage-modal-source');
    if (!modal || !body) return;
    body.scrollTop = 0;
    const data = DOSAGE_DATA[yjCode];

    if (title) title.textContent = drug ? drug.name : yjCode;
    if (sourceSpan && drug && drug.originalName) {
        sourceSpan.textContent = `(参照: ${drug.originalName})`;
    } else if (sourceSpan) {
        sourceSpan.textContent = '';
    }

    let content = '';

    if (drug) {
        const y = state.params.ageYear, m = state.params.ageMonth, w = parseFloat(state.params.weight) || 0;
        const res = calculateDrug(drug, y, m, w);
        const ct = drug.calcType;
        const usesAge = ct === 'age' || ct === 'fixed-age' || ct === 'age-weight-switch';
        const usesWeight = !ct || ct === 'weight-step' || ct === 'age-weight-switch' || (!ct && drug.dosage && (drug.dosage.minMgKg || drug.dosage.isByTime));

        // Badges
        let badgesHtml = '';
        if (usesAge) badgesHtml += `<span class="param-badge-age" style="margin-left: 0.5rem; font-size:0.75rem;"><i class="fas fa-birthday-cake"></i> 年齢</span>`;
        if (usesWeight) badgesHtml += `<span class="param-badge-weight" style="margin-left: 0.5rem; font-size:0.75rem;"><i class="fas fa-weight"></i> 体重</span>`;

        // Estimated Dosage Box
        content += `
        <div style="border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 2rem; overflow: hidden;">
            <div style="display: flex; justify-content: space-between; padding: 0.75rem 1rem; border-bottom: 1px solid #e2e8f0; background: white; align-items: center;">
                <div style="font-weight: bold; color: #4f46e5; display:flex; align-items:center; gap:0.5rem;"><i class="fas fa-calculator" style="color: #4f46e5;"></i> 推計用量</div>
                <div>${badgesHtml}</div>
            </div>
            <div style="padding: 1.5rem; background: #ffffff;">`;

        if (res.error) {
            content += `<div style="color: #ef4444; font-weight: bold; text-align: center; padding: 1rem;"><i class="fas fa-exclamation-triangle"></i> ${res.error}</div>`;
        } else if (res.isFixed && (!res.totalRange || res.totalRange === 'undefined')) {
            const label = res.isSingleDose ? '単回投与' : '固定用量';
            const detailStr = res.detail !== 'undefined' ? res.detail : '';
            content += `
                <div style="text-align: center; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem; font-weight:bold;">${label}</div>
                    <div style="font-size: 1.8rem; font-weight: bold; color: #4f46e5;">${detailStr}</div>
                </div>`;
        } else {
            const tRange = res.totalRange && res.totalRange !== 'undefined' ? res.totalRange : '―';
            const pRange = res.perTimeRange && res.perTimeRange !== 'undefined' ? res.perTimeRange : '―';
            const u = res.unit || '';

            content += `
                <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 150px; text-align: center; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem 1rem;">
                        <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem; font-weight:bold;">1日量</div>
                        <div style="font-size: 1.8rem; font-weight: bold; color: #4f46e5;">${tRange} <span style="font-size: 1rem; font-weight: bold; color: #0f172a;">${u}</span></div>
                    </div>
                    ${!res.hidePerTime ? `
                    <div style="flex: 1; min-width: 150px; text-align: center; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem 1rem;">
                        <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem; font-weight:bold;">1回量</div>
                        <div style="font-size: 1.8rem; font-weight: bold; color: #0f172a;">${pRange} <span style="font-size: 1rem; font-weight: bold; color: #0f172a;">${u}</span></div>
                    </div>` : ''}
                </div>`;
        }

        if (res.note) {
            content += `
                <div style="margin-top: 1.5rem; background: #fffbeb; border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 4px; font-size: 0.9rem; color: #b45309; line-height: 1.5;">
                    <i class="fas fa-info-circle" style="color: #f59e0b; margin-right: 0.5rem;"></i> ${res.note}
                </div>`;
        }

        let methodHtml = '';
        if (ct === 'age' && !drug.isKampo) {
            const age = (parseInt(y) || 0) + (parseInt(m) || 0) / 12;
            methodHtml = `<div style="margin-top: 1rem; font-size: 0.8rem; color: #64748b; text-align:right;">[Augsberger式: 成人量 × <strong>${Math.round(4 * age + 20)}%</strong>]</div>`;
        } else if (ct === 'age' && drug.isKampo) {
            methodHtml = `<div style="margin-top: 1rem; font-size: 0.8rem; color: #64748b; text-align:right;">[漢方年齢区分による算出]</div>`;
        }
        content += methodHtml;

        content += `
            </div>
        </div>`;
    }

    content += `<div style="font-weight: bold; color: #475569; margin-bottom: 1rem; display:flex; align-items:center; gap:0.5rem;"><i class="fas fa-file-medical-alt" style="color: #64748b;"></i> 添付文書（用法・用量）</div>`;

    let dosageText = data && data.html ? data.html : (data ? data.dosage : undefined);
    if (!dosageText) dosageText = drug ? (drug.piSnippet || 'データ未登録') : 'データ未登録';

    // Replace newlines with <br> ONLY if it's plain text (i.e. if it doesn't already have HTML block tags).
    // DO NOT escape if data.html is provided.
    if (dosageText && typeof dosageText === 'string' && !(data && data.html) && !/<div|<p|<br|<table/i.test(dosageText)) {
        dosageText = dosageText.replace(/\n/g, '<br>');
    }

    // Wrapping it in an unstyled div instead of enforcing a line-height that might break the table's typography
    content += `<div style="line-height: 1.8; color: #334155; margin-bottom: 2rem;">${dosageText}</div>`;

    if (drug?.piUrl) {
        content += `
         <div style="text-align: center; margin-top: 2rem; margin-bottom: 1rem;">
            <a href="${drug.piUrl}" target="_blank" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 2rem; border: 1px solid #cbd5e1; border-radius: 8px; color: #475569; text-decoration: none; font-weight: bold; background: #f8fafc; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                <i class="fas fa-external-link-square-alt"></i> PMDAで全文を見る
            </a>
         </div>`;
    }

    body.innerHTML = content;

    // Explicitly override CSS bugs by setting inline styles directly
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    modal.classList.add('active');

    document.getElementById('close-dosage-modal').onclick = () => {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
    };

    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
        }
    };
};

window.toggleDrug = (id) => {
    const idx = state.selectedDrugIds.indexOf(id);
    if (idx > -1) state.selectedDrugIds.splice(idx, 1);
    else state.selectedDrugIds.unshift(id);
    saveState();
    renderDrugList();
    updatePrescriptionSheet();
};

window.clearAllDrugs = () => {
    state.selectedDrugIds = [];
    state.drugOptions = {};
    saveState();
    renderDrugList();
    updatePrescriptionSheet();
};

window.removeDrug = (id) => {
    state.selectedDrugIds = state.selectedDrugIds.filter(d => d !== id);
    if (state.drugOptions[id]) delete state.drugOptions[id];
    saveState();
    renderDrugList();
    updatePrescriptionSheet();
};

window.updateDrugOption = (drugId, key, value) => {
    if (!state.drugOptions[drugId]) state.drugOptions[drugId] = {};
    state.drugOptions[drugId][key] = value;
    saveState();
    updatePrescriptionSheet();
};
