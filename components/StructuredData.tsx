import Script from "next/script";

const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Artem Polovyi - Full-Stack Software Engineering",
    url: "https://apolovyi.me",
    logo: "https://apolovyi.me/img/logo.png",
    image: "https://apolovyi.me/img/me-circle.png",
    description:
      "Experienced full-stack engineer specializing in scalable web applications and cloud technologies. Serving clients in the US and Europe with 7+ years of expertise in Java, Kotlin, Spring Boot, React, and AWS.",
    email: "info@apolovyi.me",
    sameAs: ["https://www.linkedin.com/in/apolovyi", "https://github.com/apolovyi"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Zurich",
      addressCountry: "CH",
      postalCode: "8001",
    },
    founder: {
      "@type": "Person",
      name: "Artem Polovyi",
      jobTitle: "Senior Full-Stack Software Engineer",
      alumniOf: [
        {
          "@type": "EducationalOrganization",
          name: "Munich University of Applied Sciences",
        },
        {
          "@type": "EducationalOrganization",
          name: "TH Köln - University of Applied Sciences",
        },
        {
          "@type": "EducationalOrganization",
          name: "Telecommunications University Kyiv",
        },
      ],
      knowsLanguage: ["English", "German", "Ukrainian", "Russian"],
    },
    knowsAbout: [
      "Full-Stack Development",
      "Java",
      "Kotlin",
      "Spring Boot",
      "React",
      "TypeScript",
      "AWS",
      "Cloud Technologies",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Full-Stack Software Development",
          description: "Development of scalable web applications using modern technologies",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Cloud Solutions Architecture",
          description: "Design and implementation of cloud-based solutions using AWS",
        },
      },
    ],
  };

  return (
    <Script
      id="ld-json"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;
