'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'

let aosInitDone = false

// Minimal type for the parts of AOS we use
type AOSModule = { default: { init: (opts?: Record<string, unknown>) => void; refreshHard: () => void } }
let aosImportPromise: Promise<AOSModule> | null = null

async function loadAOS(): Promise<AOSModule> {
	if (!aosImportPromise) aosImportPromise = import('aos') as Promise<AOSModule>
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
	initOptions?: Record<string, unknown>,
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
