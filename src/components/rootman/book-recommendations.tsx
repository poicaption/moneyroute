import { Eyebrow } from "@/components/ui/card";

/**
 * Rootman "The One Root" book recommendations.
 * Shown after a purchase and inside the paid experience as a natural next step:
 * the assessment finds the route, these books deepen the underlying skill.
 * Links point to the real product pages on rootmanknows.com.
 */
type Book = {
  title: string;
  subtitle: string;
  blurb: string;
  tag: string;
  href: string;
};

const KIT: Book = {
  title: "Side Income Diagnostic Kit (SIDK)",
  subtitle: "FIELD KIT · เริ่มต้นที่นี่",
  blurb:
    "PDF Workbook 51 หน้า ช่วยวินิจฉัยเส้นทางรายได้เสริมที่ใช่กับคุณ — ต่อยอดจากผล Money Route ได้ทันที",
  tag: "Workbook · Lifetime",
  href: "https://rootmanknows.com/sale-sidk",
};

const BOOKS: Book[] = [
  {
    title: "รากแก้วการตลาด",
    subtitle: "Vol.1 · The One Root of Marketing",
    blurb:
      "12+5 บท กลไกจิตวิทยาที่ทำให้คนตัดสินใจซื้อ ตั้งแต่สมองสัตว์เลื้อยคลานถึงกลไกความไว้วางใจ",
    tag: "จิตวิทยาการตลาด",
    href: "https://rootmanknows.com/sale-sales",
  },
  {
    title: "The Invisible War",
    subtitle: "Vol.2 · รากแก้วการตลาด ภาค 2",
    blurb:
      "12+5 บท สงครามที่มองไม่เห็นในสนามรบดิจิทัล เมื่อทุกแบรนด์แย่งชิงความสนใจของลูกค้า",
    tag: "สนามรบดิจิทัล",
    href: "https://rootmanknows.com/sale-vol2",
  },
  {
    title: "รากแก้วธุรกิจ",
    subtitle: "Vol.3 · One Root of Business",
    blurb:
      "13+5 บท รากของธุรกิจที่ไม่เคยเปลี่ยน: ตลาด เงินสด อำนาจราคา ช่องทาง คน ระบบ และเกมระยะยาว",
    tag: "กลยุทธ์ธุรกิจ",
    href: "https://rootmanknows.com/sale-vol3",
  },
  {
    title: "เสร่อศาสตร์",
    subtitle: "The Audacity Advantage",
    blurb:
      "15 บท ศาสตร์แห่งการกล้า เปลี่ยนคนเงียบให้กล้าเข้าไปอยู่ในพื้นที่ของโอกาส พร้อมระบบฝึก 30 วัน",
    tag: "ศาสตร์แห่งการกล้า",
    href: "https://rootmanknows.com/sale-seror",
  },
];

function BookCard({ book, featured }: { book: Book; featured?: boolean }) {
  return (
    <a
      href={book.href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "pixel-3d pixel-3d-hover pixel-3d-press flex flex-col rounded-xl border p-5 transition-colors " +
        (featured
          ? "border-gold/50 bg-gold/10 sm:col-span-2"
          : "border-border bg-surface/60 hover:border-gold/50")
      }
    >
      <span className="font-pixel text-[10px] uppercase tracking-widest text-gold">
        {book.tag}
      </span>
      <span className="mt-2 text-lg font-bold text-paper">{book.title}</span>
      <span className="text-xs uppercase tracking-wide text-muted">
        {book.subtitle}
      </span>
      <span className="mt-3 flex-1 text-sm leading-relaxed text-paper/80">
        {book.blurb}
      </span>
      <span className="mt-4 text-sm font-semibold text-gold">
        ดูรายละเอียด →
      </span>
    </a>
  );
}

export default function BookRecommendations() {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <Eyebrow>อ่านต่อจาก Rootman</Eyebrow>
        <p className="text-sm text-muted">
          รู้อัตลักษณ์และเส้นทางแล้ว ขั้นต่อไปคือลับคมความเข้าใจเรื่องการตลาด
          ธุรกิจ และจิตวิทยามนุษย์ — ชุดหนังสือ “The One Root” จาก Rootman
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <BookCard book={KIT} featured />
        {BOOKS.map((b) => (
          <BookCard key={b.href} book={b} />
        ))}
      </div>
      <p className="text-center text-xs text-muted/60">
        ลิงก์ไปยัง rootmanknows.com · เปิดบทนำอ่านฟรีได้ก่อนตัดสินใจ
      </p>
    </section>
  );
}
