/** @type {import('tailwindcss').Config} */
// الألوان مأخوذة من لوجو "شق شوز": رمادي فحمي + تركواز + برتقالي
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#181c1f', soft: '#24292d' },
        paper: '#f2f3f1',
        teal: { DEFAULT: '#2bb7a7', dark: '#138377' },
        flame: { DEFAULT: '#f47a2c', dark: '#d9621a' },
      },
      fontFamily: {
        display: ['Alexandria', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
