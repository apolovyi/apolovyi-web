'use client'

import { Fragment, useMemo } from 'react'

import { cn } from '@/lib/utils'

interface HighlightedTextProps {
	text: string
	terms: string[]
	className?: string
	highlightClassName?: string
	as?: 'p' | 'span' | 'div'
	/** Match whole words only (default: true for backward compatibility) */
	wholeWord?: boolean
}

/**
 * Highlights specified terms within text using React elements (no dangerouslySetInnerHTML)
 */
export function HighlightedText({
	text,
	terms,
	className,
	highlightClassName = 'font-tech text-accent-coral',
	as: Component = 'span',
	wholeWord = true,
}: HighlightedTextProps) {
	const parts = useMemo(() => {
		if (!terms.length) return [{ text, isHighlight: false }]

		// Create regex pattern for all terms (case insensitive)
		const escapedTerms = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
		const pattern = wholeWord ? new RegExp(`\\b(${escapedTerms})\\b`, 'gi') : new RegExp(`(${escapedTerms})`, 'gi')

		const result: { text: string; isHighlight: boolean }[] = []
		let lastIndex = 0
		let match

		while ((match = pattern.exec(text)) !== null) {
			// Add text before match
			if (match.index > lastIndex) {
				result.push({ text: text.slice(lastIndex, match.index), isHighlight: false })
			}
			// Add matched term
			result.push({ text: match[0], isHighlight: true })
			lastIndex = pattern.lastIndex
		}

		// Add remaining text
		if (lastIndex < text.length) {
			result.push({ text: text.slice(lastIndex), isHighlight: false })
		}

		return result
	}, [text, terms, wholeWord])

	return (
		<Component className={className}>
			{parts.map((part, i) =>
				part.isHighlight ? (
					<span
						key={i}
						className={cn(highlightClassName)}
					>
						{part.text}
					</span>
				) : (
					<Fragment key={i}>{part.text}</Fragment>
				),
			)}
		</Component>
	)
}
