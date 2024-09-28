/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'matte-black': '#282828',
        'matte-black2': '#222222',
        'white1': '#E5E5E5',
        'green1': '#087E4C',
        'custom-blue': '#1E40AF',  // You can add more custom colors
        // Add more custom colors as needed
      },
    },
  },
  plugins: [],
}