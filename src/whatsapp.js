import { WHATSAPP_NUMBER } from './data.js'

export function whatsappLink(name, size) {
  const lines = [name ? `السلام عليكم، عايز أطلب «${name}»` : 'السلام عليكم، عايز أسأل على الكوتشيات']
  if (size) lines.push(`المقاس: ${size}`)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}
