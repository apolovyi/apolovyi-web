# Mobile Train Journey - Implementation Plan

## Overview

Transform the mobile "Where I've Worked" section from a boring vertical list into an immersive Swiss train journey experience with scroll-linked animations, parallax scenery, and a memorable visual metaphor.

## Current State Analysis

### Desktop (Working Well)

- SVG-based horizontal metro map
- Animated SBB train travels along backend line
- Train transforms into rocket and launches
- Interactive stations with hover/click states
- Domain filtering and line toggles

### Mobile (Needs Improvement)

**File:** `components/home/CareerMetroMap/VerticalTimeline.tsx`

- Plain vertical list with colored dots
- No train animation
- No visual journey metaphor
- No parallax or scenery
- Disconnect between station selection and job details (scroll required)

## Target Experience

```
┌─────────────────────────────┐
│  2024 ────────────── NOW    │ ← Year axis (sticky)
├─────────────────────────────┤
│  ┏━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ 🏔️          🚂═══●    ┃  │ ← Train at current position
│  ┃        ╱               ┃  │
│  ┃   ●═══╯    PEAX        ┃  │ ← Stations along winding track
│  ┃   ║                    ┃  │
│  ┃   ║        🌲          ┃  │ ← Swiss scenery (parallax)
│  ┃   ●════ Comsysto       ┃  │
│  ┃    ╲                   ┃  │
│  ┃     ●══ Spreadshirt    ┃  │
│  ┃     ║   ⛰️             ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━┛  │
│        ↕ scroll to travel   │
├─────────────────────────────┤
│  ┌───────────────────────┐  │ ← Bottom sheet (sticky)
│  │ ● PEAX AG             │  │
│  │   Sr. Backend · Zurich│  │
│  │   ▼ tap for details   │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

## Technical Architecture

### New Components to Create

```
components/home/CareerMetroMap/mobile/
├── MobileTrainJourney.tsx      # Main container (replaces VerticalTimeline)
├── TrackSVG.tsx                # Winding SVG track path
├── MobileStation.tsx           # Station markers on track
├── MobileTrain.tsx             # Scroll-linked train icon
├── SwissScenery.tsx            # Mountains, trees, tunnels (parallax)
├── StationBottomSheet.tsx      # Job details slide-up panel
├── YearIndicator.tsx           # Sticky year axis
└── constants.ts                # Mobile-specific dimensions, colors
```

### Key Technical Decisions

1. **SVG vs CSS for Track**
   - Use SVG for the winding track path
   - Allows complex curves and precise station positioning
   - Train can follow path using `getPointAtLength()`

2. **Scroll-Linked Animation**
   - Use `IntersectionObserver` + scroll position
   - Calculate train position based on scroll percentage
   - Smooth interpolation for train movement

3. **Bottom Sheet**
   - Fixed position at bottom of viewport
   - Shows selected station details
   - Expands on tap for full info
   - No disconnect between selection and details

4. **Parallax Layers**
   - 3 layers: far mountains, near mountains, trees
   - CSS transform based on scroll position
   - Subtle effect (10-20% movement)

## Implementation Tasks

### Phase 1: Core Structure (Priority: High)

- [ ] **1.1 Create mobile folder structure**
  - Create `components/home/CareerMetroMap/mobile/` directory
  - Create `constants.ts` with mobile dimensions

- [ ] **1.2 Build TrackSVG component**
  - SVG viewBox optimized for mobile (vertical orientation)
  - Winding path that goes from bottom (start) to top (current)
  - Path must accommodate 8-10 stations with curves/switchbacks
  - Use quadratic bezier curves for smooth bends
  - Track color: SBB red (#EB0000) or neutral gray

- [ ] **1.3 Build MobileStation component**
  - Position stations along the track path
  - Station dot with company name label
  - Active state: larger dot, highlighted
  - Tap handler to select station
  - Show "Now" badge for current job

- [ ] **1.4 Build MobileTrain component**
  - Reuse TrainIcon from AnimatedTrain.tsx
  - Scale appropriately for mobile
  - Position based on scroll progress
  - Train faces direction of travel (up = toward present)
  - Subtle bobbing animation while stationary

### Phase 2: Scroll Animation (Priority: High)

- [ ] **2.1 Implement scroll tracking**
  - Track scroll position within the journey container
  - Calculate progress (0-1) based on scroll
  - Map progress to path length for train position
  - Use `requestAnimationFrame` for smooth updates

- [ ] **2.2 Train path following**
  - Use SVG `path.getPointAtLength()` for position
  - Calculate rotation angle from path tangent
  - Smooth interpolation between positions

- [ ] **2.3 Station activation on scroll**
  - Determine which station is "current" based on scroll
  - Update selected station as train passes
  - Pulse animation when passing a station

### Phase 3: Swiss Scenery (Priority: Medium)

- [ ] **3.1 Create mountain layers**
  - Far layer: light gray silhouettes (Matterhorn-inspired shapes)
  - Near layer: darker gray with more detail
  - SVG paths for mountain shapes
  - Parallax: far moves 5%, near moves 10%

- [ ] **3.2 Add trees and details**
  - Simple pine tree shapes along track
  - Scattered based on station positions
  - Slight parallax (15%)

- [ ] **3.3 Tunnel transitions**
  - Between major career changes (e.g., different companies)
  - Brief fade to dark, then emerge
  - Adds drama to the journey
  - Optional: play subtle sound

### Phase 4: Bottom Sheet (Priority: High)

- [ ] **4.1 Build StationBottomSheet component**
  - Fixed position at viewport bottom
  - Collapsed state: company name, role, tap hint
  - Expanded state: full job details (tasks, metrics)
  - Smooth spring animation for expand/collapse
  - Backdrop on expand

- [ ] **4.2 Connect to station selection**
  - Update content when station changes
  - Animate content transition
  - Keep expanded state when changing stations

- [ ] **4.3 Handle gestures**
  - Swipe up to expand
  - Swipe down to collapse
  - Tap outside to collapse
  - Prevent scroll when expanded

### Phase 5: Polish & Integration (Priority: Medium)

- [ ] **5.1 Year indicator**
  - Sticky header showing year range
  - Updates based on visible portion
  - Subtle design, not distracting

- [ ] **5.2 Initial animation**
  - Train starts at first station
  - Brief pause, then user can scroll
  - Visual hint to scroll

- [ ] **5.3 Legend (simplified)**
  - Compact version of desktop legend
  - Expandable on tap
  - Filter lines (optional - may remove for simplicity)

- [ ] **5.4 Performance optimization**
  - Minimize re-renders during scroll
  - Use `will-change` for animated elements
  - Test on low-end devices
  - Respect `prefers-reduced-motion`

- [ ] **5.5 Integration**
  - Update `CareerMetroMap/index.tsx` to use new mobile component
  - Ensure smooth transition at breakpoint
  - Test all screen sizes (320px - 640px)

## File Changes Summary

| File                                           | Action    | Description                      |
| ---------------------------------------------- | --------- | -------------------------------- |
| `CareerMetroMap/mobile/MobileTrainJourney.tsx` | Create    | Main mobile experience container |
| `CareerMetroMap/mobile/TrackSVG.tsx`           | Create    | Winding vertical track path      |
| `CareerMetroMap/mobile/MobileStation.tsx`      | Create    | Station markers                  |
| `CareerMetroMap/mobile/MobileTrain.tsx`        | Create    | Scroll-linked train              |
| `CareerMetroMap/mobile/SwissScenery.tsx`       | Create    | Parallax mountains/trees         |
| `CareerMetroMap/mobile/StationBottomSheet.tsx` | Create    | Job details panel                |
| `CareerMetroMap/mobile/YearIndicator.tsx`      | Create    | Sticky year display              |
| `CareerMetroMap/mobile/constants.ts`           | Create    | Mobile dimensions/config         |
| `CareerMetroMap/index.tsx`                     | Modify    | Import new mobile component      |
| `CareerMetroMap/VerticalTimeline.tsx`          | Deprecate | Replaced by MobileTrainJourney   |

## Design Specifications

### Dimensions

- Container width: 100% viewport
- SVG viewBox: 0 0 375 800 (mobile-first)
- Track stroke width: 4px
- Station dot size: 16px (active: 24px)
- Train scale: 0.8 of desktop

### Colors

- Track: #CBD5E1 (gray) or #EB0000 (SBB red)
- Active station: Line color
- Mountains far: #E2E8F0
- Mountains near: #94A3B8
- Trees: #6B7280

### Animation Timings

- Train movement: matches scroll (60fps)
- Station activation: 200ms
- Bottom sheet expand: 300ms spring
- Parallax: CSS transform (hardware accelerated)

### Accessibility

- `prefers-reduced-motion`: disable train animation, show static
- Station names readable
- Bottom sheet focusable
- Keyboard navigation (arrow keys for stations)

## Testing Checklist

- [ ] iPhone SE (320px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] Android small (360px)
- [ ] Reduced motion preference
- [ ] Slow 3G network
- [ ] RTL languages
- [ ] Screen reader

## Risks & Mitigations

| Risk                   | Impact | Mitigation                      |
| ---------------------- | ------ | ------------------------------- |
| Scroll jank            | High   | Use CSS transforms, minimize JS |
| Battery drain          | Medium | Throttle scroll handlers        |
| Complex path math      | Medium | Pre-calculate positions         |
| Bottom sheet conflicts | Low    | Handle touch events carefully   |

## Success Criteria

1. **Visual Impact**: Looks memorable and Swiss-themed
2. **Smooth Animation**: 60fps train movement
3. **Clear Journey**: User understands career progression
4. **Easy Interaction**: Tap station → see details immediately
5. **Performance**: No jank on mid-range devices
6. **Accessibility**: Works with reduced motion + screen readers

---

## Session Notes

### Session 1

- [x] Created feature branch: `feature/mobile-train-journey`
- [x] Analyzed current implementation
- [x] Created this implementation plan

### Session 2 (Completed)

- [x] Phase 1: Core Structure
  - [x] Created mobile folder structure with constants.ts
  - [x] Built TrackSVG component with winding path and railroad ties
  - [x] Built MobileStation component with alternating labels
- [x] Phase 2: Scroll Animation
  - [x] Built MobileTrain with scroll-linked positioning
  - [x] Train follows path using getPointAtLength()
- [x] Phase 3: Swiss Scenery
  - [x] Built SwissScenery with parallax mountains and trees
- [x] Phase 4: Bottom Sheet
  - [x] Built StationBottomSheet with expand/collapse
  - [x] Connected to station selection
- [x] Phase 5: Integration
  - [x] Integrated all components in MobileTrainJourney
  - [x] Updated CareerMetroMap index for mobile
  - [x] Lint and build pass

### Session 3 (Completed) - Quality Polish

- [x] Review score: 98/100 → 99/100
- [x] Fixed duplicate JobDescription on mobile (hidden sm:block)
- [x] Increased SVG height from 700 to 850 for better spacing
- [x] Reduced station dot sizes and font sizes for labels
- [x] Fixed bottom sheet padding/spacing issues
- [x] Added `shortName` field to career-data.ts for truncated company names
  - SilverTours GmbH → SilverTours
  - Senacor Technologies → Senacor
  - Comsysto Reply GmbH → Comsysto Reply
  - Virtual Identity AG → Virtual Identity
  - The Bicester Collection → Bicester Collection

### Session 4 (Completed) - UX Improvements

- [x] Added SBB train loading animation (`LoadingScreen.tsx`)
  - Masks React hydration flash
  - SVG train with animated track ties
  - 500ms minimum display time
- [x] Fixed bottom sheet tap area
  - Entire header now tappable (not just drag handle)
  - Added chevron icon to indicate expand/collapse state
  - Added `touch-manipulation` and active state
- [x] Added auto-scroll when station selected
  - Page scrolls to show bottom sheet when tapping station at top of map
  - Smooth scroll behavior
- [x] Fixed horizontal scroll during vertical scroll
  - Added `overflow-x-hidden` to mobile containers
  - Removed `overflow: visible` from SVG

### Files Created

- `components/home/CareerMetroMap/mobile/constants.ts`
- `components/home/CareerMetroMap/mobile/TrackSVG.tsx`
- `components/home/CareerMetroMap/mobile/MobileStation.tsx`
- `components/home/CareerMetroMap/mobile/MobileTrain.tsx`
- `components/home/CareerMetroMap/mobile/SwissScenery.tsx`
- `components/home/CareerMetroMap/mobile/StationBottomSheet.tsx`
- `components/home/CareerMetroMap/mobile/MobileTrainJourney.tsx`
- `components/shared/LoadingScreen.tsx`

### Files Modified

- `components/home/CareerMetroMap/index.tsx` - Use MobileTrainJourney on mobile, auto-scroll
- `components/home/MyExperience.tsx` - Hide JobDescription on mobile, overflow fix
- `lib/career-data.ts` - Added shortName field to CareerStation interface
- `app/[lang]/layout.tsx` - Added LoadingScreen component

---

## Session 6 - Complete UX Redesign ✅

Replaced bottom sheet with a cleaner **Compact Card + Modal** pattern to eliminate scroll conflicts.

### New Architecture

| Component                | Purpose                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| `StationCard.tsx`        | Fixed compact card (~120px). Shows title, company, date, location, 3 tech tags. |
| `StationDetailModal.tsx` | Slide-up modal with full details: all technologies, metrics, tasks, URL.        |

### Removed

- `StationBottomSheet.tsx` - Deleted (was causing scroll issues)
- Auto-scroll logic - Removed entirely
- `BOTTOM_SHEET_CONFIG` - Removed from constants

### User Flow

1. User sees train journey map with "Tap a station" prompt
2. Taps station → compact card appears at bottom
3. Taps card → modal opens with full details
4. Tap backdrop or X to close modal

### Benefits

- No auto-scroll (was disorienting)
- No scroll-within-scroll (was confusing)
- Fixed card doesn't fight with page scroll
- Clear two-tap interaction model
- Modal locks body scroll when open

### Files Changed (Session 6)

**New:**

- `components/home/CareerMetroMap/mobile/StationCard.tsx`
- `components/home/CareerMetroMap/mobile/StationDetailModal.tsx`

**Modified:**

- `components/home/CareerMetroMap/index.tsx` - Use new components, removed auto-scroll
- `components/home/CareerMetroMap/mobile/constants.ts` - Removed BOTTOM_SHEET_CONFIG
- `components/home/CareerMetroMap/mobile/MobileTrainJourney.tsx` - Removed data attribute

**Deleted:**

- `components/home/CareerMetroMap/mobile/StationBottomSheet.tsx`

---

## Status: ✅ COMPLETE (100/100)

Mobile train journey redesigned with compact card + modal pattern. All polish items resolved.

---

## Polish Items (All Resolved)

### 1. Mobile S (320px) - Station Labels ✅

**Fix:** Reduced font size from 10px to 9px, label offset from 18px to 16px.
**Files:** `MobileStation.tsx`, `constants.ts`

### 2. Wide Viewport (1920px) - Job Details ✅

**Fix:** Added `2xl:max-w-6xl` to container and `2xl:px-4` to job description.
**File:** `MyExperience.tsx`

### 3. Tech List Responsive Layout ✅

- Single column on screens < 375px
- Two columns on 375px+

### 4. Train Orientation Fix ✅

**Fix:** Added angle normalization to keep train upright on steep curves.
**File:** `MobileTrain.tsx`
**Logic:** When angle > 90° or < -90°, flip by ±180° to prevent upside-down appearance.

---

## Review Score History

| Date       | Score   | Notes                                                       |
| ---------- | ------- | ----------------------------------------------------------- |
| 2025-12-16 | 92/100  | Compact card + modal redesign complete                      |
| 2025-12-16 | 100/100 | Polish items resolved (label sizing, wide viewport padding) |
