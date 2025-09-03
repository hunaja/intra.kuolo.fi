import { heroui } from "@heroui/theme";
import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./wiki/**/*.mdx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(number-input|button|ripple|spinner|form).js",
  ],
  darkMode: "class",
  plugins: [
    require("@tailwindcss/typography"),
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              100: "#FBF9D9",
              200: "#F8F2B5",
              300: "#9ac1ff",
              400: "#D9CC6B",
              500: "#C1AF3F",
              600: "#A5932E",
              700: "#8A791F",
              800: "#6F5F14",
              900: "#5C4C0C",
              DEFAULT: "#8A791F",
            },
            danger: {
              100: "#FFECE3",
              200: "#FFD5C7",
              300: "#FFB9AC",
              400: "#FF9F97",
              500: "#FF7577",
              600: "#DB5563",
              700: "#B73A52",
              800: "#932543",
              900: "#7A163A",
              DEFAULT: "#B73A52",
            },
          },
        },
        light: {
          colors: {
            primary: {
              100: "#FBF9D9",
              200: "#F8F2B5",
              300: "#9ac1ff",
              400: "#D9CC6B",
              500: "#C1AF3F",
              600: "#A5932E",
              700: "#8A791F",
              800: "#6F5F14",
              900: "#5C4C0C",
              DEFAULT: "#C1AF3F",
            },
            danger: {
              100: "#FFECE3",
              200: "#FFD5C7",
              300: "#FFB9AC",
              400: "#FF9F97",
              500: "#FF7577",
              600: "#DB5563",
              700: "#B73A52",
              800: "#932543",
              900: "#7A163A",
              DEFAULT: "#FF7577",
            },
          },
        },
      },
    }),
    heroui(),
  ],
};
export default config;
