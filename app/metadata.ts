import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artem Polovyi - Software Engineer",
  description:
    "I've been working as a full-stack engineer for more than 7 years. Get in touch with me to know more.",
  openGraph: {
    title: "Artem Polovyi - Software Engineer",
    description:
      "I've been working as a full-stack engineer for more than 7 years. Get in touch with me to know more.",
    url: "https://apolovyi.me",
    siteName: "Artem Polovyi",
    images: [
      {
        url: "/me-circle.png",
        width: 800,
        height: 600,
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
  twitter: {
    title: "Artem Polovyi - Software Engineer",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.ico",
  },
  verification: {
    google: "your-google-site-verification-code",
    yandex: "your-yandex-verification-code",
  },
};
