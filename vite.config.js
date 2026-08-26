import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          const rest = path.replace(/^\/api/, '') || '/';
          // Platform routes are versioned-only on some running servers
          if (rest.startsWith('/platform')) return `/api/v1${rest}`;
          return rest;
        },
      },
    },
  },
});
