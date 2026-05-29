/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'velvet-purple': '#5C3975',
        'velvet-purple-dark': '#4a2d5e',
        'velvet-golden': '#CBB26A',
        'velvet-golden-dark': '#b89d5a',
      },
    },
  },
  plugins: [],
};
