'use client'

import { Suspense, lazy, useEffect } from 'react'

import type { Locale } from '@/i18n-config'
import 'aos/dist/aos.css'

// Keep Header and SocialMediaAround eager; lazy-load below-the-fold sections
import Header from '@/components/header/Header'
import SocialMediaAround from '@/components/home/SocialMediaAround'
import { useAppContext } from '@/components/shared/AppContext'

const HeroSection = lazy(() => import('@/components/home/HeroSection'))
const AboutMe = lazy(() => import('@/components/home/AboutMe'))
const MyExperience = lazy(() => import('@/components/home/MyExperience'))
const MyProjects = lazy(() => import('@/components/home/MyProjects'))
const GetInTouch = lazy(() => import('@/components/home/GetInTouch'))
const Footer = lazy(() => import('@/components/footer/Footer'))

interface HomeClientProps {
	lang: Locale
}

export default function HomeClient({ lang }: HomeClientProps) {
	const { sharedState, setSharedState } = useAppContext()

	useEffect(() => {
		const timer = setTimeout(() => {
			setSharedState((prevState) => ({ ...prevState, finishedLoading: true }))
		}, 4940)
		return () => clearTimeout(timer)
	}, [setSharedState])

	return (
		<main className="relative w-full snap-mandatory bg-background-primary selection:bg-highlight">
			<Header
				finishedLoading={sharedState.finishedLoading}
				lang={lang}
			/>
			<Suspense fallback={null}>
				<HeroSection
					finishedLoading={sharedState.finishedLoading}
					lang={lang}
				/>
			</Suspense>
			<SocialMediaAround finishedLoading={sharedState.finishedLoading} />
			{sharedState.finishedLoading && (
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
