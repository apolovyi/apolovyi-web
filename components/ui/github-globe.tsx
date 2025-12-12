'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import type { MeshPhongMaterial, PerspectiveCamera } from 'three'
import { Color, Fog, Vector3 } from 'three'
import ThreeGlobe from 'three-globe'

import { cn } from '@/lib/utils'

const RING_PROPAGATION_SPEED = 3
const cameraZ = 300

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
	pointLight?: string
	arcTime?: number
	arcLength?: number
	rings?: number
	maxRings?: number
	initialPosition?: { lat: number; lng: number }
	autoRotate?: boolean
	autoRotateSpeed?: number
}

const defaultGlobeConfig: GlobeConfig = {
	pointSize: 1,
	globeColor: '#1d072e',
	showAtmosphere: true,
	atmosphereColor: '#ffffff',
	atmosphereAltitude: 0.1,
	emissive: '#000000',
	emissiveIntensity: 0.1,
	shininess: 0.9,
	polygonColor: 'rgba(255,255,255,0.7)',
	ambientLight: '#ffffff',
	directionalLeftLight: '#ffffff',
	directionalTopLight: '#ffffff',
	pointLight: '#ffffff',
	arcTime: 2000,
	arcLength: 0.9,
	rings: 1,
	maxRings: 3,
	initialPosition: { lat: 50, lng: 10 },
	autoRotate: true,
	autoRotateSpeed: -1,
}

interface WorldProps {
	globeConfig?: GlobeConfig
	data: Position[]
}

function Globe({ globeConfig = defaultGlobeConfig, data }: WorldProps) {
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

		void fetch('/globe.json')
			.then((res) => res.json())
			.then((countries) => {
				if (!globeRef.current) return
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
			.pointColor(() => '#ff6b6b')
			.pointsMerge(true)
			.pointAltitude(0.007)
			.pointRadius(0.5)

		// Ring configuration - rings will be triggered separately
		globe
			.ringsData([])
			.ringColor(() => (t: number) => `rgba(255, 107, 107, ${1 - t})`)
			.ringMaxRadius(mergedConfig.maxRings!)
			.ringPropagationSpeed(RING_PROPAGATION_SPEED)
			.ringRepeatPeriod(0) // No repeat - we'll trigger manually
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

	// Trigger ring pulse at arc endpoints when arcs complete
	useEffect(() => {
		if (!globeRef.current || !globeReady) return

		const arcTime = mergedConfig.arcTime!
		const arcLength = mergedConfig.arcLength!
		const timeouts: ReturnType<typeof setTimeout>[] = []

		// Schedule ring pulses for each arc based on when they complete
		data.forEach((arc) => {
			// Calculate when this arc reaches its endpoint
			// Each arc has an order that determines its initial gap
			const arcDelay = arc.order * (arcTime / data.length)
			const arcDuration = arcTime * arcLength

			// Trigger pulse when arc reaches the end point
			const timeout = setTimeout(() => {
				if (!globeRef.current) return

				// Add ring at the end location
				const currentRings = (globeRef.current.ringsData() as { lat: number; lng: number }[]) || []
				globeRef.current.ringsData([...currentRings, { lat: arc.endLat, lng: arc.endLng }])

				// Remove the ring after it expands
				setTimeout(() => {
					if (!globeRef.current) return
					const rings = (globeRef.current.ringsData() as { lat: number; lng: number }[]) || []
					globeRef.current.ringsData(rings.filter((r) => !(r.lat === arc.endLat && r.lng === arc.endLng)))
				}, 2000)
			}, arcDelay + arcDuration)

			timeouts.push(timeout)
		})

		// Repeat the animation cycle
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
		scene.fog = new Fog(0x000000, 400, 2000)
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
				intensity={0.6}
			/>
			<directionalLight
				color={mergedConfig.directionalLeftLight}
				position={new Vector3(-400, 100, 400)}
			/>
			<directionalLight
				color={mergedConfig.directionalTopLight}
				position={new Vector3(-200, 500, 200)}
			/>
			<pointLight
				color={mergedConfig.pointLight}
				position={new Vector3(-200, 500, 200)}
				intensity={0.8}
			/>
			<OrbitControls
				enablePan={false}
				enableZoom={false}
				minDistance={cameraZ}
				maxDistance={cameraZ}
				autoRotate={mergedConfig.autoRotate}
				autoRotateSpeed={mergedConfig.autoRotateSpeed}
				minPolarAngle={Math.PI / 3.5}
				maxPolarAngle={Math.PI - Math.PI / 3}
			/>
		</>
	)
}

interface GithubGlobeProps {
	className?: string
	config?: GlobeConfig
}

// My journey around the world, ending in Zurich
const journeyArcs: Position[] = [
	// Kyiv, Ukraine → Cologne, Germany
	{ order: 0, startLat: 50.45, startLng: 30.52, endLat: 50.94, endLng: 6.96, arcAlt: 0.1, color: '#ff6b6b' },
	// Cologne → Munich, Germany
	{ order: 1, startLat: 50.94, startLng: 6.96, endLat: 48.14, endLng: 11.58, arcAlt: 0.05, color: '#ff6b6b' },
	// Munich → Athens, Greece
	{ order: 2, startLat: 48.14, startLng: 11.58, endLat: 37.98, endLng: 23.73, arcAlt: 0.1, color: '#ff6b6b' },
	// Athens → Cairo, Egypt
	{ order: 3, startLat: 37.98, startLng: 23.73, endLat: 30.04, endLng: 31.24, arcAlt: 0.08, color: '#ff6b6b' },
	// Cairo → Cape Town, South Africa
	{ order: 4, startLat: 30.04, startLng: 31.24, endLat: -33.92, endLng: 18.42, arcAlt: 0.4, color: '#ff6b6b' },
	// Cape Town → Victoria Falls, Zimbabwe
	{ order: 5, startLat: -33.92, startLng: 18.42, endLat: -17.92, endLng: 25.85, arcAlt: 0.15, color: '#ff6b6b' },
	// Victoria Falls → Fiji
	{ order: 6, startLat: -17.92, startLng: 25.85, endLat: -17.77, endLng: 177.97, arcAlt: 0.5, color: '#ff6b6b' },
	// Fiji → Sydney, Australia
	{ order: 7, startLat: -17.77, startLng: 177.97, endLat: -33.87, endLng: 151.21, arcAlt: 0.2, color: '#ff6b6b' },
	// Sydney → Santiago, Chile
	{ order: 8, startLat: -33.87, startLng: 151.21, endLat: -33.45, endLng: -70.67, arcAlt: 0.5, color: '#ff6b6b' },
	// Santiago → Buenos Aires, Argentina
	{ order: 9, startLat: -33.45, startLng: -70.67, endLat: -34.6, endLng: -58.38, arcAlt: 0.1, color: '#ff6b6b' },
	// Buenos Aires → Bogota, Colombia
	{ order: 10, startLat: -34.6, startLng: -58.38, endLat: 4.71, endLng: -74.07, arcAlt: 0.3, color: '#ff6b6b' },
	// Bogota → Quito, Ecuador
	{ order: 11, startLat: 4.71, startLng: -74.07, endLat: -0.18, endLng: -78.47, arcAlt: 0.08, color: '#ff6b6b' },
	// Quito → Zurich, Switzerland (back home)
	{ order: 12, startLat: -0.18, startLng: -78.47, endLat: 47.37, endLng: 8.54, arcAlt: 0.5, color: '#ff6b6b' },
]

export function GithubGlobe({ className, config }: GithubGlobeProps) {
	return (
		<div className={cn('absolute inset-0', className)}>
			<Canvas camera={{ position: [0, 0, cameraZ], fov: 50 }}>
				<Globe
					globeConfig={{
						...defaultGlobeConfig,
						globeColor: '#1a1a2e',
						atmosphereColor: '#c23b3b',
						polygonColor: 'rgba(194, 59, 59, 0.6)',
						emissive: '#000000',
						emissiveIntensity: 0.1,
						shininess: 0.9,
						...config,
					}}
					data={journeyArcs}
				/>
			</Canvas>
		</div>
	)
}
