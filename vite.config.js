import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const plugins = [react()]
  if (command === 'serve') {
    const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
    const setup = async server => {
      const { createApi } = await import('./server/api.js')
      server.middlewares.use(createApi(env))
    }
    plugins.push({ name: 'shaqo-api', configureServer: setup, configurePreviewServer: setup })
  }
  return {
    plugins,
    server: {
      fs: {
        deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/.store/**', '**/*.{sqlite,sqlite-wal,sqlite-shm}'],
      },
    },
  }
})
