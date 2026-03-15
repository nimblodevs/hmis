/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          50: '#f7f6f5',
          100: '#efedeb',
          200: '#dfd9d5',
          300: '#cac0b9',
          400: '#b0a298',
          500: '#9c8c80',
          600: '#8c7b6f',
          700: '#75655d',
          800: '#61554f',
          900: '#504642',
        },
        silver: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#60a5fa', // blue-400
          dark: '#1d4ed8', // blue-700
        }
      }
    },
  },
  plugins: [],
}
