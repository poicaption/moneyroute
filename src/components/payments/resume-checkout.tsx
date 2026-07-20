"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";

/**
 * Auto-resumes a hosted checkout after the buyer has just authenticated.
 * Reads product/session from the query string, creates the checkout session
 * and redirects to the hosted payment page — so the buyer never has to click
 * "buy" a second time after signing in.
 */
export default function ResumeCheckout() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product") ?? "";
  const session = searchParams.get("session") ?? undefined;
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!product) {
      setError("ไม่พบสินค้าที่จะชำระเงิน");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productSlug: product, sessionId: session }),
        });

        if (res.status === 401) {
          const params = new URLSearchParams({ product });
          if (session) params.set("session", session);
          const resume = `/checkout/resume?${params.toString()}`;
          window.location.href = `/login?next=${encodeURIComponent(
            resume,
          )}&intent=buy&product=${encodeURIComponent(product)}`;
          return;
        }
        if (res.status === 503) {
          setError("ระบบชำระเงินยังไม่เปิดใช้งาน กรุณาลองใหม่ภายหลัง");
          return;
        }
        if (!res.ok) {
          setError("เริ่มการชำระเงินไม่สำเร็จ กรุณาลองใหม่");
          return;
        }

        const data = (await res.json()) as { url?: string };
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError("ไม่พบลิงก์ชำระเงิน");
        }
      } catch {
        setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    })();
  }, [product, session]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      {error ? (
        <div className="max-w-sm">
          <p className="font-pixel text-xs uppercase tracking-widest text-red">
            เกิดข้อผิดพลาด
          </p>
          <p className="mt-3 text-paper">{error}</p>
          <ButtonLink href="/pricing" variant="gold" className="mt-6">
            กลับไปหน้าราคา
          </ButtonLink>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="rmr-spin h-12 w-12 rounded-full border-4 border-border border-t-gold" />
          <p className="text-muted">กำลังพาไปหน้าชำระเงิน…</p>
        </div>
      )}
    </main>
  );
}
