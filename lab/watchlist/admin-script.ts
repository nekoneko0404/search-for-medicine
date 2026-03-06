document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const adminSection = document.getElementById('admin-section');
    const loginBtn = document.getElementById('login-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const adminPassInput = document.getElementById('admin-pass-input');
    const storeListBody = document.getElementById('store-list-body');

    // Modal elements
    const updateModal = document.getElementById('update-modal');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const editStoreId = document.getElementById('edit-store-id');
    const editPlan = document.getElementById('edit-plan');
    const editLimit = document.getElementById('edit-limit');
    const editStatus = document.getElementById('edit-status');

    let adminPass = sessionStorage.getItem('admin_pass') || '';

    if (adminPass) {
        showAdminSection();
    }

    loginBtn.addEventListener('click', () => {
        const pass = adminPassInput.value.trim();
        if (!pass) return alert('パスコードを入力してください');
        adminPass = pass;
        sessionStorage.setItem('admin_pass', pass);
        showAdminSection();
    });

    refreshBtn.addEventListener('click', fetchStores);

    modalCancelBtn.addEventListener('click', () => updateModal.classList.add('hidden'));

    modalSaveBtn.addEventListener('click', async () => {
        const storeId = editStoreId.value;
        const payload = {
            storeId,
            planType: editPlan.value,
            usageLimit: parseInt(editLimit.value),
            subscriptionStatus: editStatus.value
        };

        try {
            const response = await fetch('/api/admin/stores/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Passcode': adminPass
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('更新しました');
                updateModal.classList.add('hidden');
                fetchStores();
            } else {
                alert('更新に失敗しました');
            }
        } catch (err) {
            console.error(err);
            alert('接続エラーが発生しました');
        }
    });

    async function showAdminSection() {
        loginSection.classList.add('hidden');
        adminSection.classList.remove('hidden');
        fetchStores();
    }

    async function fetchStores() {
        try {
            const response = await fetch('/api/admin/stores', {
                headers: { 'X-Admin-Passcode': adminPass }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('認証に失敗しました。パスコードを確認してください。');
                    sessionStorage.removeItem('admin_pass');
                    location.reload();
                }
                throw new Error('Failed to fetch stores');
            }

            const data = await response.json();
            renderStores(data.stores);
        } catch (err) {
            console.error(err);
            alert('データ取得に失敗しました');
        }
    }

    function renderStores(stores) {
        storeListBody.innerHTML = '';
        stores.forEach(store => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50/50 transition-colors';

            const date = new Date(store.created_at).toLocaleDateString('ja-JP');
            const planBadge = store.plan_type === 'standard' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600';

            row.innerHTML = `
                <td class="p-4">
                    <div class="font-black text-gray-900">${store.name || '未設定'}</div>
                    <div class="text-[10px] text-gray-400 font-mono">${store.id}</div>
                </td>
                <td class="p-4">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${planBadge}">${store.plan_type}</span>
                </td>
                <td class="p-4 font-bold text-gray-700">${store.usage_limit}</td>
                <td class="p-4 text-xs font-bold text-green-600">${store.subscription_status}</td>
                <td class="p-4 text-xs text-gray-400">${date}</td>
                <td class="p-4 flex gap-2">
                    <button class="edit-btn text-indigo-600 hover:text-indigo-800 text-xs font-black" data-store='${JSON.stringify(store)}'>編集</button>
                    <button class="delete-btn text-red-400 hover:text-red-600 text-xs font-black" data-id="${store.id}">削除</button>
                </td>
            `;
            storeListBody.appendChild(row);
        });

        // Attach listeners
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const store = JSON.parse(e.target.dataset.store);
                openEditModal(store);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const storeId = e.target.dataset.id;
                if (confirm(`店舗ID: ${storeId} を完全に削除しますか？\nこの操作は取り消せません。`)) {
                    deleteStore(storeId);
                }
            });
        });
    }

    function openEditModal(store) {
        editStoreId.value = store.id;
        editPlan.value = store.plan_type;
        editLimit.value = store.usage_limit;
        editStatus.value = store.subscription_status || 'active';
        updateModal.classList.remove('hidden');
    }

    async function deleteStore(storeId) {
        try {
            const response = await fetch('/api/admin/stores/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Passcode': adminPass
                },
                body: JSON.stringify({ storeId })
            });

            if (response.ok) {
                alert('削除完了しました');
                fetchStores();
            } else {
                alert('削除に失敗しました');
            }
        } catch (err) {
            console.error(err);
            alert('接続エラー');
        }
    }
});
