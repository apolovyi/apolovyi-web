'use client'

import type { ReactNode } from 'react'
import React from 'react'

import { AURORA_EFFECT_ANIMATED, AURORA_EFFECT_BASE, AURORA_EFFECT_RADIAL_MASK, cn } from '@/lib/utils'

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
	children: ReactNode
	showRadialGradient?: boolean
	animated?: boolean
}

export const AuroraBackground = ({ className, children, showRadialGradient = true, animated = true, ...props }: AuroraBackgroundProps) => {
	return (
		<div
			className={cn(
				'relative flex min-h-dvh',
				// "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-zinc-50  text-slate-950 dark:bg-zinc-900",
				className,
			)}
			{...props}
		>
			<div className="absolute inset-0 overflow-hidden">
				<div className={cn(AURORA_EFFECT_BASE, animated && AURORA_EFFECT_ANIMATED, showRadialGradient && AURORA_EFFECT_RADIAL_MASK)}></div>
			</div>
			{children}
		</div>
	)
}
