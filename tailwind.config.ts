import type { Config } from "tailwindcss";

export default {
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
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      opacity: {
        text: "0.7",
      },
      fontSize: {
        base: "0.9rem",
      },
      screens: {
        phone: "640px",
      },
      animation: {
        "clipboard-animation":
          "clipboard-animation 5s cubic-bezier(0.5,0,0,1) forwards",
      },
      keyframes: {
        "clipboard-animation": {
          "0%": { transform: "translateY(150px)" },
          "15%": { transform: "translateY(0px)" },
          "85%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(150px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
