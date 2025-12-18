'use client'

import { memo, useCallback, useRef } from 'react'

import type { Locale } from '@/i18n-config'
import { motion } from 'motion/react'

import LanguageSwitcher from '@/components/LanguageSwitcher'
import { scrollToSection, useHeaderContext } from '@/components/header/menu/HeaderContext'
import { useDictionary } from '@/components/shared/DictionaryContext'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { useHoverTapMotion } from '@/components/shared/useHoverTapMotion'

interface MobileMenuProps {
	lang: Locale
}

const MobileMenu = memo(function MobileMenu({ lang }: MobileMenuProps) {
	const { rotate, setRotate, setShowElement } = useHeaderContext()
	const { header } = useDictionary()

	const closeMenu = useCallback(() => {
		setRotate((prev) => !prev)
		setShowElement((prev) => !prev)
	}, [setRotate, setShowElement])

	const handleScroll = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
			e.preventDefault()
			scrollToSection(href)
			closeMenu()
		},
		[closeMenu],
	)

	const MotionLink = ({
		href,
		onClick,
		children,
	}: {
		href: string
		onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
		children: React.ReactNode
	}) => {
		const ref = useRef<HTMLAnchorElement>(null)
		useHoverTapMotion(ref)
		return (
			<a
				ref={ref}
				href={href}
				onClick={onClick}
				className="flex flex-col space-y-2 text-center"
			>
				{children}
			</a>
		)
	}
	const MotionExternal = ({ href, children }: { href: string; children: React.ReactNode }) => {
		const ref = useRef<HTMLAnchorElement>(null)
		useHoverTapMotion(ref)
		return (
			<a
				ref={ref}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className="border-accent-coral font-heading text-accent-coral hover:bg-accent-coral hover:bg-opacity-10 rounded-sm border px-5 py-2 text-xs transition-colors duration-300 sm:px-10 sm:py-4"
			>
				{children}
			</a>
		)
	}

	return (
		<motion.div
			initial={{ x: '100%' }}
			animate={rotate ? { x: '0' } : { x: '100%' }}
			transition={{ x: { duration: 0.4 } }}
			className="fixed z-20 flex h-screen w-full duration-300 md:hidden"
		>
			<div
				onClick={closeMenu}
				className="bg-background-primary bg-opacity-20 h-full w-1/4 backdrop-blur-xs hover:cursor-pointer"
			/>
			<div className="bg-background-primary font-body flex w-3/4 flex-col items-center justify-center">
				<div className="mt-4 flex items-center gap-4">
					<ThemeToggle />
					<LanguageSwitcher currentLang={lang} />
				</div>
				<div className="mt-10 flex flex-col items-center justify-center space-y-8">
					{header.menuItems.map((item) => (
						<MotionLink
							key={item.id}
							href={item.href}
							onClick={(e) => handleScroll(e, item.href)}
						>
							<span className="font-tech text-accent-coral text-xs">{item.id}.</span>
							<span className="font-body text-text-primary hover:text-accent-coral text-sm duration-300 hover:cursor-pointer sm:text-base">
								{item.name}
							</span>
						</MotionLink>
					))}
					<MotionExternal href={header.resumeButton.href}>{header.resumeButton.text}</MotionExternal>
				</div>
			</div>
		</motion.div>
	)
})

export default MobileMenu
