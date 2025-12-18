'use client'

import React, { useEffect, useRef, useState } from 'react'

import dynamic from 'next/dynamic'

import type { Locale } from '@/i18n-config'
import { motion } from 'motion/react'

import { useDictionary } from '@/components/shared/DictionaryContext'
import { useHoverTapMotion } from '@/components/shared/useHoverTapMotion'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'

// Desktop: Globe (lazy, client-only)
const GithubGlobe = dynamic(() => import('@/components/ui/github-globe').then((m) => m.GithubGlobe), {
	ssr: false,
	loading: () => null,
})

// Mobile: Aurora effect (lazy, only loads on mobile)
const AuroraEffect = dynamic(
	() =>
		import('@/lib/utils').then((utils) => {
			const { AURORA_EFFECT_ANIMATED, AURORA_EFFECT_BASE, AURORA_EFFECT_RADIAL_MASK, cn } = utils
			// Return just the aurora effect div, not the full wrapper
			const AuroraEffectOnly = () => (
				<div className="absolute inset-0 overflow-hidden">
					<div className={cn(AURORA_EFFECT_BASE, AURORA_EFFECT_ANIMATED, AURORA_EFFECT_RADIAL_MASK)} />
				</div>
			)
			AuroraEffectOnly.displayName = 'AuroraEffectOnly'
			return { default: AuroraEffectOnly }
		}),
	{ ssr: false, loading: () => null },
)

interface AnimatedTextProps {
	delay: number
	children: React.ReactNode
	className?: string
	enabled?: boolean
	as?: 'div' | 'h1' | 'p'
}

const AnimatedText = ({ delay, children, className, enabled = true, as: Component = 'div' }: AnimatedTextProps) => {
	if (!enabled) return <Component className={className}>{children}</Component>
	return (
		<motion.div
			initial={{ y: 10, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ opacity: { delay, duration: 0.2 }, y: { delay, duration: 0.2 } }}
			className={className}
		>
			{Component === 'div' ? children : <Component>{children}</Component>}
		</motion.div>
	)
}

interface TypedRolesProps {
	roles: string[]
	suffix: string
	className?: string
	enabled?: boolean
	delay?: number
}

const TypedRoles = ({ roles, suffix, className, enabled = true, delay = 0 }: TypedRolesProps) => {
	const [roleIndex, setRoleIndex] = useState(0)
	const [displayText, setDisplayText] = useState('')
	const [isDeleting, setIsDeleting] = useState(false)
	const [isReady, setIsReady] = useState(false)

	// Wait for initial animation delay
	useEffect(() => {
		if (!enabled) {
			setIsReady(true)
			setDisplayText(roles[0])
			return
		}
		const timer = setTimeout(() => setIsReady(true), delay * 1000)
		return () => clearTimeout(timer)
	}, [delay, enabled, roles])

	useEffect(() => {
		if (!isReady || !enabled) return

		const currentRole = roles[roleIndex]
		const typeSpeed = 80
		const deleteSpeed = 40
		const pauseAfterType = 2000
		const pauseAfterDelete = 300

		let timeout: NodeJS.Timeout

		if (!isDeleting) {
			if (displayText.length < currentRole.length) {
				timeout = setTimeout(() => {
					setDisplayText(currentRole.slice(0, displayText.length + 1))
				}, typeSpeed)
			} else {
				timeout = setTimeout(() => setIsDeleting(true), pauseAfterType)
			}
		} else {
			if (displayText.length > 0) {
				timeout = setTimeout(() => {
					setDisplayText(displayText.slice(0, -1))
				}, deleteSpeed)
			} else {
				timeout = setTimeout(() => {
					setIsDeleting(false)
					setRoleIndex((prev) => (prev + 1) % roles.length)
				}, pauseAfterDelete)
			}
		}

		return () => clearTimeout(timeout)
	}, [displayText, isDeleting, roleIndex, roles, isReady, enabled])

	if (!enabled) {
		return (
			<span className={className}>
				<span className="block">{roles[0]}</span>
				<span className="block">{suffix}</span>
			</span>
		)
	}

	return (
		<span
			className={className}
			aria-live="polite"
			aria-atomic="true"
		>
			<span className="block min-h-[1.2em]">
				{displayText}
				<span
					className="text-accent-coral animate-pulse"
					aria-hidden="true"
				>
					|
				</span>
			</span>
			<span className="block">{suffix}</span>
		</span>
	)
}

interface MotionHeroProps {
	finishedLoading: boolean
	lang: Locale
}

export default function MotionHero({ finishedLoading, lang }: MotionHeroProps) {
	const ctaRef = useRef<HTMLButtonElement>(null)
	useHoverTapMotion(ctaRef)
	const baseDelay = 0
	const dictionary = useDictionary()
	const { heroSection } = dictionary
	const heroRoles = heroSection.roles
	// Extract location suffix from tagline (e.g., "in Zurich." from "Full-Stack Engineer in Zurich.")
	// Supports: "in" (en/de), "i" (ch), "у" (uk)
	const getTaglineSuffix = (tagline: string): string => {
		const patterns = [' in ', ' i ', ' у ']
		for (const pattern of patterns) {
			const idx = tagline.lastIndexOf(pattern)
			if (idx !== -1) {
				return tagline.slice(idx + 1) // +1 to skip leading space
			}
		}
		return '.'
	}
	const taglineSuffix = getTaglineSuffix(heroSection.tagline)

	// Defer heavy effects on mobile and respect reduced motion
	// Also wait for loading screen to complete before enabling animations
	const [effectsOn, setEffectsOn] = useState(true)
	const animationsEnabled = effectsOn && finishedLoading
	// Track animation key to force re-render on language change
	const [animationKey, setAnimationKey] = useState(0)

	// Reset animation when language changes
	useEffect(() => {
		setAnimationKey((prev) => prev + 1)
	}, [lang])

	useEffect(() => {
		if (typeof window === 'undefined') return
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (prefersReduced) {
			setEffectsOn(false)
		}
		// No mobile delay - LoadingScreen already provides the initial wait
	}, [])

	const highlightText = (text: string, terms: string[]) => {
		let highlightedText = text
		terms.forEach((term) => {
			const regex = new RegExp(`(${term})`, 'gi')
			highlightedText = highlightedText.replace(regex, '<span class="text-accent-coral">$1</span>')
		})
		return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />
	}

	const heroContent = (
		<div
			className="z-10"
			key={animationKey}
		>
			<TextGenerateEffect
				className="font-tech text-accent-coral tracking-wider lg:text-lg"
				words={heroSection.greeting}
				filter={animationsEnabled}
				duration={animationsEnabled ? 0.5 : 0.01}
			/>
			<AnimatedText
				delay={baseDelay + 0.2}
				className="font-heading text-text-primary mt-8 text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl"
				enabled={animationsEnabled}
				as="h1"
			>
				{heroSection.name}
			</AnimatedText>
			<AnimatedText
				delay={baseDelay + 0.4}
				className="font-sub-heading text-text-secondary mt-4 text-3xl font-light sm:text-4xl md:text-4xl lg:text-6xl"
				enabled={animationsEnabled}
			>
				<TypedRoles
					roles={heroRoles}
					suffix={taglineSuffix}
					enabled={animationsEnabled}
					delay={baseDelay + 0.6}
				/>
			</AnimatedText>
			<AnimatedText
				delay={baseDelay + 0.6}
				className="font-body text-text-secondary mt-10 max-w-sm text-base tracking-wider sm:max-w-md md:text-lg lg:max-w-lg lg:text-xl"
				enabled={animationsEnabled}
			>
				<p>{highlightText(heroSection.paragraphs[0], heroSection.highlightedTerms)}</p>
				<br />
				<p>{highlightText(heroSection.paragraphs[1], heroSection.highlightedTerms)}</p>
			</AnimatedText>
			<AnimatedText
				delay={baseDelay + 0.8}
				className="mt-12"
				enabled={animationsEnabled}
			>
				<a
					href={heroSection.resumeHref}
					target="_blank"
					rel="noreferrer"
				>
					<motion.button
						ref={ctaRef}
						className="group hover:shadow-accent-coral/25 dark:shadow-accent-coral/10 dark:hover:shadow-accent-coral/30 relative overflow-hidden rounded-md p-[2px] shadow-lg transition-shadow duration-300 hover:shadow-xl"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.98 }}
						transition={{ type: 'spring', stiffness: 400, damping: 17 }}
					>
						{/* Animated gradient background */}
						<div className="from-accent-blue via-accent-coral to-accent-blue absolute inset-0 animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r bg-[length:200%_100%]" />
						{/* Inner content */}
						<div className="bg-background-primary font-heading text-accent-coral relative rounded-[5px] px-8 py-3 transition-all duration-300 group-hover:bg-transparent group-hover:text-white">
							{heroSection.cta}
						</div>
					</motion.button>
				</a>
			</AnimatedText>
		</div>
	)

	const containerClass = 'mx-8 flex min-h-dvh flex-col justify-center pt-20 md:mx-28 lg:mx-32 xl:mx-56 2xl:mx-72 tall:pt-0'

	const heroWithContent = (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			animate={animationsEnabled ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
			transition={{ duration: 0.8, ease: 'easeInOut' }}
			className={`relative z-10 ${containerClass}`}
		>
			{heroContent}
		</motion.div>
	)

	// Single layout - CSS controls which background shows (no JS layout switching)
	return (
		<section className="bg-background-primary relative h-dvh overflow-hidden">
			{/* Desktop: Globe (hidden on mobile via CSS, lazy-loaded client-only) */}
			<div className="absolute top-1/2 right-[5%] z-[5] hidden h-[600px] w-[600px] -translate-y-1/2 min-[1800px]:right-[15%] min-[1800px]:h-[800px] min-[1800px]:w-[800px] lg:right-[2%] lg:block lg:h-[650px] lg:w-[650px] xl:right-[8%] xl:h-[700px] xl:w-[700px] 2xl:right-[12%] 2xl:h-[750px] 2xl:w-[750px]">
				<GithubGlobe />
			</div>

			{/* Desktop: Gradient overlay (hidden on mobile) */}
			<div className="via-background-primary/95 to-background-primary/10 from-background-primary pointer-events-none absolute inset-0 z-[1] hidden bg-gradient-to-r via-50% lg:block" />

			{/* Mobile: Aurora effect (hidden on desktop, lazy-loaded client-only) */}
			<div className="lg:hidden">
				<AuroraEffect />
			</div>

			{/* Hero content - same for both layouts */}
			<div className="pointer-events-none relative z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">{heroWithContent}</div>
		</section>
	)
}
