/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        rose: "#C8798A", plum: "#5E2A3B", wine: "#7A2E43",
        champagne: "#E8D5C4", shell: "#F6ECE6", cream: "#FBF5F0",
        ink: "#241A1C", mutedwarm: "#93807F", linewarm: "#EADCD3", gold: "#B08D57",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Jost", "system-ui", "sans-serif"],
      },
      borderRadius: { arch: "200px 200px 8px 8px" },
    },
  },
  plugins: [],
};
