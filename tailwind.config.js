/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hobaDark: '#0B132B',
        hobaCard: '#1C2541',
        hobaAccent: '#38BDF8',
      },
    },
  },
  plugins: [],
}