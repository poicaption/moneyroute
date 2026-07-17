import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { Eyebrow, SectionTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว — ROOTMAN MONEY ROUTE",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <Eyebrow>ความเป็นส่วนตัว</Eyebrow>
        <SectionTitle className="mt-3">นโยบายความเป็นส่วนตัว</SectionTitle>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <p>
            ROOTMAN MONEY ROUTE เก็บข้อมูลจากแบบประเมินเพื่อคำนวณเส้นทางสร้างรายได้
            ที่เหมาะกับคุณเท่านั้น ข้อมูลถูกประมวลผลภายในระบบของเรา
            และไม่มีการส่งต่อไปยังบริการ AI ภายนอก
          </p>
          <div>
            <h2 className="font-semibold text-paper">ข้อมูลที่เก็บ</h2>
            <p className="mt-2">
              คำตอบแบบประเมิน, ข้อมูลบัญชี (หากสมัคร), และข้อมูลการใช้งานแบบไม่ระบุตัวตน
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-paper">สิทธิของคุณ</h2>
            <p className="mt-2">
              คุณสามารถขอลบผลการประเมิน ลบบัญชี และขอส่งออกข้อมูลของคุณได้ทุกเมื่อ
            </p>
          </div>
          <p className="text-xs text-muted/70">
            เอกสารนี้เป็นฉบับร่างสำหรับ MVP โปรดปรับให้สอดคล้องกับ PDPA
            ก่อนเปิดใช้งานจริง
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
