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
  /** The single number to watch during this phase. */
  metric?: string;
  /** A one-line daily habit for the phase. */
  dailyFocus?: string;
  actions: string[];
  /** Concrete "done" checks that prove the phase succeeded. */
  successCriteria?: string[];
  /** The target outcome by the end of the phase. */
  milestone?: string;
};

/** Build the weeks 2–6 continuation phases for a route. */
export function buildExperimentContinuation(
  routeName: string,
  profile?: PersonalizationProfile | null,
): ProgramPhase[] {
  const minutes = profile ? dailyActionMinutes(profile.hoursPerWeek) : 60;
  const dailyNote = `ทำวันละ ~${minutes} นาที`;

  // Personalized volume targets: more time → more outreach expected per day.
  const dailyOutreach = Math.max(3, Math.round(minutes / 12));
  const target = profile?.monthlyTargetThb ?? 0;
  const targetLine =
    target > 0
      ? `${target.toLocaleString("th-TH")} บาท/เดือน`
      : "เป้ารายได้ที่คุณตั้งไว้";
  const weeklyDeals = target > 0 ? Math.max(1, Math.ceil(target / 4 / 3000)) : 1;

  return [
    {
      window: "วัน 8–14 (สัปดาห์ 2)",
      title: "ทำซ้ำสิ่งที่ได้ผล",
      goal: `เปลี่ยนการทดลองให้เป็นผลลัพธ์จริงของ ${routeName}`,
      metric: "จำนวนการเสนอ/ทักถึงกลุ่มเป้าหมายต่อวัน",
      dailyFocus: `${dailyNote} — เสนอ/ทักอย่างน้อย ${dailyOutreach} ครั้ง/วัน`,
      actions: [
        `ทำซ้ำ 2–3 ท่าที่ให้ผลดีที่สุดจาก 7 วันแรก (${dailyNote})`,
        "ตัดกิจกรรมที่ไม่ขยับผลลัพธ์ทิ้งทันที",
        `รักษาความสม่ำเสมอ: ทัก/เสนออย่างน้อย ${dailyOutreach} ครั้งทุกวันโดยไม่ขาด`,
        "จดสถิติทุกวัน: ทักกี่คน ตอบกี่คน สนใจกี่คน",
      ],
      successCriteria: [
        `ทำ Action หลักครบทุกวัน (7/7 วันในสัปดาห์นี้)`,
        "ได้ผลตอบรับจริง (คนสนใจ/ตอบกลับ) อย่างน้อย 1 ราย",
        "รู้แล้วว่าท่าไหนได้ผลที่สุดจากตัวเลขจริง",
      ],
      milestone: "มีดีล/ผู้สนใจจริงเข้ามาในมืออย่างน้อย 1 ราย",
    },
    {
      window: "วัน 15–21 (สัปดาห์ 3)",
      title: "ปรับจากฟีดแบ็กจริง",
      goal: "ทำข้อเสนอให้คมขึ้นจากสิ่งที่ตลาดบอก",
      metric: "อัตราการตอบรับ (คนสนใจ ÷ คนที่เสนอ)",
      dailyFocus: `${dailyNote} — เพิ่มการเสนอเป็น ~${dailyOutreach * 2} ครั้ง/วัน`,
      actions: [
        "รวบรวมข้อโต้แย้ง/คำถามที่เจอบ่อย 3 อันดับแรก แล้วแก้สคริปต์/ข้อเสนอให้ตอบล่วงหน้า",
        "เพิ่มความถี่การเสนอขายขึ้นอีกเท่าตัว",
        "ขอรีวิว/ผลงานตัวอย่างจากคนที่ตอบรับ เพื่อสร้างความน่าเชื่อถือ",
        "ทดลอง A/B ข้อความเปิด 2 แบบ วัดว่าแบบไหนได้ตอบมากกว่า",
      ],
      successCriteria: [
        "อัตราการตอบรับดีขึ้นเทียบกับสัปดาห์ที่แล้ว",
        "มีรีวิว/ผลงานตัวอย่างเก็บไว้ใช้ขายอย่างน้อย 1 ชิ้น",
        "สคริปต์/ข้อเสนอเวอร์ชันใหม่ที่คมกว่าเดิม",
      ],
      milestone: "ข้อเสนอที่ปิดง่ายขึ้น + หลักฐานความน่าเชื่อถือชิ้นแรก",
    },
    {
      window: "วัน 22–30 (สัปดาห์ 4)",
      title: "ปิดยอดและตัดสินใจ",
      goal: "สรุปว่าจะขยาย ปรับ หรือหยุด ตาม Stop Rules",
      metric: "รายได้จริงที่เกิดขึ้นในเดือนนี้",
      dailyFocus: `${dailyNote} — โฟกัสตามปิดคนที่คุยค้างไว้ก่อนหาคนใหม่`,
      actions: [
        `โฟกัสการปิดลูกค้า/ยอดขายจริง — เป้าอย่างน้อย ${weeklyDeals} ดีลในสัปดาห์นี้`,
        "สรุปตัวเลข: ต้นทุน เวลา และรายได้ที่เกิดขึ้นจริงทั้งเดือน",
        "คำนวณว่าถ้าทำซ้ำสเกลนี้ จะไปถึงเป้าหมายกี่เดือน",
        "ตัดสินใจตาม Stop Rules — ถ้าเวิร์กให้ดับเบิล ถ้าไม่ให้ปรับหรือเปลี่ยนเส้นทาง",
      ],
      successCriteria: [
        "มีรายได้จริงเกิดขึ้น (แม้ยอดเล็ก ก็คือการพิสูจน์โมเดล)",
        "รู้ตัวเลขต้นทุน–เวลา–รายได้ของตัวเองชัดเจน",
        "ตัดสินใจได้ว่าจะ ขยาย / ปรับ / เปลี่ยน อย่างมีข้อมูล",
      ],
      milestone: `พิสูจน์โมเดลด้วยรายได้จริง + แผนไปสู่ ${targetLine}`,
    },
    {
      window: "วัน 31–45 (สัปดาห์ 5–6)",
      title: "วางระบบให้ไปต่อได้เอง",
      goal: "เปลี่ยนจาก 'ลองทำ' เป็น 'ระบบที่ทำซ้ำได้'",
      metric: "รายได้ที่คาดเดาได้ + เวลาที่ใช้ต่อรายได้ 1 บาท",
      dailyFocus: `${dailyNote} — ทำตาม SOP ที่เขียนไว้ ไม่ต้องคิดใหม่ทุกวัน`,
      actions: [
        "เขียน SOP ขั้นตอนที่ได้ผล เพื่อทำซ้ำ (หรือมอบให้คนอื่นทำแทนได้)",
        "สร้างแหล่งลูกค้าที่เข้ามาเองแทนการไล่หาทีละคน (คอนเทนต์/รีเฟอร์รัล)",
        "ยกระดับราคา/ข้อเสนอจากหลักฐานผลลัพธ์ที่สะสมมา",
        "ตั้งเป้าเดือนถัดไปจากตัวเลขจริง ไม่ใช่การเดา",
      ],
      successCriteria: [
        "มี SOP ที่ทำซ้ำได้โดยไม่ต้องเริ่มจากศูนย์ทุกครั้ง",
        "มีลูกค้า/ผู้สนใจไหลเข้ามาโดยไม่ต้องออกแรงหาใหม่ทั้งหมด",
        "รายได้เดือนนี้ ≥ เดือนก่อน และคาดเดาแนวโน้มได้",
      ],
      milestone: "ระบบทำเงินที่เดินได้เองและพร้อมสเกลในเดือนถัดไป",
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
