/**
 * ROOTMAN MONEY ROUTE — Experiment continuation program (deterministic)
 *
 * The tracked experiment is the 7-day sprint. This module builds the follow-on
 * 30-day program (weeks 2–4) shown beneath the tracker, optionally personalized
 * with the customer's pace and income target. No AI.
 */
import {
  type PersonalizationProfile,
  derivePace,
  dailyActionMinutes,
  PACE_LABEL,
} from "./personalization";

export type ProgramPhase = {
  window: string;
  title: string;
  goal: string;
  actions: string[];
};

/** Build the weeks 2–4 continuation phases for a route. */
export function buildExperimentContinuation(
  routeName: string,
  profile?: PersonalizationProfile | null,
): ProgramPhase[] {
  const minutes = profile ? dailyActionMinutes(profile.hoursPerWeek) : 60;
  const dailyNote = `ทำวันละ ~${minutes} นาที`;

  return [
    {
      window: "วัน 8–14 (สัปดาห์ 2)",
      title: "ทำซ้ำสิ่งที่ได้ผล",
      goal: `เปลี่ยนการทดลองให้เป็นผลลัพธ์จริงของ ${routeName}`,
      actions: [
        `ทำซ้ำ 2–3 ท่าที่ให้ผลดีที่สุดจาก 7 วันแรก (${dailyNote})`,
        "ตัดกิจกรรมที่ไม่ขยับผลลัพธ์ทิ้ง",
        "ตั้งเป้าได้ลูกค้า/ผลตอบรับจริงอย่างน้อย 1 รายในสัปดาห์นี้",
      ],
    },
    {
      window: "วัน 15–21 (สัปดาห์ 3)",
      title: "ปรับจากฟีดแบ็กจริง",
      goal: "ทำข้อเสนอให้คมขึ้นจากสิ่งที่ตลาดบอก",
      actions: [
        "รวบรวมข้อโต้แย้ง/คำถามที่เจอบ่อย แล้วปรับสคริปต์/ข้อเสนอ",
        "เพิ่มความถี่การเสนอขายขึ้นอีกเท่าตัว",
        "ขอรีวิว/ผลงานตัวอย่างจากคนที่ตอบรับ เพื่อสร้างความน่าเชื่อถือ",
      ],
    },
    {
      window: "วัน 22–30 (สัปดาห์ 4)",
      title: "ปิดยอดและตัดสินใจ",
      goal: "สรุปว่าจะขยาย ปรับ หรือหยุด ตาม Stop Rules",
      actions: [
        "โฟกัสการปิดลูกค้า/ยอดขายจริงให้ได้ตามเป้าของเดือนนี้",
        "สรุปตัวเลข: ต้นทุน เวลา และรายได้ที่เกิดขึ้นจริง",
        "ตัดสินใจตาม Stop Rules — ถ้าเวิร์กให้ดับเบิล ถ้าไม่ให้ปรับหรือเปลี่ยนเส้นทาง",
      ],
    },
  ];
}

/** A short personalized intro line for the experiment page (or null). */
export function experimentIntro(
  profile?: PersonalizationProfile | null,
): string | null {
  if (!profile) return null;
  const pace = derivePace(profile.hoursPerWeek);
  const minutes = dailyActionMinutes(profile.hoursPerWeek);
  const targetLine =
    profile.monthlyTargetThb > 0
      ? ` มุ่งสู่เป้า ${profile.monthlyTargetThb.toLocaleString("th-TH")} บาท/เดือน`
      : "";
  return `ปรับให้เป็น${PACE_LABEL[pace]} — ทำได้จริงวันละ ~${minutes} นาที${targetLine}`;
}
