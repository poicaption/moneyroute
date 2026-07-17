/**
 * ROOTMAN MONEY ROUTE — Domain: Scoring payload & assessment types.
 */
import type { DimensionKey } from "./dimensions";
import type { MoneyTypeKey } from "./money-types";
import type { Flag, RouteKey } from "./income-routes";

export type ScoringPayload = {
  dimensions?: Partial<Record<DimensionKey, number>>;
  types?: Partial<Record<MoneyTypeKey, number>>;
  routes?: Partial<Record<RouteKey, number>>;
  flags?: Flag[];
};

export type AssessmentOption = {
  code: string;
  label: string;
  scoring: ScoringPayload;
};

export type AssessmentQuestion = {
  code: string;
  category: string;
  text: string;
  helper?: string;
  options: AssessmentOption[];
};
