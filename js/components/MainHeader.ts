/**
 * Common Header Component for Kusuri Compass
 */
export class MainHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback(): void {
        let baseDir = this.getAttribute('base-dir') || './';
        if (baseDir !== './' && !baseDir.endsWith('/')) {
            baseDir += '/';
        }
        this.style.display = 'block';
        const activePage = this.getAttribute('active-page') || '';

        // Add Font Awesome if missing
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }

        const children = this.innerHTML;

        // テスト環境用警告バナーの判定
        const isDebugEnv = window.location.hostname === 'debug-deploy.search-for-medicine.pages.dev';
        const debugBanner = isDebugEnv ? `
            <div style="background-color: #ef4444; color: white; text-align: center; padding: 0.5rem 1rem; font-weight: bold; font-size: 0.875rem; z-index: 9999; position: relative; width: 100%;">
                ⚠️ 【テスト環境】現在テスト環境を表示しています。不具合がある際はURLから（debug-deploy）を削除してください。
            </div>
        ` : '';

        this.innerHTML = `
        ${debugBanner}
        <header>
            <div class="logo-wrapper">
                <a href="${baseDir}index.html" class="logo">
                    <img src="${baseDir}images/KusuriCompass.png" alt="Kusuri Compass">
                    <div class="logo-text">
                        <span class="logo-title">Kusuri Compass</span>
                        <span class="logo-subtitle">薬剤師業務支援ツール</span>
                    </div>
                </a>
            </div>
            <nav class="nav-links">
                ${this.renderNavLinks(baseDir, activePage)}
                <div class="custom-nav-content">${children}</div>
            </nav>
            <div class="mobile-menu-toggle" style="display: none;">
                <i class="fas fa-bars"></i>
            </div>
        </header>
        `;
    }

    renderNavLinks(baseDir: string, activePage: string): string {
        const links = [
            { id: 'search', label: '出荷状況検索', path: '/search.html' },
            { id: 'update', label: '出荷状況更新', path: '/update/index.html' },
            { id: 'pakkun', label: '小児服薬支援', path: '/okuri_pakkun/' },
            { id: 'pediatric-calc', label: '小児用量力価計算', path: '/pediatric-calc/index.html' },
            { id: 'pollen', label: '花粉飛散状況', path: '/pollen-app/index.html' }
        ];

        const navLinks = links.map(link => {
            const isActive = activePage === link.id;
            const target = 'target="_blank" rel="noopener noreferrer"';
            const path = link.path.startsWith('http') || link.path.startsWith('#') || link.path.startsWith('/') ? link.path : baseDir + link.path;
            const style = isActive ? 'style="border-bottom: 3px solid black;"' : '';
            return `<a href="${path}" ${target} ${style}>${link.label}</a>`;
        }).join('');

        // Lab Dropdown HTML
        const labPath = baseDir + 'lab/index.html';
        const watchlistPath = baseDir + 'lab/watchlist/index.html';
        const isLabActive = activePage === 'lab';
        const labStyle = isLabActive ? 'border-bottom: 3px solid black;' : '';

        const labDropdown = `
            <div class="nav-dropdown" id="lab-dropdown-wrapper">
                <a href="${labPath}" class="nav-dropdown-trigger" style="${labStyle}">
                    Lab (実験室) <i class="fas fa-chevron-down" style="font-size: 0.7em; margin-left: 4px;"></i>
                </a>
                <div class="nav-dropdown-content">
                    <a href="${watchlistPath}" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-star mr-2 text-indigo-500"></i> 店舗在庫監視 (Watchlist)
                    </a>
                    <a href="${baseDir}lab/index.html" style="border-top: 1px solid #eee; margin-top: 5px; padding-top: 10px;">
                        <i class="fas fa-flask mr-2 text-gray-400"></i> すべての実験機能を見る
                    </a>
                </div>
            </div>
        `;

        // Add CSS for dropdown if not already present
        if (!document.getElementById('header-dropdown-css')) {
            const style = document.createElement('style');
            style.id = 'header-dropdown-css';
            style.textContent = `
                .nav-dropdown {
                    position: relative;
                    display: inline-block;
                }
                .nav-dropdown-content {
                    display: none;
                    position: absolute;
                    background-color: #fff;
                    min-width: 220px;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.1);
                    z-index: 10001;
                    padding: 10px 0;
                    border: 1px solid #eee;
                    top: 100%;
                    right: 0;
                }
                .nav-dropdown:hover .nav-dropdown-content {
                    display: block;
                }
                .nav-dropdown-content a {
                    color: #333 !important;
                    padding: 10px 20px;
                    text-decoration: none;
                    display: flex !important;
                    align-items: center;
                    font-size: 0.8rem !important;
                    text-transform: none !important;
                    letter-spacing: normal !important;
                    font-weight: 500 !important;
                    border-bottom: none !important;
                }
                .nav-dropdown-content a:hover {
                    background-color: #f8fafc;
                    color: #000 !important;
                }
                .nav-dropdown-content a::after {
                    display: none !important;
                }
                @media (max-width: 768px) {
                    .nav-dropdown-content {
                        position: static;
                        box-shadow: none;
                        border: none;
                        padding: 0;
                        display: block;
                        background: transparent;
                    }
                    .nav-dropdown-trigger i {
                        display: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        return navLinks + labDropdown;
    }
}

// Define the custom element
if (!customElements.get('main-header')) {
    customElements.define('main-header', MainHeader);
}
