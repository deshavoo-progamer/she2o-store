import { createHmac, timingSafeEqual } from 'node:crypto'

const gateway = 'https://accept.paymob.com'
const signedFields = [
  'amount_cents', 'created_at', 'currency', 'error_occured', 'has_parent_transaction', 'id',
  'integration_id', 'is_3d_secure', 'is_auth', 'is_capture', 'is_refunded', 'is_standalone_payment',
  'is_voided', 'order.id', 'owner', 'pending', 'source_data.pan', 'source_data.sub_type',
  'source_data.type', 'success',
]

export function paymentConfig(env) {
  const methods = env.PAYMOB_INTEGRATION_IDS?.split(',').map(id => Number(id.trim())).filter(id => Number.isSafeInteger(id) && id > 0) ?? []
  if (!methods.length || !env.PAYMOB_SECRET_KEY || !env.PAYMOB_PUBLIC_KEY || !env.PAYMOB_HMAC_SECRET) return null
  if (!env.SITE_URL) return null
  const origin = new URL(env.SITE_URL).origin
  if (!origin.startsWith('https://')) return null
  return { methods, origin, secret: env.PAYMOB_SECRET_KEY, publicKey: env.PAYMOB_PUBLIC_KEY, hmac: env.PAYMOB_HMAC_SECRET }
}

export async function createPayment(config, order) {
  const { customer, id, total, shipping, items } = order
  const [firstName, ...lastName] = customer.name.split(/\s+/)
  const paymentItems = items.map(item => ({
    name: item.name,
    amount: item.price,
    description: `EU ${item.size}`,
    quantity: item.quantity,
  }))
  if (shipping) paymentItems.push({ name: 'Shipping', amount: shipping, description: customer.zone, quantity: 1 })
  const response = await fetch(`${gateway}/v1/intention/`, {
    method: 'POST',
    headers: { Authorization: `Token ${config.secret}`, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(12000),
    body: JSON.stringify({
      amount: total, currency: 'EGP', payment_methods: config.methods, items: paymentItems,
      special_reference: id, expiration: 1800,
      notification_url: `${config.origin}/api/payment/webhook`,
      redirection_url: `${config.origin}/order/${id}`,
      billing_data: {
        first_name: firstName, last_name: lastName.join(' ') || firstName,
        city: customer.city, state: customer.zone, street: customer.address,
        country: 'EG', email: customer.email, phone_number: `+2${customer.phone}`,
        apartment: 'NA', building: 'NA', floor: 'NA',
      },
    }),
  })
  if (!response.ok) throw new Error('Payment provider rejected the intention')
  const data = await response.json()
  if (!data.client_secret || !Number.isSafeInteger(data.intention_order_id)) throw new Error('Invalid intention response')
  const checkout = new URL('/unifiedcheckout/', gateway)
  checkout.search = new URLSearchParams({ publicKey: config.publicKey, clientSecret: data.client_secret })
  return { checkout: checkout.href, providerOrder: String(data.intention_order_id) }
}

export function verifyTransaction(config, transaction, signature) {
  if (!config || !transaction || !/^[0-9a-f]{128}$/i.test(signature ?? '')) return false
  const message = signedFields.map(field =>
    String(field.split('.').reduce((value, key) => value?.[key], transaction) ?? ''),
  ).join('')
  const expected = createHmac('sha512', config.hmac).update(message).digest()
  return timingSafeEqual(expected, Buffer.from(signature, 'hex'))
}
