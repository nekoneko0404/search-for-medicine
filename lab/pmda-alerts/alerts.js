// GASのAPI URL（ユーザーがデプロイした後に設定）
const GAS_API_URL = '';

// モックデータ（GASが未設定の場合のデモ用）
const MOCK_ALERTS = [
    {
        date: "2026/02/10",
        type: "emergency",
        typeLabel: "緊急安全性情報",
        title: "◯◯抗生剤の使用に関する緊急安全性情報（イエローレター）",
        desc: "重篤な副作用（アナフィラキシー）の報告が相次いだため、投与前の問診と経過観察を徹底してください。",
        url: "https://www.pmda.go.jp/safety/info-services/drugs/calling-attention/safety-info/0001.html"
    },
    {
        date: "2026/02/08",
        type: "recall",
        typeLabel: "クラスII自主回収",
        title: "△△錠10mg 自主回収のお知らせ（溶出試験不適合）",
        desc: "安定性試験において溶出率が承認規格を外れる可能性が否定できないため、当該ロットの自主回収を行います。",
        url: "https://www.pmda.go.jp/safety/info-services/drugs/recal-info/0001.html"
    },
    {
        date: "2026/02/05",
        type: "info",
        typeLabel: "安全性情報",
        title: "医薬品・医療機器等安全性情報 No.XXX の発出について",
        desc: "今月の安全性情報では、複数の薬剤における「重大な副作用」項の改訂について記載されています。",
        url: "https://www.pmda.go.jp/safety/info-services/drugs/calling-attention/safety-info/0002.html"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('alert-list-container');
    const refreshBtn = document.getElementById('refresh-btn');

    async function loadAlerts() {
        listContainer.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-circle-notch fa-spin fa-2x mb-2"></i>
                <p>最新情報を取得中...</p>
            </div>
        `;

        try {
            let alerts = [];
            if (GAS_API_URL) {
                const response = await fetch(GAS_API_URL);
                const data = await response.json();
                alerts = data.alerts || [];
            } else {
                // デモ用に1秒待機してからモックを表示
                await new Promise(resolve => setTimeout(resolve, 800));
                alerts = MOCK_ALERTS;
            }

            renderAlerts(alerts);
        } catch (error) {
            console.error('Fetch error:', error);
            listContainer.innerHTML = '<p class="text-center py-10 text-red-500">情報の取得に失敗しました。GASの設定を確認してください。</p>';
        }
    }

    function renderAlerts(alerts) {
        if (alerts.length === 0) {
            listContainer.innerHTML = '<p class="text-center py-10 text-gray-400">現在、新しいアラートはありません。</p>';
            return;
        }

        listContainer.innerHTML = alerts.map(alert => {
            const badgeClass = {
                emergency: 'badge-emergency',
                recall: 'badge-recall',
                info: 'badge-info'
            }[alert.type] || 'badge-info';

            return `
                <a href="${alert.url}" target="_blank" class="alert-card">
                    <div class="alert-header">
                        <span class="alert-date">${alert.date}</span>
                        <span class="alert-badge ${badgeClass}">${alert.typeLabel}</span>
                    </div>
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-desc">${alert.desc}</div>
                </a>
            `;
        }).join('');
    }

    refreshBtn.addEventListener('click', loadAlerts);

    // Initial load
    loadAlerts();
});
