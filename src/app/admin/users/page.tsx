import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { Card, Eyebrow, SectionTitle } from "@/components/ui/card";
import AdminLogout from "@/components/admin/admin-logout";
import AdminNav from "@/components/admin/admin-nav";
import AdminEntitlementToggle from "@/components/admin/admin-entitlement-toggle";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin — จัดการบัญชีลูกค้า",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function baht(satang: number): string {
  return (satang / 100).toLocaleString("th-TH");
}

type UserRow = {
  id: string;
  email: string;
  createdAt: string;
  lastSignIn: string | null;
  assessments: number;
  paidOrders: number;
  spend: number;
  blueprint: boolean;
  routeKit: boolean;
};

export default async function AdminUsersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const admin = createSupabaseAdminClient();
  let rows: UserRow[] = [];

  if (admin) {
    // Users.
    let users: { id: string; email: string; created_at: string; last_sign_in_at: string | null }[] =
      [];
    try {
      const { data } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      users = (data?.users ?? []).map((u) => ({
        id: u.id,
        email: u.email ?? "—",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
      }));
    } catch {
      /* listUsers unavailable */
    }

    // Aggregate related data in parallel.
    const [entRes, orderRes, sessionRes] = await Promise.all([
      admin
        .from("entitlements")
        .select("user_id, entitlement_key")
        .eq("status", "active"),
      admin.from("orders").select("user_id, total, status").eq("status", "paid"),
      admin
        .from("assessment_sessions")
        .select("user_id, status")
        .in("status", ["completed", "claimed"]),
    ]);

    const blueprintUsers = new Set<string>();
    const routeKitUsers = new Set<string>();
    for (const e of entRes.data ?? []) {
      if (e.entitlement_key === "income_blueprint")
        blueprintUsers.add(e.user_id as string);
      if (e.entitlement_key === "route_kit")
        routeKitUsers.add(e.user_id as string);
    }

    const orderCount = new Map<string, number>();
    const spend = new Map<string, number>();
    for (const o of orderRes.data ?? []) {
      const uid = o.user_id as string;
      orderCount.set(uid, (orderCount.get(uid) ?? 0) + 1);
      spend.set(uid, (spend.get(uid) ?? 0) + ((o.total as number) ?? 0));
    }

    const assessmentCount = new Map<string, number>();
    for (const s of sessionRes.data ?? []) {
      const uid = s.user_id as string | null;
      if (!uid) continue;
      assessmentCount.set(uid, (assessmentCount.get(uid) ?? 0) + 1);
    }

    rows = users
      .map((u) => ({
        id: u.id,
        email: u.email,
        createdAt: u.created_at,
        lastSignIn: u.last_sign_in_at,
        assessments: assessmentCount.get(u.id) ?? 0,
        paidOrders: orderCount.get(u.id) ?? 0,
        spend: spend.get(u.id) ?? 0,
        blueprint: blueprintUsers.has(u.id),
        routeKit: routeKitUsers.has(u.id),
      }))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <Eyebrow>Admin</Eyebrow>
            <SectionTitle>จัดการบัญชีลูกค้า</SectionTitle>
          </div>
          <div className="flex items-center gap-3">
            <AdminNav active="users" />
            <AdminLogout />
          </div>
        </div>

        <p className="mt-4 text-sm text-muted">
          รวม {rows.length} บัญชี · คลิกป้ายสิทธิ์เพื่อให้/ถอนสิทธิ์ทันที
        </p>

        <Card className="mt-6 overflow-x-auto p-0">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">อีเมล</th>
                <th className="px-4 py-3">สมัคร</th>
                <th className="px-4 py-3">เข้าล่าสุด</th>
                <th className="px-4 py-3 text-center">วิเคราะห์</th>
                <th className="px-4 py-3 text-center">ออเดอร์</th>
                <th className="px-4 py-3 text-right">ใช้จ่าย (฿)</th>
                <th className="px-4 py-3">สิทธิ์</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted">
                    ยังไม่มีบัญชีผู้ใช้
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id} className="border-b border-border/50">
                    <td className="px-4 py-3 text-paper/90">{u.email}</td>
                    <td className="px-4 py-3 text-muted">
                      {new Date(u.createdAt).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {u.lastSignIn
                        ? new Date(u.lastSignIn).toLocaleDateString("th-TH")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-paper/80">
                      {u.assessments}
                    </td>
                    <td className="px-4 py-3 text-center text-paper/80">
                      {u.paidOrders}
                    </td>
                    <td className="px-4 py-3 text-right text-gold">
                      {baht(u.spend)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <AdminEntitlementToggle
                          userId={u.id}
                          entitlementKey="income_blueprint"
                          active={u.blueprint}
                        />
                        <AdminEntitlementToggle
                          userId={u.id}
                          entitlementKey="route_kit"
                          active={u.routeKit}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
