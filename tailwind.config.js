/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette élégante claire — or / beige
        cream: '#FBF8F3',
        sand: '#F3ECE1',
        gold: {
          DEFAULT: '#C79A3B',
          light: '#E4C77E',
          dark: '#9A7526',
        },
        ink: '#2A2620',
        muted: '#8A8175',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        arabic: ['"Cairo"', '"Tajawal"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(42, 38, 32, 0.18)',
        card: '0 4px 24px -8px rgba(42, 38, 32, 0.12)',
      },
    },
  },
  plugins: [],
}
