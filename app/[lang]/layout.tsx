import { Comfortaa, IBM_Plex_Mono, Merriweather, Quicksand } from "next/font/google";
import { AppProvider } from "@/components/shared/AppContext";
import "@/styles/globals.css";
import Script from "next/script";
import { i18n, Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/dictionary";
import { Metadata } from "next";

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
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export function generateMetadata({ params }: { params: { lang: Locale } }): Metadata {
  const dictionary = getDictionary(params.lang);
  const { metadata } = dictionary;

  return {
    title: {
      default: metadata.title.default,
      template: metadata.title.template,
    },
    description: metadata.description,
    openGraph: {
      title: metadata.openGraph.title,
      description: metadata.openGraph.description,
      url: metadata.openGraph.url,
      siteName: metadata.openGraph.siteName,
      images: metadata.openGraph.images,
      locale: params.lang,
      type: metadata.openGraph.type as "website" | "article" | "book" | "profile", // Explicitly cast to allowed types
    },
    robots: metadata.robots,
    icons: metadata.icons,
    alternates: {
      canonical: metadata.alternates.canonical,
    },
    keywords: metadata.keywords,
  };
}

const RootLayout = ({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) => {
  return (
    <html
      lang={params.lang}
      className={`${comfortaa.variable} ${quicksand.variable} ${ibmPlexMono.variable} ${merriweather.variable}`}
    >
      <body>
        <AppProvider>{children}</AppProvider>
        <Script src="https://app.tinyanalytics.io/pixel/ooUXwijEAaOptnOe" strategy="afterInteractive" defer />
      </body>
    </html>
  );
};

export default RootLayout;
