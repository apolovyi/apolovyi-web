import React, { useState } from "react";
import { motion } from "framer-motion";
import ArrowIcon from "@/components/icons/ArrowIcon";

const companies = [
  { name: "The Bicester Collection", key: "TheBicesterCollection" },
  { name: "Virtual Identity AG", key: "VirtualIdentityAG" },
  { name: "Spreadshirt", key: "Spreadshirt" },
  { name: "Comsysto Reply GmbH", key: "ComsystoReplyGmbH" },
  { name: "Blookery", key: "Blookery" },
  { name: "SilverTours GmbH", key: "SilverToursGmbH" },
];

export default function WhereIveWorked() {
  const [activeCompany, setActiveCompany] = useState("TheBicesterCollection");

  return (
    <div
      id="WhereIHaveWorkedSection"
      data-aos="fade-up"
      className="aos-init aos-animate flex flex-col items-center justify-center space-y-12 bg-primary py-24"
    >
      <section className="flex flex-row items-center">
        <div className="flex flex-row items-center">
          <ArrowIcon className={"h-4 w-4 flex-none text-secondary md:h-6 md:w-5"} />
          <span className="font-tech text-sm text-secondary sm:text-xl"> 02.</span>
        </div>
        <span className="px-3 font-heading text-lg font-bold tracking-wider text-gray-200 opacity-85 md:text-2xl">
          Where I&apos;ve Worked
        </span>
        <div className="h-[0.2px] w-16 bg-gray-400 sm:w-44 md:w-80"></div>
      </section>

      <section className="flex flex-col items-center justify-center space-y-4 md:flex-row md:items-start md:justify-center md:space-x-4 md:space-y-0">
        <CompaniesBar activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        <JobDescription company={activeCompany} />
      </section>
    </div>
  );
}

const CompaniesBar = ({ activeCompany, setActiveCompany }) => {
  return (
    <div className="scrollbar-hide flex w-screen flex-col items-start justify-start overflow-hidden pb-4 sm:items-center sm:justify-center md:w-auto md:flex-row md:pb-0">
      <div className="relative order-2 hidden h-0.5 translate-y-1 rounded bg-gray-500 md:order-1 md:block md:h-[390px] md:w-0.5">
        <motion.div
          animate={{
            y: companies.findIndex((company) => company.key === activeCompany) * 64,
          }}
          className={`absolute h-0.5 w-10 rounded bg-secondary md:h-16 md:w-0.5`}
        ></motion.div>
      </div>
      <div className="order-1 flex flex-col space-y-1 pl-8 md:order-2 md:pl-0">
        <div className="flex flex-row md:flex-col">
          {companies.map((company, index) => (
            <CompanyButton
              key={company.key}
              company={company}
              isActive={activeCompany === company.key}
              onClick={() => setActiveCompany(company.key)}
              index={index}
            />
          ))}
        </div>
        <div className="block h-0.5 rounded bg-gray-500 md:hidden">
          <motion.div
            animate={{
              x: companies.findIndex((company) => company.key === activeCompany) * 128,
            }}
            className="h-0.5 w-[128px] rounded bg-secondary"
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

const CompanyButton = ({ company, isActive, onClick, index }) => (
  <button
    onClick={onClick}
    className={`h-16 w-32 flex-none rounded py-3 text-center font-tech
      text-xs duration-500 hover:bg-resume-hover hover:text-secondary sm:text-sm md:w-44 md:px-4 md:pl-6 md:text-left
      ${isActive ? "bg-resume-hover text-secondary" : "text-gray-500"}`}
  >
    {company.name}
  </button>
);

const JobDescription = ({ company }) => {
  const jobs = {
    TheBicesterCollection: {
      title: "Full-Stack Engineer",
      date: "June 2023 - Present",
      url: "https://www.thebicestercollection.com",
      tasks: [
        {
          text: "Spearheading the development of a cutting-edge e-commerce platform for a prestigious brand collective in New York City.",
          keywords: ["e-commerce platform"],
        },
        {
          text: "Implementing a headless CMS architecture to enhance content flexibility and improve overall site performance.",
          keywords: ["headless CMS"],
        },
        {
          text: "Optimizing the website for search engines (SEO) to increase visibility and organic traffic.",
          keywords: ["SEO"],
        },
        {
          text: "Leveraging Vercel's platform for seamless deployment and hosting, ensuring high availability and rapid content delivery.",
          keywords: ["Vercel"],
        },
        {
          text: "Utilizing a modern tech stack including Next.js, TypeScript, Tailwind CSS, and Sanity to create a robust and scalable web application.",
          keywords: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity"],
        },
      ],
    },
    VirtualIdentityAG: {
      title: "Full-Stack Engineer",
      date: "Feb 2022 - Jan 2024",
      url: "https://www.virtual-identity.com",
      tasks: [
        {
          text: "Developed and maintained features on infineon.com to optimize user experience and functionality.",
          keywords: ["infineon.com"],
        },
        {
          text: "Successfully migrated voestalpine.com to the AWS cloud, enhancing scalability and performance.",
          keywords: ["voestalpine.com", "AWS cloud"],
        },
        {
          text: "Designed and conducted comprehensive unit and integration tests to increase software reliability.",
          keywords: ["unit tests", "integration tests"],
        },
        {
          text: "Utilized technologies including Java, Spring, JUnit, MySQL, Oracle, PostgreSQL, Flyway, TypeScript, React, Stencil, Web Components, HTML/CSS, OpenCms, and various AWS services.",
          keywords: [
            "Java",
            "Spring",
            "JUnit",
            "MySQL",
            "Oracle",
            "PostgreSQL",
            "Flyway",
            "TypeScript",
            "React",
            "Stencil",
            "Web Components",
            "OpenCms",
            "AWS",
          ],
        },
      ],
    },
    Spreadshirt: {
      title: "Full-Stack Engineer",
      date: "Nov 2021 - Feb 2022",
      url: "https://www.spreadshirt.com",
      tasks: [
        {
          text: "Developed a high-performance application for payout generation, improving financial operations.",
          keywords: ["payout generation"],
        },
        {
          text: "Created intuitive user interfaces, enhancing user experience and application usability.",
          keywords: ["user interfaces"],
        },
        {
          text: "Worked with technologies including PostgreSQL, Flyway, Kotlin, Spring Boot, JUnit, TypeScript, and React.",
          keywords: ["PostgreSQL", "Flyway", "Kotlin", "Spring Boot", "JUnit", "TypeScript", "React"],
        },
      ],
    },
    ComsystoReplyGmbH: {
      title: "Full-Stack Engineer",
      date: "Feb 2019 - Oct 2021",
      url: "https://www.comsysto.com",
      tasks: [
        {
          text: "Collaborated in a Scrum team to optimize pricing, voucher management, and communication systems for the ABI Audi On Demand product.",
          keywords: ["Scrum", "ABI Audi On Demand"],
        },
        {
          text: "Developed and maintained multiple microservices and microfrontends handling loads of up to 200 QPS.",
          keywords: ["microservices", "microfrontends"],
        },
        {
          text: "Refactored code using Kotlin, increasing maintainability and reducing code lines by 30%.",
          keywords: ["Kotlin"],
        },
        {
          text: "Utilized technologies including PostgreSQL, Flyway, Java, Kotlin, Spring Boot, JUnit, RabbitMQ, TypeScript, Angular, Jenkins, CloudFoundry, and various AWS services.",
          keywords: [
            "PostgreSQL",
            "Flyway",
            "Java",
            "Kotlin",
            "Spring Boot",
            "JUnit",
            "RabbitMQ",
            "TypeScript",
            "Angular",
            "Jenkins",
            "CloudFoundry",
            "AWS",
          ],
        },
      ],
    },
    Blookery: {
      title: "Frontend Engineer",
      date: "May 2018 - Aug 2018",
      url: "https://www.blookery.de",
      tasks: [
        {
          text: "Spearheaded the development of an innovative travel website specializing in blind bookings across Europe, enhancing user engagement and experience.",
          keywords: ["blind bookings", "user engagement"],
        },
        {
          text: "Engineered responsive and intuitive user interfaces using React, ensuring seamless functionality across various devices and screen sizes.",
          keywords: ["React", "responsive", "user interfaces"],
        },
        {
          text: "Implemented advanced JavaScript features to create dynamic and interactive elements, significantly improving user interaction and site navigation.",
          keywords: ["JavaScript", "dynamic", "interactive"],
        },
        {
          text: "Collaborated with UX/UI designers to translate wireframes and mockups into pixel-perfect, accessible HTML/CSS layouts, adhering to WCAG guidelines.",
          keywords: ["UX/UI", "HTML/CSS", "WCAG guidelines"],
        },
        {
          text: "Developed and maintained a comprehensive suite of unit and integration tests using Jest, ensuring code reliability and facilitating agile development practices.",
          keywords: ["Jest", "unit tests", "integration tests"],
        },
        {
          text: "Optimized website performance through efficient code practices and asset management, resulting in improved loading times and overall user satisfaction.",
          keywords: ["performance optimization", "loading times"],
        },
        {
          text: "Participated in code reviews and contributed to the establishment of best practices and coding standards within the development team.",
          keywords: ["code reviews", "best practices"],
        },
      ],
    },
    SilverToursGmbH: {
      title: "Student Full-Stack Developer",
      date: "Jan 2015 - Aug 2018",
      url: "https://www.billiger-mietwagen.de",
      tasks: [
        {
          text: "Developed new features for a leading car rental platform, improving user experience.",
          keywords: ["car rental platform"],
        },
        {
          text: "Implemented A/B tests to optimize product specifications and enhance conversion rates.",
          keywords: ["A/B tests"],
        },
        {
          text: "Conducted thorough testing in each product iteration to ensure high-quality releases.",
          keywords: ["testing"],
        },
        {
          text: "Created internal tools for the customer service team, increasing efficiency by 50%.",
          keywords: ["internal tools"],
        },
        {
          text: "Worked with technologies including JavaScript, HTML, CSS, jQuery, and PHP.",
          keywords: ["JavaScript", "HTML", "CSS", "jQuery", "PHP"],
        },
      ],
    },
  };

  const job = jobs[company];

  const getTasksTextWithHighlightedKeyword = (text, keywords) => {
    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword, "gi");
      highlightedText = highlightedText.replace(regex, (match) => `<span class="text-secondary">${match}</span>`);
    });
    return highlightedText;
  };

  return (
    <div className="flex max-w-xl flex-col space-y-5 px-4 md:px-0">
      <div className="spacey-y-2 flex flex-col">
        <span className="font-Arimo text-sm tracking-wide text-gray-100 sm:text-lg">
          {job.title} <span className="text-secondary">@ {companies.find((c) => c.key === company).name}</span>
        </span>
        <span className="font-tech text-xs text-gray-500">{job.date}</span>
        <span
          className="font-tech text-xs text-secondary hover:cursor-pointer"
          style={{ fontSize: "0.6rem" }}
          onClick={() => window.open(job.url, "_blank")}
        >
          {job.url}
        </span>
      </div>
      <div className="flex flex-col space-y-4 text-xs sm:text-sm">
        {job.tasks.map((item, index) => (
          <div key={index} className="flex flex-row space-x-1">
            <ArrowIcon className={" h-5 w-4 flex-none text-secondary"} />
            <span
              className="text-xs text-gray-500 sm:text-sm"
              dangerouslySetInnerHTML={{
                __html: getTasksTextWithHighlightedKeyword(item.text, item.keywords),
              }}
            ></span>
          </div>
        ))}
      </div>
    </div>
  );
};
