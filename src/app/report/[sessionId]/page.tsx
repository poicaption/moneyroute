import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { Eyebrow } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import ReportView from "@/components/report/report-view";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  hasEntitlement,
  INCOME_BLUEPRINT_KEY,
  ROUTE_KIT_KEY,
} from "@/lib/persistence/entitlements";
import { computeScores, type AnswerMap } from "@/lib/domain/scoring";
import { getPersonalization } from "@/lib/persistence/personalization";
import {
  buildReport,
  ReportSchema,
  REPORT_VERSION,
  TEMPLATE_VERSION,
  type Report,
} from "@/lib/domain/report";

export const metadata: Metadata = {
  title: "รายงานฉบับเต็ม — ROOTMAN MONEY ROUTE",
  description: "แผนสร้างรายได้เฉพาะตัวจากผลวิเคราะห์ Money Scan",
};

export const runtime = "nodejs";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/report/${sessionId}`)}`);
  }

  const admin = createSupabaseAdminClient();
  if (!admin) notFound();

  // Confirm the caller owns this session.
  const { data: session } = await admin
    .from("assessment_sessions")
    .select("id, user_id, answers")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session || session.user_id !== user.id) notFound();

  // Gate the full report behind the Income Blueprint entitlement.
  const entitled = await hasEntitlement(user.id, INCOME_BLUEPRINT_KEY);
  if (!entitled) {
    redirect(`/pricing?session=${encodeURIComponent(sessionId)}`);
  }

  // Reuse a persisted report when it matches the current engine version.
  const { data: existing } = await admin
    .from("reports")
    .select("structured_content, report_version, template_version")
    .eq("session_id", sessionId)
    .maybeSingle();

  // Personalization tailors the report to the customer's intake profile.
  const profile = await getPersonalization(user.id);

  let report: Report;

  if (profile) {
    // Always rebuild with the current profile so edits take effect immediately.
    report = buildReport(computeScores(session.answers as AnswerMap), profile);
    await admin.from("reports").upsert(
      {
        session_id: sessionId,
        user_id: user.id,
        report_version: REPORT_VERSION,
        template_version: TEMPLATE_VERSION,
        status: "ready",
        structured_content: report,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_id" },
    );
  } else {
    const isFresh =
      existing &&
      existing.report_version === REPORT_VERSION &&
      existing.template_version === TEMPLATE_VERSION;

    if (isFresh) {
      const parsed = ReportSchema.safeParse(existing.structured_content);
      report = parsed.success
        ? parsed.data
        : buildReport(computeScores(session.answers as AnswerMap));
    } else {
      report = buildReport(computeScores(session.answers as AnswerMap));
      // Persist (best-effort) so future loads are fast and stable.
      await admin.from("reports").upsert(
        {
          session_id: sessionId,
          user_id: user.id,
          report_version: REPORT_VERSION,
          template_version: TEMPLATE_VERSION,
          status: "ready",
          structured_content: report,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_id" },
      );
    }
  }

  const entitledKit = await hasEntitlement(user.id, ROUTE_KIT_KEY);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <ReportView report={report} />

        {/* Next actions */}
        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-xl border border-gold/30 bg-surface/70 p-6">
            <Eyebrow>ลงมือทำจริง</Eyebrow>
            <p className="text-sm text-paper/80">
              เริ่มแผนทดลอง 7 วัน แล้วติดตามความคืบหน้าทีละวัน
            </p>
            <ButtonLink href={`/experiment/${sessionId}`} variant="gold">
              เริ่มการทดลอง 7 วัน
            </ButtonLink>
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface/70 p-6">
            <Eyebrow>Route Kit</Eyebrow>
            <p className="text-sm text-paper/80">
              {entitledKit
                ? "เปิดชุดเครื่องมือลงมือทำของเส้นทางคุณ"
                : "ปลดล็อกชุดเครื่องมือ เทมเพลต และแนวทางตั้งราคาเฉพาะเส้นทางคุณ"}
            </p>
            {entitledKit ? (
              <ButtonLink href={`/route-kit/${sessionId}`} variant="outline">
                เปิด Route Kit
              </ButtonLink>
            ) : (
              <ButtonLink
                href={`/pricing?session=${sessionId}`}
                variant="outline"
              >
                ปลดล็อก Route Kit 590฿
              </ButtonLink>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
