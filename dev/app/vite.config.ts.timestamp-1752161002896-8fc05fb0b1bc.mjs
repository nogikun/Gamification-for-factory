// vite.config.ts
import react from "file:///C:/Users/takah/Documents/git/Gamification-for-factory/dev/app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///C:/Users/takah/Documents/git/Gamification-for-factory/dev/app/node_modules/vite-plugin-svgr/dist/index.js";
import { defineConfig } from "file:///C:/Users/takah/Documents/git/Gamification-for-factory/dev/app/node_modules/vite/dist/node/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    // legacy(),
    svgr({
      svgrOptions: {
        exportType: "named",
        ref: true,
        svgo: false,
        titleProp: true
      },
      include: "**/*.svg"
    })
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts"
  },
  server: {
    host: true,
    proxy: {
      // ★ プロキシ設定
      "/api": {
        // '/api' で始まるリクエストをプロキシする
        target: "http://localhost:3000",
        // あなたのAPIサーバーのURL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
        // '/api' を削除してリクエスト
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  optimizeDeps: {
    exclude: [
      "index9-CZEPLLJL",
      "input-shims-JSZC7SPA",
      "hardware-back-button-UAO6NX42"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx0YWthaFxcXFxEb2N1bWVudHNcXFxcZ2l0XFxcXEdhbWlmaWNhdGlvbi1mb3ItZmFjdG9yeVxcXFxkZXZcXFxcYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx0YWthaFxcXFxEb2N1bWVudHNcXFxcZ2l0XFxcXEdhbWlmaWNhdGlvbi1mb3ItZmFjdG9yeVxcXFxkZXZcXFxcYXBwXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy90YWthaC9Eb2N1bWVudHMvZ2l0L0dhbWlmaWNhdGlvbi1mb3ItZmFjdG9yeS9kZXYvYXBwL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxuXG5pbXBvcnQgbGVnYWN5IGZyb20gJ0B2aXRlanMvcGx1Z2luLWxlZ2FjeSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG4vLyBpbXBvcnQgeyBzIH0gZnJvbSAndml0ZXN0L2Rpc3QvcmVwb3J0ZXJzLTVmNzg0ZjQyJyAvLyBcdTY3MkFcdTRGN0ZcdTc1MjhcdTMwNkVcdTMwNUZcdTMwODFcdTMwQjNcdTMwRTFcdTMwRjNcdTMwQzhcdTMwQTJcdTMwQTZcdTMwQzhcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIC8vIGxlZ2FjeSgpLFxuICAgIHN2Z3Ioe1xuICAgICAgc3Znck9wdGlvbnM6IHtcbiAgICAgICAgZXhwb3J0VHlwZTogJ25hbWVkJyxcbiAgICAgICAgcmVmOiB0cnVlLFxuICAgICAgICBzdmdvOiBmYWxzZSxcbiAgICAgICAgdGl0bGVQcm9wOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIGluY2x1ZGU6ICcqKi8qLnN2ZycsXG4gICAgfSksXG4gIF0sXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6ICcuL3NyYy9zZXR1cFRlc3RzLnRzJyxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogdHJ1ZSxcbiAgICBwcm94eTogeyAvLyBcdTI2MDUgXHUzMEQ3XHUzMEVEXHUzMEFEXHUzMEI3XHU4QTJEXHU1QjlBXG4gICAgICAnL2FwaSc6IHsgLy8gJy9hcGknIFx1MzA2N1x1NTlDQlx1MzA3RVx1MzA4Qlx1MzBFQVx1MzBBRlx1MzBBOFx1MzBCOVx1MzBDOFx1MzA5Mlx1MzBEN1x1MzBFRFx1MzBBRFx1MzBCN1x1MzA1OVx1MzA4QlxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLCAvLyBcdTMwNDJcdTMwNkFcdTMwNUZcdTMwNkVBUElcdTMwQjVcdTMwRkNcdTMwRDBcdTMwRkNcdTMwNkVVUkxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLCAvLyAnL2FwaScgXHUzMDkyXHU1MjRBXHU5NjY0XHUzMDU3XHUzMDY2XHUzMEVBXHUzMEFGXHUzMEE4XHUzMEI5XHUzMEM4XG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAnQCc6ICcvc3JjJyxcbiAgICB9LFxuXHR9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbXG4gICAgICAnaW5kZXg5LUNaRVBMTEpMJywgXG4gICAgICAnaW5wdXQtc2hpbXMtSlNaQzdTUEEnLCBcbiAgICAgICdoYXJkd2FyZS1iYWNrLWJ1dHRvbi1VQU82Tlg0MidcbiAgICBdXG4gIH1cbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUdBLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFFakIsU0FBUyxvQkFBb0I7QUFJN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBO0FBQUEsSUFFTixLQUFLO0FBQUEsTUFDSCxhQUFhO0FBQUEsUUFDWCxZQUFZO0FBQUEsUUFDWixLQUFLO0FBQUEsUUFDTCxNQUFNO0FBQUEsUUFDTixXQUFXO0FBQUEsTUFDYjtBQUFBLE1BQ0EsU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxNQUNMLFFBQVE7QUFBQTtBQUFBLFFBQ04sUUFBUTtBQUFBO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUE7QUFBQSxNQUM5QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDUCxLQUFLO0FBQUEsSUFDTDtBQUFBLEVBQ0g7QUFBQSxFQUNDLGNBQWM7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
