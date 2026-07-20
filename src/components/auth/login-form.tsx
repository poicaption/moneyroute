"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Card, Eyebrow, SectionTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Mode = "signin" | "signup";
type Status = "idle" | "working" | "error" | "unconfigured";

const inputClass =
  "w-full rounded-md border border-border bg-ink/40 px-4 py-3 text-paper outline-none transition-colors placeholder:text-muted/60 focus:border-gold";

/** Product context for the purchase-aware banner. */
const PRODUCT_INFO: Record<string, { name: string; price: string }> = {
  income_blueprint: { name: "Income Blueprint", price: "199฿" },
  route_kit: { name: "Route Kit", price: "299฿" },
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/result";
  const intent = searchParams.get("intent");
  const product = searchParams.get("product") ?? "";
  const isBuying = intent === "buy";
  const productInfo = PRODUCT_INFO[product] ?? null;

  // When arriving from a purchase, default to creating an account — that's the
  // fast path for first-time buyers. Existing customers can switch in one tap.
  const [mode, setMode] = useState<Mode>(
    isBuying || searchParams.get("mode") === "signup" ? "signup" : "signin",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>(
    searchParams.get("error") ? "error" : "idle",
  );
  const [message, setMessage] = useState<string>("");

  // Email + password sign in / sign up.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return setStatus("unconfigured");

    setStatus("working");
    setMessage("");

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setStatus("error");
        setMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }
      router.push(next);
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    // With email confirmation disabled, sign-up returns a session directly.
    if (data.session) {
      router.push(next);
      router.refresh();
      return;
    }
    // Otherwise sign in immediately with the same credentials.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setStatus("error");
      setMessage(
        "สมัครสมาชิกสำเร็จ แต่เข้าสู่ระบบอัตโนมัติไม่ได้ กรุณาเข้าสู่ระบบด้วยอีเมลและรหัสผ่านของคุณ",
      );
      return;
    }
    router.push(next);
    router.refresh();
  }

  function switchMode(target: Mode) {
    setMode(target);
    setStatus(searchParams.get("error") && target === "signin" ? "error" : "idle");
    setMessage("");
  }

  return (
    <Card glow="gold" className="p-8">
      {isBuying && (
        <div className="mb-6 rounded-xl border border-gold/50 bg-gradient-to-b from-gold/15 to-transparent p-4 text-center">
          <span className="inline-block rounded-full border border-gold/60 bg-gold/10 px-3 py-1 font-pixel text-[10px] uppercase tracking-widest text-gold">
            อีกขั้นเดียว
          </span>
          <p className="mt-3 text-sm leading-relaxed text-paper">
            สร้างบัญชีเพื่อรับ
            {productInfo ? (
              <>
                {" "}
                <span className="font-bold text-gold">
                  {productInfo.name} ({productInfo.price})
                </span>{" "}
                ของคุณ
              </>
            ) : (
              " สินค้าของคุณ"
            )}{" "}
            แล้วเราจะพาไปหน้าชำระเงินให้อัตโนมัติ
          </p>
          <p className="mt-1.5 text-xs text-cyan">
            ใช้เวลา 10 วินาที · เข้าถึงผลและรายงานได้ตลอด
          </p>
        </div>
      )}

      {/* Segmented mode switch — signup is a first-class option, not a footnote. */}
      <div
        role="tablist"
        aria-label="โหมดบัญชี"
        className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-ink/40 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          onClick={() => switchMode("signup")}
          className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
            mode === "signup"
              ? "bg-gold text-ink pixel-3d"
              : "text-muted hover:text-paper"
          }`}
        >
          สมัครสมาชิก
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signin"}
          onClick={() => switchMode("signin")}
          className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
            mode === "signin"
              ? "bg-gold text-ink pixel-3d"
              : "text-muted hover:text-paper"
          }`}
        >
          เข้าสู่ระบบ
        </button>
      </div>

      <Eyebrow className="mt-6">
        {mode === "signin" ? "เข้าสู่ระบบ" : "สร้างบัญชีใหม่"}
      </Eyebrow>
      <SectionTitle className="mt-3 text-2xl sm:text-3xl">
        {mode === "signin" ? "ยินดีต้อนรับกลับ" : "สร้างบัญชีใน 10 วินาที"}
      </SectionTitle>
      <p className="mt-3 text-sm text-muted">
        {mode === "signin"
          ? "เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน เพื่อดูผลวิเคราะห์และรายงานของคุณ"
          : "ตั้งอีเมลและรหัสผ่านของคุณเอง เพื่อบันทึกผลและเข้าถึงได้ทุกเมื่อ"}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
          >
            อีเมล
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
          >
            รหัสผ่าน
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="อย่างน้อย 6 ตัวอักษร"
            className={inputClass}
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-soft">
            {message || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"}
          </p>
        )}
        {status === "unconfigured" && (
          <p className="text-sm text-red-soft">
            ระบบเข้าสู่ระบบยังไม่พร้อมใช้งานในขณะนี้
          </p>
        )}

        <Button
          type="submit"
          variant="gold"
          className="w-full"
          disabled={status === "working"}
        >
          {status === "working"
            ? "กำลังดำเนินการ…"
            : mode === "signin"
              ? "เข้าสู่ระบบ"
              : isBuying
                ? "สมัคร แล้วไปชำระเงิน →"
                : "สมัครสมาชิก"}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-muted">
        {mode === "signin" ? (
          <>
            ยังไม่มีบัญชี?{" "}
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="font-semibold text-gold hover:underline"
            >
              สมัครสมาชิกฟรี
            </button>
          </>
        ) : (
          <>
            มีบัญชีอยู่แล้ว?{" "}
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="font-semibold text-gold hover:underline"
            >
              เข้าสู่ระบบ
            </button>
          </>
        )}
      </div>
    </Card>
  );
}
