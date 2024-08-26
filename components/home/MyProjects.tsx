import React from "react";

import Image from "next/image";

import { Locale } from "@/i18n-config";

import ArrowIcon from "@/components/icons/ArrowIcon";
import ExternalLink from "@/components/icons/ExternalLink";

import { Project, getDictionary } from "@/lib/dictionary";

interface ProjectItemProps {
	project: Project;
	index: number;
}

const ProjectItem = ({ project, index }: ProjectItemProps) => {
	const isEven = index % 2 === 0;

	return (
		<div className="relative h-[600px] w-full sm:h-[500px]">
			{/* Image */}
			<div className={`absolute top-0 h-full w-full lg:w-2/3 ${isEven ? "lg:left-0" : "lg:right-0"}`}>
				<div className="relative h-full w-full overflow-hidden rounded-lg">
					<Image
						src={project.image}
						alt={project.company}
						width={800}
						height={400}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						style={{
							objectFit: "contain",
							objectPosition: "center",
						}}
						className="h-auto w-full rounded-lg p-4"
						priority={false}
						quality={100}
						placeholder="blur"
						blurDataURL={project.placeholder}
					/>
					<div className="absolute inset-0 rounded-lg p-1 opacity-70 transition-opacity duration-300 hover:opacity-0 lg:opacity-30"></div>
				</div>
			</div>

			{/* Content */}
			<div
				className={`absolute top-0 flex h-full w-full flex-col justify-center p-8 font-body lg:w-1/2 ${
					isEven ? "lg:right-0" : "lg:left-0"
				}`}
			>
				<div className={`flex flex-col ${isEven ? "lg:items-end" : "lg:items-start"}`}>
					<span className="font-heading text-base font-light text-accent-coral">{project.category}</span>
					<a href={project.link} target="_blank" rel="noopener noreferrer" className="group">
						<span className="font-sub-heading text-xl font-light text-text-primary transition-colors duration-300 group-hover:text-accent-coral">
							{project.company}
						</span>
					</a>
				</div>
				<div
					className={`my-4 rounded-md bg-accent-green bg-opacity-75 p-6 shadow-xl ${
						isEven ? "lg:text-right" : "lg:text-left"
					}`}
				>
					<p className="font-body text-base font-light text-neutral-light-gray md:text-lg">{project.description}</p>
				</div>
				<div className={`mb-4 font-heading text-base text-accent-coral ${isEven ? "lg:text-right" : "lg:text-left"}`}>
					Role: {project.role}
				</div>
				<div className={`w-full ${isEven ? "lg:flex lg:justify-end" : ""}`}>
					<ul
						className={`flex w-4/6 flex-wrap font-tech text-sm font-light text-text-primary ${
							isEven ? "lg:justify-end" : "lg:justify-start"
						}`}
					>
						{project.technologies.map((tech: string, techIndex: number) => (
							<li key={techIndex} className={`mb-2 mr-4 ${isEven ? "lg:ml-4 lg:mr-0" : ""}`}>
								{tech}
							</li>
						))}
					</ul>
				</div>
				<div className={`mt-4 flex ${isEven ? "lg:justify-end" : "lg:justify-start"}`}>
					<a href={project.link} target="_blank" rel="noreferrer" className="text-accent-coral hover:text-accent-green">
						<ExternalLink url={project.link} />
					</a>
				</div>
			</div>
		</div>
	);
};

interface MyProjectsProps {
	lang: Locale;
}

export default function MyProjects({ lang }: MyProjectsProps) {
	const dict = getDictionary(lang);
	const { projectsSection } = dict;

	return (
		<section
			id="projectsSection"
			className="flex w-full flex-col space-y-12 px-4 py-32 sm:px-16 md:px-16 lg:px-24 xl:space-y-28 2xl:px-72"
		>
			<div className="mx-auto flex w-full flex-col px-4 sm:px-6 lg:px-8">
				<header data-aos="fade-up" className="flex flex-row items-center font-heading">
					<ArrowIcon className="h-6 w-6 flex-none translate-y-[2px] text-accent-coral" />
					<div className="flex flex-row items-center space-x-2 whitespace-nowrap pr-2">
						<span className="font-tech text-xl text-accent-coral">03.</span>
						<h2 className="px-2 font-heading text-lg font-bold tracking-wider text-text-primary opacity-85 md:text-2xl">
							{projectsSection.title}
						</h2>
					</div>
					<div className="h-[0.2px] w-full bg-accent-green"></div>
				</header>
			</div>

			<div className="flex flex-col space-y-8 md:space-y-28 xl:space-y-36">
				{projectsSection.projects.map((project, index) => (
					<div key={index} data-aos="fade-up">
						<ProjectItem project={project} index={index} />
					</div>
				))}
			</div>
		</section>
	);
}
