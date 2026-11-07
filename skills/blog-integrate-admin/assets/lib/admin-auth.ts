/**
 * Auth du back-office : mot de passe partagé -> cookie de session signé (HMAC)
 * avec expiration. Chaque page et chaque route API appelle isAdmin() /
 * requireAdmin() : sans session valide, tout est refusé (fail closed).
 *
 * Env : COCON_ADMIN_PASSWORD (12 caractères minimum).
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const COOKIE_NAME = "cocon-admin";
const TTL_SECONDS = 60 * 60 * 8; // 8 heures

function getSecret(): string | null {
  const s = process.env.COCON_ADMIN_PASSWORD;
  return s && s.length >= 12 ? s : null;
}

function sign(exp: string, secret: string): string {
  return createHmac("sha256", secret).update(exp).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function passwordMatches(input: unknown): boolean {
  const secret = getSecret();
  return secret !== null && typeof input === "string" && safeEqual(input, secret);
}

export async function createSession(): Promise<void> {
  const secret = getSecret();
  if (!secret) throw new Error("COCON_ADMIN_PASSWORD manquant ou trop court");
  const exp = String(Math.floor(Date.now() / 1000) + TTL_SECONDS);
  const store = await cookies();
  store.set(COOKIE_NAME, `${exp}.${sign(exp, secret)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: TTL_SECONDS,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  const [exp, mac] = value?.split(".") ?? [];
  if (!exp || !mac || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(mac, sign(exp, secret));
}

/** À appeler en tête de chaque route API : renvoie une réponse 401 ou null. */
export async function requireAdmin(): Promise<NextResponse | null> {
  return (await isAdmin())
    ? null
    : NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}
