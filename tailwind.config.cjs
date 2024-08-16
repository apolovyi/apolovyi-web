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
        primary: "#0b192f",
        secondary: "#64ffda",
        error: "#ff6489",
        tertiary: "#112340",
        "resume-hover": "#153040",
        navbar: "#112340",
        startup: "#020c1b",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  variants: {
    scrollbar: ["rounded"],
  },
};
