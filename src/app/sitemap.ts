import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

const ROUTES = [
  "",
  "/work/text-to-sql",
  "/work/sentinel",
  "/work/log2agent",
  "/work/dgm4",
  "/work/ballistic",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.8,
  }));
}
