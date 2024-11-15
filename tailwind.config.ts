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
        mono: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"],
      },
      opacity: {
        text: "0.7",
      },
      fontSize: {
        base: "1rem",
      },
      screens: {
        phone: "640px",
      },
      animation: {
        "clipboard-animation":
          "clipboard-animation 5s cubic-bezier(0.5,0,0,1) forwards",
        "fade-in": "fade-in 1s cubic-bezier(0.5,0,0,1) both",
      },
      keyframes: {
        "clipboard-animation": {
          "0%": { transform: "translateY(150px)" },
          "15%": { transform: "translateY(0px)" },
          "85%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(150px)" },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.97) translateY(10px)",
            transformOrigin: "top",
            filter: "blur(3px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0px)",
            filter: "blur(0px)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
