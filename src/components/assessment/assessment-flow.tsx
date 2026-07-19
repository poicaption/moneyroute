"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QUESTIONS, ASSESSMENT_VERSION } from "@/lib/domain/questions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = `rmr_answers_${ASSESSMENT_VERSION}`;

type Answers = Record<string, string>;

/**
 * Chapters split the assessment into themed acts so the test feels like a
 * journey instead of a long list. Ranges are index-based (inclusive start),
 * so adding/removing questions only needs the ranges nudged.
 */
type Chapter = { start: number; title: string; subtitle: string; badge: string };

const CHAPTERS: Chapter[] = [
  {
    start: 0,
    badge: "ACT 1",
    title: "จุดยืนกับเงิน",
    subtitle: "ตอนนี้คุณอยู่ตรงไหน และอยากไปเร็วแค่ไหน",
  },
  {
    start: 8,
    badge: "ACT 2",
    title: "วิธีที่คุณทำเงิน",
    subtitle: "คุณถนัดสร้างรายได้ด้วยวิธีแบบไหน",
  },
  {
    start: 16,
    badge: "ACT 3",
    title: "ทักษะและตัวตน",
    subtitle: "อะไรคือของจริงที่คนยอมจ่ายให้คุณ",
  },
  {
    start: 24,
    badge: "ACT 4",
    title: "สไตล์การลงมือ",
    subtitle: "เวลาเริ่มทำจริง คุณเป็นคนแบบไหน",
  },
  {
    start: 32,
    badge: "ACT 5",
    title: "ความเสี่ยงและความเร่ง",
    subtitle: "คุณรับความไม่แน่นอนได้แค่ไหน",
  },
  {
    start: 40,
    badge: "ACT 6",
    title: "ภาพความสำเร็จ",
    subtitle: "อีกไม่กี่ข้อ ตัวตนของคุณกำลังจะปรากฏ",
  },
];

function chapterAt(index: number): { chapter: Chapter; number: number } {
  let idx = 0;
  for (let i = 0; i < CHAPTERS.length; i++) {
    if (index >= CHAPTERS[i].start) idx = i;
  }
  return { chapter: CHAPTERS[idx], number: idx + 1 };
}

/** A little momentum line that changes as the visitor progresses. */
function milestoneCopy(progress: number): string {
  if (progress >= 90) return "โค้งสุดท้าย! ผลลัพธ์กำลังจะเผยตัว 🔥";
  if (progress >= 75) return "ใกล้เสร็จแล้ว — ตัวตนของคุณกำลังชัดขึ้น";
  if (progress >= 50) return "ครึ่งทางแล้ว! คุณทำได้ดีมาก";
  if (progress >= 25) return "ไปได้สวย — เริ่มเห็นแพตเทิร์นของคุณแล้ว";
  return "ตอบตามสัญชาตญาณได้เลย ไม่มีถูกผิด";
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function AssessmentFlow() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [entered, setEntered] = useState(false);

  // Restore saved progress.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Answers;
        const firstUnanswered = QUESTIONS.findIndex((q) => !saved[q.code]);
        if (firstUnanswered === -1) {
          // A previous run was already completed — start a fresh assessment
          // instead of dropping the user on the last question.
          localStorage.removeItem(STORAGE_KEY);
          setAnswers({});
          setIndex(0);
        } else {
          setAnswers(saved);
          setIndex(firstUnanswered);
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, []);

  // Persist on change.
  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers, loaded]);

  // Re-trigger the enter animation whenever the question changes.
  useEffect(() => {
    setEntered(false);
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [index]);

  const total = QUESTIONS.length;
  const question = QUESTIONS[index];
  const answeredCount = useMemo(
    () => QUESTIONS.filter((q) => answers[q.code]).length,
    [answers],
  );
  const progress = Math.round((answeredCount / total) * 100);
  const { chapter, number: chapterNumber } = chapterAt(index);
  const remaining = total - index - 1;

  function select(optCode: string) {
    const next = { ...answers, [question.code]: optCode };
    setAnswers(next);
    // Auto-advance with a short delay for feedback.
    setTimeout(() => {
      if (index < total - 1) setIndex((i) => i + 1);
      else finish(next);
    }, 220);
  }

  function finish(final: Answers) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
    router.push("/result");
  }

  if (!loaded) {
    return (
      <div className="flex flex-1 items-center justify-center py-32 text-muted">
        กำลังโหลด…
      </div>
    );
  }

  const allAnswered = answeredCount === total;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 sm:px-6">
      {/* Progress + chapter meta */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs text-muted">
          <Link href="/" className="hover:text-paper">
            ← ออก
          </Link>
          <span className="font-pixel uppercase tracking-[0.2em] text-gold">
            {chapter.badge} · บทที่ {chapterNumber}/{CHAPTERS.length}
          </span>
          <span className="font-mono">
            {answeredCount}/{total}
          </span>
        </div>

        {/* Chapter dots */}
        <div className="mb-3 flex gap-1.5">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.start}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-300",
                i < chapterNumber - 1
                  ? "bg-gold"
                  : i === chapterNumber - 1
                    ? "bg-gradient-to-r from-gold to-red"
                    : "bg-surface-2",
              )}
            />
          ))}
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-red transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-muted/80">
          {milestoneCopy(progress)}
        </p>
      </div>

      {/* Question (animated on change) */}
      <div
        key={index}
        className={cn(
          "flex-1 transition-all duration-300 ease-out",
          entered
            ? "translate-y-0 opacity-100"
            : "translate-y-3 opacity-0",
        )}
      >
        <div className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-2">
          <p className="font-pixel text-xs uppercase tracking-[0.2em] text-gold text-3d">
            {chapter.title}
          </p>
          <p className="mt-0.5 text-xs text-muted">{chapter.subtitle}</p>
        </div>

        <h1 className="mt-5 text-2xl font-bold leading-snug text-paper sm:text-3xl">
          {question.text}
        </h1>
        {question.helper && (
          <p className="mt-2 text-sm text-muted">{question.helper}</p>
        )}

        <div className="mt-8 space-y-3">
          {question.options.map((opt, i) => {
            const selected = answers[question.code] === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => select(opt.code)}
                className={cn(
                  "pixel-3d pixel-3d-hover pixel-3d-press flex w-full items-center gap-4 rounded-xl border p-4 text-left",
                  selected
                    ? "border-gold bg-gold/15 text-paper"
                    : "border-border bg-surface/60 text-paper hover:border-gold/60 hover:bg-surface-2",
                )}
              >
                <span
                  className={cn(
                    "font-pixel flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-xs uppercase transition-colors",
                    selected
                      ? "border-gold bg-gold text-ink"
                      : "border-border text-muted",
                  )}
                >
                  {OPTION_LETTERS[i] ?? opt.code.toUpperCase()}
                </span>
                <span className="text-base">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          ← ก่อนหน้า
        </Button>
        <span className="text-xs text-muted/70">
          {remaining > 0 ? `เหลืออีก ${remaining} ข้อ` : "ข้อสุดท้าย"}
        </span>
        {index < total - 1 ? (
          <Button
            variant="outline"
            size="sm"
            disabled={!answers[question.code]}
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
          >
            ถัดไป →
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            disabled={!allAnswered}
            onClick={() => finish(answers)}
          >
            ดูผลลัพธ์
          </Button>
        )}
      </div>
    </div>
  );
}
