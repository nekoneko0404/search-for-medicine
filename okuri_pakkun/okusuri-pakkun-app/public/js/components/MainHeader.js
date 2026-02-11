/**
 * Common Header Component for Kusuri Compass (Standardized)
 */
export class MainHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
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
        this.innerHTML = `
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

    renderNavLinks(baseDir, activePage) {
        const links = [
            { id: 'search', label: '出荷状況検索', path: 'search.html' },
            { id: 'update', label: '出荷状況更新', path: 'update/index.html' },
            { id: 'pakkun', label: '小児服薬支援', path: 'https://okusuri-pakkun-app.pages.dev/' },
            { id: 'pollen', label: '花粉飛散状況', path: 'pollen-app/index.html' }
        ];

        return links.map(link => {
            const isActive = activePage === link.id;
            const target = 'target="_blank" rel="noopener noreferrer"';
            const path = link.path.startsWith('http') || link.path.startsWith('#') ? link.path : baseDir + link.path;
            const style = isActive ? 'style="border-bottom: 2px solid black;"' : '';
            return `<a href="${path}" ${target} ${style}>${link.label}</a>`;
        }).join('');
    }
}

if (!customElements.get('main-header')) {
    customElements.define('main-header', MainHeader);
}
