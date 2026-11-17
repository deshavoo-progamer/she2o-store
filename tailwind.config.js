/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#1d2630', soft: '#2a3541' },
        paper: '#f4efe6',
        sand: { DEFAULT: '#c9b393', dark: '#a8916f' },
        rust: { DEFAULT: '#c35f2c', dark: '#a64e22' },
        char: '#3a3d41',
      },
      fontFamily: {
        display: ['Alexandria', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
