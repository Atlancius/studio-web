/**
 * Pipeline P1 (brief) -> P2 (article) côté serveur, partagé par les routes
 * /api/cocon/brief et /api/cocon/article.
 * Erreurs : détail loggé côté serveur, message générique renvoyé au client.
 */

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  cocon,
  getFilleBySlug,
  getLinkingContext,
  getPetiteFille,
  MODEL_ARTICLE,
  MODEL_BRIEF,
} from "@/lib/cocon";
import {
  ARTICLE_SCHEMA,
  BRIEF_SCHEMA,
  P1_SYSTEM,
  P2_SYSTEM,
} from "@/lib/prompts";

export class PipelineError extends Error {
  constructor(
    public publicMessage: string,
    public status = 500,
  ) {
    super(publicMessage);
  }
}

/** Slugs reçus du client : minuscules, chiffres, tirets, underscores. */
export const slugPair = z.object({
  filleSlug: z.string().regex(/^[a-z0-9_-]{1,120}$/i),
  pfSlug: z.string().regex(/^[a-z0-9_-]{1,120}$/i),
});

export type Usage = { input_tokens: number; output_tokens: number };

export const briefShape = z.object({
  h1: z.string(),
  structure: z.array(z.object({ h2: z.string(), what: z.string() })),
  word_count_target: z.number().optional(),
  tone: z.string().optional(),
}).passthrough();
export type Brief = z.infer<typeof briefShape>;

export function resolveArticle(filleSlug: string, pfSlug: string) {
  const fille = getFilleBySlug(filleSlug);
  const pf = getPetiteFille(filleSlug, pfSlug);
  const ctx = getLinkingContext(filleSlug, pfSlug);
  if (!fille || !pf || !ctx) {
    throw new PipelineError("Article introuvable dans le cocon", 404);
  }
  return { fille, pf, ctx };
}

/** Appel Anthropic avec sortie JSON contrainte par schéma (GA, output_config.format). */
async function callJson(
  label: string,
  params: {
    model: string;
    max_tokens: number;
    system: string;
    prompt: string;
    schema: Record<string, unknown>;
  },
): Promise<{ data: unknown; usage: Usage }> {
  const client = new Anthropic();
  let response;
  try {
    response = await client.messages.create({
      model: params.model,
      max_tokens: params.max_tokens,
      system: params.system,
      messages: [{ role: "user", content: params.prompt }],
      output_config: { format: { type: "json_schema", schema: params.schema } },
    });
  } catch (err) {
    console.error(`[cocon] ${label} appel Anthropic échoué:`, err);
    throw new PipelineError(`${label} : appel Anthropic échoué`);
  }
  if (response.stop_reason === "max_tokens" || response.stop_reason === "refusal") {
    console.error(`[cocon] ${label} stop_reason=${response.stop_reason}`);
    throw new PipelineError(
      `${label} : sortie incomplète ou refusée (${response.stop_reason})`,
    );
  }
  const block = response.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new PipelineError(`${label} : pas de texte en sortie`);
  }
  try {
    return {
      data: JSON.parse(block.text),
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    };
  } catch (err) {
    console.error(`[cocon] ${label} JSON invalide:`, err);
    throw new PipelineError(`${label} : JSON invalide en sortie`);
  }
}

export async function runBrief(filleSlug: string, pfSlug: string) {
  const { fille, pf, ctx } = resolveArticle(filleSlug, pfSlug);
  const prompt = `Génère le brief de l'article suivant.

KEYWORD CIBLE : ${pf.keyword}
TITRE PROPOSÉ : ${pf.title}
${pf.keywords_secondaires?.length ? `MOTS-CLÉS SECONDAIRES : ${pf.keywords_secondaires.join(", ")}` : ""}

CONTEXTE COCON :
- Cet article est une PETITE-FILLE dans le cocon "${cocon.mere.title}"
- Mère : ${ctx.mere.title} (${ctx.mere.url}), keyword : ${ctx.mere.keyword}
- Pilier parent : ${ctx.pilier_parent.title} (${ctx.pilier_parent.url})
- Piliers sœurs proches :
${ctx.pilier_soeurs.map((s) => `  • ${s.title} (${s.url}), keyword : ${s.keyword}`).join("\n")}
- CTA principal : ${ctx.cta.url}, label : "${ctx.cta.label}"
${ctx.outils_techniques.length ? `- Outils à mailler : ${ctx.outils_techniques.join(", ")}` : ""}

PERSONA CIBLE : ${fille.persona}
INTENT : ${pf.intent}
WORD COUNT CIBLE : 1500 mots`;

  const { data, usage } = await callJson("P1 brief", {
    model: MODEL_BRIEF,
    max_tokens: 8000,
    system: P1_SYSTEM,
    prompt,
    schema: BRIEF_SCHEMA,
  });
  const parsed = briefShape.safeParse(data);
  if (!parsed.success) throw new PipelineError("P1 brief : structure inattendue");
  return { brief: parsed.data, usage };
}

export async function runArticle(args: {
  brief: Brief;
  userPrompt: string;
}) {
  return callJson("P2 article", {
    model: MODEL_ARTICLE,
    max_tokens: 16000,
    system: P2_SYSTEM,
    prompt: args.userPrompt,
    schema: ARTICLE_SCHEMA,
  });
}

export const articleShape = z.object({
  html: z.string().min(1),
  meta_title: z.string(),
  meta_description: z.string(),
  custom_excerpt: z.string(),
  og_title: z.string(),
  og_description: z.string(),
  tags: z.array(z.string()),
  primary_tag: z.string(),
  feature_image_prompt: z.string(),
});
export type Article = z.infer<typeof articleShape>;
