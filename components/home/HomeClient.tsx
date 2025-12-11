'use client'

import { Suspense, lazy, useEffect } from 'react'

import dynamic from 'next/dynamic'

import type { Locale } from '@/i18n-config'

// Keep Header and HeroSection eager; lazy-load below-the-fold sections
import Header from '@/components/header/Header'
import HeroSection from '@/components/home/HeroSection'
import { useAppContext } from '@/components/shared/AppContext'

const AboutMe = lazy(() => import('@/components/home/AboutMe'))
const MyExperience = lazy(() => import('@/components/home/MyExperience'))
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
		// Set finishedLoading after initial render to trigger animations
		const timer = window.setTimeout(() => {
			setSharedState((prev) => ({ ...prev, finishedLoading: true }))
		}, 100)
		return () => window.clearTimeout(timer)
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
			{/* Always render content for SEO - animations handled via useMotionInView */}
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
		</main>
	)
}
