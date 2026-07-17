/**
 * ROOTMAN MONEY ROUTE — Domain: Income Routes
 * Ten actual income routes, decoupled from Money Types.
 * Each route carries the deterministic scoring metadata used by the engine.
 */
import type { DimensionKey } from "./dimensions";
import type { MoneyTypeKey } from "./money-types";

export const ROUTE_KEYS = [
  "commission",
  "faceless_content",
  "productized_service",
  "digital_service",
  "reselling",
  "local_business",
  "digital_asset",
  "commerce_brand",
  "agency",
  "software",
] as const;

export type RouteKey = (typeof ROUTE_KEYS)[number];

/** Signal flags emitted by answer options and consumed by route rules. */
export type Flag = string;

export type RouteRole = "cashflow" | "asset" | "both";

export type IncomeRoute = {
  slug: RouteKey;
  name: string;
  category: string;
  description: string;
  incomeSpeed: "fast" | "medium" | "slow";
  role: RouteRole;
  minimumCapitalNote: string;
  /** How each dimension aligns with the route. +good when high, -good when low. */
  dimensionWeights: Partial<Record<DimensionKey, number>>;
  /** Affinity with money types, 0..1. */
  typeAffinity: Partial<Record<MoneyTypeKey, number>>;
  /** Resource/preference flags that improve fit (resource match). */
  resourceAffinity: Partial<Record<Flag, number>>;
  /** Constraint flags → penalty applied to the raw route score. */
  constraintPenalties: Partial<Record<Flag, number>>;
  /** Strategic bonus flags → small boost (capped by engine). */
  strategicBonuses: Partial<Record<Flag, number>>;
  whyItFits: string[];
  risks: string[];
};

export const INCOME_ROUTES: Record<RouteKey, IncomeRoute> = {
  commission: {
    slug: "commission",
    name: "Commission Route",
    category: "Sales / Referral",
    description:
      "Affiliate, นายหน้า, Referral, Appointment Setting, Commission Sales — หาเงินจากการปิดดีลโดยไม่ต้องมีสินค้าของตัวเอง",
    incomeSpeed: "fast",
    role: "cashflow",
    minimumCapitalNote: "เริ่มได้แทบไม่ต้องใช้ทุน",
    dimensionWeights: {
      sales_tolerance: 4,
      income_urgency: 2,
      capital_readiness: -1,
      operational_discipline: 1,
      scale_ambition: 1,
    },
    typeAffinity: { hunter: 1, merchant: 0.5, expert: 0.3 },
    resourceAffinity: {
      resource_connection: 2,
      access_business: 1.5,
      access_professional: 1,
      prefer_deal: 2,
    },
    constraintPenalties: { no_sales: 12 },
    strategicBonuses: { urgent_30d: 4, urgent_7d: 6 },
    whyItFits: [
      "ใช้เงินเริ่มต้นน้อยมาก",
      "เห็นรายได้เร็วเมื่อปิดดีลได้",
      "ไม่ต้องสร้างสินค้าเอง",
    ],
    risks: [
      "รายได้ขึ้นกับแรงและโอกาสใหม่",
      "พึ่งพาข้อเสนอของคนอื่น",
    ],
  },
  faceless_content: {
    slug: "faceless_content",
    name: "Faceless Content Route",
    category: "Content / Media",
    description:
      "TikTok/YouTube Faceless, Affiliate Content, Theme Page — สร้างคอนเทนต์โดยไม่ต้องออกหน้า",
    incomeSpeed: "medium",
    role: "both",
    minimumCapitalNote: "ทุนต่ำ เน้นเวลาและความสม่ำเสมอ",
    dimensionWeights: {
      creative_production: 4,
      operational_discipline: 2,
      visibility_tolerance: -2,
      capital_readiness: -1,
      time_availability: 1,
    },
    typeAffinity: { creator: 1, hunter: 0.4, merchant: 0.3 },
    resourceAffinity: {
      no_face: 2,
      prefer_content: 2,
      resource_time: 1,
      access_followers: 1,
    },
    constraintPenalties: {},
    strategicBonuses: { no_face: 3 },
    whyItFits: [
      "ไม่ต้องใช้ตัวตนจริง",
      "ใช้ทักษะคิด Hook ได้เต็มที่",
      "ใช้เงินเริ่มต้นไม่สูง",
    ],
    risks: [
      "ต้องรอสะสม Audience",
      "พึ่งพาอัลกอริทึมแพลตฟอร์ม",
    ],
  },
  productized_service: {
    slug: "productized_service",
    name: "Productized Service Route",
    category: "Service",
    description:
      "บริการที่กำหนด Scope ราคา และผลลัพธ์ชัดเจน เช่น แพ็กเกจตัดคลิป ทำภาพ ตั้งค่าระบบ",
    incomeSpeed: "fast",
    role: "cashflow",
    minimumCapitalNote: "ทุนต่ำ ใช้ทักษะเป็นหลัก",
    dimensionWeights: {
      skill_leverage: 4,
      income_urgency: 2,
      sales_tolerance: 2,
      operational_discipline: 2,
      capital_readiness: -1,
    },
    typeAffinity: { expert: 1, operator: 0.6, creator: 0.4 },
    resourceAffinity: {
      has_paying_skill: 2,
      has_portfolio: 2,
      prefer_service: 2,
      access_business: 1,
    },
    constraintPenalties: { no_skill: 8 },
    strategicBonuses: { urgent_30d: 3 },
    whyItFits: [
      "เปลี่ยนทักษะเป็นแพ็กเกจที่ขายซ้ำได้",
      "เห็นรายได้เร็วกว่าการสร้างสินทรัพย์",
      "ควบคุมขอบเขตงานได้",
    ],
    risks: [
      "รายได้ยังผูกกับเวลาทำงาน",
      "ต้องหาลูกค้าใหม่ต่อเนื่อง",
    ],
  },
  digital_service: {
    slug: "digital_service",
    name: "Digital Service Route",
    category: "Service / Tools",
    description:
      "รับผลิตคอนเทนต์ ทำ Catalog, Presentation, ตั้งค่า Automation หรือระบบดิจิทัลให้ธุรกิจ",
    incomeSpeed: "fast",
    role: "cashflow",
    minimumCapitalNote: "ทุนต่ำ เน้นเครื่องมือดิจิทัล",
    dimensionWeights: {
      skill_leverage: 3,
      operational_discipline: 3,
      sales_tolerance: 1,
      creative_production: 1,
      capital_readiness: -1,
    },
    typeAffinity: { operator: 1, expert: 0.7, creator: 0.4 },
    resourceAffinity: {
      has_paying_skill: 1.5,
      prefer_service: 1.5,
      prefer_system: 1.5,
      access_business: 1.5,
    },
    constraintPenalties: {},
    strategicBonuses: { urgent_30d: 3 },
    whyItFits: [
      "ใช้เครื่องมือดิจิทัลสร้างมูลค่าให้ธุรกิจ",
      "เรียนรู้เร็วและสร้างตัวอย่างงานได้",
      "ตลาดธุรกิจต้องการต่อเนื่อง",
    ],
    risks: [
      "ต้องอัปเดตเครื่องมือสม่ำเสมอ",
      "ผลลัพธ์ขึ้นกับความเข้าใจปัญหาลูกค้า",
    ],
  },
  reselling: {
    slug: "reselling",
    name: "Reselling Route",
    category: "Commerce",
    description:
      "ของมือสอง, Marketplace Arbitrage, พรีออเดอร์, สินค้าหายาก — ซื้อมาแบ่งขาย",
    incomeSpeed: "fast",
    role: "cashflow",
    minimumCapitalNote: "ต้องมีทุนหมุนบ้าง",
    dimensionWeights: {
      capital_readiness: 2,
      income_urgency: 2,
      operational_discipline: 2,
      sales_tolerance: 1,
    },
    typeAffinity: { merchant: 1, hunter: 0.6 },
    resourceAffinity: {
      resource_capital: 1.5,
      prefer_product: 2,
      access_general: 1,
    },
    constraintPenalties: { capital_low: 10 },
    strategicBonuses: { urgent_7d: 4 },
    whyItFits: [
      "เงินหมุนเร็ว",
      "ทดสอบ Demand ได้ทันที",
      "เริ่มจากของใกล้ตัวได้",
    ],
    risks: [
      "เงินอาจจมในสต็อก",
      "แข่งขันด้านราคา",
    ],
  },
  local_business: {
    slug: "local_business",
    name: "Local Business Route",
    category: "Service / B2B Local",
    description:
      "รับดูแล Google Business, ทำเมนู, คอนเทนต์, Landing Page, LINE OA, Lead Generation ให้ร้านค้า",
    incomeSpeed: "fast",
    role: "cashflow",
    minimumCapitalNote: "ทุนต่ำ เน้นการเข้าถึงร้านค้า",
    dimensionWeights: {
      sales_tolerance: 3,
      skill_leverage: 2,
      operational_discipline: 2,
      income_urgency: 1,
    },
    typeAffinity: { hunter: 0.7, operator: 0.7, expert: 0.6 },
    resourceAffinity: {
      access_local: 2.5,
      access_business: 1.5,
      prefer_service: 1,
      resource_connection: 1,
    },
    constraintPenalties: { no_sales: 8 },
    strategicBonuses: { access_local: 4 },
    whyItFits: [
      "ไม่จำเป็นต้องมีผู้ติดตาม",
      "ลูกค้าในพื้นที่เข้าถึงง่าย",
      "ปิดงานตัวต่อตัวได้",
    ],
    risks: [
      "ต้องกล้าคุยกับเจ้าของกิจการ",
      "งานกระจายตามพื้นที่",
    ],
  },
  digital_asset: {
    slug: "digital_asset",
    name: "Digital Asset Route",
    category: "Digital Product",
    description:
      "Template, Toolkit, Database, Calculator, Mini App, Digital Product — สร้างครั้งเดียวขายซ้ำ",
    incomeSpeed: "slow",
    role: "asset",
    minimumCapitalNote: "ทุนต่ำ–กลาง แต่ต้องรอผล",
    dimensionWeights: {
      creative_production: 2,
      skill_leverage: 2,
      operational_discipline: 2,
      scale_ambition: 2,
      income_urgency: -3,
    },
    typeAffinity: { builder: 0.8, creator: 0.6, expert: 0.7 },
    resourceAffinity: {
      has_paying_skill: 1,
      resource_niche: 2,
      prefer_product: 1,
      prefer_system: 1,
    },
    constraintPenalties: { urgent_7d: 18, urgent_30d: 12 },
    strategicBonuses: { resource_niche: 3 },
    whyItFits: [
      "สร้างสินทรัพย์ที่ขายซ้ำได้",
      "ขยายได้โดยไม่ผูกกับเวลา",
      "ใช้ความรู้เฉพาะให้เป็นประโยชน์",
    ],
    risks: [
      "กว่าจะเห็นรายได้ใช้เวลานาน",
      "ต้องทำการตลาดต่อเนื่อง",
    ],
  },
  commerce_brand: {
    slug: "commerce_brand",
    name: "Commerce Brand Route",
    category: "Commerce / Brand",
    description:
      "Private Label, Niche Brand, Subscription Product, Creator Commerce — สร้างแบรนด์สินค้าของตัวเอง",
    incomeSpeed: "slow",
    role: "asset",
    minimumCapitalNote: "ต้องมีทุนและยอมจัดการสินค้า",
    dimensionWeights: {
      capital_readiness: 4,
      operational_discipline: 3,
      scale_ambition: 2,
      risk_tolerance: 2,
      income_urgency: -3,
    },
    typeAffinity: { merchant: 1, builder: 0.7 },
    resourceAffinity: {
      resource_capital: 2,
      prefer_product: 2,
    },
    constraintPenalties: { capital_low: 22, urgent_30d: 15, urgent_7d: 20 },
    strategicBonuses: { capital_high: 5 },
    whyItFits: [
      "สร้างแบรนด์ที่เป็นทรัพย์สินระยะยาว",
      "มี Margin สูงกว่าการรับจ้าง",
      "ควบคุมสินค้าเองได้",
    ],
    risks: [
      "เงินจมในสต็อกและการผลิต",
      "ต้องใช้เวลาสร้างการรับรู้",
    ],
  },
  agency: {
    slug: "agency",
    name: "Agency Route",
    category: "Service / Team",
    description:
      "รวมบริการหลายอย่าง ใช้ทีมส่งมอบ รายได้ประจำจากลูกค้าองค์กร",
    incomeSpeed: "medium",
    role: "both",
    minimumCapitalNote: "ทุนกลาง ต้องบริหารทีม",
    dimensionWeights: {
      sales_tolerance: 4,
      operational_discipline: 3,
      scale_ambition: 3,
      skill_leverage: 1,
    },
    typeAffinity: { hunter: 0.8, operator: 0.7, expert: 0.6 },
    resourceAffinity: {
      has_paying_skill: 1,
      access_business: 1.5,
      access_company: 2,
      prefer_deal: 1,
    },
    constraintPenalties: { no_sales: 20 },
    strategicBonuses: {},
    whyItFits: [
      "รายได้ประจำจากลูกค้าองค์กร",
      "ขยายด้วยทีมได้",
      "รวมทักษะหลายอย่างเป็นบริการเดียว",
    ],
    risks: [
      "ต้องบริหารคนและแรงกดดันลูกค้า",
      "ต้องขายเก่งและมีระบบ",
    ],
  },
  software: {
    slug: "software",
    name: "Software Route",
    category: "Software / SaaS",
    description:
      "Micro SaaS, Vertical Software, Workflow Tool — สร้างซอฟต์แวร์ที่ขยายได้",
    incomeSpeed: "slow",
    role: "asset",
    minimumCapitalNote: "ต้องมีทักษะเทคนิคหรือ Partner",
    dimensionWeights: {
      scale_ambition: 4,
      operational_discipline: 2,
      skill_leverage: 2,
      risk_tolerance: 2,
      income_urgency: -4,
    },
    typeAffinity: { builder: 1, expert: 0.5 },
    resourceAffinity: {
      resource_niche: 2,
      prefer_system: 2.5,
    },
    constraintPenalties: { urgent_7d: 22, urgent_30d: 18, capital_low: 6 },
    strategicBonuses: { prefer_system: 4 },
    whyItFits: [
      "สินทรัพย์ที่ขยายได้สูง",
      "รายได้ต่อเนื่องแบบ Subscription",
      "เหมาะกับการคิดเชิงระบบ",
    ],
    risks: [
      "ใช้เวลานานกว่าจะมีรายได้",
      "ต้องทำ Product Discovery จริงจัง",
    ],
  },
};

export const INCOME_ROUTE_LIST: IncomeRoute[] = ROUTE_KEYS.map(
  (k) => INCOME_ROUTES[k],
);

/** Bridge routes: destination asset route → recommended cashflow bridge. */
export const BRIDGE_MAP: Partial<Record<RouteKey, RouteKey>> = {
  software: "digital_service",
  digital_asset: "productized_service",
  commerce_brand: "reselling",
  agency: "productized_service",
};
