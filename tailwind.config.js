/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: {
          A6: "rgba(0, 0, 0, 0.4)",
        },
        neutral: {
          950: "#DFD5C5",
        },
        red: {
          950: "#C04C4C",
          1000: "#B84B4E",
          1050: "#A93D41",
          1100: "#EF9A97",
          1150: "#E8B3B1",
        },
        white: {
          950: "#FFFAF1",
        },
        brown: {
          950: "#B6AFA3",
          1000: "#CBC5BB",
          1050: "#C1BAAE",
          1100: "#B6AFA3",
        },
      },
      keyframes: {
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        contentShow: {
          from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
