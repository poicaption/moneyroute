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

export const REPORT_VERSION = "report-v1";
/** Content template version — bump when template content changes. */
export const TEMPLATE_VERSION = "template-v1";

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

/**
 * Build the full deterministic report from a score snapshot.
 * Throws (via Zod) if the composed structure is somehow invalid.
 */
export function buildReport(snapshot: ScoreSnapshot): Report {
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
    firstOffer: content.offer,
    firstCustomerPlan: content.customerPlan,
    sevenDayExperiment: content.sevenDayExperiment,
    thirtyDayRoadmap: roadmapForRoute(primaryRoute.name),
    stopRules: content.stopRules,
    bridgeNote,
  };

  // Anti-type trait is used to enrich the "avoid" narrative deterministically.
  report.executiveDiagnosis.avoid += antiTypeMoney
    ? ` (จุดอ่อนที่ต้องระวัง: ${antiTypeMoney.weaknesses[0]})`
    : "";

  return ReportSchema.parse(report);
}
