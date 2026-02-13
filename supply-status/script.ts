import { loadAndCacheData, clearCacheAndReload, MedicineData } from '../js/data';
import { normalizeString, formatDate } from '../js/utils';
import { renderStatusButton, showMessage, updateProgress, createDropdown } from '../js/ui';
import '../js/components/MainHeader';
import '../js/components/MainFooter';

document.addEventListener('DOMContentLoaded', () => {
    const drugNameInput = document.getElementById('drugName') as HTMLInputElement;
    const ingredientNameInput = document.getElementById('ingredientName') as HTMLInputElement;

    const catACheckbox = document.getElementById('catA') as HTMLInputElement;
    const catBCheckbox = document.getElementById('catB') as HTMLInputElement;
    const catCCheckbox = document.getElementById('catC') as HTMLInputElement;

    const routeInternalCheckbox = document.getElementById('routeInternal') as HTMLInputElement;
    const routeInjectableCheckbox = document.getElementById('routeInjectable') as HTMLInputElement;
    const routeExternalCheckbox = document.getElementById('routeExternal') as HTMLInputElement;

    const statusNormalCheckbox = document.getElementById('statusNormal') as HTMLInputElement;
    const statusLimitedCheckbox = document.getElementById('statusLimited') as HTMLInputElement;
    const statusStoppedCheckbox = document.getElementById('statusStopped') as HTMLInputElement;

    const summaryTableBody = document.getElementById('summaryTableBody') as HTMLTableSectionElement;
    const summaryCardContainer = document.getElementById('summaryCardContainer');
    const summaryResults = document.getElementById('summaryResults');
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

    let allData: any[] = [];
    let categoryMap = new Map();
    let categoryData = [];
    let filteredData: any[] = [];
    let currentView: 'summary' | 'detail' = 'summary';
    let currentIngredient: string | null = null;
    let currentSort = { key: 'category', direction: 'asc' };

    function getRouteFromYJCode(yjCode: string | number | null) {
        if (!yjCode) return null;
        const yjStr = String(yjCode);
        if (yjStr.length < 5) return null;
        const digit = parseInt(yjStr.charAt(4));
        if (isNaN(digit)) return null;
        if (digit >= 0 && digit <= 3) return '内';
        if (digit >= 4 && digit <= 6) return '注';
        if (digit >= 7 && digit <= 9) return '外';
        return null;
    }

    init();

    async function init() {
        restoreStateFromUrl();
        try {
            updateProgress('初期化中...', 10);
            const catResponse = await fetch('data/category_data.json');
            categoryData = await catResponse.json();

            categoryMap = new Map();
            categoryData.forEach((c: any) => {
                const normIng = normalizeString(c.ingredient_name);
                const key = `${normIng}|${c.route}`;
                categoryMap.set(key, c);
            });

            updateProgress('カテゴリデータ読み込み完了', 30);

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
                            updateDateObj: null
                        });
                        seenKeys.add(key);
                    }
                });

                const loadingIndicator = document.getElementById('loadingIndicator');
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
                if (summaryResults) summaryResults.classList.remove('hidden');

                showMessage(`データ(${result.date}) ${allData.length} 件を読み込みました。`, "success");
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
                                updateDateObj: null
                            });
                            seenKeys.add(key);
                        }
                    });
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

        const cats = [];
        if (catACheckbox?.checked) cats.push('A');
        if (catBCheckbox?.checked) cats.push('B');
        if (catCCheckbox?.checked) cats.push('C');
        if (cats.length < 3) params.set('cat', cats.join(','));

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


        if (currentSort.key !== 'category' || currentSort.direction !== 'asc') {
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

        if (params.has('cat')) {
            const cats = params.get('cat')!.split(',');
            if (catACheckbox) catACheckbox.checked = cats.includes('A');
            if (catBCheckbox) catBCheckbox.checked = cats.includes('B');
            if (catCCheckbox) catCCheckbox.checked = cats.includes('C');
        }

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

    const checkboxes = [
        catACheckbox, catBCheckbox, catCCheckbox,
        routeInternalCheckbox, routeInjectableCheckbox, routeExternalCheckbox,
        statusNormalCheckbox, statusLimitedCheckbox, statusStoppedCheckbox
    ];
    checkboxes.forEach(checkbox => {
        if (checkbox) checkbox.addEventListener('change', renderResults);
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            currentView = 'summary';
            currentIngredient = null;
            showSummaryView();
            renderResults();
        });
    }

    function renderResults() {
        const drugQuery = drugNameInput?.value.trim() || '';
        const ingredientQuery = ingredientNameInput?.value.trim() || '';

        const processQuery = (query: string) => {
            if (!query) return { include: [], exclude: [] };
            const terms = query.split(/[\s　]+/).filter(t => t.length > 0);
            const include: string[] = [];
            const exclude: string[] = [];
            terms.forEach(term => {
                if (term.startsWith('ー') && term.length > 1) {
                    exclude.push(normalizeString(term.substring(1)));
                } else {
                    include.push(normalizeString(term));
                }
            });
            return { include, exclude };
        };

        const drugFilter = processQuery(drugQuery);
        const ingredientFilter = processQuery(ingredientQuery);

        const selectedCats: string[] = [];
        if (catACheckbox?.checked) selectedCats.push('A');
        if (catBCheckbox?.checked) selectedCats.push('B');
        if (catCCheckbox?.checked) selectedCats.push('C');

        const selectedRoutes: string[] = [];
        if (routeInternalCheckbox?.checked) selectedRoutes.push('内');
        if (routeInjectableCheckbox?.checked) selectedRoutes.push('注');
        if (routeExternalCheckbox?.checked) selectedRoutes.push('外');

        const selectedStatuses: string[] = [];
        if (statusNormalCheckbox?.checked) selectedStatuses.push('通常出荷');
        if (statusLimitedCheckbox?.checked) selectedStatuses.push('限定出荷');
        if (statusStoppedCheckbox?.checked) selectedStatuses.push('供給停止');


        filteredData = allData.filter(item => {
            const matchQuery = (text: string, filter: any) => {
                const normalizedText = text || '';
                const matchInclude = filter.include.length === 0 || filter.include.every((term: string) => normalizedText.includes(term));
                const matchExclude = filter.exclude.length === 0 || !filter.exclude.some((term: string) => normalizedText.includes(term));
                return matchInclude && matchExclude;
            };

            const matchDrug = matchQuery(item.normalizedProductName, drugFilter);
            const matchIngredient = matchQuery(item.normalizedIngredientName, ingredientFilter);
            const matchCat = selectedCats.includes(item.category);
            const matchRoute = selectedRoutes.includes(item.route);

            const currentStatus = (item.shipmentStatus || '').trim();
            let matchStatus = false;
            if (selectedStatuses.includes('通常出荷') && (currentStatus.includes('通常') || currentStatus.includes('通'))) matchStatus = true;
            if (selectedStatuses.includes('限定出荷') && (currentStatus.includes('限定') || currentStatus.includes('制限') || currentStatus.includes('限') || currentStatus.includes('制'))) matchStatus = true;
            if (selectedStatuses.includes('供給停止') && (currentStatus.includes('停止') || currentStatus.includes('停'))) matchStatus = true;

            if (currentStatus === 'データなし') matchStatus = true;

            return matchDrug && matchIngredient && matchCat && matchRoute && matchStatus;
        });

        if (currentView === 'summary') {
            renderSummaryTable(filteredData);
        } else {
            renderDetailView(filteredData.filter(item => item.normalizedIngredientName === normalizeString(currentIngredient!)));
        }

        const hasResults = filteredData.length > 0;
        const isDetailView = currentView === 'detail';
        document.body.classList.toggle('search-mode', hasResults || isDetailView);
    }

    function renderSummaryTable(data: any[]) {
        if (!summaryTableBody || !summaryCardContainer) return;

        summaryTableBody.innerHTML = '';
        summaryCardContainer.innerHTML = '';
        if (data.length === 0) {
            summaryTableBody.innerHTML = '<tr><td colspan="8" class="px-4 py-4 text-center text-gray-500">該当するデータがありません</td></tr>';
            summaryCardContainer.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">該当するデータがありません</div>';
            return;
        }

        const grouped: Record<string, any> = {};
        data.forEach(item => {
            const ingredient = item.ingredientName || '不明';
            const route = item.route || '-';
            const groupKey = `${ingredient}|${route}`;

            if (!grouped[groupKey]) {
                grouped[groupKey] = {
                    ingredientName: ingredient,
                    route: route,
                    category: item.category,
                    drugClassCode: item.drugClassCode,
                    drugClassName: item.drugClassName,
                    counts: { normal: 0, limited: 0, stopped: 0 }
                };
            }

            const status = (item.shipmentStatus || '').trim();
            if (status.includes('通常') || status.includes('通')) {
                grouped[groupKey].counts.normal++;
            } else if (status.includes('限定') || status.includes('制限') || status.includes('限') || status.includes('制')) {
                grouped[groupKey].counts.limited++;
            } else if (status.includes('停止') || status.includes('停')) {
                grouped[groupKey].counts.stopped++;
            }
        });

        const sortedIngredients = Object.keys(grouped).sort((a, b) => {
            const statsA = grouped[a];
            const statsB = grouped[b];

            const categoryPriority: Record<string, number> = { 'A': 1, 'B': 2, 'C': 3 };
            const routePriority: Record<string, number> = { '内': 1, '注': 2, '外': 3 };

            const compare = (valA: any, valB: any, key: string, dir: string = 'asc') => {
                const direction = dir === 'asc' ? 1 : -1;

                if (key === 'category') {
                    const pA = categoryPriority[valA] || 99;
                    const pB = categoryPriority[valB] || 99;
                    if (pA !== pB) return (pA - pB) * direction;
                } else if (key === 'route') {
                    const pA = routePriority[valA] || 99;
                    const pB = routePriority[valB] || 99;
                    if (pA !== pB) return (pA - pB) * direction;
                }

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return valA.localeCompare(valB, 'ja') * direction;
                }
                if (valA < valB) return -1 * direction;
                if (valA > valB) return 1 * direction;
                return 0;
            };

            const hierarchy = [
                { key: 'category', getVal: (s: any) => s.category },
                { key: 'route', getVal: (s: any) => s.route },
                { key: 'drugClassCode', getVal: (s: any) => s.drugClassCode },
                { key: 'drugClassName', getVal: (s: any) => s.drugClassName },
                { key: 'ingredientName', getVal: (s: any) => s.ingredientName },
                { key: 'statusNormal', getVal: (s: any) => s.counts.normal },
                { key: 'statusLimited', getVal: (s: any) => s.counts.limited },
                { key: 'statusStopped', getVal: (s: any) => s.counts.stopped }
            ];

            let getPrimaryVal;
            switch (currentSort.key) {
                case 'category': getPrimaryVal = (s: any) => s.category; break;
                case 'route': getPrimaryVal = (s: any) => s.route; break;
                case 'drugClassCode': getPrimaryVal = (s: any) => s.drugClassCode; break;
                case 'drugClassName': getPrimaryVal = (s: any) => s.drugClassName; break;
                case 'ingredientName': getPrimaryVal = (s: any) => s.ingredientName; break;
                case 'statusNormal': getPrimaryVal = (s: any) => s.counts.normal; break;
                case 'statusLimited': getPrimaryVal = (s: any) => s.counts.limited; break;
                case 'statusStopped': getPrimaryVal = (s: any) => s.counts.stopped; break;
                default: getPrimaryVal = (s: any) => s.ingredientName;
            }

            const primaryDiff = compare(getPrimaryVal(statsA), getPrimaryVal(statsB), currentSort.key, currentSort.direction);
            if (primaryDiff !== 0) return primaryDiff;

            for (const item of hierarchy) {
                if (item.key === currentSort.key) continue;

                const valA = item.getVal(statsA);
                const valB = item.getVal(statsB);
                const diff = compare(valA, valB, item.key, 'asc');
                if (diff !== 0) return diff;
            }

            return 0;
        });

        sortedIngredients.forEach(groupKey => {
            const stats = grouped[groupKey];
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors cursor-pointer';
            row.addEventListener('click', () => showDetailView(stats.ingredientName, stats.route));


            row.innerHTML = `
                <td class="px-4 py-2 text-sm text-gray-900 font-bold text-center">${stats.category}</td>
                <td class="px-4 py-2 text-sm text-gray-900 font-bold text-center">${stats.route || '-'}</td>
                <td class="px-4 py-2 text-sm text-gray-700 text-center">${stats.drugClassCode}</td>
                <td class="px-4 py-2 text-sm text-gray-700 max-w-[150px] truncate" title="${stats.drugClassName}">${stats.drugClassName}</td>
                <td class="px-4 py-2 text-sm text-indigo-600 font-medium hover:underline">${stats.ingredientName}</td>
                 <td class="px-4 py-2 text-sm text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        通常出荷 ${stats.counts.normal}
                    </span>
                </td>
                <td class="px-4 py-2 text-sm text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        限定出荷 ${stats.counts.limited}
                    </span>
                </td>
                <td class="px-4 py-2 text-sm text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        供給停止 ${stats.counts.stopped}
                    </span>
                </td>
            `;

            summaryTableBody.appendChild(row);

            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 cursor-pointer hover:bg-gray-50 transition-colors';
            card.addEventListener('click', () => showDetailView(stats.ingredientName, stats.route));

            card.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-800">
                        カテゴリ ${stats.category} / ${stats.route}
                    </span>
                    <span class="text-xs text-gray-500 font-medium truncate max-w-[150px]">
                        ${stats.drugClassCode}: ${stats.drugClassName}
                    </span>
                </div>
                <h3 class="text-lg font-bold text-indigo-900 mb-3">${stats.ingredientName}</h3>
                <div class="grid grid-cols-3 gap-2 mt-2">
                    <div class="text-center p-2 bg-blue-50 rounded-lg">
                        <span class="block text-xs text-blue-600 font-bold mb-1">通常</span>
                        <span class="text-lg font-bold text-blue-800">${stats.counts.normal}</span>
                    </div>
                    <div class="text-center p-2 bg-yellow-50 rounded-lg">
                        <span class="block text-xs text-yellow-600 font-bold mb-1">限定</span>
                        <span class="text-lg font-bold text-yellow-800">${stats.counts.limited}</span>
                    </div>
                    <div class="text-center p-2 bg-red-50 rounded-lg">
                        <span class="block text-xs text-red-600 font-bold mb-1">停止</span>
                        <span class="text-lg font-bold text-red-800">${stats.counts.stopped}</span>
                    </div>
                </div>
            `;
            summaryCardContainer.appendChild(card);
        });
    }

    function showDetailView(ingredient: string, route: string) {
        currentView = 'detail';
        currentIngredient = ingredient;
        const normalizedIng = normalizeString(ingredient);

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

        const details = allData.filter(item => {
            return item.normalizedIngredientName === normalizedIng && item.route === route;
        });

        renderDetailView(details);
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
                <td class="px-4 py-2 text-sm text-gray-900 font-bold text-center align-top">${item.category}</td>
                <td class="px-4 py-2 text-sm text-gray-900 font-bold text-center align-top">${item.route || '-'}</td>
                <td class="px-4 py-2 text-sm align-top"></td>
                <td class="px-4 py-2 text-sm text-gray-500 align-top">${item.ingredientName || ''}</td>
                <td class="px-4 py-2 text-sm align-top"></td>
                <td class="px-4 py-2 text-sm text-gray-700 align-top">${item.reasonForLimitation || '-'}</td>
                <td class="px-4 py-2 text-sm text-gray-700 align-top">${item.resolutionProspect || '-'}</td>
                <td class="px-4 py-2 text-sm text-gray-700 align-top">${item.expectedDate || '-'}</td>
                <td class="px-4 py-2 text-xs text-gray-500 whitespace-nowrap align-top">${formattedDate}</td>
            `;

            const drugNameCell = row.cells[2];

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
            row.cells[4].appendChild(statusBtn);

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
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        カテゴリ ${item.category}
                    </span>
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
});
