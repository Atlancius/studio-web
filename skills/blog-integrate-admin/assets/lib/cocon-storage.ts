/**
 * Persistance locale des briefs/articles/publish générés par l'admin UI.
 *
 * Stockage : fichiers JSON sous `data/cocon/<type>/<key>.json`.
 * Le dossier `data/` doit être gitignoré (cache local).
 *
 * ⚠️ En production serverless (Vercel), le filesystem est read-only.
 * Pour déployer cet admin en prod sur Vercel, bascule sur Vercel Blob,
 * Supabase, ou Postgres. Pour un usage local (dev) ou sur un hébergeur
 * qui autorise l'écriture (VPS, Render, Railway), `node:fs` suffit.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "data", "cocon");

type StoreType = "briefs" | "articles" | "published";

function safeKey(filleSlug: string, pfSlug: string): string {
  return `${filleSlug}_${pfSlug}`.replace(/[^a-z0-9_-]/gi, "_");
}

function pathFor(type: StoreType, key: string): string {
  return path.join(ROOT, type, `${key}.json`);
}

async function ensureDir(p: string) {
  await fs.mkdir(path.dirname(p), { recursive: true });
}

export async function save(
  type: StoreType,
  filleSlug: string,
  pfSlug: string,
  data: unknown,
): Promise<void> {
  const key = safeKey(filleSlug, pfSlug);
  const file = pathFor(type, key);
  await ensureDir(file);
  await fs.writeFile(
    file,
    JSON.stringify(
      {
        _meta: { savedAt: new Date().toISOString(), filleSlug, pfSlug },
        data,
      },
      null,
      2,
    ),
    "utf8",
  );
}

export async function loadOne<T = unknown>(
  type: StoreType,
  filleSlug: string,
  pfSlug: string,
): Promise<T | null> {
  const key = safeKey(filleSlug, pfSlug);
  try {
    const raw = await fs.readFile(pathFor(type, key), "utf8");
    const parsed = JSON.parse(raw) as { data: T };
    return parsed.data;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    console.error(`[cocon-storage] loadOne(${type}/${key}) failed:`, err);
    return null;
  }
}

export async function loadAll<T = unknown>(
  type: StoreType,
): Promise<Record<string, T>> {
  const dir = path.join(ROOT, type);
  try {
    const files = await fs.readdir(dir);
    const out: Record<string, T> = {};
    await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          try {
            const raw = await fs.readFile(path.join(dir, f), "utf8");
            const parsed = JSON.parse(raw) as {
              _meta: { filleSlug: string; pfSlug: string };
              data: T;
            };
            const key = `${parsed._meta.filleSlug}/${parsed._meta.pfSlug}`;
            out[key] = parsed.data;
          } catch (err) {
            console.error(`[cocon-storage] skip ${f}:`, err);
          }
        }),
    );
    return out;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    console.error(`[cocon-storage] loadAll(${type}) failed:`, err);
    return {};
  }
}

export async function remove(
  type: StoreType,
  filleSlug: string,
  pfSlug: string,
): Promise<void> {
  const key = safeKey(filleSlug, pfSlug);
  try {
    await fs.unlink(pathFor(type, key));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
}
