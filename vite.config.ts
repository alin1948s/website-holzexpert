import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const apiServer = 'http://127.0.0.1:8787'
const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true'
const githubPagesBase = process.env.GITHUB_PAGES_BASE_PATH || '/website-holzexpert/'

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPagesBuild ? githubPagesBase : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': apiServer,
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin/index.html', import.meta.url)),
      },
    },
  },
})
