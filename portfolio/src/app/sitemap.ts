import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Update with actual domain when deployed
  const baseUrl = "https://albinreji.dev";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
