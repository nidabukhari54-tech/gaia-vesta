/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4A574',
        purple: '#8B7FB0',
        'text-primary': '#3D3D3D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
};
