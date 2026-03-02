import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				bgBase: 'var(--color-bg-base)',
				bgSurface: 'var(--color-bg-surface)',
				bgElevated: 'var(--color-bg-elevated)',
				borderBase: 'var(--color-border)',
				borderBright: 'var(--color-border-bright)',
				accentPurple: 'var(--color-accent-purple)',
				accentMagenta: 'var(--color-accent-magenta)',
				accentBlue: 'var(--color-accent-blue)',
				accentCyan: 'var(--color-accent-cyan)',
				textPrimary: 'var(--color-text-primary)',
				textSecondary: 'var(--color-text-secondary)',
				textMuted: 'var(--color-text-muted)',
				nodeAuth: 'var(--color-node-auth)',
				nodeApi: 'var(--color-node-api)',
				nodeDb: 'var(--color-node-db)',
				nodePayment: 'var(--color-node-payment)',
				nodeDashboard: 'var(--color-node-dashboard)',
				background: 'var(--color-bg-base)',
				foreground: 'var(--color-text-primary)',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				sans: [
					'var(--font-inter)',
					'sans-serif'
				]
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
				'gradient-glow': 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)'
			},
			letterSpacing: {
				eyebrow: '0.12em'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				brutal: '4px 4px 0px 0px #2c336c',
				brutalSm: '2px 2px 0px 0px #2c336c',
				brutalLg: '6px 6px 0px 0px #2c336c',
				brutalXl: '8px 8px 0px 0px #2c336c',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
