import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getPostBySlug,
  getPostSlugs,
  formatPublishedDate,
  type GhostPost,
} from "@/lib/ghost";
import "../styles.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const slugs = await getPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    console.error("[blog] generateStaticParams failed:", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await safeGetPost(slug);
  if (!post) {
    return { title: "Article introuvable", robots: { index: false } };
  }
  const title = post.meta_title ?? post.title;
  const description =
    post.meta_description ??
    post.custom_excerpt ??
    post.excerpt.slice(0, 160);
  const ogImage = post.og_image ?? post.feature_image ?? undefined;
  return {
    title,
    description,
    alternates: { canonical: post.canonical_url ?? `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.og_title ?? title,
      description: post.og_description ?? description,
      url: `${SITE_URL}/blog/${slug}`,
      images: ogImage ? [{ url: ogImage }] : [],
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: post.authors?.map((a) => a.name) ?? [],
      tags: post.tags?.map((t) => t.name) ?? [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.twitter_title ?? title,
      description: post.twitter_description ?? description,
      images: post.twitter_image
        ? [post.twitter_image]
        : ogImage
          ? [ogImage]
          : [],
    },
  };
}

async function safeGetPost(slug: string): Promise<GhostPost | null> {
  try {
    return await getPostBySlug(slug);
  } catch (err) {
    console.error(`[blog] getPostBySlug(${slug}) failed:`, err);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await safeGetPost(slug);
  if (!post) notFound();

  const tag = post.primary_tag?.name;
  const author = post.primary_author;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.custom_excerpt ?? post.excerpt,
    image: post.feature_image ?? undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: author
      ? { "@type": "Person", name: author.name }
      : { "@type": "Organization", name: "Site" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
    keywords: post.tags?.map((t) => t.name).join(", "),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };

  return (
    <div className="blog-root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <article className="blog-post">
        <header
          className={`blog-post-hero${post.feature_image ? " blog-post-hero--with-image" : ""}`}
        >
          {post.feature_image && (
            <div className="blog-post-hero-bg" aria-hidden>
              <Image
                src={post.feature_image}
                alt=""
                fill
                sizes="100vw"
                loading="eager"
                unoptimized
                className="blog-post-hero-bg-img"
              />
              <div className="blog-post-hero-bg-overlay" />
            </div>
          )}
          <div className="blog-wrap">
            <nav className="blog-post-breadcrumb" aria-label="Breadcrumb">
              <Link href="/blog">Blog</Link>
              <span className="blog-post-breadcrumb-sep">/</span>
              <span>{post.title}</span>
            </nav>
            <div className="blog-post-meta-top">
              {tag && <span className="blog-card-category">{tag}</span>}
              <span>{formatPublishedDate(post.published_at)}</span>
              <span>·</span>
              <span>{post.reading_time} min de lecture</span>
            </div>
            <h1 className="blog-post-title">{post.title}</h1>
            {post.custom_excerpt && (
              <p className="blog-post-excerpt">{post.custom_excerpt}</p>
            )}
            {author && (
              <div className="blog-post-author">
                {author.profile_image && (
                  <Image
                    src={author.profile_image}
                    alt={author.name}
                    width={48}
                    height={48}
                    className="blog-post-author-avatar"
                    unoptimized
                  />
                )}
                <span>Par {author.name}</span>
              </div>
            )}
          </div>
        </header>

        <section className="blog-post-body-section">
          <div className="blog-wrap">
            <div
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </div>
        </section>
      </article>
    </div>
  );
}
