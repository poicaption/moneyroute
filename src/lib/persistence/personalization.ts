import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  type PersonalizationProfile,
  type Goal,
  type BudgetBand,
  type AudienceBand,
  type Blocker,
} from "@/lib/domain/personalization";

type Row = {
  goal: string;
  monthly_target_thb: number;
  hours_per_week: number;
  budget_band: string;
  audience_band: string;
  blocker: string;
  niche_text: string;
};

function rowToProfile(row: Row): PersonalizationProfile {
  return {
    goal: row.goal as Goal,
    monthlyTargetThb: row.monthly_target_thb,
    hoursPerWeek: row.hours_per_week,
    budgetBand: row.budget_band as BudgetBand,
    audienceBand: row.audience_band as AudienceBand,
    blocker: row.blocker as Blocker,
    nicheText: row.niche_text ?? "",
  };
}

/** Load a user's personalization profile, or null if none/unconfigured. */
export async function getPersonalization(
  userId: string,
): Promise<PersonalizationProfile | null> {
  const admin = createSupabaseAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("personalization_profiles")
    .select(
      "goal, monthly_target_thb, hours_per_week, budget_band, audience_band, blocker, niche_text",
    )
    .eq("user_id", userId)
    .maybeSingle();

  return data ? rowToProfile(data as Row) : null;
}

/** Insert or update the user's personalization profile (service role). */
export async function upsertPersonalization(
  userId: string,
  profile: PersonalizationProfile,
  sessionId?: string | null,
): Promise<boolean> {
  const admin = createSupabaseAdminClient();
  if (!admin) return false;

  const { error } = await admin.from("personalization_profiles").upsert(
    {
      user_id: userId,
      session_id: sessionId ?? null,
      goal: profile.goal,
      monthly_target_thb: profile.monthlyTargetThb,
      hours_per_week: profile.hoursPerWeek,
      budget_band: profile.budgetBand,
      audience_band: profile.audienceBand,
      blocker: profile.blocker,
      niche_text: profile.nicheText,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  return !error;
}
