import React, { useEffect, useRef } from 'react'

import type { Locale } from '@/i18n-config'
import { animate } from 'motion'
import type { DOMKeyframesDefinition } from 'motion'

import ExternalLink from '@/components/icons/ExternalLink'
import { useDictionary } from '@/components/shared/DictionaryContext'
import SectionHeader from '@/components/shared/SectionHeader'
import { useHoverLiftMotion } from '@/components/shared/useHoverLiftMotion'
import { useHoverTapMotion } from '@/components/shared/useHoverTapMotion'
import { useMotionInView } from '@/components/shared/useMotionInView'

import type { Project } from '@/lib/dictionary.types'

interface ProjectItemProps {
	project: Project
	index: number
}

const ProjectItem = ({ project, index }: ProjectItemProps) => {
	const imgLinkRef = useRef<HTMLAnchorElement>(null)
	const titleLinkRef = useRef<HTMLAnchorElement>(null)
	const extLinkRef = useRef<HTMLAnchorElement>(null)
	const imgCardRef = useRef<HTMLDivElement>(null)
	const contentCardRef = useRef<HTMLDivElement>(null)
	const imgRef = useRef<HTMLImageElement>(null)
	useHoverTapMotion(imgLinkRef)
	useHoverTapMotion(titleLinkRef)
	useHoverTapMotion(extLinkRef)
	useHoverLiftMotion(imgCardRef)
	useHoverLiftMotion(contentCardRef)
	const isEven = index % 2 === 0
	useMotionInView(imgCardRef, isEven ? 'fade-right' : 'fade-left', { mode: 'toggle', threshold: 0.01, rootMargin: '0px 0px 20% 0px' })
	useMotionInView(contentCardRef, isEven ? 'fade-left' : 'fade-right', { mode: 'toggle', threshold: 0.01, rootMargin: '0px 0px 20% 0px' })

	// tiny GPU-friendly parallax for the image element
	useEffect(() => {
		const img = imgRef.current
		if (!img) return
		let raf = 0
		const max = 8 // px
		const update = () => {
			raf = 0
			const rect = img.getBoundingClientRect()
			const vh = window.innerHeight
			const center = rect.top + rect.height / 2
			const delta = center - vh / 2
			const y = Math.max(-max, Math.min(max, (delta / vh) * max))
			img.style.transform = `translateY(${y}px)`
		}
		const onScroll = () => {
			if (raf) return
			raf = requestAnimationFrame(update)
		}
		window.addEventListener('scroll', onScroll, { passive: true })
		update()
		return () => {
			window.removeEventListener('scroll', onScroll)
			if (raf) cancelAnimationFrame(raf)
			img.style.transform = ''
		}
	}, [])

	return (
		<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-8">
			{/* Image */}
			<div className={`w-full lg:w-2/3 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
				<div
					ref={imgCardRef}
					className="relative overflow-hidden rounded-lg"
				>
					<a
						ref={imgLinkRef}
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
					>
						<picture>
							<source
								srcSet={project.image.replace(/\.(png|jpg|jpeg)$/i, '.avif')}
								type="image/avif"
							/>
							<source
								srcSet={project.image.replace(/\.(png|jpg|jpeg)$/i, '.webp')}
								type="image/webp"
							/>
							<img
								ref={imgRef}
								src={project.image}
								alt={project.company}
								width={800}
								height={400}
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								loading="lazy"
								className="h-auto w-full rounded-lg object-contain object-center p-4 opacity-0"
								onLoad={(e) => animate(e.currentTarget as HTMLImageElement, { opacity: 1 } as DOMKeyframesDefinition, { duration: 0.35 })}
							/>
						</picture>
						<div className="absolute inset-0 rounded-lg bg-background-primary p-4 opacity-10 transition-opacity duration-300 hover:opacity-0 md:opacity-45"></div>
					</a>
				</div>
			</div>

			{/* Content */}
			<div className={`mt-6 flex w-full flex-col lg:mt-0 lg:w-1/2 ${isEven ? 'lg:order-2 lg:items-end' : 'lg:order-1 lg:items-start'}`}>
				<span className="font-heading text-base font-light text-accent-coral">{project.category}</span>
				<a
					ref={titleLinkRef}
					href={project.link}
					target="_blank"
					rel="noopener noreferrer"
					className="group"
				>
					<span className="font-sub-heading text-xl font-light text-text-primary transition-colors duration-300 group-hover:text-accent-coral">
						{project.company}
					</span>
				</a>
				<div
					ref={contentCardRef}
					className={`my-4 rounded-md bg-accent-blue bg-opacity-85 px-6 py-10 shadow-xl ${isEven ? 'lg:text-right' : 'lg:text-left'}`}
				>
					<p className="font-body text-base font-light text-neutral-light-gray xl:text-xl">{project.description}</p>
				</div>
				<div className={`mb-4 font-heading text-sm text-accent-coral lg:text-base ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
					Role: {project.role}
				</div>
				<ul
					className={`flex flex-wrap font-tech text-base font-light text-text-primary lg:text-lg ${
						isEven ? 'lg:justify-end' : 'lg:justify-start'
					}`}
				>
					{project.technologies.map((tech: string, techIndex: number) => (
						<li
							key={techIndex}
							className={`mb-2 mr-4 ${isEven ? 'lg:ml-4 lg:mr-0' : ''}`}
						>
							{tech}
						</li>
					))}
				</ul>
				<div className={`mt-4 flex ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}>
					<a
						ref={extLinkRef}
						href={project.link}
						target="_blank"
						rel="noreferrer"
						className="text-accent-coral hover:text-accent-blue"
					>
						<ExternalLink url={project.link} />
					</a>
				</div>
			</div>
		</div>
	)
}

interface MyProjectsProps {
	lang: Locale
}

export default function MyProjects({ lang: _lang }: MyProjectsProps) {
	const dict = useDictionary()
	const { projectsSection } = dict
	const sectionRef = useRef<HTMLElement>(null)
	const headerRef = useRef<HTMLElement>(null)
	useMotionInView(sectionRef, 'fade-up', { threshold: 0.01, rootMargin: '0px 0px 25% 0px' })
	useMotionInView(headerRef, 'fade-up', { threshold: 0.01, rootMargin: '0px 0px 25% 0px' })
	const itemRefs = useRef<Array<HTMLDivElement | null>>([])
	useEffect(() => {
		const items = itemRefs.current.filter(Boolean) as HTMLDivElement[]
		if (!items.length) return
		const observers: IntersectionObserver[] = []
		items.forEach((el, i) => {
			el.style.opacity = '0'
			el.style.transform = 'translateY(6px)'
			const io = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						const target = entry.target as HTMLElement
						if (entry.isIntersecting) {
							animate(target, { opacity: 1, transform: 'translateY(0px)' } as DOMKeyframesDefinition, {
								duration: 0.45,
								delay: i * 0.03,
							})
						} else {
							animate(target, { opacity: 0, transform: 'translateY(6px)' } as DOMKeyframesDefinition, {
								duration: 0.35,
							})
						}
					})
				},
				{ threshold: 0, rootMargin: '0px 0px 25% 0px' },
			)
			io.observe(el)
			observers.push(io)
		})
		return () => observers.forEach((o) => o.disconnect())
	}, [projectsSection.projects.length])

	return (
		<section
			ref={sectionRef}
			id="projectsSection"
			className="flex w-full flex-col space-y-12 px-4 py-32 sm:px-16 md:px-16 lg:px-24 xl:space-y-28 2xl:px-72"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<SectionHeader
					number="03."
					title={projectsSection.title}
					headerRef={headerRef}
					className="mb-12"
				/>

				<div className="space-y-20 lg:space-y-32">
					{projectsSection.projects.map((project, index) => (
						<div
							key={index}
							ref={(el) => {
								itemRefs.current[index] = el
							}}
						>
							<ProjectItem
								project={project}
								index={index}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
