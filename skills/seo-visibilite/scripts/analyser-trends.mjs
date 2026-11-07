#!/usr/bin/env node
// Analyse un export CSV de Google Trends (« Intérêt au fil du temps »,
// fichier multiTimeline.csv) : tendance, pic, saisonnalité par mot-clé.
// Mac, Linux et Windows, Node.js 20+, aucune dépendance.
// Usage : node analyser-trends.mjs multiTimeline.csv [autre.csv ...]
// Sortie : tableau Markdown sur stdout. Codes : 0 succès, 2 erreur d'usage.

import { readFileSync } from "node:fs";
import { basename } from "node:path";

const fichiers = process.argv.slice(2);
if (fichiers.length === 0) {
  process.stderr.write("Usage : node analyser-trends.mjs multiTimeline.csv [autre.csv ...]\n");
  process.exit(2);
}

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const estDate = (c) => /^\d{4}-\d{2}(-\d{2})?/.test(c.trim().replace(/^"|"$/g, ""));
const cellules = (l) => l.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
const valeur = (c) => (c === "<1" ? 0.5 : Number(c));
const moyenne = (t) => (t.length ? t.reduce((a, b) => a + b, 0) / t.length : 0);

const sortie = [];
for (const f of fichiers) {
  let texte;
  try {
    texte = readFileSync(f, "utf8").replace(/^﻿/, "");
  } catch {
    process.stderr.write(`erreur : fichier illisible : ${f}\n`);
    process.exit(2);
  }
  const lignes = texte.split(/\r?\n/).filter((l) => l.trim() !== "");
  const iPremiere = lignes.findIndex((l) => estDate(l.split(",")[0]));
  if (iPremiere < 1) {
    process.stderr.write(`erreur : format non reconnu (pas de ligne de dates) : ${f}\n`);
    process.exit(2);
  }
  const entete = cellules(lignes[iPremiere - 1]).slice(1).map((t) => t.replace(/:\s*\(.*\)$/, ""));
  const donnees = lignes.slice(iPremiere).map(cellules).filter((c) => estDate(c[0]));

  sortie.push(`## ${basename(f)} : ${donnees[0][0]} → ${donnees.at(-1)[0]} (${donnees.length} points)\n`);
  sortie.push("| Mot-clé | Moyenne | Récent vs avant | Tendance | Pic | Mois forts |");
  sortie.push("|---|---|---|---|---|---|");
  entete.forEach((terme, j) => {
    const serie = donnees.map((c) => ({ date: c[0], v: valeur(c[j + 1]) })).filter((p) => Number.isFinite(p.v));
    if (serie.length === 0) return;
    const n = serie.length;
    const quart = Math.max(1, Math.floor(n / 4));
    const recent = moyenne(serie.slice(-quart).map((p) => p.v));
    const avant = moyenne(serie.slice(-2 * quart, -quart).map((p) => p.v));
    const evol = avant > 0 ? Math.round(((recent - avant) / avant) * 100) : null;
    const tendance = evol === null ? "?" : evol >= 20 ? "en hausse" : evol <= -20 ? "en baisse" : "stable";
    const pic = serie.reduce((a, b) => (b.v > a.v ? b : a));
    const parMois = new Map();
    for (const p of serie) {
      const m = Number(p.date.slice(5, 7)) - 1;
      parMois.set(m, [...(parMois.get(m) ?? []), p.v]);
    }
    const moyMois = [...parMois].map(([m, t]) => ({ m, v: moyenne(t) }));
    const globale = moyenne(serie.map((p) => p.v));
    const forts = moyMois.filter((x) => globale > 0 && x.v >= globale * 1.25).sort((a, b) => b.v - a.v).slice(0, 3).map((x) => MOIS[x.m]);
    sortie.push(
      `| ${terme} | ${Math.round(globale)} | ${evol === null ? "?" : (evol > 0 ? "+" : "") + evol + " %"} | ${tendance} | ${pic.date} (${pic.v}) | ${forts.length ? forts.join(", ") : "pas de saison nette"} |`,
    );
  });
  sortie.push("");
}
sortie.push("Valeurs relatives (0 à 100) entre les mots-clés d'un même export : ne pas comparer deux exports différents entre eux. « Mois forts » n'a de sens qu'avec au moins 2 ans de données.");
process.stdout.write(sortie.join("\n") + "\n");
