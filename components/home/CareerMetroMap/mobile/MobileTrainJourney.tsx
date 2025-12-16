'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { stationIdToDictionaryKey } from '@/lib/career-data'
import { cn } from '@/lib/utils'

import { MobileStation } from './MobileStation'
import { MobileTrain } from './MobileTrain'
import { SwissScenery } from './SwissScenery'
import { TrackSVG, useStationPositions, useTrackPath } from './TrackSVG'
import { MOBILE_SVG } from './constants'

interface MobileTrainJourneyProps {
	className?: string
	activeStation?: string | null
	onStationSelect?: (dictionaryKey: string) => void
}

export function MobileTrainJourney({ className, activeStation: externalActiveStation, onStationSelect }: MobileTrainJourneyProps) {
	const [internalActiveStation, setInternalActiveStation] = useState<string | null>(null)
	const [scrollProgress, setScrollProgress] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)
	const stationPoints = useStationPositions()
	const trackPath = useTrackPath()

	// Use external state if provided, otherwise use internal
	const activeStation = externalActiveStation !== undefined ? externalActiveStation : internalActiveStation

	const handleStationSelect = (dictionaryKey: string) => {
		if (onStationSelect) {
			onStationSelect(dictionaryKey)
		} else {
			setInternalActiveStation(dictionaryKey)
		}
	}

	// Track scroll progress within the viewport
	const updateScrollProgress = useCallback(() => {
		if (!containerRef.current) return

		const rect = containerRef.current.getBoundingClientRect()
		const viewportHeight = window.innerHeight

		// Calculate how much of the container is visible and where
		// progress = 0 when container top is at viewport bottom
		// progress = 1 when container bottom is at viewport top
		const containerTop = rect.top
		const containerHeight = rect.height

		// Calculate progress based on container position relative to viewport
		// When container top enters viewport from bottom: progress starts increasing
		// When container bottom exits viewport from top: progress = 1
		const visibleTop = Math.max(0, viewportHeight - containerTop)
		const totalScrollRange = containerHeight + viewportHeight
		const progress = Math.min(1, Math.max(0, visibleTop / totalScrollRange))

		setScrollProgress(progress)
	}, [])

	useEffect(() => {
		window.addEventListener('scroll', updateScrollProgress, { passive: true })
		window.addEventListener('resize', updateScrollProgress, { passive: true })
		updateScrollProgress() // Initial calculation

		return () => {
			window.removeEventListener('scroll', updateScrollProgress)
			window.removeEventListener('resize', updateScrollProgress)
		}
	}, [updateScrollProgress])

	return (
		<div
			ref={containerRef}
			className={cn('overflow-x-hidden', className)}
		>
			<div className="relative w-full overflow-hidden">
				<svg
					viewBox={`0 0 ${MOBILE_SVG.viewBox.width} ${MOBILE_SVG.viewBox.height}`}
					className="h-auto w-full"
				>
					{/* Scenery background layer */}
					<SwissScenery scrollProgress={scrollProgress} />

					{/* Track layer */}
					<TrackSVG />

					{/* Stations layer */}
					{stationPoints.map((point, index) => {
						const dictionaryKey = stationIdToDictionaryKey(point.id)
						return (
							<MobileStation
								key={point.id}
								id={point.id}
								x={point.x}
								y={point.y}
								station={point.station}
								isActive={activeStation === dictionaryKey}
								onSelect={handleStationSelect}
								index={index}
							/>
						)
					})}

					{/* Train layer - on top */}
					<MobileTrain
						stationPoints={stationPoints}
						trackPath={trackPath}
						scrollProgress={scrollProgress}
					/>
				</svg>
			</div>
		</div>
	)
}
