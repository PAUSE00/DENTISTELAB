import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
                        return 'three-vendor';
                    }
                    if (id.includes('node_modules/react') || id.includes('node_modules/@inertiajs') || id.includes('node_modules/lucide-react')) {
                        return 'react-vendor';
                    }
                }
            }
        }
    }
});
