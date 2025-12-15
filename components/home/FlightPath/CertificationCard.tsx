'use client'

import { useRef } from 'react'

import { useHoverLiftMotion } from '@/components/shared/useHoverLiftMotion'

interface CertificationItem {
	name: string
	issuer: string
	year: number
	url?: string
}

interface CertificationCardProps {
	item: CertificationItem
}

export function CertificationCard({ item }: CertificationCardProps) {
	const cardRef = useRef<HTMLDivElement>(null)
	useHoverLiftMotion(cardRef)

	// Determine icon based on issuer
	const isAWS = item.issuer.toLowerCase().includes('aws') || item.issuer.toLowerCase().includes('amazon')

	const content = (
		<div
			ref={cardRef}
			className="group flex h-full flex-col rounded-lg border border-indigo-200/50 bg-indigo-50/50 p-4 transition-colors hover:border-indigo-300/70 hover:bg-indigo-50/80"
		>
			{/* Header with icon and year */}
			<div className="mb-3 flex items-start justify-between">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
					{isAWS ? (
						// AWS cloud icon
						<svg
							className="h-5 w-5 text-indigo-600"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.296.072-.583.16-.863.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.28-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.264-.168.312a.549.549 0 0 1-.32.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.415-.287-.806-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z" />
						</svg>
					) : (
						// Generic badge/certificate icon
						<svg
							className="h-5 w-5 text-indigo-600"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle
								cx="12"
								cy="8"
								r="6"
							/>
							<path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
						</svg>
					)}
				</div>
				<span className="rounded-full bg-indigo-500/10 px-2 py-1 font-tech text-xs text-indigo-700">{item.year}</span>
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col">
				<span className="font-heading text-sm font-semibold leading-tight text-text-primary">{item.name}</span>
				<span className="mt-1 font-tech text-xs text-indigo-600">{item.issuer}</span>
			</div>

			{/* External link indicator if URL exists */}
			{item.url && (
				<div className="mt-3 flex items-center gap-1 text-xs text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100">
					<span>View credential</span>
					<svg
						className="h-3 w-3"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
					</svg>
				</div>
			)}
		</div>
	)

	if (item.url) {
		return (
			<a
				href={item.url}
				target="_blank"
				rel="noopener noreferrer"
				className="block"
			>
				{content}
			</a>
		)
	}

	return content
}
