import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/coins`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/portfolio`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/alerts`, changeFrequency: "weekly", priority: 0.6 },
  ];
}
