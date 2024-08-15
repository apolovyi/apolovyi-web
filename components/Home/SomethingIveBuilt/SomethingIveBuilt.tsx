import Image from "next/image";
import ArrowIcon from "components/Icons/ArrowIcon";
import ExternalLink from "components/Icons/ExternalLink";
import { ProjectItemProps, projects } from "@/components/const/projects";

const ProjectItem = ({ project, index }: ProjectItemProps) => {
  const isEven = index % 2 === 0;

  return (
    <div className="relative h-[450px] w-full lg:h-96">
      {/* Image */}
      <div className={`absolute top-0 h-full w-full lg:w-2/3 ${isEven ? "lg:left-0" : "lg:right-0"}`}>
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
            className="p-4"
          />
          <div className="absolute inset-0 rounded-lg bg-AAprimary p-1 opacity-70 transition-opacity duration-300 hover:opacity-0 lg:opacity-30"></div>
        </div>
      </div>

      {/* Content */}
      <div
        className={`absolute top-0 h-full w-full font-body lg:w-1/2 ${
          isEven ? "lg:right-0" : "lg:left-0"
        } flex flex-col justify-center p-8`}
      >
        <div className={`flex flex-col ${isEven ? "lg:items-end" : "lg:items-start"}`}>
          <span className="font-heading text-base text-AAsecondary">{project.category}</span>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            <span className=" text-xl font-semibold text-gray-200 hover:text-AAsecondary">{project.title}</span>
          </a>
        </div>
        <div className={`my-4 rounded-md bg-AAtertiary p-6 shadow-lg ${isEven ? "lg:text-right" : "lg:text-left"}`}>
          <p className="text-xs text-gray-400 sm:text-sm md:text-lg">{project.description}</p>
        </div>
        <div className={`mb-4 text-sm text-AAsecondary ${isEven ? "lg:text-right" : "lg:text-left"}`}>
          Role: {project.role}
        </div>
        <div className={`w-full ${isEven ? "lg:flex lg:justify-end" : ""}`}>
          <ul
            className={`flex w-4/6 flex-wrap font-tech text-sm text-gray-200 ${
              isEven ? "lg:justify-end" : "lg:justify-start"
            }`}
          >
            {project.technologies.map((tech, techIndex) => (
              <li key={techIndex} className={`mb-2 mr-4 ${isEven ? "lg:ml-4 lg:mr-0" : ""}`}>
                {tech}
              </li>
            ))}
          </ul>
        </div>
        <div className={`flex ${isEven ? "lg:justify-end" : "lg:justify-start"} mt-4`}>
          <a href={project.link} target="_blank" rel="noreferrer">
            <ExternalLink url={project.link} />
          </a>
        </div>
      </div>
    </div>
  );
};

const SomethingIveBuilt = () => {
  return (
    <div
      id="SomethingIveBuiltSection"
      className="flex w-full flex-col space-y-12 bg-AAprimary px-4 py-32 sm:px-16 md:px-16 lg:px-24 xl:space-y-28 2xl:px-72"
    >
      {/* Title */}
      <div data-aos="fade-up" className="flex flex-row items-center font-heading md:px-0">
        <ArrowIcon className={"h-5 w-5 flex-none translate-y-[2px] text-AAsecondary md:h-6 md:w-5"} />
        <div className="flex-none flex-row items-center space-x-2 pr-2">
          <span className="font-tech text-sm text-AAsecondary sm:text-xl"> 03.</span>
          <span className="px-3 font-heading text-lg font-bold tracking-wider text-gray-200 opacity-85 md:text-2xl">
            Some Things I&apos;ve Built
          </span>
        </div>
        <div className="h-[0.2px] w-full bg-gray-400 md:w-1/2 xl:w-1/3"></div>
      </div>

      <div className="flex flex-col space-y-8 md:space-y-28 xl:space-y-36">
        {projects.map((project, index) => (
          <div key={index} data-aos="fade-up">
            <ProjectItem project={project} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SomethingIveBuilt;
