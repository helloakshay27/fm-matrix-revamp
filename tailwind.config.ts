
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		screens: {
			'xs': '400px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1400px',
		},
		extend: {
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
				'work-sans': ['Work Sans', 'sans-serif'],
				sans: ['Poppins', 'sans-serif'], // Set Poppins as default
			},
			colors: {
				// ========================================
				// LOCKATED BRAND COLORS - CSS Variable Mapping
				// These map to theme.css variables for consistency
				// ========================================

				// Primary Brand Colors
				'brand': {
					DEFAULT: 'var(--color-primary)',
					hover: 'var(--color-primary-hover)',
					light: 'var(--color-primary-light)',
					selected: 'var(--color-primary-selected)',
				},
				'brand-bg': 'var(--color-bg)',
				'brand-text': 'var(--color-text)',
				'brand-text-light': 'var(--color-text-light)',

				// Secondary Colors
				'brand-green': {
					DEFAULT: 'var(--color-secondary-green)',
					light: 'var(--color-secondary-green-light)',
					bg: 'var(--color-secondary-green-bg)',
				},
				'brand-purple': {
					DEFAULT: 'var(--color-secondary-purple)',
					light: 'var(--color-secondary-purple-light)',
					bg: 'var(--color-secondary-purple-bg)',
				},
				'brand-teal': {
					DEFAULT: 'var(--color-secondary-teal)',
					light: 'var(--color-secondary-teal-light)',
					bg: 'var(--color-secondary-teal-bg)',
				},

				// Status Colors
				'brand-success': {
					DEFAULT: 'var(--color-success-solid)',
					light: 'var(--color-success)',
					bg: 'var(--color-success-bg)',
				},
				'brand-warning': {
					DEFAULT: 'var(--color-warning)',
					light: 'var(--color-warning-light)',
				},
				'brand-error': {
					DEFAULT: 'var(--color-error)',
					light: 'var(--color-danger-light)',
					bg: 'var(--color-error-bg)',
				},
				'brand-info': {
					DEFAULT: 'var(--color-info)',
				},

				// Surface Colors
				'brand-card': {
					DEFAULT: 'var(--color-card-white)',
					bg: 'var(--color-card-bg)',
					border: 'var(--color-card-border)',
				},
				'brand-border': {
					DEFAULT: 'var(--color-border-subtle)',
					card: 'var(--color-card-border)',
				},
				'brand-sidebar': 'var(--color-sidebar)',
				'brand-muted': 'var(--color-muted)',
				'brand-disabled': 'var(--color-disabled)',

				// Semantic Colors (for dashboard/charts)
				'brand-tags': 'var(--color-tags)',
				'brand-danger': 'var(--color-danger)',
				'brand-growth': 'var(--color-growth-solid)',

				// ========================================
				// Legacy Tailwind CSS Variable Mappings
				// ========================================
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'var(--color-bg)',
				foreground: 'var(--color-text)',
				primary: {
					DEFAULT: 'var(--color-primary)',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: 'var(--color-secondary-green)',
					foreground: '#FFFFFF'
				},
				destructive: {
					DEFAULT: 'var(--color-error)',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: 'var(--color-muted)',
					foreground: 'var(--color-text-light)'
				},
				accent: {
					DEFAULT: 'var(--color-primary-selected)',
					foreground: 'var(--color-text)'
				},
				popover: {
					DEFAULT: 'var(--color-card-white)',
					foreground: 'var(--color-text)'
				},
				card: {
					DEFAULT: 'var(--color-card-white)',
					foreground: 'var(--color-text)'
				},
				sidebar: {
					DEFAULT: 'var(--color-sidebar)',
					foreground: 'var(--color-text)',
					primary: 'var(--color-primary)',
					'primary-foreground': '#FFFFFF',
					accent: 'var(--color-primary-selected)',
					'accent-foreground': 'var(--color-text)',
					border: 'var(--color-card-border)',
					ring: 'var(--color-primary)'
				},
				folder: "hsl(var(--folder-color))",

				// Status color aliases for compatibility
				success: 'var(--color-success-solid)',
				warning: 'var(--color-warning)',
				error: 'var(--color-error)',
				info: 'var(--color-info)',
			},
			borderRadius: {
				lg: 'var(--radius-lg, 0px)',
				md: 'var(--radius-md, 0px)',
				sm: 'var(--radius-sm, 0px)'
			},
			spacing: {
				'system-xs': 'var(--spacing-xs, 4px)',
				'system-sm': 'var(--spacing-sm, 8px)',
				'system-md': 'var(--spacing-md, 16px)',
				'system-lg': 'var(--spacing-lg, 24px)',
				'system-xl': 'var(--spacing-xl, 32px)',
				'system-2xl': 'var(--spacing-2xl, 48px)',
				'system-3xl': 'var(--spacing-3xl, 64px)'
			},
			boxShadow: {
				'system-sm': 'var(--shadow-sm)',
				'system-md': 'var(--shadow-md)',
				'system-lg': 'var(--shadow-lg)',
				'system-xl': 'var(--shadow-xl)',
				'brand-card': 'var(--shadow-card)',
			},
			fontSize: {
				// Brand typography scale
				'brand-h1': 'var(--font-size-h1)',
				'brand-h2': 'var(--font-size-h2)',
				'brand-body-1': 'var(--font-size-body-1)',
				'brand-body-2': 'var(--font-size-body-2)',
				'brand-body-3': 'var(--font-size-body-3)',
				'brand-body-4': 'var(--font-size-body-4)',
				'brand-body-5': 'var(--font-size-body-5)',
				'brand-caption': 'var(--font-size-caption)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				"matrix-expand": {
					"0%": {
						transform: "scale(0.6) translate(40%, 40%)",
						opacity: "0",
					},
					"100%": {
						transform: "scale(1) translate(0%, 0%)",
						opacity: "1",
					},
				},
				"matrix-collapse": {
					"0%": {
						transform: "scale(1) translate(0%, 0%)",
						opacity: "1",
					},
					"100%": {
						transform: "scale(0.6) translate(40%, 40%)",
						opacity: "0",
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				"matrix-expand": "matrix-expand 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
				"matrix-collapse": "matrix-collapse 0.4s cubic-bezier(0.4, 0, 1, 1)",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
