"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { getAuthUser } from "@/lib/supabase-server";
import { sendApprovalEmail, sendRejectionEmail, sendTeamApplicationEmail } from "@/lib/email";
import { teamApplicationSchema, type TeamApplicationInput } from "@/lib/validation/team";

export type ActionResult = { success: boolean; error?: string };

export async function createTeamApplication(
  input: TeamApplicationInput
): Promise<ActionResult> {
  const user = await getAuthUser();
  if (!user || user.role !== "TEAM") {
    return { success: false, error: "Takım başvurusu için giriş yapmalısınız." };
  }

  const parsed = teamApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Geçersiz form verisi." };
  }

  const supabase = await createClient();

  // Check if user already has a team
  const { data: existing } = await supabase
    .from("teams")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "Zaten bir takım başvurunuz bulunuyor." };
  }

  const { name, tag, mainGame, country, description, captainEmail, logoUrl, members } =
    parsed.data;

  // Create team
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert({
      name,
      tag,
      main_game: mainGame,
      country,
      description,
      captain_email: captainEmail,
      logo_url: logoUrl || null,
      owner_user_id: user.id,
    })
    .select("id")
    .single();

  if (teamError) {
    return { success: false, error: "Takım oluşturulurken bir hata oluştu." };
  }

  // Create members
  if (members.length > 0) {
    const { error: membersError } = await supabase
      .from("team_members")
      .insert(
        members.map((m) => ({
          team_id: team.id,
          full_name: m.fullName,
          email: m.email,
          role: m.role,
        }))
      );

    if (membersError) {
      console.error("Members insert error:", membersError);
    }
  }

  await sendTeamApplicationEmail({ teamName: name, country, captainEmail });

  revalidatePath("/takimlar");
  revalidatePath("/panel");
  revalidatePath("/admin");

  return { success: true };
}

export async function approveTeam(teamId: string): Promise<ActionResult> {
  const user = await getAuthUser();
  if (user?.role !== "ADMIN") {
    return { success: false, error: "Yetkiniz yok." };
  }

  const supabase = await createClient();

  const { data: team, error } = await supabase
    .from("teams")
    .update({ status: "APPROVED", rejection_note: null })
    .eq("id", teamId)
    .select("name, captain_email")
    .single();

  if (error) {
    return { success: false, error: "Takım onaylanırken bir hata oluştu." };
  }

  await sendApprovalEmail({ teamName: team.name, captainEmail: team.captain_email });

  revalidatePath("/takimlar");
  revalidatePath("/panel");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function rejectTeam(
  teamId: string,
  rejectionNote?: string
): Promise<ActionResult> {
  const user = await getAuthUser();
  if (user?.role !== "ADMIN") {
    return { success: false, error: "Yetkiniz yok." };
  }

  const supabase = await createClient();

  const { data: team, error } = await supabase
    .from("teams")
    .update({ status: "REJECTED", rejection_note: rejectionNote || null })
    .eq("id", teamId)
    .select("name, captain_email")
    .single();

  if (error) {
    return { success: false, error: "Takım reddedilirken bir hata oluştu." };
  }

  await sendRejectionEmail({
    teamName: team.name,
    captainEmail: team.captain_email,
    rejectionNote,
  });

  revalidatePath("/takimlar");
  revalidatePath("/panel");
  revalidatePath("/admin");

  return { success: true };
}

export async function removeTeam(teamId: string): Promise<ActionResult> {
  const user = await getAuthUser();
  if (user?.role !== "ADMIN") {
    return { success: false, error: "Yetkiniz yok." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("teams").delete().eq("id", teamId);

  if (error) {
    return { success: false, error: "Takım silinirken bir hata oluştu." };
  }

  revalidatePath("/takimlar");
  revalidatePath("/admin");
  revalidatePath("/");

  return { success: true };
}

export async function updateTeamProfile(input: {
  name: string;
  tag: string;
  mainGame: string;
  country: string;
  description: string;
  captainEmail: string;
  logoUrl?: string;
}): Promise<ActionResult> {
  const user = await getAuthUser();
  if (!user || user.role !== "TEAM") {
    return { success: false, error: "Giriş yapmalısınız." };
  }

  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (!team) {
    return { success: false, error: "Takım bulunamadı." };
  }

  const { error } = await supabase
    .from("teams")
    .update({
      name: input.name,
      tag: input.tag,
      main_game: input.mainGame,
      country: input.country,
      description: input.description,
      captain_email: input.captainEmail,
      logo_url: input.logoUrl || null,
    })
    .eq("id", team.id);

  if (error) {
    return { success: false, error: "Profil güncellenirken bir hata oluştu." };
  }

  revalidatePath("/panel");
  revalidatePath("/takimlar");

  return { success: true };
}
