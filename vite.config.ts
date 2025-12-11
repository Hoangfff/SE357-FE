import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api requests to the backend
      '/api': {
        target: 'https://music-share-system.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Log the request for debugging
            console.log('Proxying:', req.method, req.url, '→', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Response:', proxyRes.statusCode, req.url);
          });
          proxy.on('error', (err, req) => {
            console.error('Proxy error:', err.message, req.url);
          });
        },
      },
    },
  },
})

/*
export default defineConfig({
  plugins: [react()],
})
*/
