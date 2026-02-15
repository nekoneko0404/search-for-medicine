const BILLING_DATA = [
    {
        id: "regional-support",
        title: "地域支援体制加算 (1)",
        desc: "地域医療に貢献する体制を有していることの評価。",
        requirements: [
            "24時間対応体制の整備・周知。",
            "在宅患者に対する調剤の実績（直近1年で12回以上）。",
            "地域連携に関する情報の提供（服薬情報等提供料1または2の算定実績）。",
            "医療用医薬品の備蓄品目数（700品目以上）。",
            "副作用報告体制の整備（直近1年で1件以上）。",
            "プレアボイド事例の定期的な報告。"
        ]
    },
    {
        id: "specific-guidance-2",
        title: "特定薬剤管理指導加算2",
        desc: "抗悪性腫瘍剤を服用する患者に対し、連携して指導を行う評価。",
        requirements: [
            "がん薬物療法に関する資質を有する薬剤師の配置。",
            "電話等による服薬状況の確認と、副作用発現状況の把握。",
            "医療機関への情報提供（トレーシングレポート）の実施。",
            "特定薬剤管理指導加算1を算定可能な体制であること。"
        ]
    },
    {
        id: "follow-up-collab",
        title: "連携型服薬フォローアップ",
        desc: "入院前後の情報共有および継続的な指導の評価。",
        requirements: [
            "入院予定患者の持参薬整理と医療機関への提供。",
            "退院時カンファレンスへの参加（オンライン可）。",
            "退院後の服薬状況フォローアップと、その結果の医療機関へのフィードバック。"
        ]
    },
    {
        id: "telehealth-guidance",
        title: "オンライン服薬指導",
        desc: "情報通信機器を用いた服薬指導の算定。",
        requirements: [
            "対面での服薬指導の経験がある薬剤師による実施。",
            "処方箋の原本の受領と確認。",
            "配送状況の管理（適切な保存状態での受け渡し確認）。",
            "緊急時の対応体制（連絡先の明示、近隣薬局との連携）。"
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const categoryContainer = document.getElementById('category-container');
    const itemsContainer = document.getElementById('items-container');
    const currentTitle = document.getElementById('current-title');
    const currentDesc = document.getElementById('current-desc');
    const resultPanel = document.getElementById('result-panel');
    const resultText = document.getElementById('result-text');

    let selectedCategoryId = null;
    let checkedItems = new Set();

    function renderCategories() {
        categoryContainer.innerHTML = BILLING_DATA.map(cat => `
            <div class="category-item ${selectedCategoryId === cat.id ? 'active' : ''}" data-id="${cat.id}">
                ${cat.title}
                <i class="fas fa-chevron-right text-xs opacity-50"></i>
            </div>
        `).join('');

        document.querySelectorAll('.category-item').forEach(el => {
            el.addEventListener('click', () => selectCategory(el.dataset.id));
        });
    }

    function selectCategory(id) {
        selectedCategoryId = id;
        checkedItems.clear();
        const category = BILLING_DATA.find(c => c.id === id);

        currentTitle.textContent = category.title;
        currentDesc.textContent = category.desc;

        renderItems(category.requirements);
        renderCategories();
        updateResult();
    }

    function renderItems(requirements) {
        itemsContainer.innerHTML = requirements.map((req, index) => `
            <div class="checklist-item ${checkedItems.has(index) ? 'checked' : ''}" data-index="${index}">
                <div class="checkbox-custom">
                    ${checkedItems.has(index) ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="requirement-text">${req}</div>
            </div>
        `).join('');

        document.querySelectorAll('.checklist-item').forEach(el => {
            el.addEventListener('click', () => {
                const index = parseInt(el.dataset.index);
                if (checkedItems.has(index)) checkedItems.delete(index);
                else checkedItems.add(index);
                renderItems(requirements);
                updateResult();
            });
        });
    }

    function updateResult() {
        if (!selectedCategoryId) return;
        const category = BILLING_DATA.find(c => c.id === selectedCategoryId);
        const total = category.requirements.length;
        const checkedCount = checkedItems.size;

        if (checkedCount === total) {
            resultPanel.className = 'result-panel eligible';
            resultText.innerHTML = '<strong><i class="fas fa-check-circle"></i> 全ての要件を満たしています。</strong><br>算定可能な状態です。';
        } else {
            resultPanel.className = 'result-panel';
            resultText.innerHTML = `<i class="fas fa-info-circle"></i> あと <strong>${total - checkedCount}項目</strong> の要件確認が必要です。`;
        }
    }

    // Initial render
    renderCategories();
});
