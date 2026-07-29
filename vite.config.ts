import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Trailing slash matters: '/api-docs.html' must NOT match this proxy
      // (it's a static file served by Vite, not a backend route).
      '/api/': 'http://localhost:3001',
    },
  },
})
