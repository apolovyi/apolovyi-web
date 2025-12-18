'use client'

import { Suspense, lazy, useEffect } from 'react'

import dynamic from 'next/dynamic'

import type { Locale } from '@/i18n-config'

// Keep Header and HeroSection eager; lazy-load below-the-fold sections
import Header from '@/components/header/Header'
import HeroSection from '@/components/home/HeroSection'
import { useAppContext } from '@/components/shared/AppContext'
import CustomCursor from '@/components/shared/CustomCursor'
import ScrollProgressIndicator from '@/components/shared/ScrollProgressIndicator'

const AboutMe = lazy(() => import('@/components/home/AboutMe'))
const MyExperience = lazy(() => import('@/components/home/MyExperience'))
const FlightPath = lazy(() => import('@/components/home/FlightPath'))
const MyProjects = lazy(() => import('@/components/home/MyProjects'))
const GetInTouch = lazy(() => import('@/components/home/GetInTouch'))
const Footer = lazy(() => import('@/components/footer/Footer'))
const SocialMediaAround = dynamic(() => import('@/components/home/SocialMediaAround'))

interface HomeClientProps {
	lang: Locale
}

export default function HomeClient({ lang }: HomeClientProps) {
	const { sharedState, setSharedState } = useAppContext()

	useEffect(() => {
		// Wait for LoadingScreen to complete before triggering animations
		const handleLoadingComplete = () => {
			setSharedState((prev) => ({ ...prev, finishedLoading: true }))
		}

		window.addEventListener('loadingScreenComplete', handleLoadingComplete)
		return () => window.removeEventListener('loadingScreenComplete', handleLoadingComplete)
	}, [setSharedState])

	return (
		<>
			{/* Skip to content link for accessibility */}
			<a
				href="#main-content"
				className="focus:bg-accent-coral sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:px-4 focus:py-2 focus:text-white focus:outline-hidden"
			>
				Skip to main content
			</a>
			<CustomCursor />
			<ScrollProgressIndicator />
			<main
				id="main-content"
				className="bg-background-primary selection:bg-highlight relative w-full snap-mandatory"
			>
				<Header
					finishedLoading={sharedState.finishedLoading}
					lang={lang}
				/>
				<HeroSection
					finishedLoading={sharedState.finishedLoading}
					lang={lang}
				/>
				<SocialMediaAround finishedLoading={sharedState.finishedLoading} />
				{/* Always render content for SEO - animations handled via useMotionInView */}
				<Suspense fallback={null}>
					<AboutMe lang={lang} />
				</Suspense>
				<Suspense fallback={null}>
					<MyExperience />
				</Suspense>
				<Suspense fallback={null}>
					<FlightPath lang={lang} />
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
			</main>
		</>
	)
}
