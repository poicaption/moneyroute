import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  hasEntitlement,
  INCOME_BLUEPRINT_KEY,
  ROUTE_KIT_KEY,
} from "@/lib/persistence/entitlements";

export const runtime = "nodejs";

/**
 * GET /api/me/access
 * Returns the current user's authentication and entitlement flags so client
 * views (e.g. the free result page) can hide purchase prompts for buyers.
 */
export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({
      authenticated: false,
      blueprint: false,
      routeKit: false,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      authenticated: false,
      blueprint: false,
      routeKit: false,
    });
  }

  const [blueprint, routeKit] = await Promise.all([
    hasEntitlement(user.id, INCOME_BLUEPRINT_KEY),
    hasEntitlement(user.id, ROUTE_KIT_KEY),
  ]);

  return NextResponse.json({ authenticated: true, blueprint, routeKit });
}
