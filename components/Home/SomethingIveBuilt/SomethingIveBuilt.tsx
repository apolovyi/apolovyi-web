import Image from "next/image";
import {useRouter} from "next/router";
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
            description: "Developed and maintained features on infineon.com to optimize user experience and functionality. Designed and conducted comprehensive unit and integration tests to increase software reliability. Utilized a wide range of technologies to deliver high-quality web solutions.",
            image: "/img/projects/infineon.png",
            link: "https://www.infineon.com",
            role: "Senior Full-Stack Engineer",
            technologies: ["JavaEE", "Spring", "OpenCMS", "JUnit", "TypeScript", "React", "AWS"],
        },
        {
            category: "Cloud Migration & Optimization",
            title: "voestalpine AG",
            description: "Successfully migrated voestalpine.com to the AWS cloud, significantly enhancing scalability and performance. Implemented advanced features using Java and Spring, while optimizing database operations with PostgreSQL. Leveraged various AWS services to ensure robust and efficient cloud infrastructure.",
            image: "/img/projects/voestalpine.png",
            link: "https://www.voestalpine.com",
            role: "Cloud Migration Specialist",
            technologies: ["JavaEE", "Spring", "OpenCMS", "AWS", "MySQL", "Oracle", "React", "CloudFormation"],
        },
        {
            category: "Financial Technology",
            title: "Spreadshirt Payout System",
            description: "Developed a high-performance application for payout generation, significantly improving financial operations. Created intuitive user interfaces to enhance user experience and application usability. Implemented robust backend logic to ensure accurate and timely payouts.",
            image: "/img/projects/spreadshirt.png",
            link: "https://www.spreadshirt.com",
            role: "Senior Full-Stack Engineer",
            technologies: ["Kotlin", "Spring Boot", "PostgreSQL", "Flyway", "JUnit", "TypeScript", "React"],
        },
        {
            category: "Car Rental Platform",
            title: "ABI Audi On Demand",
            description: "Collaborated in a Scrum team to optimize pricing, voucher management, and communication systems for the ABI Audi On Demand product. Developed and maintained multiple microservices and microfrontends handling loads of up to 200 QPS. Refactored code using Kotlin, increasing maintainability and reducing code lines by 30%.",
            image: "/img/projects/aod.png",
            link: "https://www.audi.com",
            role: "Full-Stack Engineer",
            technologies: ["Kotlin", "Spring Boot", "RabbitMQ", "Angular", "TypeScript", "Jenkins", "AWS"],
        },
        {
            category: "Travel & Lifestyle",
            title: "Turkey Nomad",
            description: "Developed a comprehensive platform for digital nomads in Turkey, featuring a travel blog and curated recommendations. This project showcases modern web development techniques and content management integration. The site offers valuable insights and resources for remote workers and travelers exploring Turkey.",
            image: "/img/projects/turkey-nomad.png",
            link: "https://turkeynomad.com",
            role: "Lead Full-Stack Developer",
            technologies: ["Next.js", "TypeScript", "Strapi CMS", "Vercel"],
        },
        {
            category: "Travel Technology",
            title: "blookery",
            description: "Developed the front-end of an innovative travel website specializing in blind bookings across Europe. Engineered responsive and intuitive user interfaces using React, ensuring seamless functionality across various devices and screen sizes. Implemented advanced JavaScript features to create dynamic and interactive elements, significantly improving user interaction and site navigation.",
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
            description: "As a student developer, contributed to a leading car rental platform, significantly improving user experience. Implemented A/B tests to optimize product specifications and enhance conversion rates. Conducted thorough testing in each product iteration to ensure high-quality releases. Created internal tools for the customer service team, increasing efficiency by 50%.",
            image: "/img/projects/billiger-mietwagen.png",
            link: "https://www.billiger-mietwagen.de",
            role: "Student Full-Stack Developer",
            technologies: ["JavaScript", "HTML", "CSS", "jQuery", "PHP", "Optimizely"],
        },
    ];

    return (
        <div id="SomethingIveBuiltSection"
             className="flex flex-col xl:space-y-28 space-y-12 bg-AAprimary w-full 2xl:px-72 lg:px-24 md:px-16 sm:px-16 py-32 px-4">
            {/* Title */}
            <div data-aos="fade-up" className="flex flex-row items-center md:px-0">
                <ArrowIcon className={"flex-none h-5 md:h-6 w-5 md:w-5 translate-y-[2px] text-AAsecondary"}/>
                <div className="flex-none flex-row space-x-2 items-center pr-2">
                    <span className="text-AAsecondary font-sans text-sm sm:text-xl"> 03.</span>
                    <span
                        className="font-bold tracking-wider text-gray-200 text-lg md:text-2xl w-44 md:w-56 opacity-85">
            Some Things I&apos;ve Built
          </span>
                </div>
                <div className="bg-gray-400 h-[0.2px] w-full xl:w-1/3 md:w-1/2"></div>
            </div>

            <div className="flex flex-col xl:space-y-36 space-y-8 md:space-y-28">
                {projects.map((project, index) => (
                    <div key={index} data-aos="fade-up" className="relative w-full h-[450px] lg:h-96">
                        {/* Image */}
                        <div
                            className={`absolute top-0 w-full lg:w-2/3 h-full ${index % 2 === 0 ? 'lg:left-0' : 'lg:right-0'}`}>
                            <div
                                className="relative w-full h-full overflow-hidden rounded-lg">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    placeholder="blur"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{
                                        objectFit: 'contain',
                                        objectPosition: 'center',
                                    }}
                                    className="p-4"
                                />
                                <div
                                    className="absolute inset-0 bg-AAprimary opacity-70 lg:opacity-30 hover:opacity-0 transition-opacity duration-300 rounded-lg p-1"></div>
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            className={`absolute top-0 w-full lg:w-1/2 h-full ${index % 2 === 0 ? 'lg:right-0' : 'lg:left-0'} p-8 flex flex-col justify-center`}>
                            <div
                                className={`flex flex-col space-y-1 ${index % 2 === 0 ? 'lg:items-end' : 'lg:items-start'}`}>
                                <span className="text-AAsecondary text-base">{project.category}</span>
                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <span className="text-gray-200 font-bold text-xl hover:text-AAsecondary">
                    {project.title}
                  </span>
                                </a>
                            </div>
                            <div
                                className={`my-4 bg-AAtertiary p-6 rounded-md shadow-lg ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                                <p className="text-gray-400 text-xs sm:text-sm md:text-lg">{project.description}</p>
                            </div>
                            <div
                                className={`text-AAsecondary text-sm mb-4 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                                Role: {project.role}
                            </div>
                            <ul className={`flex flex-wrap text-gray-200 text-sm font-Text2 ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'}`}>
                                {project.technologies.map((tech, techIndex) => (
                                    <li key={techIndex} className="mr-4 mb-2">{tech}</li>
                                ))}
                            </ul>
                            <div className={`flex ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'} mt-4`}>
                                <a href={project.link} target="_blank" rel="noreferrer">
                                    <ExternalLink url="" router={router}/>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


// export default function SomethingIveBuilt() {
//   const router = useRouter();
//   return (
//     <div
//       id="SomethingIveBuiltSection"
//       className=" flex flex-col xl:space-y-28 space-y-12 bg-AAprimary w-full
//      2xl:px-72 lg:px-24 md:px-16 sm:px-16 py-32 px-4"
//     >
//       {/* // ? Title  */}
//       <div data-aos="fade-up" className=" flex flex-row  items-center md:px-0">
//         <ArrowIcon className={"flex-none h-5 md:h-6 w-5 md:w-5 translate-y-[2px] text-AAsecondary"} />
//         <div className="flex-none flex-row space-x-2 items-center pr-2">
//           <span className="text-AAsecondary font-sans text-sm  sm:text-xl"> 03.</span>
//           <span className=" font-bold tracking-wider text-gray-200 text-lg md:text-2xl w-44 md:w-56 opacity-85">
//             {" "}
//             Some Things I&apos;ve Built
//           </span>
//         </div>
//         <div className="bg-gray-400 h-[0.2px] w-full xl:w-1/3 md:w-1/2"></div>
//       </div>
//
//       <div className="flex flex-col   xl:space-y-36 space-y-8 md:space-y-28">
//         {/* // ?  Project  1*/}
//         <div data-aos="fade-up" className="relative md:grid md:grid-cols-12 w-full md:h-96 ">
//           {/* Left image */}
//           <div
//             className="hidden bg-AAprimary z-10  py-4
//           absolute md:grid grid-cols-12 w-full h-full  content-center"
//           >
//             <div className="relative rounded w-full h-full col-span-7 ">
//               <a href="https://www.ens.vision" target={"_blank"} rel="noreferrer">
//                 <div
//                   // onClick={}
//                   className="absolute w-full h-full rounded bg-AAprimary
//            transition-opacity opacity-30 hover:opacity-0 hover:cursor-pointer duration-300"
//                 ></div>
//               </a>
//
//               <Img src={"/img/projects/voestalpine.png"} alt={"Project Screen shot"} className={`w-full rounded h-full `} />
//             </div>
//           </div>
//
//           {/* right Content */}
//           <div className=" md:absolute py-4  md:grid md:grid-cols-12 w-full h-full  content-center ">
//             {/* background for text in mobile responsive */}
//             <div className="absolute w-full h-full bg-opacity-70 z-0">
//               <div className="relative w-full h-full">
//                 <div className="absolute w-full h-full bg-AAsecondary opacity-10 z-10"></div>
//                 <div className="absolute w-full h-full bg-AAprimary opacity-80 z-10"></div>
//                 <Img src={"/img/projects/voestalpine.png"} alt={"Project Screen shot"} className={`w-full h-full `} />
//               </div>
//             </div>
//
//             <div
//               className="px-8 pt-8 sm:pt-12 md:py-0 xl:col-span-6 xl:col-start-7 col-start-5
//             col-span-8 flex flex-col items-start md:items-end space-y-3"
//             >
//               <div className="flex flex-col space-y-1 md:items-end z-10">
//                 <span className="text-AAsecondary text-base">ENS Vision </span>
//                 <a href="https://ens.vision" target="_blank" rel="noopener noreferrer">
//                   <span className=" md:text-gray-200 text-AAsecondary font-bold text-xl hover:cursor-pointer">
//                     ENS names Marketplace
//                   </span>
//                 </a>
//               </div>
//               <div className="w-full md:bg-AAtertiary rounded-md py-6 md:p-6  z-10">
//                 <p className="text-gray-300 md:text-gray-400 text-left md:text-right ">
//                   At <span className="text-AAsecondary">ENS Vision</span>, I played a crucial role in developing web3
//                   components for their <span className="text-AAsecondary">web3 application</span> using Next.js and web3
//                   libraries. Our focus was on integrating new features and improving the user interface. One notable
//                   achievement was the release of NameWrapper with <span className="text-AAsecondary">ERC72</span>{" "}
//                   support, enabling users to create <span className="text-AAsecondary">subdomains</span>. This showcased
//                   our commitment to delivering innovative solutions.
//                 </p>
//               </div>
//               <ul
//                 className="flex flex-wrap w-full text-gray-300 md:text-gray-400
//                text-sm font-Text2 md:justify-end"
//               >
//                 <span className="pr-4 z-10">ENS domains</span>
//                 <span className="pr-4 z-10">ENS names</span>
//                 <span className="pr-4 z-10">web3</span>
//                 <span className="pr-4 z-10">NFT</span>
//                 <span className="pr-4 z-10">ERC72</span>
//               </ul>
//               <div className="z-10 flex fle-row space-x-5 ">
//                 <a href="https://www.ens.vision/" target={"_blank"} rel="noreferrer">
//                   <ExternalLink url={""} router={router} />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//
//         {/* // ?  Project 2 */}
//         <div data-aos="fade-up" className="relative md:grid md:grid-cols-12 w-full md:h-96  ">
//           {/* Left image */}
//           <div
//             className="hidden bg-AAprimary z-10  py-4
//           absolute md:grid grid-cols-12 w-full h-full  content-center "
//           >
//             <div className="relative rounded w-full h-full col-start-6 col-span-7 ">
//               <a href={"https://ubiquitous-bublanina-da84ec.netlify.app/"} target="_blank" rel="noreferrer">
//                 <div
//                   className="absolute w-full h-full rounded bg-AAprimary
//            transition-opacity opacity-50 hover:opacity-0 hover:cursor-pointer duration-300"
//                 ></div>
//               </a>
//               <Img src={"/img/YPredict-v1.jpg"} alt={"Project Screen shot"} className={`w-full rounded h-full `} />
//             </div>
//           </div>
//
//           {/* right Content */}
//           <div className=" md:absolute py-4  md:grid md:grid-cols-12 w-full h-full  content-center ">
//             {/* background for text in mobile responsive */}
//             <div className="absolute w-full h-full bg-opacity-70 z-0 md:order-2">
//               <div className="relative w-full h-full">
//                 <div className="absolute w-full h-full bg-AAsecondary opacity-10 z-10"></div>
//                 <div className="absolute w-full h-full bg-AAprimary opacity-80 z-10"></div>
//                 <Img src={"/hackme.jpg"} alt={"Project Screen shot"} className={`w-full h-full`} />
//               </div>
//             </div>
//
//             <div
//               className="px-8 pt-8 sm:pt-12 md:py-0 xl:col-span-6
//             col-span-8 flex flex-col items-start  space-y-3 md:order-1"
//             >
//               <div className="flex flex-col space-y-1  z-10">
//                 <span className="text-AAsecondary text-base">Recent Project</span>
//                 <a href="https://ypredict.ai/" target="_blank" rel="noopener noreferrer">
//                   <span className=" md:text-gray-200 text-AAsecondary font-bold text-xl hover:cursor-pointer">
//                     YPredict - v1
//                   </span>
//                 </a>
//               </div>
//               <div className="w-full md:bg-AAtertiary rounded-md py-6 md:p-6  z-10">
//                 <p className="text-gray-300 md:text-gray-400 text-left ">
//                   I had the opportunity to lead the development of a token project, which aimed to create a
//                   decentralized ecosystem for peer-to-peer transactions. Overseeing the planning and development of the
//                   project, including the <span className="text-AAsecondary"> design</span> and implementation of the{" "}
//                   <span className="text-AAsecondary"> smart contract</span> and{" "}
//                   <span className="text-AAsecondary"> blockchain technology</span>. Here i share with you{" "}
//                   <span className="text-AAsecondary"> YPredict - v1 </span> for the private sale.
//                 </p>
//               </div>
//               <ul
//                 className="flex flex-wrap w-full text-gray-300 md:text-gray-400
//                text-sm font-Text2 md:justify-start"
//               >
//                 <span className="pr-4 z-10">Token</span>
//                 <span className="pr-4 z-10">ERC20</span>
//                 <span className="pr-4 z-10">Nextjs</span>
//                 <span className="pr-4 z-10">Smart contract</span>
//                 <span className="pr-4 z-10">Blockchain</span>
//               </ul>
//               <div className="z-10 flex fle-row space-x-5 ">
//                 <GithubIcon link="https://github.com/hktitof/Ypredict" />
//                 <a href="https://ubiquitous-bublanina-da84ec.netlify.app/" target={"_blank"} rel="noreferrer">
//                   <ExternalLink url={""} router={router} />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* // ?  Project  3*/}
//         <div data-aos="fade-up" className="relative md:grid md:grid-cols-12 w-full md:h-96 ">
//           {/* Left image */}
//           <div
//             className="hidden bg-AAprimary z-10  py-4
//           absolute md:grid grid-cols-12 w-full h-full  content-center"
//           >
//             <div className="relative rounded w-full h-full col-span-7 ">
//               <Link href={"/typing"}>
//                 <div
//                   // onClick={}
//                   className="absolute w-full h-full rounded bg-AAsecondary
//            transition-opacity opacity-10 hover:opacity-0 hover:cursor-pointer duration-300"
//                 ></div>
//               </Link>
//
//               <Img src={"/typing.png"} alt={"Project Screen shot"} className={`w-full rounded h-full `} />
//             </div>
//           </div>
//
//           {/* right Content */}
//           <div className=" md:absolute py-4  md:grid md:grid-cols-12 w-full h-full  content-center ">
//             {/* background for text in mobile responsive */}
//             <div className="absolute w-full h-full bg-opacity-70 z-0">
//               <div className="relative w-full h-full">
//                 <div className="absolute w-full h-full bg-AAsecondary opacity-10 z-10"></div>
//                 <div className="absolute w-full h-full bg-AAprimary opacity-80 z-10"></div>
//                 <Img src={"/typing.png"} alt={"Project Screen shot"} className={`w-full h-full `} />
//               </div>
//             </div>
//
//             <div
//               className="px-8 pt-8 sm:pt-12 md:py-0 xl:col-span-6 xl:col-start-7 col-start-5
//             col-span-8 flex flex-col items-start md:items-end space-y-3"
//             >
//               <div className="flex flex-col space-y-1 md:items-end z-10">
//                 <span className="text-AAsecondary text-base">Recent Project</span>
//                 <Link href={"/typing"}>
//                   <span className=" md:text-gray-200 text-AAsecondary font-bold text-xl hover:cursor-pointer">
//                     Speed Typing
//                   </span>
//                 </Link>
//               </div>
//               <div className="w-full md:bg-AAtertiary rounded-md py-6 md:p-6  z-10">
//                 <p className="text-gray-300 md:text-gray-400 text-left md:text-right">
//                   This project aim to help you to improve your <span className="text-AAsecondary"> typing </span> by
//                   tracking your progress in <span className="text-AAsecondary"> each round</span> and give you a{" "}
//                   <span className="text-AAsecondary"> score</span> based on your typing speed and accuracy through a
//                   table of <span className="text-AAsecondary"> statistics</span>.
//                 </p>
//               </div>
//               <ul
//                 className="flex flex-wrap w-full text-gray-300 md:text-gray-400
//                text-sm font-Text2 md:justify-end"
//               >
//                 <span className="pr-4 z-10">Algorithms</span>
//                 <span className="pr-4 z-10">Framer Motion</span>
//                 <span className="pr-4 z-10">Tailwind CSS</span>
//                 <span className="pr-4 z-10">TypeScript</span>
//               </ul>
//               <div className="z-10 flex fle-row space-x-5 ">
//                 <GithubIcon link="https://github.com/hktitof/Typing" />
//                 <ExternalLink url={"typing"} router={router} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
