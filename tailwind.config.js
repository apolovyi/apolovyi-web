/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
			},
		},
	},
}
