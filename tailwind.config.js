/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#145A46',
          dark: '#0E3F31',
          light: '#1B735A',
        },
        emerald: {
          DEFAULT: '#19A77A',
          hover: '#158C66',
          light: '#2CD9A1',
        },
        ivory: {
          DEFAULT: '#F8F5EF',
          dark: '#EFECE5',
          light: '#FDFCFA',
        },
        charcoal: {
          DEFAULT: '#252B29',
          light: '#3C4542',
          muted: '#636F6B',
        },
        sage: {
          DEFAULT: '#DDEBE3',
          light: '#EEF5F1',
          dark: '#C4DBD0',
        },
        gold: {
          DEFAULT: '#C9A96E',
          light: '#DFC79B',
          dark: '#A68448',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(20, 90, 70, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(20, 90, 70, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'emerald-glow': '0 0 20px -3px rgba(25, 167, 122, 0.35)',
        'gold-glow': '0 0 20px -3px rgba(201, 169, 110, 0.35)',
      },
    },
  },
  plugins: [],
};
