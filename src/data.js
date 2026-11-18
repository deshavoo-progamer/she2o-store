// كل البيانات اللي ممكن تتغير موجودة هنا — عدّلها من غير ما تلمس باقي الكود

// رقم الواتساب بالصيغة الدولية من غير + (مثال: 201012345678)
export const WHATSAPP_NUMBER = '201000000000'

export const social = {
  instagram: 'https://instagram.com/',
  facebook: 'https://www.facebook.com/people/%D8%B4%D9%82%D9%91%D9%88-STORE/61595977814996/',
  tiktok: 'https://tiktok.com/',
}

export const SIZES = [41, 42, 43, 44, 45]

// الصور في public/products — لو عندك نسخة أكبر من أي صورة حطها بنفس الاسم
// price: null يعني السعر هيتقال على الواتساب
// zoom / focus: تكبير الصورة ونقطة التركيز عشان نخبي الكلام المكتوب على بوستات الفيسبوك
export const products = [
  { id: 'runner-black', name: 'رانر أسود', price: 700, tag: 'الأكثر طلبًا', zoom: 1.4, focus: '100% 58%' },
  { id: 'skate-black', name: 'سكيت أسود', price: 650, zoom: 1.4, focus: '100% 58%' },
  { id: 'dunk-navy', name: 'دانك كحلي', price: 600, zoom: 1.4, focus: '100% 58%' },
  { id: 'runner-white', name: 'رانر أبيض', price: null, zoom: 1.4, focus: '100% 58%' },
  { id: 'skate-brown', name: 'سكيت بني منقوش', price: 650, zoom: 1.4, focus: '100% 58%' },
  { id: 'dunk-cream', name: 'دانك كريمي', price: null, zoom: 1.4, focus: '100% 58%' },
]

// صور حقيقية قدام المراية
export const realShots = [
  { src: '/products/real-black.jpg', alt: 'رانر أسود' },
  { src: '/products/real-green.jpg', alt: 'سكيت أخضر غامق منقوش' },
  { src: '/products/real-white.jpg', alt: 'رانر أبيض' },
  { src: '/products/real-brown.jpg', alt: 'سكيت بني منقوش' },
  { src: '/products/real-color.jpg', alt: 'كوتشي ملوّن' },
]

export const perks = [
  { title: 'توصيل مجاني في القاهرة', text: 'وباقي المحافظات بمصاريف بسيطة.' },
  { title: 'الدفع عند الاستلام', text: 'افتح الكرتونة وقيس قبل ما تدفع.' },
  { title: 'مقاسات من 41 لـ 45', text: 'ولو المقاس مش مظبوط بنبدّل.' },
]

export const sizeChart = [
  { eu: 41, cm: '26.0' },
  { eu: 42, cm: '26.7' },
  { eu: 43, cm: '27.3' },
  { eu: 44, cm: '28.0' },
  { eu: 45, cm: '28.6' },
]

export const faqs = [
  {
    q: 'المقاسات مظبوطة ولا أطلب نمرة أكبر؟',
    a: 'المقاسات مظبوطة على المقاس الأوروبي. لو رجلك عريضة شوية أو بين مقاسين، خد النمرة الأكبر.',
  },
  {
    q: 'الطلب بيوصل إمتى؟',
    a: 'القاهرة من يوم لـ ٢، وباقي المحافظات من ٢ لـ ٤ أيام شغل. هنكلمك قبل المندوب ما ينزل.',
  },
  {
    q: 'التوصيل بكام؟',
    a: 'جوه القاهرة مجاني. باقي المحافظات بنقولك على المصاريف على الواتساب قبل ما نأكد الأوردر.',
  },
  {
    q: 'لو المقاس طلع مش مظبوط أعمل إيه؟',
    a: 'ابعتلنا على الواتساب خلال ١٤ يوم من الاستلام، والكوتشي يكون نضيف ومتلبسش برّه، ونبدلهولك.',
  },
]

export const minPrice = Math.min(...products.filter((p) => p.price).map((p) => p.price))
