import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vestra: {
          bg: "var(--vestra-bg)",
          "bg-alt": "var(--vestra-bg-alt)",
          surface: "var(--vestra-surface)",
          "surface-alt": "var(--vestra-surface-alt)",
          text: "var(--vestra-text)",
          "text-body": "var(--vestra-text-body)",
          "text-muted": "var(--vestra-text-muted)",
          border: "var(--vestra-border)",
          "border-soft": "var(--vestra-border-soft)",
          action: "var(--vestra-action)",
          "action-hover": "var(--vestra-action-hover)",
          "action-text": "var(--vestra-action-text)",
          accent: "var(--vestra-accent)",
          "accent-soft": "var(--vestra-accent-soft)",
          "focus-ring": "var(--vestra-focus-ring)",
          "nav-bg": "var(--vestra-nav-bg)",
          "nav-text": "var(--vestra-nav-text)",
          "nav-hover": "var(--vestra-nav-hover)",
        },
        // Backward compatibility alias for vayn
        vayn: {
          ivory: "var(--vestra-bg)",
          ink: "var(--vestra-text)",
          terracotta: "var(--vestra-action)",
          olive: "var(--vestra-accent)",
          sand: "var(--vestra-accent-soft)",
          border: "var(--vestra-border)",
          muted: "var(--vestra-text-muted)",
          light: "var(--vestra-surface)",
        },
        charcoal: "var(--vestra-text)",
        "charcoal-light": "var(--vestra-surface)",
        ivory: "var(--vestra-bg)",
        "ivory-dim": "var(--vestra-bg-alt)",
        silver: "var(--vestra-text-muted)",
        "silver-dark": "var(--vestra-border)",
        accent: {
          DEFAULT: "var(--vestra-action)",
          dim: "var(--vestra-accent)",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Sora'", "'Inter'", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(16px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
