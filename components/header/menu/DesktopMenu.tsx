import React, { useCallback } from 'react'

import { Locale } from '@/i18n-config'
import { motion } from 'framer-motion'

import LanguageSwitcher from '@/components/LanguageSwitcher'
import { scrollToSection, useHeaderContext } from '@/components/header/menu/HeaderContext'
import { HoverUnderlineFromLeftToRight } from '@/components/shared/HoverAnimation'

import { getDictionary } from '@/lib/dictionary'

const containerVariants = {
	hidden: { opacity: 0 },
	visible: (finishedLoading: boolean) => ({
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: finishedLoading ? 0 : 5.4,
		},
	}),
}

const itemVariants = {
	hidden: { y: -20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring',
			duration: 0.8,
		},
	},
}

interface DesktopMenuProps {
	lang: Locale
}

function DesktopMenu({ lang }: DesktopMenuProps) {
	const { finishedLoading } = useHeaderContext()
	const dictionary = getDictionary(lang)
	const { header } = dictionary

	const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
		e.preventDefault()
		scrollToSection(href)
	}, [])

	return (
		<motion.nav
			className="hidden flex-row items-center space-x-4 font-tech text-xs md:flex lg:space-x-10 xl:text-lg 2xl:space-x-16"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			custom={finishedLoading}
		>
			{header.menuItems.map((item) => (
				<motion.div
					key={item.id}
					variants={itemVariants}
				>
					<a
						href={item.href}
						className="group duration-300"
						onClick={(e) => handleScroll(e, item.href)}
					>
						<HoverUnderlineFromLeftToRight className="bg-primary">
							<div className="flex items-center whitespace-nowrap">
								<span className="mr-2 text-accent-coral group-hover:text-accent-coral">&gt; {item.id}.</span>
								<span className="font-body text-sm text-text-primary transition-all xl:text-lg">{item.name}</span>
							</div>
						</HoverUnderlineFromLeftToRight>
					</a>
				</motion.div>
			))}
			<motion.div variants={itemVariants}>
				<a
					href={header.resumeButton.href}
					target="_blank"
					rel="noopener noreferrer"
					className="border-spacing-2 rounded-sm border border-accent-coral px-3 py-2 text-accent-coral transition-colors duration-300 hover:bg-accent-coral hover:bg-opacity-10"
				>
					{header.resumeButton.text}
				</a>
			</motion.div>
			<motion.div variants={itemVariants}>
				<LanguageSwitcher currentLang={lang} />
			</motion.div>
		</motion.nav>
	)
}

export default DesktopMenu
