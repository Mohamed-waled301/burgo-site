/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          hover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
        },
        dark: 'rgb(var(--color-dark) / <alpha-value>)',
        cream: 'rgb(var(--color-background) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        charcoal: 'rgb(var(--color-text) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
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
