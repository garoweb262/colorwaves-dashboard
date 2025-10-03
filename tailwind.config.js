/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: '#70369D', // Violet - Main primary color
  				foreground: '#FFFFFF',
  				50: '#F3E8FF',
  				100: '#E9D5FF',
  				200: '#D8B4FE',
  				300: '#C084FC',
  				400: '#A855F7',
  				500: '#70369D', // Main violet
  				600: '#7C3AED',
  				700: '#6D28D9',
  				800: '#5B21B6',
  				900: '#4C1D95',
  			},
  			secondary: {
  				DEFAULT: '#4B369D', // Indigo
  				foreground: '#FFFFFF',
  				50: '#EEF2FF',
  				100: '#E0E7FF',
  				200: '#C7D2FE',
  				300: '#A5B4FC',
  				400: '#818CF8',
  				500: '#4B369D', // Main indigo
  				600: '#4F46E5',
  				700: '#4338CA',
  				800: '#3730A3',
  				900: '#312E81',
  			},
  			destructive: {
  				DEFAULT: '#E81416', // Red
  				foreground: '#FFFFFF',
  				50: '#FEF2F2',
  				100: '#FEE2E2',
  				200: '#FECACA',
  				300: '#FCA5A5',
  				400: '#F87171',
  				500: '#E81416', // Main red
  				600: '#DC2626',
  				700: '#B91C1C',
  				800: '#991B1B',
  				900: '#7F1D1D',
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: '#487DE7', // Blue
  				foreground: '#FFFFFF',
  				50: '#EFF6FF',
  				100: '#DBEAFE',
  				200: '#BFDBFE',
  				300: '#93C5FD',
  				400: '#60A5FA',
  				500: '#487DE7', // Main blue
  				600: '#2563EB',
  				700: '#1D4ED8',
  				800: '#1E40AF',
  				900: '#1E3A8A',
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			// Color Palette from the images
  			palette: {
  				// Primary colors (Violet as main)
  				violet: {
  					DEFAULT: '#70369D', // Violet - Main primary color
  					50: '#F3E8FF',
  					100: '#E9D5FF',
  					200: '#D8B4FE',
  					300: '#C084FC',
  					400: '#A855F7',
  					500: '#70369D', // Main violet
  					600: '#7C3AED',
  					700: '#6D28D9',
  					800: '#5B21B6',
  					900: '#4C1D95',
  				},
  				// Secondary colors
  				indigo: {
  					DEFAULT: '#4B369D', // Indigo
  					50: '#EEF2FF',
  					100: '#E0E7FF',
  					200: '#C7D2FE',
  					300: '#A5B4FC',
  					400: '#818CF8',
  					500: '#4B369D', // Main indigo
  					600: '#4F46E5',
  					700: '#4338CA',
  					800: '#3730A3',
  					900: '#312E81',
  				},
  				// Accent colors
  				blue: {
  					DEFAULT: '#487DE7', // Blue
  					50: '#EFF6FF',
  					100: '#DBEAFE',
  					200: '#BFDBFE',
  					300: '#93C5FD',
  					400: '#60A5FA',
  					500: '#487DE7', // Main blue
  					600: '#2563EB',
  					700: '#1D4ED8',
  					800: '#1E40AF',
  					900: '#1E3A8A',
  				},
  				// Success colors
  				green: {
  					DEFAULT: '#79C214', // Green
  					50: '#F0FDF4',
  					100: '#DCFCE7',
  					200: '#BBF7D0',
  					300: '#86EFAC',
  					400: '#4ADE80',
  					500: '#79C214', // Main green
  					600: '#16A34A',
  					700: '#15803D',
  					800: '#166534',
  					900: '#14532D',
  				},
  				// Warning colors
  				yellow: {
  					DEFAULT: '#F9EA36', // Yellow
  					50: '#FEFCE8',
  					100: '#FEF3C7',
  					200: '#FDE68A',
  					300: '#FCD34D',
  					400: '#FBBF24',
  					500: '#F9EA36', // Main yellow
  					600: '#D97706',
  					700: '#B45309',
  					800: '#92400E',
  					900: '#78350F',
  				},
  				// Error colors
  				red: {
  					DEFAULT: '#E81416', // Red
  					50: '#FEF2F2',
  					100: '#FEE2E2',
  					200: '#FECACA',
  					300: '#FCA5A5',
  					400: '#F87171',
  					500: '#E81416', // Main red
  					600: '#DC2626',
  					700: '#B91C1C',
  					800: '#991B1B',
  					900: '#7F1D1D',
  				},
  				// Additional palette colors
  				coral: {
  					DEFAULT: '#FF6F61',
  					50: '#FFF5F5',
  					100: '#FED7D7',
  					200: '#FEB2B2',
  					300: '#FC8181',
  					400: '#F56565',
  					500: '#FF6F61', // Main coral
  					600: '#E53E3E',
  					700: '#C53030',
  					800: '#9C2626',
  					900: '#742A2A',
  				},
  				gold: {
  					DEFAULT: '#FFD700',
  					50: '#FFFBEB',
  					100: '#FEF3C7',
  					200: '#FDE68A',
  					300: '#FCD34D',
  					400: '#FBBF24',
  					500: '#FFD700', // Main gold
  					600: '#D97706',
  					700: '#B45309',
  					800: '#92400E',
  					900: '#78350F',
  				},
  				lime: {
  					DEFAULT: '#A2D63A',
  					50: '#F7FEE7',
  					100: '#ECFCCB',
  					200: '#D9F99D',
  					300: '#BEF264',
  					400: '#A3E635',
  					500: '#A2D63A', // Main lime
  					600: '#65A30D',
  					700: '#4D7C0F',
  					800: '#365314',
  					900: '#1A2E05',
  				},
  				sky: {
  					DEFAULT: '#2E86C1',
  					50: '#F0F9FF',
  					100: '#E0F2FE',
  					200: '#BAE6FD',
  					300: '#7DD3FC',
  					400: '#38BDF8',
  					500: '#2E86C1', // Main sky blue
  					600: '#0284C7',
  					700: '#0369A1',
  					800: '#075985',
  					900: '#0C4A6E',
  				},
  			},
  			'amaltech-orange': '#F26B1D',
  			'amaltech-blue': '#00274D',
  			amaltech: {
  				orange: '#F26B1D',
  				blue: '#00274D',
  				white: '#FFFFFF',
  				gray: {
  					'50': '#F9FAFB',
  					'100': '#F3F4F6',
  					'200': '#E5E7EB',
  					'300': '#D1D5DB',
  					'400': '#9CA3AF',
  					'500': '#6B7280',
  					'600': '#4B5563',
  					'700': '#374151',
  					'800': '#1F2937',
  					'900': '#111827'
  				}
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		fontFamily: {
			sans: [
				'var(--font-inter)',
				'Inter',
				'system-ui',
				'-apple-system',
				'BlinkMacSystemFont',
				'Segoe UI',
				'Roboto',
				'Helvetica Neue',
				'Arial',
				'sans-serif'
			],
			heading: [
				'var(--font-maven-pro)',
				'Maven Pro',
				'var(--font-inter)',
				'Inter',
				'system-ui',
				'sans-serif'
			],
			display: [
				'var(--font-maven-pro)',
				'Maven Pro',
				'var(--font-inter)',
				'Inter',
				'system-ui',
				'sans-serif'
			],
			mono: [
				'ui-monospace',
				'SFMono-Regular',
				'SF Mono',
				'Consolas',
				'Liberation Mono',
				'Menlo',
				'monospace'
			]
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
} 