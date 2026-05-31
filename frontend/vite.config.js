import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Target modern browsers — smaller, faster output (no legacy polyfills)
    target: 'esnext',

    // Warn only on chunks > 600 KB
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — long-term cached
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react'

          // Router — small but shared
          if (id.includes('node_modules/react-router')) return 'router'
        },
      },
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/backend/api'),
      },
    },
  },
})
