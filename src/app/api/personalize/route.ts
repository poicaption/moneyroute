import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getPersonalization,
  upsertPersonalization,
} from "@/lib/persistence/personalization";
import {
  GOALS,
  BUDGET_BANDS,
  AUDIENCE_BANDS,
  BLOCKERS,
  type PersonalizationProfile,
} from "@/lib/domain/personalization";

export const runtime = "nodejs";

/** GET /api/personalize — the current user's saved profile (or null). */
export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ profile: null });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ profile: null });

  const profile = await getPersonalization(user.id);
  return NextResponse.json({ profile });
}

function parseProfile(body: unknown): PersonalizationProfile | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const goal = b.goal;
  const budgetBand = b.budgetBand;
  const audienceBand = b.audienceBand;
  const blocker = b.blocker;

  if (typeof goal !== "string" || !GOALS.includes(goal as never)) return null;
  if (typeof budgetBand !== "string" || !BUDGET_BANDS.includes(budgetBand as never))
    return null;
  if (
    typeof audienceBand !== "string" ||
    !AUDIENCE_BANDS.includes(audienceBand as never)
  )
    return null;
  if (typeof blocker !== "string" || !BLOCKERS.includes(blocker as never))
    return null;

  const target = Number(b.monthlyTargetThb);
  const hours = Number(b.hoursPerWeek);
  const niche = typeof b.nicheText === "string" ? b.nicheText.slice(0, 300) : "";

  return {
    goal: goal as PersonalizationProfile["goal"],
    monthlyTargetThb:
      Number.isFinite(target) && target > 0 ? Math.min(target, 10_000_000) : 0,
    hoursPerWeek:
      Number.isFinite(hours) && hours > 0 ? Math.min(Math.round(hours), 168) : 0,
    budgetBand: budgetBand as PersonalizationProfile["budgetBand"],
    audienceBand: audienceBand as PersonalizationProfile["audienceBand"],
    blocker: blocker as PersonalizationProfile["blocker"],
    nicheText: niche,
  };
}

/** POST /api/personalize — save the current user's profile. */
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "unconfigured" },
      { status: 503 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const profile = parseProfile(body);
  if (!profile) {
    return NextResponse.json(
      { ok: false, error: "invalid" },
      { status: 400 },
    );
  }

  const sessionId =
    body && typeof body === "object" && typeof (body as Record<string, unknown>).sessionId === "string"
      ? ((body as Record<string, unknown>).sessionId as string)
      : null;

  const ok = await upsertPersonalization(user.id, profile, sessionId);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
