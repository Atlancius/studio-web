#!/usr/bin/env node
// Petits contrôles du blog, identiques sur Mac, Linux et Windows (Node >= 20, aucune dépendance).
// Usage :
//   node blog-outils.mjs json-check <fichier.json>         le JSON est-il valide ?
//   node blog-outils.mjs cocon-stats [cocon.json]           articles par statut (publiés, drafts, planifiés)
//   node blog-outils.mjs http <url>                         code HTTP renvoyé (sans suivre les redirections)
//   node blog-outils.mjs compte <url> <texte>               nombre d'occurrences d'un texte dans la page (insensible à la casse)
//   node blog-outils.mjs env <VAR> [VAR ...]                variable définie ou absente (la valeur n'est jamais affichée)
//   node blog-outils.mjs secret [octets]                    secret aléatoire en hexadécimal (défaut : 32 octets)

import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const [cmd, ...args] = process.argv.slice(2);
const fail = (m) => { console.error(`Erreur : ${m}`); process.exit(1); };

function readJson(file) {
  let text;
  try { text = readFileSync(file, "utf8").replace(/^﻿/, ""); } catch { fail(`fichier introuvable : ${file}`); }
  try { return JSON.parse(text); } catch (e) { fail(`JSON invalide dans ${file} : ${e.message}`); }
}

switch (cmd) {
  case "json-check": {
    if (!args[0]) fail("usage : json-check <fichier.json>");
    readJson(args[0]);
    console.log(`${args[0]} : JSON valide`);
    break;
  }
  case "cocon-stats": {
    const cocon = readJson(args[0] || "cocon.json");
    const pf = (cocon.filles || []).flatMap((f) => f.petites_filles || []);
    const parStatut = {};
    for (const p of pf) parStatut[p.status || "sans statut"] = (parStatut[p.status || "sans statut"] || 0) + 1;
    console.log(`Petites-filles : ${pf.length}`);
    for (const [s, n] of Object.entries(parStatut)) console.log(`- ${s} : ${n}`);
    console.log(`Non publiées : ${pf.filter((p) => p.status !== "published").length}`);
    break;
  }
  case "http": {
    if (!args[0]) fail("usage : http <url>");
    try {
      const res = await fetch(args[0], { method: "HEAD", redirect: "manual" });
      console.log(`HTTP ${res.status}${res.headers.get("location") ? ` -> ${res.headers.get("location")}` : ""}`);
    } catch (e) { fail(`pas de réponse de ${args[0]} (${e.cause?.code || e.message}) : instance arrêtée, endormie ou adresse fausse.`); }
    break;
  }
  case "compte": {
    if (!args[0] || !args[1]) fail("usage : compte <url> <texte>");
    try {
      const res = await fetch(args[0]);
      const body = (await res.text()).toLowerCase();
      const needle = args[1].toLowerCase();
      console.log(`HTTP ${res.status} ; « ${args[1]} » trouvé ${body.split(needle).length - 1} fois`);
    } catch (e) { fail(`pas de réponse de ${args[0]} (${e.cause?.code || e.message})`); }
    break;
  }
  case "env": {
    if (!args.length) fail("usage : env <VAR> [VAR ...]");
    for (const v of args) console.log(`${v} : ${process.env[v] ? "définie" : "absente"}`);
    break;
  }
  case "secret": {
    console.log(randomBytes(Number(args[0]) || 32).toString("hex"));
    break;
  }
  default:
    console.log("Commandes : json-check | cocon-stats | http | compte | env | secret");
    process.exit(cmd ? 1 : 0);
}
