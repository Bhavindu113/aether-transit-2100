import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#4F46E5",
          600: "#4338CA",
          700: "#3730A3",
          800: "#312E81",
          900: "#1E1B4B",
        },
        transit: {
          blue: "#2563EB",
          blueLight: "#3B82F6",
          blueSoft: "rgba(37, 99, 235, 0.15)",
          emerald: "#10B981",
          emeraldDark: "#059669",
          emeraldSoft: "rgba(16, 185, 129, 0.15)",
          amber: "#F59E0B",
          amberSoft: "rgba(245, 158, 11, 0.15)",
          coral: "#F97316",
          rose: "#E11D48",
          slateDark: "#0B1120",
          cardDark: "rgba(17, 24, 39, 0.75)",
          cardBorder: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "Consolas", "monospace"],
      },
      boxShadow: {
        "soft-blue": "0 10px 25px -5px rgba(37, 99, 235, 0.2)",
        "soft-emerald": "0 10px 25px -5px rgba(16, 185, 129, 0.2)",
        "card": "0 8px 30px rgba(0, 0, 0, 0.25)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
