import * as React from 'react'

import { cn } from '@/lib/utils'

interface HoverUnderlineProps {
	children: React.ReactNode
	className?: string
}

const HoverUnderlineFromCenterToSides = ({ children, className }: HoverUnderlineProps): JSX.Element => {
	return (
		<div className="group relative text-base uppercase leading-8 tracking-widest">
			{children}
			<span
				className={cn(
					'block h-0.5 max-w-full scale-x-0 transform transition-transform duration-500 before:origin-right hover:before:origin-left group-hover:scale-x-105',
					className,
				)}
			></span>
		</div>
	)
}

const HoverUnderlineFromLeftToRight = ({ children, className }: HoverUnderlineProps): JSX.Element => {
	return (
		<div className="group relative text-base uppercase leading-8 tracking-widest">
			{children}
			<span
				className={cn(
					'block h-0.5 max-w-full origin-left scale-x-0 transform transition-transform duration-500 ease-in-out group-hover:scale-x-100',
					className,
				)}
			></span>
		</div>
	)
}

export { HoverUnderlineFromCenterToSides, HoverUnderlineFromLeftToRight }
