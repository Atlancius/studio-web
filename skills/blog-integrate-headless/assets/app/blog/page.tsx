import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  isGhostConfigured,
  formatPublishedDate,
  type GhostPost,
} from "@/lib/ghost";
import "./list-styles.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";

export const metadata = {
  title: "Blog, Articles récents",
  description: "Analyses, tutos, retours d'expérience.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await safeGetPosts();
  const [hero, ...rest] = posts;

  // JSON-LD : ItemList des articles publiés
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Articles du blog",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <div className="blog-list-root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd).replace(/</g, "\\u003c") }}
      />

      <header className="blog-list-header">
        <div className="blog-list-wrap">
          <h1 className="blog-list-title">Blog</h1>
        </div>
      </header>

      {!isGhostConfigured ? (
        <main className="blog-list-section">
          <div className="blog-list-wrap">
            <p className="blog-list-empty">
              Le blog est en cours de configuration. Les articles arrivent
              très bientôt.
            </p>
          </div>
        </main>
      ) : posts.length === 0 ? (
        <main className="blog-list-section">
          <div className="blog-list-wrap">
            <p className="blog-list-empty">
              Aucun article publié pour le moment.
            </p>
          </div>
        </main>
      ) : (
        <>
          {hero && <BlogHeroCard post={hero} />}
          {rest.length > 0 && (
            <main className="blog-list-section">
              <div className="blog-list-wrap">
                <div className="blog-list-grid">
                  {rest.map((post) => (
                    <BlogListCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </main>
          )}
        </>
      )}
    </div>
  );
}

function BlogHeroCard({ post }: { post: GhostPost }) {
  const tag = post.primary_tag?.name;
  return (
    <Link href={`/blog/${post.slug}`} className="blog-list-hero">
      {post.feature_image && (
        <div className="blog-list-hero-bg" aria-hidden>
          <Image
            src={post.feature_image}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            unoptimized
            className="blog-list-hero-img"
          />
          <div className="blog-list-hero-overlay" />
        </div>
      )}
      <div className="blog-list-hero-inner">
        <div className="blog-list-hero-eyebrow">À LA UNE</div>
        <div className="blog-list-hero-meta">
          {tag && <span className="blog-list-hero-tag">{tag}</span>}
          <span>{formatPublishedDate(post.published_at)}</span>
          <span>·</span>
          <span>{post.reading_time} min</span>
        </div>
        <h2 className="blog-list-hero-title">{post.title}</h2>
        {post.custom_excerpt && (
          <p className="blog-list-hero-excerpt">{post.custom_excerpt}</p>
        )}
        <span className="blog-list-hero-cta">Lire l'article →</span>
      </div>
    </Link>
  );
}

function BlogListCard({ post }: { post: GhostPost }) {
  const tag = post.primary_tag?.name;
  return (
    <Link href={`/blog/${post.slug}`} className="blog-list-card">
      {post.feature_image && (
        <div className="blog-list-card-image-wrap">
          <Image
            src={post.feature_image}
            alt={post.feature_image_alt ?? post.title}
            width={1200}
            height={800}
            className="blog-list-card-image"
            sizes="(max-width: 720px) 100vw, 33vw"
            unoptimized
          />
          <div className="blog-list-card-image-overlay" />
        </div>
      )}
      <div className="blog-list-card-body">
        <div className="blog-list-card-meta">
          {tag && <span className="blog-list-card-tag">{tag}</span>}
          <span className="blog-list-card-date">
            {formatPublishedDate(post.published_at)}
          </span>
        </div>
        <h2 className="blog-list-card-title">{post.title}</h2>
        <span className="blog-list-card-read">{post.reading_time} min</span>
      </div>
    </Link>
  );
}

async function safeGetPosts(): Promise<GhostPost[]> {
  try {
    return await getAllPosts("all");
  } catch (err) {
    console.error("[blog] Ghost fetch failed:", err);
    return [];
  }
}
