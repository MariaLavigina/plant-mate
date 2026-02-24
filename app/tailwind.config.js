/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
        heading: ['Quicksand', 'sans-serif'],
        caveat: ['Caveat', 'cursive'],
        comic: ['Comic Relief', 'system-ui'],
      },
      colors: {
        darkPurple: "#210E4A",
        lightPurple: "#5A1B27",
        primaryBrown: "#A75B2B",
        accentPink: "#F4E5FB",
        teal: "#65F0CD",
      }
    },
  },
  plugins: [],
};