/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',
        'primary-light': '#81C784',
        secondary: '#FFB74D',
        accent: '#42A5F5',
        surface: '#F5F5DC',
        background: '#FFFEF7',
        success: '#66BB6A',
        warning: '#FFA726',
        error: '#EF5350',
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'button': '0 2px 8px rgba(46, 125, 50, 0.2)',
      },
    },
  },
  plugins: [],
}