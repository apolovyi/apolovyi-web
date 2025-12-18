import type { RefObject } from 'react'

import ArrowIcon from '@/components/icons/ArrowIcon'

interface SectionHeaderProps {
	number: string
	title: string
	headerRef?: RefObject<HTMLElement | null>
	className?: string
}

export default function SectionHeader({ number, title, headerRef, className = '' }: SectionHeaderProps) {
	return (
		<header
			ref={headerRef}
			className={`font-heading flex flex-row items-center ${className}`}
		>
			<ArrowIcon className="text-accent-coral h-6 w-6 flex-none translate-y-[2px]" />
			<div className="flex flex-row items-center space-x-2 pr-2 whitespace-nowrap">
				<span className="font-tech text-accent-coral text-xl">{number}</span>
				<h2 className="font-heading text-text-primary px-2 text-lg font-bold tracking-wider opacity-85 md:text-2xl">{title}</h2>
			</div>
			<div className="bg-accent-blue h-[0.2px] w-full"></div>
		</header>
	)
}
