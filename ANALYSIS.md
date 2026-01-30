# apolovyi-web Analysis

**Date:** 2026-01-30  
**Analyzed by:** Tenzo

## Summary

**Status:** Well-optimized portfolio site. Most recommendations from OPTIMIZATION_PLAN already implemented.

## Tech Stack

| Technology | Version | Notes |
|------------|---------|-------|
| Next.js | 15.5.3 | App Router, static export |
| React | 19.1.1 | Latest |
| TypeScript | 5.9.3 | Strict |
| Tailwind CSS | 3.4.19 | |
| Three.js | ~588KB | Lazy-loaded |
| Hosting | Netlify | Static CDN |

## Current State Assessment

### ✅ Already Implemented

| Optimization | Status |
|--------------|--------|
| Cyrillic font subset | ✅ Done (`latin`, `cyrillic`) |
| `optimizePackageImports` | ✅ Done (motion, lucide, three, etc.) |
| Static asset caching | ✅ 1 year for JS/fonts |
| Image caching | ✅ 30 days |
| Security headers | ✅ X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| HSTS | ✅ Enabled |
| Three.js lazy loading | ✅ Already lazy |
| Bundle analyzer | ✅ Configured |
| E2E tests | ✅ Playwright configured |

### Bundle Performance

```
Initial Load: 162 kB (target was <200kB) ✅
Three.js: 588 kB (lazy, after initial paint)
```

### Live Site Headers

```
cache-control: public, max-age=31536000, immutable (static assets)
x-frame-options: DENY
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
strict-transport-security: max-age=31536000
```

## Recommendations

### Low Priority (nice to have)

1. **DNS prefetch for analytics**
```tsx
// app/[lang]/layout.tsx
<link rel="dns-prefetch" href="https://app.tinyanalytics.io" />
```

2. **Lazy load Lenis** (~20KB savings, optional)
```tsx
useEffect(() => {
  const initLenis = async () => {
    const Lenis = (await import('lenis')).default
    // ...
  }
  initLenis()
}, [])
```

3. **Consider `preconnect` for fonts**
```tsx
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

### Do NOT Do

- ❌ Remove `output: 'export'` (would break static hosting)
- ❌ Switch to Netlify SSR (adds complexity, cost)
- ❌ "Fix" Three.js loading (already optimal)

## Activity

- Last commit: E2E stability improvements
- Commits in last 30 days: 0
- Status: Stable, maintenance mode

## i18n Support

4 locales configured:
- English (en)
- German (de)
- Swiss German (ch)
- Ukrainian (uk)

Cyrillic subset properly configured for Ukrainian.

## Test Coverage

- E2E tests: navigation, metro-map, contact-form, hero-animations, language-switcher, dark-mode
- Framework: Playwright

## Conclusion

Site is already well-optimized. The OPTIMIZATION_PLAN was reviewed, valid parts implemented, invalid parts (SSR migration) correctly rejected.

**Remaining improvements are marginal** (DNS prefetch, Lenis lazy load) and can be done opportunistically.

**No urgent action needed.**
