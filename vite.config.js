// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Change target if your Laravel dev server runs elsewhere
const LARAVEL_API = process.env.VITE_API_URL || 'http://127.0.0.1:8000';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,         // dev server port (matches your current setup)
        strictPort: true,   // fail if 5174 is taken (optional)
        open: false,        // auto-open browser (optional)
        cors: true,         // allow other origins to hit Vite (doesn’t affect proxy)
        proxy: {
            // All calls starting with /api will be proxied to Laravel
            '/api': {
                target: LARAVEL_API,
                changeOrigin: true,
                // If your Laravel uses self-signed HTTPS in dev, enable the next line:
                // secure: false,
                // If your frontend path differs and you need to rewrite, use:
                // rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
            // Optional: if you also serve images from /storage (Laravel public disk)
            '/storage': {
                target: LARAVEL_API,
                changeOrigin: true,
                // secure: false,
            },
        },
    },
});
