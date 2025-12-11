'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'

import { animate } from 'motion'

export type HoverLiftOptions = {
	y?: number // pixels up (negative)
	shadow?: string
	duration?: number
}

export function useHoverLiftMotion<T extends HTMLElement>(ref: RefObject<T | null>, opts?: HoverLiftOptions) {
	useEffect(() => {
		const el = ref.current
		if (!el) return

		const y = opts?.y ?? -8
		const shadow = opts?.shadow ?? '0 8px 24px rgba(0,0,0,0.12)'
		const duration = opts?.duration ?? 0.2

		const onEnter = () => {
			el.style.willChange = 'transform, box-shadow'
			animate(el, { transform: `translateY(${y}px)`, boxShadow: shadow }, { duration })
		}
		const onLeave = () => {
			animate(el, { transform: 'translateY(0px)', boxShadow: '0 0 0 rgba(0,0,0,0)' }, { duration })
		}

		el.addEventListener('pointerenter', onEnter)
		el.addEventListener('pointerleave', onLeave)

		return () => {
			el.removeEventListener('pointerenter', onEnter)
			el.removeEventListener('pointerleave', onLeave)
		}
	}, [ref, opts?.y, opts?.shadow, opts?.duration])
}
