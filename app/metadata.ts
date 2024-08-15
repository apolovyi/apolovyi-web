import type { Metadata } from "next";

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
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
  },
  keywords: ["Software Engineer", "Full-stack Developer", "Web Development", "Cloud Technologies"],
};
