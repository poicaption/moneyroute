import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { Eyebrow, SectionTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "เงื่อนไขการใช้งาน & Income Disclaimer — ROOTMAN MONEY ROUTE",
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <Eyebrow>เงื่อนไข</Eyebrow>
        <SectionTitle className="mt-3">
          เงื่อนไขการใช้งาน & Income Disclaimer
        </SectionTitle>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
          <div>
            <h2 className="font-semibold text-paper">Income Disclaimer</h2>
            <p className="mt-2">
              ROOTMAN MONEY ROUTE เป็นระบบช่วยตัดสินใจเลือกเส้นทางสร้างรายได้
              ไม่ใช่การรับประกันรายได้ และไม่ใช่คำแนะนำการลงทุนเฉพาะบุคคล
              ผลลัพธ์ที่ได้ขึ้นอยู่กับตลาด ทักษะ การลงมือ
              และเงื่อนไขเฉพาะของแต่ละคน
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-paper">การใช้งาน</h2>
            <p className="mt-2">
              เนื้อหาและแผนที่ระบบสร้างขึ้นมีไว้เพื่อการเรียนรู้และการลงมือทดลอง
              ผู้ใช้เป็นผู้รับผิดชอบต่อการตัดสินใจทางธุรกิจของตนเอง
            </p>
          </div>
          <p className="text-xs text-muted/70">
            เอกสารนี้เป็นฉบับร่างสำหรับ MVP
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
