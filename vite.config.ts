import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    base: './', // Use relative base for all assets
    plugins: [
        tailwindcss(),
        viteStaticCopy({
            targets: [
                {
                    src: 'images/*',
                    dest: 'images'
                },
                {
                    src: 'pollen-app/*.{json,mp3,csv,png}',
                    dest: 'pollen-app'
                },
                {
                    src: 'pakkun-stamp/images/*',
                    dest: 'pakkun-stamp/images'
                },
                {
                    src: 'supply-status/data/*',
                    dest: 'supply-status/data'
                }
            ]
        })
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                search: resolve(__dirname, 'search.html'),
                hiyari: resolve(__dirname, 'hiyari_app/index.html'),
                update: resolve(__dirname, 'update/index.html'),
                debug: resolve(__dirname, 'update/debug.html'),
                pakkun_guide: resolve(__dirname, 'pakkun-stamp/usage_guide.html'),
                pakkun_app: resolve(__dirname, 'pakkun-stamp/index.html'),
                supply_status: resolve(__dirname, 'supply-status/index.html'),
                anonymous_bbs: resolve(__dirname, 'anonymous-bbs/index.html'),
                pollen_app: resolve(__dirname, 'pollen-app/index.html'),
                recipe_app: resolve(__dirname, 'recipe-app/index.html'),
                infection_surveillance: resolve(__dirname, 'infection-surveillance-app/index.html'),
                drug_classification: resolve(__dirname, 'drug-classification/index.html'),
                privacy: resolve(__dirname, 'privacy.html'),
                terms: resolve(__dirname, 'terms.html'),
                help: resolve(__dirname, 'help/index.html'),
                proposals: resolve(__dirname, 'proposals/index.html'),
                prop01: resolve(__dirname, 'proposals/01-editorial/index.html'),
                prop02: resolve(__dirname, 'proposals/02-glassmorphism/index.html'),
                prop03: resolve(__dirname, 'proposals/03-dark-mode/index.html'),
                prop04: resolve(__dirname, 'proposals/04-swiss-modern/index.html'),
                prop05: resolve(__dirname, 'proposals/05-floating-cockpit/index.html'),
                prop06: resolve(__dirname, 'proposals/06-split-screen/index.html'),
                prop07: resolve(__dirname, 'proposals/07-interactive-cards/index.html'),
                prop08: resolve(__dirname, 'proposals/08-neumorphism/index.html'),
                prop09: resolve(__dirname, 'proposals/09-data-viz/index.html'),
                prop10: resolve(__dirname, 'proposals/10-gradient-mesh/index.html'),
            },
        },
    },
    server: {
        open: true,
        proxy: {
            '/hiyari-proxy': {
                target: 'https://hiyari-proxy-708146219355.asia-east1.run.app',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/hiyari-proxy/, ''),
            },
            '/drug-navigator': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
            '/okuri_pakkun': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});
