import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import AdminLoginForm from "@/components/admin/admin-login-form";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { isAdminConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Admin — เข้าสู่ระบบ",
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        {isAdminConfigured() ? (
          <AdminLoginForm />
        ) : (
          <p className="text-center text-sm text-muted">
            ยังไม่ได้ตั้งค่าระบบผู้ดูแล (ADMIN_PASSWORD)
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
