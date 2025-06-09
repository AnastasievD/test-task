/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
      },
      fontWeight: {
        normal: 400,
        semibold: 500,
        bold: 600
      },
    },
  },
  plugins: [],
}

