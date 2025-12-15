'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

import { AdaptiveDpr, OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import type { MeshPhongMaterial, PerspectiveCamera } from 'three'
import { Color, Fog, Vector3 } from 'three'
import ThreeGlobe from 'three-globe'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

import { cn } from '@/lib/utils'

const RING_PROPAGATION_SPEED = 3
const cameraZ = 300

// Cache for globe.json to avoid re-fetching
let globeDataCache: { features: object[] } | null = null
let globeDataPromise: Promise<{ features: object[] } | null> | null = null

const fetchGlobeData = (): Promise<{ features: object[] } | null> => {
	if (globeDataCache) return Promise.resolve(globeDataCache)
	if (globeDataPromise) return globeDataPromise

	globeDataPromise = fetch('/globe.json')
		.then((res) => res.json())
		.then((data) => {
			globeDataCache = data
			return data
		})
		.catch(() => null)

	return globeDataPromise
}

// Preload globe data immediately when module loads
if (typeof window !== 'undefined') {
	void fetchGlobeData()
}

// Pre-computed Vector3 instances to avoid GC pressure
const LIGHT_POSITIONS = {
	directionalLeft: new Vector3(-400, 100, 400),
	directionalTop: new Vector3(-200, 500, 200),
} as const

type Position = {
	order: number
	startLat: number
	startLng: number
	endLat: number
	endLng: number
	arcAlt: number
	color: string
}

type GlobeConfig = {
	pointSize?: number
	globeColor?: string
	showAtmosphere?: boolean
	atmosphereColor?: string
	atmosphereAltitude?: number
	emissive?: string
	emissiveIntensity?: number
	shininess?: number
	polygonColor?: string
	ambientLight?: string
	directionalLeftLight?: string
	directionalTopLight?: string
	arcTime?: number
	arcLength?: number
	maxRings?: number
	initialPosition?: { lat: number; lng: number }
	autoRotate?: boolean
	autoRotateSpeed?: number
}

const defaultGlobeConfig: GlobeConfig = {
	pointSize: 1,
	globeColor: '#1e3a5f',
	showAtmosphere: true,
	atmosphereColor: '#5b8def',
	atmosphereAltitude: 0.15,
	emissive: '#1a4a7a',
	emissiveIntensity: 0.3,
	shininess: 0.7,
	polygonColor: 'rgba(255,255,255,0.85)',
	ambientLight: '#ffffff',
	directionalLeftLight: '#ffffff',
	directionalTopLight: '#ffffff',
	arcTime: 2000,
	arcLength: 0.9,
	maxRings: 3,
	initialPosition: { lat: 50, lng: 10 },
	autoRotate: true,
	autoRotateSpeed: -0.5,
}

interface WorldProps {
	globeConfig?: GlobeConfig
	data: Position[]
	controlsRef?: React.RefObject<OrbitControlsImpl | null>
}

function Globe({ globeConfig = defaultGlobeConfig, data, controlsRef }: WorldProps) {
	const globeRef = useRef<ThreeGlobe | null>(null)
	const { scene, camera } = useThree()
	const [globeReady, setGlobeReady] = useState(false)

	const mergedConfig = useMemo(() => ({ ...defaultGlobeConfig, ...globeConfig }), [globeConfig])

	// Initialize globe on mount
	useEffect(() => {
		if (!globeRef.current) {
			globeRef.current = new ThreeGlobe()
			setGlobeReady(true)
		}
	}, [])

	// Extract all unique points from the journey data
	const allPoints = useMemo(() => {
		const points: { lat: number; lng: number }[] = []
		data.forEach((arc) => {
			// Add start point
			if (!points.find((p) => p.lat === arc.startLat && p.lng === arc.startLng)) {
				points.push({ lat: arc.startLat, lng: arc.startLng })
			}
			// Add end point
			if (!points.find((p) => p.lat === arc.endLat && p.lng === arc.endLng)) {
				points.push({ lat: arc.endLat, lng: arc.endLng })
			}
		})
		return points
	}, [data])

	useEffect(() => {
		if (!globeRef.current || !globeReady) return

		const globe = globeRef.current

		void fetchGlobeData().then((countries) => {
			if (!globeRef.current || !countries) return
			globe
				.hexPolygonsData(countries.features)
				.hexPolygonResolution(3)
				.hexPolygonMargin(0.7)
				.showAtmosphere(mergedConfig.showAtmosphere!)
				.atmosphereColor(mergedConfig.atmosphereColor!)
				.atmosphereAltitude(mergedConfig.atmosphereAltitude!)
				.hexPolygonColor(() => mergedConfig.polygonColor!)
		})

		// Setup arc animations
		globe
			.arcsData(data)
			.arcStartLat((d) => (d as Position).startLat)
			.arcStartLng((d) => (d as Position).startLng)
			.arcEndLat((d) => (d as Position).endLat)
			.arcEndLng((d) => (d as Position).endLng)
			.arcColor((d: object) => (d as Position).color)
			.arcAltitude((d) => (d as Position).arcAlt)
			.arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])
			.arcDashLength(mergedConfig.arcLength!)
			.arcDashInitialGap((d) => (d as Position).order)
			.arcDashGap(15)
			.arcDashAnimateTime(mergedConfig.arcTime!)

		// Show all points permanently (start and end points of all arcs)
		globe
			.pointsData(allPoints)
			.pointColor(() => '#ff8080')
			.pointsMerge(true)
			.pointAltitude(0.01)
			.pointRadius(0.6)

		// Ring configuration
		globe
			.ringsData([])
			.ringColor(() => (t: number) => `rgba(255, 128, 128, ${1 - t})`)
			.ringMaxRadius(mergedConfig.maxRings!)
			.ringPropagationSpeed(RING_PROPAGATION_SPEED)
			.ringRepeatPeriod(0)
	}, [data, mergedConfig, globeReady, allPoints])

	useEffect(() => {
		if (!globeRef.current || !globeReady) return

		const globe = globeRef.current
		const globeMaterial = globe.globeMaterial() as MeshPhongMaterial
		globeMaterial.color = new Color(mergedConfig.globeColor!)
		globeMaterial.emissive = new Color(mergedConfig.emissive!)
		globeMaterial.emissiveIntensity = mergedConfig.emissiveIntensity!
		globeMaterial.shininess = mergedConfig.shininess!
	}, [mergedConfig, globeReady])

	// Ring pulse animations at arc endpoints
	useEffect(() => {
		if (!globeRef.current || !globeReady) return

		const arcTime = mergedConfig.arcTime!
		const arcLength = mergedConfig.arcLength!
		const timeouts: ReturnType<typeof setTimeout>[] = []

		// Schedule ring pulses for each arc
		data.forEach((arc) => {
			const arcDelay = arc.order * (arcTime / data.length)
			const arcDuration = arcTime * arcLength

			const timeout = setTimeout(() => {
				if (!globeRef.current) return
				const currentRings = (globeRef.current.ringsData() as { lat: number; lng: number }[]) || []
				globeRef.current.ringsData([...currentRings, { lat: arc.endLat, lng: arc.endLng }])

				setTimeout(() => {
					if (!globeRef.current) return
					const rings = (globeRef.current.ringsData() as { lat: number; lng: number }[]) || []
					globeRef.current.ringsData(rings.filter((r) => !(r.lat === arc.endLat && r.lng === arc.endLng)))
				}, 2000)
			}, arcDelay + arcDuration)

			timeouts.push(timeout)
		})

		// Repeat animation cycle
		const cycleTime = arcTime + 1000
		const cycleInterval = setInterval(() => {
			data.forEach((arc) => {
				const arcDelay = arc.order * (arcTime / data.length)
				const arcDuration = arcTime * arcLength

				const timeout = setTimeout(() => {
					if (!globeRef.current) return
					const currentRings = (globeRef.current.ringsData() as { lat: number; lng: number }[]) || []
					globeRef.current.ringsData([...currentRings, { lat: arc.endLat, lng: arc.endLng }])

					setTimeout(() => {
						if (!globeRef.current) return
						const rings = (globeRef.current.ringsData() as { lat: number; lng: number }[]) || []
						globeRef.current.ringsData(rings.filter((r) => !(r.lat === arc.endLat && r.lng === arc.endLng)))
					}, 2000)
				}, arcDelay + arcDuration)

				timeouts.push(timeout)
			})
		}, cycleTime)

		return () => {
			timeouts.forEach(clearTimeout)
			clearInterval(cycleInterval)
		}
	}, [data, mergedConfig.arcTime, mergedConfig.arcLength, globeReady])

	// Add globe to scene
	useEffect(() => {
		if (!globeRef.current || !globeReady) return
		scene.add(globeRef.current)
		return () => {
			if (globeRef.current) {
				scene.remove(globeRef.current)
			}
		}
	}, [scene, globeReady])

	useEffect(() => {
		// Lighter fog for better visibility - fades to light gray instead of black
		scene.fog = new Fog(0xf5f5f5, 500, 2500)
	}, [scene])

	useEffect(() => {
		const cam = camera as PerspectiveCamera
		if (mergedConfig.initialPosition) {
			const { lat, lng } = mergedConfig.initialPosition
			// Convert lat/lng to spherical coordinates
			// phi: angle from north pole (0 at north, PI at south)
			// theta: angle around equator (0 at prime meridian, positive eastward)
			const phi = (90 - lat) * (Math.PI / 180)
			const theta = (lng + 90) * (Math.PI / 180) // Offset to face the location
			cam.position.x = cameraZ * Math.sin(phi) * Math.cos(theta)
			cam.position.y = cameraZ * Math.cos(phi)
			cam.position.z = cameraZ * Math.sin(phi) * Math.sin(theta)
			cam.lookAt(0, 0, 0)
		}
	}, [camera, mergedConfig.initialPosition])

	return (
		<>
			<ambientLight
				color={mergedConfig.ambientLight}
				intensity={1.4}
			/>
			<directionalLight
				color={mergedConfig.directionalLeftLight}
				position={LIGHT_POSITIONS.directionalLeft}
				intensity={1.8}
			/>
			<directionalLight
				color={mergedConfig.directionalTopLight}
				position={LIGHT_POSITIONS.directionalTop}
				intensity={1.0}
			/>
			<OrbitControls
				ref={controlsRef}
				enablePan={false}
				enableZoom={false}
				autoRotate={mergedConfig.autoRotate}
				autoRotateSpeed={mergedConfig.autoRotateSpeed}
				minPolarAngle={Math.PI / 3.5}
				maxPolarAngle={Math.PI - Math.PI / 3}
				enableDamping={true}
				dampingFactor={0.05}
				rotateSpeed={0.5}
			/>
		</>
	)
}

interface GithubGlobeProps {
	className?: string
	config?: GlobeConfig
	interactive?: boolean
}

// Loading placeholder for the globe
function GlobePlaceholder() {
	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<div className="h-48 w-48 animate-pulse rounded-full bg-gradient-to-br from-slate-200 to-slate-300 opacity-50" />
		</div>
	)
}

// My journey around the world, ending in Zurich
// Using vibrant coral/red color that stands out against the blue globe
const journeyArcs: Position[] = [
	// Kyiv, Ukraine → Cologne, Germany
	{ order: 0, startLat: 50.45, startLng: 30.52, endLat: 50.94, endLng: 6.96, arcAlt: 0.1, color: '#ff8080' },
	// Cologne → Munich, Germany
	{ order: 1, startLat: 50.94, startLng: 6.96, endLat: 48.14, endLng: 11.58, arcAlt: 0.05, color: '#ff8080' },
	// Munich → Athens, Greece
	{ order: 2, startLat: 48.14, startLng: 11.58, endLat: 37.98, endLng: 23.73, arcAlt: 0.1, color: '#ff8080' },
	// Athens → Cairo, Egypt
	{ order: 3, startLat: 37.98, startLng: 23.73, endLat: 30.04, endLng: 31.24, arcAlt: 0.08, color: '#ff8080' },
	// Cairo → Cape Town, South Africa
	{ order: 4, startLat: 30.04, startLng: 31.24, endLat: -33.92, endLng: 18.42, arcAlt: 0.4, color: '#ff8080' },
	// Cape Town → Victoria Falls, Zimbabwe
	{ order: 5, startLat: -33.92, startLng: 18.42, endLat: -17.92, endLng: 25.85, arcAlt: 0.15, color: '#ff8080' },
	// Victoria Falls → Fiji
	{ order: 6, startLat: -17.92, startLng: 25.85, endLat: -17.77, endLng: 177.97, arcAlt: 0.5, color: '#ff8080' },
	// Fiji → Sydney, Australia
	{ order: 7, startLat: -17.77, startLng: 177.97, endLat: -33.87, endLng: 151.21, arcAlt: 0.2, color: '#ff8080' },
	// Sydney → Santiago, Chile
	{ order: 8, startLat: -33.87, startLng: 151.21, endLat: -33.45, endLng: -70.67, arcAlt: 0.5, color: '#ff8080' },
	// Santiago → Buenos Aires, Argentina
	{ order: 9, startLat: -33.45, startLng: -70.67, endLat: -34.6, endLng: -58.38, arcAlt: 0.1, color: '#ff8080' },
	// Buenos Aires → Bogota, Colombia
	{ order: 10, startLat: -34.6, startLng: -58.38, endLat: 4.71, endLng: -74.07, arcAlt: 0.3, color: '#ff8080' },
	// Bogota → Quito, Ecuador
	{ order: 11, startLat: 4.71, startLng: -74.07, endLat: -0.18, endLng: -78.47, arcAlt: 0.08, color: '#ff8080' },
	// Quito → Zurich, Switzerland (back home)
	{ order: 12, startLat: -0.18, startLng: -78.47, endLat: 47.37, endLng: 8.54, arcAlt: 0.5, color: '#ff8080' },
]

// Memoize the globe config to prevent re-renders
const staticGlobeConfig: GlobeConfig = {
	...defaultGlobeConfig,
	globeColor: '#2a4a6f', // Lighter navy blue
	atmosphereColor: '#f87171', // Soft coral/red glow
	atmosphereAltitude: 0.18, // More prominent atmosphere
	polygonColor: 'rgba(255, 255, 255, 0.75)', // Bright white countries
	emissive: '#1e3a5f', // Subtle blue inner glow
	emissiveIntensity: 0.25,
	shininess: 0.6,
	autoRotate: true,
}

export function GithubGlobe({ className, config, interactive = true }: GithubGlobeProps) {
	const controlsRef = useRef<OrbitControlsImpl | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [isVisible, setIsVisible] = useState(true)

	// Pause rendering when not visible
	useEffect(() => {
		if (!containerRef.current) return

		const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 })
		observer.observe(containerRef.current)
		return () => observer.disconnect()
	}, [])

	// Use refs to track hover/drag without causing re-renders
	const handleMouseEnter = () => {
		if (controlsRef.current) {
			controlsRef.current.autoRotate = false
		}
	}

	const handleMouseLeave = () => {
		if (controlsRef.current) {
			controlsRef.current.autoRotate = true
		}
	}

	const mergedConfig = useMemo(() => ({ ...staticGlobeConfig, ...config }), [config])

	return (
		<div
			ref={containerRef}
			className={cn('absolute inset-0', interactive && 'cursor-grab active:cursor-grabbing', className)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{ pointerEvents: interactive ? 'auto' : 'none' }}
		>
			<Suspense fallback={<GlobePlaceholder />}>
				<Canvas
					camera={{ position: [0, 0, cameraZ], fov: 50 }}
					frameloop={isVisible ? 'always' : 'never'}
					dpr={[1, 2]}
					performance={{ min: 0.5 }}
				>
					<AdaptiveDpr pixelated />
					<Globe
						globeConfig={mergedConfig}
						data={journeyArcs}
						controlsRef={controlsRef}
					/>
				</Canvas>
			</Suspense>
		</div>
	)
}
