"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Eyebrow, SectionTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-md border border-border bg-ink/40 px-4 py-3 text-paper outline-none transition-colors placeholder:text-muted/60 focus:border-gold";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("รหัสผ่านไม่ถูกต้อง");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card glow="gold" className="p-8">
      <Eyebrow>Admin</Eyebrow>
      <SectionTitle className="mt-3 text-2xl sm:text-3xl">
        เข้าสู่หน้าผู้ดูแลระบบ
      </SectionTitle>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="admin-password"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted"
          >
            รหัสผ่านผู้ดูแลระบบ
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        {error && <p className="text-sm text-red-soft">{error}</p>}
        <Button
          type="submit"
          variant="gold"
          className="w-full"
          disabled={busy}
        >
          {busy ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}
        </Button>
      </form>
    </Card>
  );
}
