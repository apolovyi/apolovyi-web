'use client'

import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

import Lenis from 'lenis'

export default function SmoothScrollProvider({ children }: PropsWithChildren) {
	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.1,
			easing: (t: number) => 1 - Math.pow(1 - t, 2),
		})

		let rafId = 0
		const raf = (time: number) => {
			lenis.raf(time)
			rafId = requestAnimationFrame(raf)
		}
		rafId = requestAnimationFrame(raf)

		return () => {
			cancelAnimationFrame(rafId)
			lenis.destroy?.()
		}
	}, [])

	return <>{children}</>
}
