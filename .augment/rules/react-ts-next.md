---
type: 'manual'
---

# Best Practices for Next.js + React + TypeScript with Motion.dev, Lenis, and Lens

- Use **Next.js App Router** with RSC; mark only animation components as `use client`.
- Create **one global Lenis instance** in the root layout; expose scroll progress to subscribers.
- Drive all scroll-linked animations from **Lenis progress**; don’t mix multiple scroll controllers.
- Keep **Motion.dev animations** transform/opacity-only for performance; use variants + tokens for consistency.
- Ensure **initial animation state matches SSR** output to avoid hydration mismatches.
- Wrap **page transitions** in shared layouts; use Motion exit/enter for smooth routing.
- Use **dynamic imports (`ssr: false`)** for heavy client-only effects (Lenis, Lens/WebGL).
- Serve images with **`next/image`**; lazy-load and optimize media for LCP.
- Implement **prefers-reduced-motion** support and offer a “disable effects” toggle.
- Provide **fallbacks** for Lens/WebGL effects (static images or posters).
- Preload critical **fonts** with `next/font` for stable hero animations.
- Minimize **paint-heavy effects** (like backdrop-filter) to promoted layers only.
- Keep **animation config in typed constants** (durations, easings) for reusability.
- Test **SSR frames + post-animation states** to ensure CLS/LCP stability.
- Monitor **performance & accessibility**: no essential content locked behind animations.
