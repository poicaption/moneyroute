import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { Card, Eyebrow, SectionTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import CheckoutButton from "@/components/payments/checkout-button";

export const metadata: Metadata = {
  title: "ราคา — ROOTMAN MONEY ROUTE",
};

const TIERS = [
  {
    name: "Money Scan",
    image: "/products/money-scan.png",
    price: "ฟรี",
    originalPrice: null as string | null,
    badge: null as string | null,
    desc: "แบบประเมินและผลลัพธ์เบื้องต้น",
    features: [
      "อัตลักษณ์ทางการเงิน 1 ใน 16",
      "คะแนนสำคัญ 6 ด้าน",
      "Insight หลัก",
      "เส้นทางอันดับหนึ่งแบบย่อ",
    ],
    bonus: null as string | null,
    cta: { label: "เริ่มเลย", href: "/assessment", variant: "gold" as const },
    highlight: false,
  },
  {
    name: "Income Blueprint",
    image: "/products/income-blueprint.png",
    price: "199฿",
    originalPrice: "390฿",
    badge: null as string | null,
    priceNote: "ราคาช่วงเปิดตัว",
    desc: "รายงานฉบับเต็มเฉพาะบุคคล",
    features: [
      "เส้นทางที่เหมาะ 3 อันดับ",
      "เส้นทางที่ควรหลีกเลี่ยง",
      "ข้อเสนอแรก + แผนหาลูกค้า",
      "แผนทดลอง 7 วัน & Roadmap 30 วัน",
      "เกณฑ์ตัดสินไปต่อหรือหยุด",
    ],
    bonus: null as string | null,
    checkout: "income_blueprint" as const,
    cta: { label: "ปลดล็อก 199฿", href: "/assessment", variant: "primary" as const },
    highlight: false,
  },
  {
    name: "Route Kit",
    image: "/products/route-kit.png",
    price: "299฿",
    originalPrice: "498฿",
    badge: "คุ้มที่สุด",
    priceNote: "รวม Income Blueprint ฟรี",
    desc: "ชุดเครื่องมือปฏิบัติ + รายงานฉบับเต็มครบในชุดเดียว",
    features: [
      "10 เส้นทางเจาะลึก + เทมเพลตข้อความพร้อมใช้",
      "โปรแกรมทดลองลงมือ 45 วัน (4 เฟส)",
      "เช็กลิสต์เครื่องมือ + จังหวะรายสัปดาห์",
      "แนวทางตั้งราคา + ข้อผิดพลาดที่ต้องเลี่ยง",
    ],
    bonus: "แถม Income Blueprint ฉบับเต็ม (มูลค่า 199฿) ฟรีในตัว",
    checkout: "route_kit" as const,
    cta: { label: "รับ Route Kit 299฿", href: "/assessment", variant: "gold" as const },
    highlight: true,
  },
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string; canceled?: string }>;
}) {
  const { session, canceled } = await searchParams;
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
        <div className="text-center">
          <Eyebrow>ราคา</Eyebrow>
          <SectionTitle className="mt-3">
            เริ่มฟรี จ่ายเมื่อพร้อมลงมือจริง
          </SectionTitle>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            ระบบช่วยตัดสินใจ ไม่ใช่การรับประกันรายได้
            ผลลัพธ์ขึ้นอยู่กับตลาด ทักษะ และการลงมือของคุณ
          </p>
          {canceled && (
            <p className="mx-auto mt-4 max-w-xl text-sm text-red-soft">
              ยกเลิกการชำระเงินแล้ว คุณสามารถกดปลดล็อกใหม่ได้ทุกเมื่อ
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TIERS.map((t) => (
            <Card
              key={t.name}
              className="relative flex flex-col p-6"
              glow={t.highlight ? "gold" : null}
            >
              {t.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-gold/60 bg-gold px-3 py-1 font-pixel text-[10px] uppercase tracking-widest text-ink">
                  {t.badge}
                </span>
              )}
              <div className="-mx-2 mb-4 flex items-center justify-center rounded-lg border border-border/60 bg-ink/50 p-3">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={420}
                  height={420}
                  className="h-40 w-auto object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.5)]"
                  priority={t.highlight}
                />
              </div>
              <div className="text-lg font-bold text-paper">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-gold">{t.price}</span>
                {t.originalPrice && (
                  <span className="text-sm text-muted line-through">
                    {t.originalPrice}
                  </span>
                )}
                {t.priceNote && (
                  <span className="text-xs text-muted">{t.priceNote}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted">{t.desc}</p>
              {t.bonus && (
                <div className="mt-4 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm font-semibold text-gold">
                  🎁 {t.bonus}
                </div>
              )}
              <ul className="mt-5 flex-1 space-y-2">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-paper">
                    <span className="mt-0.5 text-gold">◆</span>
                    {f}
                  </li>
                ))}
              </ul>
              {"checkout" in t && t.checkout ? (
                <CheckoutButton
                  productSlug={t.checkout}
                  sessionId={session}
                  variant={t.cta.variant}
                  className="mt-6"
                >
                  {t.cta.label}
                </CheckoutButton>
              ) : (
                <ButtonLink
                  href={t.cta.href}
                  variant={t.cta.variant}
                  className="mt-6 w-full"
                >
                  {t.cta.label}
                </ButtonLink>
              )}
            </Card>
          ))}
        </div>

        {/* Value framing: why Route Kit is the smart pick */}
        <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gold/30 bg-ink/40 p-6 text-center">
          <p className="font-pixel text-xs uppercase tracking-widest text-gold text-3d">
            ทำไมคนส่วนใหญ่เลือก Route Kit
          </p>
          <p className="mt-3 text-sm leading-relaxed text-paper/85">
            ถ้าซื้อแยก Income Blueprint 199฿ + Route Kit 299฿ = 498฿ แต่เมื่อรับ Route Kit
            เลย คุณจ่ายแค่ <span className="font-semibold text-gold">299฿</span> และได้
            Income Blueprint ฉบับเต็ม <span className="font-semibold text-gold">ฟรีในตัว</span>{" "}
            — ประหยัดทันที 199฿ พร้อมเครื่องมือลงมือครบชุด
          </p>
          <p className="mt-3 text-xs text-muted/70">
            รู้อัตลักษณ์แล้วแต่ไม่มีเครื่องมือลงมือ ก็เหมือนมีแผนที่แต่ไม่มีรถ —
            Route Kit คือรถที่พาคุณออกเดินทางได้จริง
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-muted/70">
          ROOTMAN Money Lab (ระบบสมาชิก) กำลังเปิดรับ Waitlist เร็ว ๆ นี้
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
