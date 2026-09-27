/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14151D",
        surface: "#1C1E29",
        surface2: "#24273366",
        line: "#2E313F",
        lime: "#C6FF3D",
        coral: "#FF6B4A",
        offwhite: "#F0F0EC",
        muted: "#8A8D9A",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
