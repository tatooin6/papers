import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { pageViewCounterPlugin } from './page-view-counter-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), pageViewCounterPlugin()],
})
