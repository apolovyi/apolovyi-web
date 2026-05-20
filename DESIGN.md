---
name: apolovyi.me
description: Personal brand surface for an enterprise engineer in Zurich
colors:
  warm-parchment: '#fafaf8'
  ink: '#111111'
  mid-grey: '#555555'
  body-grey: '#666666'
  link-grey: '#6a6a6a'
  chrome: '#a3a3a3'
  separator: '#c0c0c0'
typography:
  display:
    fontFamily: 'Outfit, system-ui, sans-serif'
    fontSize: 'clamp(2.25rem, 1.2rem + 4vw, 4rem)'
    fontWeight: 200
    lineHeight: 1.05
    letterSpacing: '-0.025em'
  title:
    fontFamily: 'Outfit, system-ui, sans-serif'
    fontSize: 'clamp(1.25rem, 1rem + 1.25vw, 1.5rem)'
    fontWeight: 300
    lineHeight: 1.25
    letterSpacing: '0.06em'
  body:
    fontFamily: 'Outfit, system-ui, sans-serif'
    fontSize: 'clamp(0.875rem, 0.75rem + 0.625vw, 1rem)'
    fontWeight: 300
    lineHeight: 1.625
    letterSpacing: 'normal'
  label:
    fontFamily: 'Outfit, system-ui, sans-serif'
    fontSize: 'clamp(0.75rem, 0.625rem + 0.625vw, 0.875rem)'
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: '0.2em'
rounded:
  none: '0px'
  circle: '9999px'
  subtle: '2px'
spacing:
  page-x: 'clamp(1.5rem, 1rem + 1.5vw, 2rem)'
  content-gap: 'clamp(1.5rem, 1rem + 1.5vw, 2rem)'
  section-gap: 'clamp(2.5rem, 1.5rem + 3vw, 3.5rem)'
components:
  nav-link:
    textColor: '{colors.link-grey}'
    padding: '10px 12px'
  nav-link-hover:
    textColor: '{colors.ink}'
  theme-toggle:
    backgroundColor: 'transparent'
    size: '44px'
    rounded: '{rounded.circle}'
---

# Design System: apolovyi.me

## 1. Overview

**Creative North Star: "The Precision Instrument"**

Every element is machined to tolerance. Nothing decorative, nothing performative. The site communicates through material density and deliberate compression: a name rendered at display scale in a single ultralight weight, body copy that earns each word, and navigation reduced to three contact points separated by dots.

The system rejects developer-portfolio templates (dark mode + terminal font + GitHub stats), SaaS marketing patterns (gradient blobs, feature grids, CTA stacking), hollow minimalism (white page with tiny text that reads as unfinished), and spectacle-driven animation (scroll-jacking, particles, 3D scenes). Restraint here is not absence. It is the residue of removing everything that does not communicate competence.

**Key Characteristics:**

- Single-family typography (Outfit) carrying the entire hierarchy through weight and scale alone
- Pure neutral palette with no accent color; the absence of color is the statement
- Flat elevation; depth conveyed through ambient light and texture, never shadows
- Dual-theme (light/dark) with time-based auto-switching
- Centered single-column composition at a narrow measure

## 2. Colors: The Neutral Instrument

A monochromatic palette of warm-tinted greys. No accent color exists by design. The palette communicates through value contrast alone.

### Primary

No primary accent. The system is intentionally achromatic.

### Neutral

- **Warm Parchment** (#fafaf8): Light-mode background. Not pure white; carries a warm yellow-grey tint that softens the screen without feeling beige.
- **Ink** (#111111): Primary text. Near-black with enough warmth to avoid clinical harshness.
- **Mid Grey** (#555555): Secondary text. Subtitles, supporting information.
- **Body Grey** (#666666): Body text. The default reading color, calibrated for comfortable sustained reading against Warm Parchment.
- **Link Grey** (#6a6a6a): Navigation links at rest. Deliberately close to body text; the tracked uppercase treatment distinguishes them, not color.
- **Chrome** (#a3a3a3): UI elements at rest (theme toggle border, decorative dots). Visible but recessive.
- **Separator** (#c0c0c0): Dot separators between nav items.

### Dark Mode Neutrals

The dark theme inverts to pure black (#000000) background with white (#ffffff) primary text. Secondary and body greys shift to higher lightness values to maintain readable contrast against the dark ground. The dark name carries a warm text-shadow glow (rgba 255, 250, 240) that acts as the only "color" in either theme.

### Named Rules

**The No-Color Rule.** There is no accent color. If a future element needs emphasis, it earns it through weight, scale, or spacing. Color is not available as a tool for hierarchy.

## 3. Typography

**Display and Body Font:** Outfit (with system-ui, sans-serif fallback)

**Character:** A geometric sans-serif used across all roles. Carries the hierarchy through three loaded weights (200, 300, 400) with the ultralight display as the brand signature. Hierarchy comes primarily from size contrast (1.25 ratio between steps), with weight as a secondary signal. The overall feel is light and elegant.

### Hierarchy

- **Display** (200, clamp(2.25rem, 1.2rem + 4vw, 4rem), line-height 1.05, tracking -0.025em): The hero name. Fluid scaling from mobile to desktop. Ultralight at large scale; the weight thinness is the personality.
- **Title** (300, clamp(1.25rem, 1rem + 1.25vw, 1.5rem), line-height 1.25, tracking 0.06em): Hero subtitle. Fluid sizing maintains ~1.25x ratio to body across viewports. Same weight as body; the size and tracking difference carry the hierarchy while preserving the ultralight aesthetic.
- **Body** (300, clamp(0.875rem, 0.75rem + 0.625vw, 1rem), line-height 1.625): Hero body copy. Light weight for elegant, comfortable sustained reading.
- **Label** (400, clamp(0.75rem, 0.625rem + 0.625vw, 0.875rem), line-height 1.5, tracking 0.2em, uppercase): Navigation links. Differentiated from body by uppercase, wide tracking, and smaller size. Size ratio from body: ~1.14x.

### Named Rules

**The Single-Family Rule.** Outfit carries every role. No secondary typeface. The hierarchy must be legible through weight and scale contrast within one family.

## 4. Elevation

The system is flat. No box-shadows exist anywhere. Depth is conveyed through two ambient layers applied to the page shell:

1. **Warm spotlight**: a fixed radial gradient (ellipse at 50% 40%) with near-invisible warm tint (rgba 180, 160, 120 at 1.2% opacity in light mode; rgba 255, 250, 240 at 1.5% in dark). Creates a subtle sense of directed light without casting shadows.
2. **Noise grain**: a fixed SVG fractal-noise texture at 2-4% opacity. Adds physical surface quality that prevents the flat ground from reading as digital void.

### Named Rules

**The No-Shadow Rule.** Surfaces never cast shadows. If a component needs to separate from the ground, it uses value contrast or spacing, never elevation.

## 5. Components

### Navigation Links

Quiet and confident. Three external links (LinkedIn, GitHub, Email) presented as uppercase tracked text separated by mid-dot characters.

- **Shape:** No border, no background, inline-flex with 44px min-height for touch targets
- **Default:** Link Grey (#6a6a6a), weight 400, 0.2em tracking, uppercase
- **Hover:** Ink (#111111) in light mode, near-white (#e5e5e5) in dark. Transition: 200ms ease on color. Dark mode adds a warm text-shadow glow
- **Focus:** 1px solid currentColor outline, 3px offset, 2px radius

### Theme Toggle

A fixed-position button in the bottom-right corner using overlapping sun/moon SVG icons. The interaction is binary (light/dark) with the visible icon indicating the current theme.

- **Shape:** Two overlapping 18px SVG icons (sun and moon), 14px padding, 44px min touch target
- **Icons:** Sun (circle + 8 rays, stroke 1.5px) visible in dark mode; Moon (crescent path, stroke 1.5px) visible in light mode
- **Default:** Transparent background, icon color Chrome (#a3a3a3 light, #525252 dark)
- **Hover:** Icon color shifts to text-ui-hover (#525252 light, #8a8a8a dark). Transition: 200ms ease on opacity, transform, and color
- **Swap animation:** Active icon at opacity 1, scale(1), rotate(0deg); inactive at opacity 0, scale(0), rotate(+/-90deg)
- **Position:** Fixed, bottom 24px, right 24px, z-index 10

### Divider

A horizontal gradient line between the hero name and subtitle. Centered, 128px to 192px wide.

- **Style:** 1px height, linear-gradient from transparent through 10% opacity center, back to transparent
- **Animation:** 5s ease-in-out infinite opacity pulse between 50% and 100%. Disabled under prefers-reduced-motion

## 6. Do's and Don'ts

### Do:

- **Do** use weight and scale as the primary hierarchy tools. A 200-weight display next to 400-weight labels creates contrast without color.
- **Do** keep the warm tint in neutrals. #fafaf8, not #ffffff. #111111, not #000000. The warmth is subtle but load-bearing.
- **Do** respect the narrow measure. Content stays within max-w-lg (32rem). The compression is deliberate.
- **Do** use generous fluid vertical rhythm between sections (clamp-based, e.g. mt clamp(1.5rem, 1rem + 1.5vw, 2rem) to clamp(2.5rem, 1.5rem + 3vw, 3.5rem)) while keeping horizontal padding tight.
- **Do** maintain 44px minimum touch targets on all interactive elements.

### Don't:

- **Don't** add an accent color. The No-Color Rule is a commitment, not a gap. Emphasis through weight, scale, spacing.
- **Don't** add shadows or elevation to any surface. The No-Shadow Rule is absolute.
- **Don't** introduce a second typeface without retiring Outfit. One family, committed.
- **Don't** use terminal fonts, GitHub contribution graphs, or project card grids. This is not a developer portfolio template.
- **Don't** add gradient blobs, feature grids, logo bars, or stacking CTAs. This is not a SaaS landing page.
- **Don't** use scroll-jacking, particle effects, or 3D scenes. Spectacle is anti-brand.
- **Don't** add sections that require assets you don't have (testimonials, case studies, project screenshots). Half-implemented features look broken, not "in progress."
- **Don't** use bounce or elastic easing. Exponential ease-out only. The instrument doesn't bounce.
