"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Card, Eyebrow, SectionTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Status = "idle" | "sending" | "sent" | "error" | "unconfigured";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>(
    searchParams.get("error") ? "error" : "idle",
  );
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus("unconfigured");
      return;
    }
    setStatus("sending");
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
  }

  return (
    <Card glow="gold" className="p-8">
      <Eyebrow>เข้าสู่ระบบ</Eyebrow>
      <SectionTitle className="mt-3 text-2xl sm:text-3xl">
        บันทึกผลของคุณ
      </SectionTitle>
      <p className="mt-3 text-sm text-muted">
        กรอกอีเมลเพื่อรับลิงก์เข้าสู่ระบบ — ไม่ต้องจำรหัสผ่าน
        เมื่อเข้าสู่ระบบแล้ว ผลวิเคราะห์ล่าสุดของคุณจะถูกผูกกับบัญชีนี้
      </p>

      {status === "sent" ? (
        <div className="mt-6 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm text-paper">
          ส่งลิงก์เข้าสู่ระบบไปที่ <strong>{email}</strong> แล้ว
          กรุณาเปิดอีเมลแล้วคลิกลิงก์เพื่อเข้าสู่ระบบ
        </div>
      ) : (
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
              className="w-full rounded-md border border-border bg-ink/40 px-4 py-3 text-paper outline-none transition-colors placeholder:text-muted/60 focus:border-gold"
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
            disabled={status === "sending"}
          >
            {status === "sending" ? "กำลังส่งลิงก์…" : "ส่งลิงก์เข้าสู่ระบบ"}
          </Button>
        </form>
      )}
    </Card>
  );
}
