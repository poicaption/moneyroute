import { describe, it, expect } from "vitest";
import { computeScores } from "@/lib/domain/scoring";
import { buildReport, ReportSchema, REPORT_VERSION } from "@/lib/domain/report";
import { ROUTE_CONTENT } from "@/lib/domain/report-content";
import { ROUTE_KEYS, INCOME_ROUTES } from "@/lib/domain/income-routes";
import { QUESTIONS } from "@/lib/domain/questions";

/** Build an answer map by choosing option index n (clamped) per question. */
function pick(index: number) {
  const answers: Record<string, string> = {};
  for (const q of QUESTIONS) {
    const opt = q.options[Math.min(index, q.options.length - 1)];
    answers[q.code] = opt.code;
  }
  return answers;
}

describe("report content templates", () => {
  it("has content for every income route", () => {
    for (const key of ROUTE_KEYS) {
      const c = ROUTE_CONTENT[key];
      expect(c, `missing content for ${key}`).toBeDefined();
      expect(c.sevenDayExperiment).toHaveLength(7);
      expect(c.stopRules.length).toBeGreaterThan(0);
      expect(c.offer.deliverables.length).toBeGreaterThan(0);
    }
  });

  it("seven-day experiments are numbered 1..7 in order", () => {
    for (const key of ROUTE_KEYS) {
      const days = ROUTE_CONTENT[key].sevenDayExperiment.map((t) => t.day);
      expect(days).toEqual([1, 2, 3, 4, 5, 6, 7]);
    }
  });
});

describe("buildReport", () => {
  it("is deterministic: same snapshot yields identical reports", () => {
    const snapshot = computeScores(pick(1));
    const a = buildReport(snapshot);
    const b = buildReport(snapshot);
    expect(a).toEqual(b);
  });

  it("passes its own Zod schema for varied answer profiles", () => {
    for (let i = 0; i < 4; i++) {
      const report = buildReport(computeScores(pick(i)));
      expect(() => ReportSchema.parse(report)).not.toThrow();
      expect(report.reportVersion).toBe(REPORT_VERSION);
    }
  });

  it("primary route matches the top-ranked route in the snapshot", () => {
    const snapshot = computeScores(pick(2));
    const report = buildReport(snapshot);
    expect(report.primaryRoute.slug).toBe(snapshot.routeMatches[0].route);
    expect(report.primaryRoute.rank).toBe(1);
  });

  it("first offer/experiment/stop rules come from the primary route content", () => {
    const snapshot = computeScores(pick(3));
    const report = buildReport(snapshot);
    const key = snapshot.routeMatches[0].route;
    expect(report.firstOffer).toEqual(ROUTE_CONTENT[key].offer);
    expect(report.sevenDayExperiment).toEqual(
      ROUTE_CONTENT[key].sevenDayExperiment,
    );
    expect(report.stopRules).toEqual(ROUTE_CONTENT[key].stopRules);
  });

  it("provides exactly two secondary routes and two anti-routes", () => {
    const report = buildReport(computeScores(pick(1)));
    expect(report.secondaryRoutes).toHaveLength(2);
    expect(report.antiRoutes).toHaveLength(2);
    // Anti-routes must not include the primary route.
    const antiSlugs = report.antiRoutes.map((a) => a.slug);
    expect(antiSlugs).not.toContain(report.primaryRoute.slug);
  });

  it("thirty-day roadmap has five ordered phases", () => {
    const report = buildReport(computeScores(pick(0)));
    expect(report.thirtyDayRoadmap.map((p) => p.phase)).toEqual([
      "Validate",
      "Build",
      "Publish",
      "Sell",
      "Review",
    ]);
  });

  it("adds a bridge note only when the snapshot has a distinct bridge route", () => {
    const snapshot = computeScores(pick(0));
    const report = buildReport(snapshot);
    if (snapshot.bridgeRoute && snapshot.bridgeRoute !== snapshot.routeMatches[0].route) {
      expect(report.bridgeNote).toContain(
        INCOME_ROUTES[snapshot.bridgeRoute].name,
      );
    } else {
      expect(report.bridgeNote).toBeNull();
    }
  });
});
