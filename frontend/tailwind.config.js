/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ensure this includes where your component lives
  ],
  darkMode: 'class', // or 'media' — important to know
  theme: {
    extend: {},
  },
  plugins: [],
};
