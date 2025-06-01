/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

import { defineConfig } from 'vite'
// import { s } from 'vitest/dist/reporters-5f784f42' // 未使用のためコメントアウト

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // legacy(),
    svgr({
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: {
    host: true,
    proxy: { // ★ プロキシ設定
      '/api': { // '/api' で始まるリクエストをプロキシする
        target: 'http://localhost:3000', // あなたのAPIサーバーのURL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // '/api' を削除してリクエスト
      }
    }
  },
  resolve: {
    alias: {
    '@': '/src',
    },
	},
  optimizeDeps: {
    exclude: [
      'index9-CZEPLLJL', 
      'input-shims-JSZC7SPA', 
      'hardware-back-button-UAO6NX42'
    ]
  }
})