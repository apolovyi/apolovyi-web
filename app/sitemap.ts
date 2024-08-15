import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://andon-okapi.com",
      lastModified: new Date(),
    },
  ];
}
