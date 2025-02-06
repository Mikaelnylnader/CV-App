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
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization, apikey'
    }
  },
  preview: {
    port: 3000,
    strictPort: true
  },
  define: {
    'process.env': {}
  }
})