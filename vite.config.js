import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
    target: 'esnext',
    sourcemap: true
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: true,
    proxy: {
      '/rest/v1': {
        target: 'https://rlxqnqwxvgxvqbvwjkqr.supabase.co',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/rest\/v1/, '/rest/v1'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        }
      },
      '/auth/v1': {
        target: 'https://rlxqnqwxvgxvqbvwjkqr.supabase.co',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/auth\/v1/, '/auth/v1')
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    }
  },
  preview: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/rest/v1': {
        target: 'https://rlxqnqwxvgxvqbvwjkqr.supabase.co',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/rest\/v1/, '/rest/v1')
      },
      '/auth/v1': {
        target: 'https://rlxqnqwxvgxvqbvwjkqr.supabase.co',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/auth\/v1/, '/auth/v1')
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    }
  },
  base: '/',
  define: {
    'process.env': {}
  }
})