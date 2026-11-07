#!/usr/bin/env node
// Captures en 4 tailles d'écran, erreurs console et, en mode complet,
// performance, réseau et éléments clés. Mac, Linux et Windows (Node.js 20+).
//
// À lancer depuis un dossier où Playwright est installé (voir SKILL.md) :
//   node <chemin>/capturer.mjs <url> [--complet] [--selecteurs "header,.cta"] [--sortie captures]
// Sortie : rapport Markdown sur stdout, captures PNG dans le dossier de sortie.
// Codes : 0 succès, 1 page injoignable, 2 erreur d'usage ou Playwright absent.

import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--") && !isValeur(a));
function isValeur(a) {
  const i = args.indexOf(a);
  return i > 0 && ["--selecteurs", "--sortie"].includes(args[i - 1]);
}
function option(nom) {
  const i = args.indexOf(nom);
  return i >= 0 ? args[i + 1] : undefined;
}
if (!url || !/^https?:\/\//.test(url)) {
  process.stderr.write("Usage : node capturer.mjs <http(s)://url> [--complet] [--selecteurs \"header,.cta\"] [--sortie captures]\n");
  process.exit(2);
}
const complet = args.includes("--complet");
const selecteurs = (option("--selecteurs") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const sortie = resolve(option("--sortie") ?? "captures");
mkdirSync(sortie, { recursive: true });

let chromium;
try {
  const require = createRequire(join(process.cwd(), "package.json"));
  ({ chromium } = require("playwright"));
  if (!chromium) throw new Error("playwright incomplet");
} catch {
  process.stderr.write("Playwright introuvable dans ce dossier. Lance d'abord :\n  npm init -y\n  npm i -D playwright\n  npx playwright install chromium\n");
  process.exit(2);
}

const formats = [
  { nom: "mobile", width: 320, height: 568 },
  { nom: "tablette", width: 768, height: 1024 },
  { nom: "ordinateur", width: 1024, height: 768 },
  { nom: "grand-ecran", width: 1440, height: 900 },
];

const erreurs = [];
const avertissements = [];
const reseau = [];
let perf = null;
const dom = [];
const lignes = [];
let injoignable = false;

const navigateur = await chromium.launch();
try {
  for (const f of formats) {
    const page = await navigateur.newPage({ viewport: { width: f.width, height: f.height } });
    const premiere = f === formats[0];
    if (premiere) {
      page.on("console", (m) => {
        if (m.type() === "error") erreurs.push(m.text());
        if (m.type() === "warning") avertissements.push(m.text());
      });
      page.on("pageerror", (e) => erreurs.push(String(e.message ?? e)));
      if (complet) {
        page.on("response", async (r) => {
          let taille = 0;
          try {
            taille = (await r.body()).length;
          } catch {
            taille = 0;
          }
          reseau.push({ url: r.url(), statut: r.status(), type: r.headers()["content-type"] ?? "", taille });
        });
      }
    }
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    } catch (e) {
      injoignable = true;
      lignes.push(`- ${f.nom} (${f.width}px) : page injoignable (${String(e.message).split("\n")[0]})`);
      await page.close();
      continue;
    }
    const fichier = join(sortie, `capture-${f.nom}.png`);
    await page.screenshot({ path: fichier, fullPage: true });
    const deborde = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    lignes.push(`- ${f.nom} (${f.width}px) : ${fichier}${deborde ? "  <- débordement horizontal" : ""}`);

    if (premiere && complet) {
      perf = await page.evaluate(() => {
        const n = performance.getEntriesByType("navigation")[0];
        const p = Object.fromEntries(performance.getEntriesByType("paint").map((e) => [e.name, Math.round(e.startTime)]));
        return n
          ? {
              ttfb: Math.round(n.responseStart - n.requestStart),
              dom: Math.round(n.domContentLoadedEventEnd - n.startTime),
              charge: Math.round(n.loadEventEnd - n.startTime),
              fcp: p["first-contentful-paint"] ?? null,
            }
          : null;
      });
      for (const s of selecteurs) {
        const info = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const c = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return {
            balise: el.tagName.toLowerCase(),
            classes: el.className && typeof el.className === "string" ? el.className : "",
            display: c.display,
            taille: `${Math.round(r.width)} x ${Math.round(r.height)}`,
            couleur: c.color,
            fond: c.backgroundColor,
            police: `${c.fontSize} ${c.fontFamily}`,
            role: el.getAttribute("role") ?? "",
            ariaLabel: el.getAttribute("aria-label") ?? "",
          };
        }, s);
        dom.push({ selecteur: s, info });
      }
    }
    await page.close();
  }
} finally {
  await navigateur.close();
}

const out = [];
out.push(`## Vérification navigateur — ${url}\n`);
out.push("### Captures");
out.push(...lignes);
out.push("\n### Console");
out.push(`- Erreurs : ${erreurs.length}`);
out.push(`- Avertissements : ${avertissements.length}`);
for (const e of erreurs.slice(0, 20)) out.push(`  - erreur : ${e}`);
for (const a of avertissements.slice(0, 10)) out.push(`  - avertissement : ${a}`);
if (complet) {
  out.push("\n### Performance");
  out.push(perf ? `- TTFB : ${perf.ttfb} ms\n- FCP : ${perf.fcp ?? "?"} ms\n- DOM chargé : ${perf.dom} ms\n- Chargement complet : ${perf.charge} ms` : "- non mesurée");
  const echecs = reseau.filter((r) => r.statut >= 400);
  const lourds = [...reseau].sort((a, b) => b.taille - a.taille).slice(0, 5);
  out.push("\n### Réseau");
  out.push(`- Requêtes : ${reseau.length}`);
  out.push(`- En échec : ${echecs.length}`);
  for (const r of echecs) out.push(`  - ${r.statut} ${r.url}`);
  out.push("- Plus lourds :");
  for (const r of lourds) out.push(`  - ${Math.round(r.taille / 1024)} Ko ${r.url}`);
  if (dom.length) {
    out.push("\n### Éléments clés");
    for (const d of dom) out.push(d.info ? `- \`${d.selecteur}\` : ${JSON.stringify(d.info)}` : `- \`${d.selecteur}\` : introuvable`);
  }
}
process.stdout.write(out.join("\n") + "\n");
process.exit(injoignable ? 1 : 0);
