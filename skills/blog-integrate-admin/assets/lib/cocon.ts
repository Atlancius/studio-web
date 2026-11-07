/**
 * Cocon sémantique : types, helpers, modèles, knowledge base, sanitizer.
 *
 * Le cocon réel est `cocon.json` à la racine du projet (skill blog-cocon,
 * qui porte le schéma). Ce fichier le charge au runtime.
 * Prompts : `lib/prompts.ts`. Persistance : `lib/cocon-storage.ts`.
 */

import { readFileSync } from "node:fs";
import path from "node:path";

// ─── TYPES ─────────────────────────────────────────────────────

export type CoconStatus = "published" | "draft" | "planned";
export type Persona = "entrepreneur" | "opérationnel" | "dirigeant";

export type PetiteFille = {
  slug: string;
  title: string;
  keyword: string;
  keywords_secondaires?: string[];
  intent: "informational" | "transactional" | "navigational";
  status: CoconStatus;
  ghost_slug?: string;
};

export type Fille = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  pilier_slug: string;
  module_mastery?: number;
  persona: Persona;
  cta_principal: string; // URL relative ex. "/formations/mastery"
  linked_outils?: string[];
  petites_filles: PetiteFille[];
  status: CoconStatus;
};

export type Cocon = {
  site?: string;
  mere: {
    slug: string;
    title: string;
    description?: string;
    keyword_principal: string;
    keywords_secondaires?: string[];
  };
  filles: Fille[];
};

// ─── MODÈLES ───────────────────────────────────────────────────
// IDs de l'API Anthropic. Vérifier la liste courante avant de les changer :
// https://platform.claude.com/docs/en/about-claude/models/overview

export const MODEL_BRIEF = "claude-sonnet-5-5"; // P1 : brief
export const MODEL_ARTICLE = "claude-opus-5-5"; // P2 : article long-form

// ─── KNOWLEDGE BASE (factuelle, à éditer manuellement) ─────────
//
// Cette KB est injectée dans le prompt P2 pour empêcher l'IA d'halluciner
// des chiffres/prix/versions. Tu DOIS la remplir avec tes vrais faits avant
// de lancer le premier article. Bumpe `version` et `validated_at` à chaque
// mise à jour.
//
// TODO ÉLÈVE : remplace les placeholders par tes vrais faits.

export const KNOWLEDGE_BASE = {
  validated_at: "AAAA-MM-JJ",
  version: 1,
  pricing: {
    // Exemple : "claude": { "pro": { "price_eur_per_month": 20 } }
    // Remplis avec les prix actuels des outils que tu cites souvent.
  },
  models: {
    // Exemple : "claude": { "modele_x": { "context": "1M tokens" } }
  },
  ecosystem: {
    // Descriptions courtes et neutres des produits/services cités
    // Exemple : "claude_code": "Agent CLI officiel Anthropic, lit/écrit du code en local."
  },
  business: {
    // Tes infos d'entreprise/marque
    // Exemple : "founded": 2022, "apprenants": "4 000+", "qualiopi": true
  },
  rules: [
    "Ne jamais citer un prix exact sans le qualifier ('à partir de', 'environ').",
    "Ne jamais inventer une statistique. Si elle n'est pas dans la KB : 'la majorité' ou omet.",
    "Ne jamais attribuer une citation à une personne sans source explicite.",
    "Ne jamais inventer une URL externe. N'utiliser que les URLs internes fournies dans le contexte.",
  ],
} as const;

// ─── CHARGEMENT DU COCON ───────────────────────────────────────

let _cocon: Cocon | null = null;

export function loadCocon(): Cocon {
  if (_cocon) return _cocon;
  const file = path.join(process.cwd(), "cocon.json");
  const raw = readFileSync(file, "utf8");
  _cocon = JSON.parse(raw) as Cocon; // cocon.json est un fichier de confiance du projet
  return _cocon;
}

// API rétro-compatible avec le code de référence
export const cocon: Cocon = loadCocon();

// ─── HELPERS ───────────────────────────────────────────────────

export function getFilleBySlug(slug: string): Fille | undefined {
  return cocon.filles.find((f) => f.slug === slug);
}

export function getFilleByPilierSlug(pilierSlug: string): Fille | undefined {
  return cocon.filles.find((f) => f.pilier_slug === pilierSlug);
}

export function getAllPilierSlugs(): string[] {
  return cocon.filles.map((f) => f.pilier_slug);
}

export function getPetiteFille(
  filleSlug: string,
  pfSlug: string,
): PetiteFille | undefined {
  return getFilleBySlug(filleSlug)?.petites_filles.find(
    (pf) => pf.slug === pfSlug,
  );
}

export function getSoeurs(filleSlug: string): Fille[] {
  return cocon.filles.filter((f) => f.slug !== filleSlug);
}

/**
 * Contexte de maillage interne pour le pipeline P1+P2.
 * Toutes les URLs retournées sont garanties d'exister côté site.
 */
export function getLinkingContext(filleSlug: string, pfSlug?: string) {
  const fille = getFilleBySlug(filleSlug);
  if (!fille) return null;
  const soeurs = getSoeurs(filleSlug).slice(0, 3);
  return {
    mere: {
      url: `/${cocon.mere.slug}`,
      title: cocon.mere.title,
      keyword: cocon.mere.keyword_principal,
    },
    pilier_parent: {
      url: `/blog/pilier/${fille.pilier_slug}`,
      title: fille.title,
      keyword: fille.keyword,
    },
    pilier_soeurs: soeurs.map((s) => ({
      url: `/blog/pilier/${s.pilier_slug}`,
      title: s.title,
      keyword: s.keyword,
    })),
    cta: {
      url: fille.cta_principal,
      label: fille.title,
    },
    outils_techniques: fille.linked_outils ?? [],
    petite_fille_actuelle: pfSlug
      ? getPetiteFille(filleSlug, pfSlug)
      : undefined,
  };
}

/**
 * Liste des URLs internes "garanties" (mère + piliers + CTA + outils +
 * pages structurelles). Utilisée par le link-validator pour valider
 * les liens internes générés par P2.
 */
export function getStaticAllowedUrls(): string[] {
  const urls = new Set<string>();
  urls.add(`/${cocon.mere.slug}`);
  for (const f of cocon.filles) {
    urls.add(`/blog/pilier/${f.pilier_slug}`);
    urls.add(f.cta_principal);
    for (const u of f.linked_outils ?? []) urls.add(u);
  }
  urls.add("/blog");
  // TODO ÉLÈVE : ajoute ici les pages structurelles de TON site
  // (ex. urls.add("/contact"), urls.add("/about"), etc.)
  return Array.from(urls);
}

export function getCoconStats() {
  let published = 0;
  let draft = 0;
  let planned = 0;
  for (const f of cocon.filles) {
    for (const pf of f.petites_filles) {
      if (pf.status === "published") published++;
      else if (pf.status === "draft") draft++;
      else planned++;
    }
  }
  return {
    filles: cocon.filles.length,
    petites_filles_total: published + draft + planned,
    published,
    draft,
    planned,
  };
}

// ─── SANITIZER (tiret cadratin U+2014 et demi-cadratin U+2013) ──

export function stripEmDashes(text: string): string {
  return text
    .replace(/ \u2014 /g, ", ")
    .replace(/\u2014 /g, ": ")
    .replace(/ \u2014/g, ",")
    .replace(/\u2014/g, ":")
    .replace(/\u2013/g, "-");
}

export function sanitizeArticle<T extends Record<string, unknown>>(
  article: T,
): T {
  const out: Record<string, unknown> = { ...article };
  for (const [key, value] of Object.entries(out)) {
    if (typeof value === "string") {
      out[key] = stripEmDashes(value);
    } else if (Array.isArray(value)) {
      out[key] = value.map((v) =>
        typeof v === "string" ? stripEmDashes(v) : v,
      );
    }
  }
  return out as T;
}
