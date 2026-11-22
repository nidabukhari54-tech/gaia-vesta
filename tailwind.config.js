/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4A574',
        purple: '#8B7FB0',
        'text-primary': '#3D3D3D',
        night: '#14092B',
        night2: '#1E1038',
        night3: '#2A1850',
        cream: '#F5EFE3',
        lav: '#C9BEE3',
        lavdim: '#9A8CC4',
        goldlight: '#E7C873',
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
