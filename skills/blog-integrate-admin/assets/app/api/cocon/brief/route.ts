import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { PipelineError, runBrief, slugPair } from "@/lib/pipeline";
import { save } from "@/lib/cocon-storage";

export const runtime = "nodejs";
export const maxDuration = 60;

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
    const result = await runBrief(filleSlug, pfSlug);
    await save("briefs", filleSlug, pfSlug, result);
    console.log(
      `[cocon/brief] ${filleSlug}/${pfSlug} in=${result.usage.input_tokens} out=${result.usage.output_tokens}`,
    );
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof PipelineError) {
      return NextResponse.json({ error: err.publicMessage }, { status: err.status });
    }
    console.error("[cocon/brief]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
