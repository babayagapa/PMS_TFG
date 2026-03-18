/** @type {import('tailwindcss').Config} */
export default {
  // Scan all JSX/JS files inside src/ for class names
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // ── Brand colours ─────────────────────────────────────────────────────
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        hotel: {
          gold:  '#c9a84c',
          night: '#1a1a2e',
        },
      },
      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
