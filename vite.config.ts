import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    compression({
      algorithm: 'gzip', // або 'brotliCompress'
      threshold: 1024,
    }),
  ],

  build: {
    target: 'es2017',
    cssMinify: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    headers: {
      'Cache-Control': 'max-age=31536000, immutable',
    },
  },
})
