/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      maxWidth: {
        container: "1440px",
      },
      screens: {
        xs: "320px",
        sm: "375px",
        sml: "500px",
        md: "667px",
        mdl: "768px",
        lg: "960px",
        lgl: "1024px",
        xl: "1280px",
      },
      fontFamily: {
        bodyFont: ["DM Sans", "sans-serif"],
        titleFont: ["Poppins", "sans-serif"],
      },
      colors: {
        primeColor: "#262626",
        lightText: "#6D6D6D",
        lightBaground: "#F5F5F3",
      },
      boxShadow: {
        testShadow: "0px 0px 54px -13px rgba(0,0,0,0.7)",
      },
      keyframes: {
        fadeOut: {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
      animation: {
        fadeOut: "fadeOut linear forwards",
      },
    },
  },
  plugins: [require("tailwind-scrollbar"), require("flowbite/plugin")],
};
