/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        paper: '#fdeed4',
        red: '#fc443c',
        lime: '#cdf603',
      },
      fontFamily: {
        display: ['Alexandria', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
