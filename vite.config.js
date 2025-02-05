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
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },
  server: {
    host: 'localhost',
    port: 3000,
    strictPort: true,
    open: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  base: '/',
  define: {
    'process.env': {}
  }
})