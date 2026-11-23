import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      fontSize: {
        hero: [
          "clamp(2rem, 1.4rem + 2.4vw, 3.25rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em" },
        ],
        section: [
          "clamp(1.625rem, 1.2rem + 1.4vw, 2.25rem)",
          { lineHeight: "1.2", letterSpacing: "-0.02em" },
        ],
        card: [
          "clamp(1.25rem, 1.15rem + 0.4vw, 1.5rem)",
          { lineHeight: "1.3", letterSpacing: "-0.01em" },
        ],
        subtitle: [
          "clamp(1.125rem, 1rem + 0.5vw, 1.25rem)",
          { lineHeight: "1.4", letterSpacing: "0em" },
        ],
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "var(--font-cairo)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        heading: [
          "var(--font-heading)",
          "var(--font-cairo)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "var(--font-jetbrains-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        arabic: ["var(--font-cairo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
