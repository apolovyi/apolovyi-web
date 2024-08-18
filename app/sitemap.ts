import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://apolovyi.me",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://apolovyi.me/en",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // {
    //   url: "https://apolovyi.me/en-us",
    //   lastModified: new Date(),
    //   changeFrequency: "weekly",
    //   priority: 1,
    // },
    {
      url: "https://apolovyi.me/de",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://apolovyi.me/ch",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://apolovyi.me/ua",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://apolovyi.me/ru",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
