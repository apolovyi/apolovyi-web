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
		import('@/components/ui/aurora-background').then((_m) => {
			// Return just the aurora effect div, not the full wrapper
			const AuroraEffectOnly = () => (
				<div className="absolute inset-0 overflow-hidden">
					<div className="pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] [background-image:var(--white-gradient),var(--aurora)] [background-position:50%_50%,50%_50%] [background-size:300%,_200%] [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)] after:absolute after:inset-0 after:animate-aurora after:mix-blend-difference after:content-[''] after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] dark:invert-0 dark:[background-image:var(--dark-gradient),var(--aurora)] after:dark:[background-image:var(--dark-gradient),var(--aurora)]" />
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
					className="animate-pulse text-accent-coral"
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
				className="font-tech tracking-wider text-accent-coral lg:text-lg"
				words={heroSection.greeting}
				filter={animationsEnabled}
				duration={animationsEnabled ? 0.5 : 0.01}
			/>
			<AnimatedText
				delay={baseDelay + 0.2}
				className="mt-8 font-heading text-3xl font-bold text-text-primary sm:text-5xl md:text-6xl lg:text-7xl"
				enabled={animationsEnabled}
				as="h1"
			>
				{heroSection.name}
			</AnimatedText>
			<AnimatedText
				delay={baseDelay + 0.4}
				className="mt-4 font-sub-heading text-3xl font-light text-text-secondary sm:text-4xl md:text-4xl lg:text-6xl"
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
				className="mt-10 max-w-sm font-body text-base tracking-wider text-text-secondary sm:max-w-md md:text-lg lg:max-w-lg lg:text-xl"
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
					<button
						ref={ctaRef}
						className="relative p-[2px]"
					>
						<div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-secondary" />
						<div className="group relative rounded-[6px] bg-white px-8 py-3 font-heading text-accent-coral transition duration-200 hover:bg-transparent hover:text-white">
							{heroSection.cta}
						</div>
					</button>
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
		<section className="relative h-dvh overflow-hidden bg-background-primary">
			{/* Desktop: Globe (hidden on mobile via CSS, lazy-loaded client-only) */}
			<div className="absolute right-[5%] top-1/2 z-[5] hidden h-[600px] w-[600px] -translate-y-1/2 lg:right-[2%] lg:block lg:h-[650px] lg:w-[650px] xl:right-[8%] xl:h-[700px] xl:w-[700px] 2xl:right-[12%] 2xl:h-[750px] 2xl:w-[750px] min-[1800px]:right-[15%] min-[1800px]:h-[800px] min-[1800px]:w-[800px]">
				<GithubGlobe />
			</div>

			{/* Desktop: Gradient overlay (hidden on mobile) */}
			<div className="via-background-primary/95 to-background-primary/10 pointer-events-none absolute inset-0 z-[1] hidden bg-gradient-to-r from-background-primary via-50% lg:block" />

			{/* Mobile: Aurora effect (hidden on desktop, lazy-loaded client-only) */}
			<div className="lg:hidden">
				<AuroraEffect />
			</div>

			{/* Hero content - same for both layouts */}
			<div className="pointer-events-none relative z-10 [&_a]:pointer-events-auto [&_button]:pointer-events-auto">{heroWithContent}</div>
		</section>
	)
}
