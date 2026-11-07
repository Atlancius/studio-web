/**
 * Filet de sécurité : valide tous les liens internes d'un HTML généré
 * et remplace les liens cassés par une URL de fallback (la pilier-parent).
 *
 * Pourquoi : même avec un prompt strict, le LLM peut inventer des URLs
 * type `/blog/article-inexistant`. Sans validation, on publierait des
 * 404 dans Ghost, mauvais pour le SEO et l'UX.
 *
 * Politique :
 *   - href absolu (http://, https://, mailto:, tel:) → laissé tel quel
 *   - href interne match allowedUrls                  → laissé tel quel
 *   - href interne PAS match allowedUrls              → remplacé par fallbackUrl
 *   - href = "#anchor"                                → laissé tel quel
 */

export type ValidationResult = {
  cleaned: string;
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  rewrittenLinks: Array<{ original: string; rewritten: string }>;
};

const HREF_REGEX = /href=("|')([^"'>]+?)\1/g;

function isExternal(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href);
}

function isAnchor(href: string): boolean {
  return href.startsWith("#");
}

function normalizeInternal(href: string): string {
  return href.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";
}

export function validateLinks(
  html: string,
  allowedUrls: Set<string>,
  fallbackUrl: string,
): ValidationResult {
  const allowed = new Set<string>();
  for (const u of allowedUrls) {
    allowed.add(normalizeInternal(u));
  }

  const rewrittenLinks: Array<{ original: string; rewritten: string }> = [];
  let totalLinks = 0;
  let internalLinks = 0;
  let externalLinks = 0;

  const cleaned = html.replace(
    HREF_REGEX,
    (match, quote: string, href: string) => {
      totalLinks++;
      if (isExternal(href) || isAnchor(href)) {
        externalLinks++;
        return match;
      }
      internalLinks++;
      const normalized = normalizeInternal(href);
      if (allowed.has(normalized)) {
        return match;
      }
      rewrittenLinks.push({ original: href, rewritten: fallbackUrl });
      return `href=${quote}${fallbackUrl}${quote}`;
    },
  );

  return {
    cleaned,
    totalLinks,
    internalLinks,
    externalLinks,
    rewrittenLinks,
  };
}
