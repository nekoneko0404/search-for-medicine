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
                    src: 'pollen-app/*.{html,js,css,json,png,mp3,csv}',
                    dest: 'pollen-app'
                },
                {
                    src: 'recipe-app/*.{html,js,css,json,png}',
                    dest: 'recipe-app'
                },
                {
                    src: 'anonymous-bbs/*.{html,js,css,json,png}',
                    dest: 'anonymous-bbs'
                },
                {
                    src: 'infection-surveillance-app/*.{html,js,css,json,png}',
                    dest: 'infection-surveillance-app'
                },
                {
                    src: 'supply-status/*.{html,js,css,json,png}',
                    dest: 'supply-status'
                },
                {
                    src: 'Okusuri_pakkun/*.{html,js,css,json,png}',
                    dest: 'Okusuri_pakkun'
                },
                {
                    src: 'drug-classification/*.{html,js,css,json,png}',
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
                update: resolve(__dirname, 'update/index.html'),
                debug: resolve(__dirname, 'update/debug.html'),
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
