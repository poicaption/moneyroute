import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { ADMIN_COOKIE, adminToken, safeEqual } from "@/lib/admin/session";

export const runtime = "nodejs";

const BodySchema = z.object({ password: z.string().min(1).max(200) });

/**
 * POST /api/admin/login
 * Validates the admin password and sets a session cookie.
 */
export async function POST(request: Request) {
  if (!env.adminPassword) {
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

  if (!safeEqual(parsed.data.password, env.adminPassword)) {
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

/** DELETE /api/admin/login — clears the admin session. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
