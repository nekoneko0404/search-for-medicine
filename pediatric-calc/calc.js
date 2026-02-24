
import { state, saveState, loadState, subscribe } from './state.js';
import { getStandardWeight } from './logic.js';
import {
    updatePrescriptionSheet,
    renderCategoryTabs,
    renderDrugList,
    initDialPicker,
    initPcSelects,
    initUsageGuide,
    syncInputDisplays,
    setSearchQuery,
    setCategory
} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    renderCategoryTabs();
    initPcSelects();
    initUsageGuide();
    renderDrugList();
    updatePrescriptionSheet();
    initDialPicker();
    syncInputDisplays();

    // Event Listeners
    const pcAgeSelect = document.getElementById('age-select');
    const pcMonthSelect = document.getElementById('month-select');
    const pcWeightSelect = document.getElementById('weight-select');

    const handlePcSelectChange = () => {
        state.params.ageYear = parseInt(pcAgeSelect.value, 10);
        state.params.ageMonth = parseInt(pcMonthSelect.value, 10);
        state.params.weight = parseInt(pcWeightSelect.value, 10);
        syncInputDisplays();
        updatePrescriptionSheet();
    };

    if (pcAgeSelect) pcAgeSelect.addEventListener('change', handlePcSelectChange);
    if (pcMonthSelect) pcMonthSelect.addEventListener('change', handlePcSelectChange);
    if (pcWeightSelect) pcWeightSelect.addEventListener('change', handlePcSelectChange);

    const autoBtn = document.getElementById('auto-weight-btn');
    if (autoBtn) {
        autoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            state.params.weight = Math.round(getStandardWeight(state.params.ageYear, state.params.ageMonth));
            syncInputDisplays();
            updatePrescriptionSheet();
        });
    }

    // Auto-search from YJ param
    const urlParams = new URLSearchParams(window.location.search);
    const yjQuery = urlParams.get('yj');
    if (yjQuery) {
        setSearchQuery(yjQuery);
        setCategory('all');
    }

    setTimeout(() => {
        window.showNotification('テスト中。不具合、バグを発見した際は掲示板、X等でご指摘ください。');
    }, 1000);
});

subscribe(() => {
    renderDrugList();
    updatePrescriptionSheet();
});
