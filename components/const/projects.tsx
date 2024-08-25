export const projects: Project[] = [
  // {
  //     category: "E-commerce Development",
  //     company: "The Bicester Collection",
  //     description: "Led the development of a cutting-edge e-commerce platform for a prestigious luxury brand collective in New York City. Implemented headless CMS architecture for enhanced content flexibility and optimized site performance. Focused on SEO optimization to increase visibility and organic traffic.",
  //     image: "/static/img/projects/bicester-collection.png",
  //     link: "https://www.thebicestercollection.com",
  //     role: "Full-Stack Developer",
  //     technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Sanity", "Vercel"],
  // },
  {
    category: "Enterprise Web Development",
    company: "Infineon Technologies",
    description:
      "Developed and maintained features on infineon.com to optimize user experience and functionality. Designed and conducted comprehensive unit and integration tests to increase software reliability. Utilized a wide range of technologies to deliver high-quality web solutions.",
    role: "Senior Full-Stack Engineer",
    image: "/static/img/projects/infineon.png",
    link: "https://www.infineon.com",
    technologies: ["JavaEE", "Spring", "OpenCMS", "JUnit", "TypeScript", "React", "AWS"],
  },
  {
    category: "Cloud Migration & Optimization",
    company: "voestalpine AG",
    description:
      "Successfully migrated voestalpine.com to the AWS cloud, significantly enhancing scalability and performance. Implemented advanced features using Java and Spring, while optimizing database operations with PostgreSQL. Leveraged various AWS services to ensure robust and efficient cloud infrastructure.",
    image: "/static/img/projects/voestalpine.png",
    link: "https://www.voestalpine.com",
    role: "Cloud Migration Specialist",
    technologies: ["JavaEE", "Spring", "OpenCMS", "AWS", "MySQL", "Oracle", "React", "CloudFormation"],
  },
  {
    category: "Financial Technology",
    company: "Spreadshirt Payout System",
    description:
      "Developed a high-performance application for payout generation, significantly improving financial operations. Created intuitive user interfaces to enhance user experience and application usability. Implemented robust backend logic to ensure accurate and timely payouts.",
    image: "/static/img/projects/spreadshirt.png",
    link: "https://www.spreadshirt.com",
    role: "Senior Full-Stack Engineer",
    technologies: ["Kotlin", "Spring Boot", "PostgreSQL", "Flyway", "JUnit", "TypeScript", "React"],
  },
  {
    category: "Car Rental Platform",
    company: "ABI Audi On Demand",
    description:
      "Collaborated in a Scrum team to optimize pricing, voucher management, and communication systems for the ABI Audi On Demand product. Developed and maintained multiple microservices and microfrontends handling loads of up to 200 QPS. Refactored code using Kotlin, increasing maintainability and reducing code lines by 30%.",
    image: "/static/img/projects/aod.png",
    link: "https://www.audi.com",
    role: "Full-Stack Engineer",
    technologies: ["Kotlin", "Spring Boot", "RabbitMQ", "Angular", "TypeScript", "Jenkins", "AWS"],
  },
  {
    category: "Travel & Lifestyle",
    company: "Turkey Nomad",
    description:
      "Developed a comprehensive platform for digital nomads in Turkey, featuring a travel blog and curated recommendations. This project showcases modern web development techniques and content management integration. The site offers valuable insights and resources for remote workers and travelers exploring Turkey.",
    image: "/static/img/projects/turkey-nomad.png",
    link: "https://turkeynomad.com",
    role: "Lead Full-Stack Developer",
    technologies: ["Next.js", "TypeScript", "Strapi CMS", "Vercel"],
  },
  {
    category: "Travel Technology",
    company: "blookery",
    description:
      "Developed the front-end of an innovative travel website specializing in blind bookings across Europe. Engineered responsive and intuitive user interfaces using React, ensuring seamless functionality across various devices and screen sizes. Implemented advanced JavaScript features to create dynamic and interactive elements, significantly improving user interaction and site navigation.",
    image: "/static/img/projects/blookery.png",
    link: "https://www.blookery.de",
    role: "Frontend Engineer",
    technologies: ["React", "JavaScript", "HTML", "CSS", "Jest"],
  },
  {
    category: "Volunteer Project",
    company: "SmartDorm",
    description:
      "Developed a web application to streamline and automate management processes in the student dormitory Geschwister Scholl. Migrated and consolidated data into a central database to ensure 100% data consistency. Reduced administrative work by 35% through digitalization and automation. Implemented a CI/CD pipeline to optimize the development process.",
    image: "/static/img/projects/schollheim.png",
    link: "https://smartdorm.schollheim.net",
    role: "Lead Full-Stack Developer",
    technologies: ["PostgreSQL", "Kotlin", "Spring Boot", "React", "GitLab"],
  },
  {
    category: "Car Rental Platform",
    company: "Billiger Mietwagen",
    description:
      "As a student developer, contributed to a leading car rental platform, significantly improving user experience. Implemented A/B tests to optimize product specifications and enhance conversion rates. Conducted thorough testing in each product iteration to ensure high-quality releases. Created internal tools for the customer service team, increasing efficiency by 50%.",
    image: "/static/img/projects/billiger-mietwagen.png",
    link: "https://www.billiger-mietwagen.de",
    role: "Student Full-Stack Developer",
    technologies: ["JavaScript", "HTML", "CSS", "jQuery", "PHP", "Optimizely"],
  },
];

export type Project = {
  category: string;
  company: string;
  description: string;
  image: string;
  link: string;
  role: string;
  technologies: string[];
};

export type ProjectItemProps = {
  project: Project;
  index: number;
};
