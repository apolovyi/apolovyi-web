import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

// Bridge legacy "extends" configs (e.g., "next/core-web-vitals", "next/typescript", "prettier")
const compat = new FlatCompat({
  // import.meta.dirname is available on Node >= 20.11
  baseDirectory: import.meta.dirname,
})

const config = [
  // Ignore build artifacts and vendor directories when running `eslint .`
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts']
  },
  // Base ESLint recommended (in addition to Next's)
  js.configs.recommended,
  // Base Next + Prettier for all files
  ...compat.config({
    extends: ['next/core-web-vitals', 'prettier'],
  }),
  // Global stricter rules (JS + TS)
  {
    rules: {
      // General best practices
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'eqeqeq': ['error', 'smart'],
      'object-shorthand': ['error', 'always'],
    },
  },
  // Apply Next TypeScript rules only to TS/TSX files and tweak a few rules
  ...compat.config({ extends: ['next/typescript'] }).map((cfg) => ({
    ...cfg,
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      // Enable typed linting for TS rules that require type info
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...cfg.rules,
      // Allow intentionally unused variables prefixed with _
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Stricter TS checks
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/no-floating-promises': ['error'],
    },
  })),
  // For application code, disallow console (allow warn/error)
  {
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'error',
    },
  },
  // Allow console inside the logger implementation only
  {
    files: ['lib/logger.ts'],
    rules: { 'no-console': 'off' },
  },
  // For scripts and config files, allow console
  {
    files: [
      'scripts/**/*.js',
      '*.config.js',
      'next.config.js',
      'postcss.config.js',
      'tailwind.config.js',
      'prettier.config.js',
    ],
    rules: {
      'no-console': 'off',
    },
  },
]

export default config

