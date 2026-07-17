import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { Eyebrow, SectionTitle } from "@/components/ui/card";
import AccountForm from "@/components/account/account-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "จัดการบัญชี — ROOTMAN MONEY ROUTE",
};

export const runtime = "nodejs";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/login?next=/account");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const name =
    (user.user_metadata?.full_name as string | undefined)?.trim() ?? "";

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <Eyebrow>บัญชีของฉัน</Eyebrow>
            <SectionTitle>จัดการบัญชี</SectionTitle>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/dashboard" className="text-muted hover:text-paper">
              แดชบอร์ด
            </Link>
            <Link href="/billing" className="text-gold hover:underline">
              การเรียกเก็บเงิน
            </Link>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted">{user.email}</p>

        <div className="mt-8">
          <AccountForm initialEmail={user.email ?? ""} initialName={name} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
