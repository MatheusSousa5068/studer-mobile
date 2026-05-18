/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#0070f3',
        'primary-hover': '#0061d1',
        surface: '#111111',
        'surface-raised': '#1a1a1a',
        border: '#222222',
      },
    },
  },
  plugins: [],
};
