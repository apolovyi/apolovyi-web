'use client'

import React, { useCallback, useRef } from 'react'

import type { Locale } from '@/i18n-config'
import type { Variants } from 'motion/react'
import { motion } from 'motion/react'

import LanguageSwitcher from '@/components/LanguageSwitcher'
import { scrollToSection, useHeaderContext } from '@/components/header/menu/HeaderContext'
import { useDictionary } from '@/components/shared/DictionaryContext'
import { HoverUnderlineFromLeftToRight } from '@/components/shared/HoverAnimation'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { useHoverTapMotion } from '@/components/shared/useHoverTapMotion'

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0,
		},
	},
}

const itemVariants: Variants = {
	hidden: { y: -20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			stiffness: 100,
			damping: 15,
		},
	},
}

interface DesktopMenuProps {
	lang: Locale
}

function DesktopMenu({ lang }: DesktopMenuProps) {
	const { finishedLoading } = useHeaderContext()
	const { header } = useDictionary()

	const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
		e.preventDefault()
		scrollToSection(href)
	}, [])

	const MotionLink = ({
		href,
		onClick,
		children,
	}: {
		href: string
		onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
		children: React.ReactNode
	}) => {
		const linkRef = useRef<HTMLAnchorElement>(null)
		useHoverTapMotion(linkRef)
		return (
			<a
				ref={linkRef}
				href={href}
				className="group duration-300"
				onClick={onClick}
			>
				{children}
			</a>
		)
	}

	const MotionExternal = ({ href, children }: { href: string; children: React.ReactNode }) => {
		const linkRef = useRef<HTMLAnchorElement>(null)
		useHoverTapMotion(linkRef)
		return (
			<a
				ref={linkRef}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className="border-accent-coral text-accent-coral hover:bg-accent-coral hover:bg-opacity-10 border-spacing-2 rounded-xs border px-3 py-2 transition-colors duration-300"
			>
				{children}
			</a>
		)
	}

	return (
		<motion.nav
			className="font-tech hidden flex-row items-center space-x-4 text-xs md:flex lg:space-x-10 xl:text-lg 2xl:space-x-16"
			variants={containerVariants}
			initial="hidden"
			animate={finishedLoading ? 'visible' : 'hidden'}
		>
			{header.menuItems.map((item) => (
				<motion.div
					key={item.id}
					variants={itemVariants}
				>
					<MotionLink
						href={item.href}
						onClick={(e) => handleScroll(e, item.href)}
					>
						<HoverUnderlineFromLeftToRight className="bg-primary">
							<div className="flex items-center whitespace-nowrap">
								<span className="text-accent-coral group-hover:text-accent-coral mr-2">&gt; {item.id}.</span>
								<span className="font-body text-text-primary text-sm transition-all xl:text-lg">{item.name}</span>
							</div>
						</HoverUnderlineFromLeftToRight>
					</MotionLink>
				</motion.div>
			))}
			<motion.div variants={itemVariants}>
				<MotionExternal href={header.resumeButton.href}>{header.resumeButton.text}</MotionExternal>
			</motion.div>
			<motion.div variants={itemVariants}>
				<ThemeToggle />
			</motion.div>
			<motion.div variants={itemVariants}>
				<LanguageSwitcher currentLang={lang} />
			</motion.div>
		</motion.nav>
	)
}

export default DesktopMenu
