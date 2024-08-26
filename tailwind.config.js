const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		// container: {
		//   center: true,
		//   padding: "3rem",
		// },
		rotate: {
			"-180": "-180deg",
			"-90": "-90deg",
			"-45": "-45deg",
			"0": "0",
			"45": "45deg",
			"90": "90deg",
			"135": "135deg",
			"180": "180deg",
			"270": "270deg",
		},
		extend: {
			screens: {
				tall: { raw: "(min-height: 820px)" },
			},
			fontFamily: {
				"body": ["var(--font-quicksand)", "sans-serif"],
				"heading": ["var(--font-comfortaa)", "sans-serif"],
				"sub-heading": ["var(--font-merriweather)", "serif"],
				"tech": ["var(--font-ibm-plex-mono)", "monospace"],
			},
			// colors: {
			//   primary: {
			//     DEFAULT: "#005BB0",
			//     light: "#3E8DDA",
			//   },
			//   secondary: {
			//     DEFAULT: "#B05500",
			//     light: "#E07A20",
			//   },
			//   accent: {
			//     green: "#08a191",
			//     coral: "#ea5555",
			//   },
			//   neutral: {
			//     offwhite: "#F7F7F7",
			//     "light-gray": "#E5E5E5",
			//     "medium-gray": "#A0A0A0",
			//   },
			//   "dark-gray": "#4A4A4A",
			//   text: {
			//     primary: "#2B2B2B",
			//     secondary: "#5F5F5F",
			//   },
			//   background: {
			//     primary: "#FFFFFF",
			//     secondary: "#FAFAFA",
			//   },
			//   error: "#C90000",
			//   success: "#00C968",
			// },
			colors: {
				border: "var(--border)",
				neutral: {
					"offwhite": "#F7F7F7",
					"light-gray": "#E5E5E5",
					"medium-gray": "#A0A0A0",
				},
				input: "var(--input)",
				ring: "var(--ring)",
				// background: "var(--background)",
				background: {
					DEFAULT: "var(--background)",
					primary: "#FFFFFF",
					secondary: "#FAFAFA",
				},
				foreground: "var(--foreground)",
				error: "#C90000",
				success: "#00C968",
				text: {
					primary: "#2B2B2B",
					secondary: "#5F5F5F",
				},
				primary: {
					DEFAULT: "var(--primary)",
					foreground: "var(--primary-foreground)",
				},
				secondary: {
					DEFAULT: "var(--secondary)",
					foreground: "var(--secondary-foreground)",
				},
				destructive: {
					DEFAULT: "var(--destructive)",
					foreground: "var(--destructive-foreground)",
				},
				muted: {
					DEFAULT: "var(--muted)",
					foreground: "var(--muted-foreground)",
				},
				accent: {
					DEFAULT: "var(--accent)",
					foreground: "var(--accent-foreground)",
					coral: "#ea5555",
					green: "#005bb0",
				},
				popover: {
					DEFAULT: "var(--popover)",
					foreground: "var(--popover-foreground)",
				},
				card: {
					DEFAULT: "var(--card)",
					foreground: "var(--card-foreground)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"aurora": {
					from: {
						backgroundPosition: "50% 50%, 50% 50%",
					},
					to: {
						backgroundPosition: "350% 50%, 350% 50%",
					},
				},
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"aurora": "aurora 60s linear infinite",
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography"), addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

	addBase({
		":root": newVars,
	});
}
