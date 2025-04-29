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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1E3B58",
        secondary: "#4A84AA",
        btnSecondary: "#3281B8",
        third: "#E4F1FE",
        textColor: "#3498DB",
        adminTextHeader: "#202224"
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
export default config;
