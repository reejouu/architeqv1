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
        bgBase: "#0A0A0F",
        bgSurface: "#0F0F1A",
        bgElevated: "#141428",
        borderBase: "rgba(139, 92, 246, 0.2)",
        borderBright: "rgba(168, 85, 247, 0.55)",
        accentPurple: "#8B5CF6",
        accentMagenta: "#D946EF",
        accentBlue: "#3B82F6",
        accentCyan: "#22D3EE",
        textPrimary: "#F4F4F8",
        textSecondary: "#A1A1AA",
        textMuted: "#52525B",
        nodeAuth: "#8B5CF6",
        nodeApi: "#3B82F6",
        nodeDb: "#22D3EE",
        nodePayment: "#D946EF",
        nodeDashboard: "#F59E0B"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
      },
      letterSpacing: {
        eyebrow: '0.12em',
      },
    },
  },
  plugins: [],
};
export default config;
