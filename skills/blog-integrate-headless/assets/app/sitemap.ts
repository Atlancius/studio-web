import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/ghost";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";

// Le sitemap est figé au build : sans revalidate, les articles publiés après
// le déploiement n'apparaissent pas.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Routes statiques : adapte cette liste à ton site. Pas de lastModified
  // sans date réelle de modification, pas de priority ni changeFrequency
  // (ignorés par Google).
  const staticRoutes = ["/", "/blog"];
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPosts("all");
    blogEntries = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
    }));
  } catch (err) {
    console.error("[sitemap] Ghost fetch failed, skipping blog entries:", err);
  }

  return [...staticEntries, ...blogEntries];
}
