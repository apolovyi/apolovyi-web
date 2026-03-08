# Portfolio Enhancements - Implementation Plan

Creative enhancements to make the portfolio more memorable and impressive to recruiters/hiring managers.

---

## Implementation Status

| Phase              | Description                          | Status                                |
| ------------------ | ------------------------------------ | ------------------------------------- |
| **Quick Wins**     |                                      |                                       |
| 1                  | Impact Metrics Callouts              | ✅ Complete                           |
| 2                  | Typed Role Animation                 | ✅ Complete                           |
| 3                  | Years of Experience Badges           | ✅ Complete                           |
| 4                  | Scroll Progress Indicator            | ✅ Complete                           |
| **Medium Effort**  |                                      |                                       |
| 5                  | Custom Cursor System                 | ✅ Complete                           |
| 6                  | Domain Filter for Metro Map          | ✅ Complete                           |
| 7                  | SBB Train Loading Animation          | ✅ Complete                           |
| 8                  | Mobile Train Journey Experience      | ✅ Complete                           |
| 9                  | Station Achievement Badges           | ⏭️ Skipped (UI clutter)               |
| 10                 | Company Logo Integration             | ⏭️ Skipped (no real logos = no value) |
| 11                 | Dark Mode Toggle (+ auto time-based) | ✅ Complete                           |
| **Major Features** |                                      |                                       |
| 12                 | Interactive Skill Constellation      | ⏭️ Skipped (complexity > value)       |
| 13                 | Live Project Previews                | ⏭️ Skipped (not needed)               |
| 14                 | Sound Design                         | ⏭️ Skipped (annoys users)             |

---

## Phase Details

### Quick Wins

#### 1. Impact Metrics Callouts

**Location:** Experience section
**Description:** Extract quantified achievements ("200 QPS", "60% faster", "100% data consistency") from task descriptions into visually prominent callout cards.
**Visual:** Small cards with large numbers + context
**Data source:** Metrics already exist in `career-data.ts` task descriptions
**Rationale:** Quantified impact immediately visible to recruiters

#### 2. Typed Role Animation

**Location:** Hero section
**Description:** Replace static tagline with cycling roles from career-data.ts: "Senior Backend Engineer" → "Full-Stack Developer" → "Lead Engineer" with typewriter or text scramble effect.
**Technical:** Use existing career-data, add text scramble/typewriter component
**Rationale:** Shows breadth of experience dynamically

#### 3. Years of Experience Badges

**Location:** About Me section
**Description:** Add "10+ years" or "since 2014" badges next to key skills.
**Data source:** `since` field already exists in `technicalSkills` array
**Technical:** Calculate duration from current year
**Rationale:** Duration matters; data already available

#### 4. Scroll Progress Indicator

**Location:** Global (top of page)
**Description:** Subtle progress bar showing scroll position with section labels on hover.
**Technical:** Intersection Observer + scroll listener
**Rationale:** Helps orientation on long single-page site

---

### Medium Effort

#### 5. Custom Cursor System

**Location:** Global
**Description:** Context-aware custom cursor:

- Default: Minimal dot
- Links: Circle with arrow
- Interactive elements: Scale up
- Metro map: Train icon
  **Technical:** Custom cursor component following mouse with context detection
  **Rationale:** Signature interaction that feels premium

#### 6. Domain Filter for Metro Map

**Location:** Experience section (Career Metro Map)
**Description:** Add second filter dimension for industry domains (Banking, Automotive, Enterprise, E-commerce). Small icons/badges on stations showing domain; click domain in legend to highlight.
**Data source:** `domains` field already exists in career-data.ts stations
**Rationale:** Recruiters care about industry experience as much as tech stack

#### 7. SBB Train Loading Animation ✅

**Location:** Global (app layout)
**Description:** Swiss SBB-themed loading animation that displays during React hydration to prevent flash of unstyled content.
**Technical:** SVG train with animated track ties, 500ms minimum display, fade-out transition
**File:** `components/shared/LoadingScreen.tsx`
**Rationale:** Masks hydration flash, reinforces Swiss theme

#### 8. Mobile Train Journey Experience ✅

**Location:** Experience section (mobile only)
**Description:** Replaced boring vertical list with immersive scroll-linked train journey:

- Winding SVG track through career stations
- Scroll-linked train animation using `getPointAtLength()`
- Parallax Swiss scenery (mountains, trees)
- Bottom sheet for job details with tap-to-expand
- Auto-scroll when selecting distant stations
  **Files:** `components/home/CareerMetroMap/mobile/` (7 files)
  **Documentation:** `.todo/MOBILE_TRAIN_JOURNEY.md`
  **Rationale:** Transforms forgettable mobile list into memorable interactive experience

#### 9. Station Achievement Badges

**Location:** Experience section (Career Metro Map)
**Description:** Micro-badges or indicators for notable achievements (AWS cert at Comsysto, 200 QPS at Audi, 60% improvement at Senacor). Small star/badge icon next to qualifying stations reveals metrics on hover.
**Data source:** Extract from task descriptions in career-data.ts
**Rationale:** Quantified achievements strengthen impression

#### 10. Company Logo Integration

**Location:** Experience section
**Description:** Add grayscale company logos that colorize on selection/hover.
**Companies:** Audi, UBS, Infineon, PEAX, Senacor, Comsysto, etc.
**Technical:** SVG logos with CSS filter for grayscale treatment
**Rationale:** Visual recognition of notable companies

#### 11. Dark Mode Toggle

**Location:** Header
**Description:** Implement theme switching with smooth CSS transition.
**Technical:** CSS variables partially defined already; add toggle component and localStorage persistence
**Rationale:** Many developers prefer dark mode; shows attention to user preferences

---

### Major Features

#### 12. Interactive Skill Constellation

**Location:** About Me section
**Description:** Replace static two-column skill list with interactive force-directed graph:

- Node size = proficiency (stars from technicalSkills)
- Node connections = technologies used together at same company
- Hover shows "Used at: Comsysto, UBS"
  **Technical:** D3.js force simulation or custom SVG animation
  **Data source:** technicalSkills + station technologies from career-data.ts
  **Rationale:** Static lists are forgettable; interactive viz is memorable and shows relationships

#### 13. Live Project Previews

**Location:** Projects section
**Description:** Embed live iframe previews or interactive mockups for suitable projects instead of static screenshots.
**Technical:** iframe with lazy loading, fallback to screenshot
**Rationale:** Live demos infinitely more impressive than screenshots

#### 14. Sound Design

**Location:** Global
**Description:** Optional subtle sound effects:

- Train chug during metro animation
- Rocket whoosh on launch
- Soft click on navigation
  **Technical:** Web Audio API, user-initiated audio context, prominent mute toggle
  **Rationale:** Multi-sensory experience is more memorable

---

## Value Assessment (Applied 2024-12-17)

Evaluated each pending feature against: **"Will this improve the product for a first-time visitor?"**

### Skipped Features

| Feature                         | Reason                                                             |
| ------------------------------- | ------------------------------------------------------------------ |
| Station Achievement Badges      | UI clutter; metrics already visible in job descriptions            |
| Company Logo Integration        | Requires real logo assets; text placeholders look broken           |
| Interactive Skill Constellation | High complexity, risk of looking gimmicky; current list works fine |
| Sound Design                    | Most users find unexpected audio annoying; accessibility concerns  |
| Live Project Previews           | Not needed                                                         |

### Completed (9 of 14 planned)

✅ Impact Metrics, Typed Role Animation, Experience Badges, Scroll Progress, Custom Cursor, Domain Filter, SBB Train Loading, Mobile Train Journey, Dark Mode

---

## Completed Features Summary

| #   | Feature                              | Date       |
| --- | ------------------------------------ | ---------- |
| 1   | Impact Metrics Callouts              | 2024-12    |
| 2   | Typed Role Animation                 | 2024-12    |
| 3   | Years of Experience Badges           | 2024-12    |
| 4   | Scroll Progress Indicator            | 2024-12    |
| 5   | Custom Cursor System                 | 2024-12    |
| 6   | Domain Filter for Metro Map          | 2024-12    |
| 7   | SBB Train Loading Animation          | 2024-12-16 |
| 8   | Mobile Train Journey Experience      | 2024-12-16 |
| 9   | Dark Mode Toggle (+ auto time-based) | 2024-12-16 |

---

## Notes

- All enhancements should respect `prefers-reduced-motion`
- Mobile considerations required for each feature
- Leverage existing career-data.ts as single source of truth where possible
