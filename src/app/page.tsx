import { ButtonLink } from "@/components/ui/button";
import { Card, Eyebrow, SectionTitle } from "@/components/ui/card";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { MONEY_TYPE_LIST } from "@/lib/domain/money-types";
import { IDENTITY_LIST } from "@/lib/domain/identities";
import PersonaImage from "@/components/persona/persona-image";

const HOW_IT_WORKS = [
  { step: "01", title: "Scan", desc: "ตอบคำถามเกี่ยวกับตัวตนและทรัพยากรของคุณ" },
  { step: "02", title: "Match", desc: "ระบบจับคู่คุณกับเส้นทางรายได้ที่เหมาะสม" },
  { step: "03", title: "Blueprint", desc: "รับแผนสร้างรายได้เฉพาะบุคคลฉบับเต็ม" },
  { step: "04", title: "Experiment", desc: "ทดลองตลาดก่อนเดิมพันใหญ่" },
  { step: "05", title: "Review", desc: "วัดผลและปรับเส้นทางอย่างเป็นระบบ" },
];

const RECEIVE = [
  "อัตลักษณ์ทางการเงินของคุณ (1 ใน 16 แบบ)",
  "เส้นทางที่เหมาะ 3 อันดับ พร้อมเหตุผล",
  "เส้นทางที่ควรหลีกเลี่ยงในตอนนี้",
  "ข้อเสนอแรกและแผนหาลูกค้า 20 คนแรก",
  "แผนทดลอง 7 วัน และ Roadmap 30 วัน",
  "เกณฑ์ตัดสินว่าไปต่อหรือหยุด",
];

const FAQ = [
  {
    q: "นี่คือแบบทดสอบดูดวงหรือเปล่า?",
    a: "ไม่ใช่ ระบบใช้การให้คะแนนแบบกฎที่ชัดเจนและตรวจสอบได้ ไม่ใช่การเดาหรือดวง คำตอบชุดเดิมจะได้ผลลัพธ์เดิมเสมอ",
  },
  {
    q: "การันตีรายได้ไหม?",
    a: "ไม่การันตี ระบบช่วยตัดสินใจว่าควรเริ่มจากเส้นทางใด ผลลัพธ์ขึ้นอยู่กับตลาด ทักษะ และการลงมือของคุณ",
  },
  {
    q: "ต้องมีเงินทุนหรือผู้ติดตามก่อนไหม?",
    a: "ไม่จำเป็น ระบบมีเส้นทางสำหรับคนทุนน้อยและไม่มีฐานผู้ติดตามด้วย โดยพิจารณาจากข้อจำกัดจริงของคุณ",
  },
  {
    q: "ใช้เวลานานแค่ไหน?",
    a: "แบบประเมินใช้เวลาประมาณ 5–8 นาที ตอบจากพฤติกรรมจริงของคุณ ไม่มีคำตอบถูกหรือผิด",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="max-w-3xl">
              <Eyebrow>ROOTMAN MONEY ROUTE</Eyebrow>
              <h1 className="text-3d mt-5 text-4xl font-black leading-[1.1] tracking-tight text-paper sm:text-6xl">
                คุณอาจไม่ได้หาเงินไม่เก่ง
                <br />
                <span className="text-red">
                  แค่กำลังเล่นเกมที่ไม่เหมาะกับตัวเอง
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                ตอบคำถามเกี่ยวกับเงินทุน เวลา ทักษะ บุคลิก และข้อจำกัดของคุณ
                เพื่อค้นหาเส้นทางสร้างรายได้ที่มีความเหมาะสมมากกว่า
                พร้อมแผนเริ่มต้นที่ลงมือทำได้จริง
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/assessment" variant="primary" size="lg">
                  เริ่มวิเคราะห์เส้นทางของฉัน
                </ButtonLink>
                <span className="text-sm text-muted">
                  ไม่มีคำตอบถูกหรือผิด · ใช้เวลา 5–8 นาที
                </span>
              </div>
            </div>
            {/* Floating 3D persona cluster */}
            <div className="relative hidden h-[340px] lg:block">
              <div className="absolute left-1/2 top-2 -translate-x-1/2">
                <PersonaImage type="hunter" size="xl" priority />
              </div>
              <div className="absolute -left-2 top-32">
                <PersonaImage type="creator" size="md" />
              </div>
              <div className="absolute right-0 top-40">
                <PersonaImage type="builder" size="md" />
              </div>
            </div>
          </div>
        </section>

        {/* Hidden Problem */}
        <section className="border-y border-border/60 bg-ink/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <SectionTitle>
              คนไม่ได้ขาดวิธีหาเงิน
              <br />
              <span className="text-tan">
                แต่ขาดวิธีเลือกว่าควรเริ่มจากอะไร
              </span>
            </SectionTitle>
            <p className="mt-6 max-w-2xl text-muted">
              ทุกวันคุณเห็นคนหาเงินจาก Affiliate, ฟรีแลนซ์, ขายของ, สร้างช่อง
              และเปิดแบรนด์ แต่สิ่งที่ทำให้คนหนึ่งสำเร็จ
              อาจทำให้อีกคนเสียเวลาเป็นปี เพราะแต่ละเส้นทางต้องการเงินทุน เวลา
              ทักษะ และนิสัยที่ต่างกัน
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Eyebrow>วิธีการทำงาน</Eyebrow>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map((s) => (
              <Card key={s.step} className="p-5">
                <div className="font-mono text-sm text-gold">{s.step}</div>
                <div className="mt-2 text-lg font-bold text-paper">
                  {s.title}
                </div>
                <p className="mt-1 text-sm text-muted">{s.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Money Types */}
        <section className="border-y border-border/60 bg-ink/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <Eyebrow>Money Types</Eyebrow>
            <SectionTitle className="mt-3">
              รูปแบบการทำเงินตามธรรมชาติ 6 แบบ
            </SectionTitle>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MONEY_TYPE_LIST.map((t) => (
                <Card key={t.slug} className="p-5" glow="gold">
                  <div className="flex items-start gap-4">
                    <PersonaImage type={t.slug} size="sm" ground={false} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xl font-extrabold tracking-tight text-paper">
                        {t.name}
                      </div>
                      <div className="mt-0.5 text-sm text-gold">
                        {t.tagline}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {t.shortDescription}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 16 Identities */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Eyebrow>16 อัตลักษณ์ทางการเงิน</Eyebrow>
          <SectionTitle className="mt-3">
            จาก 6 Money Types สู่ 16 อัตลักษณ์ที่เป็นตัวคุณ
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-muted">
            หลังทำแบบทดสอบ ระบบจะบอกว่าคุณคือ 1 ใน 16 อัตลักษณ์ —
            ผสานจุดแข็งหลักและรองของคุณเข้าด้วยกัน พร้อมเส้นทางที่เหมาะ
            และคู่หูที่ควรจับมือเพื่อไปให้ไกลกว่าเดิม
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {IDENTITY_LIST.map((id) => (
              <Card key={id.slug} className="p-5" glow="gold">
                <div className="flex flex-col items-center text-center">
                  <PersonaImage type={id.baseType} size="sm" ground={false} />
                  <div className="mt-3 font-pixel text-[11px] uppercase tracking-widest text-gold">
                    {id.name}
                  </div>
                  <div className="mt-1 text-lg font-extrabold text-paper">
                    {id.thaiName}
                  </div>
                  <div className="mt-1 text-xs text-gold/80">{id.tagline}</div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/assessment" variant="primary" size="lg">
              ค้นหาอัตลักษณ์ของฉัน
            </ButtonLink>
          </div>
        </section>

        {/* What you receive */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <Eyebrow>สิ่งที่คุณจะได้รับ</Eyebrow>
              <SectionTitle className="mt-3">
                Income Blueprint เฉพาะบุคคล
              </SectionTitle>
              <p className="mt-4 text-muted">
                รายงานฉบับเต็มที่ประกอบขึ้นจากผลการประเมินของคุณ
                เพื่อให้เริ่มลงมือได้ทันทีโดยไม่ต้องเดา
              </p>
              <ButtonLink
                href="/assessment"
                variant="gold"
                size="md"
                className="mt-6"
              >
                เริ่ม Money Scan ฟรี
              </ButtonLink>
            </div>
            <ul className="grid gap-3">
              {RECEIVE.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-border bg-surface/60 p-4"
                >
                  <span className="mt-0.5 text-gold">◆</span>
                  <span className="text-sm text-paper">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border/60 bg-ink/40">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <Eyebrow>คำถามที่พบบ่อย</Eyebrow>
            <div className="mt-8 space-y-4">
              {FAQ.map((f) => (
                <Card key={f.q} className="p-5">
                  <div className="font-semibold text-paper">{f.q}</div>
                  <p className="mt-2 text-sm text-muted">{f.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <SectionTitle className="mx-auto max-w-2xl">
            หยุดซื้อความรู้แบบสุ่ม
            <br />
            เริ่มจากการรู้ว่าคุณควรใช้ความรู้อะไร
          </SectionTitle>
          <div className="mt-8">
            <ButtonLink href="/assessment" variant="primary" size="lg">
              เริ่มวิเคราะห์เส้นทางของฉัน
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
