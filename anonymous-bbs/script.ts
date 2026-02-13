
const API_BASE = "https://anonymous-bbs-worker.neko-neko-0404.workers.dev/api/posts";
const MAX_CHARS = 400;

interface Post {
    id: string;
    post_number: number;
    content: string;
    created_at: string;
    is_admin: boolean;
    deleteKey?: string;
}

let allPosts: Post[] = []; // データを保持
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    // Start loading posts ASAP
    loadPosts();

    const mainContent = document.querySelector('.main-content') as HTMLElement;
    const postContent = document.getElementById('postContent') as HTMLTextAreaElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    const charCount = document.querySelector('.char-count') as HTMLElement;
    const postsContainer = document.getElementById('postsContainer') as HTMLElement;
    const statusMessage = document.getElementById('statusMessage') as HTMLElement;
    const paginationContainer = document.getElementById('pagination') as HTMLElement;

    // Admin Mode Visuals
    const urlParams = new URLSearchParams(window.location.search);
    const adminKey = urlParams.get('key');

    if (adminKey) {
        // Hide standard rate limit warning
        const warning = document.querySelector('.warning-text-footer');
        if (warning) warning.classList.add('hidden');

        // Add visual banner
        const postForm = document.querySelector('.post-form');
        if (postForm) {
            const adminBanner = document.createElement('div');
            adminBanner.className = 'admin-mode-banner';
            adminBanner.innerHTML = '<span>管理者モード：投稿は「管理者」として公開され、連投制限は適用されません。</span>';
            postForm.prepend(adminBanner);
            postForm.classList.add('admin-active');
        }

        // Highlight Submit Button
        if (submitBtn) {
            submitBtn.classList.add('admin-active');
            submitBtn.textContent = '管理者として送信する';
        }
    }

    // Character count update
    postContent?.addEventListener('input', () => {
        const count = postContent.value.length;
        if (charCount) {
            charCount.textContent = `${count} / ${MAX_CHARS}`;
            if (count > MAX_CHARS) {
                charCount.style.color = 'red';
                submitBtn.disabled = true;
            } else {
                charCount.style.color = '#6b7280';
                submitBtn.disabled = count === 0;
            }
        }
    });

    // Handle submit
    submitBtn?.addEventListener('click', async () => {
        const content = postContent.value.trim();
        if (!content) return;
        if (content.length > MAX_CHARS) return;

        submitBtn.disabled = true;
        submitBtn.textContent = '送信中...';
        statusMessage.className = 'hidden';

        const currentAdminKey = new URLSearchParams(window.location.search).get('key')?.trim();

        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Admin-Key': currentAdminKey || ''
                },
                body: JSON.stringify({ content, adminKey: currentAdminKey })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    throw new Error(data.error || '連投できません。まったりいきましょう。（3時間規制）');
                }
                throw new Error(data.error || '送信に失敗しました。');
            }

            // Save delete key locally
            if (data.id && data.deleteKey) {
                saveDeleteKey(data.id, data.deleteKey);
            }

            postContent.value = '';
            if (charCount) charCount.textContent = `0 / ${MAX_CHARS}`;
            showStatus('送信しました！', 'success');
            loadPosts();

        } catch (err: any) {
            showStatus(err.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '送信する';
        }
    });

    // Status message helper
    function showStatus(msg: string, type: 'success' | 'error') {
        if (!statusMessage) return;
        statusMessage.textContent = msg;
        statusMessage.className = type;
        statusMessage.style.display = 'block';
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }

    // Load posts function
    async function loadPosts() {
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error('読み込みに失敗しました');
            allPosts = await res.json();
            renderPosts();
        } catch (err: any) {
            const errorP = document.createElement('p');
            errorP.className = 'error';
            errorP.textContent = `読み込みエラー: ${err.message}`;
            if (postsContainer) {
                postsContainer.innerHTML = '';
                postsContainer.appendChild(errorP);
            }
        }
    }

    // Render posts
    function renderPosts() {
        if (!postsContainer) return;
        postsContainer.innerHTML = '';

        if (allPosts.length === 0) {
            postsContainer.innerHTML = '<p class="loading">投稿はまだありません。</p>';
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        // ページごとの表示制御
        // 1P: 10件
        // 2P+: 20件
        let start, end;
        if (currentPage === 1) {
            start = 0;
            end = 10;
            if (mainContent) mainContent.classList.remove('is-p2-plus');
        } else {
            // 2P目以降: 1P(10件) + (page-2)*20件 から開始
            start = 10 + (currentPage - 2) * 20;
            end = start + 20;
            if (mainContent) mainContent.classList.add('is-p2-plus');
        }

        const displayPosts = allPosts.slice(start, end);

        displayPosts.forEach(post => {
            const el = document.createElement('div');
            el.className = 'post';
            if (post.is_admin) el.classList.add('is-admin');
            el.dataset.postNumber = post.post_number.toString();

            const date = new Date(post.created_at).toLocaleString('ja-JP');
            const currentAdminKey = new URLSearchParams(window.location.search).get('key');
            // Show delete button if local key exists OR if admin key is present
            const canDelete = getDeleteKey(post.id) || currentAdminKey;

            // Header part (Meta + Delete Button)
            const metaDiv = document.createElement('div');
            metaDiv.className = 'post-meta';

            const leftMeta = document.createElement('div');
            leftMeta.className = 'left-meta';

            if (post.post_number) {
                const numSpan = document.createElement('span');
                numSpan.className = 'post-number';
                numSpan.textContent = `${post.post_number}`;
                leftMeta.appendChild(numSpan);
            }

            if (post.is_admin) {
                const badge = document.createElement('span');
                badge.className = 'admin-badge';
                badge.textContent = '管理者';
                leftMeta.appendChild(badge);
            }

            const dateSpan = document.createElement('span');
            dateSpan.textContent = date;
            leftMeta.appendChild(dateSpan);

            const replyBtn = document.createElement('button');
            replyBtn.className = 'reply-btn';
            replyBtn.textContent = '返信';
            replyBtn.addEventListener('click', () => {
                const prefix = `>>${post.post_number}\n`;
                if (postContent) {
                    postContent.value = prefix + postContent.value;
                    postContent.focus();
                    // Scroll to top to see textarea
                    const form = document.querySelector('.post-form') as HTMLElement;
                    if (form) {
                        window.scrollTo({ top: form.offsetTop - 20, behavior: 'smooth' });
                    }
                }
            });
            leftMeta.appendChild(replyBtn);

            metaDiv.appendChild(leftMeta);

            if (canDelete) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = '削除';
                deleteBtn.addEventListener('click', () => deletePost(post.id, currentAdminKey));
                metaDiv.appendChild(deleteBtn);
            }

            // Content part (Safe rendering + Reply link parsing)
            const contentDiv = document.createElement('div');
            contentDiv.className = 'post-content';

            // Parse for >>[number] links
            const contentText = post.content;
            const parts = contentText.split(/(>>\d+)/g);
            parts.forEach(part => {
                if (part.match(/^>>\d+$/)) {
                    const num = part.substring(2);
                    const link = document.createElement('a');
                    link.href = '#';
                    link.className = 'reply-link';
                    link.textContent = part;
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const target = document.querySelector(`.post[data-postNumber="${num}"]`) as HTMLElement;
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            target.style.backgroundColor = '#fef08a'; // Flash highlight
                            setTimeout(() => { target.style.backgroundColor = ''; }, 2000);
                        }
                    });

                    // Hover Preview Events
                    link.addEventListener('mouseenter', (e) => showPreview(e, num));
                    link.addEventListener('mouseleave', hidePreview);

                    contentDiv.appendChild(link);
                } else {
                    contentDiv.appendChild(document.createTextNode(part));
                }
            });

            el.appendChild(metaDiv);
            el.appendChild(contentDiv);
            postsContainer.appendChild(el);
        });

        renderPagination();
    }

    // Hover Preview Logic
    let currentPreview: HTMLElement | null = null;

    function showPreview(e: MouseEvent, postNumber: string) {
        const targetPost = allPosts.find(p => p.post_number == parseInt(postNumber));
        if (!targetPost) return;

        hidePreview();

        const preview = document.createElement('div');
        preview.className = 'hover-preview';

        const meta = document.createElement('div');
        meta.className = 'post-meta';
        meta.textContent = `No.${targetPost.post_number} (${new Date(targetPost.created_at).toLocaleString('ja-JP')})`;

        const content = document.createElement('div');
        content.className = 'post-content';
        content.textContent = targetPost.content;

        preview.appendChild(meta);
        preview.appendChild(content);

        document.body.appendChild(preview);
        currentPreview = preview;

        const target = e.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        preview.style.left = `${rect.left + window.scrollX}px`;
        preview.style.top = `${rect.top + window.scrollY - preview.offsetHeight - 10}px`;
    }

    function hidePreview() {
        if (currentPreview) {
            currentPreview.remove();
            currentPreview = null;
        }
    }

    // Pagination rendering
    function renderPagination() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        // 最大100件までの制限（サーバー側もLIMIT 100）
        const totalPosts = Math.min(allPosts.length, 100);

        // ページ数の計算
        let totalPages = 1;
        if (totalPosts > 10) {
            totalPages = 1 + Math.ceil((totalPosts - 10) / 20);
        }

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i.toString();
            btn.addEventListener('click', () => {
                currentPage = i;
                renderPosts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationContainer.appendChild(btn);
        }
    }

    // Delete handling
    async function deletePost(id: string, adminKey: string | null) {
        if (!confirm('この投稿を削除しますか？')) return;

        const key = adminKey || getDeleteKey(id);
        if (!key) return;

        try {
            const res = await fetch(`${API_BASE}?id=${id}`, {
                method: 'DELETE',
                headers: { 'X-Delete-Key': key }
            });

            if (!res.ok) throw new Error('削除できませんでした');

            removeDeleteKey(id);
            loadPosts();
            showStatus('削除しました', 'success');
        } catch (err: any) {
            showStatus(err.message, 'error');
        }
    }

    // LocalStorage helpers
    interface Keys { [key: string]: string }

    function saveDeleteKey(id: string, key: string) {
        let keys: Keys = JSON.parse(localStorage.getItem('bbs_keys') || '{}');
        keys[id] = key;
        localStorage.setItem('bbs_keys', JSON.stringify(keys));
    }

    function getDeleteKey(id: string): string | undefined {
        let keys: Keys = JSON.parse(localStorage.getItem('bbs_keys') || '{}');
        return keys[id];
    }

    function removeDeleteKey(id: string) {
        let keys: Keys = JSON.parse(localStorage.getItem('bbs_keys') || '{}');
        delete keys[id];
        localStorage.setItem('bbs_keys', JSON.stringify(keys));
    }
});
