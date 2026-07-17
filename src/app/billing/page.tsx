import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { Card, Eyebrow, SectionTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "การเรียกเก็บเงิน — ROOTMAN MONEY ROUTE",
  description: "ประวัติการสั่งซื้อและสิทธิ์การเข้าถึงของคุณ",
};

export const runtime = "nodejs";

type OrderRow = {
  id: string;
  status: string;
  total: number;
  currency: string;
  created_at: string;
  paid_at: string | null;
  product_name: string | null;
};

type EntitlementRow = {
  entitlement_key: string;
  status: string;
  starts_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "รอชำระเงิน",
  paid: "ชำระแล้ว",
  failed: "ไม่สำเร็จ",
  refunded: "คืนเงินแล้ว",
};

const ENTITLEMENT_LABEL: Record<string, string> = {
  income_blueprint: "Income Blueprint (รายงานฉบับเต็ม)",
  route_kit: "Route Kit (ชุดเครื่องมือ)",
};

function formatBaht(satang: number, currency: string): string {
  const amount = (satang / 100).toLocaleString("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${amount} ${currency.toUpperCase()}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BillingPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/login?next=/billing");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/billing");

  const admin = createSupabaseAdminClient();

  let orders: OrderRow[] = [];
  let entitlements: EntitlementRow[] = [];

  if (admin) {
    const { data: orderRows } = await admin
      .from("orders")
      .select("id, status, total, currency, created_at, paid_at, products(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    orders = (orderRows ?? []).map((o) => {
      const product = o.products as { name: string } | { name: string }[] | null;
      const name = Array.isArray(product)
        ? (product[0]?.name ?? null)
        : (product?.name ?? null);
      return {
        id: o.id as string,
        status: o.status as string,
        total: o.total as number,
        currency: o.currency as string,
        created_at: o.created_at as string,
        paid_at: o.paid_at as string | null,
        product_name: name,
      };
    });

    const { data: entRows } = await admin
      .from("entitlements")
      .select("entitlement_key, status, starts_at")
      .eq("user_id", user.id)
      .eq("status", "active");
    entitlements = (entRows ?? []) as EntitlementRow[];
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-2">
          <Eyebrow>การเรียกเก็บเงิน</Eyebrow>
          <SectionTitle>ประวัติการสั่งซื้อ</SectionTitle>
          <p className="text-sm text-muted">{user.email}</p>
        </div>

        {/* Active entitlements */}
        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-paper">สิทธิ์ที่ใช้งานได้</h2>
          {entitlements.length === 0 ? (
            <Card className="p-6 text-sm text-muted">
              ยังไม่มีสิทธิ์การเข้าถึง — ปลดล็อกสินค้าเพื่อเริ่มใช้งาน
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {entitlements.map((e) => (
                <Card key={e.entitlement_key} glow="gold" className="p-5">
                  <p className="font-semibold text-paper">
                    {ENTITLEMENT_LABEL[e.entitlement_key] ?? e.entitlement_key}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    เริ่มใช้งาน {formatDate(e.starts_at)}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Orders */}
        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-semibold text-paper">รายการสั่งซื้อ</h2>
          {orders.length === 0 ? (
            <Card className="flex flex-col items-center gap-4 p-8 text-center">
              <p className="text-sm text-muted">ยังไม่มีรายการสั่งซื้อ</p>
              <ButtonLink href="/pricing" variant="gold" size="sm">
                ดูสินค้าและราคา
              </ButtonLink>
            </Card>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <Card
                  key={o.id}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-paper">
                      {o.product_name ?? "สินค้า"}
                    </p>
                    <p className="text-xs text-muted">
                      {formatDate(o.paid_at ?? o.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gold">
                      {formatBaht(o.total, o.currency)}
                    </p>
                    <p
                      className={`text-xs ${
                        o.status === "paid"
                          ? "text-gold"
                          : o.status === "failed"
                            ? "text-red-soft"
                            : "text-muted"
                      }`}
                    >
                      {STATUS_LABEL[o.status] ?? o.status}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <div className="mt-10">
          <ButtonLink href="/dashboard" variant="outline" size="sm">
            ← กลับแดชบอร์ด
          </ButtonLink>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
