import * as React from 'react'

import { cn } from '@/lib/utils'

interface HoverUnderlineProps {
	children: React.ReactNode
	className?: string
}

const HoverUnderlineFromCenterToSides = ({ children, className }: HoverUnderlineProps): React.ReactElement => {
	return (
		<div className="group relative text-base uppercase leading-8 tracking-widest">
			{children}
			<span
				className={cn(
					'block h-0.5 max-w-full origin-center scale-x-0 transform transition-transform duration-500 ease-in-out group-hover:scale-x-100',
					className,
				)}
			></span>
		</div>
	)
}

const HoverUnderlineFromLeftToRight = ({ children, className }: HoverUnderlineProps): React.ReactElement => {
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
