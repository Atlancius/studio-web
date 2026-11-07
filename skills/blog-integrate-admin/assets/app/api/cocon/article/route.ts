import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getStaticAllowedUrls,
  KNOWLEDGE_BASE,
  sanitizeArticle,
} from "@/lib/cocon";
import {
  articleShape,
  PipelineError,
  resolveArticle,
  runArticle,
  runBrief,
  slugPair,
} from "@/lib/pipeline";
import { save } from "@/lib/cocon-storage";
import { validateLinks } from "@/lib/link-validator";
import { getPostSlugs } from "@/lib/ghost";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY non configurée" },
      { status: 500 },
    );
  }

  const parsed = slugPair.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "filleSlug et pfSlug requis" },
      { status: 400 },
    );
  }
  const { filleSlug, pfSlug } = parsed.data;

  try {
    const { ctx } = resolveArticle(filleSlug, pfSlug);

    // P1
    const { brief, usage: briefUsage } = await runBrief(filleSlug, pfSlug);
    await save("briefs", filleSlug, pfSlug, { brief, usage: briefUsage });

    // Liens internes autorisés (pages du cocon + articles déjà en ligne)
    let publishedUrls: string[] = [];
    try {
      publishedUrls = (await getPostSlugs()).map((s) => `/blog/${s}`);
    } catch (err) {
      console.warn("[cocon/article] getPostSlugs failed:", err);
    }

    // P2
    const userPrompt = `Voici le brief à exécuter, produis l'article HTML + tous les méta SEO.

KNOWLEDGE BASE (validée le ${KNOWLEDGE_BASE.validated_at}), utilise EXCLUSIVEMENT ces faits pour tout chiffre, prix, statistique, version, ou caractéristique produit :
${JSON.stringify(KNOWLEDGE_BASE, null, 2)}

BRIEF :
${JSON.stringify(brief, null, 2)}

LIENS_AUTORISES (RÈGLE STRICTE : tu ne peux insérer QUE ces URLs internes, aucune autre. Les URLs hors de cette liste sont automatiquement remplacées par la page pilier.) :

- MÈRE (obligatoire, dans les 200 premiers mots) : ${ctx.mere.url}
- PAGE PILIER PARENT : ${ctx.pilier_parent.url}
- AUTRES PILIERS du cocon (utilise-en 2 ou 3 dans le corps) :
${ctx.pilier_soeurs.map((s) => `  • ${s.url}, sujet : ${s.keyword}`).join("\n")}
- CTA FINAL OBLIGATOIRE (dans le dernier paragraphe) : ${ctx.cta.url}, label naturel : "${ctx.cta.label}"
${ctx.outils_techniques.length ? `- PAGES OUTILS techniques (si pertinent) :\n${ctx.outils_techniques.map((u) => `  • ${u}`).join("\n")}` : ""}
${publishedUrls.length ? `- AUTRES ARTICLES BLOG déjà publiés (lie ceux qui sont pertinents) :\n${publishedUrls.map((u) => `  • ${u}`).join("\n")}` : ""}

CONTRAINTES :
- ${brief.word_count_target ?? 1500} mots cible
- Ton : ${brief.tone ?? "direct"}
- Structure imposée par les H2 du brief, respecte-les
- HTML pur, pas de markdown
- Pas de h1`;

    const { data, usage: articleUsage } = await runArticle({ brief, userPrompt });
    const article = articleShape.safeParse(data);
    if (!article.success) {
      throw new PipelineError("P2 article : structure inattendue");
    }
    const clean = sanitizeArticle(article.data);

    // Filet de sécurité : tout lien interne hors liste est réécrit vers le pilier parent
    const validation = validateLinks(
      clean.html,
      new Set([...getStaticAllowedUrls(), ...publishedUrls]),
      ctx.pilier_parent.url,
    );
    clean.html = validation.cleaned;

    const result = {
      brief,
      article: clean,
      usage: {
        brief: briefUsage,
        article: articleUsage,
        total_input: briefUsage.input_tokens + articleUsage.input_tokens,
        total_output: briefUsage.output_tokens + articleUsage.output_tokens,
      },
      link_validation: {
        total: validation.totalLinks,
        internal: validation.internalLinks,
        external: validation.externalLinks,
        rewritten: validation.rewrittenLinks,
      },
    };
    await save("articles", filleSlug, pfSlug, result);
    console.log(
      `[cocon/article] ${filleSlug}/${pfSlug} ok in=${result.usage.total_input} out=${result.usage.total_output} rewritten=${validation.rewrittenLinks.length}`,
    );
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof PipelineError) {
      return NextResponse.json({ error: err.publicMessage }, { status: err.status });
    }
    console.error("[cocon/article]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
