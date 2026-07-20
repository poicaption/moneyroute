"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Variant = "primary" | "gold" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Starts a hosted checkout for a product and redirects to the payment page.
 * On 401 (not signed in) it sends the user to login and back. On 503
 * (payments not configured) it shows a friendly notice.
 */
export default function CheckoutButton({
  productSlug,
  sessionId,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  productSlug: string;
  sessionId?: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, sessionId }),
      });

      if (res.status === 401) {
        // Not signed in yet. Send the buyer to a purchase-aware auth screen,
        // then auto-resume checkout so they never have to click "buy" twice.
        const resumeParams = new URLSearchParams({ product: productSlug });
        if (sessionId) resumeParams.set("session", sessionId);
        const resume = `/checkout/resume?${resumeParams.toString()}`;
        const loginParams = new URLSearchParams({
          next: resume,
          intent: "buy",
          product: productSlug,
        });
        window.location.href = `/login?${loginParams.toString()}`;
        return;
      }
      if (res.status === 503) {
        setNotice("ระบบชำระเงินยังไม่เปิดใช้งาน กรุณาลองใหม่ภายหลัง");
        return;
      }
      if (!res.ok) {
        setNotice("เริ่มการชำระเงินไม่สำเร็จ กรุณาลองใหม่");
        return;
      }

      const data = (await res.json()) as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setNotice("ไม่พบลิงก์ชำระเงิน");
      }
    } catch {
      setNotice("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <Button
        variant={variant}
        size={size}
        className="w-full"
        onClick={start}
        disabled={loading}
      >
        {loading ? "กำลังพาไปหน้าชำระเงิน…" : children}
      </Button>
      {notice && <p className="mt-2 text-center text-xs text-red-soft">{notice}</p>}
    </div>
  );
}
