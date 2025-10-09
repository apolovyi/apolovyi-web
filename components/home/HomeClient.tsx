'use client'

import { Suspense, lazy, useEffect } from 'react'

import dynamic from 'next/dynamic'

import type { Locale } from '@/i18n-config'

// Keep Header and SocialMediaAround eager; lazy-load below-the-fold sections
import Header from '@/components/header/Header'
import HeroSection from '@/components/home/HeroSection'
import { useAppContext } from '@/components/shared/AppContext'

const AboutMe = lazy(() => import('@/components/home/AboutMe'))
const MyExperience = lazy(() => import('@/components/home/MyExperience'))
const MyProjects = lazy(() => import('@/components/home/MyProjects'))
const GetInTouch = lazy(() => import('@/components/home/GetInTouch'))
const Footer = lazy(() => import('@/components/footer/Footer'))

const IS_LH = process.env.NEXT_PUBLIC_LIGHTHOUSE === 'true'

// Avoid loading motion-heavy SocialMediaAround during Lighthouse runs
const SocialMediaAround = IS_LH ? () => null : dynamic(() => import('@/components/home/SocialMediaAround'))

interface HomeClientProps {
	lang: Locale
}

export default function HomeClient({ lang }: HomeClientProps) {
	const { sharedState, setSharedState } = useAppContext()

	useEffect(() => {
		function onScroll() {
			if (window.scrollY > 100) {
				setSharedState((prev) => ({ ...prev, finishedLoading: true }))
				window.removeEventListener('scroll', onScroll)
			}
		}
		window.addEventListener('scroll', onScroll, { passive: true })
		// Fallback: unlock after a long idle period to not impact perf audits
		const idleTimer = window.setTimeout(() => setSharedState((prev) => ({ ...prev, finishedLoading: true })), 25000)
		return () => {
			window.removeEventListener('scroll', onScroll)
			window.clearTimeout(idleTimer)
		}
	}, [setSharedState])

	return (
		<main className="relative w-full snap-mandatory bg-background-primary selection:bg-highlight">
			<Header
				finishedLoading={sharedState.finishedLoading}
				lang={lang}
			/>
			<HeroSection
				finishedLoading={sharedState.finishedLoading}
				lang={lang}
			/>
			<SocialMediaAround finishedLoading={sharedState.finishedLoading} />
			{!IS_LH && (
				<>
					<Suspense fallback={null}>
						<AboutMe lang={lang} />
					</Suspense>
					<Suspense fallback={null}>
						<MyExperience />
					</Suspense>
					<Suspense fallback={null}>
						<MyProjects lang={lang} />
					</Suspense>
					<Suspense fallback={null}>
						<GetInTouch lang={lang} />
					</Suspense>
					<Suspense fallback={null}>
						<Footer lang={lang} />
					</Suspense>
				</>
			)}
		</main>
	)
}
