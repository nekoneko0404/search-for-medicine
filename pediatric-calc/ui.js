
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
    const container = document.getElementById('notification-container');
    if (!container) return;
    const notification = document.createElement('div');
    notification.className = 'floating-notification';
    const safeMessage = typeof message === 'string' ? message.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '';
    notification.innerHTML = `
        <i class="fas fa-flask" style="color: #d97706; font-size: 0.9rem;"></i>
        <div style="color: #92400e; font-size: 0.8rem; font-weight: 700; line-height: 1.4; flex:1;">${safeMessage}</div>
        <button onclick="this.parentElement.remove()" style="background:none; border:none; cursor:pointer; color:#94a3b8; padding:2px;"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse forwards';
        setTimeout(() => notification.remove(), 300);
    }, 8000);
};

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
                    <div class="rx-title" style="font-weight:bold; font-size:1.1rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; white-space: normal;">${displayName}</div>
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
                ${drug.piUrl ? `
                    <button class="pi-link-badge pc-only" onclick="window.viewDosageDetails('${drug.id}'); event.stopPropagation();">
                        添付文書
                    </button>` : ''}
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

export function syncInputDisplays() {
    const { ageYear, ageMonth, weight } = state.params;
    const ageIn = document.getElementById('age-input');
    const monthIn = document.getElementById('month-input');
    const weightIn = document.getElementById('weight-input');
    if (ageIn) ageIn.value = ageYear;
    if (monthIn) monthIn.value = ageMonth;
    if (weightIn) weightIn.value = weight;
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
    if (sourceSpan) sourceSpan.textContent = drug ? drug.name : yjCode;
    let content = '';
    if (drug) {
        const y = state.params.ageYear, m = state.params.ageMonth, w = parseFloat(state.params.weight) || 0;
        const res = calculateDrug(drug, y, m, w);
        const ct = drug.calcType;
        const usesAge = ct === 'age' || ct === 'fixed-age' || ct === 'age-weight-switch';
        const usesWeight = !ct || ct === 'weight-step' || ct === 'age-weight-switch' || (!ct && drug.dosage && (drug.dosage.minMgKg || drug.dosage.isByTime));
        content += `<div class="dosage-modal-param-badge-container">`;
        if (usesAge) content += `<span class="param-badge-age"><i class="fas fa-birthday-cake"></i> 年齢</span>`;
        if (usesWeight) content += `<span class="param-badge-weight"><i class="fas fa-weight"></i> 体重</span>`;
        content += `</div>`;
        if (ct === 'age' && !drug.isKampo) {
            const age = (parseInt(y) || 0) + (parseInt(m) || 0) / 12;
            content += `<div class="dosage-modal-calc-note"><span style="font-weight:bold;">Augsberger式</span><br>成人量 × (4×${age.toFixed(1)} + 20) / 100 = <strong>${Math.round(4 * age + 20)}%</strong></div>`;
        } else if (ct === 'age' && drug.isKampo) {
            content += `<div class="dosage-modal-calc-note"><span style="font-weight:bold;">漢方年齢区分</span><br>2歳未満25% / 4歳未満33% / 7歳未満50% / 15歳未満66%</div>`;
        }
    }
    content += `<div style="margin-top:1.5rem; line-height:1.7; color:#334155;">${data ? data.dosage : (drug ? (drug.piSnippet || 'データ未登録') : 'データ未登録')}</div>`;
    if (drug?.piUrl) content += `<div style="margin-top:1.5rem;"><a href="${drug.piUrl}" target="_blank" class="pmda-link"><i class="fas fa-external-link-alt"></i> PMDA情報を開く</a></div>`;
    body.innerHTML = content;
    modal.style.display = 'flex';
    document.getElementById('close-dosage-modal').onclick = () => { modal.style.display = 'none'; };
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
