import type { Metadata } from "next";
import Link from "next/link";
import AssessmentFlow from "@/components/assessment/assessment-flow";

export const metadata: Metadata = {
  title: "Money Scan — ROOTMAN MONEY ROUTE",
  description: "แบบประเมินเส้นทางสร้างรายได้เฉพาะบุคคล",
};

export default function AssessmentPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="border-b border-border/60 bg-ink/40">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
              ROOTMAN
            </span>
            <span className="text-sm font-extrabold tracking-tight text-paper">
              MONEY SCAN
            </span>
          </Link>
        </div>
      </div>
      <AssessmentFlow />
    </main>
  );
}
