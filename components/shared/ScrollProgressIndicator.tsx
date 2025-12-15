'use client'

import { useEffect, useState } from 'react'

import { motion, useScroll, useSpring } from 'motion/react'

const sections = [
	{ id: 'hero', label: 'Home', threshold: 0 },
	{ id: 'aboutSection', label: 'About', threshold: 0.15 },
	{ id: 'experienceSection', label: 'Experience', threshold: 0.35 },
	{ id: 'projectsSection', label: 'Projects', threshold: 0.6 },
	{ id: 'contactSection', label: 'Contact', threshold: 0.85 },
]

export default function ScrollProgressIndicator() {
	const { scrollYProgress } = useScroll()
	const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
	const [currentSection, setCurrentSection] = useState('')
	const [isHovered, setIsHovered] = useState(false)
	const [isVisible, setIsVisible] = useState(false)

	// Respect reduced motion preference
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return
		setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
	}, [])

	useEffect(() => {
		const unsubscribe = scrollYProgress.on('change', (latest) => {
			// Show indicator after scrolling past hero
			setIsVisible(latest > 0.05)

			// Determine current section
			for (let i = sections.length - 1; i >= 0; i--) {
				if (latest >= sections[i].threshold) {
					setCurrentSection(sections[i].label)
					break
				}
			}
		})
		return () => unsubscribe()
	}, [scrollYProgress])

	if (prefersReducedMotion || !isVisible) return null

	return (
		<div
			className="fixed left-0 right-0 top-0 z-50 h-1 bg-gray-200/30"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			role="progressbar"
			aria-valuenow={Math.round(scrollYProgress.get() * 100)}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label="Page scroll progress"
		>
			<motion.div
				className="h-full origin-left bg-gradient-to-r from-accent-coral to-primary"
				style={{ scaleX }}
			/>
			{/* Section label tooltip */}
			{isHovered && currentSection && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="absolute left-1/2 top-2 -translate-x-1/2 rounded bg-gray-900/90 px-2 py-1 font-tech text-xs text-white"
				>
					{currentSection}
				</motion.div>
			)}
		</div>
	)
}
