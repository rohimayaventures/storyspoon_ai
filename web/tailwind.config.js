/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: "#F4A300",
        cream: "#FFF8E7",
        peacock: "#008B8B",
        phoenix: "#FF8C42",
        brown: "#8B4513",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.08)",
      },
      fontFamily: {
        sans: ["Inter","ui-sans-serif","system-ui"],
      }
    },
  },
  plugins: [],
}
