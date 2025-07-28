import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import cssModules from 'vite-plugin-css-modules'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cssModules],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true
    }
  }
})

// Copyright (c) 2025 nogi, Kaito220009
// All rights reserved.
