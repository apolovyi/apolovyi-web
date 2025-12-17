'use client'

import type { ReactNode } from 'react'
import React from 'react'

import { cn } from '@/lib/utils'

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
				<div
					className={cn(
						`pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] invert filter will-change-transform [background-image:var(--aurora-bg-gradient),var(--aurora)] [background-position:50%_50%,50%_50%] [background-size:300%,_200%] after:absolute after:inset-0 after:mix-blend-difference after:content-[""] after:[background-image:var(--aurora-bg-gradient),var(--aurora)] after:[background-size:200%,_100%] dark:invert-0`,
						animated && 'after:animate-aurora',
						showRadialGradient && `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
					)}
				></div>
			</div>
			{children}
		</div>
	)
}
