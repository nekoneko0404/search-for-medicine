
import { loadAndCacheData, MedicineData } from '../js/data';
import { normalizeString } from '../js/utils';
import { renderStatusButton } from '../js/ui';
import '../js/components/MainHeader';
import '../js/components/MainFooter';
import { summarizeBy9DigitYJ } from '../lab/watchlist/logic';

interface PriceData {
    yj: string;
    recept: string | null;
    name: string;
    oldPrice: number | null;
    newPrice: number | null;
    diff: number | null;
    ratio: number | null;
}

document.addEventListener('DOMContentLoaded', async () => {
    const codeInput = document.getElementById('codeInput') as HTMLTextAreaElement;
    const searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;
    const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
    const resultBody = document.getElementById('resultBody') as HTMLTableSectionElement;
    const codeCountDisplay = document.getElementById('codeCount') as HTMLSpanElement;
    const sortControls = document.getElementById('sortControls') as HTMLDivElement;
    const overlay = document.getElementById('loadingOverlay') as HTMLDivElement;
    const dataTimeDisplay = document.getElementById('dataTime') as HTMLDivElement;

    let priceMaster: PriceData[] = [];
    let supplyData: MedicineData[] = [];
    let supplySummary: Record<string, any> = {};
    let currentResults: any[] = [];

    // Initialize
    async function init() {
        showOverlay(true);
        try {
            // Load Price Data
            const priceRes = await fetch('./data/drug_prices.json');
            priceMaster = await priceRes.json();
            console.log(`Loaded ${priceMaster.length} price records.`);

            // Load Supply Data
            const supplyRes = await loadAndCacheData();
            supplyData = supplyRes.data;
            supplySummary = summarizeBy9DigitYJ(supplyData);

            dataTimeDisplay.textContent = `データ更新: ${supplyRes.date}`;
        } catch (error) {
            console.error('Failed to load data:', error);
            alert('データの読み込みに失敗しました。');
        } finally {
            showOverlay(false);
        }
    }

    init();

    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    clearBtn.addEventListener('click', () => {
        codeInput.value = '';
        updateCodeCount();
    });
    codeInput.addEventListener('input', updateCodeCount);

    function updateCodeCount() {
        const lines = codeInput.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        codeCountDisplay.textContent = `${lines.length} 件の入力`;
    }

    async function handleSearch() {
        const input = codeInput.value.trim();
        if (!input) {
            alert('コードを入力してください。');
            return;
        }

        showOverlay(true);

        // Use setTimeout to allow overlay to show
        setTimeout(() => {
            const lines = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const codes = new Set(lines);

            // Filter master data
            const matched = priceMaster.filter(item =>
                codes.has(item.yj) || (item.recept && codes.has(item.recept))
            );

            // Enhance with supply info
            currentResults = matched.map(item => {
                const supplyItem = supplyData.find(s => s.yjCode === item.yj);
                const yj9 = item.yj.substring(0, 9);
                return {
                    ...item,
                    shipmentStatus: supplyItem ? supplyItem.shipmentStatus : 'データなし',
                    balance: supplySummary[yj9] || { normal: 0, limited: 0, stopped: 0 }
                };
            });

            renderTable(currentResults);
            sortControls.classList.remove('hidden');
            showOverlay(false);

            if (currentResults.length === 0) {
                alert('マッチするデータが見つかりませんでした。');
            }
        }, 100);
    }

    function renderTable(data: any[]) {
        resultBody.innerHTML = '';
        if (data.length === 0) {
            resultBody.innerHTML = '<tr><td colspan="7" class="px-4 py-20 text-center text-slate-400">結果がありません</td></tr>';
            return;
        }

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.className = 'animate-fade-in group';
            row.style.animationDelay = `${Math.min(index * 0.05, 1)}s`;

            const diffClass = item.diff > 0 ? 'price-up' : item.diff < 0 ? 'price-down' : 'price-neutral';
            const diffPrefix = item.diff > 0 ? '+' : '';

            row.innerHTML = `
                <td class="px-4 py-4 text-xs font-mono text-slate-400">${index + 1}</td>
                <td class="px-4 py-4">
                    <div class="font-bold text-slate-800 line-clamp-2">${item.name}</div>
                    <div class="flex gap-2 mt-1">
                        <span class="text-[10px] text-slate-400 font-mono">YJ: ${item.yj}</span>
                        ${item.recept ? `<span class="text-[10px] text-slate-400 font-mono">電: ${item.recept}</span>` : ''}
                    </div>
                </td>
                <td class="px-4 py-4 text-right font-mono text-sm text-slate-600">${item.oldPrice !== null ? item.oldPrice.toFixed(2) : '-'}</td>
                <td class="px-4 py-4 text-right font-mono text-sm text-slate-800 font-bold">${item.newPrice !== null ? item.newPrice.toFixed(2) : '-'}</td>
                <td class="px-4 py-4 text-right">
                    <div class="${diffClass} font-mono text-sm">${item.diff !== null ? diffPrefix + item.diff.toFixed(2) : '-'}</div>
                    <div class="${diffClass} text-[10px] font-bold">${item.ratio !== null ? diffPrefix + item.ratio.toFixed(2) + '%' : ''}</div>
                </td>
                <td class="px-4 py-4 text-center status-cell"></td>
                <td class="px-4 py-4 balance-cell"></td>
            `;

            // Render status button
            const statusCell = row.querySelector('.status-cell') as HTMLElement;
            const statusBtn = renderStatusButton(item.shipmentStatus);
            statusCell.appendChild(statusBtn);

            // Render balance bar
            const balanceCell = row.querySelector('.balance-cell') as HTMLElement;
            renderBalanceBar(balanceCell, item.balance);

            resultBody.appendChild(row);
        });
    }

    function renderBalanceBar(container: HTMLElement, balance: any) {
        const template = document.getElementById('barGraphTemplate') as HTMLTemplateElement;
        const clone = template.content.cloneNode(true) as DocumentFragment;

        const total = balance.normal + balance.limited + balance.stopped;
        if (total > 0) {
            const normalPct = (balance.normal / total) * 100;
            const limitedPct = (balance.limited / total) * 100;
            const stoppedPct = (balance.stopped / total) * 100;

            (clone.querySelector('.bar-normal') as HTMLElement).style.width = `${normalPct}%`;
            (clone.querySelector('.bar-limited') as HTMLElement).style.width = `${limitedPct}%`;
            (clone.querySelector('.bar-stopped') as HTMLElement).style.width = `${stoppedPct}%`;

            (clone.querySelector('.label-normal') as HTMLElement).textContent = `通:${balance.normal}`;
            (clone.querySelector('.label-limited') as HTMLElement).textContent = `限:${balance.limited}`;
            (clone.querySelector('.label-stopped') as HTMLElement).textContent = `停:${balance.stopped}`;
        } else {
            (clone.querySelector('.label-normal') as HTMLElement).textContent = 'データなし';
            (clone.querySelector('.label-limited') as HTMLElement).textContent = '';
            (clone.querySelector('.label-stopped') as HTMLElement).textContent = '';
        }

        container.appendChild(clone);
    }

    // Sort Handlers
    document.getElementById('sortPriceUp')?.addEventListener('click', () => sortAndRender('diff', 'desc'));
    document.getElementById('sortRatioUp')?.addEventListener('click', () => sortAndRender('ratio', 'desc'));
    document.getElementById('sortPriceDown')?.addEventListener('click', () => sortAndRender('diff', 'asc'));
    document.getElementById('sortRatioDown')?.addEventListener('click', () => sortAndRender('ratio', 'asc'));

    function sortAndRender(key: string, dir: 'asc' | 'desc') {
        currentResults.sort((a, b) => {
            const valA = a[key] ?? (dir === 'asc' ? Infinity : -Infinity);
            const valB = b[key] ?? (dir === 'asc' ? Infinity : -Infinity);
            return dir === 'asc' ? valA - valB : valB - valA;
        });
        renderTable(currentResults);
    }

    function showOverlay(show: boolean) {
        overlay.classList.toggle('hidden', !show);
    }
});
