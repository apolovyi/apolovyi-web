import React from "react";
import Image from "next/image";
import ArrowIcon from "../../../components/Icons/ArrowIcon";
export default function AboutMe(props) {
  const technologies = [
    ["Java", "Kotlin", "Spring Boot", "React", "TypeScript"],
    ["AWS", "PostgreSQL", "Docker", "Jenkins", "GitLab"],
  ];
  return (
      <div id="aboutSection" data-aos="fade-up" className="snap-start flex flex-col items-center py-20 bg-AAprimary">
        <div className="flex flex-col space-y-8 px-4 sm:px-0 w-full sm:w-[500px] md:w-[700px] lg:w-[900px]">
          <div className="flex flex-row items-center">
            <div className="flex flex-row items-center mr-4">
              <ArrowIcon className={"flex-none h-4 md:h-6 w-4 md:w-5 translate-y-[0.5px] text-AAsecondary"}/>
              <span className="text-AAsecondary font-Header text-sm sm:text-xl"> 01.</span>
              <span className="flex-none text-gray-200 opacity-85 font-bold tracking-wider text-lg sm:text-2xl pl-4">
              About Me
            </span>
            </div>
            <div className="bg-gray-400 h-[0.2px] w-full sm:w-72 ml-4"></div>
          </div>

          <div className="w-full flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 sm:space-x-2">
            <div className="w-full md:w-7/12 space-y-4 sm:text-base text-sm">
              <div className="font-Header">
              <span className="text-gray-400">
                Hello! I&apos;m Artem Polovyi, a skilled Full-Stack Software Engineer with extensive experience in leading product and consulting companies. My expertise lies in designing and developing high-performance, scalable, and highly available applications.
              </span>
              </div>
              <div className="font-Header">
              <span className="text-gray-400">
                I specialize in backend technologies (<span
                  className="text-AAsecondary">Spring Boot, Kotlin, Java</span>),
                frontend development (<span className="text-AAsecondary">React, JavaScript, TypeScript</span>),
                DevOps (<span className="text-AAsecondary">Jenkins, GitLab</span>), and test automation.
                My experience includes working on projects for renowned companies like
                <span className="text-AAsecondary"> Infineon</span> and <span className="text-AAsecondary">Audi</span>,
                where I&apos;ve contributed to developing and maintaining high-traffic applications and optimizing system performance.
              </span>
              </div>
              <div className="font-Header">
              <span className="text-gray-400">
                I have an agile mindset and extensive experience working in agile environments. My passion for continuous learning
                and problem-solving drives me to stay updated with the latest technologies and best practices in software development.
              </span>
              </div>
              <div className="font-Header tracking-wide">
              <span className="text-gray-400">
                Here are a few technologies I&apos;ve been working with recently:
              </span>
              </div>
              <div className="font-Header tracking-wide flex flex-row space-x-16">
                <div className="flex flex-row space-x-2 items-center">
                  <div className="flex flex-col space-y-4 sm:text-base text-sm">
                    {technologies[0].map((tech, index) => (
                        <div key={index} className="flex flex-row items-center space-x-2">
                          <ArrowIcon className={"h-3 w-3 text-AAsecondary"}/>
                          <span className="text-gray-400 sm:text-sm text-xs">{tech}</span>
                        </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row space-x-2 items-center">
                  <div className="flex flex-col space-y-4 sm:text-base text-sm">
                    {technologies[1].map((tech, index) => (
                        <div key={index} className="flex flex-row items-center space-x-2">
                          <ArrowIcon className={"h-3 w-3 text-AAsecondary"}/>
                          <span className="text-gray-400 sm:text-sm text-xs">{tech}</span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Image in Desktop and Tablet */}
            <div className="group relative lg:w-96 lg:h-96 md:w-72 md:h-72 md:block hidden">
              <div
                  className="group-hover:translate-x-3 group-hover:translate-y-3 duration-300 absolute w-5/6 h-5/6 border-2 border-AAsecondary translate-x-5 translate-y-5 rounded"></div>
              <div className="absolute w-5/6 h-5/6 rounded overflow-hidden">
                <div
                    className="absolute w-full h-full group-hover:opacity-0 bg-AAsecondary opacity-10 duration-300 rounded overflow-hidden"></div>
                <Image
                    src={"/img/me-bg.jpg"}
                    className={"object-contain rounded-lg"}
                    alt="Artem Polovyi"
                    width={400}
                    height={320}
                />
              </div>
            </div>
            {/* Image in Mobile */}
            <div className="relative w-full h-48 md:hidden flex justify-center items-center">
              <div
                  className="absolute w-48 h-full rounded translate-x-5 translate-y-5 border-2 border-AAsecondary"></div>
              <div className="absolute w-48 h-full rounded overflow-hidden">
                <Image
                    src={"/img/me-bg.jpg"}
                    className={"object-contain rounded-lg"}
                    alt="Artem Polovyi"
                    width={400}
                    height={320}
                />
              </div>
              <div
                  className="absolute w-48 h-full bg-AAsecondary opacity-10 md:opacity-60 rounded overflow-hidden"></div>
            </div>
          </div>
        </div>
      </div>
  );
}
