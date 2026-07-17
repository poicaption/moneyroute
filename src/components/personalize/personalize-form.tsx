"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, Eyebrow } from "@/components/ui/card";
import {
  GOALS,
  BUDGET_BANDS,
  AUDIENCE_BANDS,
  BLOCKERS,
  GOAL_LABEL,
  BUDGET_LABEL,
  AUDIENCE_LABEL,
  BLOCKER_LABEL,
  type PersonalizationProfile,
} from "@/lib/domain/personalization";

const inputClass =
  "w-full rounded-md border border-border bg-ink/40 px-4 py-3 text-paper outline-none transition-colors placeholder:text-muted/60 focus:border-gold";

const TARGET_OPTIONS = [
  { value: 5000, label: "≈ 5,000 บาท/เดือน" },
  { value: 15000, label: "≈ 15,000 บาท/เดือน" },
  { value: 30000, label: "≈ 30,000 บาท/เดือน" },
  { value: 50000, label: "≈ 50,000 บาท/เดือน" },
  { value: 100000, label: "100,000 บาท+/เดือน" },
];

const HOURS_OPTIONS = [
  { value: 3, label: "น้อยกว่า 5 ชม./สัปดาห์" },
  { value: 8, label: "5–10 ชม./สัปดาห์" },
  { value: 15, label: "10–20 ชม./สัปดาห์" },
  { value: 25, label: "มากกว่า 20 ชม./สัปดาห์" },
];

function OptionGrid<T extends string | number>({
  options,
  value,
  onSelect,
  columns = 2,
}: {
  options: { value: T; label: string }[];
  value: T | null;
  onSelect: (v: T) => void;
  columns?: 1 | 2;
}) {
  return (
    <div
      className={`grid gap-2 ${columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`rounded-md border px-4 py-3 text-left text-sm transition-colors ${
              active
                ? "border-gold bg-gold/10 text-paper"
                : "border-border bg-ink/40 text-muted hover:border-gold/60 hover:text-paper"
            }`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  step,
  title,
  hint,
  children,
}: {
  step: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-base font-semibold text-paper">
          <span className="mr-2 text-gold">{step}.</span>
          {title}
        </p>
        {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

export default function PersonalizeForm({
  initial,
  sessionId,
  nextHref,
}: {
  initial: PersonalizationProfile | null;
  sessionId: string | null;
  nextHref: string;
}) {
  const router = useRouter();

  const [goal, setGoal] = useState<PersonalizationProfile["goal"] | null>(
    initial?.goal ?? null,
  );
  const [target, setTarget] = useState<number | null>(
    initial?.monthlyTargetThb ?? null,
  );
  const [hours, setHours] = useState<number | null>(
    initial?.hoursPerWeek ?? null,
  );
  const [budget, setBudget] = useState<
    PersonalizationProfile["budgetBand"] | null
  >(initial?.budgetBand ?? null);
  const [audience, setAudience] = useState<
    PersonalizationProfile["audienceBand"] | null
  >(initial?.audienceBand ?? null);
  const [blocker, setBlocker] = useState<
    PersonalizationProfile["blocker"] | null
  >(initial?.blocker ?? null);
  const [niche, setNiche] = useState(initial?.nicheText ?? "");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const complete =
    goal !== null &&
    target !== null &&
    hours !== null &&
    budget !== null &&
    audience !== null &&
    blocker !== null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!complete) {
      setError("กรุณาตอบให้ครบทุกข้อก่อนบันทึก");
      return;
    }
    setBusy(true);
    setError(null);

    const res = await fetch("/api/personalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal,
        monthlyTargetThb: target,
        hoursPerWeek: hours,
        budgetBand: budget,
        audienceBand: audience,
        blocker,
        nicheText: niche.trim(),
        sessionId,
      }),
    });

    setBusy(false);
    if (!res.ok) {
      setError("บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      return;
    }
    router.push(nextHref);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <Card className="space-y-8 p-6 sm:p-8">
        <Field
          step={1}
          title="เป้าหมายหลักของคุณคืออะไร"
          hint="เราจะปรับจังหวะและกลยุทธ์ให้ตรงกับเป้าหมายนี้"
        >
          <OptionGrid
            options={GOALS.map((g) => ({ value: g, label: GOAL_LABEL[g] }))}
            value={goal}
            onSelect={setGoal}
          />
        </Field>

        <Field
          step={2}
          title="รายได้ต่อเดือนที่อยากไปให้ถึง"
          hint="ใช้ตั้งราคาและคำนวณจำนวนลูกค้าที่ต้องมี"
        >
          <OptionGrid options={TARGET_OPTIONS} value={target} onSelect={setTarget} />
        </Field>

        <Field
          step={3}
          title="เวลาที่ทุ่มให้ได้ต่อสัปดาห์"
          hint="กำหนดปริมาณงานต่อวันให้ทำได้จริง"
        >
          <OptionGrid options={HOURS_OPTIONS} value={hours} onSelect={setHours} />
        </Field>

        <Field
          step={4}
          title="งบลงทุนที่พร้อมใช้ตอนนี้"
          hint="เราจะไม่แนะนำอะไรเกินกำลังของคุณ"
        >
          <OptionGrid
            options={BUDGET_BANDS.map((b) => ({
              value: b,
              label: BUDGET_LABEL[b],
            }))}
            value={budget}
            onSelect={setBudget}
          />
        </Field>

        <Field
          step={5}
          title="ตอนนี้คุณมีผู้ติดตาม/ฐานลูกค้าแค่ไหน"
        >
          <OptionGrid
            options={AUDIENCE_BANDS.map((a) => ({
              value: a,
              label: AUDIENCE_LABEL[a],
            }))}
            value={audience}
            onSelect={setAudience}
          />
        </Field>

        <Field
          step={6}
          title="อะไรคืออุปสรรคใหญ่ที่สุดของคุณตอนนี้"
          hint="เราจะใส่โค้ชชิ่งเฉพาะจุดนี้ให้ในทุกส่วน"
        >
          <OptionGrid
            options={BLOCKERS.map((b) => ({ value: b, label: BLOCKER_LABEL[b] }))}
            value={blocker}
            onSelect={setBlocker}
          />
        </Field>

        <Field
          step={7}
          title="ทักษะ ความสนใจ หรือสิ่งที่คุณทำอยู่ (ไม่บังคับ)"
          hint="ยิ่งบอกละเอียด ยิ่งปรับตัวอย่างและสคริปต์ให้ตรงคุณ"
        >
          <textarea
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="เช่น ชอบทำอาหาร ถ่ายรูปเก่ง ทำงานสายบัญชี มีเพจแมว ฯลฯ"
            className={inputClass}
          />
        </Field>

        {error ? <p className="text-sm text-red-soft">{error}</p> : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy || !complete}>
            {busy ? "กำลังบันทึก…" : "บันทึกและปรับเนื้อหาให้ฉัน"}
          </Button>
          <Eyebrow>ปรับได้ทุกเมื่อจากหน้าแดชบอร์ด</Eyebrow>
        </div>
      </Card>
    </form>
  );
}
