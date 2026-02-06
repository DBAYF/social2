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
          DEFAULT: '#2D3748',
          light: '#4A5568',
          dark: '#1A202C',
        },
        accent: {
          DEFAULT: '#3182CE',
          light: '#63B3ED',
          dark: '#2C5282',
        },
        success: '#38A169',
        warning: '#D69E2E',
        error: '#E53E3E',
        surface: '#F7FAFC',
        border: '#E2E8F0',
        'text-primary': '#1A202C',
        'text-secondary': '#718096',
        'text-muted': '#A0AEC0',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'lg': '0.75rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
