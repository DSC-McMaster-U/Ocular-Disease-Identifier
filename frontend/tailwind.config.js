/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        google: ["ProductSans", "sans"]
      },
      boxShadow: {
        "section": "3px 3px 2px rgba(0, 0, 0, 0.20)"
      }
    },
    container: {
      center: true,
      screens: {
        sm: "600px",
        md: "728px",
        lg: "984px",
        xl: "1280px"
      }
    }
  },
  plugins: [],
};
