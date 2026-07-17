/**
 * ROOTMAN MONEY ROUTE — Deterministic Report Engine (report-v1)
 *
 * Composes the full paid report (10 sections) purely from a ScoreSnapshot and
 * static content templates. No AI. Same snapshot always yields the same report.
 * The output is validated with Zod before it is persisted or rendered.
 */
import { z } from "zod";
import {
  DIMENSIONS,
  DIMENSION_KEYS,
  type DimensionKey,
} from "./dimensions";
import { MONEY_TYPES } from "./money-types";
import { INCOME_ROUTES, type RouteKey } from "./income-routes";
import { ROUTE_CONTENT } from "./report-content";
import type { ScoreSnapshot, RouteMatch } from "./scoring";
import {
  type PersonalizationProfile,
  GOAL_LABEL,
  BLOCKER_LABEL,
  BLOCKER_COACHING,
  derivePace,
  PACE_LABEL,
  dailyActionMinutes,
  suggestedPriceBand,
  customersForTarget,
  type Pace,
} from "./personalization";

export const REPORT_VERSION = "report-v1";
/** Content template version — bump when template content changes. */
export const TEMPLATE_VERSION = "template-v2";

/** Human-readable labels for constraint flags used in penalties/diagnosis. */
const FLAG_LABELS: Record<string, string> = {
  urgent_7d: "ต้องการรายได้เร็วมาก (ภายใน 7 วัน)",
  urgent_30d: "ต้องการรายได้เร็ว (ภายใน 30 วัน)",
  capital_low: "ทุนที่พร้อมเสียได้ยังต่ำ",
  no_sales: "ยังไม่พร้อมทักหา/เสนอขายลูกค้า",
  no_skill: "ยังไม่มีทักษะที่ขายได้ทันที",
  no_face: "ไม่ต้องการออกหน้า/ใช้ตัวตนจริง",
};

function flagLabel(flag: string): string {
  return FLAG_LABELS[flag] ?? flag;
}

// ── Zod schema ──────────────────────────────────────────────────────────────

const RouteRefSchema = z.object({
  slug: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  incomeSpeed: z.enum(["fast", "medium", "slow"]),
  minimumCapitalNote: z.string(),
  matchScore: z.number(),
  rank: z.number(),
  whyItFits: z.array(z.string()),
  risks: z.array(z.string()),
});

const OfferSchema = z.object({
  whatToSell: z.string(),
  scope: z.string(),
  priceRangeTHB: z.tuple([z.number(), z.number()]),
  audience: z.string(),
  deliverables: z.array(z.string()),
  proofToBuild: z.array(z.string()),
});

const RoadmapPhaseSchema = z.object({
  phase: z.string(),
  days: z.string(),
  focus: z.string(),
});

export const ReportSchema = z.object({
  reportVersion: z.string(),
  templateVersion: z.string(),
  scoringVersion: z.string(),
  assessmentVersion: z.string(),
  executiveDiagnosis: z.object({
    whoYouAre: z.string(),
    edges: z.array(z.string()),
    constraints: z.array(z.string()),
    startHere: z.string(),
    avoid: z.string(),
  }),
  moneyPattern: z.object({
    type: z.string(),
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    behaviors: z.array(z.string()),
  }),
  primaryRoute: RouteRefSchema,
  secondaryRoutes: z.array(RouteRefSchema),
  antiRoutes: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
      reason: z.string(),
    }),
  ),
  firstOffer: OfferSchema,
  firstCustomerPlan: z.object({
    whereToFind: z.array(z.string()),
    channels: z.array(z.string()),
    outreachScript: z.string(),
    followUp: z.string(),
    successMetric: z.string(),
  }),
  sevenDayExperiment: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      instructions: z.string(),
    }),
  ),
  thirtyDayRoadmap: z.array(RoadmapPhaseSchema),
  stopRules: z.array(z.string()),
  bridgeNote: z.string().nullable(),
  personalization: z
    .object({
      goal: z.string(),
      goalLabel: z.string(),
      monthlyTargetThb: z.number(),
      hoursPerWeek: z.number(),
      pace: z.enum(["sprint", "steady", "gentle"]),
      paceLabel: z.string(),
      dailyMinutes: z.number(),
      priceBand: z.tuple([z.number(), z.number()]),
      customersNeeded: z.number(),
      blocker: z.string(),
      blockerLabel: z.string(),
      blockerCoaching: z.object({ title: z.string(), body: z.string() }),
      summary: z.string(),
      weeklyPlan: z.array(z.string()),
      milestones: z.array(z.object({ label: z.string(), target: z.string() })),
    })
    .nullable(),
});

export type Report = z.infer<typeof ReportSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────

function routeRef(match: RouteMatch): z.infer<typeof RouteRefSchema> {
  const r = INCOME_ROUTES[match.route];
  return {
    slug: r.slug,
    name: r.name,
    category: r.category,
    description: r.description,
    incomeSpeed: r.incomeSpeed,
    minimumCapitalNote: r.minimumCapitalNote,
    matchScore: match.normalizedScore,
    rank: match.rank,
    whyItFits: r.whyItFits,
    risks: r.risks,
  };
}

/** Dimension keys sorted by score, highest first (stable by declared order). */
function sortedDimensions(snapshot: ScoreSnapshot): DimensionKey[] {
  return [...DIMENSION_KEYS].sort((a, b) => {
    const diff = snapshot.dimensionScores[b] - snapshot.dimensionScores[a];
    if (diff !== 0) return diff;
    return DIMENSION_KEYS.indexOf(a) - DIMENSION_KEYS.indexOf(b);
  });
}

function roadmapForRoute(routeName: string): z.infer<typeof RoadmapPhaseSchema>[] {
  return [
    {
      phase: "Validate",
      days: "วัน 1–7",
      focus: `ยืนยันว่ามีคนต้องการข้อเสนอของ ${routeName} จริง ผ่านการทดลอง 7 วัน`,
    },
    {
      phase: "Build",
      days: "วัน 8–14",
      focus: "สร้างข้อเสนอ/สินทรัพย์เวอร์ชันแรกให้พร้อมส่งมอบ และเตรียมช่องทาง",
    },
    {
      phase: "Publish",
      days: "วัน 15–21",
      focus: "เปิดตัวต่อกลุ่มเป้าหมายอย่างสม่ำเสมอ และเก็บผลตอบรับ",
    },
    {
      phase: "Sell",
      days: "วัน 22–27",
      focus: "โฟกัสการปิดลูกค้า/ยอดขายจริง ปรับข้อเสนอจากสิ่งที่เรียนรู้",
    },
    {
      phase: "Review",
      days: "วัน 28–30",
      focus: "สรุปตัวเลข ตัดสินใจว่าจะขยาย ปรับ หรือหยุดตาม Stop Rules",
    },
  ];
}

// ── Engine ──────────────────────────────────────────────────────────────────

type PersonalizationBlock = NonNullable<Report["personalization"]>;

/** A pace-appropriate weekly cadence for the customer. */
function weeklyPlanForPace(pace: Pace, minutes: number): string[] {
  const block = `${minutes} นาที/วัน`;
  if (pace === "sprint") {
    return [
      `จันทร์–ศุกร์: ลงมือทำงานหลัก ${block} เน้นหาลูกค้า/สร้างผลงาน`,
      "เสาร์: รวบงาน batch + เตรียมของสัปดาห์หน้า",
      "อาทิตย์: รีวิวตัวเลข + วางแผน 3 งานสำคัญของสัปดาห์ถัดไป",
    ];
  }
  if (pace === "steady") {
    return [
      `4–5 วัน/สัปดาห์: ทำงานหลัก ${block} สลับระหว่างหาลูกค้าและส่งมอบ`,
      "1 วัน/สัปดาห์: รวบงาน batch (เตรียมคอนเทนต์/เทมเพลต)",
      "ปลายสัปดาห์: รีวิวตัวเลขสั้น ๆ แล้วเลือก 3 งานของสัปดาห์หน้า",
    ];
  }
  return [
    `3 วัน/สัปดาห์: โฟกัสงานเดียวที่ขยับรายได้ ${block}`,
    "เลือกทำเฉพาะงานที่ให้ผลตอบแทนต่อเวลาสูงสุด ตัดที่เหลือทิ้ง",
    "สุดสัปดาห์: เช็กความคืบหน้า 10 นาที แล้วตั้งเป้าเล็กของสัปดาห์หน้า",
  ];
}

/** Concrete progress milestones toward the income target. */
function milestonesForTarget(
  monthlyTargetThb: number,
): PersonalizationBlock["milestones"] {
  if (monthlyTargetThb <= 0) {
    return [
      { label: "ก้าวแรก", target: "ได้ลูกค้าจ่ายจริงรายแรก" },
      { label: "พิสูจน์", target: "ทำซ้ำให้ได้ลูกค้ารายที่ 2–3" },
      { label: "ตั้งหลัก", target: "มีรายได้เข้าสม่ำเสมอทุกสัปดาห์" },
    ];
  }
  const quarter = Math.max(1000, Math.round((monthlyTargetThb * 0.25) / 100) * 100);
  const half = Math.max(2000, Math.round((monthlyTargetThb * 0.5) / 100) * 100);
  return [
    { label: "ก้าวแรก", target: "ได้ลูกค้าจ่ายจริงรายแรก" },
    {
      label: "25% ของเป้า",
      target: `ทำรายได้แตะ ${quarter.toLocaleString("th-TH")} บาท/เดือน`,
    },
    {
      label: "ครึ่งทาง",
      target: `ทำรายได้แตะ ${half.toLocaleString("th-TH")} บาท/เดือน`,
    },
    {
      label: "ถึงเป้า",
      target: `ทำรายได้ ${monthlyTargetThb.toLocaleString("th-TH")} บาท/เดือนได้สม่ำเสมอ`,
    },
  ];
}

/** Compose the personalization block and adjust the offer price band in place. */
function buildPersonalization(
  profile: PersonalizationProfile,
  offer: z.infer<typeof OfferSchema>,
  primaryTypeName: string,
): { block: PersonalizationBlock; priceBand: [number, number] } {
  const pace = derivePace(profile.hoursPerWeek);
  const minutes = dailyActionMinutes(profile.hoursPerWeek);
  const priceBand = suggestedPriceBand(offer.priceRangeTHB, profile);
  const avgPrice = Math.round((priceBand[0] + priceBand[1]) / 2);
  const customersNeeded = customersForTarget(profile.monthlyTargetThb, avgPrice);
  const coaching = BLOCKER_COACHING[profile.blocker];

  const nicheNote = profile.nicheText.trim()
    ? ` โดยดึงจุดแข็งที่คุณบอกไว้ ("${profile.nicheText.trim()}") มาเป็นมุมที่ทำให้คุณต่างจากคนอื่น`
    : "";

  const targetLine =
    profile.monthlyTargetThb > 0
      ? `เป้า ${profile.monthlyTargetThb.toLocaleString("th-TH")} บาท/เดือน แปลว่าคุณต้องปิดลูกค้าประมาณ ${customersNeeded} รายต่อเดือน ที่ราคาเฉลี่ย ${avgPrice.toLocaleString("th-TH")} บาท`
      : "โฟกัสที่การได้ลูกค้าจ่ายจริงรายแรกก่อน แล้วค่อยตั้งเป้าตัวเลข";

  const summary =
    `ในฐานะ ${primaryTypeName} ที่ตั้งเป้า "${GOAL_LABEL[profile.goal]}" ` +
    `และมีเวลาราว ${profile.hoursPerWeek} ชม./สัปดาห์ เราปรับแผนให้เป็น${PACE_LABEL[pace]} ` +
    `ทำได้จริงวันละ ${minutes} นาที. ${targetLine}.${nicheNote}`;

  return {
    block: {
      goal: profile.goal,
      goalLabel: GOAL_LABEL[profile.goal],
      monthlyTargetThb: profile.monthlyTargetThb,
      hoursPerWeek: profile.hoursPerWeek,
      pace,
      paceLabel: PACE_LABEL[pace],
      dailyMinutes: minutes,
      priceBand,
      customersNeeded,
      blocker: profile.blocker,
      blockerLabel: BLOCKER_LABEL[profile.blocker],
      blockerCoaching: coaching,
      summary,
      weeklyPlan: weeklyPlanForPace(pace, minutes),
      milestones: milestonesForTarget(profile.monthlyTargetThb),
    },
    priceBand,
  };
}

/**
 * Build the full deterministic report from a score snapshot.
 * When a personalization profile is supplied, the report is tailored (offer
 * price band, pace, blocker coaching, milestones) to the customer's situation.
 * Throws (via Zod) if the composed structure is somehow invalid.
 */
export function buildReport(
  snapshot: ScoreSnapshot,
  profile?: PersonalizationProfile | null,
): Report {
  const matches = snapshot.routeMatches;
  const primaryMatch = matches[0];
  const primaryRouteKey = primaryMatch.route as RouteKey;
  const content = ROUTE_CONTENT[primaryRouteKey];

  const primaryType = MONEY_TYPES[snapshot.primaryType];
  const antiTypeMoney = MONEY_TYPES[snapshot.antiType];

  // Diagnosis: top/bottom dimensions + type traits + constraints.
  const dims = sortedDimensions(snapshot);
  const topDims = dims.slice(0, 3);
  const bottomDims = dims.slice(-2);

  const edges = [
    ...topDims.map(
      (d) => `${DIMENSIONS[d].label} สูง — ${DIMENSIONS[d].shortLabel}`,
    ),
    ...primaryType.strengths.slice(0, 1),
  ];

  const constraints = [
    ...bottomDims.map(
      (d) => `${DIMENSIONS[d].label} ยังต่ำ — ${DIMENSIONS[d].shortLabel}`,
    ),
    ...snapshot.constraintFlags
      .filter((f) => FLAG_LABELS[f])
      .map((f) => flagLabel(f)),
  ];

  // Anti-routes: two lowest-ranked routes, with a reason from their risks
  // and any constraint flag that penalized them.
  const antiRoutes = matches
    .slice(-2)
    .reverse()
    .map((m) => {
      const r = INCOME_ROUTES[m.route];
      const penalizingFlags = Object.keys(r.constraintPenalties).filter((f) =>
        snapshot.constraintFlags.includes(f),
      );
      const reasonParts: string[] = [];
      if (penalizingFlags.length > 0) {
        reasonParts.push(
          `ไม่เหมาะกับตอนนี้เพราะ ${penalizingFlags
            .map((f) => flagLabel(f))
            .join(", ")}`,
        );
      } else {
        reasonParts.push(`คะแนนความเข้ากันต่ำ (${m.normalizedScore}/100)`);
      }
      if (r.risks[0]) reasonParts.push(r.risks[0]);
      return {
        slug: r.slug,
        name: r.name,
        reason: reasonParts.join(" — "),
      };
    });

  const primaryRoute = routeRef(primaryMatch);
  const secondaryRoutes = matches.slice(1, 3).map(routeRef);

  const bridgeNote =
    snapshot.bridgeRoute && snapshot.bridgeRoute !== primaryRouteKey
      ? `เส้นทางหลักของคุณ (${primaryRoute.name}) ให้ผลช้า และคุณต้องการรายได้เร็ว ` +
        `ระหว่างสร้าง แนะนำใช้ ${INCOME_ROUTES[snapshot.bridgeRoute].name} เป็น Bridge Route ` +
        `เพื่อสร้างกระแสเงินสดหล่อเลี้ยงระหว่างทาง`
      : null;

  // Personalization (optional): tailors the offer price band and adds a
  // pace/blocker/milestone block derived purely from the intake profile.
  let firstOffer = content.offer;
  let personalization: Report["personalization"] = null;
  if (profile) {
    const built = buildPersonalization(profile, content.offer, primaryType.name);
    personalization = built.block;
    firstOffer = { ...content.offer, priceRangeTHB: built.priceBand };
  }

  const report: Report = {
    reportVersion: REPORT_VERSION,
    templateVersion: TEMPLATE_VERSION,
    scoringVersion: snapshot.scoringVersion,
    assessmentVersion: snapshot.assessmentVersion,
    executiveDiagnosis: {
      whoYouAre: `ในเกมเงิน คุณคือ ${primaryType.name} — ${primaryType.tagline}. ${primaryType.shortDescription}`,
      edges,
      constraints,
      startHere: `เริ่มที่ ${primaryRoute.name}: ${primaryRoute.description}`,
      avoid: `ยังไม่ควรเริ่ม ${antiRoutes[0]?.name ?? "-"} — ${antiRoutes[0]?.reason ?? ""}`,
    },
    moneyPattern: {
      type: primaryType.slug,
      name: primaryType.name,
      tagline: primaryType.tagline,
      description: primaryType.shortDescription,
      strengths: primaryType.strengths,
      weaknesses: primaryType.weaknesses,
      behaviors: primaryType.recommendedBehaviors,
    },
    primaryRoute,
    secondaryRoutes,
    antiRoutes,
    firstOffer,
    firstCustomerPlan: content.customerPlan,
    sevenDayExperiment: content.sevenDayExperiment,
    thirtyDayRoadmap: roadmapForRoute(primaryRoute.name),
    stopRules: content.stopRules,
    bridgeNote,
    personalization,
  };
  report.executiveDiagnosis.avoid += antiTypeMoney
    ? ` (จุดอ่อนที่ต้องระวัง: ${antiTypeMoney.weaknesses[0]})`
    : "";

  return ReportSchema.parse(report);
}
