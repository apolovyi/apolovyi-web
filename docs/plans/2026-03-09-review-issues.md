# Review Issues Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Address all code review feedback from Claude Code PR review — unify theming, fix dark mode gaps, clean up class naming, and improve consistency.

**Working directory:** `/Users/artempolovyi/repos/private/apolovyi-web`

**Architecture:** Move the inline `<style>` block from `page.tsx` into `globals.css`, replace all hardcoded hex values with CSS custom properties, rename `v5-*` classes to semantic names, move the font to layout, and fix the error page for dark mode. The OG image issue is skipped (requires a design asset we don't have).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, pnpm

---

### Task 1: Move inline styles from page.tsx to globals.css

This is the biggest task. We move ~220 lines of CSS from the JSX `<style>` tag into `globals.css`, rename `v5-*` to semantic names, and replace hardcoded hex with CSS variables where appropriate.

**Files:**

- Modify: `app/globals.css`
- Modify: `app/[lang]/page.tsx`
- Modify: `components/ThemeToggle.tsx`

**Step 1: Replace globals.css**

The new `globals.css` merges the existing tokens + base rules with all the inline styles from `page.tsx`, using semantic class names and CSS variables. Some colors intentionally differ from the neutral gray token scale (e.g., the warm `#FAFAF8` background, the warm-tinted glows) — those stay as hex.

```css
@import 'tailwindcss';
@config '../tailwind.config.js';

/* ===== Design Tokens ===== */

:root {
	--bg-primary: #fafaf8;
	--text-primary: #111;
	--text-secondary: #555;
	--text-body: #666;
	--text-link: #6a6a6a;
	--text-link-hover: #111;
	--text-ui: #a3a3a3;
	--text-ui-hover: #525252;
	--dot-color: #c0c0c0;
}

.dark {
	--bg-primary: #000;
	--text-primary: #fff;
	--text-secondary: #8a8a8a;
	--text-body: #808080;
	--text-link: #777;
	--text-link-hover: #e5e5e5;
	--text-ui: #525252;
	--text-ui-hover: #8a8a8a;
	--dot-color: #333;
}

/* ===== Base ===== */

@layer base {
	html {
		transition:
			background-color 200ms ease,
			color 200ms ease;
	}

	body {
		background-color: var(--bg-primary);
		color: var(--text-body);
	}

	::selection {
		background-color: rgba(0, 0, 0, 0.06);
		color: inherit;
	}

	.dark ::selection {
		background-color: rgba(255, 250, 240, 0.1);
		color: inherit;
	}
}

/* ===== Page Shell ===== */

.page-body {
	background: var(--bg-primary);
	min-height: 100dvh;
	position: relative;
	overflow: hidden;
}

/* Warm ambient spotlight */
.page-body::before {
	content: '';
	position: fixed;
	inset: 0;
	background: radial-gradient(ellipse at 50% 40%, rgba(180, 160, 120, 0.012) 0%, transparent 60%);
	pointer-events: none;
	z-index: 0;
}

/* Noise grain */
.page-body::after {
	content: '';
	position: fixed;
	inset: 0;
	background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
	opacity: 0.02;
	pointer-events: none;
	z-index: 1;
}

.page-content {
	position: relative;
	z-index: 2;
}

/* ===== Typography ===== */

.hero-name {
	color: var(--text-primary);
	font-weight: 200;
}

.hero-subtitle {
	color: var(--text-secondary);
	font-weight: 300;
}

.hero-body {
	color: var(--text-body);
	font-weight: 300;
}

/* ===== Divider ===== */

.hero-line {
	height: 1px;
	background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.06) 20%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.06) 80%, transparent);
	animation: line-pulse 5s ease-in-out infinite;
}

@keyframes line-pulse {
	0%,
	100% {
		opacity: 0.5;
	}
	50% {
		opacity: 1;
	}
}

/* ===== Links ===== */

.nav-link {
	color: var(--text-link);
	text-decoration: none;
	font-weight: 400;
	transition:
		color 200ms ease,
		text-shadow 200ms ease;
	letter-spacing: 0.06em;
	min-height: 44px;
	display: inline-flex;
	align-items: center;
}

.nav-link:hover {
	color: var(--text-link-hover);
}

.nav-dot {
	color: var(--dot-color);
}

/* ===== Focus ===== */

.nav-link:focus-visible,
.theme-toggle:focus-visible {
	outline: 1px solid currentColor;
	outline-offset: 3px;
	border-radius: 2px;
}

/* ===== Touch ===== */

@media (hover: none) {
	.nav-link,
	.theme-toggle {
		-webkit-tap-highlight-color: transparent;
	}
}

/* ===== Theme Toggle ===== */

.theme-toggle {
	position: fixed;
	bottom: 24px;
	right: 24px;
	background: none;
	border: none;
	cursor: pointer;
	padding: 14px;
	min-height: 44px;
	min-width: 44px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
}

.toggle-circle {
	display: block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	border: 1.5px solid rgba(0, 0, 0, 0.14);
	background: transparent;
	transition:
		border-color 400ms ease,
		background-color 400ms ease,
		box-shadow 400ms ease;
}

.theme-toggle:hover .toggle-circle {
	border-color: rgba(0, 0, 0, 0.35);
}

/* ===== Dark Mode Overrides ===== */

.dark .page-body::before {
	background: radial-gradient(ellipse at 50% 40%, rgba(255, 250, 240, 0.015) 0%, transparent 55%);
}

.dark .page-body::after {
	opacity: 0.035;
}

.dark .hero-name {
	text-shadow:
		0 0 30px rgba(255, 250, 240, 0.12),
		0 0 60px rgba(255, 250, 240, 0.06),
		0 0 100px rgba(255, 250, 240, 0.025);
	animation: name-pulse 5s ease-in-out infinite;
}

@keyframes name-pulse {
	0%,
	100% {
		text-shadow:
			0 0 30px rgba(255, 250, 240, 0.12),
			0 0 60px rgba(255, 250, 240, 0.06),
			0 0 100px rgba(255, 250, 240, 0.025);
	}
	50% {
		text-shadow:
			0 0 35px rgba(255, 250, 240, 0.18),
			0 0 70px rgba(255, 250, 240, 0.09),
			0 0 110px rgba(255, 250, 240, 0.04);
	}
}

.dark .nav-link:hover {
	text-shadow: 0 0 10px rgba(255, 250, 240, 0.12);
}

.dark .hero-line {
	background: linear-gradient(
		90deg,
		transparent,
		rgba(255, 255, 255, 0.05) 20%,
		rgba(255, 255, 255, 0.09) 50%,
		rgba(255, 255, 255, 0.05) 80%,
		transparent
	);
}

.dark .toggle-circle {
	border-color: rgba(255, 250, 240, 0.2);
	background: rgba(255, 250, 240, 0.2);
}

.dark .theme-toggle:hover .toggle-circle {
	border-color: rgba(255, 250, 240, 0.4);
	background: rgba(255, 250, 240, 0.4);
}

/* ===== Reduced Motion ===== */

@media (prefers-reduced-motion: reduce) {
	.hero-line,
	.hero-name {
		animation: none !important;
	}
}

/* ===== Print ===== */

@media print {
	body {
		background: white !important;
		color: #171717 !important;
	}
	[data-ui] {
		display: none !important;
	}
}
```

**Step 2: Update page.tsx**

Remove the entire `<style>` block. Replace `v5-*` class names with semantic names. Move the font to layout (next task handles this — for now just remove the `Outfit` import and wrapper div). Replace the `translateY(-4%)` inline style with a Tailwind class.

New `page.tsx`:

```tsx
import type { Locale } from '@/i18n-config'
import { i18n } from '@/i18n-config'

import ThemeToggle from '@/components/ThemeToggle'

import { getDictionary } from '@/lib/dictionary.server'

export const dynamic = 'error'
export const dynamicParams = false

export function generateStaticParams(): Array<{ lang: string }> {
	return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
	const { lang: langParam } = await params
	const lang = (langParam ?? i18n.defaultLocale) as Locale
	const dictionary = await getDictionary(lang)
	const { page } = dictionary

	return (
		<main className="page-body flex items-center justify-center px-6 sm:px-8">
			<ThemeToggle />

			<div className="page-content w-full max-w-lg -translate-y-[4%] text-center">
				<h1 className="hero-name text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">{page.name}</h1>

				<div className="hero-line mx-auto mt-6 w-32 sm:mt-8 sm:w-48" />

				<p className="hero-subtitle mt-5 text-base tracking-[0.08em] sm:mt-6 sm:text-lg">{page.subtitle}</p>

				<p className="hero-body mx-auto mt-6 max-w-sm text-sm leading-relaxed sm:mt-8 sm:text-base">{page.body}</p>

				<nav
					className="mt-10 flex items-center justify-center gap-0 text-xs uppercase tracking-[0.2em] sm:mt-14 sm:text-sm"
					aria-label={page.linksLabel}
				>
					<a
						href="https://www.linkedin.com/in/apolovyi/"
						target="_blank"
						rel="noopener noreferrer"
						className="nav-link px-2.5 sm:px-3"
					>
						{page.links.linkedin}
					</a>
					<span
						className="nav-dot"
						aria-hidden="true"
					>
						·
					</span>
					<a
						href="https://github.com/apolovyi"
						target="_blank"
						rel="noopener noreferrer"
						className="nav-link px-2.5 sm:px-3"
					>
						{page.links.github}
					</a>
					<span
						className="nav-dot"
						aria-hidden="true"
					>
						·
					</span>
					<a
						href="mailto:info@apolovyi.me"
						className="nav-link px-2.5 sm:px-3"
					>
						{page.links.email}
					</a>
				</nav>
			</div>
		</main>
	)
}
```

**Step 3: Update ThemeToggle.tsx**

Replace `v5-theme-toggle` → `theme-toggle`, `v5-toggle-circle` → `toggle-circle`:

```tsx
'use client'

import { useTheme } from '@/components/shared/ThemeProvider'

export default function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()

	return (
		<button
			onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
			className="theme-toggle"
			aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
			data-ui
		>
			<span className="toggle-circle" />
		</button>
	)
}
```

**Step 4: Verify**

```bash
pnpm run check
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/globals.css "app/[lang]/page.tsx" components/ThemeToggle.tsx && git commit -m "move inline styles to globals.css, rename v5 classes to semantic names"
```

---

### Task 2: Move font from page.tsx to layout.tsx

**Files:**

- Modify: `app/[lang]/layout.tsx`
- Verify: `app/[lang]/page.tsx` (already updated in Task 1 — no Outfit import)

**Step 1: Update layout.tsx**

Add the Outfit font import and apply it to `<body>`:

In `layout.tsx`, add import and font declaration at the top:

```typescript
import { Outfit } from 'next/font/google'
```

Add font config after imports:

```typescript
const outfit = Outfit({
	subsets: ['latin', 'latin-ext'],
	variable: '--font-outfit',
	display: 'swap',
	weight: ['100', '200', '300', '400'],
})
```

Change `<body>` to:

```tsx
<body className={outfit.variable} style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
```

**Step 2: Verify**

```bash
pnpm run check
pnpm run build
```

Expected: PASS

**Step 3: Commit**

```bash
git add "app/[lang]/layout.tsx" && git commit -m "move Outfit font from page to layout"
```

---

### Task 3: Fix error.tsx dark mode + remove JS hover handlers

**Files:**

- Modify: `app/error.tsx`

**Step 1: Rewrite error.tsx**

Replace entire file. Uses CSS variables from globals.css so it responds to dark mode. Uses CSS hover instead of JS `onMouseEnter`/`onMouseLeave`. The `error` prop is destructured but unused — omit it from the destructuring to avoid lint warnings.

```tsx
'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6">
			<div className="text-center">
				<h1 className="mb-4 text-5xl font-extralight tracking-tight text-[var(--text-primary)]">Oops</h1>
				<p className="mx-auto mb-8 max-w-sm text-sm font-light leading-relaxed text-[var(--text-body)]">
					Something went wrong. Please try again.
				</p>
				<button
					onClick={() => reset()}
					className="cursor-pointer border border-[var(--dot-color)] px-6 py-3 text-xs uppercase tracking-[0.15em] text-[var(--text-link)] transition-colors duration-200 hover:text-[var(--text-link-hover)]"
				>
					Try Again
				</button>
			</div>
		</div>
	)
}
```

**Step 2: Verify**

```bash
pnpm run check
```

Expected: PASS

**Step 3: Commit**

```bash
git add app/error.tsx && git commit -m "fix error page dark mode, replace JS hover with CSS"
```

---

### Task 4: Fix LinkedIn URL consistency

**Files:**

- Modify: `components/StructuredData.tsx`

**Step 1: Add trailing slash to match page.tsx**

Change:

```typescript
'sameAs': ['https://www.linkedin.com/in/apolovyi', 'https://github.com/apolovyi'],
```

To:

```typescript
'sameAs': ['https://www.linkedin.com/in/apolovyi/', 'https://github.com/apolovyi'],
```

**Step 2: Verify**

```bash
pnpm run check
```

Expected: PASS

**Step 3: Commit**

```bash
git add components/StructuredData.tsx && git commit -m "fix LinkedIn URL trailing slash consistency"
```

---

### Task 5: Clean up stale CSS variables from tailwind.config.js

The tailwind color tokens reference the old variable values (`--text-primary: #171717`) that no longer match globals.css (`--text-primary: #111`). Since no component uses these Tailwind color utilities (the page uses custom CSS classes), remove the dead color config.

**Files:**

- Modify: `tailwind.config.js`

**Step 1: Simplify tailwind.config.js**

Remove unused color tokens — the page uses custom classes from globals.css, not Tailwind color utilities.

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
			},
		},
	},
}
```

**Step 2: Verify**

```bash
pnpm run check
pnpm run build
```

Expected: PASS

**Step 3: Commit**

```bash
git add tailwind.config.js && git commit -m "remove unused Tailwind color tokens"
```

---

### Task 6: Update E2E screenshot capture script

The `.screenshots/capture-review.mjs` script references old class names. Update it.

**Files:**

- Modify: `.screenshots/capture-review.mjs` (gitignored, but kept in working tree for manual use)

**Step 1: Check if capture-review.mjs references v5 classes**

```bash
grep -n "v5-" .screenshots/capture-review.mjs
```

If any references exist, update them. If not, skip this task.

**Step 2: Verify all tests pass**

```bash
pnpm run check
pnpm run build
pnpm run test:smoke
CI=1 pnpm run test:e2e
```

All must pass.

**Step 3: Commit (only if changes were made)**

```bash
git add -u && git commit -m "update review script class references"
```

---

### Task 7: Final verification and push

**Step 1: Full check**

```bash
pnpm run check
pnpm run build
pnpm run test:smoke
CI=1 pnpm run test:e2e
```

All must pass.

**Step 2: Push**

```bash
git push
```
