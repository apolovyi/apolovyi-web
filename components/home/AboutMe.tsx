import React from "react";
import Image from "next/image";
import ArrowIcon from "@/components/icons/ArrowIcon";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n-config";

const technologies = [
  ["Java", "Kotlin", "Spring Boot", "React", "TypeScript"],
  ["AWS", "PostgreSQL", "Docker", "Jenkins", "GitLab"],
];

type TechListProps = {
  techs: string[];
};

function TechList({ techs }: TechListProps) {
  return (
    <ul className="flex flex-col space-y-2">
      {techs.map((tech, index) => (
        <li key={index} className="flex items-center space-x-2">
          <ArrowIcon className="h-3 w-3 text-accent-coral" />
          <span className="text-base text-text-secondary md:text-lg">{tech}</span>
        </li>
      ))}
    </ul>
  );
}

interface AboutMeProps {
  lang: Locale;
}

interface AboutMeProps {
  lang: Locale;
}

function AboutMe({ lang }: AboutMeProps) {
  const dictionary = getDictionary(lang);
  const { aboutMeSection } = dictionary;

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
      className="flex snap-start flex-col items-center bg-background-primary py-20"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
        <header data-aos="fade-up" className="flex flex-row items-center font-heading">
          <ArrowIcon className="h-6 w-6 flex-none translate-y-[2px] text-accent-coral" />
          <div className="flex flex-row items-center space-x-2 whitespace-nowrap pr-2">
            <span className="font-tech text-xl text-accent-coral">{aboutMeSection.sectionNumber}</span>
            <h2 className="px-2 font-heading text-lg font-bold tracking-wider text-text-primary opacity-85 md:text-2xl">
              {aboutMeSection.title}
            </h2>
          </div>
          <div className="h-[0.2px] w-full bg-accent-green"></div>
        </header>

        <div className="mt-8 flex flex-col items-start lg:flex-row lg:space-x-12">
          <div className="w-full lg:w-3/5">
            <div className="space-y-4 font-body text-base sm:text-lg">
              <p className="text-text-secondary">{aboutMeSection.paragraphs.intro}</p>
              {highlightTerms(aboutMeSection.paragraphs.specialization)}
              <p className="text-text-secondary">{aboutMeSection.paragraphs.mindset}</p>
              <p className="text-text-secondary">{aboutMeSection.paragraphs.technologies}</p>
              <div className="flex space-x-16 font-tech">
                <TechList techs={technologies[0]} />
                <TechList techs={technologies[1]} />
              </div>
            </div>
          </div>
          <div className="mt-12 w-full lg:mt-0 lg:w-2/5">
            <div className="group relative hidden md:block md:h-72 md:w-72 lg:h-80 lg:w-80">
              <div className="absolute h-5/6 w-5/6 translate-x-5 translate-y-5 rounded border-2 border-accent-coral duration-300 group-hover:translate-x-3 group-hover:translate-y-3"></div>
              <div className="absolute h-5/6 w-5/6 overflow-hidden rounded">
                <div className="absolute h-full w-full overflow-hidden rounded bg-accent-coral opacity-10 duration-300 group-hover:opacity-0"></div>
                <Image
                  src="/img/me-bg.jpg"
                  className="rounded-lg object-contain"
                  alt="Artem Polovyi"
                  width={400}
                  height={320}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="relative flex h-48 w-full items-center justify-center md:hidden">
              <div className="absolute h-full w-48 translate-x-5 translate-y-5 rounded border-2 border-accent-coral"></div>
              <div className="absolute h-full w-48 overflow-hidden rounded">
                <Image
                  src="/img/me-bg.jpg"
                  className="rounded-lg object-contain"
                  alt="Artem Polovyi"
                  width={400}
                  height={320}
                  loading="lazy"
                />
              </div>
              <div className="absolute h-full w-48 overflow-hidden rounded bg-accent-coral opacity-10 md:opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutMe;
