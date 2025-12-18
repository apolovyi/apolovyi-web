'use client'

import { useRef } from 'react'

import { useHoverLiftMotion } from '@/components/shared/useHoverLiftMotion'

interface EducationItem {
	degree: string
	field: string
	institution: string
	year: number
	location: string
}

interface EducationCardProps {
	item: EducationItem
}

export function EducationCard({ item }: EducationCardProps) {
	const cardRef = useRef<HTMLDivElement>(null)
	useHoverLiftMotion(cardRef)

	return (
		<div
			ref={cardRef}
			className="group flex gap-4 rounded-lg border border-amber-200/50 bg-amber-50/50 p-4 transition-colors hover:border-amber-300/70 hover:bg-amber-50/80"
		>
			{/* Icon */}
			<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10">
				<svg
					className="h-6 w-6 text-amber-600"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					{/* Graduation cap */}
					<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
					<path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
				</svg>
			</div>

			{/* Content */}
			<div className="flex flex-col">
				<span className="font-heading text-text-primary text-base font-semibold">{item.degree}</span>
				<span className="font-body text-text-secondary text-sm">{item.field}</span>
				<div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
					<span className="font-tech text-amber-700">{item.institution}</span>
					<span className="text-neutral-medium-gray">·</span>
					<span className="font-tech text-neutral-medium-gray">{item.year}</span>
				</div>
				<span className="font-tech text-neutral-medium-gray mt-1 text-xs">{item.location}</span>
			</div>
		</div>
	)
}
