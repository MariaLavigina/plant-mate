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
        heading: ['Akaya Kanadaka', 'system-ui'],
        caveat: ['Akaya Kanadaka', 'system-ui'],
        comic: ['Comic Relief', 'system-ui'],
      },
      colors: {
        darkPurple: "#210E4A",
        darkPurpleDeep: "#2D1260",
        lightPurple: "#5A1B27",
        primaryBrown: "#A75B2B",
        accentPink: "#F4E5FB",
        teal: "#65F0CD",
        tealDark: "#4FD4B3",
        lavender: "#E2CFFA",
      }
    },
  },
  plugins: [],
};