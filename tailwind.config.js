/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        ink:   '#10131a',
        cream: '#f7f3ed',
        forest: {
          DEFAULT: '#0a5c4e',
          600: '#0d7a68',
          300: '#6ab5aa',
          400: '#4da396',
        },
        ochre: {
          DEFAULT: '#b8892a',
          400: '#d4a53a',
        },
      },
      animation: {
        fadeUp:   'fadeUp 0.9s ease-out both',
        scrollUp: 'scrollUp 30s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scrollUp: {
          from: { transform: 'translateY(0)' },
          to:   { transform: 'translateY(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
