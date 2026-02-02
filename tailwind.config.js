// tailwind.config.js
const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(button|select|ripple|spinner|form|listbox|divider|popover|scroll-shadow).js",
  ],
  theme: {
    extend: {
      fontFamily: {
        geist: ["var(--font-geist)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
