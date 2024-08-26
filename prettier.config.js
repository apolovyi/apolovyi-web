// prettier.config.js
module.exports = {
	bracketSpacing: true,
	useTabs: true,
	semi: true,
	trailingComma: "all",
	printWidth: 120,
	tabWidth: 2,
	plugins: [require("@trivago/prettier-plugin-sort-imports"), require("prettier-plugin-tailwindcss")],
	arrowParens: "always",
	singleQuote: false,
	quoteProps: "consistent",
	bracketSameLine: false,
	importOrder: [
		"^(react/(.*)$)|^(react$)",
		"^(next/(.*)$)|^(next$)",
		"<THIRD_PARTY_MODULES>",
		"^@/components/(.*)$",
		"^@/lib/(.*)$",
		"^@/styles/(.*)$",
		"^@/dictionaries/(.*)$",
		"^[./]",
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	overrides: [
		{
			files: ["*.json", "*.jsonc"],
			options: {
				printWidth: 1,
			},
		},
	],
};
