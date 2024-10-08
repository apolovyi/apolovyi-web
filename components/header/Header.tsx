import React, { useState } from 'react'

import { Locale } from '@/i18n-config'
import { motion } from 'framer-motion'

import DesktopMenu from '@/components/header/menu/DesktopMenu'
import { HeaderContext } from '@/components/header/menu/HeaderContext'
import IconMenu from '@/components/header/menu/IconMenu'
import Logo from '@/components/header/menu/Logo'
import MobileMenu from '@/components/header/menu/MobileMenu'

import { getDictionary } from '@/lib/dictionary'
import { useScrollDetection } from '@/lib/hooks'

interface HeaderProps {
	finishedLoading: boolean
	lang: Locale
}

const useHeaderState = (finishedLoading: boolean, lang: Locale) => {
	const [showElement, setShowElement] = useState(true)
	const [rotate, setRotate] = useState(false)
	const dictionary = getDictionary(lang)
	const { header } = dictionary

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

	return (
		<HeaderContext.Provider value={headerState}>
			<MobileMenu lang={lang} />
			<motion.header
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ opacity: { delay: finishedLoading ? 0 : 4.9, duration: 0 } }}
				className={getHeaderClassName()}
			>
				<Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
				<div className="flex items-center space-x-4">
					<DesktopMenu lang={lang} />
					<IconMenu />
				</div>
			</motion.header>
		</HeaderContext.Provider>
	)
}

export default Header
