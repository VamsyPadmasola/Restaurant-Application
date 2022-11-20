/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#f8f8f8',
        secondary: '#E25A25',
        ternary: '#D35400',
        'success': '#48A36A',
        'failure': '#E15E5E',
        'dark-subtle': "rgba(255,255,255,0.5)",
        'light-subtle': "#221f1f",
        'grey-subtle': '#909090',
        'red-btn': '#EC493A',
        'orange-btn': '#F08300',
        'blue-btn': '#367588',
        "highlight-dark": '#FFC200',
        "highlight": "#058BFB"
      },
      boxShadow: {
        darkShadow: '0 4px 8px rgba(0, 0, 0, 0.75)',
        lightShadow: '0 4px 8px rgba(0, 0, 0, 0.75)'
      }
    },
  },
  plugins: [],
}
