import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Shared aurora effect CSS classes.
 * Uses CSS variables defined in globals.css (--aurora, --aurora-bg-gradient).
 */
export const AURORA_EFFECT_BASE =
	'pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] invert filter will-change-transform [background-image:var(--aurora-bg-gradient),var(--aurora)] [background-position:50%_50%,50%_50%] [background-size:300%,_200%] after:absolute after:inset-0 after:mix-blend-difference after:content-[""] after:[background-image:var(--aurora-bg-gradient),var(--aurora)] after:[background-size:200%,_100%] dark:invert-0'

export const AURORA_EFFECT_ANIMATED = 'after:animate-aurora'

export const AURORA_EFFECT_RADIAL_MASK = '[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]'
