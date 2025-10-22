/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        steel: "#2C5E7A",           // primary brand
        charcoal: "#111827",        // deep neutral
        cream: "#F5F3EF"            // warm light
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji"],
      },
      maxWidth: {
        "content": "72rem"          // 1152px ≈ nice readable width
      }
    },
  },
  plugins: [],
};
