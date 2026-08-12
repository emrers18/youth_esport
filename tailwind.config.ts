import type { Config } from "tailwindcss";

/**
 * YouthEsportsArena design system — single bright esports theme.
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
        background: "#F6F9FE",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#2563EB",
          alt: "#DB2777",
        },
        primaryAlt: "#DB2777",
        secondary: "#047857",
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F0D479",
          dark: "#9C7A1F",
        },
        danger: "#DC2626",
        warning: "#B45309",
        textPrimary: "#0F172A",
        textSecondary: "#51607A",
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
        glow: "0 0 24px 0 rgba(37, 99, 235, 0.35)",
        "glow-secondary": "0 0 24px 0 rgba(4, 120, 87, 0.28)",
        "glow-gold": "0 0 24px 0 rgba(212, 175, 55, 0.4)",
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
