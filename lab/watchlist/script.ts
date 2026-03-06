// DEPLOY_ID: 2026-02-28-v1
import { loadAndCacheData, clearCacheAndReload, MedicineData } from '../../js/data';
import { normalizeString, formatDate } from '../../js/utils';
import { renderStatusButton, showMessage, updateProgress, createDropdown } from '../../js/ui';
import '../../js/components/MainHeader';
import '../../js/components/MainFooter';
import { getRouteFromYJCode, processQuery, matchStatusFilter, groupDataByIngredient, summarizeBy9DigitYJ, getStatusPriority } from './logic';

document.addEventListener('DOMContentLoaded', () => {
    const drugNameInput = document.getElementById('drugName') as HTMLInputElement;
    const ingredientNameInput = document.getElementById('ingredientName') as HTMLInputElement;

    // CAT checkboxes removed

    const routeInternalCheckbox = document.getElementById('routeInternal') as HTMLInputElement;
    const routeInjectableCheckbox = document.getElementById('routeInjectable') as HTMLInputElement;
    const routeExternalCheckbox = document.getElementById('routeExternal') as HTMLInputElement;

    const statusNormalCheckbox = document.getElementById('statusNormal') as HTMLInputElement;
    const statusLimitedCheckbox = document.getElementById('statusLimited') as HTMLInputElement;
    const statusStoppedCheckbox = document.getElementById('statusStopped') as HTMLInputElement;
    const updatePeriodSelector = document.getElementById('updatePeriod') as HTMLSelectElement;

    const class2Select = document.getElementById('class2') as HTMLSelectElement;
    const class3Select = document.getElementById('class3') as HTMLSelectElement;
    const class4Select = document.getElementById('class4') as HTMLSelectElement;

    const summaryTableBody = document.getElementById('summaryTableBody') as HTMLTableSectionElement;
    const tableBody = document.getElementById('searchResultTableBody') as HTMLTableSectionElement;
    const cardContainer = document.getElementById('cardContainer');

    const summaryContainer = document.getElementById('summaryContainer');
    const detailContainer = document.getElementById('detailContainer');
    const backButtonContainer = document.getElementById('backButtonContainer');
    const backBtn = document.getElementById('backBtn') as HTMLButtonElement;

    const categoryFilterContainer = document.getElementById('categoryFilterContainer');
    const statusFilterContainer = document.getElementById('statusFilterContainer');
    const routeFilterContainer = document.getElementById('routeFilterContainer');

    const reloadDataBtn = document.getElementById('reload-data') as HTMLButtonElement;
    const shareBtn = document.getElementById('share-btn') as HTMLButtonElement;
    const labBtn = document.getElementById('lab-btn') as HTMLButtonElement;
    const labDropdown = document.getElementById('lab-dropdown') as HTMLDivElement;
    const watchlistBtn = document.getElementById('watchlist-btn') as HTMLButtonElement;
    const watchlistModal = document.getElementById('watchlist-modal') as HTMLDivElement;
    const closeWatchlistModalBtn = document.getElementById('close-watchlist-modal') as HTMLButtonElement;
    const watchlistInput = document.getElementById('watchlist-input') as HTMLTextAreaElement;
    const saveWatchlistBtn = document.getElementById('save-watchlist') as HTMLButtonElement;
    const clearWatchlistBtn = document.getElementById('clear-watchlist') as HTMLButtonElement;
    const updateSnapshotBtn = document.getElementById('update-snapshot') as HTMLButtonElement;
    const watchlistCountDisplay = document.getElementById('watchlist-count') as HTMLDivElement;
    const watchlistOnlyCheckbox = document.getElementById('watchlistOnly') as HTMLInputElement;
    const changesOnlyCheckbox = document.getElementById('changesOnly') as HTMLInputElement;
    const restoredOnlyCheckbox = document.getElementById('restoredOnly') as HTMLInputElement;
    const storeIdInput = document.getElementById('store-id-input') as HTMLInputElement;
    const passcodeInput = document.getElementById('passcode-input') as HTMLInputElement;
    const notifyFilterInput = document.getElementById('notify-filter-input') as HTMLSelectElement;
    const notifyChannelInput = document.getElementById('notify-channel-input') as HTMLSelectElement;
    const notifyEndpointInput = document.getElementById('notify-endpoint-input') as HTMLInputElement;
    const notifyEndpointLabel = document.getElementById('notify-endpoint-label') as HTMLLabelElement;

    // Logs related elements
    const logsModal = document.getElementById('logs-modal') as HTMLDivElement;
    const closeLogsModalBtn = document.getElementById('close-logs-modal') as HTMLButtonElement;
    const showLogsBtn = document.getElementById('show-logs-btn') as HTMLButtonElement;
    const logsTableBody = document.getElementById('logs-table-body') as HTMLTableSectionElement;
    const logsLoading = document.getElementById('logs-loading') as HTMLDivElement;
    const logsTableContainer = document.getElementById('logs-table-container') as HTMLDivElement;
    const logsEmpty = document.getElementById('logs-empty') as HTMLDivElement;

    let allData: any[] = [];
    let categoryMap = new Map();
    let categoryData = [];
    let filteredData: any[] = [];
    let currentView: 'summary' | 'detail' = 'summary';
    let currentIngredient: string | null = null;
    let currentRoute: string | null = null;
    let drugClassificationData: any = null;
    let currentSort = { key: 'updateDate', direction: 'desc' };
    let watchlistYJCodes: Set<string> = new Set();
    let statusSnapshot: Record<string, string> = {};
    let displayedCount = 30;
    const itemsPerLoad = 20;
    let observer: IntersectionObserver | null = null;
    let currentUsageLimit = 20; // デフォルトの上限数

    // getRouteFromYJCode is now imported from logic.ts

    function populateClass2() {
        if (!class2Select || !drugClassificationData) return;
        class2Select.innerHTML = '<option value="">大分類 (全て)</option>';
        const data2 = drugClassificationData['2'];
        Object.keys(data2).sort().forEach(code => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${code} ${data2[code]}`;
            class2Select.appendChild(option);
        });
    }

    function populateClass3() {
        if (!class3Select || !drugClassificationData) return;
        class3Select.innerHTML = '<option value="">中分類 (全て)</option>';
        if (class4Select) class4Select.innerHTML = '<option value="">小分類 (全て)</option>';

        const c2 = class2Select.value;
        if (!c2) return;

        const data3 = drugClassificationData['3'];
        Object.keys(data3).sort().forEach(code => {
            if (code.startsWith(c2)) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = `${code} ${data3[code]}`;
                class3Select.appendChild(option);
            }
        });
    }

    function populateClass4() {
        if (!class4Select || !drugClassificationData) return;
        class4Select.innerHTML = '<option value="">小分類 (全て)</option>';

        const c3 = class3Select.value;
        if (!c3) return;

        const data4 = drugClassificationData['4'];
        Object.keys(data4).sort().forEach(code => {
            if (code.startsWith(c3)) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = `${code} ${data4[code]}`;
                class4Select.appendChild(option);
            }
        });
    }

    init();

    async function init() {
        restoreStateFromUrl();
        loadWatchlist();
        loadStatusSnapshot();
        loadCloudSettings();
        try {
            const catResponse = await fetch(new URL('../../supply-status/data/category_data.json', import.meta.url).href);
            categoryData = await catResponse.json();

            categoryMap = new Map();
            categoryData.forEach((c: any) => {
                const normIng = normalizeString(c.ingredient_name);
                const key = `${normIng}|${c.route}`;
                categoryMap.set(key, c);
            });

            updateProgress('カテゴリデータ読み込み完了', 30);

            try {
                const classResponse = await fetch(new URL('../../supply-status/data/drug_classification.json', import.meta.url).href);
                drugClassificationData = await classResponse.json();
                populateClass2();
            } catch (e) {
                console.error('Failed to load drug classification data', e);
            }

            const result = await loadAndCacheData(updateProgress);
            if (result && result.data) {
                allData = result.data.map((item: MedicineData) => {
                    const route = getRouteFromYJCode(item.yjCode);
                    const catItem = route ? categoryMap.get(item.normalizedIngredientName + '|' + route) : null;
                    return {
                        ...item,
                        category: catItem ? catItem.category : '-',
                        route: route || (catItem ? catItem.route : '-'),
                        drugClassCode: catItem ? catItem.drug_class_code : '-',
                        drugClassName: catItem ? catItem.drug_class_name : '-',
                        isStatusChanged: false,
                        isRestored: false,
                        isWorsened: false
                    };
                });

                const seenKeys = new Set(allData.map(d => `${d.normalizedIngredientName}|${d.route}`));
                categoryMap.forEach((c, key) => {
                    if (!seenKeys.has(key)) {
                        allData.push({
                            productName: '-',
                            normalizedProductName: '-',
                            ingredientName: c.ingredient_name,
                            normalizedIngredientName: normalizeString(c.ingredient_name),
                            manufacturer: '-',
                            normalizedManufacturer: '-',
                            shipmentStatus: 'データなし',
                            reasonForLimitation: '-',
                            resolutionProspect: '-',
                            expectedDate: '-',
                            yjCode: null,
                            productCategory: c.category,
                            isBasicDrug: '-',
                            category: c.category,
                            route: c.route,
                            drugClassCode: c.drug_class_code,
                            drugClassName: c.drug_class_name,
                            updateDateObj: null
                        });
                        seenKeys.add(key);
                    }
                });

                const loadingIndicator = document.getElementById('loadingIndicator');
                if (loadingIndicator) loadingIndicator.classList.add('hidden');

                // summaryContainerを表示
                if (summaryContainer) summaryContainer.classList.remove('hidden');

                showMessage(`データ(${result.date}) ${allData.length} 件を読み込みました。`, "success");

                // 差分検知ロジックを適用
                applyDiffToData();

                renderResults();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) loadingIndicator.classList.add('hidden');
            if (summaryTableBody) summaryTableBody.innerHTML = '<tr><td colspan="8" class="px-4 py-4 text-center text-red-500">データの読み込みに失敗しました</td></tr>';
            showMessage('データの読み込みに失敗しました。', 'error');
        }
    }

    if (reloadDataBtn) {
        reloadDataBtn.addEventListener('click', async () => {
            if (reloadDataBtn.disabled) return;

            reloadDataBtn.disabled = true;
            reloadDataBtn.classList.add('opacity-50', 'cursor-not-allowed');

            showMessage('最新データを取得しています...', 'info');
            try {
                const result = await clearCacheAndReload(updateProgress);
                if (result && result.data) {
                    allData = result.data.map((item: MedicineData) => {
                        const route = getRouteFromYJCode(item.yjCode);
                        const catItem = route ? categoryMap.get(item.normalizedIngredientName + '|' + route) : null;
                        return {
                            ...item,
                            category: catItem ? catItem.category : '-',
                            route: route || (catItem ? catItem.route : '-'),
                            drugClassCode: catItem ? catItem.drug_class_code : '-',
                            drugClassName: catItem ? catItem.drug_class_name : '-'
                        };
                    });

                    const seenKeys = new Set(allData.map(d => `${d.normalizedIngredientName}|${d.route}`));
                    categoryMap.forEach((c, key) => {
                        if (!seenKeys.has(key)) {
                            allData.push({
                                productName: '-',
                                normalizedProductName: '-',
                                ingredientName: c.ingredient_name,
                                normalizedIngredientName: normalizeString(c.ingredient_name),
                                manufacturer: '-',
                                normalizedManufacturer: '-',
                                shipmentStatus: 'データなし',
                                reasonForLimitation: '-',
                                resolutionProspect: '-',
                                expectedDate: '-',
                                yjCode: null,
                                productCategory: c.category,
                                isBasicDrug: '-',
                                category: c.category,
                                route: c.route,
                                drugClassCode: c.drug_class_code,
                                drugClassName: c.drug_class_name,
                                updateDateObj: null,
                                isStatusChanged: false,
                                isRestored: false,
                                isWorsened: false
                            });
                            seenKeys.add(key);
                        }
                    });

                    // 差分検知ロジックを適用
                    applyDiffToData();

                    showMessage(`データを更新しました: ${allData.length}件`, 'success');
                    renderResults();
                }
            } catch (err: any) {
                console.error('Reload failed:', err);
                showMessage(`データの更新に失敗しました: ${err.message || '不明なエラー'}`, 'error');
            } finally {
                reloadDataBtn.disabled = false;
                reloadDataBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });
    }

    if (shareBtn) shareBtn.addEventListener('click', handleShare);

    // クリアボタン: 検索欄をリセットして再描画
    const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (drugNameInput) drugNameInput.value = '';
            if (ingredientNameInput) ingredientNameInput.value = '';
            renderResults();
        });
    }

    if (labBtn && labDropdown) {
        labBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            labDropdown.classList.toggle('hidden');
        });

        window.addEventListener('click', () => {
            labDropdown.classList.add('hidden');
        });
    }

    if (watchlistBtn) {
        watchlistBtn.addEventListener('click', () => {
            labDropdown?.classList.add('hidden');
            watchlistModal.classList.remove('hidden');
        });
    }
    if (closeWatchlistModalBtn) {
        closeWatchlistModalBtn.addEventListener('click', () => {
            watchlistModal.classList.add('hidden');
        });
    }
    if (saveWatchlistBtn) saveWatchlistBtn.addEventListener('click', saveWatchlist);
    if (updateSnapshotBtn) updateSnapshotBtn.addEventListener('click', saveStatusSnapshot);
    if (clearWatchlistBtn) {
        clearWatchlistBtn.addEventListener('click', () => {
            if (confirm('監視リストをすべて消去しますか？')) {
                watchlistInput.value = '';
                updateWatchlistCount();
            }
        });
    }
    if (watchlistInput) {
        watchlistInput.addEventListener('input', updateWatchlistCount);
    }
    if (watchlistOnlyCheckbox) {
        watchlistOnlyCheckbox.addEventListener('change', renderResults);
    }
    if (changesOnlyCheckbox) {
        changesOnlyCheckbox.addEventListener('change', () => {
            if (changesOnlyCheckbox.checked && restoredOnlyCheckbox) restoredOnlyCheckbox.checked = false;
            renderResults();
        });
    }
    if (restoredOnlyCheckbox) {
        restoredOnlyCheckbox.addEventListener('change', () => {
            if (restoredOnlyCheckbox.checked && changesOnlyCheckbox) changesOnlyCheckbox.checked = false;
            renderResults();
        });
    }

    function loadStatusSnapshot() {
        const saved = localStorage.getItem('supply_status_snapshot');
        if (saved) {
            try {
                statusSnapshot = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load status snapshot', e);
            }
        }
    }

    function saveStatusSnapshot() {
        const newSnapshot: Record<string, string> = {};
        allData.forEach(item => {
            if (item.yjCode) {
                newSnapshot[item.yjCode] = item.shipmentStatus;
            }
        });
        localStorage.setItem('supply_status_snapshot', JSON.stringify(newSnapshot));
        statusSnapshot = newSnapshot;
        applyDiffToData();
        renderResults();
        showMessage('現在の状態をベースラインとして保存しました。次回更新時に差分が表示されます。', 'success');
    }

    function applyDiffToData() {
        allData.forEach(item => {
            if (!item.yjCode) return;
            const prev = statusSnapshot[item.yjCode];
            if (prev && prev !== item.shipmentStatus) {
                item.isStatusChanged = true;
                item.previousStatus = prev;
                // 通常出荷に戻ったか判定
                const isNowNormal = item.shipmentStatus.includes('通常') || item.shipmentStatus.includes('通');
                const wasNotNormal = !(prev.includes('通常') || prev.includes('通'));
                item.isRestored = isNowNormal && wasNotNormal;

                // 悪化したか判定（通常から限定・停止へ）
                const isNowBad = (item.shipmentStatus.includes('限定') || item.shipmentStatus.includes('制限') || item.shipmentStatus.includes('限') || item.shipmentStatus.includes('停止'));
                const wasNormal = prev.includes('通常') || prev.includes('通');
                item.isWorsened = isNowBad && wasNormal;
            } else {
                item.isStatusChanged = false;
                item.isRestored = false;
                item.isWorsened = false;
            }
        });
    }

    function handleShare() {
        const url = generateShareUrl();
        navigator.clipboard.writeText(url).then(() => {
            showMessage('検索条件をクリップボードにコピーしました', 'success');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showMessage('コピーに失敗しました', 'error');
        });
    }

    function generateShareUrl() {
        const params = new URLSearchParams();
        if (drugNameInput?.value) params.set('drug', drugNameInput.value);
        if (ingredientNameInput?.value) params.set('ing', ingredientNameInput.value);

        // CAT params removed

        const routes = [];
        if (routeInternalCheckbox?.checked) routes.push('internal');
        if (routeInjectableCheckbox?.checked) routes.push('injectable');
        if (routeExternalCheckbox?.checked) routes.push('external');
        if (routes.length < 3) params.set('route', routes.join(','));

        const status = [];
        if (statusNormalCheckbox?.checked) status.push('normal');
        if (statusLimitedCheckbox?.checked) status.push('limited');
        if (statusStoppedCheckbox?.checked) status.push('stopped');
        if (status.length < 3) params.set('status', status.join(','));


        if (updatePeriodSelector?.value !== 'all') {
            params.set('p', updatePeriodSelector.value);
        }

        if (currentSort.key !== 'updateDate' || currentSort.direction !== 'desc') {
            params.set('sort', currentSort.key);
            params.set('dir', currentSort.direction);
        }

        const baseUrl = window.location.origin + window.location.pathname;
        return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    }

    function restoreStateFromUrl() {
        const params = new URLSearchParams(window.location.search);

        if (params.has('drug') && drugNameInput) drugNameInput.value = params.get('drug')!;
        if (params.has('ing') && ingredientNameInput) ingredientNameInput.value = params.get('ing')!;

        // CAT restore removed

        if (params.has('route')) {
            const routes = params.get('route')!.split(',');
            if (routeInternalCheckbox) routeInternalCheckbox.checked = routes.includes('internal');
            if (routeInjectableCheckbox) routeInjectableCheckbox.checked = routes.includes('injectable');
            if (routeExternalCheckbox) routeExternalCheckbox.checked = routes.includes('external');
        }

        if (params.has('status')) {
            const status = params.get('status')!.split(',');
            if (statusNormalCheckbox) statusNormalCheckbox.checked = status.includes('normal');
            if (statusLimitedCheckbox) statusLimitedCheckbox.checked = status.includes('limited');
            if (statusStoppedCheckbox) statusStoppedCheckbox.checked = status.includes('stopped');
        }


        if (params.has('p') && updatePeriodSelector) {
            updatePeriodSelector.value = params.get('p')!;
        }

        if (params.has('sort')) {
            currentSort.key = params.get('sort')!;
            currentSort.direction = params.get('dir') || 'asc';
            updateSortIcons();
        }
    }

    const summaryTableHeaders = document.querySelectorAll('#summaryTable th[data-sort]');
    summaryTableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const key = header.getAttribute('data-sort')!;
            if (currentSort.key === key) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.key = key;
                currentSort.direction = 'asc';
            }
            updateSortIcons();
            renderResults();
        });
    });

    function updateSortIcons() {
        summaryTableHeaders.forEach(header => {
            const icon = header.querySelector('.sort-icon');
            if (!icon) return;
            if (header.getAttribute('data-sort') === currentSort.key) {
                icon.classList.remove('text-gray-400', 'group-hover:text-gray-600');
                icon.classList.add('text-indigo-600');
                icon.innerHTML = currentSort.direction === 'asc'
                    ? '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>'
                    : '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>';
            } else {
                icon.classList.add('text-gray-400', 'group-hover:text-gray-600');
                icon.classList.remove('text-indigo-600');
                icon.innerHTML = '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>';
            }
        });
    }

    function debounce(func: Function, delay: number) {
        let timeout: any;
        return function (this: any, ...args: any[]) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const debouncedRender = debounce(renderResults, 300);
    let isComposing = false;

    const textInputs = [drugNameInput, ingredientNameInput];
    textInputs.forEach(input => {
        if (!input) return;
        input.addEventListener('compositionstart', () => {
            isComposing = true;
        });
        input.addEventListener('compositionend', () => {
            isComposing = false;
            debouncedRender();
        });
        input.addEventListener('input', () => {
            if (!isComposing) {
                debouncedRender();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                renderResults();
                input.blur();
            }
        });
    });

    if (class2Select) {
        class2Select.addEventListener('change', () => {
            populateClass3();
            debouncedRender();
        });
    }
    if (class3Select) {
        class3Select.addEventListener('change', () => {
            populateClass4();
            debouncedRender();
        });
    }
    if (class4Select) {
        class4Select.addEventListener('change', debouncedRender);
    }


    const checkboxes = [
        routeInternalCheckbox, routeInjectableCheckbox, routeExternalCheckbox,
        statusNormalCheckbox, statusLimitedCheckbox, statusStoppedCheckbox
    ];
    if (updatePeriodSelector) updatePeriodSelector.addEventListener('change', renderResults);

    checkboxes.forEach(checkbox => {
        if (checkbox) checkbox.addEventListener('change', renderResults);
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            currentView = 'summary';
            currentIngredient = null;
            currentRoute = null;
            showSummaryView();
            renderResults();
        });
    }

    function loadWatchlist() {
        const saved = localStorage.getItem('supply_watchlist_yjcodes');
        if (saved) {
            try {
                const codes = JSON.parse(saved);
                if (Array.isArray(codes)) {
                    watchlistYJCodes = new Set(codes);
                    watchlistInput.value = codes.join('\n');
                    updateWatchlistCount();
                }
            } catch (e) {
                console.error('Failed to load watchlist', e);
            }
        }
    }

    saveWatchlistBtn?.addEventListener('click', saveWatchlist);

    clearWatchlistBtn?.addEventListener('click', () => {
        if (confirm('監視リストをすべて消去しますか？')) {
            watchlistInput.value = '';
            updateWatchlistCount();
        }
    });

    updateSnapshotBtn?.addEventListener('click', () => {
        saveStatusSnapshot();
        showMessage('現在の状態を記録しました。', 'success');
        renderResults();
    });

    async function saveWatchlist() {
        const text = watchlistInput.value;
        const codes = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        watchlistYJCodes = new Set(codes);
        localStorage.setItem('supply_watchlist_yjcodes', JSON.stringify(Array.from(watchlistYJCodes)));

        // クラウド同期設定の取得
        const storeId = (document.getElementById('store-id-input') as HTMLInputElement)?.value.trim();
        const passcode = (document.getElementById('passcode-input') as HTMLInputElement)?.value.trim();
        const notifyFilter = (document.getElementById('notify-filter-input') as HTMLSelectElement)?.value || 'all';
        const notifyAllowedStart = (document.getElementById('notify-start-input') as HTMLSelectElement)?.value || '00:00';
        const notifyAllowedEnd = (document.getElementById('notify-end-input') as HTMLSelectElement)?.value || '24:00';

        const lineEnable = (document.getElementById('notify-line-enable') as HTMLInputElement)?.checked;
        const lineEndpoints = (document.getElementById('notify-line-input') as HTMLInputElement)?.value.trim() || '';
        const emailEnable = (document.getElementById('notify-email-enable') as HTMLInputElement)?.checked;
        const emailEndpoints = (document.getElementById('notify-email-input') as HTMLInputElement)?.value.trim() || '';
        const webhookEnable = (document.getElementById('notify-webhook-enable') as HTMLInputElement)?.checked;
        const webhookEndpoints = (document.getElementById('notify-webhook-input') as HTMLInputElement)?.value.trim() || '';

        if (storeId && passcode) {
            // バリデーション
            const lineCount = lineEndpoints.split(',').filter(e => e.trim().length > 0).length;
            const emailCount = emailEndpoints.split(',').filter(e => e.trim().length > 0).length;

            if (lineEnable && lineCount > 3) {
                showMessage('LINE通知先は最大3件までです', 'error');
                return;
            }
            if (emailEnable && emailCount > 3) {
                showMessage('メール通知先は最大3件までです', 'error');
                return;
            }

            // ローカル保存
            localStorage.setItem('supply_store_id', storeId);
            localStorage.setItem('supply_passcode', passcode);
            localStorage.setItem('supply_notify_filter', notifyFilter);
            localStorage.setItem('supply_notify_allowed_start', notifyAllowedStart);
            localStorage.setItem('supply_notify_allowed_end', notifyAllowedEnd);
            localStorage.setItem('supply_notify_line_endpoints', lineEndpoints);
            localStorage.setItem('supply_notify_line_enable', String(lineEnable));
            localStorage.setItem('supply_notify_email_endpoints', emailEndpoints);
            localStorage.setItem('supply_notify_email_enable', String(emailEnable));
            localStorage.setItem('supply_notify_webhook_endpoints', webhookEndpoints);
            localStorage.setItem('supply_notify_webhook_enable', String(webhookEnable));

            if (storeId) {
                if (!confirm('【同期の確認】\n保存すると、クラウド上の設定も更新されます。他のデバイスでこのIDを使用している場合、そちらの設定も上書きされますが、よろしいですか？')) {
                    return;
                }
            }

            try {
                showMessage('クラウドと同期中...', 'info');
                const response = await fetch('/api/watch-items/batch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        storeId,
                        passcode,
                        yjCodes: Array.from(watchlistYJCodes),
                        notifyFilter,
                        notifyAllowedStart,
                        notifyAllowedEnd,
                        notifyLineEndpoints: lineEnable ? lineEndpoints : '',
                        notifyEmailEndpoints: emailEnable ? emailEndpoints : '',
                        notifyWebhookEndpoints: webhookEnable ? webhookEndpoints : ''
                    })
                });

                if (response.ok) {
                    const result = await response.json() as { success: boolean, codes?: string[] };
                    if (result.success && result.codes) {
                        // サーバー側で正規化・変換されたコードでローカルを更新
                        watchlistYJCodes = new Set(result.codes);
                        watchlistInput.value = result.codes.join('\n');
                        localStorage.setItem('supply_watchlist_yjcodes', JSON.stringify(result.codes));
                        updateWatchlistCount();
                        renderResults();
                    }
                    showMessage('設定と監視リストを保存しました', 'success');
                } else {
                    const errText = await response.text();
                    showMessage(`同期失敗: ${errText}`, 'error');
                }
            } catch (err) {
                showMessage('ネットワークエラーにより同期に失敗しました', 'error');
            }
        } else {
            showMessage(`${watchlistYJCodes.size}件の品目を監視リストに保存しました（同期設定なし）`, 'success');
        }

        updateWatchlistCount();
        watchlistModal.classList.add('hidden');
        renderResults();
    }

    function loadCloudSettings() {
        const setVal = (id: string, key: string, def = '') => {
            const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
            if (el) el.value = localStorage.getItem(key) || def;
        };
        const setChecked = (id: string, key: string) => {
            const el = document.getElementById(id) as HTMLInputElement;
            if (el) el.checked = localStorage.getItem(key) === 'true';
        };

        setVal('store-id-input', 'supply_store_id');
        setVal('passcode-input', 'supply_passcode');
        setVal('notify-filter-input', 'supply_notify_filter', 'all');
        setVal('notify-start-input', 'supply_notify_allowed_start', '00:00');
        setVal('notify-end-input', 'supply_notify_allowed_end', '24:00');

        setChecked('notify-line-enable', 'supply_notify_line_enable');
        setVal('notify-line-input', 'supply_notify_line_endpoints');
        setChecked('notify-email-enable', 'supply_notify_email_enable');
        setVal('notify-email-input', 'supply_notify_email_endpoints');
        setChecked('notify-webhook-enable', 'supply_notify_webhook_enable');
        setVal('notify-webhook-input', 'supply_notify_webhook_endpoints');

        const storeId = localStorage.getItem('supply_store_id');
        const passcode = localStorage.getItem('supply_passcode');
        if (storeId && passcode) {
            updateLoginUI(true);
            // Trigger cloud sync on load
            setTimeout(() => restoreSettings(true), 100);
        }
    }

    // テスト送信ボタンのイベント設定
    const setupTestButton = (btnId: string, channel: string, inputId: string, enableId: string) => {
        const btn = document.getElementById(btnId);
        btn?.addEventListener('click', async (e) => {
            e.preventDefault();
            const storeId = (document.getElementById('store-id-input') as HTMLInputElement)?.value.trim();
            const passcode = (document.getElementById('passcode-input') as HTMLInputElement)?.value.trim();
            const target = (document.getElementById(inputId) as HTMLInputElement)?.value.trim();
            const enable = (document.getElementById(enableId) as HTMLInputElement)?.checked;

            if (!storeId || !passcode) {
                showMessage('店舗IDとパスコードを入力してください', 'error');
                return;
            }
            if (!enable || !target) {
                showMessage('チャネルを有効にし、宛先を入力してください', 'error');
                return;
            }

            try {
                const originalText = btn.textContent;
                btn.textContent = '送信中...';
                (btn as HTMLButtonElement).disabled = true;

                const response = await fetch('/api/notifications/test', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ storeId, passcode, channel, target })
                });

                const result = await response.json() as { success: boolean, error?: string };
                if (result.success) {
                    showMessage(`${channel.toUpperCase()} テスト送信に成功しました`, 'success');
                } else {
                    showMessage(`テスト送信失敗: ${result.error}`, 'error');
                }

                btn.textContent = originalText;
                (btn as HTMLButtonElement).disabled = false;
            } catch (err) {
                showMessage('通信エラーが発生しました', 'error');
                btn.textContent = 'テスト送信';
                (btn as HTMLButtonElement).disabled = false;
            }
        });
    };

    setupTestButton('test-line-btn', 'line', 'notify-line-input', 'notify-line-enable');
    setupTestButton('test-email-btn', 'email', 'notify-email-input', 'notify-email-enable');
    setupTestButton('test-webhook-btn', 'webhook', 'notify-webhook-input', 'notify-webhook-enable');

    // --- 通知履歴表示ロジック ---
    if (showLogsBtn) {
        showLogsBtn.addEventListener('click', async () => {
            const storeId = (document.getElementById('store-id-input') as HTMLInputElement)?.value.trim();
            const passcode = (document.getElementById('passcode-input') as HTMLInputElement)?.value.trim();

            if (!storeId || !passcode) {
                showMessage('履歴の閲覧には店舗IDとパスコードが必要です', 'error');
                return;
            }

            logsModal.classList.remove('hidden');
            logsLoading.classList.remove('hidden');
            logsTableContainer.classList.add('hidden');
            logsEmpty.classList.add('hidden');

            try {
                const response = await fetch(`/api/notifications/logs?storeId=${encodeURIComponent(storeId)}&passcode=${encodeURIComponent(passcode)}`);
                if (!response.ok) throw new Error('履歴の取得に失敗しました');

                const result = await response.json() as { success: boolean, logs: any[] };
                if (result.success && result.logs && result.logs.length > 0) {
                    renderLogs(result.logs);
                    logsLoading.classList.add('hidden');
                    logsTableContainer.classList.remove('hidden');
                } else {
                    logsLoading.classList.add('hidden');
                    logsEmpty.classList.remove('hidden');
                }
            } catch (err: any) {
                console.error(err);
                showMessage(err.message, 'error');
                logsModal.classList.add('hidden');
            }
        });
    }

    if (closeLogsModalBtn) {
        closeLogsModalBtn.addEventListener('click', () => {
            logsModal.classList.add('hidden');
        });
    }

    function renderLogs(logs: any[]) {
        if (!logsTableBody) return;
        logsTableBody.innerHTML = '';
        logs.forEach(log => {
            const row = document.createElement('tr');
            const date = new Date(log.created_at);
            const dateStr = date.toLocaleString('ja-JP');
            const statusClass = log.status === 'failed' ? 'text-red-600 font-bold' : 'text-green-600';

            row.innerHTML = `
                <td class="px-3 py-3 text-[11px] whitespace-nowrap">${dateStr}</td>
                <td class="px-3 py-3 text-[11px] uppercase">${log.channel}</td>
                <td class="px-3 py-3 text-[11px] ${statusClass}">${log.status === 'failed' ? '失敗' : '成功'}</td>
                <td class="px-3 py-3 text-[11px]">
                    <div class="font-bold text-gray-700">${log.title || '-'}</div>
                    <div class="text-gray-500 mt-1 truncate max-w-[300px]">${log.content_summary || log.error_message || ''}</div>
                </td>
            `;
            logsTableBody.appendChild(row);
        });
    }

    function updateLoginUI(isLoggedIn: boolean) {
        const badge = document.getElementById('login-status-badge');
        const notice = document.getElementById('sync-notice-area');
        if (badge) {
            badge.innerText = isLoggedIn ? 'Linked' : 'Guest Mode';
            badge.className = isLoggedIn
                ? 'bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase transition-all'
                : 'bg-gray-100 text-gray-500 text-[9px] font-black px-1.5 py-0.5 rounded uppercase transition-all';
        }
        if (notice) {
            if (isLoggedIn) {
                notice.classList.remove('hidden');
            } else {
                notice.classList.add('hidden');
            }
        }
    }

    async function restoreSettings(isAuto: boolean = false) {
        const storeIdInput = document.getElementById('store-id-input') as HTMLInputElement;
        const passcodeInput = document.getElementById('passcode-input') as HTMLInputElement;
        const storeId = storeIdInput?.value.trim();
        const passcode = passcodeInput?.value.trim();

        if (!storeId || !passcode) {
            if (!isAuto) showMessage('店舗IDとパスコードを入力してください', 'error');
            updateLoginUI(false);
            return;
        }

        // Fetch latest from cloud regardless of previous local state to ensure multi-device sync

        try {
            if (!isAuto) showMessage('クラウドから同期中...', 'info');
            const response = await fetch(`/api/watch-items/get?storeId=${encodeURIComponent(storeId)}&passcode=${encodeURIComponent(passcode)}`);

            if (response.ok) {
                const data = await response.json() as any;
                if (data.success) {
                    // Confirmation for auto-sync overwrite
                    if (isAuto && watchlistInput && watchlistInput.value.trim().length > 0) {
                        const currentInput = watchlistInput.value.trim();
                        const cloudInput = data.yjCodes.join('\n');
                        if (currentInput !== cloudInput) {
                            if (!confirm('クラウド上に保存された設定が見つかりました。\n現在入力されている内容を上書きして同期しますか？')) {
                                updateLoginUI(true); // Treat as logged in but skip overwrite
                                return;
                            }
                        }
                    }

                    if (watchlistInput) watchlistInput.value = data.yjCodes.join('\n');

                    const setVal = (id: string, val: string) => {
                        const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
                        if (el) el.value = val || '';
                    };
                    const setChecked = (id: string, val: boolean) => {
                        const el = document.getElementById(id) as HTMLInputElement;
                        if (el) el.checked = val;
                    };

                    setVal('notify-filter-input', data.store.notifyFilter);
                    setVal('notify-line-input', data.store.notifyLineEndpoints);
                    setChecked('notify-line-enable', !!data.store.notifyLineEndpoints);
                    setVal('notify-email-input', data.store.notifyEmailEndpoints);
                    setChecked('notify-email-enable', !!data.store.notifyEmailEndpoints);
                    setVal('notify-webhook-input', data.store.notifyWebhookEndpoints);
                    setChecked('notify-webhook-enable', !!data.store.notifyWebhookEndpoints);
                    setVal('notify-start-input', data.store.notifyAllowedStart || '00:00');
                    setVal('notify-end-input', data.store.notifyAllowedEnd || '24:00');

                    localStorage.setItem('supply_store_id', storeId);
                    localStorage.setItem('supply_passcode', passcode);
                    localStorage.setItem('supply_watchlist_yjcodes', JSON.stringify(data.yjCodes));

                    watchlistYJCodes = new Set(data.yjCodes);
                    currentUsageLimit = data.store.usageLimit || 20;
                    updateWatchlistCount();
                    renderResults();
                    updateLoginUI(true);
                    if (!isAuto) showMessage('クラウド設定を同期しました', 'success');
                }
            } else {
                if (!isAuto) showMessage('認証に失敗しました。IDまたはパスコードを確認してください', 'error');
                updateLoginUI(false);
            }
        } catch (err) {
            if (!isAuto) showMessage('クラウドとの接続に失敗しました', 'error');
            updateLoginUI(false);
        }
    }

    // Auto-sync trigger on blur
    ['store-id-input', 'passcode-input'].forEach(id => {
        document.getElementById(id)?.addEventListener('blur', () => restoreSettings(true));
    });
    // Support manual restore button just in case
    document.getElementById('restore-settings-btn')?.addEventListener('click', () => restoreSettings(false));

    // 新規登録・お支払いボタン
    document.getElementById('start-registration-btn')?.addEventListener('click', () => {
        // 将来的には Stripe Checkout へのリダイレクトや、専用の登録モーダルを開く
        if (confirm('スタンダードプラン（3,000品目 / 月額¥5,000）の登録・お支払い画面に進みますか？\n（現在はデモ用のため、管理者によるID発行をご利用ください）')) {
            window.open('https://buy.stripe.com/test_6oEbM08Y95U4gW43cc', '_blank');
        }
    });

    function updateWatchlistCount() {
        if (watchlistCountDisplay && watchlistInput) {
            const count = watchlistInput.value.split('\n').map(l => l.trim()).filter(l => l.length > 0).length;
            const limitText = `${currentUsageLimit}件`;
            watchlistCountDisplay.textContent = `登録数: ${count} / ${limitText}`;

            // 上限超えの視覚的警告
            if (count > currentUsageLimit) {
                watchlistCountDisplay.classList.add('text-red-500');
            } else {
                watchlistCountDisplay.classList.remove('text-red-500');
            }
        }
    }

    function renderResults() {
        const drugQuery = drugNameInput?.value.trim() || '';
        const ingredientQuery = ingredientNameInput?.value.trim() || '';

        // processQuery is now imported from logic.ts

        const drugFilter = processQuery(drugQuery);
        const ingredientFilter = processQuery(ingredientQuery);

        const selectedRoutes: string[] = [];
        if (routeInternalCheckbox?.checked) selectedRoutes.push('内');
        if (routeInjectableCheckbox?.checked) selectedRoutes.push('注');
        if (routeExternalCheckbox?.checked) selectedRoutes.push('外');

        const selectedStatuses: string[] = [];
        if (!statusNormalCheckbox || statusNormalCheckbox.checked) selectedStatuses.push('通常出荷');
        if (!statusLimitedCheckbox || statusLimitedCheckbox.checked) selectedStatuses.push('限定出荷');
        if (!statusStoppedCheckbox || statusStoppedCheckbox.checked) selectedStatuses.push('供給停止');

        filteredData = allData.filter(item => {
            const matchQuery = (text: string, filter: any) => {
                const normalizedText = text || '';
                const matchInclude = filter.include.length === 0 || filter.include.every((term: string) => normalizedText.includes(term));
                const matchExclude = filter.exclude.length === 0 || !filter.exclude.some((term: string) => normalizedText.includes(term));
                return matchInclude && matchExclude;
            };

            // 品名・成分名・YJコードのいずれかにマッチすればOK（OR条件）
            const yjCodeStr = item.yjCode ? normalizeString(String(item.yjCode)) : '';
            const matchDrug = drugFilter.include.length === 0
                ? true
                : matchQuery(item.normalizedProductName, drugFilter)
                || matchQuery(item.normalizedIngredientName, drugFilter)
                || matchQuery(yjCodeStr, drugFilter);
            const matchIngredient = matchQuery(item.normalizedIngredientName, ingredientFilter);
            const matchRoute = selectedRoutes.includes(item.route);

            if (watchlistOnlyCheckbox?.checked) {
                const yj = item.yjCode ? String(item.yjCode) : null;
                if (!yj || !watchlistYJCodes.has(yj)) return false;
            }

            if (changesOnlyCheckbox?.checked) {
                if (!item.isStatusChanged) return false;
            }

            if (restoredOnlyCheckbox?.checked) {
                if (!item.isRestored) return false;
            }

            const matchStatus = matchStatusFilter(item.shipmentStatus, selectedStatuses);

            // 薬効分類フィルタ
            let matchClass = true;
            if (class2Select?.value) {
                const c2 = class2Select.value;
                const c3 = class3Select?.value;
                const c4 = class4Select?.value;
                const itemYJ = item.yjCode ? String(item.yjCode) : '';

                if (c4) {
                    matchClass = itemYJ.startsWith(c4);
                } else if (c3) {
                    matchClass = itemYJ.startsWith(c3);
                } else {
                    matchClass = itemYJ.startsWith(c2);
                }
            }

            // 期間フィルタ
            let matchPeriod = true;
            if (updatePeriodSelector && updatePeriodSelector.value !== 'all') {
                const days = parseInt(updatePeriodSelector.value);
                if (item.updateDateObj) {
                    const diffTime = Math.abs(new Date().getTime() - item.updateDateObj.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    matchPeriod = diffDays <= days;
                } else {
                    matchPeriod = false;
                }
            }

            return matchDrug && matchIngredient && matchRoute && matchStatus && matchPeriod && matchClass;
        });

        // 以前は検索条件が空かつ採用薬のみがオフの場合、結果を表示しないようにしていたが
        // 速度改善（件数制限表示）を前提に、全件表示を許可するよう変更
        /*
        const isSearchEmpty = drugQuery === '' && ingredientQuery === '';
        const isWatchlistOff = !watchlistOnlyCheckbox?.checked;
        if (isSearchEmpty && isWatchlistOff) {
            filteredData = [];
        }
        */

        // ソート処理
        filteredData.sort((a, b) => {
            let valA = a[currentSort.key];
            let valB = b[currentSort.key];

            const direction = currentSort.direction === 'asc' ? 1 : -1;

            if (currentSort.key === 'updateDate') {
                valA = a.updateDateObj ? a.updateDateObj.getTime() : 0;
                valB = b.updateDateObj ? b.updateDateObj.getTime() : 0;
            } else if (currentSort.key === 'shipmentStatus') {
                valA = getStatusPriority(a.shipmentStatus);
                valB = getStatusPriority(b.shipmentStatus);
            }

            if (typeof valA === 'string' && typeof valB === 'string') {
                return valA.localeCompare(valB, 'ja') * direction;
            }
            if (valA < valB) return -1 * direction;
            if (valA > valB) return 1 * direction;
            return 0;
        });

        if (currentView === 'summary') {
            displayedCount = 30; // 検索実行時は件数をリセット
            renderSummaryTable(filteredData);
            updateDashboardMetrics(filteredData);
        } else {
            const normalizedIng = normalizeString(currentIngredient!);
            const detailData = filteredData.filter(item =>
                item.normalizedIngredientName === normalizedIng &&
                (currentRoute === null || item.route === currentRoute)
            );
            renderDetailView(detailData);
            updateDashboardMetrics(detailData);
        }

        const hasResults = filteredData.length > 0;
        const isDetailView = currentView === 'detail';
        document.body.classList.toggle('search-mode', hasResults || isDetailView);
    }

    function updateDashboardMetrics(data: any[]) {
        if (!data) return;

        let total = data.length;
        let improved = 0;
        let worsened = 0;
        let normal = 0, limited = 0, stopped = 0;

        data.forEach(item => {
            const s = (item.shipmentStatus || '').trim();
            if (s.includes('通常') || s.includes('通')) normal++;
            else if (s.includes('限定') || s.includes('制限') || s.includes('限') || s.includes('制')) limited++;
            else if (s.includes('停止') || s.includes('停')) stopped++;

            if (item.isRestored) improved++;
            if (item.isWorsened) worsened++;
        });

        // HTML要素への反映
        const setText = (id: string, text: string | number) => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(text);
        };

        setText('metric-total-count', total);
        setText('metric-improved-count', improved);
        setText('metric-worsened-count', worsened);

        if (total === 0) {
            updateBar('normal', 0);
            updateBar('limited', 0);
            updateBar('stopped', 0);
            return;
        }

        const pNormal = Math.round((normal / total) * 100);
        const pLimited = Math.round((limited / total) * 100);
        const pStopped = 100 - pNormal - pLimited;

        updateBar('normal', pNormal);
        updateBar('limited', pLimited);
        updateBar('stopped', pStopped);
    }

    function updateBar(type: string, percent: number) {
        const bar = document.getElementById(`stat-${type}-bar`);
        const val = document.getElementById(`stat-${type}-value`);
        if (bar) bar.style.width = `${percent}%`;
        if (val) val.textContent = `${percent}%`;
    }

    function updateGauge(type: 'normal' | 'limited' | 'stopped', percent: number, color: string) {
        const valueEl = document.getElementById(`stat-${type}-value`);
        const barEl = document.getElementById(`stat-${type}-bar`);

        if (valueEl) valueEl.textContent = `${percent}%`;
        if (barEl) {
            barEl.style.width = `${percent}%`;
        }
    }

    function renderSummaryTable(data: any[], append: boolean = false) {
        if (!summaryTableBody) return;

        if (!append) {
            summaryTableBody.innerHTML = '';
        }

        if (data.length === 0) {
            summaryTableBody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-gray-500 font-bold italic">該当するデータがありません</td></tr>';
            return;
        }

        // 9桁YJコードに基づく集計（全データから同規品を算出）
        const yj9Summary = summarizeBy9DigitYJ(allData);

        const start = append ? summaryTableBody.querySelectorAll('tr:not(.sentinel)').length : 0;
        const end = Math.min(start + (append ? itemsPerLoad : 30), data.length);
        const slice = data.slice(start, end);

        slice.forEach((item, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-0';

            const dateStr = item.updateDateObj ? formatDate(item.updateDateObj) : '';
            const formattedDate = dateStr ? `${dateStr.substring(2, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}` : '';

            const yj9 = item.yjCode ? String(item.yjCode).substring(0, 9) : null;
            const stats = yj9 ? yj9Summary[yj9] : null;


            let stackedBarHtml = '';
            if (stats) {
                const total = stats.normal + stats.limited + stats.stopped;
                const pN = (stats.normal / total) * 100;
                const pL = (stats.limited / total) * 100;
                const pS = (stats.stopped / total) * 100;
                const tooltipText = `同規格(9桁YJ)状況 - 通常: ${stats.normal}, 限定: ${stats.limited}, 停止: ${stats.stopped}`;
                stackedBarHtml = `
                <div class="w-full max-w-[70px] mt-0.5" title="${tooltipText}">
                    <div class="bar-container h-1 flex rounded-full overflow-hidden bg-gray-100 shadow-inner">
                        <div class="bar-segment bg-status-normal" style="width: ${pN}%"></div>
                        <div class="bar-segment bg-status-limited" style="width: ${pL}%"></div>
                        <div class="bar-segment bg-status-stopped" style="width: ${pS}%"></div>
                    </div>
                </div>
            `;
            }

            const isGeneric = item.productCategory && normalizeString(item.productCategory).includes('後発品');

            // 品名セル (ホバーメニュー)
            const nameCell = document.createElement('td');
            nameCell.className = 'px-4 py-4 text-xs font-medium align-top';

            const labelsContainer = document.createElement('div');
            labelsContainer.className = 'flex flex-col gap-0.5 mr-1';
            if (isGeneric) {
                const span = document.createElement('span');
                span.className = 'px-1 py-0.5 rounded text-[10px] bg-green-100 text-green-800 font-bold w-fit';
                span.textContent = '後';
                labelsContainer.appendChild(span);
            }

            const nameFlex = document.createElement('div');
            nameFlex.className = 'flex items-start';
            nameFlex.appendChild(labelsContainer);

            if (item.yjCode) {
                nameFlex.appendChild(createDropdown(item, `summary-${index}`));
            } else {
                const nameSpan = document.createElement('span');
                nameSpan.className = 'text-blue-600 font-bold';
                nameSpan.textContent = item.productName;
                nameFlex.appendChild(nameSpan);
            }

            const yjCodeSpan = document.createElement('span');
            yjCodeSpan.className = 'text-[10px] text-gray-400 font-mono block mt-1';
            yjCodeSpan.textContent = item.yjCode || '';

            const nameColumn = document.createElement('div');
            nameColumn.className = 'flex flex-col';
            nameColumn.appendChild(nameFlex);
            nameColumn.appendChild(yjCodeSpan);
            nameCell.appendChild(nameColumn);

            row.appendChild(nameCell);

            // 成分名セル
            const ingCell = document.createElement('td');
            ingCell.className = 'px-4 py-4 text-xs text-gray-600 align-top';
            const ingSpan = document.createElement('span');
            ingSpan.className = 'ingredient-link text-blue-600';
            ingSpan.textContent = item.ingredientName;
            ingSpan.addEventListener('click', () => {
                if (drugNameInput) {
                    drugNameInput.value = item.ingredientName;
                    if (ingredientNameInput) ingredientNameInput.value = '';
                    debouncedRender();
                }
                window.scrollTo(0, 0);
            });
            ingCell.appendChild(ingSpan);
            row.appendChild(ingCell);

            // 出荷状況セル
            const statusCell = document.createElement('td');
            statusCell.className = 'px-4 py-4 align-top';

            // 詳細ビューと同じ仕組み: isStatusChanged=true のとき renderStatusButton に渡して赤枠を付ける
            const statusBtn = renderStatusButton(item.shipmentStatus, item.isStatusChanged === true);
            statusBtn.classList.add('origin-left');

            const statusFlex = document.createElement('div');
            statusFlex.className = 'flex flex-col items-start gap-1 w-fit';

            if (item.isStatusChanged) {
                // バッジ（詳細ビューと同じスタイル）
                const changeBadge = document.createElement('div');
                changeBadge.className = `mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${item.isRestored ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`;
                const icon = document.createElement('span');
                icon.textContent = item.isRestored ? '⤴️' : (item.isWorsened ? '⤵️' : '🔄');
                const label = document.createElement('span');
                label.textContent = item.isRestored ? '制限解除' : '前回から変更';
                changeBadge.appendChild(icon);
                changeBadge.appendChild(label);

                statusFlex.appendChild(statusBtn);
                statusFlex.appendChild(changeBadge);
            } else {
                statusFlex.appendChild(statusBtn);
            }

            if (stackedBarHtml) {
                const barWrapper = document.createElement('div');
                barWrapper.innerHTML = stackedBarHtml;
                statusFlex.appendChild(barWrapper.firstElementChild!);
            }
            statusCell.appendChild(statusFlex);
            row.appendChild(statusCell);

            // その他
            const reasonCell = document.createElement('td');
            reasonCell.className = 'px-4 py-4 text-xs text-gray-600 align-top line-clamp-2 max-h-[4.5rem] overflow-hidden';
            reasonCell.textContent = item.reasonForLimitation || '-';
            row.appendChild(reasonCell);

            const prospectCell = document.createElement('td');
            prospectCell.className = 'px-4 py-4 text-[10px] text-gray-600 align-top';
            prospectCell.textContent = item.resolutionProspect || '-';
            row.appendChild(prospectCell);

            const expectedCell = document.createElement('td');
            expectedCell.className = 'px-4 py-4 text-[10px] text-gray-600 align-top';
            expectedCell.textContent = item.expectedDate || '-';
            row.appendChild(expectedCell);

            const quantityCell = document.createElement('td');
            quantityCell.className = 'px-4 py-4 text-[10px] text-gray-600 text-right align-top';
            quantityCell.textContent = item.shipmentQuantityStatus || '-';
            row.appendChild(quantityCell);

            const dateCell = document.createElement('td');
            dateCell.className = 'px-4 py-4 text-[10px] text-gray-400 text-right align-top whitespace-nowrap';
            dateCell.textContent = formattedDate;
            row.appendChild(dateCell);

            summaryTableBody.appendChild(row);
        });

        setupSentinel(data);
    }

    function setupSentinel(data: any[]) {
        // 既存のセンチネルを削除
        const oldSentinel = summaryTableBody?.querySelector('.sentinel');
        if (oldSentinel) oldSentinel.remove();

        // 全件表示済みなら終了
        const currentCount = summaryTableBody?.querySelectorAll('tr:not(.sentinel)').length || 0;
        if (currentCount >= data.length) return;

        // 次の読み込み用のセンチネル行を追加
        const sentinelRow = document.createElement('tr');
        sentinelRow.className = 'sentinel';
        sentinelRow.innerHTML = `<td colspan="8" class="py-4 text-center text-gray-400 text-xs">読み込み中...</td>`;
        summaryTableBody?.appendChild(sentinelRow);

        // Observerの設定
        if (observer) observer.disconnect();
        observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // センチネルが見えたら次を読み込む
                displayedCount += itemsPerLoad;
                renderSummaryTable(data, true);
            }
        }, {
            rootMargin: '200px' // 早めに読み込みを開始（200px手前）
        });
        observer.observe(sentinelRow);
    }

    function showDetailView(ingredient: string, route: string) {
        currentView = 'detail';
        currentIngredient = ingredient;
        currentRoute = route;

        summaryContainer?.classList.add('hidden');
        detailContainer?.classList.remove('hidden');
        backButtonContainer?.classList.remove('hidden');

        if (categoryFilterContainer) categoryFilterContainer.classList.add('hidden');
        if (routeFilterContainer) routeFilterContainer.classList.add('hidden');
        if (statusFilterContainer) statusFilterContainer.classList.remove('hidden');

        const filterGrid = document.getElementById('filterGrid');
        if (filterGrid) {
            filterGrid.classList.remove('md:grid-cols-3');
        }

        renderResults();
        window.scrollTo(0, 0);
    }

    function showSummaryView() {
        summaryContainer?.classList.remove('hidden');
        detailContainer?.classList.add('hidden');
        backButtonContainer?.classList.add('hidden');

        if (categoryFilterContainer) categoryFilterContainer.classList.remove('hidden');
        if (routeFilterContainer) routeFilterContainer.classList.remove('hidden');
        if (statusFilterContainer) statusFilterContainer.classList.add('hidden');

        const filterGrid = document.getElementById('filterGrid');
        if (filterGrid) {
            filterGrid.classList.add('md:grid-cols-3');
        }
    }


    function renderDetailView(data: any[]) {
        renderTable(data);
        renderCards(data);
    }

    function renderTable(data: any[]) {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="9" class="px-4 py-4 text-center text-gray-500">該当するデータがありません</td></tr>';
            return;
        }

        data.slice(0, 100).forEach((item, index) => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';

            const dateStr = item.updateDateObj ? formatDate(item.updateDateObj) : '';
            const formattedDate = dateStr ? `${dateStr.substring(2, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}` : '';

            row.innerHTML = `
                <td class="px-4 py-4 text-sm align-top"></td>
                <td class="px-4 py-4 text-sm align-top text-center"></td>
                <td class="px-4 py-4 text-sm text-gray-600 align-top">
                    <div class="line-clamp-2" title="${item.reasonForLimitation || '-'}">${item.reasonForLimitation || '-'}</div>
                    <div class="text-[10px] text-gray-400 mt-1">${item.resolutionProspect || ''}</div>
                </td>
                <td class="px-4 py-4 text-xs text-gray-500 whitespace-nowrap align-top text-right">${formattedDate}</td>
            `;

            const drugNameCell = row.cells[0];
            const statusCell = row.cells[1];

            const labelsContainer = document.createElement('div');
            labelsContainer.className = 'vertical-labels-container';

            const isGeneric = item.productCategory && normalizeString(item.productCategory).includes('後発品');
            const isBasic = item.isBasicDrug && normalizeString(item.isBasicDrug).includes('基礎的医薬品');

            if (isGeneric) {
                const span = document.createElement('span');
                span.className = "medicine-badge badge-generic";
                span.textContent = '後';
                labelsContainer.appendChild(span);
            }
            if (isBasic) {
                const span = document.createElement('span');
                span.className = "medicine-badge badge-basic";
                span.textContent = '基';
                labelsContainer.appendChild(span);
            }

            const flexContainer = document.createElement('div');
            flexContainer.className = 'flex items-start';

            if (labelsContainer.hasChildNodes()) {
                flexContainer.appendChild(labelsContainer);
            }

            if (item.yjCode) {
                flexContainer.appendChild(createDropdown(item, `table-${index}`));
            } else {
                const productNameSpan = document.createElement('span');
                productNameSpan.className = "text-indigo-600 font-medium";
                productNameSpan.textContent = item.productName || '';
                flexContainer.appendChild(productNameSpan);
            }
            drugNameCell.appendChild(flexContainer);

            const statusBtn = renderStatusButton(item.shipmentStatus);
            if (item.isStatusChanged) {
                const changeBadge = document.createElement('div');
                changeBadge.className = `mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded text-center ${item.isRestored ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`;
                changeBadge.innerHTML = `<i class="fas fa-arrow-right mr-1"></i>${item.isRestored ? '制限解除！' : '前回から変更'}`;

                const wrapper = document.createElement('div');
                wrapper.className = 'flex flex-col items-center';
                wrapper.appendChild(statusBtn);
                wrapper.appendChild(changeBadge);
                statusCell.appendChild(wrapper);
            } else {
                statusCell.appendChild(statusBtn);
            }

            tableBody.appendChild(row);
        });
    }

    function renderCards(data: any[]) {
        if (!cardContainer) return;
        cardContainer.innerHTML = '';
        if (data.length === 0) {
            cardContainer.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">該当するデータがありません</div>';
            return;
        }

        data.slice(0, 50).forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-3';

            const dateStr = item.updateDateObj ? formatDate(item.updateDateObj) : '';
            const formattedDate = dateStr ? `${dateStr.substring(2, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}` : '';

            const statusBtn = renderStatusButton(item.shipmentStatus);

            card.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex flex-col gap-1">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 w-fit">
                            カテゴリ ${item.category}
                        </span>
                        ${item.isStatusChanged ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${item.isRestored ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'} w-fit">
                            <i class="fas fa-bell mr-1"></i>${item.isRestored ? '通常出荷に復帰！' : 'ステータス変更あり'}
                        </span>` : ''}
                    </div>
                    <span id="status-placeholder"></span>
                </div>
                <div class="product-name-container">
                    <!-- Dropdown will be inserted here -->
                </div>
                <p class="text-sm text-gray-500">${item.ingredientName || ''}</p>
                <div class="grid grid-cols-2 gap-2 text-sm mt-2 border-t border-gray-100 pt-2">
                    <div>
                        <span class="block text-xs text-gray-500">制限理由</span>
                        <span class="text-gray-700 font-medium">${item.reasonForLimitation || '-'}</span>
                    </div>
                    <div>
                        <span class="block text-xs text-gray-500">解消見込み</span>
                        <span class="text-gray-700 font-medium">${item.resolutionProspect || '-'}</span>
                    </div>
                    <div>
                        <span class="block text-xs text-gray-500">見込み時期</span>
                        <span class="text-gray-700 font-medium">${item.expectedDate || '-'}</span>
                    </div>
                    <div>
                        <span class="block text-xs text-gray-500">更新日</span>
                        <span class="text-xs text-gray-700 whitespace-nowrap">${formattedDate}</span>
                    </div>
                </div>
            `;

            const nameContainer = card.querySelector('.product-name-container') as HTMLElement;

            const labelsContainer = document.createElement('div');
            labelsContainer.className = 'vertical-labels-container';

            const isGeneric = item.productCategory && normalizeString(item.productCategory).includes('後発品');
            const isBasic = item.isBasicDrug && normalizeString(item.isBasicDrug).includes('基礎的医薬品');

            if (isGeneric) {
                const span = document.createElement('span');
                span.className = "medicine-badge badge-generic";
                span.textContent = '後';
                labelsContainer.appendChild(span);
            }
            if (isBasic) {
                const span = document.createElement('span');
                span.className = "medicine-badge badge-basic";
                span.textContent = '基';
                labelsContainer.appendChild(span);
            }

            const flexContainer = document.createElement('div');
            flexContainer.className = 'flex items-start';

            if (labelsContainer.hasChildNodes()) {
                flexContainer.appendChild(labelsContainer);
            }

            if (item.yjCode) {
                flexContainer.appendChild(createDropdown(item, `card-${index}`));
            } else {
                const h3 = document.createElement('h3');
                h3.className = 'text-lg font-bold text-indigo-900 mb-1';
                h3.textContent = item.productName || '';
                flexContainer.appendChild(h3);
            }
            nameContainer.appendChild(flexContainer);

            const placeholder = card.querySelector('#status-placeholder')!;
            placeholder.replaceWith(statusBtn);

            cardContainer.appendChild(card);
        });
    }

    (window as any).openDetails = (yjCode: string) => {
        const item = allData.find(d => d.yjCode === yjCode);
        if (item) {
            showDetailView(item.ingredientName, item.route);
        }
    };
});
