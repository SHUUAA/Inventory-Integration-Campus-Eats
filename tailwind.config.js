/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neutral: {
          950: "#DFD5C5",
        },
        red: {
          950: "#C04C4C",
        },
        white: {
          950: "#FFFAF1",
        },
        brown: {
          950: "#DFD5C5",
        },
      },
    },
  },
  plugins: [],
};
