/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'furia': {
          black: '#000000',
          white: '#FFFFFF',
          gold: '#D4AF37',
        },
      },
      animation: {
        'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.furia.gold), 0 0 20px theme(colors.furia.gold)',
      },
    },
  },
  plugins: [],
};