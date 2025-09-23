'use client'

import {lazy, Suspense, useEffect, useState} from 'react'

import {Locale} from '@/i18n-config'
import Aos from 'aos'
import 'aos/dist/aos.css'

// Keep Header and SocialMediaAround eager; lazy-load below-the-fold sections
import Header from '@/components/header/Header'
import SocialMediaAround from '@/components/home/SocialMediaAround'

const HeroSection = lazy(() => import('@/components/home/HeroSection'))
const AboutMe = lazy(() => import('@/components/home/AboutMe'))
const MyExperience = lazy(() => import('@/components/home/MyExperience'))
const MyProjects = lazy(() => import('@/components/home/MyProjects'))
const GetInTouch = lazy(() => import('@/components/home/GetInTouch'))
const Footer = lazy(() => import('@/components/footer/Footer'))

import {useAppContext} from '@/components/shared/AppContext'

interface HomeClientProps {
  lang: Locale
}

export default function HomeClient({ lang }: HomeClientProps) {
  const {sharedState, setSharedState} = useAppContext()

  useEffect(() => {
    const timer = setTimeout(() => {
      setSharedState((prevState) => ({...prevState, finishedLoading: true}))
    }, 4940)
    return () => clearTimeout(timer)
  }, [setSharedState])

  useEffect(() => {
    Aos.init({duration: 1000, once: true})
  }, [])

  return (
    <main className="relative w-full snap-mandatory bg-background-primary selection:bg-highlight">
      <Header finishedLoading={sharedState.finishedLoading} lang={lang} />
      <Suspense fallback={null}>
        <HeroSection finishedLoading={sharedState.finishedLoading} lang={lang} />
      </Suspense>
      <SocialMediaAround finishedLoading={sharedState.finishedLoading} />
      {sharedState.finishedLoading && (
        <>
          <Suspense fallback={null}><AboutMe lang={lang} /></Suspense>
          <Suspense fallback={null}><MyExperience lang={lang} /></Suspense>
          <Suspense fallback={null}><MyProjects lang={lang} /></Suspense>
          <Suspense fallback={null}><GetInTouch lang={lang} /></Suspense>
          <Suspense fallback={null}><Footer lang={lang} /></Suspense>
        </>
      )}
    </main>
  )
}

