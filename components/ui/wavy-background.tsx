'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { createNoise3D } from 'simplex-noise'

import { cn } from '@/lib/utils'

export const WavyBackground = ({
																 children,
																 className,
																 containerClassName,
																 colors = ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee'],
																 waveWidth = 50,
																 backgroundFill = 'black',
																 blur = 10,
																 speed = 'fast',
																 waveOpacity = 0.5,
																 ...props
															 }: {
	children?: React.ReactNode
	className?: string
	containerClassName?: string
	colors?: string[]
	waveWidth?: number
	backgroundFill?: string
	blur?: number
	speed?: 'slow' | 'fast'
	waveOpacity?: number
	[key: string]: any
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [isSafari, setIsSafari] = useState(false)

	const getSpeed = useCallback(() => {
		return speed === 'slow' ? 0.001 : 0.002
	}, [speed])

	useEffect(() => {
		const noise = createNoise3D()
		let w: number,
			h: number,
			nt = 0
		let ctx: CanvasRenderingContext2D | null
		let animationId: number

		const canvas = canvasRef.current
		if (!canvas) return

		ctx = canvas.getContext('2d')
		if (!ctx) return

		const drawWave = (n: number) => {
			if (!ctx) return
			nt += getSpeed()
			for (let i = 0; i < n; i++) {
				ctx.beginPath()
				ctx.lineWidth = waveWidth
				ctx.strokeStyle = colors[i % colors.length]
				for (let x = 0; x < w; x += 5) {
					const y = noise(x / 800, 0.3 * i, nt) * 100
					ctx.lineTo(x, y + h * 0.5)
				}
				ctx.stroke()
				ctx.closePath()
			}
		}

		const render = () => {
			if (!ctx) return
			ctx.fillStyle = backgroundFill
			ctx.globalAlpha = waveOpacity
			ctx.fillRect(0, 0, w, h)
			drawWave(5)
			animationId = requestAnimationFrame(render)
		}

		const init = () => {
			w = ctx!.canvas.width = window.innerWidth
			h = ctx!.canvas.height = window.innerHeight
			ctx!.filter = `blur(${blur}px)`
		}

		init()
		window.addEventListener('resize', init)
		render()

		return () => {
			cancelAnimationFrame(animationId)
			window.removeEventListener('resize', init)
		}
	}, [blur, backgroundFill, colors, getSpeed, waveOpacity, waveWidth])

	useEffect(() => {
		setIsSafari(typeof window !== 'undefined' && navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'))
	}, [])

	return (
		<div className={cn('flex h-screen flex-col items-center justify-center', containerClassName)}>
			<canvas
				className="absolute inset-0 z-0"
				ref={canvasRef}
				style={isSafari ? { filter: `blur(${blur}px)` } : {}}
			/>
			<div
				className={cn('relative z-10', className)}
				{...props}
			>
				{children}
			</div>
		</div>
	)
}
