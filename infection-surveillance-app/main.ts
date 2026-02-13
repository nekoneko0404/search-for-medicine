import { InfectionApiResponse, CachedData, PrefectureHistory, Alert, InfectionDataSummary, PrefectureData } from './types';
import './map'; // Ensure map functions are registered on window

// グラフコンテナにローディングスケルトンを表示
function showChartLoading(containerElement: HTMLElement | null) {
    if (!containerElement) return;

    // 既にローディングオーバーレイが存在する場合は何もしない
    if (containerElement.querySelector('.chart-loading-overlay')) {
        return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'chart-loading-overlay';
    overlay.innerHTML = '<div class="chart-loading-skeleton"></div>';

    // コンテナのpositionがstatic以外であることを保証
    if (window.getComputedStyle(containerElement).position === 'static') {
        containerElement.classList.add('position-relative');
    }

    containerElement.appendChild(overlay);
}

// グラフコンテナのローディングスケルトンを非表示
function hideChartLoading(containerElement: HTMLElement | null) {
    if (!containerElement) return;
    const overlay = containerElement.querySelector('.chart-loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

console.log("infection app main.ts loaded");
const API_URL = 'https://script.google.com/macros/s/AKfycby8wh0NMuPtEOgLVHXfc0jzNqlOENuOgCwQmYYzMSZCKTvhSDiJpZkAyJxntGISTGOmbQ/exec';

interface AppCache {
    current: InfectionApiResponse | null;
    archives: any[]; // Define specific archive type if possible
    isLoadingArchives?: boolean;
}

let cachedData: AppCache = {
    current: null, // 当年のデータ
    archives: []   // 過去数年分のデータ
};
let currentDisease = 'Influenza'; // 初期表示疾患

const getDiseaseName = window.getDiseaseName = function (key: string): string {
    const names: { [key: string]: string } = {
        'Influenza': 'インフルエンザ',
        'COVID-19': 'COVID-19',
        'ARI': '急性呼吸器感染症 (ARI)',
        'RSV': 'ＲＳウイルス感染症',
        'PharyngoconjunctivalFever': '咽頭結膜熱',
        'AGS_Pharyngitis': 'Ａ群溶血性レンサ球菌咽頭炎',
        'InfectiousGastroenteritis': '感染性胃腸炎',
        'Chickenpox': '水痘',
        'HandFootMouthDisease': '手足口病',
        'ErythemaInfectiosum': '伝染性紅斑',
        'ExanthemSubitum': '突発性発しん',
        'Herpangina': 'ヘルパンギーナ',
        'Mumps': '流行性耳下腺炎',
        'AcuteHemorrhagicConjunctivitis': '急性出血性結膜炎',
        'EpidemicKeratoconjunctivitis': '流行性角結膜炎',
        'BacterialMeningitis': '細菌性髄膜炎',
        'AsepticMeningitis': '無菌性髄膜炎',
        'MycoplasmaPneumonia': 'マイコプラズマ肺炎',
        'ChlamydiaPneumonia': 'クラミジア肺炎',
        'RotavirusGastroenteritis': '感染性胃腸炎（ロタウイルス）'
    };
    return names[key] || key;
};

const ALL_DISEASES = [ // 全疾患リスト
    { key: 'Influenza', name: 'インフルエンザ' },
    { key: 'COVID-19', name: 'COVID-19' },
    { key: 'ARI', name: '急性呼吸器感染症' },
    // ... complete list implied or copied if needed, using shortened for brevity as logic uses filters
    { key: 'RSV', name: 'ＲＳウイルス感染症' },
    { key: 'PharyngoconjunctivalFever', name: '咽頭結膜熱' },
    { key: 'AGS_Pharyngitis', name: 'Ａ群溶血性レンサ球菌咽頭炎' },
    { key: 'InfectiousGastroenteritis', name: '感染性胃腸炎' },
    { key: 'Chickenpox', name: '水痘' },
    { key: 'HandFootMouthDisease', name: '手足口病' },
    { key: 'ErythemaInfectiosum', name: '伝染性紅斑' },
    { key: 'ExanthemSubitum', name: '突発性発しん' },
    { key: 'Herpangina', name: 'ヘルパンギーナ' },
    { key: 'Mumps', name: '流行性耳下腺炎' },
    { key: 'AcuteHemorrhagicConjunctivitis', name: '急性出血性結膜炎' },
    { key: 'EpidemicKeratoconjunctivitis', name: '流行性角結膜炎' },
    { key: 'BacterialMeningitis', name: '細菌性髄膜炎' },
    { key: 'AsepticMeningitis', name: '無菌性髄膜炎' },
    { key: 'MycoplasmaPneumonia', name: 'マイコプラズマ肺炎' },
    { key: 'ChlamydiaPneumonia', name: 'クラミジア肺炎' },
    { key: 'RotavirusGastroenteritis', name: '感染性胃腸炎（ロタウイルス）' }
];

let currentChart: any = null;
let currentRegionId: string | null = null;
let currentPrefecture: string | null = null;

// 地域選択（簡易実装：地方単位）
window.setCurrentRegion = function (regionId: string) {
    currentRegionId = regionId;
    currentPrefecture = null;
    console.log(`Region selected: ${regionId}`);
};

const CACHE_CONFIG = {
    CURRENT_DATA_KEY: 'infection_surveillance_current_data_v1',
    ARCHIVE_DATA_KEY: 'infection_surveillance_archive_data_v1',
    MAIN_EXPIRY: 1 * 60 * 60 * 1000,
    HISTORY_EXPIRY: 24 * 60 * 60 * 1000
};

// localforage instance is assumed to be global from index.html

async function fetchCurrentData(): Promise<InfectionApiResponse> {
    const now = Date.now();
    try {
        const cached = await window.localforage.getItem(CACHE_CONFIG.CURRENT_DATA_KEY);
        if (cached && (now - cached.timestamp < CACHE_CONFIG.MAIN_EXPIRY)) {
            return cached.data;
        }
    } catch (e) {
        console.warn('Current data cache check failed:', e);
    }

    try {
        const response = await fetch(`${API_URL}?type=current`, {
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // APIからのエラーレスポンスをチェック
        if (data && data.status === 'error') {
            throw new Error(`API Error: ${data.message}`);
        }

        try {
            await window.localforage.setItem(CACHE_CONFIG.CURRENT_DATA_KEY, {
                timestamp: now,
                data: data
            });
        } catch (e) {
            console.warn('Current data cache save failed:', e);
        }

        return data;
    } catch (e) {
        console.error('Fetch error for current data:', e);
        throw e;
    }
}

async function fetchArchiveData() {
    const now = Date.now();
    try {
        const cached = await window.localforage.getItem(CACHE_CONFIG.ARCHIVE_DATA_KEY);
        if (cached && (now - cached.timestamp < CACHE_CONFIG.HISTORY_EXPIRY)) {
            return cached.data;
        }
    } catch (e) {
        console.warn('Archive data cache check failed:', e);
    }

    try {
        const response = await fetch(`${API_URL}?type=history`, {
            redirect: 'follow'
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        try {
            await window.localforage.setItem(CACHE_CONFIG.ARCHIVE_DATA_KEY, {
                timestamp: now,
                data: data
            });
        } catch (e) {
            console.warn('Archive data cache save failed:', e);
        }

        return data;
    } catch (e) {
        console.error('Fetch error for archive data:', e);
        throw e;
    }
}

function renderSummary(data: AppCache) {
    const container = document.getElementById('summary-cards');
    if (!container || !data.current) return;

    // Clear previous content safely
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // 主要な疾患のみサマリーカードを表示
    const diseasesForSummary = ALL_DISEASES.filter(d => ['Influenza', 'COVID-19', 'ARI'].includes(d.key));

    diseasesForSummary.forEach(diseaseObj => {
        const diseaseKey = diseaseObj.key;
        const nationalData = data.current!.data.find((d: PrefectureData) => d.disease === diseaseKey && d.prefecture === '全国');
        const alert = data.current!.summary.alerts.find((a: Alert) => a.disease === diseaseKey);

        const card = document.createElement('div');
        card.className = `card ${currentDisease === diseaseKey ? 'active' : ''}`;
        card.dataset.disease = diseaseKey;
        if (alert) {
            card.dataset.status = alert.level;
        } else {
            card.dataset.status = 'normal';
        }

        card.onclick = () => switchDisease(diseaseKey);

        const h4 = document.createElement('h4');
        h4.textContent = getDiseaseName(diseaseKey);
        card.appendChild(h4);

        const pValue = document.createElement('p');
        pValue.className = 'value';
        pValue.textContent = `${nationalData ? nationalData.value.toFixed(2) : '-'}`;
        const spanUnit = document.createElement('span');
        spanUnit.className = 'unit';
        spanUnit.textContent = ' 定点当たり';
        pValue.appendChild(spanUnit);
        card.appendChild(pValue);

        const pStatus = document.createElement('p');
        pStatus.className = `status ${alert ? alert.level : 'normal'}`;
        pStatus.textContent = alert ? alert.message : 'データなし';
        card.appendChild(pStatus);

        container.appendChild(card);
    });
}

window.switchDisease = function (disease: string) {
    currentDisease = disease;

    document.querySelectorAll('.summary-cards .card').forEach(card => {
        const el = card as HTMLElement;
        el.classList.toggle('active', el.dataset.disease === disease);
    });

    const otherDiseasesListView = document.getElementById('other-diseases-list-view');
    const isOtherDiseasesViewActive = otherDiseasesListView && !otherDiseasesListView.classList.contains('hidden');

    if (isOtherDiseasesViewActive) {
        renderOtherDiseasesList(currentPrefecture || '全国');
    } else if (currentPrefecture) {
        showPrefectureChart(currentPrefecture, disease);
    } else {
        switchView('main-view');
    }

    if (!currentPrefecture) {
        if (currentRegionId && typeof window.updateDetailPanel === 'function' && cachedData.current) {
            window.updateDetailPanel(currentRegionId, cachedData as any, disease, currentPrefecture);
        } else {
            closePanel();
        }
    } else {
        if (typeof window.getRegionIdByPrefecture === 'function' && typeof window.updateDetailPanel === 'function' && cachedData.current) {
            const regionId = window.getRegionIdByPrefecture(currentPrefecture);
            if (regionId) {
                window.updateDetailPanel(regionId, cachedData as any, disease, currentPrefecture);
            } else {
                closePanel();
            }
        } else {
            closePanel();
        }
    }

    if (cachedData) {
        renderDashboard(disease, cachedData);
    }
};

function switchDisease(disease: string) {
    window.switchDisease(disease);
}

// 全都道府県・全期間の最大値を取得する関数
function getGlobalMaxForDisease(disease: string): number {
    let max = 0;
    // Current year
    if (cachedData.current && cachedData.current.history) {
        cachedData.current.history.forEach((h: PrefectureHistory) => {
            if (h.disease === disease) {
                h.history.forEach(item => {
                    if (item.value > max) max = item.value;
                });
            }
        });
    }
    // Archives
    if (cachedData.archives) {
        cachedData.archives.forEach(archive => {
            if (archive.data) {
                archive.data.forEach((h: PrefectureHistory) => {
                    if (h.disease === disease) {
                        h.history.forEach(item => {
                            if (item.value > max) max = item.value;
                        });
                    }
                });
            }
        });
    }
    return max;
}

// 比較グラフを描画する汎用関数
function renderComparisonChart(canvasId: string, diseaseKey: string, prefecture: string, yearDataSets: any[], yAxisMax: number | null = null, loadingTargetElement: HTMLElement | null = null) {
    if (loadingTargetElement) {
        showChartLoading(loadingTargetElement);
    }

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
        console.warn(`Canvas element with ID '${canvasId}' not found.`);
        if (loadingTargetElement) {
            hideChartLoading(loadingTargetElement);
            loadingTargetElement.innerHTML = '<p class="no-data-message">グラフを描画できませんでした。</p>';
        }
        return;
    }
    const ctx = canvas.getContext('2d');

    if ((canvas as any).chart) {
        (canvas as any).chart.destroy();
    }

    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const isMobile = window.innerWidth <= 768;

    const labels = Array.from({ length: 53 }, (_, i) => `${i + 1}週`);

    const createDataset = (ds: any) => {
        const year = ds.year;
        let borderColor;
        let borderWidth;
        let pointRadius = 1;

        if (year === new Date().getFullYear()) {
            const validDataPoints = ds.data.filter((d: any) => d && d.value !== null && d.value !== undefined);
            const lastDataPoint = validDataPoints.length > 0 ? validDataPoints[validDataPoints.length - 1] : { value: 0, week: 0 };
            borderColor = window.getColorForValue ? window.getColorForValue(lastDataPoint.value, diseaseKey) : '#000';
            borderWidth = 3;
            pointRadius = 2.5;
        } else if (year === new Date().getFullYear() - 1) {
            borderColor = '#A9CCE3';
            borderWidth = 2;
        } else {
            borderColor = '#E0E0E0';
            borderWidth = 1;
        }

        if (canvasId.startsWith('chart-')) {
            pointRadius = 0;
        }
        const dataLabel = `${year}年`;

        const dataset: any = {
            label: dataLabel,
            data: labels.map(weekLabel => {
                const week = parseInt(weekLabel);
                const item = ds.data.find((d: any) => d.week === week);
                return item ? item.value : null;
            }),
            borderColor: borderColor,
            borderWidth: borderWidth,
            pointRadius: pointRadius,
            fill: false,
            tension: 0.1,
            spanGaps: true,
            _originalColor: borderColor,
            _originalBorderWidth: borderWidth,
            disease: diseaseKey,
            year: year
        };

        if (year === new Date().getFullYear()) {
            dataset.segment = {
                borderColor: (ctx: any) => {
                    if (!ctx.p1 || !ctx.p1.parsed) return borderColor;
                    const val = ctx.p1.parsed.y;
                    if (typeof window.getColorForValue === 'function') {
                        return window.getColorForValue(val, diseaseKey);
                    }
                    return borderColor;
                }
            };
            dataset.pointBackgroundColor = (ctx: any) => {
                const val = ctx.parsed.y;
                if (typeof window.getColorForValue === 'function') {
                    return window.getColorForValue(val, diseaseKey);
                }
                return borderColor;
            };
            dataset.pointBorderColor = (ctx: any) => {
                const val = ctx.parsed.y;
                if (typeof window.getColorForValue === 'function') {
                    return window.getColorForValue(val, diseaseKey);
                }
                return borderColor;
            };
        }
        return dataset;
    };

    const sortedSets = yearDataSets.sort((a, b) => b.year - a.year);
    const datasets = sortedSets.map(createDataset);

    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, title: { display: true, text: '定点当たり報告数' }, suggestedMax: yAxisMax },
                x: {
                    title: { display: true, text: '週' },
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                        autoSkipPadding: 10
                    }
                }
            },
            interaction: { intersect: false, mode: 'index', axis: 'x' },
            elements: { point: { hitRadius: 20, hoverRadius: 4 }, line: { borderCapStyle: 'round', borderJoinStyle: 'round' } },
            plugins: {
                title: { display: false, text: `${prefecture} ${getDiseaseName(diseaseKey)} 週次推移`, font: { size: 16, family: "'Noto Sans JP', sans-serif" } },
                tooltip: { enabled: !isMobile, mode: 'index', intersect: false, position: 'nearest', bodyFont: { size: isMobile ? 14 : 13 }, titleFont: { size: isMobile ? 14 : 13 }, padding: 10, boxPadding: 4, backgroundColor: 'rgba(0, 0, 0, 0.8)', titleColor: '#fff', bodyColor: '#fff', footerColor: '#fff' },
                legend: {
                    display: true, position: 'bottom', labels: { boxWidth: 10, padding: 10, font: { size: isMobile ? 11 : 12 }, usePointStyle: true, pointStyle: 'rectRounded' },
                    onClick: function (e: any, legendItem: any, legend: any) {
                        if (e.native) { e.native.stopPropagation(); }
                        const index = legendItem.datasetIndex;
                        const chart = legend.chart;
                        const datasets = chart.data.datasets;
                        const clickedDataset = datasets[index];

                        if (!clickedDataset._originalColor) {
                            clickedDataset._originalColor = clickedDataset.borderColor;
                            clickedDataset._originalBorderWidth = clickedDataset.borderWidth;
                        }

                        const isClickedActive = clickedDataset.borderColor === clickedDataset._originalColor;
                        const areOthersDimmed = datasets.some((ds: any, i: number) => i !== index && ds.borderColor === 'rgba(200, 200, 200, 0.2)');

                        if (isClickedActive && areOthersDimmed) {
                            datasets.forEach((ds: any) => {
                                ds.borderColor = ds._originalColor;
                                ds.borderWidth = ds._originalBorderWidth;
                            });
                        } else {
                            datasets.forEach((ds: any, i: number) => {
                                if (i !== index) {
                                    ds.borderColor = 'rgba(200, 200, 200, 0.2)';
                                    ds.borderWidth = 1;
                                } else {
                                    ds.borderColor = ds._originalColor;
                                    ds.borderWidth = 3;
                                }
                            });
                        }
                        chart.update();
                    }
                }
            },
            animation: { duration: 0 }
        }
    };

    const initializeChart = () => {
        if ((canvas as any).chart) {
            (canvas as any).chart.destroy();
        }
        (canvas as any).chart = new window.Chart(ctx, chartConfig);
        if (loadingTargetElement) {
            hideChartLoading(loadingTargetElement);
        }
    };

    const container = loadingTargetElement || canvas.parentElement;
    if (container && typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                observer.disconnect();
                initializeChart();
            }
        });
        observer.observe(container);
    } else {
        setTimeout(initializeChart, 50);
    }
}

function renderDashboard(disease: string, data: AppCache) {
    if (!data.current) return;
    const chartView = document.getElementById('chart-view');
    if (chartView) {
        showChartLoading(chartView);
    }
    renderTrendChart(disease, data.current);
    if (chartView) {
        hideChartLoading(chartView);
    }

    if (typeof window.renderJapanMap === 'function') {
        const mapContainer = document.getElementById('japan-map');
        if (mapContainer) {
            requestAnimationFrame(() => {
                window.renderJapanMap('japan-map', data.current!, disease);
            });
        }
    }
}

function renderTrendChart(disease: string, data: InfectionApiResponse) {
    const chartView = document.getElementById('chart-view');
    if (!chartView) return;

    showChartLoading(chartView);

    while (chartView.firstChild) {
        chartView.removeChild(chartView.firstChild);
    }
    const canvas = document.createElement('canvas');
    canvas.id = 'trendChart';
    chartView.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    if (currentChart) {
        currentChart.destroy();
    }

    const diseaseData = data.data
        .filter(d => d.disease === disease && d.prefecture !== '全国')
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    const labels = diseaseData.map(d => d.prefecture);
    const values = diseaseData.map(d => d.value);
    const backgroundColors = values.map(v => (typeof window.getColorForValue === 'function' ? window.getColorForValue(v, disease) : '#3498db'));

    if (labels.length === 0) {
        hideChartLoading(chartView);
        const p = document.createElement('p');
        p.className = 'no-data-message';
        p.textContent = 'データがありません。';
        chartView.appendChild(p);
        return;
    }

    currentChart = new window.Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '定点当たり報告数',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: `${getDiseaseName(disease)} 都道府県別 報告数 Top 10`,
                    font: { size: 14, family: "'Noto Sans JP', sans-serif" }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: '定点当たり報告数' }
                },
                y: { ticks: { autoSkip: false } }
            }
        }
    });
    hideChartLoading(chartView);
}

function getYearDataSets(diseaseKey: string, prefecture: string) {
    const yearDataSets: any[] = [];
    const currentYear = new Date().getFullYear();
    const addedYears = new Set();

    if (cachedData.current && cachedData.current.history) {
        const currentHistory = cachedData.current.history.find((h: PrefectureHistory) => h.disease === diseaseKey && h.prefecture === prefecture);
        if (currentHistory) {
            yearDataSets.push({ year: currentYear, data: currentHistory.history });
            addedYears.add(currentYear);
        }
    }

    if (cachedData.archives && cachedData.archives.length > 0) {
        cachedData.archives.forEach(archive => {
            const archiveYear = parseInt(archive.year);
            if (addedYears.has(archiveYear)) {
                return;
            }

            const archiveHistory = archive.data ? archive.data.find((d: PrefectureHistory) => d.disease === diseaseKey && d.prefecture === prefecture) : null;
            if (archiveHistory) {
                yearDataSets.push({ year: archive.year, data: archiveHistory.history });
                addedYears.add(archiveYear);
            }
        });
    }

    return yearDataSets;
}

function openExpandedChart(diseaseKey: string, prefecture: string) {
    closeExpandedChart();

    const modal = document.createElement('div');
    modal.className = 'disease-card expanded expanded-modal modal-expanded';
    modal.dataset.disease = diseaseKey;

    const header = document.createElement('div');
    header.className = 'card-header';
    const h4 = document.createElement('h4');
    h4.textContent = `${prefecture} ${getDiseaseName(diseaseKey)}`;
    header.appendChild(h4);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-expanded-btn modal-close-button';
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', '閉じる');
    closeBtn.onclick = closeExpandedChart;
    modal.appendChild(closeBtn);
    modal.appendChild(header);

    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    const canvasId = `expanded-chart-${diseaseKey}`;
    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    chartContainer.appendChild(canvas);
    modal.appendChild(chartContainer);

    document.body.appendChild(modal);

    const backdrop = document.getElementById('card-backdrop');
    if (backdrop) {
        backdrop.classList.add('active');
        const cleanupBackdrop = () => {
            closeExpandedChart();
            backdrop.removeEventListener('click', cleanupBackdrop);
        };
        backdrop.addEventListener('click', cleanupBackdrop);
    }

    const yearDataSets = getYearDataSets(diseaseKey, prefecture);
    const globalMax = getGlobalMaxForDisease(diseaseKey);
    requestAnimationFrame(() => {
        renderComparisonChart(canvasId, diseaseKey, prefecture, yearDataSets, globalMax, chartContainer);
    });
}

function closeExpandedChart() {
    const modal = document.querySelector('.disease-card.expanded-modal') as HTMLElement;
    if (modal) {
        const canvas = modal.querySelector('canvas');
        if (canvas && (canvas as any).chart) {
            (canvas as any).chart.destroy();
        }
        modal.remove();
    }
    const backdrop = document.getElementById('card-backdrop');
    if (backdrop) {
        backdrop.classList.remove('active');
    }
}

const showPrefectureChart = window.showPrefectureChart = function (prefecture: string, disease: string) {
    currentPrefecture = prefecture;
    currentRegionId = null;

    const mapView = document.getElementById('map-view');
    if (mapView) mapView.classList.add('hidden');
    const prefChartContainer = document.getElementById('pref-chart-container');
    if (!prefChartContainer) return;

    prefChartContainer.classList.remove('hidden');
    prefChartContainer.innerHTML = '';

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('pref-chart-header');

    const titleH3 = document.createElement('h3');
    titleH3.textContent = `${prefecture} ${getDiseaseName(disease)}`;
    titleH3.classList.add('pref-chart-title');
    headerDiv.appendChild(titleH3);

    const backButton = document.createElement('button');
    backButton.id = 'back-to-map-btn';
    backButton.textContent = '戻る';
    headerDiv.appendChild(backButton);

    prefChartContainer.appendChild(headerDiv);

    backButton.addEventListener('click', () => {
        const mv = document.getElementById('map-view');
        if (mv) mv.classList.remove('hidden');
        if (prefChartContainer) prefChartContainer.classList.add('hidden');
        currentPrefecture = null;

        if (currentRegionId && typeof window.updateDetailPanel === 'function' && cachedData.current) {
            window.updateDetailPanel(currentRegionId, cachedData as any, currentDisease, null);
        }
    });

    if (typeof window.getRegionIdByPrefecture === 'function' && typeof window.updateDetailPanel === 'function' && cachedData.current) {
        const regionId = window.getRegionIdByPrefecture(prefecture);
        if (regionId) {
            window.updateDetailPanel(regionId, cachedData as any, disease, prefecture);
        }
    }

    if (disease === 'ARI') {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'pref-chart-wrapper pref-chart-message-wrapper';
        prefChartContainer.appendChild(messageWrapper);

        const messageP = document.createElement('p');
        messageP.className = 'pref-chart-message';
        messageP.textContent = '急性呼吸器感染症 (ARI) の週次推移データはありません。';
        messageWrapper.appendChild(messageP);
        return;
    }

    const chartWrapper = document.createElement('div');
    chartWrapper.className = 'pref-chart-wrapper';
    prefChartContainer.appendChild(chartWrapper);

    showChartLoading(chartWrapper);

    const canvas = document.createElement('canvas');
    canvas.id = 'prefectureHistoryChart';
    chartWrapper.appendChild(canvas);

    const yearDataSets: any[] = [];
    const currentYear = new Date().getFullYear();

    if (cachedData.current) {
        const currentYearHistory = cachedData.current.history.find((h: PrefectureHistory) => h.disease === disease && h.prefecture === prefecture);
        if (currentYearHistory) {
            yearDataSets.push({ year: currentYear, data: currentYearHistory.history });
        }
    }

    if (cachedData.archives) {
        cachedData.archives.forEach(archive => {
            if (parseInt(archive.year) === currentYear) return;
            const history = archive.data.find((d: PrefectureHistory) => d.disease === disease && d.prefecture === prefecture);
            if (history) {
                yearDataSets.push({ year: archive.year, data: history.history });
            }
        });
    }

    const isLoadingArchives = cachedData.isLoadingArchives;

    if (yearDataSets.length === 0 && !isLoadingArchives) {
        hideChartLoading(chartWrapper);
        const p = document.createElement('p');
        p.classList.add('no-data-message-inline');
        p.textContent = 'データがありません。';
        chartWrapper.innerHTML = '';
        chartWrapper.appendChild(p);
    } else {
        const globalMax = getGlobalMaxForDisease(disease);
        renderComparisonChart('prefectureHistoryChart', disease, prefecture, yearDataSets, globalMax, chartWrapper);

        if (isLoadingArchives) {
            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'archive-loading-indicator';
            loadingMsg.textContent = '過去のデータを読み込み中...';
            loadingMsg.style.position = 'absolute';
            loadingMsg.style.top = '10px';
            loadingMsg.style.right = '10px';
            loadingMsg.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            loadingMsg.style.padding = '4px 8px';
            loadingMsg.style.borderRadius = '4px';
            loadingMsg.style.fontSize = '12px';
            loadingMsg.style.color = '#666';
            loadingMsg.style.zIndex = '10';
            chartWrapper.style.position = 'relative';
            chartWrapper.appendChild(loadingMsg);

            hideChartLoading(chartWrapper);
        } else {
            hideChartLoading(chartWrapper);
        }
    }
};

window.showPrefectureChart = showPrefectureChart;

function switchView(viewId: string) {
    const views = ['main-view', 'other-diseases-list-view'];
    views.forEach(id => {
        const viewElement = document.getElementById(id);
        if (viewElement) {
            if (id === viewId) {
                viewElement.classList.remove('hidden');
            } else {
                viewElement.classList.add('hidden');
            }
        }
    });
}

function renderOtherDiseasesList(prefecture = '全国') {
    const gridContainer = document.getElementById('other-diseases-grid');
    if (!gridContainer) return;

    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }

    const titleElement = document.getElementById('other-diseases-title');
    if (titleElement) {
        titleElement.textContent = `その他の感染症（${prefecture}）`;
    }

    const prefSelect = document.getElementById('prefecture-select') as HTMLSelectElement;
    if (prefSelect) {
        prefSelect.value = prefecture;
    }

    const otherDiseases = ALL_DISEASES.filter(d => !['Influenza', 'COVID-19', 'ARI'].includes(d.key));

    const diseaseCards: any[] = [];
    otherDiseases.forEach(disease => {
        const card = document.createElement('div');
        card.className = 'disease-card';
        card.dataset.disease = disease.key;

        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';

        const h4 = document.createElement('h4');
        h4.textContent = disease.name;

        const expandButton = document.createElement('button');
        expandButton.className = 'expand-action-btn';
        expandButton.setAttribute('aria-label', '拡大表示');
        expandButton.innerHTML = '';

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M12 5v14M5 12h14");

        svg.appendChild(path);
        expandButton.appendChild(svg);

        cardHeader.appendChild(h4);
        cardHeader.appendChild(expandButton);
        card.appendChild(cardHeader);

        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container';
        const canvas = document.createElement('canvas');
        canvas.id = `chart-${disease.key}`;
        chartContainer.appendChild(canvas);
        card.appendChild(chartContainer);

        gridContainer.appendChild(card);

        showChartLoading(chartContainer);

        const expandBtn = card.querySelector('.expand-action-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openExpandedChart(disease.key, prefecture);
            });
        }

        diseaseCards.push({
            disease,
            chartContainer,
            canvas
        });
    });

    requestAnimationFrame(() => {
        let index = 0;

        function renderNextChart() {
            if (index >= diseaseCards.length) return;

            const { disease, chartContainer } = diseaseCards[index];

            const yearDataSets = getYearDataSets(disease.key, prefecture);

            if (yearDataSets.length > 0) {
                const globalMax = getGlobalMaxForDisease(disease.key);
                renderComparisonChart(`chart-${disease.key}`, disease.key, prefecture, yearDataSets, globalMax, chartContainer);
            } else {
                hideChartLoading(chartContainer);
                const p = document.createElement('p');
                p.textContent = 'データがありません';

                while (chartContainer.firstChild) {
                    chartContainer.removeChild(chartContainer.firstChild);
                }
                chartContainer.appendChild(p);
                chartContainer.classList.add('chart-container-no-data');
            }

            index++;

            if (index < diseaseCards.length) {
                setTimeout(renderNextChart, 0);
            }
        }

        renderNextChart();
    });
}

function closePanel() {
    const content = document.getElementById('region-content');
    if (content) {
        const p = document.createElement('p');
        p.className = 'placeholder-text';
        p.textContent = '地図上のエリアをクリックすると詳細が表示されます。';
        content.replaceChildren(p);
    }
    const title = document.getElementById('region-title');
    if (title) {
        title.textContent = '地域詳細';
    }
}

function updateLoadingState(isLoading: boolean) {
    const container = document.body;
    if (isLoading) {
        container.classList.add('loading');
    } else {
        container.classList.remove('loading');
    }
}

async function reloadData() {
    try {
        updateLoadingState(true);

        if (currentChart) {
            currentChart.destroy();
            currentChart = null;
        }
        const prefectureHistoryChartCanvas = document.getElementById('prefectureHistoryChart') as any;
        if (prefectureHistoryChartCanvas && prefectureHistoryChartCanvas.chart) {
            prefectureHistoryChartCanvas.chart.destroy();
        }

        const summaryCardsContainer = document.getElementById('summary-cards');
        if (summaryCardsContainer) {
            summaryCardsContainer.innerHTML = '';
            const skeletonWrapper = document.createElement('div');
            skeletonWrapper.className = 'skeleton-card-wrapper';
            for (let i = 0; i < 5; i++) {
                const skeletonCard = document.createElement('div');
                skeletonCard.className = 'skeleton-card';
                skeletonCard.innerHTML = '<div class="skeleton skeleton-title"></div><div class="skeleton skeleton-value"></div><div class="skeleton skeleton-status"></div>';
                skeletonWrapper.appendChild(skeletonCard);
            }
            summaryCardsContainer.appendChild(skeletonWrapper);
        }

        const japanMapContainer = document.getElementById('japan-map');
        if (japanMapContainer) {
            japanMapContainer.innerHTML = '';
            const skeletonMap = document.createElement('div');
            skeletonMap.className = 'skeleton skeleton-map';
            japanMapContainer.appendChild(skeletonMap);
        }

        const chartView = document.getElementById('chart-view');
        if (chartView) {
            chartView.innerHTML = '';
            showChartLoading(chartView);
        }

        const regionContent = document.getElementById('region-content');
        if (regionContent && currentRegionId) {
            regionContent.innerHTML = '';
            const skeletonRegionDetail = document.createElement('div');
            skeletonRegionDetail.className = 'skeleton skeleton-chart large';
            regionContent.appendChild(skeletonRegionDetail);
        }

        await window.localforage.removeItem(CACHE_CONFIG.CURRENT_DATA_KEY);
        await window.localforage.removeItem(CACHE_CONFIG.ARCHIVE_DATA_KEY);
        console.log('Cache cleared for infection data reload.');

        await loadAndRenderData();

        if (currentRegionId && typeof window.updateDetailPanel === 'function' && cachedData.current) {
            window.updateDetailPanel(currentRegionId, cachedData as any, currentDisease, currentPrefecture);
        }

        if (currentPrefecture) {
            showPrefectureChart(currentPrefecture, currentDisease);
        }

        const otherDiseasesListView = document.getElementById('other-diseases-list-view');
        if (otherDiseasesListView && !otherDiseasesListView.classList.contains('hidden')) {
            const prefSelect = document.getElementById('prefecture-select') as HTMLSelectElement;
            renderOtherDiseasesList(prefSelect ? prefSelect.value : '全国');
        }

    } catch (error: any) {
        console.error('Error reloading data:', error);
        const summaryCards = document.getElementById('summary-cards');
        if (summaryCards) {
            while (summaryCards.firstChild) {
                summaryCards.removeChild(summaryCards.firstChild);
            }
            const errorPara = document.createElement('p');
            errorPara.className = 'error';
            errorPara.textContent = `データの再取得に失敗しました。詳細: ${error.message}`;
            summaryCards.appendChild(errorPara);
        }
    } finally {
        updateLoadingState(false);
    }
}

function initEventListeners() {
    const accordionToggle = document.getElementById('accordion-toggle');
    const accordionContent = document.getElementById('accordion-content');
    if (accordionToggle && accordionContent) {
        accordionToggle.addEventListener('click', () => {
            accordionContent.classList.toggle('open');
            accordionToggle.classList.toggle('open');
        });
    }

    const reloadBtn = document.getElementById('reload-btn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', reloadData);
    }

    const closeBtn = document.getElementById('detail-panel-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePanel);
    }

    const backdrop = document.getElementById('card-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            if (document.querySelector('.disease-card.expanded-modal')) {
                closeExpandedChart();
            }
            const oldExpandedCard = document.querySelector('.disease-card.expanded:not(.expanded-modal)');
            if (oldExpandedCard) {
                oldExpandedCard.classList.remove('expanded');
                backdrop.classList.remove('active');
            }
        });
    }

    const backBtn = document.getElementById('back-to-map-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('map-view')?.classList.remove('hidden');
            document.getElementById('pref-chart-container')?.classList.add('hidden');
            currentPrefecture = null;
        });
    }

    const otherDiseasesBtn = document.getElementById('other-diseases-btn');
    if (otherDiseasesBtn) {
        otherDiseasesBtn.addEventListener('click', () => {
            const currentView = document.getElementById('other-diseases-list-view');
            const isOtherDiseasesView = currentView && !currentView.classList.contains('hidden');

            if (isOtherDiseasesView) {
                otherDiseasesBtn.textContent = 'その他の感染症';
                document.getElementById('summary-cards')?.classList.remove('hidden');
                switchView('main-view');
            } else {
                otherDiseasesBtn.textContent = 'インフルエンザ・COVID-19';
                document.getElementById('summary-cards')?.classList.add('hidden');
                switchView('other-diseases-list-view');
                renderOtherDiseasesList(currentPrefecture || '全国');
            }

            const prefSelect = document.getElementById('prefecture-select') as HTMLSelectElement;
            if (prefSelect && prefSelect.options.length <= 1) {
                const prefectures = [
                    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
                    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
                    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
                    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
                    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
                    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
                    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
                ];
                prefectures.forEach(pref => {
                    const option = document.createElement('option');
                    option.value = pref;
                    option.textContent = pref;
                    prefSelect.appendChild(option);
                });

                if (currentPrefecture) {
                    prefSelect.value = currentPrefecture;
                }

                prefSelect.addEventListener('change', (e: Event) => {
                    renderOtherDiseasesList((e.target as HTMLSelectElement).value);
                });
            }
        });
    }
}

async function loadAndRenderData() {
    try {
        const now = Date.now();
        let currentData = null;

        try {
            const cached = await window.localforage.getItem(CACHE_CONFIG.CURRENT_DATA_KEY);
            if (cached && (now - cached.timestamp < CACHE_CONFIG.MAIN_EXPIRY)) {
                currentData = cached.data;
            }
        } catch (e) {
            console.warn('Current data cache check failed:', e);
        }

        if (!currentData) {
            currentData = await fetchCurrentData();
        }

        cachedData.current = currentData;

        // @ts-ignore: Assuming meta exists on response
        if (cachedData.current && cachedData.current.meta && cachedData.current.meta.dateInfo) {
            // @ts-ignore
            updateDateDisplay(cachedData.current.meta.dateInfo);
        } else {
            updateDateDisplay('');
        }

        renderSummary(cachedData);
        renderDashboard(currentDisease, cachedData);
        updateLoadingState(false);

        cachedData.isLoadingArchives = true;
        fetchArchiveData().then(archives => {
            console.log('Archives loaded in background:', archives.length, 'years');
            cachedData.archives = archives;
            cachedData.isLoadingArchives = false;

            refreshDynamicViewsIfNeeded();
        }).catch(err => {
            console.warn('Background archive fetch failed:', err);
            cachedData.isLoadingArchives = false;
            refreshDynamicViewsIfNeeded();
        });

    } catch (e) {
        console.error('Error in loadAndRenderData:', e);
        throw e;
    }
}

function refreshDynamicViewsIfNeeded() {
    if (currentPrefecture) {
        showPrefectureChart(currentPrefecture, currentDisease);
    }

    const otherDiseasesListView = document.getElementById('other-diseases-list-view');
    if (otherDiseasesListView && !otherDiseasesListView.classList.contains('hidden')) {
        const prefSelect = document.getElementById('prefecture-select') as HTMLSelectElement;
        renderOtherDiseasesList(prefSelect ? prefSelect.value : '全国');
    }
}

function updateDateDisplay(dateString: string) {
    const dateElement = document.getElementById('update-date');
    if (!dateElement) return;

    const dateMatch = dateString.match(/(\d{4})年(\d{1,2})週(?:\((.*?)\))?/);
    if (dateMatch) {
        const year = dateMatch[1];
        const week = dateMatch[2];
        let dateRange = dateMatch[3];

        if (dateRange) {
            dateRange = dateRange.replace(/月/g, '/').replace(/日/g, '').replace(/[〜~]/g, '～');
            dateElement.textContent = `${year}年 第${week}週 （${dateRange}）`;
        } else {
            dateElement.textContent = `${year}年 第${week}週`;
        }
    } else {
        dateElement.textContent = new Date().toLocaleDateString('ja-JP');
    }
}

async function init() {
    try {
        updateLoadingState(true);

        initEventListeners();
        console.log("DEBUG: initEventListeners called");

        await loadAndRenderData();

        updateLoadingState(false);

    } catch (error: any) {
        console.error('Error fetching data:', error);
        const summaryCards = document.getElementById('summary-cards');
        if (summaryCards) {
            while (summaryCards.firstChild) {
                summaryCards.removeChild(summaryCards.firstChild);
            }
            const errorPara = document.createElement('p');
            errorPara.className = 'error';
            errorPara.textContent = `データの取得に失敗しました。詳細: ${error.message}`;
            summaryCards.appendChild(errorPara);
        }
        updateLoadingState(false);
    }
}

document.addEventListener('DOMContentLoaded', init);

// Expose functions for map.js logic wrapper is handled by importing map.js which assigns global functions
