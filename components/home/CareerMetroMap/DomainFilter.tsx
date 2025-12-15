'use client'

import { motion } from 'motion/react'

import type { DomainId } from '@/lib/career-data'

interface Domain {
	id: DomainId
	label: string
	icon: string
}

interface DomainFilterProps {
	domains: Domain[]
	activeDomain: DomainId | null
	onSelectDomain: (domain: DomainId | null) => void
}

export function DomainFilter({ domains, activeDomain, onSelectDomain }: DomainFilterProps) {
	return (
		<motion.div
			className="flex flex-wrap items-center gap-2"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 1.2, duration: 0.4 }}
		>
			<span className="font-tech text-[10px] uppercase tracking-wide text-text-secondary/60">Industry:</span>
			{domains.map((domain) => {
				const isActive = activeDomain === domain.id

				return (
					<button
						key={domain.id}
						onClick={() => onSelectDomain(isActive ? null : domain.id)}
						className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-tech text-[10px] transition-all ${
							isActive
								? 'bg-accent-coral/20 text-accent-coral'
								: activeDomain
									? 'bg-transparent text-text-secondary/40 hover:text-text-secondary/60'
									: 'bg-text-secondary/5 text-text-secondary/70 hover:bg-text-secondary/10'
						}`}
						aria-pressed={isActive}
						aria-label={isActive ? `Clear ${domain.label} filter` : `Filter by ${domain.label}`}
					>
						<span>{domain.icon}</span>
						<span className="uppercase tracking-wide">{domain.label}</span>
					</button>
				)
			})}
		</motion.div>
	)
}
