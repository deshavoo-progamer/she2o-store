import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { products, SIZES } from './src/data.js'

export default defineConfig(({ command, mode }) => {
  const plugins = [react()]
  if (command === 'build') {
    plugins.push({
      name: 'static-catalog-preview',
      generateBundle() {
        const stock = Object.fromEntries(SIZES.map(size => [size, 0]))
        this.emitFile({
          type: 'asset',
          fileName: 'catalog-preview.json',
          source: JSON.stringify({
            products: products.map(product => ({
              ...product, image: `/products/${product.id}.webp`, price: null, stock,
            })),
            shipping: [],
            online: false,
          }),
        })
      },
    })
  }
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
