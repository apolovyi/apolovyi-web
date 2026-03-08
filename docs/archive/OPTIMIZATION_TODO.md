# Portfolio Optimization Todo

> **Created:** December 2024
> **Updated:** December 2024
> **Reference:** [OPTIMIZATION_PLAN_REVIEW.md](../OPTIMIZATION_PLAN_REVIEW.md)
> **Status:** Completed

---

## Completed

### Lighthouse Baseline (Dec 2024)

| Metric      | Value | Target     |
| ----------- | ----- | ---------- |
| Performance | 84    | > 90       |
| LCP         | 3.3s  | < 2.5s     |
| FCP         | 2.4s  | < 1.8s     |
| CLS         | 0.01  | < 0.1 ✅   |
| TBT         | 20ms  | < 200ms ✅ |

**Note:** LCP/FCP affected by intentional branded loading screen (SBB train). This is a deliberate UX choice.

---

### 1. Remove invalid `images.qualities` from next.config.js ✅

**File:** `next.config.js`
**Commit:** `2a91909`

```diff
- images: { unoptimized: true, qualities: [75, 100] },
+ images: { unoptimized: true },
```

---

### 2. Add Cyrillic Font Subset ✅

**File:** `app/[lang]/layout.tsx`
**Commit:** `2a91909`

```tsx
const comfortaa = Comfortaa({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-comfortaa',
	display: 'swap',
})
```

---

### 3. Create `public/_headers` for Caching & Security ✅

**File:** `public/_headers`
**Commit:** `2a91909`

```
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/*.woff2
  Cache-Control: public, max-age=31536000, immutable

/img/*
  Cache-Control: public, max-age=2592000

/fav/*
  Cache-Control: public, max-age=86400

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

**Verified:** Headers applied on production.

---

### 4. Add `optimizePackageImports` to next.config.js ✅

**File:** `next.config.js`
**Commit:** `2a91909`

```js
experimental: {
  optimizePackageImports: ['motion', 'lucide-react'],
},
```

---

### 5. Unify Font Stack ✅

**File:** `tailwind.config.js`
**Commit:** `9f26ac4`

**Before:**

```js
'body': ['system-ui', '-apple-system', ...]     // Generic
'heading': ['var(--font-comfortaa)', ...]       // Comfortaa
'sub-heading': ['Georgia', 'Cambria', 'serif']  // Serif
'tech': ['var(--font-ibm-plex-mono)', ...]      // Mono
```

**After:**

```js
'body': ['var(--font-comfortaa)', 'system-ui', 'sans-serif']
'heading': ['var(--font-comfortaa)', 'sans-serif']
'sub-heading': ['var(--font-comfortaa)', 'sans-serif']
'tech': ['var(--font-ibm-plex-mono)', 'monospace']
```

**Result:** Consistent Comfortaa throughout, IBM Plex Mono for technical elements.

---

## Skipped Optimizations (Documented)

The following were considered but skipped due to poor cost/benefit ratio:

### 1. Intersection-based Globe Loading

**Why skipped:** Globe is in the hero section - already in viewport on page load. Adding intersection observer adds complexity for zero benefit.

### 2. `prefetch: false` on Globe Dynamic Import

**Why skipped:** Prefetching loads the Three.js chunk during browser idle time while user reads hero text. Disabling it would cause visible loading delay when globe actually renders. Current behavior is optimal.

### 3. Conditional Lenis Loading (lazy + mobile/reduced-motion guards)

**Why skipped:**

- Lenis is ~12KB gzipped (~7% of 162KB initial bundle)
- Added complexity: async loading, mobile detection, reduced-motion checks, cleanup logic
- Risk of scroll behavior bugs from conditional loading
- Marginal gain doesn't justify complexity

### 4. `next/script` for Analytics

**Why skipped:** Current `<script defer>` achieves same result as `strategy="afterInteractive"` for static export. Analytics script is ~2KB. Marginal improvement.

### 5. DNS Prefetch for Analytics

**Why skipped:** TinyAnalytics is already loaded with `defer`. DNS prefetch saves ~50-100ms on a non-critical resource. Marginal improvement.

### 6. Reduce Animation Timings for LCP

**Why skipped:** The 6.4s hero animation delay and 500ms loading screen are intentional UX choices for branded experience. Reducing them hurts the choreographed animation sequence. Score of 84 with good UX is better than 95 with rushed animations.

---

## Current State

| Metric            | Value         | Status                          |
| ----------------- | ------------- | ------------------------------- |
| First Load JS     | 162 KB        | ✅ Below 200KB target           |
| Three.js chunk    | 588 KB        | ✅ Lazy-loaded                  |
| Performance Score | 84            | ✅ Acceptable (branded loading) |
| Fonts             | Self-hosted   | ✅ Via next/font                |
| Images            | AVIF/WebP/JPG | ✅ Optimized                    |
| Caching           | Configured    | ✅ Via \_headers                |
| Security Headers  | Applied       | ✅ Via \_headers                |

---

## Files Changed

| File                    | Change                                           | Commit    |
| ----------------------- | ------------------------------------------------ | --------- |
| `next.config.js`        | Remove `qualities`, add `optimizePackageImports` | `2a91909` |
| `app/[lang]/layout.tsx` | Add `cyrillic` to font subset                    | `2a91909` |
| `public/_headers`       | New file for caching/security headers            | `2a91909` |
| `tailwind.config.js`    | Unify font stack with Comfortaa                  | `9f26ac4` |
