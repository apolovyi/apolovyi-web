// prettier.config.js
module.exports = {
  bracketSpacing: true,
  semi: true,
  trailingComma: 'all',
  printWidth: 120,
  tabWidth: 2,
  plugins: [require('prettier-plugin-tailwindcss')],
  arrowParens: 'always',
  singleQuote: true,
  quoteProps: 'consistent',
  bracketSameLine: false,
  overrides: [
    {
      files: ['*.json', '*.jsonc'],
      options: {
        printWidth: 1,
      },
    },
  ],
};
