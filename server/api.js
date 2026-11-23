import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { products, SIZES } from '../src/data.js'
import { createPayment, paymentConfig, verifyTransaction } from './payment.js'

const uuid = '[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}'
const orderPath = new RegExp(`^/api/orders/(${uuid})$`)
const orderAdminPath = new RegExp(`^/api/admin/orders/(${uuid})$`)
const productPath = /^\/api\/admin\/products\/([a-z0-9-]{1,64})$/
const imagePath = new RegExp(`^/api/images/(${uuid})$`)
const hour = 60 * 60 * 1000
const hash = value => createHash('sha256').update(value).digest()

function fail(status, message) {
  throw Object.assign(new Error(message), { status })
}

function clean(value, max, required = true) {
  const text = typeof value === 'string' ? value.trim() : ''
  if (text.length > max || (required && !text)) fail(400, 'راجع البيانات وحاول تاني.')
  return text
}

function integer(value, min, max) {
  if (!Number.isSafeInteger(value) || value < min || value > max) fail(400, 'في رقم مش مظبوط.')
  return value
}

async function readJson(req, limit = 32000) {
  if (req.headers['content-type']?.split(';')[0] !== 'application/json') fail(415, 'نوع البيانات مش مدعوم.')
  const chunks = []
  let length = 0
  for await (const chunk of req) {
    length += chunk.length
    if (length > limit) fail(413, 'الملف أو البيانات أكبر من المسموح.')
    chunks.push(chunk)
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks))
    if (body && typeof body === 'object' && !Array.isArray(body)) return body
  } catch {}
  fail(400, 'البيانات مش مظبوطة.')
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(data))
}

function publicOrder(order) {
  const { id, items, total, shipping, method, status, createdAt } = order
  return { id, items, total, shipping, method, status, createdAt }
}

function customerDetails(input, method) {
  const phone = clean(input.phone, 20).replace(/[٠-٩۰-۹]/g, char => String(char.charCodeAt(0) & 15)).replace(/[ -]/g, '').replace(/^\+20/, '0')
  if (!/^01[0125]\d{8}$/.test(phone)) fail(400, 'اكتب رقم موبايل مصري مظبوط.')
  const email = clean(input.email, 160, method === 'online')
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'راجع الإيميل.')
  return {
    phone, email, name: clean(input.name, 120), zone: clean(input.zone, 80),
    city: clean(input.city, 100), address: clean(input.address, 240), notes: clean(input.notes, 400, false),
  }
}

const imageTypes = {
  'image/jpeg': bytes => bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255,
  'image/png': bytes => bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex')),
  'image/webp': bytes => bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP',
}

export function createApi(env = process.env) {
  const dbPath = env.STORE_DB ?? '.store/store.sqlite'
  if (dbPath !== ':memory:') mkdirSync(dirname(dbPath), { recursive: true })
  const db = new DatabaseSync(dbPath)
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, provider_order TEXT UNIQUE, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS reservations (id TEXT PRIMARY KEY, expires_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS reservations_by_expiry ON reservations(expires_at);
    CREATE TABLE IF NOT EXISTS shipping (zone TEXT PRIMARY KEY, fee INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS images (id TEXT PRIMARY KEY, type TEXT NOT NULL, bytes BLOB NOT NULL);
    CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY);
  `)

  const productRow = db.prepare('SELECT data FROM products WHERE id = ?')
  const orderRow = db.prepare('SELECT data FROM orders WHERE id = ?')
  const saveProduct = db.prepare('INSERT INTO products VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data')
  const saveOrder = db.prepare('INSERT INTO orders VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET provider_order = excluded.provider_order, data = excluded.data')
  const parse = row => row && JSON.parse(row.data)
  const getProduct = id => parse(productRow.get(id))
  const getOrder = id => parse(orderRow.get(id))
  const writeProduct = product => saveProduct.run(product.id, JSON.stringify(product))
  const writeOrder = order => saveOrder.run(order.id, order.providerOrder ?? null, JSON.stringify(order))
  const getProducts = () => db.prepare('SELECT data FROM products ORDER BY rowid').all().map(parse)
  const shipping = () => db.prepare('SELECT zone, fee FROM shipping ORDER BY rowid').all()
  const sessions = new Map()
  const limits = new Map()
  const payment = paymentConfig(env)
  const siteOrigin = env.SITE_URL ? new URL(env.SITE_URL).origin : null
  const secureCookie = siteOrigin?.startsWith('https://') || env.NODE_ENV === 'production' ? '; Secure' : ''
  const adminHash = env.ADMIN_PASSWORD?.length >= 12 ? hash(env.ADMIN_PASSWORD) : null

  function transaction(run) {
    db.exec('BEGIN IMMEDIATE')
    try {
      const result = run()
      db.exec('COMMIT')
      return result
    } catch (error) {
      db.exec('ROLLBACK')
      throw error
    }
  }

  transaction(() => {
    if (!db.prepare('INSERT OR IGNORE INTO settings VALUES (?)').run('catalog-sh-50').changes) return
    db.exec("DELETE FROM products WHERE id IN ('runner-black','runner-white','skate-black','skate-brown','dunk-navy','dunk-cream')")
    for (const product of products) {
      writeProduct({
        ...product, price: null, description: '',
        image: `/products/${product.id}.webp`, active: true, revision: 1,
        stock: Object.fromEntries(SIZES.map(size => [size, 0])),
      })
    }
    if (db.prepare('INSERT OR IGNORE INTO settings VALUES (?)').run('seed-v1').changes) db.prepare('INSERT INTO shipping VALUES (?, ?)').run('القاهرة', 0)
  })

  function rateLimit(key, limit, duration) {
    const now = Date.now()
    if (limits.size > 1000) {
      for (const [name, value] of limits) if (value.until <= now) limits.delete(name)
      if (limits.size > 1000 && !limits.has(key)) fail(429, 'في طلبات كتير دلوقتي. جرّب بعد شوية.')
    }
    const entry = limits.get(key)
    if (!entry || entry.until <= now) limits.set(key, { count: 1, until: now + duration })
    else if (++entry.count > limit) fail(429, 'في محاولات كتير. جرّب بعد شوية.')
  }

  function requireAdmin(req) {
    const token = req.headers.cookie?.match(/(?:^|;\s*)shaqo_admin=([a-f0-9]{64})(?:;|$)/)?.[1]
    if (!token || (sessions.get(token) ?? 0) <= Date.now()) fail(401, 'سجّل دخول الأول.')
    return token
  }

  function validProduct(input, previous) {
    const image = clean(input.image, 220)
    const upload = imagePath.exec(image)
    if (!/^\/products\/[a-z0-9-]+\.(?:jpg|png|webp)$/i.test(image)
      && !(upload && db.prepare('SELECT 1 FROM images WHERE id = ?').get(upload[1]))) fail(400, 'اختار صورة للمنتج.')
    const sizes = Object.entries(input.stock ?? {})
    if (!sizes.length || sizes.length > 31) fail(400, 'ضيف مقاس واحد على الأقل.')
    const stock = Object.fromEntries(sizes.map(([size, quantity]) => {
      if (!/^\d{2}$/.test(size)) fail(400, 'اكتب المقاس برقم مظبوط.')
      integer(Number(size), 20, 60)
      return [size, integer(quantity, 0, 100000)]
    }))
    return {
      id: previous?.id ?? randomUUID(), name: clean(input.name, 120), description: clean(input.description, 600, false),
      price: input.price === null ? null : integer(input.price, 1, 10000000),
      tag: clean(input.tag, 32, false), image, stock, active: input.active === true,
      revision: (previous?.revision ?? 0) + 1,
    }
  }

  function restoreStock(order) {
    for (const item of order.items) {
      const product = getProduct(item.id)
      if (!product || !Object.hasOwn(product.stock, item.size)) continue
      product.stock[item.size] += item.quantity
      product.revision++
      writeProduct(product)
    }
  }

  function expireReservations() {
    const now = Date.now()
    const expired = db.prepare('SELECT id FROM reservations WHERE expires_at <= ?')
    if (!expired.get(now)) return
    transaction(() => {
      for (const { id } of expired.all(now)) {
        const order = getOrder(id)
        if (['preparing_payment', 'awaiting_payment'].includes(order?.status)) {
          restoreStock(order)
          order.status = 'payment_expired'
          delete order.checkout
          writeOrder(order)
        }
        db.prepare('DELETE FROM reservations WHERE id = ?').run(id)
      }
    })
  }

  async function checkout(req, res) {
    const input = await readJson(req)
    if (!new RegExp(`^${uuid}$`).test(input.id ?? '') || !['cod', 'online'].includes(input.method)) fail(400, 'راجع طريقة الدفع وبيانات الطلب.')
    if (input.method === 'online' && !payment) fail(503, 'الدفع أونلاين لسه مش متاح.')
    const customer = customerDetails(input.customer ?? {}, input.method)
    if (!Array.isArray(input.items) || !input.items.length || input.items.length > 40) fail(400, 'ضيف كوتشي للسلة الأول.')
    const fingerprint = hash(JSON.stringify([input.method, customer, input.items, input.expectedTotal])).toString('hex')
    const { order, created } = transaction(() => {
      const previous = getOrder(input.id)
      if (previous) {
        if (previous.fingerprint !== fingerprint) fail(409, 'ابدأ الطلب من جديد بعد تعديل البيانات.')
        return { order: previous, created: false }
      }
      rateLimit(`checkout:${req.socket.remoteAddress}`, 24, hour)
      const delivery = db.prepare('SELECT fee FROM shipping WHERE zone = ?').get(customer.zone)
      if (!delivery) fail(400, 'اختار محافظة التوصيل دلوقتي.')
      const shippingFee = delivery.fee
      let total = shippingFee
      const items = input.items.map(item => {
        if (!item || typeof item.id !== 'string') fail(400, 'راجع المنتجات في السلة.')
        const quantity = integer(item.quantity, 1, 10)
        const size = integer(item.size, 20, 60)
        const product = getProduct(item.id)
        if (!product?.active || !product.price || (product.stock[size] ?? 0) < quantity) fail(409, 'في مقاس أو كمية مبقتش متاحة. راجع السلة.')
        product.stock[size] -= quantity
        product.revision++
        writeProduct(product)
        total += product.price * quantity
        return { id: product.id, name: product.name, size, quantity, price: product.price }
      })
      if (total !== input.expectedTotal) fail(409, 'السعر أو مصاريف الشحن اتغيّرت. راجع الإجمالي وجرب تاني.')
      const record = {
        id: input.id, method: input.method, customer, items, total, shipping: shippingFee, fingerprint,
        status: input.method === 'cod' ? 'confirmed' : 'preparing_payment', createdAt: new Date().toISOString(),
      }
      writeOrder(record)
      if (record.method === 'online') {
        // The provider link expires in 30 minutes. Allow time for a delayed callback.
        db.prepare('INSERT INTO reservations VALUES (?, ?)').run(record.id, Date.now() + 40 * 60000)
      }
      return { order: record, created: true }
    })
    if (!created) return json(res, { order: publicOrder(order), checkout: order.status === 'awaiting_payment' ? order.checkout : undefined })
    if (order.method === 'online') {
      try {
        Object.assign(order, await createPayment(payment, order), { status: 'awaiting_payment' })
        writeOrder(order)
      } catch (error) {
        console.error('Could not start Paymob checkout:', error.name)
        transaction(() => {
          restoreStock(order)
          order.status = 'payment_failed'
          writeOrder(order)
          db.prepare('DELETE FROM reservations WHERE id = ?').run(order.id)
        })
      }
    }
    return json(res, { order: publicOrder(order), checkout: order.checkout }, 201)
  }

  async function webhook(req, res, url) {
    const payload = await readJson(req, 256000)
    const tx = payload.obj
    if (payload.type === 'TOKEN') return json(res, { received: true })
    if (!verifyTransaction(payment, tx, url.searchParams.get('hmac'))) fail(403, 'Invalid payment signature')
    if (payload.type !== 'TRANSACTION') fail(400, 'Unsupported event')
    const order = parse(db.prepare('SELECT data FROM orders WHERE provider_order = ?').get(String(tx.order?.id)))
    if (!order) fail(404, 'Unknown payment order')
    if (tx.amount_cents !== order.total || tx.currency !== 'EGP' || !payment.methods.includes(tx.integration_id)) fail(400, 'Unexpected payment details')
    if (tx.success === true && tx.pending === false && !tx.error_occured && !tx.is_voided && !tx.is_refunded && (!tx.is_auth || tx.is_capture)) {
      transaction(() => {
        const latest = getOrder(order.id)
        if (!['awaiting_payment', 'payment_expired'].includes(latest.status)) return
        latest.status = latest.status === 'payment_expired' ? 'payment_review' : 'paid'
        latest.transactionId = String(tx.id)
        delete latest.checkout
        writeOrder(latest)
        db.prepare('DELETE FROM reservations WHERE id = ?').run(latest.id)
      })
    }
    return json(res, { received: true })
  }

  return async function api(req, res, next) {
    const url = new URL(req.url, 'http://localhost')
    const path = url.pathname
    const method = req.method
    if (!path.startsWith('/api/')) return next()
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'no-referrer')
    try {
      if (path === '/api/payment/webhook' && method === 'POST') return await webhook(req, res, url)
      if (method !== 'GET' && req.headers.origin && req.headers.origin !== siteOrigin
        && new URL(req.headers.origin).host !== req.headers.host) fail(403, 'الطلب ده مش من نفس الموقع.')
      if (path === '/api/store' || path === '/api/orders' || orderPath.test(path) || path === '/api/admin/data') expireReservations()
      if (path === '/api/store' && method === 'GET') return json(res, { products: getProducts().filter(product => product.active), shipping: shipping(), online: Boolean(payment) })
      if (path === '/api/orders' && method === 'POST') return await checkout(req, res)
      const orderMatch = orderPath.exec(path)
      if (orderMatch && method === 'GET') {
        const order = getOrder(orderMatch[1])
        if (!order) fail(404, 'الطلب ده مش موجود.')
        return json(res, publicOrder(order))
      }
      const imageMatch = imagePath.exec(path)
      if (imageMatch && method === 'GET') {
        const image = db.prepare('SELECT type, bytes FROM images WHERE id = ?').get(imageMatch[1])
        if (!image) fail(404, 'الصورة مش موجودة.')
        res.writeHead(200, { 'Content-Type': image.type, 'Cache-Control': 'public, max-age=31536000, immutable' })
        return res.end(image.bytes)
      }
      if (path === '/api/admin/login' && method === 'POST') {
        if (!adminHash) fail(503, 'دخول الإدارة محتاج إعداد كلمة السر على السيرفر.')
        rateLimit(`login:${req.socket.remoteAddress}`, 12, 15 * 60 * 1000)
        const { password } = await readJson(req)
        if (!timingSafeEqual(hash(clean(password, 512)), adminHash)) fail(401, 'كلمة السر غلط.')
        for (const [token, expires] of sessions) if (expires <= Date.now()) sessions.delete(token)
        const token = randomBytes(32).toString('hex')
        sessions.set(token, Date.now() + 8 * hour)
        res.setHeader('Set-Cookie', `shaqo_admin=${token}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=28800${secureCookie}`)
        return json(res, { ok: true })
      }
      if (path.startsWith('/api/admin/')) {
        const token = requireAdmin(req)
        if (path === '/api/admin/logout' && method === 'POST') {
          sessions.delete(token)
          res.setHeader('Set-Cookie', `shaqo_admin=; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=0${secureCookie}`)
          return json(res, { ok: true })
        }
        if (path === '/api/admin/data' && method === 'GET') {
          const offset = Number(url.searchParams.get('offset') ?? 0)
          integer(offset, 0, 10000000)
          const orders = db.prepare('SELECT data FROM orders ORDER BY rowid DESC LIMIT 51 OFFSET ?').all(offset).map(parse)
          return json(res, {
            products: getProducts(), shipping: shipping(), online: Boolean(payment), hasMore: orders.length > 50,
            orders: orders.slice(0, 50).map(order => ({
              ...publicOrder(order), customer: order.customer, providerOrder: order.providerOrder,
            })),
          })
        }
        if (path === '/api/admin/images' && method === 'POST') {
          const { type, data } = await readJson(req, 2850000)
          if (typeof data !== 'string' || !Object.hasOwn(imageTypes, type)) fail(400, 'اختار صورة JPG أو PNG أو WebP.')
          const bytes = Buffer.from(data, 'base64')
          if (bytes.length > 2097152 || !imageTypes[type](bytes)) fail(400, 'الصورة لازم تبقى سليمة وحجمها لحد ٢ ميجا.')
          const id = randomUUID()
          db.prepare('INSERT INTO images VALUES (?, ?, ?)').run(id, type, bytes)
          return json(res, { image: `/api/images/${id}` }, 201)
        }
        const productMatch = productPath.exec(path)
        if (path === '/api/admin/products' && method === 'POST' || productMatch && ['PUT', 'DELETE'].includes(method)) {
          const input = await readJson(req)
          const result = transaction(() => {
            const previous = productMatch && getProduct(productMatch[1])
            if (productMatch && !previous) fail(404, 'المنتج مش موجود.')
            if (previous && previous.revision !== input.revision) fail(409, 'المنتج أو مخزونه اتغيّر. حدّث الصفحة الأول.')
            if (method === 'DELETE') {
              // Keep inventory and item history for orders that reference this product.
              writeProduct({ ...previous, active: false, archived: true, revision: previous.revision + 1 })
              return { ok: true }
            }
            const product = validProduct(input, previous)
            writeProduct(product)
            return product
          })
          return json(res, result)
        }
        if (path === '/api/admin/shipping' && method === 'PUT') {
          const { zone, fee } = await readJson(req)
          const name = clean(zone, 80)
          if (fee === null) db.prepare('DELETE FROM shipping WHERE zone = ?').run(name)
          else db.prepare('INSERT INTO shipping VALUES (?, ?) ON CONFLICT(zone) DO UPDATE SET fee = excluded.fee').run(name, integer(fee, 0, 100000))
          return json(res, shipping())
        }
        const adminOrder = orderAdminPath.exec(path)
        if (adminOrder && method === 'PATCH') {
          const { status } = await readJson(req)
          const updated = transaction(() => {
            const order = getOrder(adminOrder[1])
            if (!order) fail(404, 'الطلب مش موجود.')
            const allowed = {
              confirmed: ['shipped', 'cancelled'], paid: ['shipped'], shipped: ['delivered'],
            }
            if (!allowed[order.status]?.includes(status)) fail(409, 'حالة الطلب مينفعش تتغيّر بالطريقة دي.')
            if (status === 'cancelled') restoreStock(order)
            order.status = status
            writeOrder(order)
            return publicOrder(order)
          })
          return json(res, updated)
        }
      }
      fail(404, 'الصفحة دي مش موجودة.')
    } catch (error) {
      if (!error.status) console.error('Store API error:', error.name)
      if (!res.headersSent && !res.destroyed) json(res, { error: error.status ? error.message : 'حصلت مشكلة. جرّب تاني بعد شوية.' }, error.status ?? 500)
    }
  }
}
