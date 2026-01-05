/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        steel: "#2C5E7A",
        charcoal: "#111827",
        cream: "#F5F3EF"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji"],
      },
      maxWidth: {
        "content": "72rem"
      }
    },
  },
  plugins: [],
};
