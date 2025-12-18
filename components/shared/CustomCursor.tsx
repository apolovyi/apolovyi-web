'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { motion, useMotionValue, useSpring } from 'motion/react'

type CursorVariant = 'default' | 'link' | 'button' | 'text'

// Text input types that should show text cursor
const TEXT_INPUT_TYPES = ['text', 'email', 'password', 'search', 'tel', 'url', 'number']

export default function CustomCursor() {
	const cursorRef = useRef<HTMLDivElement>(null)
	const [variant, setVariant] = useState<CursorVariant>('default')
	// Start as null to avoid hydration mismatch - only render after client detection
	const [shouldRender, setShouldRender] = useState<boolean | null>(null)

	const cursorX = useMotionValue(-100)
	const cursorY = useMotionValue(-100)

	// High stiffness + high damping = fast response with minimal overshoot
	const springConfig = { damping: 50, stiffness: 1000, mass: 0.1 }
	const cursorXSpring = useSpring(cursorX, springConfig)
	const cursorYSpring = useSpring(cursorY, springConfig)

	const handleMouseEnter = useCallback(() => {}, [])
	const handleMouseLeave = useCallback(() => {
		cursorX.set(-100)
		cursorY.set(-100)
	}, [cursorX, cursorY])

	// Combined mouse handler for position and variant detection
	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			cursorX.set(e.clientX)
			cursorY.set(e.clientY)

			const target = e.target as HTMLElement
			if (!target) return

			// Check for links
			if (target.closest('a') || target.closest('[role="link"]')) {
				setVariant('link')
				return
			}

			// Check for buttons and non-text inputs
			if (
				target.closest('button') ||
				target.closest('[role="button"]') ||
				target.closest('input[type="submit"]') ||
				target.closest('input[type="checkbox"]') ||
				target.closest('input[type="radio"]') ||
				target.closest('select')
			) {
				setVariant('button')
				return
			}

			// Check for text inputs
			const inputEl = target.closest('input') as HTMLInputElement | null
			if (inputEl && TEXT_INPUT_TYPES.includes(inputEl.type)) {
				setVariant('text')
				return
			}
			if (target.closest('textarea') || target.closest('[contenteditable="true"]')) {
				setVariant('text')
				return
			}

			setVariant('default')
		},
		[cursorX, cursorY],
	)

	useEffect(() => {
		if (typeof window === 'undefined') return

		// Check for mobile/touch device and reduced motion
		const checkShouldRender = () => {
			const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
			const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches
			const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
			const isMobile = hasTouchScreen || isSmallScreen
			setShouldRender(!isMobile && !prefersReduced)
		}
		checkShouldRender()
		window.addEventListener('resize', checkShouldRender)

		return () => window.removeEventListener('resize', checkShouldRender)
	}, [])

	useEffect(() => {
		if (!shouldRender) return

		window.addEventListener('mousemove', handleMouseMove)
		document.body.addEventListener('mouseenter', handleMouseEnter)
		document.body.addEventListener('mouseleave', handleMouseLeave)

		// Hide default cursor
		document.body.style.cursor = 'none'

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			document.body.removeEventListener('mouseenter', handleMouseEnter)
			document.body.removeEventListener('mouseleave', handleMouseLeave)
			document.body.style.cursor = 'auto'
		}
	}, [shouldRender, handleMouseMove, handleMouseEnter, handleMouseLeave])

	// Memoize variants to avoid recreation on every render
	const variants = useMemo(
		() => ({
			default: {
				width: 12,
				height: 12,
				backgroundColor: 'rgba(232, 119, 100, 0.8)',
				borderRadius: '50%',
			},
			link: {
				width: 40,
				height: 40,
				backgroundColor: 'rgba(232, 119, 100, 0.2)',
				border: '2px solid rgba(232, 119, 100, 0.8)',
				borderRadius: '50%',
			},
			button: {
				width: 48,
				height: 48,
				backgroundColor: 'rgba(232, 119, 100, 0.15)',
				border: '2px solid rgba(232, 119, 100, 0.6)',
				borderRadius: '50%',
			},
			text: {
				width: 4,
				height: 24,
				backgroundColor: 'rgba(232, 119, 100, 0.8)',
				borderRadius: '2px',
			},
		}),
		[],
	)

	// Don't render until client detection complete, or on mobile/reduced motion
	if (!shouldRender) return null

	return (
		<motion.div
			ref={cursorRef}
			className="pointer-events-none fixed top-0 left-0 z-[9999]"
			style={{
				x: cursorXSpring,
				y: cursorYSpring,
				translateX: '-50%',
				translateY: '-50%',
			}}
			animate={variant}
			variants={variants}
			transition={{ type: 'spring', stiffness: 500, damping: 28 }}
			initial={false}
			aria-hidden="true"
		/>
	)
}
