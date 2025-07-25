/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ensure this includes where your component lives
  ],
  darkMode: 'class', // or 'media' — important to know
  safelist: [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
