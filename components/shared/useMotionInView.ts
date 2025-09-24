'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'

import { animate } from 'motion'

type MotionName = 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right'

type Options = {
	delay?: number
	threshold?: number

	mode?: 'once' | 'toggle'
	inDuration?: number
	outDuration?: number
	entryEase?: number[] | string
	exitEase?: number[] | string
}

export function useMotionInView<T extends HTMLElement>(ref: RefObject<T>, motion: MotionName = 'fade-up', options?: Options) {
	useEffect(() => {
		const el = ref.current
		if (!el) return

		// initial state to avoid pop-in
		el.style.opacity = '0'
		if (motion === 'fade-up') {
			el.style.transform = 'translateY(6px)'
		} else if (motion === 'fade-left') {
			el.style.transform = 'translateX(-6px)'
		} else if (motion === 'fade-right') {
			el.style.transform = 'translateX(6px)'
		}

		const threshold = options?.threshold ?? 0.15
		const inDuration = options?.inDuration ?? 0.45
		const outDuration = options?.outDuration ?? 0.35
		const entryEase = options?.entryEase ?? [0.22, 1, 0.36, 1]
		const exitEase = options?.exitEase ?? [0.25, 0.6, 0.3, 1]
		const mode = options?.mode ?? 'once'
		const io = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					const isIn = entry.isIntersecting
					const inKeyframes =
						motion === 'fade-up'
							? { opacity: 1, transform: 'translateY(0px)' }
							: motion === 'fade-left' || motion === 'fade-right'
								? { opacity: 1, transform: 'translateX(0px)' }
								: { opacity: 1 }
					const outKeyframes =
						motion === 'fade-up'
							? { opacity: 0.001, transform: 'translateY(6px)' }
							: motion === 'fade-left'
								? { opacity: 0.001, transform: 'translateX(-6px)' }
								: motion === 'fade-right'
									? { opacity: 0.001, transform: 'translateX(6px)' }
									: { opacity: 0.001 }
					if (isIn) {
						// @ts-expect-error easing is supported by Motion One at runtime; types in this version may not include it
						animate(el, inKeyframes as DOMKeyframesDefinition, { duration: inDuration, delay: options?.delay ?? 0, easing: entryEase })
						if (mode === 'once') {
							obs.unobserve(entry.target)
						}
					} else if (mode === 'toggle') {
						// @ts-expect-error easing is supported by Motion One at runtime; types in this version may not include it
						animate(el, outKeyframes as DOMKeyframesDefinition, { duration: outDuration, easing: exitEase })
					}
				})
			},
			{ threshold },
		)
		io.observe(el)
		return () => io.disconnect()
	}, [
		ref,
		motion,
		options?.delay,
		options?.threshold,
		options?.mode,
		options?.inDuration,
		options?.outDuration,
		options?.entryEase,
		options?.exitEase,
	])
}
