/**
 * Common Header Component for Kusuri Compass
 */
export class MainHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const baseDir = this.getAttribute('base-dir') || './';
        this.style.display = 'block';
        const activePage = this.getAttribute('active-page') || '';

        // Inject V2 Shared CSS
        if (!document.querySelector('link[href*="v2-shared.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${baseDir}css/v2-shared.css`;
            document.head.appendChild(link);
        }

        // Add Font Awesome if missing
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }

        this.innerHTML = `
        <header>
            <a href="${baseDir}index.html" class="logo">
                <i class="fas fa-compass"></i> KUSURI COMPASS
            </a>
            <nav class="nav-links">
                ${this.renderNavLinks(baseDir, activePage)}
            </nav>
            <div class="mobile-menu-toggle" style="display: none;">
                <i class="fas fa-bars"></i>
            </div>
        </header>
        `;
    }

    renderNavLinks(baseDir, activePage) {
        const links = [
            { id: 'search', label: 'Search', path: 'search.html' },
            { id: 'update', label: 'Update', path: 'update/index.html' },
            { id: 'pakkun', label: 'Pakkun', path: 'https://okusuri-pakkun-app.pages.dev/' },
            { id: 'topics', label: 'Topics', path: '#topics' } // Placeholder for future topics
        ];

        return links.map(link => {
            const isActive = activePage === link.id;
            // Force all top menu links to open in new tab as per user request
            const target = 'target="_blank" rel="noopener noreferrer"';
            const path = link.path.startsWith('http') || link.path.startsWith('#') ? link.path : baseDir + link.path;

            // simple active style inline or rely on CSS
            const style = isActive ? 'style="border-bottom: 2px solid black;"' : '';

            return `<a href="${path}" ${target} ${style}>${link.label}</a>`;
        }).join('');
    }
}

// Define the custom element
if (!customElements.get('main-header')) {
    customElements.define('main-header', MainHeader);
}
