import { Comfortaa, IBM_Plex_Mono, Merriweather, Quicksand } from "next/font/google";
import { AppProvider } from "@/components/shared/AppContext";
import "@/styles/globals.css";
import Script from "next/script";
import type { Metadata } from "next";

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

const siteName = "Artem Polovyi - Software Engineer";
const siteUrl = "https://apolovyi.me";
const description =
  "Full-stack engineer with over 7 years of experience. Specializing in scalable web applications and cloud technologies.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  openGraph: {
    title: siteName,
    description,
    url: siteUrl,
    siteName,
    images: [
      {
        url: "/img/me-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Artem Polovyi - Software Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: {
    canonical: siteUrl,
  },
  keywords: ["Software Engineer", "Full-stack Developer", "Web Development", "Cloud Technologies"],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
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
