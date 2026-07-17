import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export const ADMIN_COOKIE = "mr_admin";

/** Deterministic session token derived from the configured admin password. */
export function adminToken(): string {
  return createHash("sha256")
    .update(`${env.adminPassword}:mr-admin-v1`)
    .digest("hex");
}

/** Constant-time comparison to avoid leaking timing information. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** True when the current request carries a valid admin session cookie. */
export async function isAdminAuthenticated(): Promise<boolean> {
  if (!env.adminPassword) return false;
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, adminToken());
}
