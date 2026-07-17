import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { Eyebrow, SectionTitle } from "@/components/ui/card";
import PersonalizeForm from "@/components/personalize/personalize-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPersonalization } from "@/lib/persistence/personalization";

export const metadata: Metadata = {
  title: "ปรับเนื้อหาให้เหมาะกับคุณ — ROOTMAN MONEY ROUTE",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PersonalizePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; session?: string }>;
}) {
  const { next, session } = await searchParams;

  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/login?next=/personalize");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/personalize");

  const initial = await getPersonalization(user.id);
  const nextHref = next && next.startsWith("/") ? next : "/dashboard";
  const sessionId = session ?? null;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <Eyebrow>ปรับเฉพาะคุณ</Eyebrow>
            <SectionTitle>ตอบ 7 ข้อ แล้วเราจะปรับให้ทั้งหมด</SectionTitle>
          </div>
          <Link href={nextHref} className="text-sm text-muted hover:text-paper">
            ข้ามไปก่อน
          </Link>
        </div>

        <p className="mt-4 text-sm text-muted">
          คำตอบเหล่านี้ใช้ปรับแต่ง Income Blueprint, โปรแกรมทดลอง และ Route Kit
          ให้ตรงกับเป้าหมาย เวลา ทุน และอุปสรรคจริงของคุณ —
          ไม่ใช่คำแนะนำกลาง ๆ ที่ใครก็ได้เหมือนกัน
        </p>

        <div className="mt-8">
          <PersonalizeForm
            initial={initial}
            sessionId={sessionId}
            nextHref={nextHref}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
