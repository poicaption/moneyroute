/**
 * ROOTMAN MONEY ROUTE — Seed assessment questions (Money Scan v2).
 * 48 situational questions. Each option carries a deterministic scoring payload.
 * v2 expands coverage (more explicit type signals) to sharpen the 16-identity
 * resolution while keeping the deterministic scoring engine unchanged.
 */
import type { AssessmentQuestion } from "./assessment-types";

export const ASSESSMENT_VERSION = "v2";

export const QUESTIONS: AssessmentQuestion[] = [
  {
    code: "Q1",
    category: "capital",
    text: "หากมีโอกาสเริ่มต้นที่น่าสนใจ คุณสามารถใช้เงินก้อนใดโดยไม่กระทบค่าใช้จ่ายจำเป็น?",
    options: [
      {
        code: "a",
        label: "ไม่เกิน 1,000 บาท",
        scoring: { dimensions: { capital_readiness: 0 }, flags: ["capital_low"] },
      },
      {
        code: "b",
        label: "1,001–5,000 บาท",
        scoring: { dimensions: { capital_readiness: 1 }, flags: ["capital_low"] },
      },
      {
        code: "c",
        label: "5,001–20,000 บาท",
        scoring: { dimensions: { capital_readiness: 2 } },
      },
      {
        code: "d",
        label: "มากกว่า 20,000 บาท",
        scoring: {
          dimensions: { capital_readiness: 3 },
          flags: ["capital_high"],
        },
      },
    ],
  },
  {
    code: "Q2",
    category: "capital",
    text: "หากเงินที่ใช้เริ่มต้นหายไปทั้งหมด คุณจะรู้สึกอย่างไร?",
    options: [
      {
        code: "a",
        label: "กระทบชีวิตอย่างมาก",
        scoring: { dimensions: { risk_tolerance: 0 } },
      },
      {
        code: "b",
        label: "เครียด แต่ยังรับมือได้",
        scoring: { dimensions: { risk_tolerance: 1 } },
      },
      {
        code: "c",
        label: "ถือเป็นค่าเรียนรู้",
        scoring: { dimensions: { risk_tolerance: 2 } },
      },
      {
        code: "d",
        label: "พร้อมลงทุนเพิ่มหากเห็นข้อมูลที่ดี",
        scoring: {
          dimensions: { risk_tolerance: 3, capital_readiness: 1 },
        },
      },
    ],
  },
  {
    code: "Q3",
    category: "time",
    text: "ในหนึ่งสัปดาห์ คุณมีเวลาที่ควบคุมได้จริงกี่ชั่วโมง?",
    options: [
      {
        code: "a",
        label: "ต่ำกว่า 3 ชั่วโมง",
        scoring: { dimensions: { time_availability: 0 } },
      },
      {
        code: "b",
        label: "3–7 ชั่วโมง",
        scoring: { dimensions: { time_availability: 1 } },
      },
      {
        code: "c",
        label: "8–14 ชั่วโมง",
        scoring: { dimensions: { time_availability: 2 } },
      },
      {
        code: "d",
        label: "มากกว่า 14 ชั่วโมง",
        scoring: { dimensions: { time_availability: 3 } },
      },
    ],
  },
  {
    code: "Q4",
    category: "time",
    text: "เวลาว่างของคุณมีลักษณะใด?",
    options: [
      {
        code: "a",
        label: "มาเป็นช่วงสั้น ๆ ไม่แน่นอน",
        scoring: { dimensions: { time_availability: 0 } },
      },
      {
        code: "b",
        label: "มีประมาณวันละหนึ่งชั่วโมง",
        scoring: { dimensions: { time_availability: 1 } },
      },
      {
        code: "c",
        label: "มีช่วงยาวในวันหยุด",
        scoring: { dimensions: { time_availability: 2 } },
      },
      {
        code: "d",
        label: "จัดเวลาเองได้เกือบทั้งหมด",
        scoring: { dimensions: { time_availability: 3 } },
      },
    ],
  },
  {
    code: "Q5",
    category: "urgency",
    text: "คุณต้องการเห็นรายได้ก้อนแรกเมื่อไร?",
    options: [
      {
        code: "a",
        label: "ภายใน 7 วัน",
        scoring: { dimensions: { income_urgency: 3 }, flags: ["urgent_7d", "urgent_30d"] },
      },
      {
        code: "b",
        label: "ภายใน 30 วัน",
        scoring: { dimensions: { income_urgency: 2 }, flags: ["urgent_30d"] },
      },
      {
        code: "c",
        label: "ภายใน 3 เดือน",
        scoring: { dimensions: { income_urgency: 1 } },
      },
      {
        code: "d",
        label: "ยอมรอได้ หากกำลังสร้างสิ่งที่โตระยะยาว",
        scoring: { dimensions: { income_urgency: 0, scale_ambition: 1 } },
      },
    ],
  },
  {
    code: "Q6",
    category: "urgency",
    text: "หากโมเดลหนึ่งมีโอกาสโตสูง แต่สามเดือนแรกยังไม่มีรายได้ คุณจะ:",
    options: [
      {
        code: "a",
        label: "เลิกและเปลี่ยนทันที",
        scoring: { dimensions: { income_urgency: 3, risk_tolerance: 0 } },
      },
      {
        code: "b",
        label: "ทดลองต่อหากมีสัญญาณตอบรับ",
        scoring: { dimensions: { income_urgency: 2, risk_tolerance: 1 } },
      },
      {
        code: "c",
        label: "ทำควบคู่กับงานที่ได้เงินเร็ว",
        scoring: { dimensions: { income_urgency: 1, risk_tolerance: 2 } },
      },
      {
        code: "d",
        label: "ลงมือระยะยาวได้",
        scoring: { dimensions: { income_urgency: 0, risk_tolerance: 3 } },
      },
    ],
  },
  {
    code: "Q7",
    category: "sales",
    text: "หากต้องทักหาลูกค้าแปลกหน้า 20 คน คุณรู้สึกอย่างไร?",
    options: [
      {
        code: "a",
        label: "ไม่ทำเด็ดขาด",
        scoring: { dimensions: { sales_tolerance: 0 }, flags: ["no_sales"] },
      },
      {
        code: "b",
        label: "ทำได้ถ้ามี Script",
        scoring: { dimensions: { sales_tolerance: 1 } },
      },
      {
        code: "c",
        label: "ทำได้ แม้ไม่ชอบ",
        scoring: { dimensions: { sales_tolerance: 2 } },
      },
      {
        code: "d",
        label: "รู้สึกท้าทายและสนุก",
        scoring: { dimensions: { sales_tolerance: 3 }, types: { hunter: 1 } },
      },
    ],
  },
  {
    code: "Q8",
    category: "sales",
    text: "เมื่อมีคนปฏิเสธข้อเสนอของคุณ คุณมัก:",
    options: [
      {
        code: "a",
        label: "รู้สึกเสียความมั่นใจหลายวัน",
        scoring: { dimensions: { sales_tolerance: 0 } },
      },
      {
        code: "b",
        label: "หยุดพักก่อนกลับมาลองใหม่",
        scoring: { dimensions: { sales_tolerance: 1 } },
      },
      {
        code: "c",
        label: "ปรับข้อเสนอและลองต่อ",
        scoring: { dimensions: { sales_tolerance: 2 } },
      },
      {
        code: "d",
        label: "มองเป็นข้อมูล ไม่ใช่การปฏิเสธตัวตน",
        scoring: { dimensions: { sales_tolerance: 3 }, types: { hunter: 1 } },
      },
    ],
  },
  {
    code: "Q9",
    category: "visibility",
    text: "คุณยอมให้คนรู้จักเห็นว่าคุณกำลังสร้างรายได้ออนไลน์หรือไม่?",
    options: [
      {
        code: "a",
        label: "ไม่ต้องการให้รู้เลย",
        scoring: { dimensions: { visibility_tolerance: 0 }, flags: ["no_face"] },
      },
      {
        code: "b",
        label: "ยอมใช้เสียง แต่ไม่ใช้หน้า",
        scoring: { dimensions: { visibility_tolerance: 1 }, flags: ["no_face"] },
      },
      {
        code: "c",
        label: "ยอมออกหน้าในบัญชีแยก",
        scoring: { dimensions: { visibility_tolerance: 2 } },
      },
      {
        code: "d",
        label: "ไม่มีปัญหากับการใช้ตัวตนจริง",
        scoring: { dimensions: { visibility_tolerance: 3 } },
      },
    ],
  },
  {
    code: "Q10",
    category: "visibility",
    text: "รูปแบบคอนเทนต์ใดที่คุณทำได้ต่อเนื่องที่สุด?",
    options: [
      {
        code: "a",
        label: "ข้อความและภาพ",
        scoring: {
          dimensions: { visibility_tolerance: 0, creative_production: 2 },
          flags: ["no_face"],
        },
      },
      {
        code: "b",
        label: "เสียงบรรยาย",
        scoring: {
          dimensions: { visibility_tolerance: 1, creative_production: 1 },
          flags: ["no_face"],
        },
      },
      {
        code: "c",
        label: "วิดีโอเห็นเฉพาะมือหรือสินค้า",
        scoring: {
          dimensions: { visibility_tolerance: 1, creative_production: 2 },
          flags: ["no_face"],
        },
      },
      {
        code: "d",
        label: "พูดหน้ากล้อง",
        scoring: {
          dimensions: { visibility_tolerance: 3, creative_production: 2 },
        },
      },
    ],
  },
  {
    code: "Q11",
    category: "skill",
    text: "ตอนนี้มีใครยอมจ่ายเงินให้กับทักษะของคุณอยู่แล้วหรือไม่?",
    options: [
      {
        code: "a",
        label: "ยังไม่มี",
        scoring: { dimensions: { skill_leverage: 0 }, flags: ["no_skill"] },
      },
      {
        code: "b",
        label: "เคยมีเป็นครั้งคราว",
        scoring: { dimensions: { skill_leverage: 1 } },
      },
      {
        code: "c",
        label: "มีลูกค้าหรือรายได้จากทักษะอยู่บ้าง",
        scoring: {
          dimensions: { skill_leverage: 2 },
          flags: ["has_paying_skill"],
        },
      },
      {
        code: "d",
        label: "มีผลงานและลูกค้าประจำ",
        scoring: {
          dimensions: { skill_leverage: 3 },
          flags: ["has_paying_skill", "has_portfolio"],
        },
      },
    ],
  },
  {
    code: "Q12",
    category: "skill",
    text: "หากต้องสร้างตัวอย่างผลงานหนึ่งชิ้นภายในวันนี้ คุณสามารถทำได้หรือไม่?",
    options: [
      {
        code: "a",
        label: "ไม่รู้ว่าจะทำอะไร",
        scoring: { dimensions: { skill_leverage: 0, creative_production: 0 } },
      },
      {
        code: "b",
        label: "ทำได้หากมีตัวอย่าง",
        scoring: { dimensions: { skill_leverage: 1, creative_production: 1 } },
      },
      {
        code: "c",
        label: "ทำได้ด้วยตัวเอง",
        scoring: { dimensions: { skill_leverage: 2, creative_production: 2 } },
      },
      {
        code: "d",
        label: "มีตัวอย่างพร้อมใช้อยู่แล้ว",
        scoring: {
          dimensions: { skill_leverage: 3, creative_production: 2 },
          flags: ["has_portfolio"],
        },
      },
    ],
  },
  {
    code: "Q13",
    category: "operation",
    text: "งานแบบใดทำให้คุณเหนื่อยน้อยที่สุด?",
    options: [
      {
        code: "a",
        label: "คิดไอเดียใหม่",
        scoring: {
          dimensions: { creative_production: 2 },
          types: { creator: 1 },
        },
      },
      {
        code: "b",
        label: "พูดคุยและโน้มน้าว",
        scoring: {
          dimensions: { sales_tolerance: 2 },
          types: { hunter: 1 },
        },
      },
      {
        code: "c",
        label: "ทำงานตามขั้นตอน",
        scoring: {
          dimensions: { operational_discipline: 2 },
          types: { operator: 1 },
        },
      },
      {
        code: "d",
        label: "วิเคราะห์ข้อมูลและแก้ระบบ",
        scoring: {
          dimensions: { operational_discipline: 1, scale_ambition: 1 },
          types: { builder: 1 },
          flags: ["prefer_system"],
        },
      },
    ],
  },
  {
    code: "Q14",
    category: "operation",
    text: "เมื่องานต้องทำซ้ำทุกวัน คุณมัก:",
    options: [
      {
        code: "a",
        label: "เบื่อและหยุดอย่างรวดเร็ว",
        scoring: { dimensions: { operational_discipline: 0 } },
      },
      {
        code: "b",
        label: "ทำได้หากเห็นรายได้",
        scoring: { dimensions: { operational_discipline: 1 } },
      },
      {
        code: "c",
        label: "ทำได้เมื่อมี Checklist",
        scoring: { dimensions: { operational_discipline: 2 } },
      },
      {
        code: "d",
        label: "ชอบปรับระบบให้เร็วขึ้นเรื่อย ๆ",
        scoring: {
          dimensions: { operational_discipline: 3 },
          types: { operator: 1 },
        },
      },
    ],
  },
  {
    code: "Q15",
    category: "risk",
    text: "รายได้หลักของคุณในตอนนี้มีความมั่นคงเพียงใด?",
    options: [
      {
        code: "a",
        label: "ไม่แน่นอนมาก",
        scoring: { dimensions: { risk_tolerance: 0 } },
      },
      {
        code: "b",
        label: "พออยู่ได้ แต่ไม่มีเงินเหลือ",
        scoring: { dimensions: { risk_tolerance: 1 } },
      },
      {
        code: "c",
        label: "ค่อนข้างมั่นคง",
        scoring: { dimensions: { risk_tolerance: 2 } },
      },
      {
        code: "d",
        label: "มีเงินสำรองเพียงพอ",
        scoring: {
          dimensions: { risk_tolerance: 3, capital_readiness: 1 },
        },
      },
    ],
  },
  {
    code: "Q16",
    category: "risk",
    text: "คุณต้องการโมเดลรายได้แบบใด?",
    options: [
      {
        code: "a",
        label: "เงินเร็ว แม้อาจไม่โตมาก",
        scoring: {
          dimensions: { income_urgency: 3, scale_ambition: 0 },
          types: { hunter: 1 },
        },
      },
      {
        code: "b",
        label: "เริ่มเร็วและค่อยพัฒนา",
        scoring: { dimensions: { income_urgency: 2, scale_ambition: 1 } },
      },
      {
        code: "c",
        label: "รายได้ช้ากว่าแต่ขยายได้",
        scoring: { dimensions: { income_urgency: 1, scale_ambition: 2 } },
      },
      {
        code: "d",
        label: "ยอมเสี่ยงและรอเพื่อสร้างธุรกิจใหญ่",
        scoring: {
          dimensions: { income_urgency: 0, scale_ambition: 3, risk_tolerance: 1 },
          types: { builder: 1 },
        },
      },
    ],
  },
  {
    code: "Q17",
    category: "ambition",
    text: "เป้าหมายใน 12 เดือนของคุณคือ:",
    options: [
      {
        code: "a",
        label: "เพิ่มรายได้ประมาณ 3,000–5,000 บาทต่อเดือน",
        scoring: { dimensions: { scale_ambition: 0 } },
      },
      {
        code: "b",
        label: "เพิ่มรายได้ประมาณ 10,000–30,000 บาทต่อเดือน",
        scoring: { dimensions: { scale_ambition: 1 } },
      },
      {
        code: "c",
        label: "สร้างรายได้ทดแทนเงินเดือน",
        scoring: { dimensions: { scale_ambition: 2 } },
      },
      {
        code: "d",
        label: "สร้างธุรกิจที่โตเกินแรงงานตัวเอง",
        scoring: {
          dimensions: { scale_ambition: 3 },
          types: { builder: 1 },
        },
      },
    ],
  },
  {
    code: "Q18",
    category: "ambition",
    text: "คุณอยากได้อะไรจากเส้นทางนี้มากที่สุด?",
    options: [
      {
        code: "a",
        label: "เงินสด",
        scoring: {
          dimensions: { income_urgency: 2 },
          types: { hunter: 1 },
        },
      },
      {
        code: "b",
        label: "อิสระด้านเวลา",
        scoring: { dimensions: { scale_ambition: 1 } },
      },
      {
        code: "c",
        label: "ตัวตนและชื่อเสียง",
        scoring: {
          dimensions: { visibility_tolerance: 1, creative_production: 1 },
          types: { creator: 1 },
        },
      },
      {
        code: "d",
        label: "ธุรกิจหรือทรัพย์สินระยะยาว",
        scoring: {
          dimensions: { scale_ambition: 2 },
          types: { builder: 1 },
        },
      },
    ],
  },
  {
    code: "Q19",
    category: "behavior",
    text: "ในหกเดือนที่ผ่านมา คุณเริ่มทดลองหาเงินใหม่กี่ครั้ง?",
    options: [
      {
        code: "a",
        label: "ไม่เคยเริ่ม",
        scoring: { dimensions: { operational_discipline: 0 } },
      },
      {
        code: "b",
        label: "เริ่มหนึ่งครั้งแล้วหยุด",
        scoring: { dimensions: { operational_discipline: 1 } },
      },
      {
        code: "c",
        label: "ทดลองหลายอย่างแต่ไม่ต่อเนื่อง",
        scoring: {
          dimensions: { operational_discipline: 1, income_urgency: 1 },
        },
      },
      {
        code: "d",
        label: "ทดลองและบันทึกผลอย่างจริงจัง",
        scoring: { dimensions: { operational_discipline: 3 } },
      },
    ],
  },
  {
    code: "Q20",
    category: "behavior",
    text: "เมื่อไม่เห็นผลในช่วงแรก คุณมัก:",
    options: [
      {
        code: "a",
        label: "สรุปว่าไม่เหมาะกับตัวเอง",
        scoring: { dimensions: { operational_discipline: 0 } },
      },
      {
        code: "b",
        label: "เปลี่ยนไปหาโอกาสใหม่",
        scoring: { dimensions: { operational_discipline: 1 } },
      },
      {
        code: "c",
        label: "ทบทวนว่าส่วนใดไม่ทำงาน",
        scoring: { dimensions: { operational_discipline: 2 } },
      },
      {
        code: "d",
        label: "ให้เวลาทดลองตามเกณฑ์ที่ตั้งไว้",
        scoring: {
          dimensions: { operational_discipline: 3, risk_tolerance: 1 },
        },
      },
    ],
  },
  {
    code: "Q21",
    category: "resource",
    text: "สิ่งใดเป็นทรัพยากรที่ดีที่สุดของคุณตอนนี้?",
    options: [
      {
        code: "a",
        label: "เวลา",
        scoring: {
          dimensions: { time_availability: 1 },
          flags: ["resource_time"],
        },
      },
      {
        code: "b",
        label: "ทักษะ",
        scoring: {
          dimensions: { skill_leverage: 2 },
          flags: ["resource_skill", "has_paying_skill"],
        },
      },
      {
        code: "c",
        label: "Connection",
        scoring: {
          dimensions: { sales_tolerance: 1 },
          flags: ["resource_connection"],
        },
      },
      {
        code: "d",
        label: "เงินทุน",
        scoring: {
          dimensions: { capital_readiness: 2 },
          flags: ["resource_capital", "capital_high"],
        },
      },
      {
        code: "e",
        label: "ผู้ติดตาม",
        scoring: {
          dimensions: { creative_production: 1 },
          flags: ["resource_followers", "access_followers"],
        },
      },
      {
        code: "f",
        label: "ความรู้เฉพาะด้าน",
        scoring: {
          dimensions: { skill_leverage: 2 },
          flags: ["resource_niche"],
        },
      },
      {
        code: "g",
        label: "ยังไม่แน่ใจ",
        scoring: {},
      },
    ],
  },
  {
    code: "Q22",
    category: "resource",
    text: "คุณเข้าถึงกลุ่มลูกค้ากลุ่มใดได้ง่ายที่สุด?",
    options: [
      {
        code: "a",
        label: "คนทั่วไป",
        scoring: { flags: ["access_general"] },
      },
      {
        code: "b",
        label: "เจ้าของธุรกิจ",
        scoring: { flags: ["access_business"] },
      },
      {
        code: "c",
        label: "คนในวิชาชีพเดียวกัน",
        scoring: { flags: ["access_professional"] },
      },
      {
        code: "d",
        label: "ร้านค้าในพื้นที่",
        scoring: { flags: ["access_local"] },
      },
      {
        code: "e",
        label: "ผู้ติดตามออนไลน์",
        scoring: { flags: ["access_followers"] },
      },
      {
        code: "f",
        label: "ยังไม่มีฐานลูกค้า",
        scoring: {},
      },
    ],
  },
  {
    code: "Q23",
    category: "preference",
    text: "คุณต้องการทำงานกับใคร?",
    options: [
      {
        code: "a",
        label: "ไม่ต้องการคุยกับลูกค้าโดยตรง",
        scoring: { flags: ["work_no_direct"] },
      },
      {
        code: "b",
        label: "ลูกค้ารายบุคคล",
        scoring: { flags: ["work_individual"] },
      },
      {
        code: "c",
        label: "ร้านค้าและธุรกิจขนาดเล็ก",
        scoring: {
          flags: ["work_smb", "access_business"],
          dimensions: { sales_tolerance: 1 },
        },
      },
      {
        code: "d",
        label: "บริษัท",
        scoring: {
          flags: ["work_company", "access_company"],
          dimensions: { sales_tolerance: 1 },
        },
      },
      {
        code: "e",
        label: "ผู้ติดตามหรือ Community",
        scoring: {
          flags: ["work_community"],
          dimensions: { creative_production: 1 },
        },
      },
    ],
  },
  {
    code: "Q24",
    category: "preference",
    text: "คุณชอบสร้างสิ่งใดมากกว่า?",
    options: [
      {
        code: "a",
        label: "คอนเทนต์",
        scoring: {
          flags: ["prefer_content"],
          types: { creator: 1 },
        },
      },
      {
        code: "b",
        label: "บริการ",
        scoring: {
          flags: ["prefer_service"],
          types: { expert: 1, operator: 0 },
        },
      },
      {
        code: "c",
        label: "สินค้า",
        scoring: {
          flags: ["prefer_product"],
          types: { merchant: 1 },
        },
      },
      {
        code: "d",
        label: "ระบบ",
        scoring: {
          flags: ["prefer_system"],
          types: { builder: 1 },
        },
      },
      {
        code: "e",
        label: "ดีลและการเจรจา",
        scoring: {
          flags: ["prefer_deal"],
          types: { hunter: 1 },
        },
      },
    ],
  },
  // ── v2 expansion (Q25–Q48): sharpen type/identity signals ─────────────────
  {
    code: "Q25",
    category: "sales",
    text: "เมื่อเจอโอกาสทำเงินใหม่ สิ่งแรกที่คุณมักทำคือ:",
    options: [
      {
        code: "a",
        label: "หาคนที่น่าจะซื้อแล้วทักเลย",
        scoring: { dimensions: { sales_tolerance: 2 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "ลองทำคอนเทนต์เล่าเรื่องมันก่อน",
        scoring: { dimensions: { creative_production: 2 }, types: { creator: 1 } },
      },
      {
        code: "c",
        label: "คำนวณต้นทุน–กำไรและแหล่งของ",
        scoring: { dimensions: { operational_discipline: 1 }, types: { merchant: 1 } },
      },
      {
        code: "d",
        label: "ออกแบบระบบ/แผนระยะยาวก่อนเริ่ม",
        scoring: {
          dimensions: { scale_ambition: 2 },
          types: { builder: 1 },
          flags: ["prefer_system"],
        },
      },
    ],
  },
  {
    code: "Q26",
    category: "skill",
    text: "เพื่อน ๆ มักมาขอให้คุณช่วยเรื่องอะไรบ่อยที่สุด?",
    options: [
      {
        code: "a",
        label: "ช่วยขาย/เจรจา/ต่อรอง",
        scoring: { dimensions: { sales_tolerance: 2 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "ช่วยคิดคอนเทนต์/ครีเอทีฟ",
        scoring: { dimensions: { creative_production: 2 }, types: { creator: 1 } },
      },
      {
        code: "c",
        label: "ช่วยแก้ปัญหาเฉพาะทางที่ถนัด",
        scoring: {
          dimensions: { skill_leverage: 2 },
          types: { expert: 1 },
          flags: ["has_paying_skill"],
        },
      },
      {
        code: "d",
        label: "ช่วยจัดการ/วางแผน/ทำให้เป็นระบบ",
        scoring: { dimensions: { operational_discipline: 2 }, types: { operator: 1 } },
      },
    ],
  },
  {
    code: "Q27",
    category: "preference",
    text: "งานแบบไหนที่คุณทำแล้ว 'ลืมเวลา'?",
    options: [
      {
        code: "a",
        label: "คุยกับคนและปิดดีล",
        scoring: { dimensions: { sales_tolerance: 1 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "สร้างสรรค์งานและเล่าเรื่อง",
        scoring: { dimensions: { creative_production: 2 }, types: { creator: 1 } },
      },
      {
        code: "c",
        label: "เจาะลึกและแก้โจทย์ยาก",
        scoring: { dimensions: { skill_leverage: 1 }, types: { expert: 1 } },
      },
      {
        code: "d",
        label: "จัดของ/จัดระบบให้เป๊ะ",
        scoring: { dimensions: { operational_discipline: 2 }, types: { operator: 1 } },
      },
      {
        code: "e",
        label: "หาของถูก-ขายแพง",
        scoring: { types: { merchant: 1 }, flags: ["prefer_product"] },
      },
    ],
  },
  {
    code: "Q28",
    category: "behavior",
    text: "เวลามีเงินเข้ามาก้อนหนึ่ง คุณมักจะ:",
    options: [
      {
        code: "a",
        label: "รีบเอาไปต่อยอดหาเงินเพิ่มทันที",
        scoring: { dimensions: { income_urgency: 2 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "ลงกับของ/สต็อกที่น่าจะขายได้",
        scoring: { dimensions: { capital_readiness: 1 }, types: { merchant: 1 } },
      },
      {
        code: "c",
        label: "ลงทุนกับทักษะ/เครื่องมือของตัวเอง",
        scoring: { dimensions: { skill_leverage: 1 }, types: { expert: 1 } },
      },
      {
        code: "d",
        label: "เก็บไว้สร้างสิ่งที่โตระยะยาว",
        scoring: {
          dimensions: { scale_ambition: 2, income_urgency: 0 },
          types: { builder: 1 },
        },
      },
    ],
  },
  {
    code: "Q29",
    category: "visibility",
    text: "ถ้าต้องโปรโมตงานของตัวเอง คุณถนัดแบบไหน?",
    options: [
      {
        code: "a",
        label: "ทักหาคนตรง ๆ ทีละคน",
        scoring: { dimensions: { sales_tolerance: 2 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "ทำคอนเทนต์ให้คนเข้ามาหาเอง",
        scoring: {
          dimensions: { creative_production: 2, visibility_tolerance: 1 },
          types: { creator: 1 },
        },
      },
      {
        code: "c",
        label: "โชว์ผลงาน/เคสให้เห็นผลลัพธ์",
        scoring: {
          dimensions: { skill_leverage: 1 },
          types: { expert: 1 },
          flags: ["has_portfolio"],
        },
      },
      {
        code: "d",
        label: "ให้ลูกค้าเก่าบอกต่อ",
        scoring: { dimensions: { operational_discipline: 1 }, types: { operator: 1 } },
      },
    ],
  },
  {
    code: "Q30",
    category: "operation",
    text: "อะไรทำให้คุณภูมิใจในงานมากที่สุด?",
    options: [
      {
        code: "a",
        label: "ปิดยอด/ทำเงินได้ตามเป้า",
        scoring: { dimensions: { income_urgency: 1 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "งานของฉันมีคนพูดถึง/แชร์",
        scoring: { dimensions: { creative_production: 1 }, types: { creator: 1 } },
      },
      {
        code: "c",
        label: "แก้ปัญหาที่คนอื่นแก้ไม่ได้",
        scoring: { dimensions: { skill_leverage: 2 }, types: { expert: 1 } },
      },
      {
        code: "d",
        label: "ทุกอย่างเดินได้เองอย่างเป็นระบบ",
        scoring: {
          dimensions: { operational_discipline: 1, scale_ambition: 1 },
          types: { builder: 1 },
        },
      },
    ],
  },
  {
    code: "Q31",
    category: "sales",
    text: "ในวงสนทนากลุ่ม บทบาทที่คุณมักเป็นคือ:",
    options: [
      {
        code: "a",
        label: "คนที่ผลักให้เกิดการตัดสินใจ",
        scoring: { dimensions: { sales_tolerance: 2 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "คนที่ทำให้เรื่องสนุกและน่าฟัง",
        scoring: { dimensions: { creative_production: 1 }, types: { creator: 1 } },
      },
      {
        code: "c",
        label: "คนที่ให้คำแนะนำเชิงลึก",
        scoring: { dimensions: { skill_leverage: 1 }, types: { expert: 1 } },
      },
      {
        code: "d",
        label: "คนที่คอยจัดคิว/สรุปงานให้ลง",
        scoring: { dimensions: { operational_discipline: 2 }, types: { operator: 1 } },
      },
      {
        code: "e",
        label: "คนที่รู้ว่าหาของ/ดีลได้ที่ไหน",
        scoring: { types: { merchant: 1 } },
      },
    ],
  },
  {
    code: "Q32",
    category: "urgency",
    text: "คุณรู้สึกกับความเสี่ยงที่ 'รายได้ไม่แน่นอน' อย่างไร?",
    options: [
      {
        code: "a",
        label: "รับไม่ได้ ต้องมีเงินเข้าเร็ว",
        scoring: { dimensions: { income_urgency: 3, risk_tolerance: 0 } },
      },
      {
        code: "b",
        label: "รับได้บ้างถ้าเห็นสัญญาณดี",
        scoring: { dimensions: { income_urgency: 2, risk_tolerance: 1 } },
      },
      {
        code: "c",
        label: "รับได้ ถ้าเป็นการสะสมทักษะ",
        scoring: { dimensions: { income_urgency: 1, risk_tolerance: 2 } },
      },
      {
        code: "d",
        label: "รับได้เต็มที่เพื่อผลลัพธ์ใหญ่",
        scoring: {
          dimensions: { income_urgency: 0, risk_tolerance: 3, scale_ambition: 1 },
          types: { builder: 1 },
        },
      },
    ],
  },
  {
    code: "Q33",
    category: "creative",
    text: "การทำคอนเทนต์สม่ำเสมอสำหรับคุณคือ:",
    options: [
      {
        code: "a",
        label: "ยากมาก ไม่ใช่ทางของฉัน",
        scoring: { dimensions: { creative_production: 0 } },
      },
      {
        code: "b",
        label: "ทำได้ถ้ามีสูตร/เทมเพลต",
        scoring: { dimensions: { creative_production: 1 } },
      },
      {
        code: "c",
        label: "ทำได้ต่อเนื่องพอสมควร",
        scoring: { dimensions: { creative_production: 2 }, types: { creator: 1 } },
      },
      {
        code: "d",
        label: "สนุกและมีไอเดียไม่ตัน",
        scoring: {
          dimensions: { creative_production: 3, visibility_tolerance: 1 },
          types: { creator: 1 },
        },
      },
    ],
  },
  {
    code: "Q34",
    category: "skill",
    text: "ถ้าให้สอนคนอื่นเรื่องที่คุณถนัด คุณจะ:",
    options: [
      {
        code: "a",
        label: "ไม่ถนัดสอน อธิบายไม่เก่ง",
        scoring: { dimensions: { skill_leverage: 0 } },
      },
      {
        code: "b",
        label: "สอนได้ถ้าเตรียมตัวมาก่อน",
        scoring: { dimensions: { skill_leverage: 1 } },
      },
      {
        code: "c",
        label: "สอนได้ดีและคนเข้าใจง่าย",
        scoring: {
          dimensions: { skill_leverage: 2, creative_production: 1 },
          types: { expert: 1 },
        },
      },
      {
        code: "d",
        label: "สอนสนุกจนคนอยากตามต่อ",
        scoring: {
          dimensions: { skill_leverage: 2, creative_production: 2 },
          types: { expert: 1, creator: 1 },
        },
      },
    ],
  },
  {
    code: "Q35",
    category: "operation",
    text: "โต๊ะทำงาน/ไฟล์งานของคุณมักเป็นแบบไหน?",
    options: [
      {
        code: "a",
        label: "รก ๆ แต่ฉันหาเจอเอง",
        scoring: { dimensions: { operational_discipline: 0 } },
      },
      {
        code: "b",
        label: "พอมีระบบบ้างเป็นบางเรื่อง",
        scoring: { dimensions: { operational_discipline: 1 } },
      },
      {
        code: "c",
        label: "จัดเป็นระเบียบพอสมควร",
        scoring: { dimensions: { operational_discipline: 2 }, types: { operator: 1 } },
      },
      {
        code: "d",
        label: "เป็นระบบเป๊ะ มีโฟลเดอร์/เช็กลิสต์",
        scoring: { dimensions: { operational_discipline: 3 }, types: { operator: 1 } },
      },
    ],
  },
  {
    code: "Q36",
    category: "resource",
    text: "ถ้าต้องเริ่มพรุ่งนี้ คุณมีต้นทุนอะไรพร้อมใช้มากที่สุด?",
    options: [
      {
        code: "a",
        label: "ความกล้าเข้าหาคน",
        scoring: { dimensions: { sales_tolerance: 1 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "ไอเดียและการทำคอนเทนต์",
        scoring: { dimensions: { creative_production: 1 }, types: { creator: 1 } },
      },
      {
        code: "c",
        label: "ทักษะที่คนยอมจ่าย",
        scoring: {
          dimensions: { skill_leverage: 2 },
          types: { expert: 1 },
          flags: ["has_paying_skill"],
        },
      },
      {
        code: "d",
        label: "ความละเอียดและวินัย",
        scoring: { dimensions: { operational_discipline: 1 }, types: { operator: 1 } },
      },
      {
        code: "e",
        label: "สายป่านของ/ซัพพลายเออร์",
        scoring: { types: { merchant: 1 }, flags: ["resource_supply"] },
      },
    ],
  },
  {
    code: "Q37",
    category: "ambition",
    text: "ภาพความสำเร็จที่คุณอยากได้จริง ๆ คือ:",
    options: [
      {
        code: "a",
        label: "มีเงินสดเข้าทุกวันแบบคล่องตัว",
        scoring: { dimensions: { income_urgency: 2 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "เป็นที่รู้จักในเรื่องที่ทำ",
        scoring: {
          dimensions: { visibility_tolerance: 1, creative_production: 1 },
          types: { creator: 1 },
        },
      },
      {
        code: "c",
        label: "เป็นตัวจริงที่คนตามหา",
        scoring: { dimensions: { skill_leverage: 2 }, types: { expert: 1 } },
      },
      {
        code: "d",
        label: "มีธุรกิจ/สินทรัพย์ที่โตเองได้",
        scoring: {
          dimensions: { scale_ambition: 3 },
          types: { builder: 1 },
        },
      },
    ],
  },
  {
    code: "Q38",
    category: "merchant",
    text: "เวลาเดินห้าง/ไถฟีดขายของ คุณมักคิดว่า:",
    options: [
      {
        code: "a",
        label: "ไม่ได้สนใจเรื่องพวกนี้",
        scoring: {},
      },
      {
        code: "b",
        label: "อันนี้สวยดี อยากได้",
        scoring: { dimensions: { creative_production: 1 } },
      },
      {
        code: "c",
        label: "อันนี้ต้นทุนเท่าไร ขายต่อได้ไหม",
        scoring: { types: { merchant: 1 }, flags: ["prefer_product"] },
      },
      {
        code: "d",
        label: "ถ้าเราทำแบรนด์นี้จะต่างยังไง",
        scoring: {
          dimensions: { scale_ambition: 1 },
          types: { merchant: 1, builder: 1 },
        },
      },
    ],
  },
  {
    code: "Q39",
    category: "behavior",
    text: "เวลาเริ่มโปรเจกต์ คุณมักติดอยู่ที่ขั้นไหน?",
    options: [
      {
        code: "a",
        label: "ไม่ค่อยติด ลงมือเลย",
        scoring: { dimensions: { sales_tolerance: 1, operational_discipline: 1 } },
      },
      {
        code: "b",
        label: "ติดที่การหาลูกค้า/ขาย",
        scoring: { flags: ["block_sales"] },
      },
      {
        code: "c",
        label: "ติดที่ทำให้เสร็จสม่ำเสมอ",
        scoring: { flags: ["block_consistency"] },
      },
      {
        code: "d",
        label: "ติดที่คิดเยอะจนไม่เริ่ม",
        scoring: { flags: ["block_overthink"] },
      },
    ],
  },
  {
    code: "Q40",
    category: "preference",
    text: "คุณอยากให้รายได้มาจากอะไรมากกว่ากัน?",
    options: [
      {
        code: "a",
        label: "แรงและเวลาของฉันตอนนี้",
        scoring: { dimensions: { income_urgency: 2 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "ผลงาน/คอนเทนต์ที่ทำไว้",
        scoring: {
          dimensions: { creative_production: 1, scale_ambition: 1 },
          types: { creator: 1 },
        },
      },
      {
        code: "c",
        label: "ความเชี่ยวชาญเฉพาะตัว",
        scoring: { dimensions: { skill_leverage: 2 }, types: { expert: 1 } },
      },
      {
        code: "d",
        label: "ระบบ/สินทรัพย์ที่ทำงานแทน",
        scoring: {
          dimensions: { scale_ambition: 2, income_urgency: 0 },
          types: { builder: 1 },
        },
      },
    ],
  },
  {
    code: "Q41",
    category: "sales",
    text: "การต่อรองราคาให้ตัวเองได้เปรียบ คุณรู้สึกว่า:",
    options: [
      {
        code: "a",
        label: "อึดอัด ไม่ชอบต่อรอง",
        scoring: { dimensions: { sales_tolerance: 0 } },
      },
      {
        code: "b",
        label: "ทำได้ถ้าจำเป็น",
        scoring: { dimensions: { sales_tolerance: 1 } },
      },
      {
        code: "c",
        label: "ทำได้ดีและไม่เกรงใจเกินไป",
        scoring: { dimensions: { sales_tolerance: 2 }, types: { hunter: 1 } },
      },
      {
        code: "d",
        label: "สนุกกับเกมการเจรจา",
        scoring: {
          dimensions: { sales_tolerance: 3 },
          types: { hunter: 1, merchant: 1 },
        },
      },
    ],
  },
  {
    code: "Q42",
    category: "creative",
    text: "ถ้าให้เล่าเรื่องแบรนด์/สินค้าให้น่าสนใจ คุณ:",
    options: [
      {
        code: "a",
        label: "ทำไม่ค่อยได้",
        scoring: { dimensions: { creative_production: 0 } },
      },
      {
        code: "b",
        label: "ทำได้พอใช้",
        scoring: { dimensions: { creative_production: 1 } },
      },
      {
        code: "c",
        label: "ทำได้ดี มองมุมขายออก",
        scoring: {
          dimensions: { creative_production: 2 },
          types: { creator: 1, merchant: 1 },
        },
      },
      {
        code: "d",
        label: "เก่งมาก เปลี่ยนของธรรมดาให้มีเรื่องราว",
        scoring: {
          dimensions: { creative_production: 3 },
          types: { creator: 1, merchant: 1 },
        },
      },
    ],
  },
  {
    code: "Q43",
    category: "operation",
    text: "การมอบหมายงานให้คนอื่นทำแทน สำหรับคุณคือ:",
    options: [
      {
        code: "a",
        label: "ทำเองหมดง่ายกว่า",
        scoring: { dimensions: { operational_discipline: 1 } },
      },
      {
        code: "b",
        label: "อยากมอบแต่ยังไม่กล้าปล่อย",
        scoring: { dimensions: { operational_discipline: 1, scale_ambition: 1 } },
      },
      {
        code: "c",
        label: "ทำได้ถ้ามีขั้นตอนชัด",
        scoring: {
          dimensions: { operational_discipline: 2, scale_ambition: 1 },
          types: { operator: 1 },
        },
      },
      {
        code: "d",
        label: "ถนัด วางระบบให้ทีมทำแทนได้",
        scoring: {
          dimensions: { operational_discipline: 2, scale_ambition: 2 },
          types: { operator: 1, builder: 1 },
        },
      },
    ],
  },
  {
    code: "Q44",
    category: "ambition",
    text: "อีก 3 ปีข้างหน้า คุณอยากเป็นคนแบบไหน?",
    options: [
      {
        code: "a",
        label: "คนที่หาเงินเก่งและคล่องตัว",
        scoring: { dimensions: { income_urgency: 1 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "คนที่มีตัวตน/ฐานแฟนของตัวเอง",
        scoring: {
          dimensions: { creative_production: 1, visibility_tolerance: 1 },
          types: { creator: 1 },
        },
      },
      {
        code: "c",
        label: "ผู้เชี่ยวชาญที่คนยอมจ่ายแพง",
        scoring: { dimensions: { skill_leverage: 2 }, types: { expert: 1 } },
      },
      {
        code: "d",
        label: "เจ้าของธุรกิจที่มีทีม/ระบบ",
        scoring: {
          dimensions: { scale_ambition: 3 },
          types: { builder: 1, operator: 1 },
        },
      },
    ],
  },
  {
    code: "Q45",
    category: "behavior",
    text: "อะไรที่ทำให้คุณเลิกทำโปรเจกต์กลางคัน?",
    options: [
      {
        code: "a",
        label: "ไม่เห็นเงินเข้าเร็วพอ",
        scoring: { dimensions: { income_urgency: 2 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "เบื่อ/ไม่สนุกแล้ว",
        scoring: { dimensions: { creative_production: 1, operational_discipline: 0 } },
      },
      {
        code: "c",
        label: "งานซ้ำจนล้า",
        scoring: { dimensions: { operational_discipline: 0 } },
      },
      {
        code: "d",
        label: "ไม่ค่อยเลิก ทำจนจบตามเกณฑ์",
        scoring: {
          dimensions: { operational_discipline: 3, risk_tolerance: 1 },
        },
      },
    ],
  },
  {
    code: "Q46",
    category: "skill",
    text: "ลูกค้าในอุดมคติของคุณคือ:",
    options: [
      {
        code: "a",
        label: "ใครก็ได้ที่พร้อมจ่ายและตัดสินใจเร็ว",
        scoring: { dimensions: { sales_tolerance: 1 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "แฟนคลับที่ชอบสไตล์ของฉัน",
        scoring: { dimensions: { creative_production: 1 }, types: { creator: 1 } },
      },
      {
        code: "c",
        label: "คนที่มีปัญหาซับซ้อนให้ฉันแก้",
        scoring: { dimensions: { skill_leverage: 2 }, types: { expert: 1 } },
      },
      {
        code: "d",
        label: "ธุรกิจที่ต้องการงานต่อเนื่องเป็นระบบ",
        scoring: {
          dimensions: { operational_discipline: 1 },
          types: { operator: 1 },
          flags: ["access_business"],
        },
      },
    ],
  },
  {
    code: "Q47",
    category: "risk",
    text: "ถ้าต้องเลือกระหว่างสองงาน คุณจะเลือก:",
    options: [
      {
        code: "a",
        label: "ได้เงินน้อยแต่ชัวร์และเร็ว",
        scoring: { dimensions: { income_urgency: 2, risk_tolerance: 0 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "ได้กลาง ๆ และพอคาดเดาได้",
        scoring: { dimensions: { income_urgency: 1, risk_tolerance: 1 } },
      },
      {
        code: "c",
        label: "ได้เยอะแต่ต้องรอและเสี่ยง",
        scoring: {
          dimensions: { income_urgency: 0, risk_tolerance: 2, scale_ambition: 1 },
        },
      },
      {
        code: "d",
        label: "ได้เยอะมากถ้าสำเร็จ แม้โอกาสน้อย",
        scoring: {
          dimensions: { risk_tolerance: 3, scale_ambition: 2 },
          types: { builder: 1 },
        },
      },
    ],
  },
  {
    code: "Q48",
    category: "preference",
    text: "คำชมแบบไหนที่ทำให้คุณยิ้มที่สุด?",
    options: [
      {
        code: "a",
        label: "'ปิดการขายเก่งมาก'",
        scoring: { dimensions: { sales_tolerance: 1 }, types: { hunter: 1 } },
      },
      {
        code: "b",
        label: "'คอนเทนต์คุณโดนมาก'",
        scoring: { dimensions: { creative_production: 1 }, types: { creator: 1 } },
      },
      {
        code: "c",
        label: "'คุณเก่งเรื่องนี้จริง ๆ'",
        scoring: { dimensions: { skill_leverage: 1 }, types: { expert: 1 } },
      },
      {
        code: "d",
        label: "'งานคุณเป๊ะและไว้ใจได้'",
        scoring: { dimensions: { operational_discipline: 1 }, types: { operator: 1 } },
      },
      {
        code: "e",
        label: "'คุณสร้างอะไรที่ยิ่งใหญ่มาก'",
        scoring: {
          dimensions: { scale_ambition: 2 },
          types: { builder: 1 },
        },
      },
    ],
  },
];

/** Fast lookup: question code → question. */
export const QUESTION_BY_CODE = new Map(QUESTIONS.map((q) => [q.code, q]));
