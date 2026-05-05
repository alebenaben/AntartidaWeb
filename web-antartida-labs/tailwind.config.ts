import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0A1F44",
        cyan: "#00C2FF",
        blue: {
          DEFAULT: "#1E63D6",
          light: "#E8F0FE",
        },
        background: "#FFFFFF",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-accent": "linear-gradient(to right, #00C2FF, #1E63D6)",
      },
    },
  },
  plugins: [],
};
export default config;
