import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { Card, Eyebrow, SectionTitle } from "@/components/ui/card";
import AdminLogout from "@/components/admin/admin-logout";
import AdminNav from "@/components/admin/admin-nav";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin — ภาพรวมระบบ",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function baht(satang: number): string {
  return (satang / 100).toLocaleString("th-TH");
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-black text-gold">{value}</p>
    </Card>
  );
}

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const admin = createSupabaseAdminClient();

  let userCount = 0;
  let completedCount = 0;
  let paidCount = 0;
  let pendingCount = 0;
  let entitlementCount = 0;
  let opportunityCount = 0;
  let revenue = 0;
  let recentOrders: {
    id: string;
    email: string;
    product: string;
    total: number;
    status: string;
    created_at: string;
  }[] = [];

  if (admin) {
    const emailById = new Map<string, string>();
    try {
      const { data: usersData } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      userCount = usersData?.users.length ?? 0;
      for (const u of usersData?.users ?? [])
        emailById.set(u.id, u.email ?? "—");
    } catch {
      /* listUsers may be unavailable — leave counts at 0 */
    }

    const [completed, paid, pending, ents, opps, paidRows, recent] =
      await Promise.all([
        admin
          .from("assessment_sessions")
          .select("id", { count: "exact", head: true })
          .in("status", ["completed", "claimed"]),
        admin
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("status", "paid"),
        admin
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        admin
          .from("entitlements")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        admin
          .from("opportunities")
          .select("id", { count: "exact", head: true }),
        admin.from("orders").select("total").eq("status", "paid"),
        admin
          .from("orders")
          .select("id, user_id, total, status, created_at, products(name)")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

    completedCount = completed.count ?? 0;
    paidCount = paid.count ?? 0;
    pendingCount = pending.count ?? 0;
    entitlementCount = ents.count ?? 0;
    opportunityCount = opps.count ?? 0;
    revenue = (paidRows.data ?? []).reduce(
      (sum, r) => sum + ((r.total as number) ?? 0),
      0,
    );

    recentOrders = (recent.data ?? []).map((o) => {
      const product = o.products as { name: string } | { name: string }[] | null;
      const name = Array.isArray(product)
        ? (product[0]?.name ?? "—")
        : (product?.name ?? "—");
      return {
        id: o.id as string,
        email: emailById.get(o.user_id as string) ?? "—",
        product: name,
        total: o.total as number,
        status: o.status as string,
        created_at: o.created_at as string,
      };
    });
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <Eyebrow>Admin</Eyebrow>
            <SectionTitle>ภาพรวมระบบ</SectionTitle>
          </div>
          <div className="flex items-center gap-3">
            <AdminNav active="overview" />
            <AdminLogout />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="ผู้ใช้ทั้งหมด" value={userCount} />
          <Stat label="ทำแบบวิเคราะห์เสร็จ" value={completedCount} />
          <Stat label="ออเดอร์ชำระแล้ว" value={paidCount} />
          <Stat label="รายได้รวม (บาท)" value={baht(revenue)} />
          <Stat label="ออเดอร์รอชำระ" value={pendingCount} />
          <Stat label="สิทธิ์ที่ใช้งานอยู่" value={entitlementCount} />
          <Stat label="โอกาส (Radar)" value={opportunityCount} />
        </div>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-semibold text-paper">ออเดอร์ล่าสุด</h2>
          {recentOrders.length === 0 ? (
            <Card className="p-6 text-sm text-muted">ยังไม่มีออเดอร์</Card>
          ) : (
            <Card className="overflow-hidden p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3">ผู้ใช้</th>
                    <th className="px-4 py-3">สินค้า</th>
                    <th className="px-4 py-3">ยอด</th>
                    <th className="px-4 py-3">สถานะ</th>
                    <th className="px-4 py-3">วันที่</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-border/50">
                      <td className="px-4 py-3 text-paper/90">{o.email}</td>
                      <td className="px-4 py-3 text-paper/90">{o.product}</td>
                      <td className="px-4 py-3 text-gold">{baht(o.total)}฿</td>
                      <td className="px-4 py-3 text-paper/70">{o.status}</td>
                      <td className="px-4 py-3 text-muted">
                        {new Date(o.created_at).toLocaleDateString("th-TH")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
