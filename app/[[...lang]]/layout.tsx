import { Comfortaa, IBM_Plex_Mono, Merriweather, Quicksand } from "next/font/google";
import { AppProvider } from "@/components/shared/AppContext";
import "@/styles/globals.css";
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

  return {
    title: {
      default: metadata.title.default,
      template: metadata.title.template,
    },
    metadataBase: new URL("https://apolovyi.me"),
    description: metadata.description,
    openGraph: {
      title: metadata.openGraph.title,
      description: metadata.openGraph.description,
      url: metadata.openGraph.url,
      siteName: metadata.openGraph.siteName,
      images: metadata.openGraph.images,
      locale: lang,
      type: metadata.openGraph.type as "website" | "article" | "book" | "profile",
    },
    robots: metadata.robots,
    icons: metadata.icons,
    alternates: {
      canonical: "/",
      languages: {
        en: "/en",
        "en-US": "/en",
        de: "/de",
        ch: "/ch",
        uk: "/uk",
        ru: "/ru",
      },
    },
    keywords: metadata.keywords,
  };
}

const RootLayout = ({ children, params }: { children: React.ReactNode; params: { lang: string[] } }) => {
  const lang = (params.lang?.[0] || i18n.defaultLocale) as Locale;
  return (
    <html
      lang={lang}
      className={`${comfortaa.variable} ${quicksand.variable} ${ibmPlexMono.variable} ${merriweather.variable}`}
    >
      <body>
        <LanguageDetector />
        <AppProvider>{children}</AppProvider>
        <Script src="https://app.tinyanalytics.io/pixel/ooUXwijEAaOptnOe" strategy="afterInteractive" defer />
      </body>
    </html>
  );
};

export default RootLayout;
