/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",

        // max-width helpers (NU suprascriu sm/md/lg/xl)
        "max-xl": { max: "1200px" },
        "max-lg": { max: "1080px" },
        "max-mdlg": { max: "991px" },
        "max-md": { max: "768px" },
        "max-sm": { max: "576px" },
        "max-xs": { max: "480px" },
        "max-2xs": { max: "340px" },
      },
    },
  },
  plugins: [],
};



