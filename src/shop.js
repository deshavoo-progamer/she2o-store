const cartKey = 'shaqo-cart-v1'
const orderKey = 'shaqo-checkout-v1'

export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...(options.body === undefined ? {} : {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options.body),
    }),
    method: options.method ?? 'GET',
  })
  const body = await response.json().catch(() => null)
  if (!response.ok || !body) {
    throw Object.assign(new Error(body?.error ?? 'مقدرناش نوصل للسيرفر. جرّب تاني.'), { status: response.status })
  }
  return body
}

const format = new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 })
export const money = amount => `${format.format(amount / 100)} ج.م.`

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export function getCart() {
  const items = read(cartKey, [])
  if (!Array.isArray(items)) return []
  return items.filter(item => typeof item?.id === 'string' && Number.isInteger(item.size)
    && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 10)
}

export function saveCart(items) {
  localStorage.setItem(cartKey, JSON.stringify(items))
}

export async function checkoutId(payload) {
  // Keep retries tied to the same request without retaining shipping details in the browser.
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(payload)))
  const key = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
  const previous = read(orderKey, {})
  if (previous.key === key) return previous.id
  const id = crypto.randomUUID()
  localStorage.setItem(orderKey, JSON.stringify({ key, id, items: payload.items }))
  return id
}

export function completeCart(id, success) {
  const attempt = read(orderKey, {})
  if (attempt.id !== id) return
  if (success && JSON.stringify(getCart()) === JSON.stringify(attempt.items)) saveCart([])
  localStorage.removeItem(orderKey)
}

export const statusLabels = {
  preparing_payment: 'بنجهّز الدفع',
  awaiting_payment: 'مستني تأكيد الدفع',
  payment_failed: 'الدفع مكملش',
  payment_expired: 'وقت الدفع خلص',
  payment_review: 'الدفع وصل والطلب تحت المراجعة',
  paid: 'الدفع اتأكد',
  confirmed: 'الطلب اتأكد',
  shipped: 'الطلب في الطريق',
  delivered: 'الطلب وصل',
  cancelled: 'الطلب اتلغى',
}
