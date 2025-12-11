import React, { useState } from 'react'

import dynamic from 'next/dynamic'

import type { Locale } from '@/i18n-config'

import DesktopMenu from '@/components/header/menu/DesktopMenu'
import { HeaderContext } from '@/components/header/menu/HeaderContext'
import IconMenu from '@/components/header/menu/IconMenu'
import Logo from '@/components/header/menu/Logo'
import MobileMenu from '@/components/header/menu/MobileMenu'
import { useDictionary } from '@/components/shared/DictionaryContext'

import { useScrollDetection } from '@/lib/hooks'

interface HeaderProps {
	finishedLoading: boolean
	lang: Locale
}

const AnimatedHeader = dynamic(() => import('./AnimatedHeader'))

const useHeaderState = (finishedLoading: boolean, lang: Locale) => {
	const [showElement, setShowElement] = useState(true)
	const [rotate, setRotate] = useState(false)
	const { header } = useDictionary()

	return {
		rotate,
		setRotate,
		showElement,
		setShowElement,
		finishedLoading,
		headerTranslations: header,
		lang,
	}
}

const Header = ({ finishedLoading, lang }: HeaderProps) => {
	const isScrolled = useScrollDetection()
	const headerState = useHeaderState(finishedLoading, lang)

	const getHeaderClassName = () => {
		const baseClass =
			'fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between px-6 py-4 transition-all duration-300 ease-in-out bg-transparent'
		const scrollClass = isScrolled ? 'shadow-md backdrop-blur-md' : ''
		return `${baseClass} ${scrollClass}`
	}

	const headerInner = (
		<>
			<Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
			<div className="flex items-center space-x-4">
				<DesktopMenu lang={lang} />
				<IconMenu />
			</div>
		</>
	)

	return (
		<HeaderContext.Provider value={headerState}>
			<MobileMenu lang={lang} />
			<AnimatedHeader
				className={getHeaderClassName()}
				finishedLoading={finishedLoading}
			>
				{headerInner}
			</AnimatedHeader>
		</HeaderContext.Provider>
	)
}

export default Header
