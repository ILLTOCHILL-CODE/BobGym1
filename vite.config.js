import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                classes: resolve(__dirname, 'pages/classes.html'),
                trainers: resolve(__dirname, 'pages/trainers.html'),
                membership: resolve(__dirname, 'pages/membership.html'),
            }
        }
    }
});
