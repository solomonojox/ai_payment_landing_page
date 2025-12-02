import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate";

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
  	container: {
  		// center: 'true',
  		padding: '2rem',
  		screens: {
			// 'xs': '375px',
			// 'sm': '640px',
			// 'md': '768px',
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			Mulish: ["Mulish", "Sans-serif"],
  			Inter: ["Inter", "Sans-serif"]
  		},
  		colors: {
  			primary: {
  				'50': '#EFEBFF',
  				'100': '#DED7FF',
  				'200': '#CEC3FE',
  				'300': '#BDAFFE',
  				'400': '#AD9CFE',
  				'500': '#9C88FE',
  				'600': '#8C74FE',
  				'700': '#7B60FD',
  				'800': '#6B4CFD',
  				'900': '#5A38FD'
  			},
  			secondary: {
  				'50': '#F0EFFA',
  				'100': '#E2DEF4',
  				'200': '#D3CEEF',
  				'300': '#C5BDE9',
  				'400': '#B6ADE4',
  				'500': '#A79CDE',
  				'600': '#998CD9',
  				'700': '#8A7BD3',
  				'800': '#7C6BCE',
  				'900': '#6D5AC8'
  			},
  			Success: {
  				'50': '#eff8ef',
  				'100': '#def1de',
  				'200': '#ceeace',
  				'300': '#bee3be',
  				'400': '#aedcae',
  				'500': '#9dd49d',
  				'600': '#8dcd8d',
  				'700': '#7dc67d',
  				'800': '#6cbf6c',
  				'900': '#5CB85C'
  			},
  			neutral: {
  				'50': '#ebecee',
  				'100': '#d6d9dd',
  				'200': '#c2c6cc',
  				'300': '#aeb3bb',
  				'400': '#9aa0aa',
  				'500': '#858c98',
  				'600': '#717987',
  				'700': '#5d6676',
  				'800': '#485365',
  				'900': '#344054'
  			},
  			warning: {
  				'50': '#fcf0e6',
  				'100': '#f8e1cd',
  				'200': '#f5d2b3',
  				'300': '#f1c39a',
  				'400': '#eeb481',
  				'500': '#eaa468',
  				'600': '#e7954f',
  				'700': '#e38635',
  				'800': '#e0771c',
  				'900': '#DC6803'
  			},
  			error: {
  				'50': '#fef0ee',
  				'100': '#fee0de',
  				'200': '#fdd1cd',
  				'300': '#fdc2bc',
  				'400': '#fcb3ac',
  				'500': '#fba39b',
  				'600': '#fb948a',
  				'700': '#fa8579',
  				'800': '#fa7569',
  				'900': '#F96658'
  			}
  		},
  		keyframes: {
  			'caret-blink': {
  				'0%,70%,100%': {
  					opacity: '1'
  				},
  				'20%,50%': {
  					opacity: '0'
  				}
  			},
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
  		},
  		animation: {
  			'caret-blink': 'caret-blink 1.25s ease-out infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  		}
  	}
  },
  plugins: [animate],
} satisfies Config

export default config

// require('@tailwindcss/line-clamp'),