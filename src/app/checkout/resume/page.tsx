import type { Metadata } from "next";
import { Suspense } from "react";
import ResumeCheckout from "@/components/payments/resume-checkout";

export const metadata: Metadata = {
  title: "กำลังพาไปชำระเงิน — ROOTMAN MONEY ROUTE",
};

export default function CheckoutResumePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center px-6">
          <p className="text-muted">กำลังเตรียมการชำระเงิน…</p>
        </main>
      }
    >
      <ResumeCheckout />
    </Suspense>
  );
}
