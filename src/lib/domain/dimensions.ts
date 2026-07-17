/**
 * ROOTMAN MONEY ROUTE — Domain: Dimensions
 * The ten measured dimensions of the Money Scan.
 */

export const DIMENSION_KEYS = [
  "capital_readiness",
  "time_availability",
  "income_urgency",
  "sales_tolerance",
  "visibility_tolerance",
  "skill_leverage",
  "operational_discipline",
  "creative_production",
  "risk_tolerance",
  "scale_ambition",
] as const;

export type DimensionKey = (typeof DIMENSION_KEYS)[number];

export type DimensionScores = Record<DimensionKey, number>;

export const DIMENSIONS: Record<
  DimensionKey,
  { label: string; shortLabel: string; description: string }
> = {
  capital_readiness: {
    label: "Capital Readiness",
    shortLabel: "เงินทุน",
    description: "เงินที่พร้อมเสียได้ ความสามารถในการสต็อกและซื้อเครื่องมือ",
  },
  time_availability: {
    label: "Time Availability",
    shortLabel: "เวลา",
    description: "เวลาต่อวันและความต่อเนื่องของเวลาว่าง",
  },
  income_urgency: {
    label: "Income Urgency",
    shortLabel: "ความเร่งด่วน",
    description: "ต้องการเห็นรายได้เร็วแค่ไหน",
  },
  sales_tolerance: {
    label: "Sales Tolerance",
    shortLabel: "การขาย",
    description: "ความกล้าทักหาลูกค้า เสนอราคา และรับการปฏิเสธ",
  },
  visibility_tolerance: {
    label: "Visibility Tolerance",
    shortLabel: "การเปิดตัว",
    description: "ความยอมออกกล้อง ใช้เสียง หรือใช้ชื่อจริง",
  },
  skill_leverage: {
    label: "Skill Leverage",
    shortLabel: "ทักษะ",
    description: "ทักษะที่ขายได้ทันทีและประสบการณ์เฉพาะทาง",
  },
  operational_discipline: {
    label: "Operational Discipline",
    shortLabel: "วินัยงาน",
    description: "ความสม่ำเสมอ การทำงานซ้ำ และการติดตามตัวเลข",
  },
  creative_production: {
    label: "Creative Production",
    shortLabel: "ครีเอทีฟ",
    description: "การเขียน ทำภาพ เล่าเรื่อง และหา Angle",
  },
  risk_tolerance: {
    label: "Risk Tolerance",
    shortLabel: "ความเสี่ยง",
    description: "ความพร้อมรับรายได้ไม่แน่นอนและผลลัพธ์ช้า",
  },
  scale_ambition: {
    label: "Scale Ambition",
    shortLabel: "ความทะเยอทะยาน",
    description: "ระดับเป้าหมายจากรายได้เสริมสู่ธุรกิจที่ขยายได้",
  },
};
