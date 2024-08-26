import React from "react";

import Image from "next/image";

import {Locale} from "@/i18n-config";

import ArrowIcon from "@/components/icons/ArrowIcon";

import {getDictionary} from "@/lib/dictionary";

const technologies = [
  ["Java", "Kotlin", "Spring Boot", "React", "TypeScript"],
  ["AWS", "PostgreSQL", "Docker", "Jenkins", "GitLab"],
];

interface AboutMeProps {
  lang: Locale;
}

type TechListProps = {
  techs: string[];
};

const TechList = ({ techs }: TechListProps) => (
  <ul className="flex flex-col space-y-2">
    {techs.map((tech) => (
      <li key={tech} className="flex items-center space-x-2">
        <ArrowIcon className="h-3 w-3 text-accent-coral" />
        <span className="text-base text-text-secondary md:text-lg">{tech}</span>
      </li>
    ))}
  </ul>
);

type SectionHeaderProps = {
  title: string;
};

const SectionHeader = ({ title }: SectionHeaderProps) => (
  <header data-aos="fade-up" className="flex flex-row items-center font-heading">
    <ArrowIcon className="h-6 w-6 flex-none translate-y-[2px] text-accent-coral" />
    <div className="flex flex-row items-center space-x-2 whitespace-nowrap pr-2">
      <span className="font-tech text-xl text-accent-coral">01.</span>
      <h2 className="px-2 font-heading text-lg font-bold tracking-wider text-text-primary opacity-85 md:text-2xl">
        {title}
      </h2>
    </div>
    <div className="h-[0.2px] w-full bg-accent-green"></div>
  </header>
);

const ProfileImage = () => (
  <div className="relative mx-auto h-60 w-60 sm:h-80 sm:w-80 ">
    <div className="group absolute inset-0">
      <div className="absolute h-full w-full translate-x-5 translate-y-5 rounded border-2 border-accent-coral transition-all duration-300 group-hover:translate-x-3 group-hover:translate-y-3"></div>
      <div className="absolute h-full w-full overflow-hidden rounded">
        <div className="absolute inset-0 bg-accent-coral opacity-10 transition-opacity duration-300 group-hover:opacity-0"></div>
        <Image
          src="/img/me-bg.jpg"
          alt="Artem Polovyi"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </div>
);

const AboutMe = ({ lang }: AboutMeProps) => {
  const { aboutMeSection } = getDictionary(lang);

  const highlightTerms = (text: string) => {
    let highlightedText = text;
    aboutMeSection.highlightedTerms.forEach((term) => {
      const regex = new RegExp(`\\b(${term})\\b`, "gi");
      highlightedText = highlightedText.replace(regex, '<span class="font-tech text-accent-coral">$1</span>');
    });
    return <p className="text-text-secondary" dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <section
      id="aboutSection"
      data-aos="fade-up"
      className="flex w-full flex-col space-y-12 bg-background-primary px-4 py-32 sm:px-16 md:px-16 lg:px-24 xl:space-y-28 2xl:px-72"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
        <SectionHeader title={aboutMeSection.title} />

        <div className="mt-8 flex flex-col items-start lg:flex-row lg:space-x-12">
          <div className="w-full lg:w-3/5">
            <div className="space-y-4 font-body text-base sm:text-lg">
              <p className="text-text-secondary">{aboutMeSection.paragraphs.intro}</p>
              {highlightTerms(aboutMeSection.paragraphs.specialization)}
              <p className="text-text-secondary">{aboutMeSection.paragraphs.mindset}</p>
              <p className="text-text-secondary">{aboutMeSection.paragraphs.technologies}</p>
              <div className="flex space-x-16 font-tech">
                {technologies.map((techList, index) => (
                  <TechList key={index} techs={techList} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 w-full lg:mt-0 lg:w-2/5">
            <ProfileImage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
