/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
        },
        dark: '#1F2937',
        cream: '#FFF8F0',
        accent: '#FBBF24',
        charcoal: '#111827',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        price: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
