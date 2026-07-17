import { Card, Eyebrow, SectionTitle } from "@/components/ui/card";
import { ROUTE_KIT_CONTENT } from "@/lib/domain/route-kit-content";
import { ROUTE_KIT_PLUS } from "@/lib/domain/route-kit-plus";
import { ROUTE_CONTENT } from "@/lib/domain/report-content";
import type { RouteKey } from "@/lib/domain/income-routes";
import {
  type PersonalizationProfile,
  GOAL_LABEL,
  PACE_LABEL,
  BLOCKER_COACHING,
  BUDGET_LABEL,
  derivePace,
  dailyActionMinutes,
  suggestedPriceBand,
  customersForTarget,
} from "@/lib/domain/personalization";

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

function Kicker({ children }: { children: React.ReactNode }) {
  return <SectionTitle className="text-2xl">{children}</SectionTitle>;
}

function PersonalizedKit({
  routeKey,
  profile,
}: {
  routeKey: RouteKey;
  profile: PersonalizationProfile;
}) {
  const pace = derivePace(profile.hoursPerWeek);
  const minutes = dailyActionMinutes(profile.hoursPerWeek);
  const band = suggestedPriceBand(
    ROUTE_CONTENT[routeKey].offer.priceRangeTHB,
    profile,
  );
  const avg = Math.round((band[0] + band[1]) / 2);
  const customers = customersForTarget(profile.monthlyTargetThb, avg);
  const coaching = BLOCKER_COACHING[profile.blocker];

  return (
    <section className="space-y-4">
      <Kicker>ปรับเฉพาะคุณ</Kicker>
      <Card glow="gold" className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-ink/30 p-4">
            <p className="text-xs uppercase tracking-widest text-muted">จังหวะ</p>
            <p className="mt-1 text-lg font-semibold text-gold">
              {PACE_LABEL[pace]}
            </p>
            <p className="mt-1 text-sm text-paper/70">~{minutes} นาที/วัน</p>
          </div>
          <div className="rounded-lg border border-border bg-ink/30 p-4">
            <p className="text-xs uppercase tracking-widest text-muted">
              ราคาที่แนะนำ
            </p>
            <p className="mt-1 text-lg font-semibold text-gold">
              {band[0].toLocaleString("th-TH")}–{band[1].toLocaleString("th-TH")} ฿
            </p>
            {customers > 0 ? (
              <p className="mt-1 text-sm text-paper/70">
                ~{customers} ลูกค้า/เดือนถึงเป้า
              </p>
            ) : null}
          </div>
          <div className="rounded-lg border border-border bg-ink/30 p-4">
            <p className="text-xs uppercase tracking-widest text-muted">
              งบลงทุนของคุณ
            </p>
            <p className="mt-1 text-lg font-semibold text-gold">
              {BUDGET_LABEL[profile.budgetBand]}
            </p>
            <p className="mt-1 text-sm text-paper/70">{GOAL_LABEL[profile.goal]}</p>
          </div>
        </div>

        <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
          <p className="text-sm font-semibold text-gold">
            โฟกัสอุปสรรคของคุณ — {coaching.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-paper/80">
            {coaching.body}
          </p>
        </div>

        {profile.nicheText.trim() ? (
          <p className="text-sm text-paper/70">
            <span className="font-semibold text-paper">มุมที่ทำให้คุณต่าง: </span>
            ดึงจาก &ldquo;{profile.nicheText.trim()}&rdquo;
            มาใส่ในเทมเพลตและ positioning ด้านล่าง
          </p>
        ) : null}
      </Card>
    </section>
  );
}

export default function RouteKitView({
  routeKey,
  routeName,
  profile = null,
}: {
  routeKey: RouteKey;
  routeName: string;
  profile?: PersonalizationProfile | null;
}) {
  const kit = ROUTE_KIT_CONTENT[routeKey];
  const plus = ROUTE_KIT_PLUS[routeKey];

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <Eyebrow>Route Kit</Eyebrow>
        <SectionTitle>{routeName}</SectionTitle>
        <p className="text-sm text-muted">
          ชุดเครื่องมือลงมือทำจริงแบบครบวงจร — positioning, ช่องหาลูกค้า, เทมเพลต,
          ราคา, การรับมือข้อโต้แย้ง, ตัวชี้วัด, แผน 30 วัน และการขยายผล
        </p>
      </div>

      {profile ? <PersonalizedKit routeKey={routeKey} profile={profile} /> : null}

      <section className="space-y-4">
        <Kicker>ประโยคจัดตำแหน่ง (Positioning)</Kicker>
        <Card glow="gold" className="p-6">
          <p className="text-sm leading-relaxed text-paper/90">
            &ldquo;{plus.positioning}&rdquo;
          </p>
          <p className="mt-2 text-xs text-muted">
            เติมในวงเล็บให้เป็นของคุณ แล้วใช้เปิดทุกการเสนอขาย
          </p>
        </Card>
      </section>

      <section className="space-y-4">
        <Kicker>หาลูกค้ากลุ่มแรกได้ที่ไหน</Kicker>
        <Card className="p-6">
          <Bullets items={plus.leadSources} />
        </Card>
      </section>

      <section className="space-y-4">
        <Kicker>เช็กลิสต์เครื่องมือ</Kicker>
        <Card className="p-6">
          <Bullets items={kit.toolChecklist} />
        </Card>
      </section>

      <section className="space-y-4">
        <Kicker>เครื่องมือที่แนะนำ (Tool Stack)</Kicker>
        <Card className="p-6">
          <Bullets items={plus.toolStack} />
        </Card>
      </section>

      <section className="space-y-4">
        <Kicker>เทมเพลตข้อความ</Kicker>
        <div className="space-y-3">
          {kit.messageTemplates.map((tpl, i) => (
            <Card key={i} className="space-y-2 p-6">
              <p className="font-semibold text-gold">{tpl.label}</p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-paper/80">
                {tpl.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Kicker>รับมือข้อโต้แย้งที่เจอบ่อย</Kicker>
        <div className="space-y-3">
          {plus.objectionHandlers.map((h, i) => (
            <Card key={i} className="space-y-2 p-6">
              <p className="text-sm font-semibold text-brand">
                &ldquo;{h.objection}&rdquo;
              </p>
              <p className="text-sm leading-relaxed text-paper/80">
                <span className="font-semibold text-gold">ตอบ: </span>
                {h.response}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Kicker>แนวทางตั้งราคา</Kicker>
        <Card glow="gold" className="p-6">
          <p className="text-sm leading-relaxed text-paper/90">
            {kit.pricingGuide}
          </p>
        </Card>
      </section>

      <section className="space-y-4">
        <Kicker>ตัวชี้วัดที่ต้องติดตาม (KPIs)</Kicker>
        <Card className="p-6">
          <Bullets items={plus.kpis} />
        </Card>
      </section>

      <section className="space-y-4">
        <Kicker>จังหวะรายสัปดาห์</Kicker>
        <Card className="p-6">
          <Bullets items={kit.weeklyRhythm} />
        </Card>
      </section>

      <section className="space-y-4">
        <Kicker>แผนไต่ระดับ 30 วัน</Kicker>
        <Card className="p-6">
          <Bullets items={plus.thirtyDayRamp} />
        </Card>
      </section>

      <section className="space-y-4">
        <Kicker>ก้าวต่อไป: ขยายผล</Kicker>
        <Card className="p-6">
          <Bullets items={plus.scaleMoves} />
        </Card>
      </section>

      <section className="space-y-4">
        <Kicker>ข้อผิดพลาดที่ต้องเลี่ยง</Kicker>
        <Card glow="red" className="p-6">
          <Bullets items={kit.commonMistakes} />
        </Card>
      </section>
    </div>
  );
}
