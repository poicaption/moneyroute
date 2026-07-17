import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BodySchema = z.object({
  anonymousSessionId: z.string().min(1).max(128),
});

/**
 * POST /api/claim
 * Attaches the caller's anonymous assessment sessions to their account.
 * Requires an authenticated Supabase session (cookie).
 */
export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "auth_unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

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

  // Use the admin client: anonymous rows have user_id = null, which RLS
  // update policies (auth.uid() = user_id) would otherwise block.
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "admin_unavailable" }, { status: 503 });
  }

  const { data, error } = await admin
    .from("assessment_sessions")
    .update({
      user_id: user.id,
      status: "claimed",
      claimed_at: new Date().toISOString(),
    })
    .eq("anonymous_session_id", parsed.data.anonymousSessionId)
    .is("user_id", null)
    .select("id");

  if (error) {
    return NextResponse.json({ error: "claim_failed" }, { status: 500 });
  }

  return NextResponse.json({ claimed: data?.length ?? 0 });
}
