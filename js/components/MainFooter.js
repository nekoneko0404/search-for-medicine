/**
 * Common Footer Component for Kusuri Compass
 */
export class MainFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const year = 2025;
        const baseDir = this.getAttribute('base-dir') || './';

        this.innerHTML = `
        <footer>
            <div class="footer-grid">
                <div class="footer-brand">
                    <h2>KUSURI COMPASS</h2>
                    <p>Empowering pharmacists with data-driven insights and clean design.</p>
                </div>
                <div class="footer-links">
                    <div class="footer-col">
                        <h3>Sub Apps</h3>
                        <ul>
                            <li><a href="${baseDir}search.html">Search</a></li>
                            <li><a href="${baseDir}update/index.html">Update</a></li>
                            <li><a href="${baseDir}supply-status/index.html">Supply Status</a></li>
                            <li><a href="${baseDir}pollen-app/index.html">Pollen Radar</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h3>Legal</h3>
                        <ul>
                            <li><a href="${baseDir}privacy.html">Privacy Policy</a></li>
                            <li><a href="${baseDir}terms.html">Terms of Service</a></li>
                            <li><a href="https://x.com/oshigoto_twitte" target="_blank">Contact (X)</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <span>&copy; ${year} Kusuri Compass. All rights reserved.</span>
            </div>
        </footer>
        `;
    }
}

// Define the custom element
if (!customElements.get('main-footer')) {
    customElements.define('main-footer', MainFooter);
}
