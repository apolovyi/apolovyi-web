# 🚀 Next.js + Netlify Optimization Plan

> **Project:** apolovyi-web  
> **Generated:** December 2024  
> **Status:** Ready for implementation

---

## 📊 Current State Analysis

### Tech Stack

- Next.js 15.5.3 (App Router)
- React 19.1.1
- Tailwind CSS 3.4.19
- TypeScript 5.9.3
- i18n: 4 locales (en, de, ch, uk)

### Critical Issues Found

| Issue                                                  | Impact                                     | Priority    |
| ------------------------------------------------------ | ------------------------------------------ | ----------- |
| `output: 'export'` disables Next.js Image Optimization | No Netlify CDN, larger images              | 🔴 Critical |
| `images: { unoptimized: true }`                        | All images served unoptimized              | 🔴 Critical |
| Heavy 3D libs loaded synchronously (~1MB+)             | Slow initial page load                     | 🔴 Critical |
| No `netlify.toml`                                      | Missing caching headers, suboptimal config | 🟡 Medium   |
| Motion library not optimized                           | Larger bundle than needed                  | 🟡 Medium   |
| No loading states for route segments                   | Poor perceived performance                 | 🟢 Low      |

### Bundle Size Concerns

Heavy dependencies that need lazy loading:

- `three` - ~600KB
- `@react-three/fiber` - ~200KB
- `@react-three/drei` - ~300KB
- `three-globe` - ~100KB
- `motion` - ~50KB
- `lenis` - ~20KB

**Total 3D bundle: ~1.2MB** (should not be in initial load)

---

## 🎯 Implementation Plan

### Phase 1: Critical Fixes (Do First)

#### 1.1 Update `next.config.js`

**Before:**

```js
const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	images: { unoptimized: true, qualities: [75, 100] },
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
}
```

**After:**

```js
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
	reactStrictMode: true,

	// Enable Next.js Image Optimization with Netlify
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256],
	},

	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},

	// Optimize imports for heavy packages
	experimental: {
		optimizePackageImports: ['three', '@react-three/drei', '@react-three/fiber', 'three-globe', 'motion', 'lucide-react'],
	},

	// Enable compression
	compress: true,

	// Disable source maps in production for smaller builds
	productionBrowserSourceMaps: false,
}

module.exports = withBundleAnalyzer(nextConfig)
```

> ⚠️ **Note:** Removing `output: 'export'` switches from static export to Netlify's SSR mode. This enables image optimization but requires Netlify's Next.js runtime.

---

#### 1.2 Create `netlify.toml`

Create this file in the project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

# Aggressive caching for static assets
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.ico"
  [headers.values]
    Cache-Control = "public, max-age=86400"

[[headers]]
  for = "/*.pdf"
  [headers.values]
    Cache-Control = "public, max-age=86400"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=2592000"

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

# i18n: Redirect root to default locale
[[redirects]]
  from = "/"
  to = "/en"
  status = 302
  force = false
```

---

#### 1.3 Dynamic Import 3D Components

All Three.js components must be lazy-loaded. Here's the pattern:

**Create wrapper components:**

```tsx
// components/three/DynamicGlobe.tsx
'use client'

import dynamic from 'next/dynamic'

// components/three/DynamicGlobe.tsx

// Loading placeholder matching the component's dimensions
const GlobeLoader = () => (
	<div className="flex h-[500px] w-full items-center justify-center">
		<div className="h-64 w-64 animate-pulse rounded-full bg-muted" />
	</div>
)

const Globe = dynamic(() => import('./Globe').then((mod) => mod.Globe), {
	ssr: false,
	loading: GlobeLoader,
})

export { Globe as DynamicGlobe }
```

**Apply to ALL components using:**

- `@react-three/fiber` (Canvas)
- `@react-three/drei` (any helper)
- `three` (any Three.js object)
- `three-globe`

**Usage in pages:**

```tsx
// app/[lang]/page.tsx
import { DynamicGlobe } from '@/components/three/DynamicGlobe'

export default function HomePage() {
	return (
		<main>
			<HeroSection /> {/* Loads instantly */}
			<DynamicGlobe /> {/* Loads after initial paint */}
		</main>
	)
}
```

---

### Phase 2: Performance Enhancements

#### 2.1 Optimize Motion Imports

**Before:**

```tsx
import { AnimatePresence, motion } from 'motion'
```

**After:**

```tsx
// Import from subpath for better tree-shaking
// Or for heavy animations, use dynamic import
import dynamic from 'next/dynamic'

import { motion } from 'motion/react'
import { AnimatePresence } from 'motion/react'

const MotionDiv = dynamic(() => import('motion/react').then((mod) => mod.motion.div), { ssr: false })
```

---

#### 2.2 Add Route Loading States

Create loading UI for each route segment:

```tsx
// app/[lang]/loading.tsx
export default function Loading() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
		</div>
	)
}

// app/[lang]/projects/loading.tsx
export default function ProjectsLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8 h-10 w-48 animate-pulse rounded bg-muted" />
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="h-64 animate-pulse rounded-lg bg-muted"
					/>
				))}
			</div>
		</div>
	)
}
```

---

#### 2.3 Static Params Generation for i18n

Ensure all locale pages are pre-generated:

```tsx
// app/[lang]/layout.tsx
import { i18n } from '@/i18n-config'

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }))
}

// Apply to ALL dynamic route segments
// app/[lang]/projects/[slug]/page.tsx
export async function generateStaticParams() {
  const projects = await getProjects() // your data fetching
  const locales = i18n.locales

  return locales.flatMap((lang) =>
    projects.map((project) => ({
      lang,
      slug: project.slug,
    }))
  )
}
```

---

#### 2.4 Font Optimization with next/font

```tsx
// app/[lang]/layout.tsx
import { Comfortaa, IBM_Plex_Mono } from 'next/font/google'

const comfortaa = Comfortaa({
	subsets: ['latin', 'cyrillic'], // cyrillic for Ukrainian
	variable: '--font-comfortaa',
	display: 'swap',
	preload: true,
})

const ibmPlexMono = IBM_Plex_Mono({
	weight: ['400', '500', '600'],
	subsets: ['latin'],
	variable: '--font-ibm-plex-mono',
	display: 'swap',
	preload: true,
})

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
	return (
		<html
			lang={params.lang}
			className={`${comfortaa.variable} ${ibmPlexMono.variable}`}
		>
			<body>{children}</body>
		</html>
	)
}
```

---

#### 2.5 Lenis Smooth Scroll Optimization

Lazy load Lenis only when needed:

```tsx
// hooks/useSmoothScroll.ts
'use client'

import { useEffect } from 'react'

// hooks/useSmoothScroll.ts

export function useSmoothScroll() {
	useEffect(() => {
		let lenis: any

		const initLenis = async () => {
			const Lenis = (await import('lenis')).default

			lenis = new Lenis({
				duration: 1.2,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				orientation: 'vertical',
				smoothWheel: true,
			})

			function raf(time: number) {
				lenis.raf(time)
				requestAnimationFrame(raf)
			}

			requestAnimationFrame(raf)
		}

		initLenis()

		return () => {
			lenis?.destroy()
		}
	}, [])
}
```

---

### Phase 3: Advanced Optimizations

#### 3.1 Preload Critical Assets

```tsx
// app/[lang]/layout.tsx
import { headers } from 'next/headers'

export default function RootLayout({ children }) {
	return (
		<html>
			<head>
				{/* Preload critical fonts */}
				<link
					rel="preload"
					href="/fonts/your-font.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>

				{/* Preconnect to external domains */}
				<link
					rel="preconnect"
					href="https://fonts.googleapis.com"
				/>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin=""
				/>

				{/* DNS prefetch for analytics */}
				<link
					rel="dns-prefetch"
					href="https://app.tinyanalytics.io"
				/>
			</head>
			<body>{children}</body>
		</html>
	)
}
```

---

#### 3.2 Image Component Best Practices

```tsx
// components/OptimizedImage.tsx
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  priority = false,
  className
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgIBBAIDAAAAAAAAAAAAAQIDBAAFERIhBjETQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8Aw2jqN2nTlhhvWo4ZOPOMSsFbju3W4yS3qGo3J3nmv2pJHPdnclj/AH3jGKVJqFydwOT/2Q=="
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={className}
    />
  )
}

// Usage for hero images (above the fold)
<OptimizedImage src="/hero.jpg" alt="Hero" priority />

// Usage for below-the-fold images
<OptimizedImage src="/project.jpg" alt="Project" />
```

---

#### 3.3 Analytics Script Optimization

```tsx
// components/Analytics.tsx
'use client'

import Script from 'next/script'

// In layout.tsx
import { Analytics } from '@/components/Analytics'

// components/Analytics.tsx

export function Analytics() {
	return (
		<Script
			src="https://app.tinyanalytics.io/pixel/YOUR_ID"
			strategy="afterInteractive"
		/>
	)
}

export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				{children}
				<Analytics />
			</body>
		</html>
	)
}
```

---

#### 3.4 Bundle Analysis Workflow

Run periodically to identify bloat:

```bash
# Generate bundle analysis
npm run analyze

# What to look for:
# 1. Chunks larger than 200KB (should be split)
# 2. Duplicate dependencies
# 3. Three.js in initial bundle (should be separate)
# 4. Full lodash imports (use lodash-es or specific imports)
```

---

## 📋 Implementation Checklist

### Phase 1: Critical (Week 1)

- [ ] Update `next.config.js` (remove static export)
- [ ] Create `netlify.toml`
- [ ] Dynamic import all Three.js components
- [ ] Test deployment on Netlify

### Phase 2: Performance (Week 2)

- [ ] Optimize motion imports
- [ ] Add loading.tsx to route segments
- [ ] Implement generateStaticParams for all dynamic routes
- [ ] Set up next/font for custom fonts
- [ ] Lazy load Lenis

### Phase 3: Polish (Week 3)

- [ ] Add preload hints for critical assets
- [ ] Optimize all Image components
- [ ] Move analytics to afterInteractive
- [ ] Run bundle analysis and eliminate bloat
- [ ] Run Lighthouse audit and fix issues

---

## 🧪 Testing & Validation

### Local Testing

```bash
# Build and analyze
npm run analyze

# Production build test
npm run build && npm run start

# Lighthouse CI
npx lighthouse http://localhost:3000 --view
```

### Post-Deployment Testing

1. Run PageSpeed Insights on live site
2. Check Core Web Vitals in Netlify Analytics
3. Test all locales: `/en`, `/de`, `/ch`, `/uk`
4. Verify images are served as WebP/AVIF
5. Check network tab for lazy-loaded chunks

### Target Metrics

| Metric                 | Target  | Current |
| ---------------------- | ------- | ------- |
| LCP                    | < 2.5s  | TBD     |
| FID/INP                | < 100ms | TBD     |
| CLS                    | < 0.1   | TBD     |
| Performance Score      | > 90    | TBD     |
| Total Bundle (initial) | < 200KB | TBD     |

---

## 🔄 Alternative: Keep Static Export

If you need to keep `output: 'export'` for GitHub Pages or other static hosts:

### Modified `next.config.js`

```js
const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	trailingSlash: true,

	images: {
		unoptimized: true,
		deviceSizes: [640, 750, 828, 1080, 1200],
	},

	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},

	experimental: {
		optimizePackageImports: ['three', '@react-three/drei', 'motion'],
	},
}
```

### Modified `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "out"  # Changed from .next

# ... rest of headers remain the same
```

### Required Additional Steps for Static Export

1. Pre-optimize all images with sharp (WebP/AVIF)
2. Use `<picture>` elements with multiple sources
3. Manually implement responsive images
4. Consider using a CDN like Cloudinary for images

---

## 📚 Resources

- [Next.js on Netlify Docs](https://docs.netlify.com/frameworks/next-js/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Core Web Vitals](https://web.dev/vitals/)
- [React Three Fiber Performance](https://docs.pmnd.rs/react-three-fiber/advanced/performance)

---

## 📝 Notes

- After implementing Phase 1, re-run bundle analysis to measure improvement
- Monitor Netlify build times - if they exceed 10 minutes, consider caching node_modules
- Three.js components should show as separate chunks in the analyzer
- Test on slow 3G to verify lazy loading works correctly
