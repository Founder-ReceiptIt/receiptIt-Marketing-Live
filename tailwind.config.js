/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'jetbrains': ['JetBrains Mono', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'neon-teal': '#2dd4bf',
        'dark-zinc': '#1c1c1e',
      },
    },
  },
  plugins: [],
};
