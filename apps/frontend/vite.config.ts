import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        proxy: {
            '/api/agent': {
                // Use 127.0.0.1 — on macOS, localhost can resolve to ::1 and hit a different service on :8000
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/agent/, '') || '/',
            },
        },
    },
});
