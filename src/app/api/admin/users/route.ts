import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  INCOME_BLUEPRINT_KEY,
  ROUTE_KIT_KEY,
} from "@/lib/persistence/entitlements";

export const runtime = "nodejs";

const BodySchema = z.object({
  userId: z.string().uuid(),
  entitlementKey: z.enum([INCOME_BLUEPRINT_KEY, ROUTE_KIT_KEY]),
  action: z.enum(["grant", "revoke"]),
});

/**
 * POST /api/admin/users
 * Grants or revokes a product entitlement for a user. Admin-gated by the
 * mr_admin cookie (password login). Uses the service role client.
 */
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "admin_unavailable" }, { status: 503 });
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

  const { userId, entitlementKey, action } = parsed.data;

  if (action === "grant") {
    const { data: existing } = await admin
      .from("entitlements")
      .select("id")
      .eq("user_id", userId)
      .eq("entitlement_key", entitlementKey)
      .eq("status", "active")
      .maybeSingle();

    if (!existing) {
      const { error } = await admin.from("entitlements").insert({
        user_id: userId,
        entitlement_key: entitlementKey,
        status: "active",
      });
      if (error) {
        return NextResponse.json({ error: "grant_failed" }, { status: 500 });
      }
    }
    return NextResponse.json({ ok: true, action: "grant" });
  }

  // revoke: deactivate any active grants of this key for the user.
  const { error } = await admin
    .from("entitlements")
    .update({ status: "revoked" })
    .eq("user_id", userId)
    .eq("entitlement_key", entitlementKey)
    .eq("status", "active");

  if (error) {
    return NextResponse.json({ error: "revoke_failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, action: "revoke" });
}
