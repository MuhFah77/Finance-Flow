/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF9F5",
        ink: "#1B2430",
        line: "#DAD5C8",
        pine: {
          DEFAULT: "#2F5D50",
          light: "#3F7767",
          dark: "#1F4038",
        },
        brick: {
          DEFAULT: "#8B3A3A",
          light: "#A9504E",
        },
        sand: "#F1EDE1",
        // dark mode surfaces
        dpaper: "#14181C",
        dink: "#EDEBE3",
        dline: "#2C333A",
        dsand: "#1C2126",
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};