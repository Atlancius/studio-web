"use client";

import { useState } from "react";
import type { Cocon } from "@/lib/cocon";

type Stats = {
  filles: number;
  petites_filles_total: number;
  published: number;
  draft: number;
  planned: number;
};

type BriefResult = {
  brief?: unknown;
  usage?: { input_tokens: number; output_tokens: number };
  stop_reason?: string;
  error?: string;
  raw?: string;
};

type Article = {
  html: string;
  meta_title: string;
  meta_description: string;
  custom_excerpt: string;
  og_title: string;
  og_description: string;
  tags: string[];
  primary_tag: string;
  feature_image_prompt: string;
};

type ArticleResult = {
  brief?: unknown;
  article?: Article;
  usage?: {
    brief: { input_tokens: number; output_tokens: number };
    article: { input_tokens: number; output_tokens: number };
    total_input: number;
    total_output: number;
  };
  stop_reason?: string;
  error?: string;
};

// Feuille de style de l'aperçu (injectée dans l'iframe sandboxé).
const PREVIEW_CSS = `
body {
  background: #fff;
  padding: 32px 36px;
  max-width: 720px;
  margin: 0 auto;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 17px;
  line-height: 1.65;
  color: #1a1a1f;
}
h2 {
  font-family:
    ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
  margin: 32px 0 12px;
}
h2:first-child { margin-top: 0; }
h3 {
  font-family:
    ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  margin: 24px 0 8px;
}
p { margin: 0 0 16px; }
ul,
ol { margin: 0 0 16px; padding-left: 24px; }
li { margin-bottom: 6px; }
a {
  color: <ACCENT_COLOR>;
  text-decoration: underline;
  text-underline-offset: 2px;
}
strong { font-weight: 700; }
em { font-style: italic; }
code {
  background: #f0f0f3;
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, "SF Mono", monospace;
  font-size: 14px;
}
pre {
  background: #1a1a1f;
  color: #e5e5e8;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.55;
}
pre code {
  background: transparent;
  padding: 0;
  color: inherit;
}
blockquote {
  border-left: 3px solid <ACCENT_COLOR>;
  padding-left: 16px;
  margin: 16px 0;
  font-style: italic;
  color: #4b4b53;
}
hr {
  border: none;
  border-top: 1px solid #e5e5e8;
  margin: 24px 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #1a1a1f;
  margin: 24px 0;
  font-size: 14px;
  line-height: 1.5;
  background: #fff;
}
thead th {
  background: #f5f3f7;
  padding: 14px 16px;
  text-align: left;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
tbody tr { border-top: 1px solid #e5e5e8; }
tbody th,
tbody td { padding: 14px 16px; vertical-align: top; }
tbody th { font-weight: 600; background: #fafafb; }
`;

type View = "brief" | "article" | null;

type PublishResult = {
  ok?: boolean;
  mode?: "created" | "updated";
  post?: { id: string; slug: string; status: string };
  adminUrl?: string;
  featureImage?: {
    url: string | null;
    status: "skipped" | "generated" | "failed";
    error?: string;
  };
  error?: string;
};

export default function AdminClient({
  cocon,
  stats,
  logoutAction,
  initialBriefs = {},
  initialArticles = {},
  initialPublished = {},
}: {
  cocon: Cocon;
  stats: Stats;
  logoutAction: () => Promise<void>;
  initialBriefs?: Record<string, unknown>;
  initialArticles?: Record<string, unknown>;
  initialPublished?: Record<string, unknown>;
}) {
  const [briefs, setBriefs] = useState<Record<string, BriefResult>>(
    initialBriefs as Record<string, BriefResult>,
  );
  const [articles, setArticles] = useState<Record<string, ArticleResult>>(
    initialArticles as Record<string, ArticleResult>,
  );
  const [loadingBrief, setLoadingBrief] = useState<Record<string, boolean>>({});
  const [loadingArticle, setLoadingArticle] = useState<
    Record<string, boolean>
  >({});
  const [openView, setOpenView] = useState<Record<string, View>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<Record<string, boolean>>({});
  const [published, setPublished] = useState<Record<string, PublishResult>>(
    initialPublished as Record<string, PublishResult>,
  );

  async function generateBrief(filleSlug: string, pfSlug: string) {
    const key = `${filleSlug}/${pfSlug}`;
    setLoadingBrief((l) => ({ ...l, [key]: true }));
    setOpenView((v) => ({ ...v, [key]: "brief" }));
    try {
      const res = await fetch("/api/cocon/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filleSlug, pfSlug }),
      });
      const data: BriefResult = await res.json();
      setBriefs((b) => ({ ...b, [key]: data }));
    } catch (err) {
      setBriefs((b) => ({
        ...b,
        [key]: { error: err instanceof Error ? err.message : String(err) },
      }));
    } finally {
      setLoadingBrief((l) => ({ ...l, [key]: false }));
    }
  }

  async function generateArticle(filleSlug: string, pfSlug: string) {
    const key = `${filleSlug}/${pfSlug}`;
    setLoadingArticle((l) => ({ ...l, [key]: true }));
    setOpenView((v) => ({ ...v, [key]: "article" }));
    try {
      const res = await fetch("/api/cocon/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filleSlug, pfSlug }),
      });
      const data: ArticleResult = await res.json();
      setArticles((a) => ({ ...a, [key]: data }));
    } catch (err) {
      setArticles((a) => ({
        ...a,
        [key]: { error: err instanceof Error ? err.message : String(err) },
      }));
    } finally {
      setLoadingArticle((l) => ({ ...l, [key]: false }));
    }
  }

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  }

  async function publishToGhost(filleSlug: string, pfSlug: string) {
    const key = `${filleSlug}/${pfSlug}`;
    if (!articles[key]?.article) return;
    setPublishing((p) => ({ ...p, [key]: true }));
    setPublished((p) => {
      const next = { ...p };
      delete next[key];
      return next;
    });
    try {
      const res = await fetch("/api/cocon/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filleSlug, pfSlug }),
      });
      const data: PublishResult = await res.json();
      setPublished((p) => ({ ...p, [key]: data }));
    } catch (err) {
      setPublished((p) => ({
        ...p,
        [key]: { error: err instanceof Error ? err.message : String(err) },
      }));
    } finally {
      setPublishing((p) => ({ ...p, [key]: false }));
    }
  }

  return (
    <div className="cocon-admin">
      <header className="cocon-admin-header">
        <div>
          <h1>Cocon Admin</h1>
          <p className="cocon-admin-lede">
            {stats.filles} piliers · {stats.petites_filles_total} articles
            total · <strong>{stats.published}</strong> publié(s) ·{" "}
            <strong>{stats.draft}</strong> draft(s) · {stats.planned}{" "}
            planifié(s)
          </p>
        </div>
        <form action={logoutAction}>
          <button className="cocon-admin-logout" type="submit">
            Déconnexion
          </button>
        </form>
      </header>

      {cocon.filles.map((fille) => (
        <section key={fille.slug} className="cocon-admin-fille">
          <header className="cocon-admin-fille-head">
            <div>
              <h2>{fille.title}</h2>
              <p className="cocon-admin-fille-meta">
                Mot-clé : <code>{fille.keyword}</code> · Persona :{" "}
                <code>{fille.persona}</code> · CTA :{" "}
                <code>{fille.cta_principal}</code>
              </p>
            </div>
            <span className={`cocon-status cocon-status--${fille.status}`}>
              {fille.status}
            </span>
          </header>

          <ul className="cocon-admin-pf-list">
            {fille.petites_filles.map((pf) => {
              const key = `${fille.slug}/${pf.slug}`;
              const briefResult = briefs[key];
              const articleResult = articles[key];
              const isLoadingBrief = loadingBrief[key];
              const isLoadingArticle = loadingArticle[key];
              const view = openView[key];
              return (
                <li key={pf.slug} className="cocon-admin-pf">
                  <div className="cocon-admin-pf-row">
                    <div className="cocon-admin-pf-info">
                      <span
                        className={`cocon-status cocon-status--${pf.status}`}
                      >
                        {pf.status}
                      </span>
                      <div>
                        <div className="cocon-admin-pf-title">{pf.title}</div>
                        <div className="cocon-admin-pf-keyword">
                          <code>{pf.keyword}</code>
                          {pf.ghost_slug && (
                            <span className="cocon-admin-pf-ghost">
                              · Ghost : <code>{pf.ghost_slug}</code>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="cocon-admin-pf-actions">
                      {pf.status !== "published" && (
                        <>
                          <button
                            type="button"
                            className="cocon-btn cocon-btn-primary"
                            onClick={() =>
                              generateArticle(fille.slug, pf.slug)
                            }
                            disabled={isLoadingArticle}
                            title="P1 brief + P2 article complet · ~30-60 s · ~0,15 €"
                          >
                            {isLoadingArticle
                              ? "Rédaction..."
                              : articleResult?.article
                                ? "Régénérer l'article"
                                : "Générer l'article"}
                          </button>
                          <button
                            type="button"
                            className="cocon-btn cocon-btn-light"
                            onClick={() => generateBrief(fille.slug, pf.slug)}
                            disabled={isLoadingBrief}
                            title="P1 brief seul · ~10 s · ~0,02 €"
                          >
                            {isLoadingBrief ? "..." : "Brief seul"}
                          </button>
                        </>
                      )}
                      {(briefResult || articleResult) && (
                        <div className="cocon-tabs">
                          {articleResult && (
                            <button
                              type="button"
                              className={`cocon-tab${view === "article" ? " is-active" : ""}`}
                              onClick={() =>
                                setOpenView((v) => ({
                                  ...v,
                                  [key]:
                                    v[key] === "article" ? null : "article",
                                }))
                              }
                            >
                              Article
                            </button>
                          )}
                          {briefResult && (
                            <button
                              type="button"
                              className={`cocon-tab${view === "brief" ? " is-active" : ""}`}
                              onClick={() =>
                                setOpenView((v) => ({
                                  ...v,
                                  [key]: v[key] === "brief" ? null : "brief",
                                }))
                              }
                            >
                              Brief
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {view === "brief" && briefResult && (
                    <BriefView result={briefResult} loading={isLoadingBrief} />
                  )}
                  {view === "article" && articleResult && (
                    <ArticleView
                      result={articleResult}
                      loading={isLoadingArticle}
                      onCopy={copy}
                      copiedLabel={copied}
                      uniqueKey={key}
                      onPublish={() => publishToGhost(fille.slug, pf.slug)}
                      isPublishing={publishing[key] ?? false}
                      publishResult={published[key]}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

function BriefView({
  result,
  loading,
}: {
  result: BriefResult;
  loading: boolean;
}) {
  return (
    <div className="cocon-admin-output">
      {loading && (
        <div className="cocon-admin-loading">
          Génération du brief en cours (~10 s)...
        </div>
      )}
      {result.error && (
        <div className="cocon-admin-error">
          <strong>Erreur :</strong> {result.error}
          {result.raw && <pre className="cocon-admin-raw">{result.raw}</pre>}
        </div>
      )}
      {result.brief != null && (
        <>
          <div className="cocon-admin-usage">
            Tokens, entrée : {result.usage?.input_tokens ?? "?"} · sortie :{" "}
            {result.usage?.output_tokens ?? "?"} · stop:{" "}
            <strong
              style={{
                color:
                  result.stop_reason === "end_turn" ? "#065f46" : "#b00",
              }}
            >
              {result.stop_reason ?? "?"}
            </strong>
          </div>
          <pre className="cocon-admin-json">
            {JSON.stringify(result.brief, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

function ArticleView({
  result,
  loading,
  onCopy,
  copiedLabel,
  uniqueKey,
  onPublish,
  isPublishing,
  publishResult,
}: {
  result: ArticleResult;
  loading: boolean;
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
  uniqueKey: string;
  onPublish: () => void;
  isPublishing: boolean;
  publishResult?: PublishResult;
}) {
  return (
    <div className="cocon-admin-output">
      {loading && (
        <div className="cocon-admin-loading">
          Pipeline en cours : P1 brief → P2 rédaction (~30-60 s)...
        </div>
      )}
      {result.error && (
        <div className="cocon-admin-error">
          <strong>Erreur :</strong> {result.error}
        </div>
      )}
      {result.article && (
        <>
          <div className="cocon-admin-usage">
            Tokens, total entrée :{" "}
            <strong>{result.usage?.total_input ?? "?"}</strong> · total sortie :{" "}
            <strong>{result.usage?.total_output ?? "?"}</strong> · stop:{" "}
            <strong
              style={{
                color:
                  result.stop_reason === "end_turn" ? "#065f46" : "#b00",
              }}
            >
              {result.stop_reason ?? "?"}
            </strong>
            {result.usage && (
              <span className="cocon-admin-usage-detail">
                {" "}
                (P1 : {result.usage.brief.input_tokens}→
                {result.usage.brief.output_tokens} · P2 :{" "}
                {result.usage.article.input_tokens}→
                {result.usage.article.output_tokens})
              </span>
            )}
          </div>

          <div className="cocon-meta-grid">
            <MetaField
              label="Meta title"
              value={result.article.meta_title}
              max={60}
              copyKey={`${uniqueKey}-meta-title`}
              onCopy={onCopy}
              copiedLabel={copiedLabel}
            />
            <MetaField
              label="Meta description"
              value={result.article.meta_description}
              max={155}
              copyKey={`${uniqueKey}-meta-desc`}
              onCopy={onCopy}
              copiedLabel={copiedLabel}
            />
            <MetaField
              label="Custom excerpt (Ghost)"
              value={result.article.custom_excerpt}
              copyKey={`${uniqueKey}-excerpt`}
              onCopy={onCopy}
              copiedLabel={copiedLabel}
            />
            <MetaField
              label="OG title"
              value={result.article.og_title}
              copyKey={`${uniqueKey}-og-title`}
              onCopy={onCopy}
              copiedLabel={copiedLabel}
            />
            <MetaField
              label="OG description"
              value={result.article.og_description}
              copyKey={`${uniqueKey}-og-desc`}
              onCopy={onCopy}
              copiedLabel={copiedLabel}
            />
            <MetaField
              label="Tags Ghost"
              value={result.article.tags.join(", ")}
              copyKey={`${uniqueKey}-tags`}
              onCopy={onCopy}
              copiedLabel={copiedLabel}
            />
            <MetaField
              label="Primary tag"
              value={result.article.primary_tag}
              copyKey={`${uniqueKey}-ptag`}
              onCopy={onCopy}
              copiedLabel={copiedLabel}
            />
            <MetaField
              label="Prompt image hero (fal.ai)"
              value={result.article.feature_image_prompt}
              copyKey={`${uniqueKey}-img`}
              onCopy={onCopy}
              copiedLabel={copiedLabel}
            />
          </div>

          <div className="cocon-article-actions">
            <button
              type="button"
              className="cocon-btn cocon-btn-publish"
              onClick={onPublish}
              disabled={isPublishing}
              title="Génère l'image hero (fal.ai) puis crée/met à jour le draft Ghost"
            >
              {isPublishing
                ? "Image + Ghost (~30-60 s)..."
                : publishResult?.ok
                  ? `✓ ${publishResult.mode === "created" ? "Créé" : "Mis à jour"} dans Ghost, republier`
                  : "Publier en draft sur Ghost"}
            </button>
            <button
              type="button"
              className="cocon-btn cocon-btn-primary"
              onClick={() =>
                onCopy(result.article!.html, `${uniqueKey}-html`)
              }
            >
              {copiedLabel === `${uniqueKey}-html`
                ? "✓ HTML copié"
                : "Copier le HTML"}
            </button>
            <button
              type="button"
              className="cocon-btn cocon-btn-light"
              onClick={() =>
                onCopy(
                  JSON.stringify(result.article, null, 2),
                  `${uniqueKey}-json`,
                )
              }
            >
              {copiedLabel === `${uniqueKey}-json`
                ? "✓ JSON copié"
                : "Copier le JSON"}
            </button>
          </div>

          {publishResult?.ok && publishResult.adminUrl && (
            <div className="cocon-publish-success">
              <strong>
                ✓{" "}
                {publishResult.mode === "created"
                  ? "Article créé"
                  : "Article mis à jour"}{" "}
                dans Ghost (statut : draft).
              </strong>
              <br />
              <a
                href={publishResult.adminUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                → Ouvrir dans Ghost admin pour relire et publier
              </a>
              {publishResult.featureImage?.status === "generated" &&
                publishResult.featureImage.url && (
                  <div className="cocon-publish-image">
                    <span className="cocon-publish-image-label">
                      Image hero générée et attachée :
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={publishResult.featureImage.url}
                      alt="Feature image"
                      className="cocon-publish-image-preview"
                    />
                  </div>
                )}
              {publishResult.featureImage?.status === "failed" && (
                <div className="cocon-publish-image-warn">
                  Image non générée :{" "}
                  {publishResult.featureImage.error ?? "fal.ai a échoué"}
                  <span className="cocon-publish-image-hint">
                    {" "}
                   , l'article est publié sans image, tu peux en ajouter une à la main dans Ghost.
                  </span>
                </div>
              )}
              {publishResult.featureImage?.status === "skipped" && (
                <div className="cocon-publish-image-warn">
                  Image non générée (FAL_KEY non configurée). Ajoute{" "}
                  <code>FAL_KEY=...</code> dans <code>.env.local</code> pour
                  activer la génération automatique.
                </div>
              )}
            </div>
          )}
          {publishResult?.error && (
            <div className="cocon-publish-error">
              <strong>Échec publication Ghost :</strong> {publishResult.error}
            </div>
          )}

          <div className="cocon-article-preview-label">
            Aperçu (rendu HTML)
          </div>
          {/* HTML généré par un LLM : rendu isolé dans un iframe sandboxé (aucun script) */}
          <iframe
            className="cocon-article-preview"
            sandbox=""
            title="Aperçu de l'article"
            srcDoc={`<style>${PREVIEW_CSS}</style>${result.article.html}`}
          />
        </>
      )}
    </div>
  );
}

function MetaField({
  label,
  value,
  max,
  copyKey,
  onCopy,
  copiedLabel,
}: {
  label: string;
  value: string;
  max?: number;
  copyKey: string;
  onCopy: (text: string, label: string) => void;
  copiedLabel: string | null;
}) {
  const overLimit = max != null && value.length > max;
  return (
    <div className="cocon-meta-field">
      <div className="cocon-meta-label">
        <span>{label}</span>
        {max != null && (
          <span className={`cocon-meta-count${overLimit ? " is-over" : ""}`}>
            {value.length}/{max}
          </span>
        )}
        <button
          type="button"
          className="cocon-meta-copy"
          onClick={() => onCopy(value, copyKey)}
          aria-label={`Copier ${label}`}
        >
          {copiedLabel === copyKey ? "✓" : "Copier"}
        </button>
      </div>
      <div className="cocon-meta-value">{value}</div>
    </div>
  );
}
