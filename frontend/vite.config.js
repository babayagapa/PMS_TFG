import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Proxy API calls to the Laravel backend during development
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ?? 'http://nginx_backend:80',
        changeOrigin: true,
      },
    },
  },
});
