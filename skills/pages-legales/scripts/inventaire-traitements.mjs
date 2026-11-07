#!/usr/bin/env node
// Inventaire des traitements de données visibles dans un projet, pour aligner
// les textes légaux sur le code réel. Marche à l'identique sur Mac, Linux et
// Windows : Node.js 20 ou plus, aucune dépendance (git utilisé s'il est là).
//
// Lecture seule : n'exécute aucune commande du projet, ne lit aucune valeur de
// fichier .env (seulement les noms de clés des fichiers d'exemple) et n'affiche
// jamais le contenu d'une ligne de code, seulement « chemin:ligne:indice ».
//
// Usage : node inventaire-traitements.mjs [racine]   (défaut : dossier courant)
// Variable : INVENTAIRE_MAX = fichiers affichés par catégorie (défaut 15).
// Sortie : rapport Markdown sur stdout. Codes : 0 succès, 2 erreur d'usage.

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

function erreur(message) {
  process.stderr.write(`erreur : ${message}\n`);
  process.exit(2);
}

const racine = process.argv[2] ?? ".";
const maxBrut = process.env.INVENTAIRE_MAX ?? "15";
if (!/^[0-9]+$/.test(maxBrut)) erreur("INVENTAIRE_MAX doit être un entier");
const max = Number(maxBrut);
let racineAbs;
try {
  if (!statSync(racine).isDirectory()) throw new Error();
  racineAbs = realpathSync(racine);
} catch {
  erreur(`dossier introuvable : ${racine}`);
}

// Fichiers jamais lus : dépendances, artefacts, lockfiles, cartes de sources,
// minifiés, binaires connus et tout fichier d'environnement réel.
const EXCLUS =
  /(^|\/)(node_modules|\.git|dist|build|out|\.next|\.turbo|\.vercel|\.expo|coverage|vendor|_generated)\/|(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb?|Podfile\.lock|Cargo\.lock|composer\.lock|poetry\.lock|uv\.lock)$|\.(map|min\.js|min\.css|png|jpe?g|gif|webp|avif|ico|pdf|zip|woff2?|ttf|otf|mp4|mov|mp3)$|(^|\/)\.env($|\.)/;
// Écartés des catégories « code » : prose, plans et outillage d'agents.
const OUTILLAGE = /(^|\/)(\.agents|\.claude|\.codex|\.cursor|\.windsurf)\//;
const NON_CODE = /\.(md|mdx|markdown|txt|rst)$|(^|\/)docs?\/|(^|\/)(\.agents|\.claude|\.codex|\.cursor|\.windsurf)\//;
const DOSSIERS_IGNORES = new Set(["node_modules", ".git"]);

function git(args) {
  return execFileSync("git", args, { cwd: racineAbs, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 1 << 28 });
}

let estDepot = false;
try {
  estDepot = git(["rev-parse", "--is-inside-work-tree"]).trim() === "true";
} catch {
  estDepot = false;
}

function parcourir(dossier, acc) {
  let entrees;
  try {
    entrees = readdirSync(dossier, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entrees) {
    const chemin = join(dossier, e.name);
    if (e.isDirectory()) {
      if (!DOSSIERS_IGNORES.has(e.name)) parcourir(chemin, acc);
    } else if (e.isFile()) {
      acc.push("./" + relative(racineAbs, chemin).split(sep).join("/"));
    }
  }
  return acc;
}

function tousLesFichiers() {
  if (estDepot) {
    return git(["ls-files", "-z", "--cached", "--others", "--exclude-standard"]).split("\0").filter(Boolean);
  }
  return parcourir(racineAbs, []).sort();
}

const FICHIERS = tousLesFichiers().filter((f) => !EXCLUS.test(f));

function listerPortee(portee) {
  return FICHIERS.filter((f) => (portee === "textes" ? !OUTILLAGE.test(f) : !NON_CODE.test(f)));
}

const cacheLignes = new Map();
function lignes(f) {
  if (cacheLignes.has(f)) return cacheLignes.get(f);
  let res = null;
  try {
    const buf = readFileSync(join(racineAbs, f));
    if (!buf.includes(0)) res = buf.toString("utf8").split("\n");
  } catch {
    res = null;
  }
  cacheLignes.set(f, res);
  return res;
}

// chercher : entrées { f, ligne, indice } uniques par fichier, ligne et indice.
// Casse ignorée en portée code, respectée en portée textes.
function chercher(motif, portee) {
  const re = new RegExp(motif, portee === "textes" ? "g" : "gi");
  const vus = new Set();
  const res = [];
  for (const f of listerPortee(portee)) {
    const ls = lignes(f);
    if (!ls) continue;
    ls.forEach((texte, i) => {
      for (const m of texte.matchAll(re)) {
        if (!m[0]) continue;
        const indice = m[0].toLowerCase();
        const cle = `${f}\u0000${i + 1}\u0000${indice}`;
        if (vus.has(cle)) continue;
        vus.add(cle);
        res.push({ f, ligne: i + 1, indice });
      }
    });
  }
  return res;
}

const comparer = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const sortie = [];
const ecrire = (t) => sortie.push(t);

function section(titre, motif, portee = "code") {
  const brut = chercher(motif, portee);
  if (brut.length === 0) {
    ecrire(`\n## ${titre}\n\n- aucun indice\n`);
    return;
  }
  const compte = new Map();
  for (const { indice } of brut) compte.set(indice, (compte.get(indice) ?? 0) + 1);
  const resume = [...compte].map(([i, n]) => `${i} (${n})`).sort(comparer).join(", ");
  ecrire(`\n## ${titre} : ${resume}\n\n`);

  const parFichier = new Map();
  for (const { f, ligne, indice } of brut) {
    if (!parFichier.has(f)) parFichier.set(f, { nb: 0, premier: ligne, indices: [] });
    const e = parFichier.get(f);
    e.nb++;
    if (!e.indices.includes(indice)) e.indices.push(indice);
  }
  const rangs = [...parFichier].map(([f, e]) => ({ nb: e.nb, texte: `- ${f}:${e.premier} : ${e.indices.join(", ")}` }));
  rangs.sort((a, b) => b.nb - a.nb || comparer(a.texte, b.texte));
  for (const r of rangs.slice(0, max)) ecrire(`${r.texte}\n`);
  if (rangs.length > max) {
    ecrire(`- … ${rangs.length - max} autre(s) fichier(s) : relance avec INVENTAIRE_MAX=${rangs.length}\n`);
  }
}

ecrire(`# Inventaire des traitements — ${racineAbs}\n\n`);
ecrire("Indices à confirmer par la lecture du code : une dépendance déclarée n'est pas forcément utilisée, et un service peut être appelé sans SDK (fetch direct).\n");

section("Paiement", "stripe|lemonsqueezy|lemon-squeezy|paddle|revenuecat|react-native-purchases|expo-iap|storekit|in_app_purchase");
section("Mesure d'audience et produit", "posthog|@vercel/analytics|@vercel/speed-insights|plausible|gtag\\(|googletagmanager|google-analytics|@next/third-parties|mixpanel|amplitude|@segment|matomo|umami|hotjar|clarity\\.ms");
section("Erreurs, traces et replay", "@sentry/[a-z-]+|sentry_dsn|logrocket|datadog|bugsnag|replaysSessionSampleRate|session_recording");
section("Email et notifications", "resend|airtable|formspree|getform|tally\\.so|typeform|@react-email|sendgrid|postmark|nodemailer|mailgun|brevo|sib-api|mailchimp|lumail|ghost/api|members/api|expo-notifications|firebase/messaging|onesignal|web-push");
section("Authentification et identité", "better-auth|next-auth|@auth/[a-z-]+|@clerk|clerk|lucia|firebase/auth|supabase\\.auth|socialProviders|expo-apple-authentication|@react-oauth/google|magicLink|passkey");
section("Fichiers et stockage", "@aws-sdk/client-s3|r2\\.cloudflarestorage|cloudinary|uploadthing|@vercel/blob|ctx\\.storage|firebase/storage|generateUploadUrl");
section("Données et hébergement", "convex|@neondatabase|neon\\.tech|drizzle-orm|@prisma/client|supabase|mongodb|planetscale|turso|wrangler|vercel\\.json|fly\\.toml|railway|render\\.yaml");
section("IA", "@anthropic-ai/sdk|openai|@ai-sdk/[a-z-]+|@google/genai|@google/generative-ai|mistralai|replicate|@fal-ai|groq-sdk|elevenlabs");
section("Capteurs et données de l'appareil", "expo-location|geolocation|mapbox|maps\\.googleapis|expo-camera|expo-image-picker|expo-contacts|getUserMedia|expo-media-library");
section("Stockage navigateur et cookies", "document\\.cookie|localStorage|sessionStorage|indexedDB|cookies\\(\\)|set-cookie|setCookie");
section("Consentement", "consent|cookie-?banner|tarteaucitron|axeptio|didomi|cookiebot|opt_in_capturing|opt_out_capturing");
section("Droits RGPD dans le code", "deleteMyAccount|deleteAccount|deleteUser|anonymi[sz]e[A-Za-z]*|exportMyData|exportUserData|exportData|dataExport");
section("Conservation et purge", "retention|purge[A-Za-z]*|expiresAt|\\bttl\\b|crons\\.(daily|weekly|monthly|interval|cron)|cron\\(");
// Champs à remplir et textes de démonstration laissés par un modèle de site.
section(
  "Textes hérités ou à compléter",
  "[Ll]orem ipsum|[Yy]our (privacy|terms)[a-z ]* here|\\[([Yy]our |[Vv]otre )?(Company|COMPANY|Nom|NOM|Name|NAME|Adresse|ADRESSE|Address|ADDRESS|Email|EMAIL|SIRET|Siret)[^\\],]*\\]|\\{\\{[A-Z_]+\\}\\}|[Ee]xample (Inc|LLC|SAS)|ACME",
  "textes",
);

ecrire("\n## Pages légales candidates\n\n");
const pages = FICHIERS.filter((f) => /(privacy|confidentialit|terms|cgu|cgv|conditions|mentions|legal|cookies?|rgpd|gdpr|data-?deletion|suppression)/i.test(f)).slice(0, max);
ecrire(pages.length ? pages.map((p) => `- ${p}\n`).join("") : "- aucune\n");

ecrire("\n## Variables déclarées dans les fichiers d’exemple (noms seulement)\n\n");
const tous = estDepot ? git(["ls-files"]).split("\n").filter(Boolean) : parcourir(racineAbs, []).sort();
const exemples = tous.filter((f) => /(^|\/)\.env\.(example|sample|template)$|(^|\/)\.env-[a-z-]*template$/.test(f));
if (exemples.length === 0) {
  ecrire("- aucun fichier d'exemple\n");
} else {
  for (const f of exemples) {
    let cles = [];
    try {
      const texte = readFileSync(join(racineAbs, f), "utf8");
      const set = new Set();
      for (const l of texte.split(/\r?\n/)) {
        const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=/.exec(l);
        if (m) set.add(m[1]);
      }
      cles = [...set].sort(comparer);
    } catch {
      cles = [];
    }
    ecrire(`- ${f} : ${cles.length ? cles.join(" ") + " " : "aucune clé"}\n`);
  }
}

process.stdout.write(sortie.join(""));
