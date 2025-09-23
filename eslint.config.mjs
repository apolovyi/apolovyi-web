import { FlatCompat } from '@eslint/eslintrc'

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
  // Base Next + Prettier for all files
  ...compat.config({
    extends: ['next/core-web-vitals', 'prettier'],
  }),
  // Apply Next TypeScript rules only to TS/TSX files
  ...compat.config({ extends: ['next/typescript'] }).map((cfg) => ({
    ...cfg,
    files: ['**/*.ts', '**/*.tsx'],
  })),
]

export default config

