
import { state, saveState, loadState, subscribe } from './state.js';
import { getStandardWeight } from './logic.js';
import {
    updatePrescriptionSheet,
    renderCategoryTabs,
    renderDrugList,
    initDialPicker,
    syncInputDisplays,
    setSearchQuery,
    setCategory
} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    renderCategoryTabs();
    renderDrugList();
    updatePrescriptionSheet();
    initDialPicker();
    syncInputDisplays();

    // Event Listeners
    const pcAgeIn = document.getElementById('age-input');
    const pcMonthIn = document.getElementById('month-input');
    const pcWeightIn = document.getElementById('weight-input');

    const handlePcInput = () => {
        state.params.ageYear = pcAgeIn.value;
        state.params.ageMonth = pcMonthIn.value;
        state.params.weight = pcWeightIn.value;
        syncInputDisplays();
        updatePrescriptionSheet();
    };

    if (pcAgeIn) pcAgeIn.addEventListener('input', handlePcInput);
    if (pcMonthIn) pcMonthIn.addEventListener('input', handlePcInput);
    if (pcWeightIn) pcWeightIn.addEventListener('input', handlePcInput);

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
