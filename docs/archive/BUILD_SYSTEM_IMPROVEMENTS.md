# Build System Improvements

**Status:** Sprint 1 Complete
**Created:** 2025-12-17
**Updated:** 2025-12-17
**Priority:** Medium-High

## Current State

| Component       | Version     | Status                       |
| --------------- | ----------- | ---------------------------- |
| Next.js         | 15.5.7      | Outdated (16.0.10 available) |
| Tailwind CSS    | 3.4.19      | v4.1.18 stable               |
| Package Manager | npm 10.9.4  | Slower than alternatives     |
| Bundler         | Webpack     | Turbopack available          |
| React Compiler  | Not enabled | Available in Next.js 16      |

### Current Metrics

- **Full build time:** ~34s (24s compile + 10s static export)
- **First Load JS:** 163 kB (main page)
- **Shared chunks:** 102 kB (45.5 kB + 54.2 kB + 2.4 kB)
- **Static export size:** 32 MB
- **node_modules size:** 694 MB

### Current Optimizations Already In Place

- `optimizePackageImports: ['motion', 'lucide-react']` ✅
- Dynamic import for GithubGlobe (three.js) ✅
- `removeConsole` in production ✅
- Bundle analyzer available ✅

---

## Deep Analysis: Next.js + Turbopack Optimization

### Why Turbopack Over Vite?

| Factor           | Vite          | Next.js + Turbopack |
| ---------------- | ------------- | ------------------- |
| Migration effort | 6-12 hours    | 1 hour (CSS fix)    |
| Dev startup      | ~390ms        | ~500ms              |
| HMR (root)       | ~42ms         | ~7ms                |
| HMR (leaf)       | ~22ms         | ~11ms               |
| i18n routing     | Manual        | Built-in            |
| Static export    | Plugin needed | Native              |

**Verdict:** Turbopack matches or beats Vite in HMR performance while keeping all Next.js framework features.

### Turbopack Performance Benefits

1. **Incremental Computation** - Parallelizes work across all 16 CPU cores, caches results at function level
2. **Unified Graph** - Single graph for all environments (server/client)
3. **Native ESM** - No bundling in dev, serves modules directly
4. **Rust-based** - 10-100x faster than JavaScript-based bundlers

### Filesystem Caching (Game Changer)

Turbopack can cache compiler artifacts to disk between runs:

```js
experimental: {
  turbopackFileSystemCacheForDev: true,   // Default in Next.js 16
  turbopackFileSystemCacheForBuild: true, // Opt-in
}
```

**Real-world results:**

- Vercel internal apps: startup from minutes → seconds
- MacBook Pro M3 Max: builds from 15s → 5.6s (2.6x faster)

### React Compiler (Automatic Memoization)

Available in Next.js 16, provides automatic memoization without manual `useMemo`/`useCallback`:

```js
// next.config.js
{
  reactCompiler: true,
}
```

**Production results:**

- Meta Quest Store: >2.5x faster interactions
- Wakelet: 10% better LCP, 15% better INP
- Radix components: ~30% INP improvement

---

## Phase 1: Quick Wins (Low Risk, High Impact)

### 1.1 Switch to pnpm

**Impact:** 50-70% faster installs, ~50% smaller node_modules

| Metric                | npm      | pnpm    |
| --------------------- | -------- | ------- |
| Clean install         | ~28s     | ~9.5s   |
| With cache + lockfile | ~1.3s    | ~0.75s  |
| node_modules size     | 694 MB   | ~300 MB |
| Monthly CI time       | ~189 min | ~98 min |

**Steps:**

- [ ] Install pnpm: `npm install -g pnpm`
- [ ] Remove npm artifacts: `rm -rf node_modules package-lock.json`
- [ ] Generate pnpm lockfile: `pnpm install`
- [ ] Update `.github/workflows/ci.yml`:

  ```yaml
  - name: Setup pnpm
    uses: pnpm/action-setup@v4
    with:
      version: 9

  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: 22
      cache: pnpm

  - name: Install dependencies
    run: pnpm install --frozen-lockfile
  ```

- [ ] Update `.github/workflows/e2e.yml` similarly
- [ ] Update `.github/workflows/smoke.yml` similarly
- [ ] Update CLAUDE.md commands section

### 1.2 Fix Turbopack CSS Blocker

**Problem:** Tailwind generates CSS that Turbopack's parser can't handle:

```
.after\:dark ::-moz-selection { ... }
```

**Root cause:** `after:dark:` variant in these files:

- `components/ui/aurora-background.tsx`
- `components/home/MotionHero.tsx`

**Fix options:**

1. **Refactor classes** - Remove `after:dark:` usage, use alternative approach
2. **Wait for Tailwind v4** - Different CSS generation architecture

**Steps:**

- [ ] Audit `after:dark:` usage in aurora-background.tsx
- [ ] Audit `after:dark:` usage in MotionHero.tsx
- [ ] Refactor to use standard dark mode selectors
- [ ] Test build with `next build --turbopack`

### 1.3 Enable Turbopack for Production Builds

**Impact:** 2-5x faster builds once CSS issue fixed

**Steps:**

- [ ] Update `package.json`:
  ```json
  "build": "next build --turbopack"
  ```
- [ ] Test static export works correctly
- [ ] Verify all pages render identically to Webpack build

---

## Phase 2: Major Upgrades (Medium Risk)

### 2.1 Upgrade to Next.js 16

**Impact:** Turbopack default, filesystem caching, improved DX

**Breaking changes to check:**

- `experimental.turbo` → `turbopack` (top-level config)
- Middleware changes (proxy.ts replacement)
- CSS ordering differences with Turbopack

**Steps:**

- [ ] Read [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [ ] Update dependency: `pnpm add next@16`
- [ ] Update next.config.js for new turbopack config location
- [ ] Enable filesystem caching:
  ```js
  experimental: {
    turbopackFileSystemCacheForBuild: true,
  }
  ```
- [ ] Run full test suite
- [ ] Test all 5 locales render correctly

### 2.2 Enable React Compiler

**Impact:** Automatic memoization, 10-30% better INP

**Steps:**

- [ ] Add to next.config.js:
  ```js
  {
    reactCompiler: true,
  }
  ```
- [ ] Test all interactive components (especially motion animations)
- [ ] Monitor Lighthouse INP scores before/after
- [ ] Check for any opt-out needs with `'use no memo'` directive

### 2.3 Migrate to Tailwind CSS v4

**Impact:** 3.5x faster CSS compilation, modern CSS features

**Requirements:**

- Node.js 20+
- Browser support: Safari 16.4+, Chrome 111+, Firefox 128+

**Breaking changes:**

- CSS-first configuration (no more tailwind.config.js)
- `@tailwind` directives → `@import "tailwindcss"`
- Default border color now `currentColor`
- Buttons use `cursor: default` by default
- Gradient behavior changes

**Steps:**

- [ ] Verify browser support requirements are acceptable
- [ ] Run migration tool: `npx @tailwindcss/upgrade`
- [ ] Review and fix any migration issues
- [ ] Convert tailwind.config.js to CSS-based config
- [ ] Update postcss.config.js (may be simplified/removed)
- [ ] Test all components visually
- [ ] Update CLAUDE.md with new Tailwind patterns

---

## Phase 3: Additional Optimizations

### 3.1 Expand optimizePackageImports

Current config only optimizes `motion` and `lucide-react`. Add more:

```js
experimental: {
  optimizePackageImports: [
    'motion',
    'lucide-react',
    '@react-three/drei',    // Has many exports
    '@react-three/fiber',   // React Three ecosystem
    'three',                // Three.js (if direct imports used)
    'zod',                  // Schema validation
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
  ],
}
```

### 3.2 Memory Optimization (for large projects)

If dev server becomes slow:

```js
experimental: {
  webpackMemoryOptimizations: true,  // Reduces max memory at slight compile cost
}
```

### 3.3 Turbopack Debugging

For performance issues, generate trace files:

```bash
NEXT_TURBOPACK_TRACING=1 npm run dev
# Creates .next/dev/trace-turbopack for analysis
```

### 3.4 CI/CD Cache Optimization

Update GitHub Actions to cache Turbopack artifacts:

```yaml
- name: Cache Next.js
  uses: actions/cache@v4
  with:
    path: |
      .next/cache
      .next/dev
    key: nextjs-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}-${{ hashFiles('**/*.ts', '**/*.tsx') }}
    restore-keys: |
      nextjs-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}-
      nextjs-${{ runner.os }}-
```

### 3.5 Bundle Size Monitoring

Add size-limit to catch bundle regressions:

```bash
pnpm add -D size-limit @size-limit/preset-app
```

```json
// package.json
{
	"size-limit": [
		{
			"path": "out/**/*.js",
			"limit": "200 kB"
		}
	]
}
```

---

## Expected Results

| Metric        | Current  | Phase 1  | Phase 2 | Phase 3 |
| ------------- | -------- | -------- | ------- | ------- |
| CI install    | ~28s     | ~10s     | ~10s    | ~10s    |
| Build time    | ~34s     | ~15-20s  | ~6-10s  | ~5-8s   |
| Dev startup   | ~4s      | ~1s      | ~0.5s   | ~0.5s   |
| HMR           | ~100ms   | ~10-20ms | ~7-10ms | ~7-10ms |
| node_modules  | 694 MB   | ~300 MB  | ~300 MB | ~300 MB |
| INP (runtime) | baseline | baseline | -15-30% | -15-30% |

### Dev Experience Improvements

| Feature      | Current     | After Optimization          |
| ------------ | ----------- | --------------------------- |
| Cold start   | 4-5s        | <1s                         |
| Hot reload   | 100ms+      | 7-20ms                      |
| Build cache  | None        | Persistent filesystem cache |
| Memoization  | Manual      | Automatic (React Compiler)  |
| Memory usage | Unoptimized | Controlled with flags       |

---

## Risk Assessment

### Phase 1 Risks

- **pnpm:** Low risk. Drop-in replacement, widely adopted.
- **Turbopack CSS fix:** Low risk. Refactoring CSS classes, not logic.
- **Turbopack build:** Low-medium risk. May have edge cases with static export.

### Phase 2 Risks

- **Next.js 16:** Medium risk. Major version upgrade, but well-documented migration path.
- **React Compiler:** Low-medium risk. Opt-in, can use `'use no memo'` for problem components.
- **Tailwind v4:** Medium-high risk. Significant breaking changes, but automated migration tool available.

### Phase 3 Risks

- **optimizePackageImports:** Low risk. Only affects tree-shaking, not runtime behavior.
- **CI cache changes:** Low risk. Only affects build speed, not output.
- **size-limit:** No risk. Dev-only monitoring tool.

---

## Recommended Implementation Order

### Sprint 1 (1-2 hours)

1. ✅ Fix Turbopack CSS blocker (refactor `after:dark:` classes)
2. ✅ Enable Turbopack for dev and build
3. ✅ Switch to pnpm

### Sprint 2 (2-4 hours)

4. ✅ Upgrade to Next.js 16
5. ✅ Enable filesystem caching
6. ✅ Update CI workflows for pnpm + Next.js cache

### Sprint 3 (2-4 hours)

7. ✅ Enable React Compiler
8. ✅ Expand optimizePackageImports
9. ✅ Add bundle size monitoring

### Sprint 4 (4-8 hours) - Optional

10. ⚠️ Migrate to Tailwind v4 (only if CSS compile time becomes bottleneck)

---

## References

### Core Documentation

- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Turbopack Documentation](https://nextjs.org/docs/app/api-reference/turbopack)
- [Turbopack Config Options](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)

### Performance

- [pnpm Benchmarks](https://pnpm.io/benchmarks)
- [Farm Performance Compare (Vite vs Turbopack)](https://github.com/farm-fe/performance-compare)
- [Turbopack in Next.js 16 Performance](https://medium.com/@mernstackdevbykevin/turbopack-builds-in-next-js-16-performance-gains-real-world-impact-ffa6dc447821)
- [Next.js Memory Usage Guide](https://nextjs.org/docs/app/guides/memory-usage)

### React Compiler

- [React Compiler v1.0 Announcement](https://react.dev/blog/2025/10/07/react-compiler-1)
- [Next.js React Compiler Config](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)

### Bundle Optimization

- [How Vercel Optimized Package Imports](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [optimizePackageImports Docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports)

### Tailwind

- [Tailwind CSS v4 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)

---

## Decision Log

| Date       | Decision                      | Rationale                                                   |
| ---------- | ----------------------------- | ----------------------------------------------------------- |
| 2025-12-17 | Document findings             | Analysis complete, awaiting approval                        |
| 2025-12-17 | Recommend Turbopack over Vite | Faster HMR, no migration effort, keeps all Next.js features |
| 2025-12-17 | Prioritize React Compiler     | Free performance boost with minimal risk                    |
| 2025-12-17 | Defer Tailwind v4             | High migration effort, current CSS compile time acceptable  |
