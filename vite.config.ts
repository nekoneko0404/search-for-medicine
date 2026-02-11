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
