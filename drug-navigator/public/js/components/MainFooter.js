/**
 * Common Footer Component for Kusuri Compass
 */
export class MainFooter extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        let baseDir = this.getAttribute('base-dir') || './';
        if (baseDir !== './' && !baseDir.endsWith('/')) {
            baseDir += '/';
        }

        this.innerHTML = `
    <footer class="bg-black text-white py-20 px-[5%] w-full">
        <div class="max-w-[1200px] mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-16 border-b border-gray-800 pb-20 mb-10">
                <div class="md:col-span-6">
                    <h2 class="text-3xl font-black mb-6 uppercase tracking-tighter">KUSURI COMPASS</h2>
                    <p class="text-gray-400 text-sm leading-relaxed max-w-md">
                        Kusuri Compassは、薬剤師の皆様が直感的にデータを活用し、より良い医療サービスを提供できるよう設計されたポータルサイトです。テクノロジーと情報の力で、薬局業務の効率化と安全管理を支援します。
                    </p>
                </div>
                <div class="md:col-span-3 flex flex-col gap-6">
                    <span class="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Social</span>
                    <a href="https://x.com/oshigoto_twitte" target="_blank"
                        class="flex items-center gap-3 text-sm hover:text-gray-400 transition-colors">
                        <i class="fab fa-x-twitter text-lg"></i>
                        <span>公式 X (Twitter)</span>
                    </a>
                </div>
                <div class="md:col-span-3 flex flex-col gap-6">
                    <span class="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Legal</span>
                    <nav class="flex flex-col gap-4 text-xs font-bold text-gray-400">
                        <a href="${baseDir}privacy.html" target="_blank" rel="noopener noreferrer"
                            class="hover:text-white transition-colors">プライバシーポリシー</a>
                        <a href="${baseDir}terms.html" target="_blank" rel="noopener noreferrer"
                            class="hover:text-white transition-colors">利用規約</a>
                    </nav>
                </div>
            </div>

            <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                <p class="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    &copy; 2025 KUSURI COMPASS. DESIGNED FOR MEDICAL EXCELLENCE.
                </p>
            </div>
        </div>
    </footer>
        `;
    }
}

// Define the custom element
if (!customElements.get('main-footer')) {
    customElements.define('main-footer', MainFooter);
}
