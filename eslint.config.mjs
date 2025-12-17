import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'

const eslintConfig = defineConfig([
  // Base Next.js + Core Web Vitals rules
  ...nextVitals,

  // TypeScript-specific rules
  ...nextTypescript,

  // Prettier compatibility (must be last)
  prettier,

  // Override default ignores
  globalIgnores(['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts']),

  // Global stricter rules
  {
    rules: {
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      eqeqeq: ['error', 'smart'],
      'object-shorthand': ['error', 'always'],
      // Disable React Compiler's strict hooks rules (too aggressive for existing code)
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
    },
  },

  // TypeScript-specific overrides
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
    },
  },

  // Disallow console in application code
  {
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'error',
    },
  },

  // Allow console in logger
  {
    files: ['lib/logger.ts'],
    rules: { 'no-console': 'off' },
  },

  // Allow console and require in scripts and config files
  {
    files: ['scripts/**/*.js', '*.config.js', 'next.config.js', 'postcss.config.js', 'tailwind.config.js', 'prettier.config.js'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
])

export default eslintConfig
