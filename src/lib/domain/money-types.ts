/**
 * ROOTMAN MONEY ROUTE — Domain: Money Types
 * Six natural money-making patterns (not occupations).
 */

export const MONEY_TYPE_KEYS = [
  "hunter",
  "creator",
  "expert",
  "operator",
  "merchant",
  "builder",
] as const;

export type MoneyTypeKey = (typeof MONEY_TYPE_KEYS)[number];

export type MoneyTypeScores = Record<MoneyTypeKey, number>;

export type MoneyType = {
  slug: MoneyTypeKey;
  name: string;
  tagline: string;
  shortDescription: string;
  strengths: string[];
  weaknesses: string[];
  recommendedBehaviors: string[];
};

export const MONEY_TYPES: Record<MoneyTypeKey, MoneyType> = {
  hunter: {
    slug: "hunter",
    name: "THE HUNTER",
    tagline: "หาเงินเร็ว ปิดดีลเก่ง",
    shortDescription:
      "คุณมีพลังเมื่อเห็นผลลัพธ์เร็ว กล้าทัก กล้าขาย และรับการปฏิเสธได้",
    strengths: [
      "เห็นเงินเร็วและกล้าลงมือ",
      "ปิดการขายและเจรจาดีลได้",
      "รับการปฏิเสธได้โดยไม่เสียกำลังใจ",
    ],
    weaknesses: [
      "เบื่องานสร้างสินทรัพย์ระยะยาว",
      "เปลี่ยนสินค้า/โมเดลบ่อยเกินไป",
      "ให้ความสำคัญกับยอดขายมากกว่าคุณภาพ",
    ],
    recommendedBehaviors: [
      "ตั้งเป้ายอดติดต่อรายวันที่วัดได้",
      "เลือกสินค้าที่มี Commission ชัดเจน",
      "อยู่กับข้อเสนอเดิมให้ครบรอบทดลองก่อนเปลี่ยน",
    ],
  },
  creator: {
    slug: "creator",
    name: "THE CREATOR",
    tagline: "ดึงความสนใจ เล่าเรื่องเป็น",
    shortDescription:
      "คุณเปลี่ยนไอเดียเป็นคอนเทนต์ที่คนหยุดดูได้ และมีโอกาสสร้าง Audience",
    strengths: [
      "คิด Hook และหา Angle ได้",
      "ผลิตคอนเทนต์ได้ต่อเนื่อง",
      "เข้าใจกลไก Attention",
    ],
    weaknesses: [
      "สนุกกับการเริ่ม แต่เบื่อระบบ",
      "ผลิตมากแต่ไม่วัด Conversion",
      "มีผู้ติดตามแต่ไม่มีข้อเสนอขาย",
    ],
    recommendedBehaviors: [
      "ผูกคอนเทนต์กับข้อเสนอที่ขายได้เสมอ",
      "วัดผลด้วยตัวเลข ไม่ใช่จำนวนโพสต์",
      "ทดสอบสินค้าเดียวหลายมุมก่อนเปลี่ยน",
    ],
  },
  expert: {
    slug: "expert",
    name: "THE EXPERT",
    tagline: "แก้ปัญหาด้วยทักษะเฉพาะ",
    shortDescription:
      "คุณมีความรู้หรือทักษะที่คนยอมจ่าย และเหมาะกับข้อเสนอราคาสูง",
    strengths: [
      "แก้ปัญหาเฉพาะทางให้ผู้อื่นได้",
      "สร้างความน่าเชื่อถือผ่านผลงาน",
      "เหมาะกับข้อเสนอมูลค่าสูง",
    ],
    weaknesses: [
      "เรียนเพิ่มตลอดแต่ไม่ขาย",
      "ทำงานเฉพาะตัวมากเกินไป",
      "รายได้ติดอยู่กับเวลา",
    ],
    recommendedBehaviors: [
      "จัดทักษะเป็นแพ็กเกจที่ราคาชัดเจน",
      "สร้าง Proof และ Case ให้เห็นผล",
      "ขยับจากงานตามชั่วโมงสู่ Productized Service",
    ],
  },
  operator: {
    slug: "operator",
    name: "THE OPERATOR",
    tagline: "ทำระบบหลังบ้านให้ลื่น",
    shortDescription:
      "คุณจัดการรายละเอียดและทำงานตามระบบได้ดี เหมาะกับงานที่ลูกค้าไม่อยากทำเอง",
    strengths: [
      "ทำตามระบบและ Checklist ได้ดี",
      "จัดการรายละเอียดและงานซ้ำ",
      "ทำให้งานหลังบ้านไหลลื่น",
    ],
    weaknesses: [
      "มักตั้งราคาต่ำเกินไป",
      "ซ่อนตัวอยู่หลังงาน",
      "ไม่สร้างข้อเสนอมูลค่าสูง",
    ],
    recommendedBehaviors: [
      "ตั้งราคาตามผลลัพธ์ ไม่ใช่ตามเวลา",
      "รวมงานซ้ำเป็นแพ็กเกจรายเดือน",
      "แสดงผลลัพธ์ที่ประหยัดเวลาให้ลูกค้าเห็น",
    ],
  },
  merchant: {
    slug: "merchant",
    name: "THE MERCHANT",
    tagline: "มองสินค้าและ Margin ออก",
    shortDescription:
      "คุณเข้าใจสินค้า ราคา และความต้องการ ชอบหาส่วนต่างและของที่ขายได้จริง",
    strengths: [
      "มองราคาและส่วนต่างออก",
      "จัดการ Supply และ Demand ได้",
      "โฟกัสสิ่งที่ขายได้จริงมากกว่าทฤษฎี",
    ],
    weaknesses: [
      "เงินจมในสต็อก",
      "ติดสงครามราคา",
      "เลือกสินค้าจากความชอบแทน Demand",
    ],
    recommendedBehaviors: [
      "ทดสอบ Demand ก่อนสต็อกจริง",
      "เริ่มจากพรีออเดอร์หรือไม่สต็อก",
      "เลือกสินค้าจากข้อมูล ไม่ใช่ความชอบ",
    ],
  },
  builder: {
    slug: "builder",
    name: "THE BUILDER",
    tagline: "สร้างสินทรัพย์ที่ขยายได้",
    shortDescription:
      "คุณยอมรอเพื่อสร้างระบบหรือสินทรัพย์ที่ทำงานได้โดยไม่ต้องพึ่งแรงตลอดเวลา",
    strengths: [
      "คิดเชิงระบบและการขยาย",
      "อดทนสร้างสินทรัพย์ระยะยาว",
      "มีความทะเยอทะยานที่ชัดเจน",
    ],
    weaknesses: [
      "สร้างนานก่อนคุยกับตลาด",
      "Overbuild และใช้เงินก่อนมีลูกค้า",
      "มองข้าม Cashflow ระยะสั้น",
    ],
    recommendedBehaviors: [
      "คุยกับตลาดก่อนสร้างเต็มรูปแบบ",
      "ใช้ Bridge Route สร้าง Cashflow ระหว่างทาง",
      "ตั้ง Milestone จากลูกค้าจริง ไม่ใช่ฟีเจอร์",
    ],
  },
};

export const MONEY_TYPE_LIST: MoneyType[] = MONEY_TYPE_KEYS.map(
  (k) => MONEY_TYPES[k],
);
