import React, { useState } from "react";
import { motion } from "framer-motion";
import ArrowIcon from "@/components/icons/ArrowIcon";
import { jobs } from "@/components/const/jobs";

interface Company {
  name: string;
  key: string;
}

const companies: Company[] = [
  { name: "The Bicester Collection", key: "TheBicesterCollection" },
  { name: "Virtual Identity AG", key: "VirtualIdentityAG" },
  { name: "Spreadshirt", key: "Spreadshirt" },
  { name: "Comsysto Reply GmbH", key: "ComsystoReplyGmbH" },
  { name: "Blookery", key: "Blookery" },
  { name: "SilverTours GmbH", key: "SilverToursGmbH" },
];

const WhereIveWorked = () => {
  const [activeCompany, setActiveCompany] = useState(companies[0].key);

  return (
    <div
      id="WhereIHaveWorkedSection"
      data-aos="fade-up"
      className="flex flex-col items-center justify-center space-y-12 bg-background-primary py-24"
    >
      <section className="flex flex-row items-center">
        <div className="flex flex-row items-center">
          <ArrowIcon className="h-4 w-4 flex-none text-accent-coral md:h-6 md:w-5" />
          <span className="font-tech text-sm text-accent-coral sm:text-xl"> 02.</span>
        </div>
        <h2 className="px-3 font-heading text-lg font-bold tracking-wider text-text-primary opacity-85 md:text-2xl">
          Where I&apos;ve Worked
        </h2>
        <div className="h-[0.2px] w-16 bg-accent-green sm:w-44 md:w-80"></div>
      </section>

      <section className="flex flex-col items-center justify-center space-y-4 md:flex-row md:items-start md:justify-center md:space-x-4 md:space-y-0">
        <CompaniesBar activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        <JobDescription company={activeCompany} />
      </section>
    </div>
  );
};

interface CompaniesBarProps {
  activeCompany: string;
  setActiveCompany: (key: string) => void;
}

const CompaniesBar: React.FC<CompaniesBarProps> = ({ activeCompany, setActiveCompany }) => {
  return (
    <div className="flex w-screen flex-col items-start justify-start overflow-hidden pb-4 sm:items-center sm:justify-center md:w-auto md:flex-row md:pb-0">
      <div className="relative order-2 hidden h-0.5 translate-y-1 rounded bg-neutral-medium-gray md:order-1 md:block md:h-[390px] md:w-0.5">
        <motion.div
          animate={{
            y: companies.findIndex((company) => company.key === activeCompany) * 64,
          }}
          className="absolute h-0.5 w-10 rounded bg-accent-coral md:h-16 md:w-0.5"
        ></motion.div>
      </div>
      <div className="order-1 flex flex-col space-y-1 pl-8 md:order-2 md:pl-0">
        <div className="flex flex-row md:flex-col">
          {companies.map((company) => (
            <CompanyButton
              key={company.key}
              company={company}
              isActive={activeCompany === company.key}
              onClick={() => setActiveCompany(company.key)}
            />
          ))}
        </div>
        <div className="block h-0.5 rounded bg-neutral-medium-gray md:hidden">
          <motion.div
            animate={{
              x: companies.findIndex((company) => company.key === activeCompany) * 128,
            }}
            className="h-0.5 w-[128px] rounded bg-accent-coral"
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

interface CompanyButtonProps {
  company: Company;
  isActive: boolean;
  onClick: () => void;
}

const CompanyButton: React.FC<CompanyButtonProps> = ({ company, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`h-16 w-32 flex-none rounded py-3 text-center
      font-tech text-xs transition-colors duration-300 sm:text-sm md:w-44 md:px-4 md:pl-6 md:text-left
      ${
        isActive
          ? "bg-accent-coral text-background-primary"
          : "text-text-secondary hover:bg-accent-coral hover:bg-opacity-10 hover:text-accent-coral"
      }`}
    aria-pressed={isActive}
  >
    {company.name}
  </button>
);

interface JobDescriptionProps {
  company: string;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ company }) => {
  const job = jobs[company];

  const getTasksTextWithHighlightedKeyword = (text: string, keywords: string[]) => {
    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword, "gi");
      highlightedText = highlightedText.replace(regex, (match) => `<span class="text-accent-coral">${match}</span>`);
    });
    return highlightedText;
  };

  return (
    <div className="flex max-w-xl flex-col space-y-5 px-4 md:px-0">
      <div className="flex flex-col space-y-2">
        <span className="font-body text-sm tracking-wide text-text-primary sm:text-lg">
          {job.title} <span className="text-accent-coral">@ {companies.find((c) => c.key === company)?.name}</span>
        </span>
        <span className="font-tech text-xs text-text-secondary">{job.date}</span>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-tech text-xs text-accent-coral hover:underline"
          style={{ fontSize: "0.6rem" }}
        >
          {job.url}
        </a>
      </div>
      <ul className="flex flex-col space-y-4 text-xs sm:text-sm">
        {job.tasks.map((item, index) => (
          <li key={index} className="flex flex-row space-x-1">
            <ArrowIcon className="h-5 w-4 flex-none text-accent-coral" />
            <span
              className="text-text-secondary"
              dangerouslySetInnerHTML={{
                __html: getTasksTextWithHighlightedKeyword(item.text, item.keywords),
              }}
            ></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhereIveWorked;
