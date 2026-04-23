/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        sky: '#4FC3F7',
        coral: '#FF6B6B',
        mint: '#A8E6CF',
        bg: '#FFFDE7',
        purple: '#CE93D8',
        orange: '#FFB74D',
      },
    },
  },
  plugins: [],
};
