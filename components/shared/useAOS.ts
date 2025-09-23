'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'

let aosInitDone = false
let aosImportPromise: Promise<any> | null = null

async function loadAOS() {
  if (!aosImportPromise) aosImportPromise = import('aos')
  return aosImportPromise
}

type AOSAttrs = {
  animation?: string
  delay?: number
  anchorPlacement?: string
}

export function useAttachAOS<T extends HTMLElement>(
  ref: RefObject<T>,
  animation: string = 'fade-up',
  attrs?: Omit<AOSAttrs, 'animation'>,
  initOptions?: Record<string, any>
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Attach attributes after hydration so SSR and first client render match
    el.setAttribute('data-aos', animation)
    if (attrs?.delay != null) el.setAttribute('data-aos-delay', String(attrs.delay))
    if (attrs?.anchorPlacement) el.setAttribute('data-aos-anchor-placement', attrs.anchorPlacement)

    let canceled = false
    ;(async () => {
      const mod = await loadAOS()
      if (canceled) return
      if (!aosInitDone) {
        mod.default.init({ duration: 1000, once: true, ...initOptions })
        aosInitDone = true
      } else {
        // Ensure AOS re-scans for dynamically added attributes
        mod.default.refreshHard()
      }
    })()

    return () => {
      canceled = true
    }
  }, [ref, animation, attrs?.delay, attrs?.anchorPlacement, initOptions])
}

