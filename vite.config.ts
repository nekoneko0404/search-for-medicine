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
                    src: 'pollen-app/*.{js,css,json,png,mp3,csv}',
                    dest: 'pollen-app'
                },
                {
                    src: 'recipe-app/*.{js,css,json,png}',
                    dest: 'recipe-app'
                },
                {
                    src: 'anonymous-bbs/*.{js,css,json,png}',
                    dest: 'anonymous-bbs'
                },
                {
                    src: 'infection-surveillance-app/*.{js,css,json,png}',
                    dest: 'infection-surveillance-app'
                },
                {
                    src: 'supply-status/*.{js,css,json,png}',
                    dest: 'supply-status'
                },
                {
                    src: 'Okusuri_pakkun/*.{js,css,json,png}',
                    dest: 'Okusuri_pakkun'
                },
                {
                    src: 'drug-classification/*.{js,css,json,png}',
                    dest: 'drug-classification'
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
                infection: resolve(__dirname, 'infection-surveillance-app/index.html'),
                pollen: resolve(__dirname, 'pollen-app/index.html'),
                pakkun: resolve(__dirname, 'Okusuri_pakkun/index.html'),
                recipe: resolve(__dirname, 'recipe-app/index.html'),
                supply: resolve(__dirname, 'supply-status/index.html'),
                update: resolve(__dirname, 'update/index.html'),
                debug: resolve(__dirname, 'update/debug.html'),
                drug_classification: resolve(__dirname, 'drug-classification/index.html'),
                anonymous_bbs: resolve(__dirname, 'anonymous-bbs/index.html'),
                pakkun_guide: resolve(__dirname, 'Okusuri_pakkun/usage_guide.html'),
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
        },
    },
});
