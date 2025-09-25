'use client'

import dynamic from 'next/dynamic'

import type { Locale } from '@/i18n-config'

import StaticHero from './StaticHero'

const IS_LH = process.env.NEXT_PUBLIC_LIGHTHOUSE === 'true'
const MotionHero = IS_LH ? null : dynamic(() => import('./MotionHero'), { ssr: true })

interface HeroSectionProps {
	finishedLoading: boolean
	lang: Locale
}

export default function HeroSection(props: HeroSectionProps) {
	return IS_LH ? <StaticHero {...props} /> : MotionHero ? <MotionHero {...props} /> : null
}
