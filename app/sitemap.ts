import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://apolovyi.me",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: "https://apolovyi.me/en",
          de: "https://apolovyi.me/de",
          ch: "https://apolovyi.me/ch",
          uk: "https://apolovyi.me/uk",
          ru: "https://apolovyi.me/ru",
        },
      },
    },
  ];
}
