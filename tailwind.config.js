/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        axiom: {
          base: {
            dark: '#0B0D11',
            light: '#F9FAFB',
          },
          surface: {
            dark: '#14171F',
            light: '#FFFFFF',
          },
          text: {
            dark: '#F3F4F6',
            light: '#111827',
          },
          muted: {
            dark: '#9CA3AF',
            light: '#4B5563',
          },
          amber: {
            DEFAULT: '#F59E0B',
            dark: '#F59E0B',
            light: '#D97706',
          },
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Geist', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
};
