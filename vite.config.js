import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mockApiPlugin } from './server/api.js'

export default defineConfig({
  plugins: [react(), mockApiPlugin()]
})
