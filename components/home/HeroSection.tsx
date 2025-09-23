'use client'

import dynamic from 'next/dynamic'
import { Locale } from '@/i18n-config'

const MotionHero = dynamic(() => import('./MotionHero'), { ssr: false })

interface HeroSectionProps {
  finishedLoading: boolean
  lang: Locale
}

export default function HeroSection(props: HeroSectionProps) {
  return <MotionHero {...props} />
}
