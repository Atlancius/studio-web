import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { GHOST_CACHE_TAG } from "@/lib/ghost";

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/**
 * Ghost webhook → revalidate blog cache.
 *
 * Configure on Ghost (Settings → Integrations → Claude Code → Add webhook):
 *   Events: post.published, post.published.edited, post.unpublished, post.deleted
 *   URL:    https://<site>/api/revalidate-blog?token=<REVALIDATE_SECRET>
 *
 * Env var: REVALIDATE_SECRET, shared secret matching the ?token query param.
 */
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    console.error("[revalidate-blog] REVALIDATE_SECRET not configured");
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET not configured" },
      { status: 500 },
    );
  }

  if (!token || !safeEqual(token, secret)) {
    console.warn("[revalidate-blog] unauthorized, token mismatch");
    return NextResponse.json(
      { ok: false, error: "invalid token" },
      { status: 401 },
    );
  }

  let slug: string | undefined;
  try {
    const body = await req.json();
    slug = body?.post?.current?.slug ?? body?.post?.previous?.slug;
  } catch (err) {
    console.warn("[revalidate-blog] could not parse webhook body:", err);
  }

  try {
    // Next.js 16: revalidateTag à 1 argument est déprécié.
    // Utiliser le 2e argument 'max' (stale-while-revalidate).
    revalidateTag(GHOST_CACHE_TAG, "max");
    revalidatePath("/blog");
    if (slug) revalidatePath(`/blog/${slug}`);
    console.log(
      `[revalidate-blog] ok, tag=${GHOST_CACHE_TAG} slug=${slug ?? "(none)"}`,
    );
  } catch (err) {
    console.error("[revalidate-blog] revalidation failed:", err);
    return NextResponse.json(
      { ok: false, error: "revalidation failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    revalidated: {
      tag: GHOST_CACHE_TAG,
      paths: ["/blog", slug && `/blog/${slug}`].filter(Boolean),
    },
  });
}
