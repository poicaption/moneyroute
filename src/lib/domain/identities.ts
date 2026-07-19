/**
 * ROOTMAN MONEY ROUTE — Domain: Money Identities (16)
 *
 * Sixteen named identities presented AFTER the assessment. They are a richer,
 * human-readable layer derived deterministically from the six underlying Money
 * Types (primary + secondary). The scoring engine is unchanged — this module
 * only maps a (primaryType, secondaryType) pair to one of sixteen identities.
 *
 * Each identity belongs to a "family" (its baseType) which is also used to pick
 * the persona artwork. No AI: same pair → same identity.
 */
import type { MoneyTypeKey } from "./money-types";
import type { RouteKey } from "./income-routes";

export const IDENTITY_KEYS = [
  // Hunter family
  "closer",
  "rainmaker",
  "connector",
  // Creator family
  "storyteller",
  "magnetizer",
  "educator",
  // Expert family
  "specialist",
  "advisor",
  "mentor",
  // Operator family
  "systemizer",
  "executor",
  "orchestrator",
  // Merchant family
  "trader",
  "curator",
  // Builder family
  "architect",
  "visionary",
] as const;

export type IdentityKey = (typeof IDENTITY_KEYS)[number];

export type Identity = {
  slug: IdentityKey;
  /** English codename, e.g. "THE CLOSER". */
  name: string;
  /** Thai display name. */
  thaiName: string;
  /** The Money Type family this identity belongs to (drives persona art). */
  baseType: MoneyTypeKey;
  tagline: string;
  /** One-paragraph essence. */
  essence: string;
  /** The core internal driver. */
  coreDrive: string;
  superpowers: string[];
  watchouts: string[];
  /** Routes that fit this identity best (2–3). */
  idealRoutes: RouteKey[];
  /** Who this identity works best alongside. */
  pairsWith: string;
  motto: string;
};

export const IDENTITIES: Record<IdentityKey, Identity> = {
  // ── HUNTER family ────────────────────────────────────────────────────────
  closer: {
    slug: "closer",
    name: "THE CLOSER",
    thaiName: "นักปิดดีล",
    baseType: "hunter",
    tagline: "เห็นเงิน ปิดจบ ไม่ลังเล",
    essence:
      "คุณมีพลังเมื่อได้ลงมือขายและเห็นผลลัพธ์เร็ว กล้าทัก กล้าเสนอ และรับการปฏิเสธได้โดยไม่เสียกำลังใจ เงินสดคือเชื้อเพลิงของคุณ",
    coreDrive: "ต้องการเห็นผลลัพธ์และเงินสดเร็วที่สุด",
    superpowers: [
      "ปิดการขายและเจรจาดีลได้เฉียบ",
      "ลงมือทันทีโดยไม่รอความพร้อม 100%",
      "รับการปฏิเสธได้และกลับมาลองใหม่เร็ว",
    ],
    watchouts: [
      "เปลี่ยนสินค้า/โมเดลบ่อยเกินไปจนไม่มีอะไรสะสม",
      "ละเลยการสร้างสินทรัพย์ระยะยาว",
      "โฟกัสยอดจนมองข้ามคุณภาพ/ความสัมพันธ์",
    ],
    idealRoutes: ["commission", "productized_service", "reselling"],
    pairsWith: "จับคู่กับ THE SYSTEMIZER เพื่อเปลี่ยนดีลให้เป็นระบบที่ทำซ้ำได้",
    motto: "ปิดก่อน แล้วค่อยปรับ",
  },
  rainmaker: {
    slug: "rainmaker",
    name: "THE RAINMAKER",
    thaiName: "พ่อค้านักล่า",
    baseType: "hunter",
    tagline: "มองส่วนต่างออก ปิดดีลเป็น",
    essence:
      "คุณผสมสัญชาตญาณนักขายเข้ากับสายตาพ่อค้า มองเห็นทั้งดีมานด์และส่วนต่าง แล้วเปลี่ยนให้เป็นเงินได้เร็ว",
    coreDrive: "หาส่วนต่างและปิดให้จบเป็นกำไร",
    superpowers: [
      "จับดีมานด์และตั้งราคาได้แม่น",
      "ปิดดีลจากของที่คนอยากได้อยู่แล้ว",
      "หมุนเงินได้เร็วโดยไม่ต้องสต็อกใหญ่",
    ],
    watchouts: [
      "ไล่ตามดีลจนขาดโฟกัส",
      "ติดสงครามราคาเพราะอยากปิดให้ได้",
      "ไม่วางระบบให้ทีมทำแทน",
    ],
    idealRoutes: ["commission", "reselling", "productized_service"],
    pairsWith: "จับคู่กับ THE OPERATOR เพื่อคุมสต็อกและหลังบ้าน",
    motto: "ของดี + คนที่ใช่ = เงิน",
  },
  connector: {
    slug: "connector",
    name: "THE CONNECTOR",
    thaiName: "นักเชื่อมโอกาส",
    baseType: "hunter",
    tagline: "รู้จักคน เปิดประตูดีล",
    essence:
      "คุณปิดดีลด้วยความสัมพันธ์และการเล่าเรื่อง ไม่ใช่การกดดัน คนไว้ใจคุณและยินดีถูกแนะนำต่อ",
    coreDrive: "สร้างดีลผ่านความไว้ใจและเครือข่าย",
    superpowers: [
      "สร้างความสัมพันธ์ที่นำไปสู่ดีล",
      "เล่าเรื่องให้คนอยากซื้อโดยไม่ต้องยัด",
      "ได้ลูกค้าจากการบอกต่อ",
    ],
    watchouts: [
      "พึ่งคอนเนกชันเดิมจนไม่ขยายฐานใหม่",
      "เกรงใจจนไม่กล้าปิดการขาย",
      "ไม่เก็บระบบติดตามลูกค้า",
    ],
    idealRoutes: ["commission", "agency", "local_business"],
    pairsWith: "จับคู่กับ THE SPECIALIST เพื่อส่งมอบสิ่งที่ขายไปได้จริง",
    motto: "ดีลเริ่มจากความไว้ใจ",
  },

  // ── CREATOR family ─────────────────────────────────────────────────────────
  storyteller: {
    slug: "storyteller",
    name: "THE STORYTELLER",
    thaiName: "นักเล่าเรื่อง",
    baseType: "creator",
    tagline: "ดึงความสนใจ สร้าง Audience",
    essence:
      "คุณเปลี่ยนไอเดียเป็นคอนเทนต์ที่คนหยุดดู เข้าใจกลไก Attention และสร้างฐานผู้ติดตามได้",
    coreDrive: "สร้างความสนใจและอิทธิพลผ่านคอนเทนต์",
    superpowers: [
      "คิด Hook และหา Angle ได้ไว",
      "ผลิตคอนเทนต์ได้ต่อเนื่อง",
      "สร้างการจดจำและฐานผู้ติดตาม",
    ],
    watchouts: [
      "ผลิตเยอะแต่ไม่ผูกกับข้อเสนอที่ขายได้",
      "วัดผลด้วยยอดวิวแทน Conversion",
      "เบื่อระบบและการติดตามตัวเลข",
    ],
    idealRoutes: ["faceless_content", "digital_asset", "commerce_brand"],
    pairsWith: "จับคู่กับ THE CLOSER เพื่อเปลี่ยน Attention เป็นยอดขาย",
    motto: "ถ้าเล่าให้คนหยุดดูได้ ก็ขายได้",
  },
  magnetizer: {
    slug: "magnetizer",
    name: "THE MAGNETIZER",
    thaiName: "นักดึงดูดยอดขาย",
    baseType: "creator",
    tagline: "คอนเทนต์ที่ปิดการขายได้",
    essence:
      "คุณเป็นครีเอเตอร์ที่คิดแบบนักขาย ทุกคอนเทนต์มีเป้าหมายให้คนลงมือ ไม่ใช่แค่กดไลก์",
    coreDrive: "เปลี่ยนความสนใจให้เป็นการกระทำและรายได้",
    superpowers: [
      "ทำคอนเทนต์ที่นำไปสู่การขาย",
      "เข้าใจทั้ง Attention และ Offer",
      "ทดสอบและปรับจากตัวเลขจริง",
    ],
    watchouts: [
      "เร่งขายจนความน่าเชื่อถือหด",
      "ทำหลายอย่างพร้อมกันจนไม่ลึก",
      "ยึดสูตรเดิมจนคอนเทนต์ตัน",
    ],
    idealRoutes: ["commerce_brand", "digital_asset", "faceless_content"],
    pairsWith: "จับคู่กับ THE TRADER เพื่อจับคู่คอนเทนต์กับสินค้าที่ขายดี",
    motto: "ทุกโพสต์ต้องมีเป้าหมาย",
  },
  educator: {
    slug: "educator",
    name: "THE EDUCATOR",
    thaiName: "นักสอนสร้างศรัทธา",
    baseType: "creator",
    tagline: "ให้ความรู้ สร้างความน่าเชื่อถือ",
    essence:
      "คุณผสมความเชี่ยวชาญเข้ากับการเล่าเรื่อง สอนให้คนเข้าใจง่ายจนเขาเชื่อและยอมจ่าย",
    coreDrive: "สร้างอิทธิพลผ่านการให้ความรู้ที่ใช้ได้จริง",
    superpowers: [
      "ทำเรื่องยากให้เข้าใจง่าย",
      "สร้างความน่าเชื่อถือจากความรู้",
      "เปลี่ยนผู้ติดตามเป็นลูกค้าคอร์ส/บริการ",
    ],
    watchouts: [
      "สอนฟรีจนไม่มีข้อเสนอเก็บเงิน",
      "ลงลึกเกินจนคนทั่วไปตามไม่ทัน",
      "รอ 'พร้อม' เกินไปก่อนขาย",
    ],
    idealRoutes: ["digital_asset", "digital_service", "faceless_content"],
    pairsWith: "จับคู่กับ THE MAGNETIZER เพื่อขยายการเข้าถึง",
    motto: "สอนให้เขาเก่งขึ้น แล้วเขาจะจ่าย",
  },

  // ── EXPERT family ──────────────────────────────────────────────────────────
  specialist: {
    slug: "specialist",
    name: "THE SPECIALIST",
    thaiName: "ผู้เชี่ยวชาญเฉพาะทาง",
    baseType: "expert",
    tagline: "แก้ปัญหาที่คนยอมจ่ายแพง",
    essence:
      "คุณมีทักษะหรือความรู้ที่คนยอมจ่าย เหมาะกับข้อเสนอมูลค่าสูงที่วัดผลได้ชัด",
    coreDrive: "แก้ปัญหาเฉพาะทางให้ได้ผลลัพธ์จริง",
    superpowers: [
      "แก้ปัญหาเฉพาะทางที่คนอื่นทำไม่ได้",
      "สร้างความน่าเชื่อถือผ่านผลงาน",
      "เหมาะกับข้อเสนอราคาสูง",
    ],
    watchouts: [
      "เรียนเพิ่มตลอดแต่ไม่ขาย",
      "รายได้ผูกกับเวลาตัวเอง",
      "ทำงานเดี่ยวจนสเกลไม่ได้",
    ],
    idealRoutes: ["digital_service", "productized_service", "agency"],
    pairsWith: "จับคู่กับ THE CONNECTOR เพื่อหาลูกค้าให้เต็มคิว",
    motto: "ทักษะที่คมคือสินทรัพย์",
  },
  advisor: {
    slug: "advisor",
    name: "THE ADVISOR",
    thaiName: "ที่ปรึกษามือโปร",
    baseType: "expert",
    tagline: "ความรู้ + ปิดงานเป็นระบบ",
    essence:
      "คุณเป็นผู้เชี่ยวชาญที่ขายและส่งมอบเป็นระบบ ลูกค้าจ่ายเพราะเชื่อว่าคุณพาไปถึงผลลัพธ์ได้",
    coreDrive: "พาลูกค้าไปสู่ผลลัพธ์ด้วยความเชี่ยวชาญ",
    superpowers: [
      "แปลงความรู้เป็นข้อเสนอที่ปิดได้",
      "ส่งมอบงานอย่างเป็นระบบและตรงเวลา",
      "สร้างรีเทนเนอร์/ลูกค้าประจำ",
    ],
    watchouts: [
      "รับงานเกินจนคุณภาพตก",
      "ตั้งราคาต่ำกว่ามูลค่าที่ให้",
      "ไม่วางทีมจนติดตัวเอง",
    ],
    idealRoutes: ["productized_service", "agency", "digital_service"],
    pairsWith: "จับคู่กับ THE ORCHESTRATOR เพื่อขยายเป็นทีม",
    motto: "ขายผลลัพธ์ ไม่ใช่ชั่วโมง",
  },
  mentor: {
    slug: "mentor",
    name: "THE MENTOR",
    thaiName: "โค้ชผู้สร้างคน",
    baseType: "expert",
    tagline: "เปลี่ยนความรู้เป็นคอมมูนิตี้",
    essence:
      "คุณเป็นผู้เชี่ยวชาญที่ถ่ายทอดเก่ง สร้างศิษย์และคอมมูนิตี้ที่เติบโตไปกับคุณ",
    coreDrive: "สร้างการเปลี่ยนแปลงให้ผู้อื่นและสะสมอิทธิพล",
    superpowers: [
      "สอนและโค้ชให้คนเปลี่ยนพฤติกรรม",
      "สร้างคอมมูนิตี้ที่ภักดี",
      "ต่อยอดเป็นคอร์ส/โปรแกรมได้",
    ],
    watchouts: [
      "ทุ่มให้คนอื่นจนลืมโมเดลรายได้",
      "ขยายคอมมูนิตี้เร็วกว่าระบบดูแล",
      "หลีกเลี่ยงการตั้งราคาสูง",
    ],
    idealRoutes: ["digital_asset", "digital_service", "faceless_content"],
    pairsWith: "จับคู่กับ THE EDUCATOR เพื่อขยายการเข้าถึง",
    motto: "ความสำเร็จของศิษย์คือพอร์ตของคุณ",
  },

  // ── OPERATOR family ────────────────────────────────────────────────────────
  systemizer: {
    slug: "systemizer",
    name: "THE SYSTEMIZER",
    thaiName: "นักวางระบบ",
    baseType: "operator",
    tagline: "ทำงานหลังบ้านให้ลื่นไหล",
    essence:
      "คุณจัดการรายละเอียดและงานซ้ำได้ดี เปลี่ยนความยุ่งเหยิงให้เป็นขั้นตอนที่ทำซ้ำได้",
    coreDrive: "ทำให้ทุกอย่างเป็นระบบและวัดผลได้",
    superpowers: [
      "ทำตามระบบและ Checklist ได้เนียน",
      "จัดการงานซ้ำโดยไม่หลุด",
      "ทำให้งานหลังบ้านไหลลื่น",
    ],
    watchouts: [
      "ตั้งราคาต่ำเกินไป",
      "ซ่อนตัวหลังงานจนไม่มีใครเห็นคุณค่า",
      "ไม่สร้างข้อเสนอมูลค่าสูง",
    ],
    idealRoutes: ["digital_service", "productized_service", "software"],
    pairsWith: "จับคู่กับ THE CLOSER เพื่อดึงงานเข้ามาเต็มระบบ",
    motto: "ระบบที่ดีทำงานแทนคุณ",
  },
  executor: {
    slug: "executor",
    name: "THE EXECUTOR",
    thaiName: "นักลงมือจริง",
    baseType: "operator",
    tagline: "ปิดงานได้ทั้งขายและส่งมอบ",
    essence:
      "คุณเป็นนักปฏิบัติที่ทั้งกล้าขายและทำจริงจนจบ ไม่ทิ้งงานค้าง ลูกค้าวางใจได้",
    coreDrive: "ทำให้เกิดขึ้นจริงและจบให้ได้",
    superpowers: [
      "ลงมือและปิดงานได้จริง",
      "ทั้งเสนอขายและส่งมอบได้เอง",
      "รักษาคำสัญญาและเดดไลน์",
    ],
    watchouts: [
      "แบกทุกอย่างเองจนล้น",
      "ไม่มอบงานให้คนอื่น",
      "โฟกัสงานเฉพาะหน้าจนลืมภาพใหญ่",
    ],
    idealRoutes: ["productized_service", "local_business", "reselling"],
    pairsWith: "จับคู่กับ THE ARCHITECT เพื่อวางทิศทางระยะยาว",
    motto: "ทำให้เสร็จ ดีกว่าทำให้สมบูรณ์แบบ",
  },
  orchestrator: {
    slug: "orchestrator",
    name: "THE ORCHESTRATOR",
    thaiName: "ผู้จัดวางทีม",
    baseType: "operator",
    tagline: "ขยายงานผ่านระบบและคน",
    essence:
      "คุณคิดเชิงระบบระดับที่ประกอบคนและกระบวนการเข้าด้วยกัน เปลี่ยนงานเดี่ยวเป็นทีมที่ทำซ้ำได้",
    coreDrive: "ขยายผลผ่านระบบและทีมงาน",
    superpowers: [
      "ออกแบบกระบวนการและ SOP",
      "มอบหมายงานและคุมคุณภาพ",
      "ขยายกำลังการผลิตโดยคุณไม่ต้องทำเอง",
    ],
    watchouts: [
      "สร้างระบบก่อนมีดีมานด์จริง",
      "จ้างทีมเร็วเกินกำลังรายได้",
      "ยึดกระบวนการจนขาดความยืดหยุ่น",
    ],
    idealRoutes: ["agency", "software", "commerce_brand"],
    pairsWith: "จับคู่กับ THE ADVISOR เพื่อรับงานมูลค่าสูง",
    motto: "อย่าทำงานหนักขึ้น ให้ระบบทำแทน",
  },

  // ── MERCHANT family ────────────────────────────────────────────────────────
  trader: {
    slug: "trader",
    name: "THE TRADER",
    thaiName: "พ่อค้าหัวไว",
    baseType: "merchant",
    tagline: "มองสินค้าและ Margin ออก",
    essence:
      "คุณเข้าใจสินค้า ราคา และความต้องการ ชอบหาส่วนต่างและของที่ขายได้จริงมากกว่าทฤษฎี",
    coreDrive: "หาของที่หมุนเร็วและมีกำไร",
    superpowers: [
      "มองราคาและส่วนต่างออก",
      "จัดการ Supply และ Demand",
      "โฟกัสสิ่งที่ขายได้จริง",
    ],
    watchouts: [
      "เงินจมในสต็อก",
      "ติดสงครามราคา",
      "เลือกสินค้าจากความชอบแทนดีมานด์",
    ],
    idealRoutes: ["reselling", "commerce_brand", "commission"],
    pairsWith: "จับคู่กับ THE MAGNETIZER เพื่อสร้างดีมานด์ให้สินค้า",
    motto: "ของที่หมุนเร็ว คือของที่ดี",
  },
  curator: {
    slug: "curator",
    name: "THE CURATOR",
    thaiName: "นักคัดสรรแบรนด์",
    baseType: "merchant",
    tagline: "เลือกของเป็น เล่าแบรนด์ได้",
    essence:
      "คุณเป็นพ่อค้าที่มีรสนิยมและเล่าเรื่องแบรนด์ได้ เปลี่ยนสินค้าธรรมดาให้มีเรื่องราวที่คนอยากซื้อซ้ำ",
    coreDrive: "สร้างแบรนด์จากสินค้าที่คัดมาอย่างดี",
    superpowers: [
      "คัดสินค้าและวางคอนเซปต์แบรนด์",
      "เล่าเรื่องสินค้าให้มีมูลค่าเพิ่ม",
      "สร้างลูกค้าประจำที่ซื้อซ้ำ",
    ],
    watchouts: [
      "ทุ่มกับภาพลักษณ์ก่อนพิสูจน์ยอดขาย",
      "ออกสินค้าเยอะเกินก่อนตัวเด่นติด",
      "ลืมดูต้นทุนหาลูกค้า",
    ],
    idealRoutes: ["commerce_brand", "reselling", "digital_asset"],
    pairsWith: "จับคู่กับ THE STORYTELLER เพื่อขยายเรื่องเล่าแบรนด์",
    motto: "แบรนด์คือเหตุผลที่คนซื้อซ้ำ",
  },

  // ── BUILDER family ─────────────────────────────────────────────────────────
  architect: {
    slug: "architect",
    name: "THE ARCHITECT",
    thaiName: "สถาปนิกสินทรัพย์",
    baseType: "builder",
    tagline: "สร้างสินทรัพย์ที่ขยายได้",
    essence:
      "คุณยอมรอเพื่อสร้างระบบหรือสินทรัพย์ที่ทำงานได้โดยไม่ต้องพึ่งแรงตลอดเวลา คิดเชิงโครงสร้างและการขยาย",
    coreDrive: "สร้างสิ่งที่โตเกินแรงงานตัวเอง",
    superpowers: [
      "คิดเชิงระบบและการขยาย",
      "อดทนสร้างสินทรัพย์ระยะยาว",
      "ตั้งเป้าหมายที่ทะเยอทะยานและชัดเจน",
    ],
    watchouts: [
      "สร้างนานก่อนคุยกับตลาด",
      "Overbuild และใช้เงินก่อนมีลูกค้า",
      "มองข้าม Cashflow ระยะสั้น",
    ],
    idealRoutes: ["software", "digital_asset", "commerce_brand"],
    pairsWith: "จับคู่กับ THE CLOSER เพื่อสร้าง Cashflow ระหว่างสร้างสินทรัพย์",
    motto: "สร้างครั้งเดียว ให้มันทำงานตลอด",
  },
  visionary: {
    slug: "visionary",
    name: "THE VISIONARY",
    thaiName: "นักสร้างอนาคต",
    baseType: "builder",
    tagline: "เห็นภาพใหญ่ ดึงคนตามได้",
    essence:
      "คุณผสมวิสัยทัศน์ระยะยาวเข้ากับการเล่าเรื่อง/ความเชี่ยวชาญ ทำให้คนเชื่อในสิ่งที่คุณกำลังสร้าง",
    coreDrive: "สร้างสิ่งใหม่ที่เปลี่ยนเกมและดึงคนให้ร่วมทาง",
    superpowers: [
      "มองเห็นโอกาสก่อนคนอื่น",
      "เล่าวิสัยทัศน์ให้คนอยากร่วม",
      "รวมทีม/ทุน/ผู้ใช้รอบไอเดีย",
    ],
    watchouts: [
      "ไล่ตามไอเดียใหม่จนไม่จบสักอัน",
      "ประเมินเวลาถึงรายได้ต่ำเกินจริง",
      "ละเลยรายละเอียดการส่งมอบ",
    ],
    idealRoutes: ["software", "commerce_brand", "digital_asset"],
    pairsWith: "จับคู่กับ THE SYSTEMIZER เพื่อเปลี่ยนวิสัยทัศน์ให้เป็นระบบ",
    motto: "เริ่มจากภาพที่คนอื่นยังไม่เห็น",
  },
};

export const IDENTITY_LIST: Identity[] = IDENTITY_KEYS.map((k) => IDENTITIES[k]);

/**
 * Deterministically resolve one of the sixteen identities from the primary and
 * secondary Money Types. Every (primary, secondary) pair maps to exactly one
 * identity, so the same snapshot always yields the same identity.
 */
export function resolveIdentityKey(
  primary: MoneyTypeKey,
  secondary: MoneyTypeKey,
): IdentityKey {
  switch (primary) {
    case "hunter":
      if (secondary === "merchant") return "rainmaker";
      if (secondary === "creator" || secondary === "expert") return "connector";
      return "closer";
    case "creator":
      if (secondary === "hunter" || secondary === "merchant")
        return "magnetizer";
      if (secondary === "expert" || secondary === "operator") return "educator";
      return "storyteller";
    case "expert":
      if (secondary === "hunter" || secondary === "operator") return "advisor";
      if (secondary === "creator") return "mentor";
      return "specialist";
    case "operator":
      if (secondary === "hunter" || secondary === "merchant") return "executor";
      if (secondary === "builder") return "orchestrator";
      return "systemizer";
    case "merchant":
      if (secondary === "creator" || secondary === "expert") return "curator";
      return "trader";
    case "builder":
      if (secondary === "creator" || secondary === "expert") return "visionary";
      return "architect";
    default:
      return "closer";
  }
}

/** Convenience: resolve the full Identity object. */
export function resolveIdentity(
  primary: MoneyTypeKey,
  secondary: MoneyTypeKey,
): Identity {
  return IDENTITIES[resolveIdentityKey(primary, secondary)];
}
