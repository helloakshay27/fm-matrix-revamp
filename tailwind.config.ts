
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
		extend: {
			fontFamily: {
				sans: ['Work Sans', 'sans-serif'],
			},
			fontSize: {
				// Desktop typography
				'heading-title-desktop': ['26px', { lineHeight: 'auto', fontWeight: '600' }],
				'title-1-desktop': ['24px', { lineHeight: 'auto', fontWeight: '500' }],
				'body-1-desktop': ['20px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-2-desktop': ['18px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-3-desktop': ['16px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-4-desktop': ['14px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-5-desktop': ['12px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-6-desktop': ['10px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-7-desktop': ['8px', { lineHeight: 'auto', fontWeight: '400' }],
				// Tablet typography
				'heading-title-tablet': ['24px', { lineHeight: 'auto', fontWeight: '500' }],
				'title-1-tablet': ['20px', { lineHeight: 'auto', fontWeight: '500' }],
				'body-1-tablet': ['18px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-2-tablet': ['16px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-3-tablet': ['14px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-4-tablet': ['12px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-5-tablet': ['10px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-6-tablet': ['8px', { lineHeight: 'auto', fontWeight: '400' }],
				// Mobile typography
				'heading-title-mobile': ['16px', { lineHeight: 'auto', fontWeight: '500' }],
				'title-1-mobile': ['14px', { lineHeight: 'auto', fontWeight: '500' }],
				'body-1-mobile': ['14px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-2-mobile': ['12px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-3-mobile': ['10px', { lineHeight: 'auto', fontWeight: '400' }],
				'body-4-mobile': ['8px', { lineHeight: 'auto', fontWeight: '400' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#C72030',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: '#C72030',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Design system colors
				'text-primary': '#1A1A1A',
				'text-secondary': 'rgba(26, 26, 26, 0.54)',
				'text-accent': '#C72030',
				'text-white': '#FFFFFF',
				'grey-text': '#AAB9C5',
				'bg-primary': '#F6F4EE',
				'bg-secondary': 'rgba(196, 184, 157, 0.35)',
				'shadow-color': 'rgba(69, 69, 69, 0.1)',
				'status-accepted': '#16B364',
				'status-pending': '#D9CA20',
				'status-rejected': '#D92E14',
				'progress-fill': '#C4B89D',
				'progress-stroke': '#C72030',
			},
			borderRadius: {
				lg: '0px',
				md: '0px',
				sm: '0px'
			},
			spacing: {
				// Design system spacing (8px scale with 4px half-step)
				'1': '4px',
				'2': '8px',
				'3': '12px',
				'4': '16px',
				'5': '20px',
				'6': '24px',
				'8': '32px',
				'10': '40px',
				'12': '48px',
				'14': '56px',
				'16': '64px',
				'18': '72px',
				'20': '80px',
				// Grid system
				'grid-gutter-desktop': '24px',
				'grid-gutter-tablet': '24px',
				'grid-gutter-mobile': '16px',
				'grid-margin-desktop': '24px',
				'grid-margin-tablet': '24px',
				'grid-margin-mobile': '16px',
			},
			maxWidth: {
				'grid-desktop': '1144px',
				'grid-tablet': '1024px',
				'grid-mobile': '360px',
			},
			width: {
				// Button sizes
				'btn-desktop': '136px',
				'btn-tablet': '116px',
				'btn-mobile': '94px',
				// Card sizes
				'card-desktop': '488px',
				'card-tablet': '300px',
				'card-mobile': '170px',
				// Dialog sizes
				'dialog-desktop': '416px',
				'dialog-tablet': '330px',
				'dialog-mobile': '214px',
				// Sidebar sizes
				'sidebar-desktop': '264px',
				'sidebar-tablet': '220px',
				'sidebar-mobile': '190px',
			},
			height: {
				// Button sizes
				'btn-desktop': '36px',
				'btn-tablet': '36px',
				'btn-mobile': '28px',
				// Card sizes
				'card-desktop': '132px',
				'card-tablet': '140px',
				'card-mobile': '96px',
				// Search bar sizes
				'search-desktop': '35px',
				'search-tablet': '35px',
				'search-mobile': '24px',
				// Dropdown sizes
				'dropdown-desktop': '56px',
				'dropdown-tablet': '42px',
				'dropdown-mobile': '28px',
				// Text field sizes
				'field-desktop': '56px',
				'field-tablet': '44px',
				'field-mobile': '28px',
				// Time input sizes
				'time-desktop': '40px',
				'time-tablet': '36px',
				'time-mobile': '28px',
			},
			boxShadow: {
				'design-system': '0px 2px 18px rgba(69, 69, 69, 0.1)',
			},
			gridTemplateColumns: {
				'12': 'repeat(12, minmax(0, 1fr))',
				'8': 'repeat(8, minmax(0, 1fr))',
				'4': 'repeat(4, minmax(0, 1fr))',
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
