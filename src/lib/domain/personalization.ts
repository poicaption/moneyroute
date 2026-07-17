/**
 * ROOTMAN MONEY ROUTE — Personalization (deterministic, no AI)
 *
 * A short post-assessment intake that tailors the paid deliverables to the
 * customer's real situation: goal, income target, time, budget, audience and
 * their biggest blocker. All personalization is computed with pure functions —
 * same profile always yields the same guidance.
 */

export const GOALS = [
  "first_income",
  "side_income",
  "replace_salary",
  "scale",
] as const;
export type Goal = (typeof GOALS)[number];

export const BUDGET_BANDS = ["none", "under_1k", "1k_5k", "over_5k"] as const;
export type BudgetBand = (typeof BUDGET_BANDS)[number];

export const AUDIENCE_BANDS = [
  "none",
  "under_1k",
  "1k_10k",
  "over_10k",
] as const;
export type AudienceBand = (typeof AUDIENCE_BANDS)[number];

export const BLOCKERS = [
  "time",
  "money",
  "skill",
  "idea",
  "confidence",
  "selling",
] as const;
export type Blocker = (typeof BLOCKERS)[number];

export type PersonalizationProfile = {
  goal: Goal;
  monthlyTargetThb: number;
  hoursPerWeek: number;
  budgetBand: BudgetBand;
  audienceBand: AudienceBand;
  blocker: Blocker;
  nicheText: string;
};

// ── Thai labels ──────────────────────────────────────────────────────────────

export const GOAL_LABEL: Record<Goal, string> = {
  first_income: "หาเงินก้อนแรกจากทักษะ/เวลา",
  side_income: "สร้างรายได้เสริมควบคู่งานประจำ",
  replace_salary: "แทนที่เงินเดือนให้ได้",
  scale: "ขยายให้เป็นธุรกิจที่โตได้",
};

export const BUDGET_LABEL: Record<BudgetBand, string> = {
  none: "ยังไม่มีงบลงทุน",
  under_1k: "ต่ำกว่า 1,000 บาท",
  "1k_5k": "1,000–5,000 บาท",
  over_5k: "มากกว่า 5,000 บาท",
};

export const AUDIENCE_LABEL: Record<AudienceBand, string> = {
  none: "ยังไม่มีผู้ติดตาม",
  under_1k: "น้อยกว่า 1,000 คน",
  "1k_10k": "1,000–10,000 คน",
  over_10k: "มากกว่า 10,000 คน",
};

export const BLOCKER_LABEL: Record<Blocker, string> = {
  time: "เวลาไม่พอ",
  money: "ทุนน้อย",
  skill: "ยังไม่มีทักษะที่ขายได้",
  idea: "ไม่รู้จะเริ่มจากอะไร",
  confidence: "ไม่มั่นใจในตัวเอง",
  selling: "กลัว/ไม่ถนัดการขาย",
};

// ── Derivations ──────────────────────────────────────────────────────────────

export type Pace = "sprint" | "steady" | "gentle";

/** How aggressively to schedule work, based on weekly time available. */
export function derivePace(hoursPerWeek: number): Pace {
  if (hoursPerWeek >= 20) return "sprint";
  if (hoursPerWeek >= 8) return "steady";
  return "gentle";
}

export const PACE_LABEL: Record<Pace, string> = {
  sprint: "โหมดเร่ง",
  steady: "โหมดสม่ำเสมอ",
  gentle: "โหมดค่อยเป็นค่อยไป",
};

/** A realistic daily action budget derived from weekly hours. */
export function dailyActionMinutes(hoursPerWeek: number): number {
  // Spread across ~6 active days, floored to a usable block.
  const perDay = Math.round((hoursPerWeek * 60) / 6 / 15) * 15;
  return Math.max(30, Math.min(perDay, 240));
}

/**
 * Suggested first offer price band (THB), nudged by the income target and the
 * customer's own budget comfort. Returns a [low, high] tuple.
 */
export function suggestedPriceBand(
  base: [number, number],
  profile: PersonalizationProfile,
): [number, number] {
  let [low, high] = base;

  // Higher targets → lean toward the top of the band and beyond.
  if (profile.monthlyTargetThb >= 50000) {
    low = Math.round(low * 1.3);
    high = Math.round(high * 1.6);
  } else if (profile.monthlyTargetThb >= 30000) {
    low = Math.round(low * 1.15);
    high = Math.round(high * 1.3);
  } else if (profile.monthlyTargetThb > 0 && profile.monthlyTargetThb < 15000) {
    // Getting the first yes matters more than price — keep it accessible.
    low = Math.round(low * 0.85);
  }

  return [low, high];
}

/**
 * How many paying customers per month are needed to hit the income target at a
 * given average price. Used to make the target concrete.
 */
export function customersForTarget(
  monthlyTargetThb: number,
  avgPriceThb: number,
): number {
  if (avgPriceThb <= 0 || monthlyTargetThb <= 0) return 0;
  return Math.max(1, Math.ceil(monthlyTargetThb / avgPriceThb));
}

/** Blocker-specific coaching shown across the paid deliverables. */
export const BLOCKER_COACHING: Record<Blocker, { title: string; body: string }> =
  {
    time: {
      title: "ทำน้อยแต่ต่อเนื่อง",
      body: "เวลาน้อยไม่ใช่ข้ออ้าง แต่คือข้อจำกัดที่ต้องออกแบบรอบงาน จับงานที่ให้ผลตอบแทนต่อชั่วโมงสูงสุดก่อน ตัดงานที่ไม่ขยับรายได้ออก และล็อกช่วงเวลาทำงานให้เป็นกิจวัตร",
    },
    money: {
      title: "เริ่มด้วยทุนเท่าที่มี",
      body: "เลือกเส้นทางที่ใช้ทักษะและเวลาก่อนใช้เงิน อย่าเพิ่งจ่ายค่าเครื่องมือแพงหรือยิงแอด จนกว่าจะมีลูกค้าจ่ายจริงรายแรก",
    },
    skill: {
      title: "ขายผลลัพธ์ ไม่ใช่ปริญญา",
      body: "คุณไม่ต้องเก่งที่สุด แค่เก่งกว่าคนที่คุณช่วยหนึ่งก้าว เรียนแบบ just-in-time ระหว่างทำงานจริง และเก็บผลงานชิ้นแรกให้ได้เร็วที่สุด",
    },
    idea: {
      title: "ทำตามเส้นทางที่ระบบเลือกให้",
      body: "ไม่ต้องคิดไอเดียใหม่ ใช้เส้นทางอันดับหนึ่งที่ระบบวิเคราะห์ให้ แล้วลงมือตามแผนทดลองทันที ไอเดียจะชัดขึ้นจากการทำ ไม่ใช่การคิด",
    },
    confidence: {
      title: "ความมั่นใจมาจากหลักฐาน",
      body: "อย่ารอให้พร้อมค่อยเริ่ม ความมั่นใจจะโตขึ้นทุกครั้งที่คุณส่งมอบงานจริง ตั้งเป้าเล็กที่ทำสำเร็จได้ในวันนี้ แล้วสะสมชัยชนะเล็ก ๆ",
    },
    selling: {
      title: "ขายแบบช่วยเหลือ ไม่ใช่ยัดเยียด",
      body: "มองการขายเป็นการเสนอทางแก้ให้คนที่มีปัญหาจริง ใช้สคริปต์ที่เตรียมไว้ ถามก่อนเสนอ และโฟกัสที่ผลลัพธ์ของลูกค้า ไม่ใช่ยอดของคุณ",
    },
  };
