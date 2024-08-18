/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    rotate: {
      "-180": "-180deg",
      "-90": "-90deg",
      "-45": "-45deg",
      0: "0",
      45: "45deg",
      90: "90deg",
      135: "135deg",
      180: "180deg",
      270: "270deg",
    },
    extend: {
      fontFamily: {
        body: ["var(--font-quicksand)", "sans-serif"],
        heading: ["var(--font-comfortaa)", "sans-serif"],
        "sub-heading": ["var(--font-merriweather)", "serif"],
        tech: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      colors: {
        primary: {
          DEFAULT: "#005BB0",
          light: "#3E8DDA",
        },
        secondary: {
          DEFAULT: "#B05500",
          light: "#E07A20",
        },
        accent: {
          green: "#08a191",
          coral: "#ea5555",
        },
        neutral: {
          offwhite: "#F7F7F7",
          "light-gray": "#E5E5E5",
          "medium-gray": "#A0A0A0",
        },
        "dark-gray": "#4A4A4A",
        text: {
          primary: "#2B2B2B",
          secondary: "#5F5F5F",
        },
        background: {
          primary: "#FFFFFF",
          secondary: "#FAFAFA",
        },
        error: "#C90000",
        success: "#00C968",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
