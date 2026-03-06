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
    const editStoreId = document.getElementById('edit-store-id') as HTMLInputElement;
    const editPlan = document.getElementById('edit-plan') as HTMLSelectElement;
    const editLimit = document.getElementById('edit-limit') as HTMLInputElement;
    const editStatus = document.getElementById('edit-status') as HTMLSelectElement;

    let adminPass = '';

    // 自動ログインを無効化（都度入力を要求）

    loginBtn?.addEventListener('click', async () => {
        const pass = (adminPassInput as HTMLInputElement)?.value.trim();
        if (!pass) return alert('パスコードを入力してください');

        // 先に検証・取得を試みる
        const success = await fetchStores(pass);
        if (success) {
            adminPass = pass;
            // sessionStorage.setItem('admin_pass', pass); // 保存しない
        }
    });

    refreshBtn?.addEventListener('click', () => {
        fetchStores();
    });

    modalCancelBtn?.addEventListener('click', () => {
        updateModal?.classList.add('hidden');
    });

    modalSaveBtn?.addEventListener('click', async () => {
        const storeId = editStoreId?.value;
        const payload = {
            storeId,
            planType: editPlan?.value,
            usageLimit: parseInt(editLimit?.value || '0'),
            subscriptionStatus: editStatus?.value
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
                updateModal?.classList.add('hidden');
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
        loginSection?.classList.add('hidden');
        adminSection?.classList.remove('hidden');
    }

    async function fetchStores(overridePass?: string): Promise<boolean> {
        const targetPass = overridePass || adminPass;
        if (!targetPass) return false;

        try {
            const response = await fetch('/api/admin/stores', {
                headers: { 'X-Admin-Passcode': targetPass }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('認証に失敗しました。パスコードを確認してください。');
                    return false;
                }
                throw new Error('Failed to fetch stores');
            }

            const data = await response.json();
            renderStores(data.stores);
            showAdminSection(); // 成功時にのみ UI 切り替え
            return true;
        } catch (err) {
            console.error(err);
            alert('データ取得に失敗しました');
            return false;
        }
    }

    function renderStores(stores: any[]) {
        if (!storeListBody) return;
        storeListBody.innerHTML = '';
        stores.forEach((store: any) => {
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
                const target = e.target as HTMLElement;
                const store = JSON.parse(target.dataset.store || '{}');
                openEditModal(store);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const storeId = target.dataset.id;
                if (storeId && confirm(`店舗ID: ${storeId} を完全に削除しますか？\nこの操作は取り消せません。`)) {
                    deleteStore(storeId);
                }
            });
        });
    }

    function openEditModal(store: any) {
        if (editStoreId) editStoreId.value = store.id;
        if (editPlan) editPlan.value = store.plan_type;
        if (editLimit) editLimit.value = String(store.usage_limit);
        if (editStatus) editStatus.value = store.subscription_status || 'active';
        updateModal?.classList.remove('hidden');
    }

    async function deleteStore(storeId: string) {
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
