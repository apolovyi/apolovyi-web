import React, { useState } from 'react';
import ArrowIcon from '@/components/icons/ArrowIcon';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/i18n-config';

interface Company {
  name: string;
  key: string;
}

const companies: Company[] = [
  { name: 'The Bicester Collection', key: 'TheBicesterCollection' },
  { name: 'Virtual Identity AG', key: 'VirtualIdentityAG' },
  { name: 'SmartDorm', key: 'SmartDorm' },
  { name: 'Spreadshirt', key: 'Spreadshirt' },
  { name: 'Comsysto Reply GmbH', key: 'ComsystoReplyGmbH' },
  { name: 'Blookery', key: 'Blookery' },
  { name: 'SilverTours GmbH', key: 'SilverToursGmbH' },
];

interface MyExperienceProps {
  lang: Locale;
}

const MyExperience = ({ lang }: MyExperienceProps) => {
  const dictionary = getDictionary(lang);
  const experienceSectionTitle = dictionary.experienceSection.title;
  const [activeCompany, setActiveCompany] = useState(companies[0].key);

  return (
    <section
      id="experienceSection"
      data-aos="fade-up"
      className="flex snap-start flex-col items-center bg-background-primary py-12 md:py-24"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
        <header data-aos="fade-up" className="mb-8 flex flex-row items-center font-heading">
          <ArrowIcon className="h-6 w-6 flex-none translate-y-[2px] text-accent-coral" />
          <div className="flex flex-row items-center space-x-2 whitespace-nowrap pr-2">
            <span className="font-tech text-xl text-accent-coral">02.</span>
            <h2 className="px-2 font-heading text-lg font-bold tracking-wider text-text-primary opacity-85 md:text-2xl">
              {experienceSectionTitle}
            </h2>
          </div>
          <div className="h-[0.2px] w-full bg-accent-green"></div>
        </header>

        <div className="flex flex-col md:flex-row md:space-x-8">
          <CompaniesBar
            companies={companies}
            activeCompany={activeCompany}
            setActiveCompany={setActiveCompany}
            lang={lang}
          />
          <JobDescription company={activeCompany} lang={lang} />
        </div>
      </div>
    </section>
  );
};

interface CompaniesBarProps {
  companies: Company[];
  activeCompany: string;
  setActiveCompany: (key: string) => void;
  lang: Locale;
}

const CompaniesBar = ({ companies, activeCompany, setActiveCompany }: CompaniesBarProps) => {
  return (
    <div className="mb-4 flex overflow-x-auto md:mb-0 md:flex-col md:overflow-x-visible">
      {companies.map((company) => (
        <CompanyButton
          key={company.key}
          company={company}
          isActive={activeCompany === company.key}
          onClick={() => setActiveCompany(company.key)}
          companyName={company.name}
        />
      ))}
    </div>
  );
};

interface CompanyButtonProps {
  company: Company;
  isActive: boolean;
  onClick: () => void;
  companyName: string;
}

const CompanyButton = ({ company, isActive, onClick, companyName }: CompanyButtonProps) => (
  <button
    onClick={onClick}
    className={`whitespace-nowrap px-4 py-2 text-sm transition-colors duration-300 md:text-left
      ${
        isActive
          ? 'bg-accent-coral text-background-primary'
          : 'text-text-secondary hover:bg-accent-coral hover:bg-opacity-10 hover:text-accent-coral'
      }`}
    aria-pressed={isActive}
  >
    {companyName}
  </button>
);

interface JobDescriptionProps {
  company: string;
  lang: Locale;
}

const JobDescription = ({ company, lang }: JobDescriptionProps) => {
  const dictionary = getDictionary(lang);
  const job = dictionary.experienceSection.roles[company as keyof typeof dictionary.experienceSection.roles];

  const highlightKeywords = (text: string, keywords: string[]) => {
    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(keyword, 'gi');
      highlightedText = highlightedText.replace(regex, (match) => `<span class="text-accent-coral">${match}</span>`);
    });
    return highlightedText;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center">
          <span className="font-body text-lg font-semibold text-text-primary">{job.title}</span>
          <span className="text-base text-accent-coral sm:ml-2 md:text-lg">
            @ {companies.find((c) => c.key === company)?.name || company}
          </span>
        </div>
        <p className="mt-2 font-tech text-sm text-text-secondary">{job.date}</p>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-tech text-xs text-accent-coral hover:underline"
        >
          {job.url}
        </a>
      </div>
      <ul className="space-y-2">
        {job.tasks.map((task: { text: string; keywords: string[] }, index: number) => (
          <li key={index} className="flex items-start space-x-2">
            <ArrowIcon className="mt-1 h-5 w-4 flex-none text-accent-coral" />
            <span
              className="text-sm text-text-secondary"
              dangerouslySetInnerHTML={{
                __html: highlightKeywords(task.text, task.keywords),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyExperience;
