import { NextResponse } from "next/server";
import { z } from "zod";
import { computeScores } from "@/lib/domain/scoring";
import { QUESTION_BY_CODE } from "@/lib/domain/questions";

export const runtime = "nodejs";

const BodySchema = z.object({
  answers: z.record(z.string(), z.string()),
});

/**
 * POST /api/score
 * Computes a deterministic score snapshot from an answer map.
 * Scoring always happens server-side — the client never decides the result.
 */
export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  // Keep only answers that reference known questions/options.
  const clean: Record<string, string> = {};
  for (const [qCode, optCode] of Object.entries(parsed.data.answers)) {
    const q = QUESTION_BY_CODE.get(qCode);
    if (q && q.options.some((o) => o.code === optCode)) {
      clean[qCode] = optCode;
    }
  }

  const snapshot = computeScores(clean);
  return NextResponse.json({ snapshot });
}
