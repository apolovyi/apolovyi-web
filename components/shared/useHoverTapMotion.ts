'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'

import { animate } from 'motion'

export type HoverTapOptions = {
	hoverScale?: number
	tapScale?: number
	duration?: number
}

export function useHoverTapMotion<T extends HTMLElement>(ref: RefObject<T>, opts?: HoverTapOptions) {
	useEffect(() => {
		const el = ref.current
		if (!el) return

		const hoverScale = opts?.hoverScale ?? 1.02
		const tapScale = opts?.tapScale ?? 0.985
		const duration = opts?.duration ?? 0.18

		const onEnter = () => {
			animate(el, { scale: hoverScale }, { duration })
		}
		const onLeave = () => {
			animate(el, { scale: 1 }, { duration })
		}
		const onDown = () => {
			animate(el, { scale: tapScale }, { duration: 0.1 })
		}
		const onUp = () => {
			animate(el, { scale: hoverScale }, { duration: 0.12 })
		}

		el.style.transformOrigin = 'center'
		el.addEventListener('pointerenter', onEnter)
		el.addEventListener('pointerleave', onLeave)
		el.addEventListener('pointerdown', onDown)
		el.addEventListener('pointerup', onUp)

		return () => {
			el.removeEventListener('pointerenter', onEnter)
			el.removeEventListener('pointerleave', onLeave)
			el.removeEventListener('pointerdown', onDown)
			el.removeEventListener('pointerup', onUp)
		}
	}, [ref, opts?.hoverScale, opts?.tapScale, opts?.duration])
}
