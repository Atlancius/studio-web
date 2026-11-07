#!/usr/bin/env node
// Outils du thème Ghost, identiques sur Mac, Linux et Windows (Node >= 20, git).
// Usage :
//   node ghost-theme.mjs check                 vérifie node, git, GHOST_URL et GHOST_ADMIN_API_KEY (sans les afficher)
//   node ghost-theme.mjs fetch-source [dossier] clone le dernier tag v* de TryGhost/Source (défaut : theme)
//   node ghost-theme.mjs zip <dossier> <sortie.zip>
//   node ghost-theme.mjs upload <theme.zip>
//   node ghost-theme.mjs activate <nom-du-theme>
//   node ghost-theme.mjs jwt-test               génère un JWT de test sans réseau (vérifie le format)
// La clé Admin est lue dans la variable d'environnement GHOST_ADMIN_API_KEY (format id:secret),
// l'URL dans GHOST_URL. Ni l'une ni l'autre ne passe en argument ni n'est affichée.

import { execFileSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep, basename } from "node:path";
import { deflateRawSync } from "node:zlib";

const SOURCE_REPO = "https://github.com/TryGhost/Source.git";
const EXCLUDE_NAMES = new Set([".DS_Store", "node_modules", "AGENTS.md", "CLAUDE.md", "gulpfile.js", ".github", "renovate.json", ".git"]);
const excluded = (name) => EXCLUDE_NAMES.has(name) || name.startsWith("pnpm-");

function fail(msg) {
  console.error(`Erreur : ${msg}`);
  process.exit(1);
}

// ---------- fetch-source ----------
function fetchSource(dest = "theme") {
  if (existsSync(dest)) fail(`le dossier « ${dest} » existe déjà ; renomme-le ou choisis un autre nom.`);
  const out = execFileSync("git", ["ls-remote", "--tags", "--refs", SOURCE_REPO, "v*"], { encoding: "utf8" });
  const tags = out.split(/\r?\n/).map((l) => l.split("refs/tags/")[1]).filter(Boolean);
  if (!tags.length) fail("aucun tag v* trouvé sur TryGhost/Source.");
  const num = (t) => t.replace(/^v/, "").split(/[.-]/).map((n) => parseInt(n, 10) || 0);
  tags.sort((a, b) => {
    const x = num(a), y = num(b);
    for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (y[i] || 0) - (x[i] || 0);
    return 0;
  });
  const tag = tags[0];
  execFileSync("git", ["clone", "-q", "--depth", "1", "--branch", tag, SOURCE_REPO, dest], { stdio: "inherit" });
  rmSync(join(dest, ".git"), { recursive: true, force: true }); // dossier .git du clone tout juste créé
  for (const f of ["package.json", "default.hbs", join("assets", "built", "screen.css")]) {
    if (!existsSync(join(dest, f))) fail(`fichier attendu absent : ${join(dest, f)}`);
  }
  console.log(`Source ${tag} cloné dans ${dest}/`);
}

// ---------- zip ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function dosDateTime(d) {
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { time, date };
}
function listFiles(root, dir = root, acc = []) {
  for (const name of readdirSync(dir)) {
    if (excluded(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) listFiles(root, full, acc);
    else if (st.isFile()) acc.push(full);
  }
  return acc;
}
function zipDir(dir, out) {
  if (!dir || !out) fail("usage : zip <dossier> <sortie.zip>");
  if (!existsSync(join(dir, "package.json"))) fail(`${dir}/package.json introuvable : zippe le dossier qui contient package.json.`);
  const files = listFiles(dir);
  const locals = [], centrals = [];
  let offset = 0;
  for (const full of files) {
    const name = relative(dir, full).split(sep).join("/");
    const data = readFileSync(full);
    const comp = deflateRawSync(data);
    const useDeflate = comp.length < data.length;
    const body = useDeflate ? comp : data;
    const crc = crc32(data);
    const { time, date } = dosDateTime(statSync(full).mtime);
    const nameBuf = Buffer.from(name, "utf8");
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // noms en UTF-8
    local.writeUInt16LE(useDeflate ? 8 : 0, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, body);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(useDeflate ? 8 : 0, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);
    offset += 30 + nameBuf.length + body.length;
  }
  const centralBuf = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  writeFileSync(out, Buffer.concat([...locals, centralBuf, end]));
  console.log(`${out} écrit : ${files.length} fichiers, package.json à la racine.`);
}

// ---------- Admin API ----------
function b64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function makeJwt(key) {
  const [id, secret] = (key || "").split(":");
  if (!id || !secret || !/^[0-9a-f]+$/i.test(secret)) fail("GHOST_ADMIN_API_KEY absente ou mal formée (attendu : id:secret).");
  const iat = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT", kid: id }));
  const payload = b64url(JSON.stringify({ iat, exp: iat + 300, aud: "/admin/" }));
  const sig = b64url(createHmac("sha256", Buffer.from(secret, "hex")).update(`${header}.${payload}`).digest());
  return `${header}.${payload}.${sig}`;
}
function ghostEnv() {
  const url = (process.env.GHOST_URL || "").replace(/\/+$/, "");
  if (!url) fail("GHOST_URL absente (adresse du blog, sans slash final).");
  return { url, jwt: makeJwt(process.env.GHOST_ADMIN_API_KEY) };
}
async function call(method, path, body) {
  const { url, jwt } = ghostEnv();
  const res = await fetch(`${url}/ghost/api/admin${path}`, {
    method,
    headers: { Authorization: `Ghost ${jwt}`, "Accept-Version": "v5.0" },
    body,
  });
  const text = await res.text();
  console.log(`HTTP ${res.status}`);
  console.log(text.slice(0, 2000));
  if (!res.ok) process.exit(1);
}
async function upload(zipPath) {
  if (!zipPath || !existsSync(zipPath)) fail("usage : upload <theme.zip> (fichier introuvable)");
  const form = new FormData();
  form.append("file", new Blob([readFileSync(zipPath)], { type: "application/zip" }), basename(zipPath));
  await call("POST", "/themes/upload/", form);
}
async function activate(name) {
  if (!name) fail("usage : activate <nom-du-theme> (le name du package.json)");
  await call("PUT", `/themes/${encodeURIComponent(name)}/activate/`);
}

function check() {
  const ok = (b) => (b ? "OK" : "absent");
  let gitOk = true;
  try { execFileSync("git", ["--version"], { stdio: "ignore" }); } catch { gitOk = false; }
  console.log(`node ${process.versions.node} : ${Number(process.versions.node.split(".")[0]) >= 20 ? "OK" : "trop ancien (20 minimum)"}`);
  console.log(`git : ${ok(gitOk)}`);
  console.log(`GHOST_URL : ${ok(process.env.GHOST_URL)}`);
  console.log(`GHOST_ADMIN_API_KEY : ${ok(process.env.GHOST_ADMIN_API_KEY)}`);
}

const [cmd, ...args] = process.argv.slice(2);
switch (cmd) {
  case "check": check(); break;
  case "fetch-source": fetchSource(args[0]); break;
  case "zip": zipDir(args[0], args[1]); break;
  case "upload": await upload(args[0]); break;
  case "activate": await activate(args[0]); break;
  case "jwt-test": {
    const t = makeJwt("0123456789abcdef01234567:" + "ab".repeat(32));
    console.log(t.split(".").length === 3 ? "JWT de test : 3 parties, OK" : "JWT invalide");
    break;
  }
  default:
    console.log("Commandes : check | fetch-source [dossier] | zip <dossier> <sortie.zip> | upload <zip> | activate <nom> | jwt-test");
    process.exit(cmd ? 1 : 0);
}
