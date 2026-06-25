import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { pageViewCounterPlugin } from './page-view-counter-plugin'
import packageJson from "./package.json";

export default defineConfig({
  plugins: [react(), tailwindcss(), pageViewCounterPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  }
})
