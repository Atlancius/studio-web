#!/usr/bin/env node
// Liste les images d'un dossier avec poids et dimensions (PNG, JPEG, WebP,
// GIF), sans dépendance. Marche sur Mac, Linux et Windows (Node.js 20+).
// Usage : node controle-images.mjs [dossier]   (défaut : assets)
// Signale : image du site > 200 Ko, og-image > 300 Ko ou pas en 1200 x 630.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const dossier = process.argv[2] ?? "assets";
let fichiers;
try {
  fichiers = readdirSync(dossier).filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f)).sort();
} catch {
  process.stderr.write(`erreur : dossier introuvable : ${dossier}\n`);
  process.exit(2);
}

function dimensions(b) {
  // PNG
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  // GIF
  if (b.toString("ascii", 0, 3) === "GIF") return [b.readUInt16LE(6), b.readUInt16LE(8)];
  // WebP
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const type = b.toString("ascii", 12, 16);
    if (type === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (type === "VP8L") {
      const bits = b.readUInt32LE(21);
      return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
    }
    if (type === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  }
  // JPEG : chercher un marqueur SOF
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return [null, null];
}

if (fichiers.length === 0) console.log(`Aucune image dans ${dossier}.`);
for (const f of fichiers) {
  const chemin = join(dossier, f);
  const ko = Math.round(statSync(chemin).size / 1024);
  const [w, h] = dimensions(readFileSync(chemin));
  const alertes = [];
  const og = /^og-image/i.test(f);
  if (og && ko > 300) alertes.push("og-image > 300 Ko");
  if (og && (w !== 1200 || h !== 630)) alertes.push("og-image attendue en 1200 x 630");
  if (og && extname(f).toLowerCase() === ".webp") alertes.push("og-image en WebP : préférer JPEG ou PNG");
  if (!og && ko > 200) alertes.push("> 200 Ko : baisser la qualité");
  console.log(`${f} : ${ko} Ko, ${w ?? "?"} x ${h ?? "?"}${alertes.length ? "  <- " + alertes.join(" ; ") : ""}`);
}
