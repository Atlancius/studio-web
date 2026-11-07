/**
 * Ghost Admin API client (JWT HS256).
 *
 * Docs: https://ghost.org/docs/admin-api/
 *
 * Env :
 *   GHOST_URL              ex : https://wonderful-caribou.pikapod.net (sans slash final)
 *   GHOST_ADMIN_API_KEY    format "<24-hex-id>:<64-hex-secret>"
 *
 * Pattern : on signe un JWT HS256 valide 5 min, on l'envoie en
 * header `Authorization: Ghost <token>` à chaque requête.
 *
 * Utilisé par /api/cocon/publish pour pousser les articles générés
 * en mode `draft` (jamais published direct, review humaine obligatoire).
 */

import { createHmac } from "node:crypto";

const ACCEPT_VERSION = "v5.0";
const TOKEN_TTL_SECONDS = 5 * 60;

export type GhostPostInput = {
  slug: string;
  title: string;
  html: string;
  meta_title?: string;
  meta_description?: string;
  custom_excerpt?: string;
  og_title?: string;
  og_description?: string;
  twitter_title?: string;
  twitter_description?: string;
  tags?: string[];
  feature_image?: string;
  feature_image_alt?: string;
  feature_image_caption?: string;
  status?: "draft" | "published";
};

export type GhostPost = {
  id: string;
  uuid: string;
  slug: string;
  title: string;
  status: string;
  url: string;
  updated_at: string;
};

export type UpsertResult = {
  mode: "created" | "updated";
  post: GhostPost;
  adminUrl: string;
};

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signJwt(adminKey: string): string {
  const [id, secret] = adminKey.split(":");
  if (!id || !secret) {
    throw new Error(
      "GHOST_ADMIN_API_KEY format invalide, attendu '<id>:<secret>'",
    );
  }
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT", kid: id };
  const payload = { iat: now, exp: now + TOKEN_TTL_SECONDS, aud: "/admin/" };
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signature = createHmac("sha256", Buffer.from(secret, "hex"))
    .update(signingInput)
    .digest();
  return `${signingInput}.${base64url(signature)}`;
}

function getConfig() {
  const ghostUrl = process.env.GHOST_URL?.replace(/\/$/, "");
  const adminKey = process.env.GHOST_ADMIN_API_KEY;
  if (!ghostUrl) throw new Error("GHOST_URL non configurée");
  if (!adminKey) throw new Error("GHOST_ADMIN_API_KEY non configurée");
  return { ghostUrl, adminKey };
}

function buildHeaders(adminKey: string): HeadersInit {
  return {
    Authorization: `Ghost ${signJwt(adminKey)}`,
    "Content-Type": "application/json",
    "Accept-Version": ACCEPT_VERSION,
  };
}

const GHOST_LIMITS = {
  title: 255,
  custom_excerpt: 300,
  meta_title: 300,
  meta_description: 500,
  og_title: 300,
  og_description: 500,
  twitter_title: 300,
  twitter_description: 500,
} as const;

function clamp(value: string | undefined, max: number): string | undefined {
  if (!value) return value;
  if (value.length <= max) return value;
  const slice = value.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cleaned = (lastSpace > max * 0.7 ? slice.slice(0, lastSpace) : slice)
    .replace(/[\s.,;:!?—-]+$/, "");
  return `${cleaned}…`;
}

async function findPostBySlug(
  slug: string,
): Promise<{ id: string; updated_at: string } | null> {
  const { ghostUrl, adminKey } = getConfig();
  const res = await fetch(
    `${ghostUrl}/ghost/api/admin/posts/slug/${encodeURIComponent(slug)}/?fields=id,updated_at`,
    { headers: buildHeaders(adminKey) },
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Ghost lookup ${res.status}: ${body || res.statusText}`);
  }
  const data = (await res.json()) as {
    posts: { id: string; updated_at: string }[];
  };
  return data.posts[0] ?? null;
}

export async function upsertPost(
  input: GhostPostInput,
): Promise<UpsertResult> {
  const { ghostUrl, adminKey } = getConfig();

  const postPayload: Record<string, unknown> = {
    slug: input.slug,
    title: clamp(input.title, GHOST_LIMITS.title),
    status: "draft",
    meta_title: clamp(input.meta_title, GHOST_LIMITS.meta_title),
    meta_description: clamp(
      input.meta_description,
      GHOST_LIMITS.meta_description,
    ),
    custom_excerpt: clamp(input.custom_excerpt, GHOST_LIMITS.custom_excerpt),
    og_title: clamp(input.og_title, GHOST_LIMITS.og_title),
    og_description: clamp(input.og_description, GHOST_LIMITS.og_description),
    twitter_title: clamp(
      input.twitter_title ?? input.og_title,
      GHOST_LIMITS.twitter_title,
    ),
    twitter_description: clamp(
      input.twitter_description ?? input.og_description,
      GHOST_LIMITS.twitter_description,
    ),
    html: input.html,
    feature_image: input.feature_image,
    feature_image_alt: input.feature_image_alt,
    feature_image_caption: input.feature_image_caption,
  };
  if (input.tags && input.tags.length > 0) {
    postPayload.tags = input.tags.map((name) => ({ name }));
  }

  const existing = await findPostBySlug(input.slug);

  let res: Response;
  let mode: "created" | "updated";

  if (existing) {
    postPayload.updated_at = existing.updated_at;
    res = await fetch(
      `${ghostUrl}/ghost/api/admin/posts/${existing.id}/?source=html`,
      {
        method: "PUT",
        headers: buildHeaders(adminKey),
        body: JSON.stringify({ posts: [postPayload] }),
      },
    );
    mode = "updated";
  } else {
    res = await fetch(`${ghostUrl}/ghost/api/admin/posts/?source=html`, {
      method: "POST",
      headers: buildHeaders(adminKey),
      body: JSON.stringify({ posts: [postPayload] }),
    });
    mode = "created";
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Ghost ${mode} ${res.status}: ${body || res.statusText}`);
  }

  const data = (await res.json()) as { posts: GhostPost[] };
  const post = data.posts[0];
  if (!post) throw new Error(`Ghost ${mode}: réponse sans post`);

  return {
    mode,
    post,
    adminUrl: `${ghostUrl}/ghost/#/editor/post/${post.id}`,
  };
}

export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType = "image/jpeg",
): Promise<{ url: string; ref: string | null }> {
  const { ghostUrl, adminKey } = getConfig();
  const blob = new Blob([new Uint8Array(buffer)], { type: contentType });
  const formData = new FormData();
  formData.append("file", blob, filename);
  formData.append("purpose", "image");

  const res = await fetch(`${ghostUrl}/ghost/api/admin/images/upload/`, {
    method: "POST",
    headers: {
      Authorization: `Ghost ${signJwt(adminKey)}`,
      "Accept-Version": ACCEPT_VERSION,
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Ghost image upload ${res.status}: ${body || res.statusText}`,
    );
  }

  const data = (await res.json()) as {
    images: { url: string; ref: string | null }[];
  };
  const image = data.images?.[0];
  if (!image) throw new Error("Ghost image upload: réponse sans image");
  return image;
}
