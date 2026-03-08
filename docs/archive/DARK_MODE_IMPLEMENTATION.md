# Dark Mode Implementation Plan

> **Created:** 2025-12-16
> **Status:** In Progress
> **Branch:** `feature/dark-mode`

---

## Overview

Implement theme switching (light/dark mode) with smooth transitions, localStorage persistence, and system preference detection.

---

## Current State Analysis

| Layer                    | Status     | Notes                            |
| ------------------------ | ---------- | -------------------------------- |
| `tailwind.config.js`     | ✅ Ready   | `darkMode: ['class']` configured |
| `globals.css` `.dark {}` | ✅ Partial | Some dark CSS variables defined  |
| `<html>` element         | ❌ Missing | No `class="dark"` toggle logic   |
| Toggle component         | ❌ Missing | No UI to switch themes           |
| localStorage             | ❌ Missing | No persistence                   |
| Hardcoded colors         | ❌ Problem | Won't switch with dark mode      |

### Hardcoded Colors (Must Convert)

```js
// tailwind.config.js - currently hardcoded
text.primary: '#2B2B2B'
text.secondary: '#4A4A4A'
background.primary: '#FFFFFF'
background.secondary: '#FAFAFA'
neutral.offwhite: '#F7F7F7'
neutral.light-gray: '#E5E5E5'
neutral.medium-gray: '#A0A0A0'
```

### Colors to Keep (Work in Both Modes)

```js
accent.coral: '#c23b3b'    // Good contrast both modes
accent.blue: '#005bb0'     // Good contrast both modes
error: '#C90000'           // Semantic color
success: '#00C968'         // Semantic color
```

---

## Implementation Tasks

### Phase 1: CSS Variables Setup

- [ ] **1.1** Add semantic CSS variables to `globals.css` `:root`
  - `--text-primary`, `--text-secondary`
  - `--bg-primary`, `--bg-secondary`
  - `--neutral-offwhite`, `--neutral-light-gray`, `--neutral-medium-gray`

- [ ] **1.2** Add dark mode variants to `globals.css` `.dark`
  - Invert text colors (light on dark)
  - Invert background colors (dark backgrounds)
  - Adjust neutral colors for dark theme

- [ ] **1.3** Update `tailwind.config.js` to use CSS variables
  - Replace hardcoded hex values with `var(--xxx)`

### Phase 2: Theme Infrastructure

- [ ] **2.1** Create `ThemeProvider` component
  - Context for theme state (`light` | `dark` | `system`)
  - Read from localStorage on mount
  - Sync to `<html>` classList
  - Handle system preference with `matchMedia`

- [ ] **2.2** Create `ThemeToggle` component
  - Sun/Moon icon toggle button
  - Smooth icon transition animation
  - Accessible (aria-label, keyboard support)

- [ ] **2.3** Integrate into layout
  - Wrap app with `ThemeProvider`
  - Add script to prevent flash (set class before hydration)

### Phase 3: Header Integration

- [ ] **3.1** Add `ThemeToggle` to header
  - Position: before language selector
  - Mobile: include in hamburger menu

### Phase 4: Component Fixes

- [ ] **4.1** Audit components for hardcoded colors
  - Check for inline styles with hex colors
  - Check for Tailwind classes that need `dark:` variants

- [ ] **4.2** Fix specific components if needed
  - Loading screen
  - Metro map (SVG colors)
  - Globe component
  - Cards and borders

### Phase 5: Polish & Testing

- [ ] **5.1** Add smooth transition on theme change
  - CSS transition on background/color properties
  - Prevent transition on page load

- [ ] **5.2** Test all sections in both modes
  - Hero section
  - About section
  - Experience section (metro map)
  - Projects section
  - Contact section

- [ ] **5.3** Test edge cases
  - System preference changes
  - localStorage cleared
  - Reduced motion preference

---

## Technical Decisions

### Theme Storage Key

```js
localStorage.key = 'theme'
values = 'light' | 'dark' | 'system'
```

### Flash Prevention Script

```html
<!-- Inline script in <head> to set class before paint -->
<script>
	;(function () {
		const theme = localStorage.getItem('theme')
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
		if (theme === 'dark' || (!theme && prefersDark)) {
			document.documentElement.classList.add('dark')
		}
	})()
</script>
```

### CSS Transition Strategy

```css
/* Only transition after initial load */
html.theme-transition,
html.theme-transition * {
	transition:
		background-color 0.3s ease,
		color 0.3s ease,
		border-color 0.3s ease !important;
}
```

---

## Color Palette

### Light Mode

| Token                   | Value     | Usage              |
| ----------------------- | --------- | ------------------ |
| `--text-primary`        | `#2B2B2B` | Main text          |
| `--text-secondary`      | `#4A4A4A` | Secondary text     |
| `--bg-primary`          | `#FFFFFF` | Main background    |
| `--bg-secondary`        | `#FAFAFA` | Card backgrounds   |
| `--neutral-offwhite`    | `#F7F7F7` | Subtle backgrounds |
| `--neutral-light-gray`  | `#E5E5E5` | Borders, dividers  |
| `--neutral-medium-gray` | `#A0A0A0` | Disabled, hints    |

### Dark Mode

| Token                   | Value     | Usage              |
| ----------------------- | --------- | ------------------ |
| `--text-primary`        | `#F5F5F5` | Main text          |
| `--text-secondary`      | `#B0B0B0` | Secondary text     |
| `--bg-primary`          | `#0A0A0A` | Main background    |
| `--bg-secondary`        | `#141414` | Card backgrounds   |
| `--neutral-offwhite`    | `#1A1A1A` | Subtle backgrounds |
| `--neutral-light-gray`  | `#2A2A2A` | Borders, dividers  |
| `--neutral-medium-gray` | `#6A6A6A` | Disabled, hints    |

---

## Files to Modify

| File                                  | Changes                                    |
| ------------------------------------- | ------------------------------------------ |
| `app/globals.css`                     | Add CSS variables for light/dark           |
| `tailwind.config.js`                  | Use CSS variables instead of hardcoded     |
| `app/[lang]/layout.tsx`               | Add ThemeProvider, flash prevention script |
| `components/shared/ThemeProvider.tsx` | New - theme context                        |
| `components/shared/ThemeToggle.tsx`   | New - toggle button                        |
| `components/header/Header.tsx`        | Add ThemeToggle                            |
| `components/header/MobileMenu.tsx`    | Add ThemeToggle                            |

---

## Session Log

### Session 1 (2025-12-16)

- [x] Analyzed current theme setup
- [x] Identified hardcoded colors
- [x] Created implementation plan
- [x] Phase 1: CSS Variables Setup
- [x] Phase 2: Theme Infrastructure
- [x] Phase 3: Header Integration
- [x] Phase 4: Component Fixes (hero, loading screen)
- [x] Phase 5: Testing all sections

## Status: ✅ COMPLETE

Dark mode fully functional with:

- CSS variables for semantic colors (text, backgrounds, neutrals)
- ThemeProvider with localStorage persistence
- ThemeToggle in desktop and mobile headers
- Flash prevention script
- All sections verified in dark mode
