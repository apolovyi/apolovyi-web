import React from "react";
import Image from "next/image";
import ArrowIcon from "@/components/icons/ArrowIcon";

export default function AboutMe(props) {
  const technologies = [
    ["Java", "Kotlin", "Spring Boot", "React", "TypeScript"],
    ["AWS", "PostgreSQL", "Docker", "Jenkins", "GitLab"],
  ];
  return (
    <div id="aboutSection" data-aos="fade-up" className="flex snap-start flex-col items-center bg-primary py-20">
      <div className="flex w-full flex-col space-y-8 px-4 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[900px]">
        <div className="flex flex-row items-center">
          <div className="mr-4 flex flex-row items-center">
            <ArrowIcon className={"h-4 w-4 flex-none translate-y-[0.5px] text-secondary md:h-6 md:w-5"} />
            <span className="font-tech text-sm text-secondary sm:text-xl"> 01.</span>
            <span className="px-3 font-heading text-lg font-bold tracking-wider text-gray-200 opacity-85 md:text-2xl">
              About Me
            </span>
          </div>
          <div className="ml-4 h-[0.2px] w-full bg-gray-400 sm:w-72"></div>
        </div>

        <div className="flex w-full flex-col space-y-8 sm:space-x-2 md:flex-row md:space-x-8 md:space-y-0">
          <div className="w-full space-y-4 font-body text-sm sm:text-base md:w-7/12">
            <div className="font-body">
              <span className="text-gray-400">
                Hello! I&apos;m Artem Polovyi, a skilled Full-Stack Software Engineer with extensive experience in
                leading product and consulting companies. My expertise lies in designing and developing
                high-performance, scalable, and highly available applications.
              </span>
            </div>
            <div className="font-body">
              <span className="text-gray-400">
                I specialize in backend technologies (
                <span className="font-tech text-secondary">Spring Boot, Kotlin, Java</span>
                ), frontend development (<span className="font-tech text-secondary">React, JavaScript, TypeScript</span>
                ), DevOps (<span className="font-tech text-secondary">Jenkins, GitLab</span>
                ), and test automation. My experience includes working on projects for renowned companies like
                <span className="text-secondary"> Infineon</span> and <span className="text-secondary">Audi</span>,
                where I&apos;ve contributed to developing and maintaining high-traffic applications and optimizing
                system performance.
              </span>
            </div>
            <div className="font-body">
              <span className="text-gray-400">
                I have an agile mindset and extensive experience working in agile environments. My passion for
                continuous learning and problem-solving drives me to stay updated with the latest technologies and best
                practices in software development.
              </span>
            </div>
            <div className="tracking-wide">
              <span className="text-gray-400">Here are a few technologies I&apos;ve been working with recently:</span>
            </div>
            <div className="flex flex-row space-x-16 font-tech font-light">
              <div className="flex flex-row items-center space-x-2">
                <div className="flex flex-col space-y-4 text-sm sm:text-base">
                  {technologies[0].map((tech, index) => (
                    <div key={index} className="flex flex-row items-center space-x-2">
                      <ArrowIcon className={"h-3 w-3 text-secondary"} />
                      <span className="text-xs text-gray-400 sm:text-sm">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <div className="flex flex-col space-y-4 text-sm sm:text-base">
                  {technologies[1].map((tech, index) => (
                    <div key={index} className="flex flex-row items-center space-x-2">
                      <ArrowIcon className={"h-3 w-3 text-secondary"} />
                      <span className="text-xs text-gray-400 sm:text-sm">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Image in Desktop and Tablet */}
          <div className="group relative hidden md:block md:h-72 md:w-72 lg:h-96 lg:w-96">
            <div className="absolute h-5/6 w-5/6 translate-x-5 translate-y-5 rounded border-2 border-secondary duration-300 group-hover:translate-x-3 group-hover:translate-y-3"></div>
            <div className="absolute h-5/6 w-5/6 overflow-hidden rounded">
              <div className="absolute h-full w-full overflow-hidden rounded bg-secondary opacity-10 duration-300 group-hover:opacity-0"></div>
              <Image
                src={"/img/me-bg.jpg"}
                className={"rounded-lg object-contain"}
                alt="Artem Polovyi"
                // placeholder="blur"
                width={400}
                height={320}
              />
            </div>
          </div>
          {/* Image in Mobile */}
          <div className="relative flex h-48 w-full items-center justify-center md:hidden">
            <div className="absolute h-full w-48 translate-x-5 translate-y-5 rounded border-2 border-secondary"></div>
            <div className="absolute h-full w-48 overflow-hidden rounded">
              <Image
                src={"/img/me-bg.jpg"}
                className={"rounded-lg object-contain"}
                alt="Artem Polovyi"
                // placeholder="blur"
                width={400}
                height={320}
              />
            </div>
            <div className="absolute h-full w-48 overflow-hidden rounded bg-secondary opacity-10 md:opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
