import { WHATSAPP_NUMBER, product } from './data.js'

export function whatsappLink(size) {
  const lines = [`السلام عليكم، عايز أطلب كوتشي ${product.name} (${product.code})`]
  if (size) lines.push(`المقاس: ${size}`)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}
