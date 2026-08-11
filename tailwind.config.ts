import type { Config } from "tailwindcss";

/**
 * YouthArenaEsports design system — single dark esports theme.
 * These tokens are the source of truth referenced throughout /app and /components.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0E14",
        surface: "#1A1F2B",
        primary: {
          DEFAULT: "#7B5CFF",
          alt: "#4E7CFF",
        },
        primaryAlt: "#4E7CFF",
        secondary: "#39FFB0",
        danger: "#FF4D4D",
        warning: "#FFB84D",
        textPrimary: "#F2F3F7",
        textSecondary: "#9AA0B0",
      },
      fontFamily: {
        heading: ["var(--font-rajdhani)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      spacing: {
        "1.5x": "8px",
        "2x": "16px",
        "3x": "24px",
        "4x": "32px",
        "6x": "48px",
        "8x": "64px",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        glow: "0 0 24px 0 rgba(123, 92, 255, 0.45)",
        "glow-secondary": "0 0 24px 0 rgba(57, 255, 176, 0.35)",
      },
      screens: {
        xs: "375px",
      },
      maxWidth: {
        "8xl": "1400px",
      },
    },
  },
  plugins: [],
};

export default config;
