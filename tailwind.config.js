/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#df65f7",
          "secondary": "#7309e5",
          "accent": "#58c1d8",
          "neutral": "#171d27",
          "base-100": "#e5dfec",
          "info": "#70a3d7",
          "success": "#199471",
          "warning": "#b88914",
          "error": "#fb3768",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
