'use client'

import { useEffect } from 'react'
import type { RefObject } from 'react'

import { animate } from 'motion'

type MotionName = 'fade-up' | 'fade-in'

type Options = {
	delay?: number
	threshold?: number
}

export function useMotionInView<T extends HTMLElement>(ref: RefObject<T>, motion: MotionName = 'fade-up', options?: Options) {
	useEffect(() => {
		const el = ref.current
		if (!el) return

		// initial state to avoid pop-in
		if (motion === 'fade-up') {
			el.style.opacity = '0'
			el.style.transform = 'translateY(6px)'
		} else {
			el.style.opacity = '0'
		}

		const threshold = options?.threshold ?? 0.15
		const io = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const keyframes = motion === 'fade-up' ? { opacity: 1, transform: 'translateY(0px)' } : { opacity: 1 }

						animate(el, keyframes, {
							duration: 0.45,
							delay: options?.delay ?? 0,
						})
						obs.unobserve(entry.target)
					}
				})
			},
			{ threshold },
		)

		io.observe(el)
		return () => io.disconnect()
	}, [ref, motion, options?.delay, options?.threshold])
}
