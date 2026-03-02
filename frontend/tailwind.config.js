/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E8E6E",
        lightBg: "#F5F7F6",
      },
    },
  },
  plugins: [],
}

