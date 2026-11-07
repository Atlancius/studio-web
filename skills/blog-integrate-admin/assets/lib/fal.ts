/**
 * Client fal.ai (nano-banana-2) pour générer les images hero des articles.
 *
 * Endpoint : POST https://fal.run/fal-ai/nano-banana-2
 * Auth : header `Authorization: Key <FAL_KEY>`
 * Paramètres : aspect_ratio 16:9, resolution 2K, output_format jpeg.
 *
 * Format de prompt recommandé : toujours inclure
 *   "editorial magazine photograph, Kodak Portra 400 film grain,
 *    [sujet spécifique], muted palette, photorealistic"
 */

export type FalAspectRatio = "3:4" | "4:3" | "3:2" | "16:9";

export type FalImageResult = {
  url: string;
  buffer: Buffer;
  contentType: string;
};

const FAL_ENDPOINT = "https://fal.run/fal-ai/nano-banana-2";
const DEFAULT_ASPECT_RATIO: FalAspectRatio = "16:9";

export function isFalConfigured(): boolean {
  return Boolean(process.env.FAL_KEY);
}

export async function generateImage(
  prompt: string,
  aspectRatio: FalAspectRatio = DEFAULT_ASPECT_RATIO,
): Promise<FalImageResult> {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY non configurée");

  const res = await fetch(FAL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      aspect_ratio: aspectRatio,
      resolution: "2K",
      output_format: "jpeg",
      num_images: 1,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`fal.ai ${res.status}: ${body || res.statusText}`);
  }

  const data = (await res.json()) as { images?: { url: string }[] };
  const url = data.images?.[0]?.url;
  if (!url) throw new Error("fal.ai: réponse sans URL d'image");

  const imgRes = await fetch(url);
  if (!imgRes.ok) {
    throw new Error(`fal.ai download ${imgRes.status}: ${imgRes.statusText}`);
  }
  const arrayBuffer = await imgRes.arrayBuffer();
  return {
    url,
    buffer: Buffer.from(arrayBuffer),
    contentType: imgRes.headers.get("content-type") ?? "image/jpeg",
  };
}
