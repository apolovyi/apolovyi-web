import { Comfortaa, IBM_Plex_Mono, Merriweather, Quicksand } from "next/font/google";
import { AppProvider } from "@/components/shared/AppContext";
import "@/app/globals.css";
import Script from "next/script";
import { i18n, Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/dictionary";
import { Metadata } from "next";
import LanguageDetector from "@/components/LanguageDetector";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
  weight: ["300", "400", "700", "900"],
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: [locale] }));
}

export function generateMetadata({ params }: { params: { lang: string[] } }): Metadata {
  const lang = (params.lang?.[0] || i18n.defaultLocale) as Locale;
  const dictionary = getDictionary(lang);
  const { metadata } = dictionary;

  const baseUrl = "https://apolovyi.me";
  const currentPath = `/${lang}`;

  return {
    title: {
      default: metadata.title.default,
      template: metadata.title.template,
    },
    metadataBase: new URL(baseUrl),
    description: metadata.description,
    openGraph: {
      title: metadata.openGraph.title,
      description: metadata.openGraph.description,
      url: `${baseUrl}${currentPath}`,
      siteName: metadata.openGraph.siteName,
      images: metadata.openGraph.images,
      locale: lang,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": 200,
    },
    icons: {
      icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png", sizes: "32x32" }],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    alternates: {
      languages: {
        "x-default": `${baseUrl}`,
        en: `${baseUrl}/en`,
        de: `${baseUrl}/de`,
        ch: `${baseUrl}/ch`,
        uk: `${baseUrl}/uk`,
        ru: `${baseUrl}/ru`,
      },
    },
    keywords: metadata.keywords,
  };
}

const RootLayout = ({ children, params }: { children: React.ReactNode; params: { lang: string[] } }) => {
  const lang = (params.lang?.[0] || i18n.defaultLocale) as Locale;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Artem Polovyi",
    url: "https://apolovyi.me",
    image: "https://apolovyi.me/img/me-circle.png",
    jobTitle: "Senior Full-Stack Software Engineer",
    email: "mailto:info@apolovyi.me",
    sameAs: ["https://www.linkedin.com/in/apolovyi", "https://github.com/apolovyi"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Zurich",
      addressCountry: "Switzerland",
    },
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Munich University of Applied Sciences",
        degree: "M.Sc.",
        fieldOfStudy: "Computer Vision and Machine Learning",
      },
      {
        "@type": "EducationalOrganization",
        name: "TH Köln - University of Applied Sciences",
        degree: "B.Sc.",
        fieldOfStudy: "Networks and Distributed Systems",
      },
      {
        "@type": "EducationalOrganization",
        name: "Telecommunications University Kyiv",
        degree: "B.Sc.",
        fieldOfStudy: "IT Security Management",
      },
    ],
    knowsLanguage: ["English", "German", "Ukrainian", "Russian"],
    worksFor: [
      {
        "@type": "Organization",
        name: "Virtual Identity AG",
        jobTitle: "Senior Full-Stack Engineer",
        startDate: "2022-02",
        endDate: "2024-01",
        url: "https://www.virtual-identity.com/",
      },
      {
        "@type": "Organization",
        name: "Spreadshirt",
        jobTitle: "Senior Full-Stack Engineer",
        startDate: "2021-11",
        endDate: "2022-02",
        url: "https://www.spreadshirt.com/",
      },
      {
        "@type": "Organization",
        name: "Comsysto Reply GmbH",
        jobTitle: "Full-Stack Engineer",
        startDate: "2019-02",
        endDate: "2021-10",
        url: "https://www.comsysto-reply.de/",
      },
      {
        "@type": "Organization",
        name: "SilverTours GmbH",
        jobTitle: "Student Full-Stack Developer",
        startDate: "2015-01",
        endDate: "2018-08",
        url: "https://www.silvertours.com/",
      },
    ],
    skills: ["Java", "Kotlin", "JavaScript", "TypeScript", "Spring Boot", "React", "AWS", "DevOps", "Test Automation"],
    award: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Certification",
      name: "AWS Certified Developer – Associate",
      dateAwarded: "2020-12",
    },
  };

  return (
    <html
      lang={lang}
      className={`${comfortaa.variable} ${quicksand.variable} ${ibmPlexMono.variable} ${merriweather.variable}`}
    >
      <body>
        <LanguageDetector />
        <AppProvider>{children}</AppProvider>
        <Script src="https://app.tinyanalytics.io/pixel/ooUXwijEAaOptnOe" strategy="afterInteractive" defer />
        <Script
          src="https://cloud.umami.is/script.js"
          strategy="afterInteractive"
          data-website-id="851d0366-78bf-4def-90ee-32f5764df198"
          defer
        />
        <Script
          id="ld-json"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
};

export default RootLayout;
