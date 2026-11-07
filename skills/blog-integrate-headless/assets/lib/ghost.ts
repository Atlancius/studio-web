/**
 * Ghost Content API client (read-only, public key).
 *
 * Docs: https://ghost.org/docs/content-api/
 *
 * All fetches are tagged "blog" for on-demand revalidation via
 * `app/api/revalidate-blog/route.ts` (called by Ghost webhook).
 */

const GHOST_URL = process.env.GHOST_URL?.replace(/\/$/, "") ?? "";
const GHOST_KEY = process.env.GHOST_CONTENT_API_KEY ?? "";

const DEFAULT_REVALIDATE = 3600; // 1h ISR fallback if webhook misses
const BLOG_TAG = "blog";
const ACCEPT_VERSION = "v5.0";

export const isGhostConfigured = Boolean(GHOST_URL && GHOST_KEY);

export type GhostTag = {
  id: string;
  name: string;
  slug: string;
};

export type GhostAuthor = {
  id: string;
  name: string;
  slug: string;
  profile_image: string | null;
  bio: string | null;
};

export type GhostPost = {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  feature_image: string | null;
  feature_image_alt: string | null;
  feature_image_caption: string | null;
  excerpt: string;
  custom_excerpt: string | null;
  reading_time: number;
  published_at: string;
  updated_at: string;
  tags?: GhostTag[];
  authors?: GhostAuthor[];
  primary_tag?: GhostTag | null;
  primary_author?: GhostAuthor | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  canonical_url: string | null;
};

type Pagination = {
  page: number;
  limit: number;
  pages: number;
  total: number;
  next: number | null;
  prev: number | null;
};

type PostsResponse = { posts: GhostPost[]; meta: { pagination: Pagination } };

function buildUrl(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${GHOST_URL}/ghost/api/content${path}`);
  url.searchParams.set("key", GHOST_KEY);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

async function ghostFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { "Accept-Version": ACCEPT_VERSION },
    next: { revalidate: DEFAULT_REVALIDATE, tags: [BLOG_TAG] },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Ghost API ${res.status} ${res.statusText}, ${url}\n${body}`,
    );
  }
  return res.json() as Promise<T>;
}

export async function getAllPosts(
  limit: number | "all" = "all",
): Promise<GhostPost[]> {
  if (!isGhostConfigured) return [];
  const url = buildUrl("/posts/", {
    limit,
    include: "tags,authors",
    order: "published_at desc",
  });
  const data = await ghostFetch<PostsResponse>(url);
  return data.posts;
}

export async function getPostBySlug(slug: string): Promise<GhostPost | null> {
  if (!isGhostConfigured) return null;
  const url = buildUrl(`/posts/slug/${encodeURIComponent(slug)}/`, {
    include: "tags,authors",
  });
  try {
    const data = await ghostFetch<PostsResponse>(url);
    return data.posts[0] ?? null;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("404")) return null;
    throw err;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  if (!isGhostConfigured) return [];
  const url = buildUrl("/posts/", {
    limit: "all",
    fields: "slug",
    order: "published_at desc",
  });
  const data = await ghostFetch<PostsResponse>(url);
  return data.posts.map((p) => p.slug);
}

export function formatPublishedDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export const GHOST_CACHE_TAG = BLOG_TAG;
