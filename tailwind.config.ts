import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-manrope)', 'sans-serif'],
  			headline: ['var(--font-space-grotesk)', 'sans-serif'],
  		},
  		colors: {
  			background: '#0e0e0e',
  			foreground: '#fcf9f8',
  			card: {
  				DEFAULT: '#1a1a1a',
  				foreground: '#fcf9f8'
  			},
  			popover: {
  				DEFAULT: '#262626',
  				foreground: '#fcf9f8'
  			},
  			primary: {
  				DEFAULT: '#ffa44c',
  				foreground: '#552d00'
  			},
  			secondary: {
  				DEFAULT: '#feb64c',
  				foreground: '#583700'
  			},
  			muted: {
  				DEFAULT: '#262626',
  				foreground: '#adaaaa'
  			},
  			accent: {
  				DEFAULT: '#fd9000',
  				foreground: '#1e0c00'
  			},
  			destructive: {
  				DEFAULT: '#ff7351',
  				foreground: '#450900'
  			},
  			border: 'rgba(72, 72, 71, 0.2)',
  			input: '#262626',
  			ring: 'rgba(255, 164, 76, 0.5)',
  		},
  		borderRadius: {
  			lg: '0px',
  			md: '0px',
  			sm: '0px'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
