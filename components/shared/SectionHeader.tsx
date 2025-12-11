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
			className={`flex flex-row items-center font-heading ${className}`}
		>
			<ArrowIcon className="h-6 w-6 flex-none translate-y-[2px] text-accent-coral" />
			<div className="flex flex-row items-center space-x-2 whitespace-nowrap pr-2">
				<span className="font-tech text-xl text-accent-coral">{number}</span>
				<h2 className="px-2 font-heading text-lg font-bold tracking-wider text-text-primary opacity-85 md:text-2xl">{title}</h2>
			</div>
			<div className="h-[0.2px] w-full bg-accent-blue"></div>
		</header>
	)
}
