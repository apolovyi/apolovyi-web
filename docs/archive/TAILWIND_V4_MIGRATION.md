# Tailwind CSS v4 Migration Plan

**Status:** ✅ Complete (merged in PR #7)
**Created:** 2025-12-17
**Branch:** `feature/tailwind-v4-migration`

---

## Current State Analysis

### Versions

| Package                 | Current | Target            |
| ----------------------- | ------- | ----------------- |
| tailwindcss             | 3.4.19  | 4.x               |
| @tailwindcss/typography | 0.5.14  | 0.5.19+           |
| tailwindcss-animate     | 1.0.7   | TBD               |
| postcss                 | 8.5.6   | Keep              |
| autoprefixer            | 10.4.20 | Remove (built-in) |

### Configuration Files

- `tailwind.config.js` - 169 lines, JS-based config
- `postcss.config.js` - 6 lines, simple setup
- `app/globals.css` - 223 lines, main CSS entry

### Custom Features Used

| Feature                        | Location                   | Migration Impact             |
| ------------------------------ | -------------------------- | ---------------------------- |
| `darkMode: ['class']`          | tailwind.config.js         | Built-in in v4               |
| Custom fonts (4)               | tailwind.config.js:25-30   | Move to `@theme`             |
| Custom colors (semantic)       | tailwind.config.js:61-114  | Move to `@theme`             |
| Custom keyframes (4)           | tailwind.config.js:120-147 | Move to `@theme`             |
| `addVariablesForColors` plugin | tailwind.config.js:162-168 | Remove (built-in in v4)      |
| `tall:` variant                | tailwind.config.js:155-157 | Convert to `@custom-variant` |
| `@apply` (2 uses)              | globals.css:117,123        | Keep (still supported)       |

### Plugins

| Plugin                    | Status     | Notes                      |
| ------------------------- | ---------- | -------------------------- |
| `tailwindcss-animate`     | Unknown    | Check v4 compat or replace |
| `@tailwindcss/typography` | Compatible | Use `@plugin` directive    |

### Utility Usage (Audit Complete ✅)

| Pattern              | Count | v4 Change                     | Files |
| -------------------- | ----- | ----------------------------- | ----- |
| `shadow-sm`          | 1     | → `shadow-xs`                 | TBD   |
| `shadow` (default)   | 2     | → `shadow-sm`                 | TBD   |
| `shadow-md/lg/xl`    | 7     | No change                     | -     |
| `rounded-sm`         | 2     | → `rounded-xs`                | TBD   |
| `rounded` (default)  | 18    | → `rounded-sm`                | TBD   |
| `rounded-md/lg/full` | 37    | No change                     | -     |
| `blur-sm`            | 3     | → `blur-xs`                   | TBD   |
| `blur` (default)     | 0     | → `blur-sm`                   | -     |
| `ring` (default 3px) | 1     | → `ring-3` (was 3px, now 1px) | TBD   |
| `ring-1`, `ring-2`   | 5     | No change                     | -     |
| `outline-none`       | 8     | → `outline-hidden`            | TBD   |
| `border` (no color)  | 0     | No action needed              | -     |
| `dark:` variant      | 5     | Keep (still supported)        | -     |
| `tall:` variant      | 2     | Convert to `@custom-variant`  | TBD   |

**Total utilities to rename: ~35 instances**

---

## Browser Support Check

**v4 requires:**

- Safari 16.4+ (April 2023)
- Chrome 111+ (March 2023)
- Firefox 128+ (July 2024)

**Decision:** Acceptable for portfolio site targeting modern browsers.

---

## Migration Steps

### Phase 1: Preparation (Low Risk) ✅ COMPLETE

#### Step 1.1: Audit Renamed Utilities ✅

- [x] Search for `shadow-sm`, `shadow`, `rounded-sm`, `rounded`, `blur-sm`, `blur`, `ring` usage
- [x] Document all instances that need updating (see table above)
- [x] Create find/replace mapping (see Phase 2)

#### Step 1.2: Audit Border Colors ✅

- [x] Search for `border` without explicit color
- [x] Result: **0 instances found** - no action needed

#### Step 1.3: Check tailwindcss-animate Compatibility

- [ ] Check npm for v4-compatible version
- [ ] If not compatible, plan to inline animations in `@theme`

---

### Phase 2: Pre-Migration Refactoring (Medium Risk)

#### Step 2.1: Rename Utilities (While Still on v3) ✅ COMPLETE

Do these renames BEFORE upgrading to v4 to isolate issues:

| Change                            | Count | Command                |
| --------------------------------- | ----- | ---------------------- |
| `shadow-sm` → `shadow-xs`         | 1     | Find/replace           |
| `shadow ` → `shadow-sm `          | 2     | Careful: word boundary |
| `rounded-sm` → `rounded-xs`       | 2     | Find/replace           |
| `rounded ` → `rounded-sm `        | 18    | Careful: word boundary |
| `blur-sm` → `blur-xs`             | 3     | Find/replace           |
| `ring ` → `ring-3 `               | 1     | Check context first    |
| `outline-none` → `outline-hidden` | 8     | Find/replace           |

- [x] Rename shadow utilities (1 change: shadow-sm → shadow-xs)
- [x] Rename rounded utilities (20 changes: rounded-sm → rounded-xs, rounded → rounded-sm)
- [x] Rename blur utilities (3 changes: backdrop-blur-sm → backdrop-blur-xs)
- [x] Update ring default (0 changes - no standalone `ring` found)
- [x] Rename outline-none (8 changes → outline-hidden)
- [x] Run build to verify no regressions ✅
- [x] Commit: `03b70f5` - Rename utilities for Tailwind v4 compatibility

#### Step 2.2: Verify Aurora Effect CSS Variables

- [ ] The aurora effect uses `var(--blue-500)` etc.
- [ ] v4 generates these as `--color-blue-500` - may need adjustment
- [ ] Test aurora renders correctly after migration

#### Step 2.3: Fix Border Colors (SKIPPED - None Found)

- [x] No `border` without color found - no action needed

---

### Phase 3: Core Migration (High Risk)

#### Step 3.1: Update Dependencies

```bash
pnpm remove tailwindcss autoprefixer
pnpm add tailwindcss@latest @tailwindcss/postcss @tailwindcss/cli
pnpm add @tailwindcss/typography@latest
```

#### Step 3.2: Update PostCSS Config

```js
// postcss.config.js (new)
export default {
	plugins: {
		'@tailwindcss/postcss': {},
	},
}
```

#### Step 3.3: Convert CSS Entry Point

Replace in `globals.css`:

```css
/* Old */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* New */
@import 'tailwindcss';
```

#### Step 3.4: Migrate Config to CSS

Convert `tailwind.config.js` to CSS-based `@theme`:

```css
@import 'tailwindcss';

@theme {
	/* Fonts */
	--font-body: var(--font-comfortaa), system-ui, sans-serif;
	--font-heading: var(--font-comfortaa), sans-serif;
	--font-tech: var(--font-ibm-plex-mono), monospace;

	/* Custom colors */
	--color-highlight: rgba(172, 220, 255, 0.87);
	/* ... etc */

	/* Animations */
	--animate-aurora: aurora 60s linear infinite;
	--animate-shimmer: shimmer 3s ease-in-out infinite;
}

@keyframes aurora {
	from {
		background-position:
			50% 50%,
			50% 50%;
	}
	to {
		background-position:
			350% 50%,
			350% 50%;
	}
}
```

#### Step 3.5: Convert Custom Variant

```css
/* Old plugin in tailwind.config.js */
addVariant('tall', '@media (min-height: 820px)')

/* New in CSS */
@custom-variant tall (&) {
  @media (min-height: 820px) { & }
}
```

#### Step 3.6: Migrate Plugins

```css
/* In globals.css */
@plugin '@tailwindcss/typography';
/* If tailwindcss-animate is compatible: */
@plugin 'tailwindcss-animate';
```

---

### Phase 4: Cleanup & Verification

#### Step 4.1: Remove Old Config

- [ ] Delete `tailwind.config.js` (or keep as reference temporarily)
- [ ] Update any imports referencing old config

#### Step 4.2: Visual Verification

- [ ] Screenshot all pages (desktop + mobile, light + dark)
- [ ] Compare before/after
- [ ] Fix any visual regressions

#### Step 4.3: Build Verification

- [ ] `pnpm run build` succeeds
- [ ] `pnpm run lint` passes
- [ ] `pnpm run test:e2e` passes

#### Step 4.4: Performance Check

- [ ] Compare CSS bundle size
- [ ] Check build time (should be faster)

---

## Risk Mitigation

### Rollback Plan

1. Keep `tailwind.config.js` as backup initially
2. Use feature branch for all changes
3. Test thoroughly before merging

### Known Risks

| Risk                             | Likelihood | Impact | Mitigation                  |
| -------------------------------- | ---------- | ------ | --------------------------- |
| tailwindcss-animate incompatible | Medium     | High   | Inline animations in @theme |
| Visual regressions               | Medium     | Medium | Screenshot comparison       |
| Build failures                   | Low        | High   | Incremental commits         |
| Dark mode breaks                 | Low        | High   | Test both themes            |
| Aurora effect breaks             | Medium     | Medium | Verify CSS var generation   |

---

## Incremental Commit Plan

1. `chore: audit utilities for v4 migration` - Add audit results
2. `refactor: rename shadow/blur/rounded utilities for v4` - Pre-migration
3. `refactor: add explicit border colors` - Pre-migration
4. `feat: upgrade to Tailwind CSS v4` - Core migration
5. `fix: resolve visual regressions` - Post-migration fixes
6. `chore: cleanup old tailwind config` - Final cleanup

---

## References

- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS v4 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4)
- [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography)
- [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
