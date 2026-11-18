import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { createApi } from './api.js'

const dist = resolve('dist')
const api = createApi()
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
}

async function serve(req, res) {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end()
      return
    }
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const page = path === '/' || /^\/(?:cart|checkout|admin)\/?$/.test(path) || /^\/order\/[a-f0-9-]+\/?$/.test(path)
    const file = page ? resolve(dist, 'index.html') : resolve(dist, `.${path}`)
    if (!file.startsWith(dist + sep)) return res.writeHead(404).end()
    const info = await stat(file)
    if (!info.isFile()) return res.writeHead(404).end()
    res.writeHead(200, {
      'Content-Type': types[extname(file)] ?? 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': /^\/order\//.test(path) ? 'no-referrer' : 'strict-origin-when-cross-origin',
    })
    if (req.method === 'HEAD') return res.end()
    const stream = createReadStream(file)
    stream.on('error', () => res.destroy())
    stream.pipe(res)
  } catch {
    res.writeHead(404).end()
  }
}

const port = Number(process.env.PORT ?? 8080)
createServer((req, res) => api(req, res, () => serve(req, res))).listen(port, () => {
  console.log(`Shaqo store is listening on port ${port}`)
})
