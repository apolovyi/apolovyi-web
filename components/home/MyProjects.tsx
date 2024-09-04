import React from 'react'

import Image from 'next/image'

import { Locale } from '@/i18n-config'

import ArrowIcon from '@/components/icons/ArrowIcon'
import ExternalLink from '@/components/icons/ExternalLink'

import { Project, getDictionary } from '@/lib/dictionary'

interface ProjectItemProps {
	project: Project
	index: number
}

const ProjectItem = ({ project, index }: ProjectItemProps) => {
	const isEven = index % 2 === 0

	return (
		<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-8">
			{/* Image */}
			<div className={`w-full lg:w-2/3 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
				<div className="relative overflow-hidden rounded-lg">
					<a
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src={project.image}
							alt={project.company}
							width={800}
							height={400}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							style={{
								objectFit: 'contain',
								objectPosition: 'center',
							}}
							className="h-auto w-full rounded-lg p-4"
							priority={false}
							quality={100}
							placeholder="blur"
							blurDataURL={project.placeholder}
						/>
						<div className="absolute inset-0 rounded-lg bg-background-primary p-4 opacity-10 transition-opacity duration-300 hover:opacity-0 md:opacity-45"></div>
					</a>
				</div>
			</div>

			{/* Content */}
			<div className={`mt-6 flex w-full flex-col lg:mt-0 lg:w-1/2 ${isEven ? 'lg:order-2 lg:items-end' : 'lg:order-1 lg:items-start'}`}>
				<span className="font-heading text-base font-light text-accent-coral">{project.category}</span>
				<a
					href={project.link}
					target="_blank"
					rel="noopener noreferrer"
					className="group"
				>
					<span className="font-sub-heading text-xl font-light text-text-primary transition-colors duration-300 group-hover:text-accent-coral">
						{project.company}
					</span>
				</a>
				<div className={`my-4 rounded-md bg-accent-green bg-opacity-85 px-6 py-10 shadow-xl ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
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
						href={project.link}
						target="_blank"
						rel="noreferrer"
						className="text-accent-coral hover:text-accent-green"
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

export default function MyProjects({ lang }: MyProjectsProps) {
	const dict = getDictionary(lang)
	const { projectsSection } = dict

	return (
		<section
			id="projectsSection"
			data-aos="fade-up"
			className="flex w-full flex-col space-y-12 px-4 py-32 sm:px-16 md:px-16 lg:px-24 xl:space-y-28 2xl:px-72"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<header
					data-aos="fade-up"
					className="mb-12 flex items-center"
				>
					<ArrowIcon className="h-6 w-6 flex-none translate-y-[2px] text-accent-coral" />
					<div className="ml-2 flex items-center space-x-2">
						<span className="font-tech text-xl text-accent-coral">03.</span>
						<h2 className="whitespace-nowrap font-heading text-lg font-bold tracking-wider text-text-primary opacity-85 md:text-2xl">
							{projectsSection.title}
						</h2>
					</div>
					<div className="ml-4 h-[0.2px] flex-grow bg-accent-green"></div>
				</header>

				<div className="space-y-20 lg:space-y-32">
					{projectsSection.projects.map((project, index) => (
						<div
							key={index}
							data-aos="fade-up"
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
