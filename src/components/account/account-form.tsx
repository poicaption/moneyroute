"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, Eyebrow } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const inputClass =
  "w-full rounded-md border border-border bg-ink/40 px-4 py-3 text-paper outline-none transition-colors placeholder:text-muted/60 focus:border-gold";

type Feedback = { kind: "ok" | "err"; text: string } | null;

export default function AccountForm({
  initialEmail,
  initialName,
}: {
  initialEmail: string;
  initialName: string;
}) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [profileMsg, setProfileMsg] = useState<Feedback>(null);
  const [emailMsg, setEmailMsg] = useState<Feedback>(null);
  const [passMsg, setPassMsg] = useState<Feedback>(null);
  const [busy, setBusy] = useState<"profile" | "email" | "pass" | null>(null);

  if (!supabase) {
    return (
      <Card className="p-6 text-sm text-muted">
        ระบบบัญชียังไม่ได้ตั้งค่า
      </Card>
    );
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setBusy("profile");
    setProfileMsg(null);
    const { error } = await supabase!.auth.updateUser({
      data: { full_name: name.trim() },
    });
    setBusy(null);
    if (error) setProfileMsg({ kind: "err", text: error.message });
    else {
      setProfileMsg({ kind: "ok", text: "บันทึกชื่อเรียบร้อยแล้ว" });
      router.refresh();
    }
  }

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy("email");
    setEmailMsg(null);
    const next = email.trim();
    if (!next || next === initialEmail) {
      setBusy(null);
      setEmailMsg({ kind: "err", text: "กรุณากรอกอีเมลใหม่ที่ต่างจากเดิม" });
      return;
    }
    const { error } = await supabase!.auth.updateUser({ email: next });
    setBusy(null);
    if (error) setEmailMsg({ kind: "err", text: error.message });
    else
      setEmailMsg({
        kind: "ok",
        text: "ส่งลิงก์ยืนยันไปยังอีเมลใหม่แล้ว — เปิดอีเมลเพื่อยืนยันการเปลี่ยน",
      });
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassMsg(null);
    if (password.length < 6) {
      setPassMsg({ kind: "err", text: "รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร" });
      return;
    }
    if (password !== password2) {
      setPassMsg({ kind: "err", text: "รหัสผ่านทั้งสองช่องไม่ตรงกัน" });
      return;
    }
    setBusy("pass");
    const { error } = await supabase!.auth.updateUser({ password });
    setBusy(null);
    if (error) setPassMsg({ kind: "err", text: error.message });
    else {
      setPassword("");
      setPassword2("");
      setPassMsg({ kind: "ok", text: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
    }
  }

  async function signOut() {
    await supabase!.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Display name */}
      <Card className="space-y-4 p-6">
        <Eyebrow>ชื่อที่แสดง</Eyebrow>
        <form onSubmit={saveProfile} className="space-y-3">
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น พอย"
            maxLength={80}
          />
          {profileMsg && (
            <p
              className={
                profileMsg.kind === "ok"
                  ? "text-sm text-gold"
                  : "text-sm text-red-soft"
              }
            >
              {profileMsg.text}
            </p>
          )}
          <Button type="submit" variant="gold" size="sm" disabled={busy === "profile"}>
            {busy === "profile" ? "กำลังบันทึก…" : "บันทึกชื่อ"}
          </Button>
        </form>
      </Card>

      {/* Email */}
      <Card className="space-y-4 p-6">
        <Eyebrow>อีเมล</Eyebrow>
        <form onSubmit={saveEmail} className="space-y-3">
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
          {emailMsg && (
            <p
              className={
                emailMsg.kind === "ok"
                  ? "text-sm text-gold"
                  : "text-sm text-red-soft"
              }
            >
              {emailMsg.text}
            </p>
          )}
          <Button type="submit" variant="outline" size="sm" disabled={busy === "email"}>
            {busy === "email" ? "กำลังส่ง…" : "เปลี่ยนอีเมล"}
          </Button>
        </form>
      </Card>

      {/* Password */}
      <Card className="space-y-4 p-6">
        <Eyebrow>รหัสผ่าน</Eyebrow>
        <form onSubmit={savePassword} className="space-y-3">
          <input
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="รหัสผ่านใหม่"
            autoComplete="new-password"
          />
          <input
            type="password"
            className={inputClass}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="ยืนยันรหัสผ่านใหม่"
            autoComplete="new-password"
          />
          {passMsg && (
            <p
              className={
                passMsg.kind === "ok"
                  ? "text-sm text-gold"
                  : "text-sm text-red-soft"
              }
            >
              {passMsg.text}
            </p>
          )}
          <Button type="submit" variant="outline" size="sm" disabled={busy === "pass"}>
            {busy === "pass" ? "กำลังเปลี่ยน…" : "เปลี่ยนรหัสผ่าน"}
          </Button>
        </form>
      </Card>

      {/* Sign out */}
      <Card className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-semibold text-paper">ออกจากระบบ</p>
          <p className="text-xs text-muted">ออกจากบัญชีบนอุปกรณ์นี้</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={signOut}>
          ออกจากระบบ
        </Button>
      </Card>
    </div>
  );
}
