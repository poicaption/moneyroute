import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ — ROOTMAN MONEY ROUTE",
  description: "เข้าสู่ระบบเพื่อบันทึกผลวิเคราะห์และปลดล็อกรายงานเต็ม",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
