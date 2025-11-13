/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#0E9F6E',
          yellow: '#F6C343',
        },
      },
    },
  },
  plugins: [],
};
