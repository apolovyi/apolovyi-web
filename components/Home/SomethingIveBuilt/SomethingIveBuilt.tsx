import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import ArrowIcon from "../../Icons/ArrowIcon";
import ExternalLink from "../../Icons/ExternalLink";

export default function SomethingIveBuilt() {
  const router = useRouter();

  const projects = [
    // {
    //     category: "E-commerce Development",
    //     title: "The Bicester Collection",
    //     description: "Led the development of a cutting-edge e-commerce platform for a prestigious luxury brand collective in New York City. Implemented headless CMS architecture for enhanced content flexibility and optimized site performance. Focused on SEO optimization to increase visibility and organic traffic.",
    //     image: "/img/projects/bicester-collection.png",
    //     link: "https://www.thebicestercollection.com",
    //     role: "Full-Stack Developer",
    //     technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity", "Vercel"],
    // },
    {
      category: "Enterprise Web Development",
      title: "Infineon Technologies",
      description:
        "Developed and maintained features on infineon.com to optimize user experience and functionality. Designed and conducted comprehensive unit and integration tests to increase software reliability. Utilized a wide range of technologies to deliver high-quality web solutions.",
      image: "/img/projects/infineon.png",
      link: "https://www.infineon.com",
      role: "Senior Full-Stack Engineer",
      technologies: [
        "JavaEE",
        "Spring",
        "OpenCMS",
        "JUnit",
        "TypeScript",
        "React",
        "AWS",
      ],
    },
    {
      category: "Cloud Migration & Optimization",
      title: "voestalpine AG",
      description:
        "Successfully migrated voestalpine.com to the AWS cloud, significantly enhancing scalability and performance. Implemented advanced features using Java and Spring, while optimizing database operations with PostgreSQL. Leveraged various AWS services to ensure robust and efficient cloud infrastructure.",
      image: "/img/projects/voestalpine.png",
      link: "https://www.voestalpine.com",
      role: "Cloud Migration Specialist",
      technologies: [
        "JavaEE",
        "Spring",
        "OpenCMS",
        "AWS",
        "MySQL",
        "Oracle",
        "React",
        "CloudFormation",
      ],
    },
    {
      category: "Financial Technology",
      title: "Spreadshirt Payout System",
      description:
        "Developed a high-performance application for payout generation, significantly improving financial operations. Created intuitive user interfaces to enhance user experience and application usability. Implemented robust backend logic to ensure accurate and timely payouts.",
      image: "/img/projects/spreadshirt.png",
      link: "https://www.spreadshirt.com",
      role: "Senior Full-Stack Engineer",
      technologies: [
        "Kotlin",
        "Spring Boot",
        "PostgreSQL",
        "Flyway",
        "JUnit",
        "TypeScript",
        "React",
      ],
    },
    {
      category: "Car Rental Platform",
      title: "ABI Audi On Demand",
      description:
        "Collaborated in a Scrum team to optimize pricing, voucher management, and communication systems for the ABI Audi On Demand product. Developed and maintained multiple microservices and microfrontends handling loads of up to 200 QPS. Refactored code using Kotlin, increasing maintainability and reducing code lines by 30%.",
      image: "/img/projects/aod.png",
      link: "https://www.audi.com",
      role: "Full-Stack Engineer",
      technologies: [
        "Kotlin",
        "Spring Boot",
        "RabbitMQ",
        "Angular",
        "TypeScript",
        "Jenkins",
        "AWS",
      ],
    },
    {
      category: "Travel & Lifestyle",
      title: "Turkey Nomad",
      description:
        "Developed a comprehensive platform for digital nomads in Turkey, featuring a travel blog and curated recommendations. This project showcases modern web development techniques and content management integration. The site offers valuable insights and resources for remote workers and travelers exploring Turkey.",
      image: "/img/projects/turkey-nomad.png",
      link: "https://turkeynomad.com",
      role: "Lead Full-Stack Developer",
      technologies: ["Next.js", "TypeScript", "Strapi CMS", "Vercel"],
    },
    {
      category: "Travel Technology",
      title: "blookery",
      description:
        "Developed the front-end of an innovative travel website specializing in blind bookings across Europe. Engineered responsive and intuitive user interfaces using React, ensuring seamless functionality across various devices and screen sizes. Implemented advanced JavaScript features to create dynamic and interactive elements, significantly improving user interaction and site navigation.",
      image: "/img/projects/blookery.png",
      link: "https://www.blookery.de",
      role: "Frontend Engineer",
      technologies: ["React", "JavaScript", "HTML", "CSS", "Jest"],
    },
    // {
    //     category: "Volunteer Project",
    //     title: "SmartDorm",
    //     description: "Developed a web application to streamline and automate management processes in the student dormitory Geschwister Scholl. Migrated and consolidated data into a central database to ensure 100% data consistency. Reduced administrative work by 35% through digitalization and automation. Implemented a CI/CD pipeline to optimize the development process.",
    //     image: "/img/projects/blookery.png",
    //     link: "https://smartdorm.schollheim.net",
    //     role: "Lead Full-Stack Developer (Volunteer)",
    //     technologies: ["PostgreSQL", "Kotlin", "Spring Boot", "React", "GitLab"],
    // }
    {
      category: "Car Rental Platform",
      title: "Billiger Mietwagen",
      description:
        "As a student developer, contributed to a leading car rental platform, significantly improving user experience. Implemented A/B tests to optimize product specifications and enhance conversion rates. Conducted thorough testing in each product iteration to ensure high-quality releases. Created internal tools for the customer service team, increasing efficiency by 50%.",
      image: "/img/projects/billiger-mietwagen.png",
      link: "https://www.billiger-mietwagen.de",
      role: "Student Full-Stack Developer",
      technologies: [
        "JavaScript",
        "HTML",
        "CSS",
        "jQuery",
        "PHP",
        "Optimizely",
      ],
    },
  ];

  return (
    <div
      id="SomethingIveBuiltSection"
      className="flex w-full flex-col space-y-12 bg-AAprimary px-4 py-32 sm:px-16 md:px-16 lg:px-24 xl:space-y-28 2xl:px-72"
    >
      {/* Title */}
      <div data-aos="fade-up" className="flex flex-row items-center md:px-0">
        <ArrowIcon
          className={
            "h-5 w-5 flex-none translate-y-[2px] text-AAsecondary md:h-6 md:w-5"
          }
        />
        <div className="flex-none flex-row items-center space-x-2 pr-2">
          <span className="font-sans text-sm text-AAsecondary sm:text-xl">
            {" "}
            03.
          </span>
          <span className="w-44 text-lg font-bold tracking-wider text-gray-200 opacity-85 md:w-56 md:text-2xl">
            Some Things I&apos;ve Built
          </span>
        </div>
        <div className="h-[0.2px] w-full bg-gray-400 md:w-1/2 xl:w-1/3"></div>
      </div>

      <div className="flex flex-col space-y-8 md:space-y-28 xl:space-y-36">
        {projects.map((project, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className="relative h-[450px] w-full lg:h-96"
          >
            {/* Image */}
            <div
              className={`absolute top-0 h-full w-full lg:w-2/3 ${
                index % 2 === 0 ? "lg:left-0" : "lg:right-0"
              }`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-lg">
                <Image
                  src={project.image}
                  alt={project.title}
                  // placeholder="blur"
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
              className={`absolute top-0 h-full w-full lg:w-1/2 ${
                index % 2 === 0 ? "lg:right-0" : "lg:left-0"
              } flex flex-col justify-center p-8`}
            >
              <div
                className={`flex flex-col space-y-1 ${
                  index % 2 === 0 ? "lg:items-end" : "lg:items-start"
                }`}
              >
                <span className="text-base text-AAsecondary">
                  {project.category}
                </span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-xl font-bold text-gray-200 hover:text-AAsecondary">
                    {project.title}
                  </span>
                </a>
              </div>
              <div
                className={`my-4 rounded-md bg-AAtertiary p-6 shadow-lg ${
                  index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                }`}
              >
                <p className="text-xs text-gray-400 sm:text-sm md:text-lg">
                  {project.description}
                </p>
              </div>
              <div
                className={`mb-4 text-sm text-AAsecondary ${
                  index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                }`}
              >
                Role: {project.role}
              </div>
              <ul
                className={`flex flex-wrap font-Text2 text-sm text-gray-200 ${
                  index % 2 === 0 ? "lg:justify-end" : "lg:justify-start"
                }`}
              >
                {project.technologies.map((tech, techIndex) => (
                  <li key={techIndex} className="mb-2 mr-4">
                    {tech}
                  </li>
                ))}
              </ul>
              <div
                className={`flex ${
                  index % 2 === 0 ? "lg:justify-end" : "lg:justify-start"
                } mt-4`}
              >
                <a href={project.link} target="_blank" rel="noreferrer">
                  <ExternalLink url="" router={router} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
