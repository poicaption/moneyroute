import { Card, Eyebrow, SectionTitle } from "@/components/ui/card";
import type { Report } from "@/lib/domain/report";

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SectionTitle>{title}</SectionTitle>
      </div>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-paper/80">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1 text-gold">▸</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function speedLabel(speed: "fast" | "medium" | "slow"): string {
  return speed === "fast"
    ? "เร็ว"
    : speed === "medium"
      ? "ปานกลาง"
      : "ช้า (สร้างสินทรัพย์)";
}

export default function ReportView({ report }: { report: Report }) {
  const { executiveDiagnosis: diag } = report;
  return (
    <div className="space-y-16">
      {/* 1. Executive Diagnosis */}
      <Section eyebrow="รายงานฉบับเต็ม" title="สรุปวินิจฉัย">
        <Card glow="gold" className="space-y-5 p-6 sm:p-8">
          <p className="text-lg leading-relaxed text-paper">{diag.whoYouAre}</p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-gold">จุดแข็งของคุณ</h3>
              <Bullets items={diag.edges} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-brand">ข้อจำกัดตอนนี้</h3>
              <Bullets items={diag.constraints} />
            </div>
          </div>
          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-sm text-paper/90">
              <span className="font-semibold text-gold">เริ่มที่นี่: </span>
              {diag.startHere}
            </p>
            <p className="text-sm text-paper/90">
              <span className="font-semibold text-brand">ยังไม่ควรทำ: </span>
              {diag.avoid}
            </p>
          </div>
        </Card>
      </Section>

      {/* 2. Money Pattern */}
      <Section eyebrow="แบบแผนการหาเงินของคุณ" title={report.moneyPattern.name}>
        <Card className="space-y-5 p-6 sm:p-8">
          <p className="font-mono text-sm uppercase tracking-widest text-gold">
            {report.moneyPattern.tagline}
          </p>
          <p className="leading-relaxed text-paper/80">
            {report.moneyPattern.description}
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-gold">จุดแข็ง</h3>
              <Bullets items={report.moneyPattern.strengths} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-brand">จุดอ่อน</h3>
              <Bullets items={report.moneyPattern.weaknesses} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-paper">พฤติกรรมที่ควรทำ</h3>
              <Bullets items={report.moneyPattern.behaviors} />
            </div>
          </div>
        </Card>
      </Section>

      {/* 3. Primary Route */}
      <Section eyebrow="เส้นทางหลัก" title={report.primaryRoute.name}>
        <Card glow="red" className="space-y-4 p-6 sm:p-8">
          <p className="leading-relaxed text-paper/80">
            {report.primaryRoute.description}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-paper/70">
            <span className="rounded-full border border-border px-3 py-1">
              ความเข้ากัน {report.primaryRoute.matchScore}/100
            </span>
            <span className="rounded-full border border-border px-3 py-1">
              ความเร็วรายได้: {speedLabel(report.primaryRoute.incomeSpeed)}
            </span>
            <span className="rounded-full border border-border px-3 py-1">
              {report.primaryRoute.minimumCapitalNote}
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-gold">ทำไมถึงเหมาะกับคุณ</h3>
              <Bullets items={report.primaryRoute.whyItFits} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-brand">ความเสี่ยงที่ต้องระวัง</h3>
              <Bullets items={report.primaryRoute.risks} />
            </div>
          </div>
          {report.bridgeNote && (
            <p className="rounded-lg border border-gold/40 bg-gold/5 p-4 text-sm text-paper/90">
              {report.bridgeNote}
            </p>
          )}
        </Card>
      </Section>

      {/* 4. Secondary Routes */}
      <Section eyebrow="เส้นทางสำรอง" title="ทางเลือกรองที่เข้ากับคุณ">
        <div className="grid gap-4 sm:grid-cols-2">
          {report.secondaryRoutes.map((r) => (
            <Card key={r.slug} className="space-y-3 p-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-bold text-paper">{r.name}</h3>
                <span className="text-xs text-paper/60">{r.matchScore}/100</span>
              </div>
              <p className="text-sm leading-relaxed text-paper/70">
                {r.description}
              </p>
              <Bullets items={r.whyItFits.slice(0, 2)} />
            </Card>
          ))}
        </div>
      </Section>

      {/* 5. Anti-Routes */}
      <Section eyebrow="เส้นทางที่ควรเลี่ยง" title="ยังไม่ควรเริ่มตอนนี้">
        <div className="space-y-3">
          {report.antiRoutes.map((r) => (
            <Card key={r.slug} className="space-y-1 p-5">
              <h3 className="font-bold text-brand">{r.name}</h3>
              <p className="text-sm leading-relaxed text-paper/70">{r.reason}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 6. First Offer */}
      <Section eyebrow="ข้อเสนอแรก" title="สิ่งที่คุณควรขายก่อน">
        <Card className="space-y-4 p-6 sm:p-8">
          <p className="text-lg font-semibold text-paper">
            {report.firstOffer.whatToSell}
          </p>
          <p className="text-sm leading-relaxed text-paper/80">
            {report.firstOffer.scope}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-paper/70">
            <span className="rounded-full border border-border px-3 py-1">
              ช่วงราคา {report.firstOffer.priceRangeTHB[0].toLocaleString()}–
              {report.firstOffer.priceRangeTHB[1].toLocaleString()} บาท
            </span>
            <span className="rounded-full border border-border px-3 py-1">
              กลุ่มเป้าหมาย: {report.firstOffer.audience}
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-gold">สิ่งที่ส่งมอบ</h3>
              <Bullets items={report.firstOffer.deliverables} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-paper">หลักฐานที่ต้องสร้าง</h3>
              <Bullets items={report.firstOffer.proofToBuild} />
            </div>
          </div>
        </Card>
      </Section>

      {/* 7. First Customer Plan */}
      <Section eyebrow="แผนหาลูกค้ารายแรก" title="หาลูกค้าคนแรกได้อย่างไร">
        <Card className="space-y-4 p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-gold">หาได้ที่ไหน</h3>
              <Bullets items={report.firstCustomerPlan.whereToFind} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-paper">ช่องทาง</h3>
              <Bullets items={report.firstCustomerPlan.channels} />
            </div>
          </div>
          <div className="space-y-2 border-t border-border pt-4">
            <h3 className="font-semibold text-gold">สคริปต์ทักลูกค้า</h3>
            <p className="rounded-lg border border-border bg-surface/50 p-4 text-sm leading-relaxed text-paper/90 whitespace-pre-line">
              {report.firstCustomerPlan.outreachScript}
            </p>
          </div>
          <p className="text-sm text-paper/80">
            <span className="font-semibold text-paper">การติดตาม: </span>
            {report.firstCustomerPlan.followUp}
          </p>
          <p className="text-sm text-paper/80">
            <span className="font-semibold text-gold">ตัววัดความสำเร็จ: </span>
            {report.firstCustomerPlan.successMetric}
          </p>
        </Card>
      </Section>

      {/* 8. Seven-Day Experiment */}
      <Section eyebrow="การทดลอง 7 วัน" title="ลงมือทำใน 7 วันแรก">
        <div className="space-y-3">
          {report.sevenDayExperiment.map((task) => (
            <Card key={task.day} className="flex gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/50 font-mono text-sm text-gold">
                {task.day}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-paper">{task.title}</h3>
                <p className="text-sm leading-relaxed text-paper/70">
                  {task.instructions}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* 9. Thirty-Day Roadmap */}
      <Section eyebrow="แผน 30 วัน" title="โรดแมป 30 วัน">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {report.thirtyDayRoadmap.map((phase) => (
            <Card key={phase.phase} className="space-y-2 p-5">
              <div className="flex items-baseline justify-between">
                <h3 className="font-bold text-gold">{phase.phase}</h3>
                <span className="text-xs text-paper/60">{phase.days}</span>
              </div>
              <p className="text-sm leading-relaxed text-paper/70">
                {phase.focus}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 10. Stop Rules */}
      <Section eyebrow="กฎการหยุด" title="เมื่อไหร่ควรหยุดหรือเปลี่ยนทาง">
        <Card glow="red" className="p-6 sm:p-8">
          <Bullets items={report.stopRules} />
        </Card>
      </Section>
    </div>
  );
}
