// prettier.config.js
module.exports = {
	bracketSpacing: true,
	useTabs: true,
	semi: false,
	singleQuote: true,
	trailingComma: 'all',
	bracketSameLine: false,
	singleAttributePerLine: true,
	printWidth: 140,
	tabWidth: 2,
	plugins: [require('@trivago/prettier-plugin-sort-imports'), require('prettier-plugin-tailwindcss')],
	arrowParens: 'always',
	quoteProps: 'consistent',
	importOrder: [
		'^(react/(.*)$)|^(react$)',
		'^(next/(.*)$)|^(next$)',
		'<THIRD_PARTY_MODULES>',
		'^@/app/(.*)$',
		'^@/components/(.*)$',
		'^@/lib/(.*)$',
		'^@/styles/(.*)$',
		'^@/dictionaries/(.*)$',
		'^[./]',
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	overrides: [
		{
			files: ['*.json', '*.jsonc'],
			options: {
				printWidth: 1,
			},
		},
	],
}
