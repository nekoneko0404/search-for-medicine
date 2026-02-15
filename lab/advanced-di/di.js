const MOCK_DI_DATA = [
    {
        name: "アムロジピン錠",
        form: "錠剤（普通錠/OD錠）",
        crushing: "ok",
        crushingNote: "遮光条件下での粉砕は可能。ただし、OD錠は湿気に弱いため注意。",
        tube: "ok",
        tubeNote: "簡易懸濁法（55℃, 10分）で速やかに崩壊。チューブ通過性良好。",
        stability: "一包化後は遮光保存が望ましい。高温多湿を避ける。",
        source: "インタビューフォーム"
    },
    {
        name: "ワーファリン錠",
        form: "錠剤（普通錠）",
        crushing: "ok",
        crushingNote: "粉砕可能。ただし、非常に微量な変化で効能に影響するため、ロスに細心の注意を払うこと。",
        tube: "ok",
        tubeNote: "懸濁後の安定性に問題なし。経管投与可能。",
        stability: "光により着色することがあるが、含量に大きな変化はない。一包化可能。",
        source: "各社添付文書・メーカーDI"
    },
    {
        name: "マドパー配合錠",
        form: "錠剤（普通錠）",
        crushing: "ng",
        crushingNote: "粉砕不可。レボドパの酸化・分解が進行しやすく、効力低下の恐れあり。",
        tube: "care",
        tubeNote: "簡易懸濁法は非推奨。用時懸濁かつ速やかな投与が必須。",
        stability: "湿気と光に極めて不安定。分割・一包化は避けるべき薬剤。",
        source: "インタビューフォーム"
    },
    {
        name: "タムスロシン塩酸塩カプセル",
        form: "カプセル（徐放性懸濁粒子）",
        crushing: "ng",
        crushingNote: "カプセル開封による粒子の粉砕は厳禁。徐放性が失われ、急激な血中濃度上昇の危険あり。",
        tube: "care",
        tubeNote: "カプセルから粒子を取り出し、そのまま懸濁せずに投与は可能（粒子径に注意）。",
        stability: "カプセル開封後は速やかに使用すること。",
        source: "インタビューフォーム"
    },
    {
        name: "アムロジピン・バルサルタン配合錠",
        form: "錠剤（普通錠）",
        crushing: "ok",
        crushingNote: "基本的には可能だが、吸湿性が増すため一包化の際は自動分割機の汚れ等に注意。",
        tube: "ok",
        tubeNote: "簡易懸濁法可能。沈殿物が生じることがあるが、主成分は懸濁・溶解している。",
        stability: "一包化時は防湿に配慮する。",
        source: "ジェネリックメーカーDI"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('di-search');
    const resultsContainer = document.getElementById('di-results');

    function renderResults(query = '') {
        const filtered = MOCK_DI_DATA.filter(d =>
            d.name.includes(query) || d.form.includes(query)
        );

        if (filtered.length === 0) {
            resultsContainer.innerHTML = '<p class="col-span-full text-center py-20 text-gray-400">該当する薬剤が見つかりません (モックデータ: アムロジピン, ワーファリン 等)</p>';
            return;
        }

        resultsContainer.innerHTML = filtered.map(d => {
            const crushingStatus = d.crushing === 'ok' ? 'status-ok' : (d.crushing === 'ng' ? 'status-ng' : 'status-care');
            const crushingLabel = d.crushing === 'ok' ? '可能' : (d.crushing === 'ng' ? '不可' : '注意');

            const tubeStatus = d.tube === 'ok' ? 'status-ok' : (d.tube === 'ng' ? 'status-ng' : 'status-care');
            const tubeLabel = d.tube === 'ok' ? '可能' : (d.tube === 'ng' ? '不可' : '注意');

            return `
                <div class="di-card">
                    <div class="drug-header">
                        <div class="drug-name">${d.name}</div>
                        <div class="form-type">${d.form}</div>
                    </div>
                    
                    <div class="compatibility-grid">
                        <div class="comp-item ${crushingStatus}">
                            <span class="comp-label">粉砕可否</span>
                            <span class="comp-val">${crushingLabel}</span>
                        </div>
                        <div class="comp-item ${tubeStatus}">
                            <span class="comp-label">経管/懸濁</span>
                            <span class="comp-val">${tubeLabel}</span>
                        </div>
                    </div>

                    <div class="di-details">
                        <dl>
                            <dt>粉砕留意点</dt>
                            <dd>${d.crushingNote}</dd>
                            <dt>経管・懸濁留意点</dt>
                            <dd>${d.tubeNote}</dd>
                            <dt>安定性・一包化</dt>
                            <dd>${d.stability}</dd>
                        </dl>
                        <div class="text-[10px] text-gray-400 mt-2 text-right">出典: ${d.source}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    searchInput.addEventListener('input', (e) => {
        renderResults(e.target.value);
    });

    // Initial render
    renderResults();
});
