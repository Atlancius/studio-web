import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { upsertPost, uploadImage } from "@/lib/ghost-admin";
import { generateImage, isFalConfigured } from "@/lib/fal";
import { getFilleBySlug, getPetiteFille } from "@/lib/cocon";
import { loadOne, save } from "@/lib/cocon-storage";
import { articleShape, slugPair } from "@/lib/pipeline";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 90;

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = slugPair.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "filleSlug et pfSlug requis" },
      { status: 400 },
    );
  }
  const { filleSlug, pfSlug } = parsed.data;

  const fille = getFilleBySlug(filleSlug);
  const pf = getPetiteFille(filleSlug, pfSlug);
  if (!fille || !pf) {
    return NextResponse.json(
      { error: "Article introuvable dans le cocon" },
      { status: 404 },
    );
  }

  // L'article publié est toujours celui généré et stocké côté serveur,
  // jamais un HTML fourni par le client.
  const stored = await loadOne<{ article?: unknown }>("articles", filleSlug, pfSlug);
  const article = z.object({ article: articleShape }).safeParse(stored);
  if (!article.success) {
    return NextResponse.json(
      { error: "Aucun article généré pour ce slug : lance d'abord la génération" },
      { status: 409 },
    );
  }
  const a = article.data.article;

  // Le tag primaire est forcé au pilier du cocon ; les tags du modèle restent secondaires.
  const pilierTag = fille.pilier_slug;
  const tags = [
    pilierTag,
    ...new Set([a.primary_tag, ...a.tags].filter((t) => t && t !== pilierTag)),
  ];

  // Image hero optionnelle : un échec ne bloque pas la publication.
  let featureImageUrl: string | undefined;
  let imageStatus: "skipped" | "generated" | "failed" = "skipped";
  if (isFalConfigured() && a.feature_image_prompt) {
    try {
      const img = await generateImage(a.feature_image_prompt, "16:9");
      const uploaded = await uploadImage(img.buffer, `${pf.slug}.jpg`, img.contentType);
      featureImageUrl = uploaded.url;
      imageStatus = "generated";
    } catch (err) {
      imageStatus = "failed";
      console.error(`[cocon/publish] ${pf.slug} image échec:`, err);
    }
  }

  try {
    const result = await upsertPost({
      slug: pf.slug,
      title: pf.title,
      html: a.html,
      meta_title: a.meta_title,
      meta_description: a.meta_description,
      custom_excerpt: a.custom_excerpt,
      og_title: a.og_title,
      og_description: a.og_description,
      tags,
      feature_image: featureImageUrl,
      feature_image_alt: featureImageUrl ? pf.title : undefined,
    });
    const response = {
      ok: true,
      mode: result.mode,
      post: { id: result.post.id, slug: result.post.slug, status: result.post.status },
      adminUrl: result.adminUrl,
      featureImage: { url: featureImageUrl ?? null, status: imageStatus },
    };
    await save("published", filleSlug, pfSlug, response);
    return NextResponse.json(response);
  } catch (err) {
    console.error(`[cocon/publish] ${pf.slug} échec Ghost:`, err);
    return NextResponse.json(
      { ok: false, error: "Publication Ghost échouée (détails dans les logs serveur)" },
      { status: 502 },
    );
  }
}
