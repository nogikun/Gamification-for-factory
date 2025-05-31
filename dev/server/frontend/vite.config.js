import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import cssModules from 'vite-plugin-css-modules'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cssModules],
})
