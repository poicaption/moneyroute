/**
 * ROOTMAN MONEY ROUTE — Deterministic Scoring Engine (v1)
 *
 * Given a set of assessment answers, produces a fully reproducible score
 * snapshot: normalized dimension scores, money-type scores, ranked routes,
 * constraint flags, and cashflow/asset/bridge route selection.
 *
 * No AI is involved. Same answers always yield the same snapshot.
 */
import { clamp } from "@/lib/utils";
import {
  DIMENSION_KEYS,
  type DimensionKey,
  type DimensionScores,
} from "./dimensions";
import {
  MONEY_TYPE_KEYS,
  type MoneyTypeKey,
  type MoneyTypeScores,
} from "./money-types";
import {
  INCOME_ROUTES,
  ROUTE_KEYS,
  type Flag,
  type RouteKey,
  BRIDGE_MAP,
} from "./income-routes";
import { QUESTIONS, QUESTION_BY_CODE, ASSESSMENT_VERSION } from "./questions";

export const SCORING_VERSION = "score-v1";

/** answers: question code -> selected option code */
export type AnswerMap = Record<string, string>;

export type RouteMatch = {
  route: RouteKey;
  rawScore: number;
  normalizedScore: number;
  rank: number;
  factors: {
    dimensionMatch: number;
    typeMatch: number;
    resourceMatch: number;
    constraintPenalty: number;
    strategicBonus: number;
  };
};

export type ScoreSnapshot = {
  assessmentVersion: string;
  scoringVersion: string;
  dimensionScores: DimensionScores;
  typeScores: MoneyTypeScores;
  routeMatches: RouteMatch[];
  constraintFlags: Flag[];
  primaryType: MoneyTypeKey;
  secondaryType: MoneyTypeKey;
  antiType: MoneyTypeKey;
  cashflowRoute: RouteKey;
  assetRoute: RouteKey;
  bridgeRoute: RouteKey | null;
};

/** Characteristic dimension signature for each money type. */
const TYPE_DIMENSION_SIGNATURE: Record<
  MoneyTypeKey,
  Partial<Record<DimensionKey, number>>
> = {
  hunter: { sales_tolerance: 3, income_urgency: 2, operational_discipline: -1 },
  creator: { creative_production: 3, visibility_tolerance: 1 },
  expert: { skill_leverage: 3, operational_discipline: 1 },
  operator: {
    operational_discipline: 3,
    skill_leverage: 1,
    creative_production: -1,
  },
  merchant: {
    capital_readiness: 1,
    sales_tolerance: 1,
    income_urgency: 1,
    operational_discipline: 1,
  },
  builder: {
    scale_ambition: 3,
    income_urgency: -2,
    operational_discipline: 1,
  },
};

type Bounds = { min: number; max: number };

/** Per-dimension min/max achievable totals across the question set. */
function computeDimensionBounds(): Record<DimensionKey, Bounds> {
  const bounds = {} as Record<DimensionKey, Bounds>;
  for (const dim of DIMENSION_KEYS) bounds[dim] = { min: 0, max: 0 };

  for (const q of QUESTIONS) {
    for (const dim of DIMENSION_KEYS) {
      const deltas = q.options.map((o) => o.scoring.dimensions?.[dim] ?? 0);
      bounds[dim].min += Math.min(...deltas, 0);
      bounds[dim].max += Math.max(...deltas, 0);
    }
  }
  return bounds;
}

/** Max achievable explicit type points per type across the question set. */
function computeTypeMax(): Record<MoneyTypeKey, number> {
  const max = {} as Record<MoneyTypeKey, number>;
  for (const t of MONEY_TYPE_KEYS) max[t] = 0;
  for (const q of QUESTIONS) {
    for (const t of MONEY_TYPE_KEYS) {
      const deltas = q.options.map((o) => o.scoring.types?.[t] ?? 0);
      max[t] += Math.max(...deltas, 0);
    }
  }
  return max;
}

const DIMENSION_BOUNDS = computeDimensionBounds();
const TYPE_MAX = computeTypeMax();

/**
 * Weighted alignment of a dimension profile (0..1).
 * Positive weight = higher dimension is better; negative = lower is better.
 */
function weightedDimensionMatch(
  weights: Partial<Record<DimensionKey, number>>,
  dims: DimensionScores,
): number {
  let score = 0;
  let absSum = 0;
  let negSum = 0;
  for (const [key, w] of Object.entries(weights) as [DimensionKey, number][]) {
    if (!w) continue;
    absSum += Math.abs(w);
    if (w < 0) negSum += w;
    score += w * (dims[key] / 100);
  }
  if (absSum === 0) return 0.5;
  return clamp((score - negSum) / absSum, 0, 1);
}

function pickHighest<K extends string>(
  scores: Record<K, number>,
  keys: readonly K[],
): K {
  return keys.reduce((best, k) => (scores[k] > scores[best] ? k : best), keys[0]);
}

function pickLowest<K extends string>(
  scores: Record<K, number>,
  keys: readonly K[],
): K {
  return keys.reduce((best, k) => (scores[k] < scores[best] ? k : best), keys[0]);
}

/**
 * Compute a full, immutable score snapshot from an answer map.
 * Unanswered questions are simply skipped (treated as neutral).
 */
export function computeScores(answers: AnswerMap): ScoreSnapshot {
  // 1. Aggregate raw dimension/type points and collect flags.
  const dimRaw = {} as Record<DimensionKey, number>;
  for (const d of DIMENSION_KEYS) dimRaw[d] = 0;
  const typeRaw = {} as Record<MoneyTypeKey, number>;
  for (const t of MONEY_TYPE_KEYS) typeRaw[t] = 0;
  const flags = new Set<Flag>();

  for (const [qCode, optCode] of Object.entries(answers)) {
    const q = QUESTION_BY_CODE.get(qCode);
    if (!q) continue;
    const opt = q.options.find((o) => o.code === optCode);
    if (!opt) continue;
    const { dimensions, types, flags: optFlags } = opt.scoring;
    if (dimensions)
      for (const [k, v] of Object.entries(dimensions) as [
        DimensionKey,
        number,
      ][])
        dimRaw[k] += v;
    if (types)
      for (const [k, v] of Object.entries(types) as [MoneyTypeKey, number][])
        typeRaw[k] += v;
    if (optFlags) optFlags.forEach((f) => flags.add(f));
  }

  // 2. Normalize dimensions to 0..100.
  const dimensionScores = {} as DimensionScores;
  for (const dim of DIMENSION_KEYS) {
    const { min, max } = DIMENSION_BOUNDS[dim];
    dimensionScores[dim] =
      max === min ? 50 : Math.round(((dimRaw[dim] - min) / (max - min)) * 100);
  }

  // 3. Money type scores: blend dimension signature match with explicit points.
  const typeScores = {} as MoneyTypeScores;
  for (const t of MONEY_TYPE_KEYS) {
    const dimMatch = weightedDimensionMatch(
      TYPE_DIMENSION_SIGNATURE[t],
      dimensionScores,
    ); // 0..1
    const explicit = TYPE_MAX[t] > 0 ? clamp(typeRaw[t] / TYPE_MAX[t], 0, 1) : 0;
    const blended = TYPE_MAX[t] > 0 ? 0.6 * dimMatch + 0.4 * explicit : dimMatch;
    typeScores[t] = Math.round(blended * 100);
  }

  // 4. Route scoring.
  const flagList = [...flags];
  const matches: RouteMatch[] = ROUTE_KEYS.map((key) => {
    const route = INCOME_ROUTES[key];

    const dimensionMatch =
      weightedDimensionMatch(route.dimensionWeights, dimensionScores) * 50;

    // Type match (0..20): affinity-weighted average of type scores.
    let affWeight = 0;
    let affScore = 0;
    for (const [t, aff] of Object.entries(route.typeAffinity) as [
      MoneyTypeKey,
      number,
    ][]) {
      const a = aff ?? 0;
      affWeight += a;
      affScore += a * (typeScores[t] / 100);
    }
    const typeMatch = affWeight > 0 ? (affScore / affWeight) * 20 : 10;

    // Resource match (0..20): share of matched resource affinity.
    let resTotal = 0;
    let resMatched = 0;
    for (const [flag, weight] of Object.entries(route.resourceAffinity)) {
      const w = weight ?? 0;
      resTotal += w;
      if (flags.has(flag)) resMatched += w;
    }
    const resourceMatch = resTotal > 0 ? (resMatched / resTotal) * 20 : 10;

    // Constraint penalty (capped at 30).
    let constraintPenalty = 0;
    for (const [flag, p] of Object.entries(route.constraintPenalties))
      if (flags.has(flag)) constraintPenalty += p ?? 0;
    constraintPenalty = Math.min(constraintPenalty, 30);

    // Strategic bonus (capped at 10).
    let strategicBonus = 0;
    for (const [flag, b] of Object.entries(route.strategicBonuses))
      if (flags.has(flag)) strategicBonus += b ?? 0;
    strategicBonus = Math.min(strategicBonus, 10);

    const rawScore =
      dimensionMatch +
      typeMatch +
      resourceMatch -
      constraintPenalty +
      strategicBonus;

    return {
      route: key,
      rawScore,
      normalizedScore: Math.round(clamp(rawScore, 0, 100)),
      rank: 0,
      factors: {
        dimensionMatch: Math.round(dimensionMatch),
        typeMatch: Math.round(typeMatch),
        resourceMatch: Math.round(resourceMatch),
        constraintPenalty: Math.round(constraintPenalty),
        strategicBonus: Math.round(strategicBonus),
      },
    };
  });

  // Rank (stable: higher score first, then declared route order).
  matches.sort((a, b) => {
    if (b.normalizedScore !== a.normalizedScore)
      return b.normalizedScore - a.normalizedScore;
    return ROUTE_KEYS.indexOf(a.route) - ROUTE_KEYS.indexOf(b.route);
  });
  matches.forEach((m, i) => (m.rank = i + 1));

  // 5. Types & routes selection.
  const primaryType = pickHighest(typeScores, MONEY_TYPE_KEYS);
  const secondaryType = pickHighest(
    typeScores,
    MONEY_TYPE_KEYS.filter((t) => t !== primaryType),
  );
  const antiType = pickLowest(typeScores, MONEY_TYPE_KEYS);

  const cashflowRoute =
    matches.find(
      (m) =>
        INCOME_ROUTES[m.route].role !== "asset" &&
        INCOME_ROUTES[m.route].incomeSpeed !== "slow",
    )?.route ??
    matches.find((m) => INCOME_ROUTES[m.route].role !== "asset")?.route ??
    matches[0].route;

  const assetRoute =
    matches.find((m) => INCOME_ROUTES[m.route].role !== "cashflow")?.route ??
    matches[0].route;

  // 6. Bridge route: when the top route is a slow asset and the user is urgent.
  const topRoute = matches[0].route;
  const urgent =
    flags.has("urgent_7d") ||
    flags.has("urgent_30d") ||
    dimensionScores.income_urgency >= 60;
  let bridgeRoute: RouteKey | null = null;
  if (urgent && INCOME_ROUTES[topRoute].incomeSpeed === "slow") {
    bridgeRoute = BRIDGE_MAP[topRoute] ?? cashflowRoute;
    if (bridgeRoute === topRoute) bridgeRoute = cashflowRoute;
  }

  return {
    assessmentVersion: ASSESSMENT_VERSION,
    scoringVersion: SCORING_VERSION,
    dimensionScores,
    typeScores,
    routeMatches: matches,
    constraintFlags: flagList,
    primaryType,
    secondaryType,
    antiType,
    cashflowRoute,
    assetRoute,
    bridgeRoute,
  };
}
