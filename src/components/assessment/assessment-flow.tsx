"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QUESTIONS, ASSESSMENT_VERSION } from "@/lib/domain/questions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = `rmr_answers_${ASSESSMENT_VERSION}`;

type Answers = Record<string, string>;

export default function AssessmentFlow() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

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

  const total = QUESTIONS.length;
  const question = QUESTIONS[index];
  const answeredCount = useMemo(
    () => QUESTIONS.filter((q) => answers[q.code]).length,
    [answers],
  );
  const progress = Math.round((answeredCount / total) * 100);

  function select(optCode: string) {
    const next = { ...answers, [question.code]: optCode };
    setAnswers(next);
    // Auto-advance with a short delay for feedback.
    setTimeout(() => {
      if (index < total - 1) setIndex((i) => i + 1);
      else finish(next);
    }, 180);
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
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <Link href="/" className="hover:text-paper">
            ← ออก
          </Link>
          <span className="font-mono">
            {answeredCount}/{total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-red transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          {question.code}
        </div>
        <h1 className="mt-3 text-2xl font-bold leading-snug text-paper sm:text-3xl">
          {question.text}
        </h1>
        {question.helper && (
          <p className="mt-2 text-sm text-muted">{question.helper}</p>
        )}

        <div className="mt-8 space-y-3">
          {question.options.map((opt) => {
            const selected = answers[question.code] === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => select(opt.code)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                  selected
                    ? "border-gold bg-gold/10 text-paper"
                    : "border-border bg-surface/60 text-paper hover:border-gold/50 hover:bg-surface-2",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs uppercase",
                    selected
                      ? "border-gold bg-gold text-ink"
                      : "border-border text-muted",
                  )}
                >
                  {opt.code}
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
