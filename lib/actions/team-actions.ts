"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { getAuthUser } from "@/lib/supabase-server";
import { sendApprovalEmail, sendRejectionEmail, sendTeamApplicationEmail } from "@/lib/email";
import {
  teamApplicationSchema,
  teamMemberSchema,
  type TeamApplicationInput,
  type TeamMemberInput,
} from "@/lib/validation/team";

export type ActionResult = { success: boolean; error?: string };

export async function createTeamApplication(
  input: TeamApplicationInput
): Promise<ActionResult> {
  const user = await getAuthUser();
  if (!user || user.role !== "TEAM") {
    return { success: false, error: "You must be signed in to apply as a team." };
  }

  const parsed = teamApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();

  // Check if user already has a team
  const { data: existing } = await supabase
    .from("teams")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "You already have a team application." };
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
    return { success: false, error: "An error occurred while creating the team." };
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

  try {
    await sendTeamApplicationEmail({ teamName: name, country, captainEmail });
  } catch (emailError) {
    console.error("Team application notification email failed:", emailError);
  }

  revalidatePath("/teams");
  revalidatePath("/panel");
  revalidatePath("/admin");

  return { success: true };
}

export async function approveTeam(teamId: string): Promise<ActionResult> {
  const user = await getAuthUser();
  if (user?.role !== "ADMIN") {
    return { success: false, error: "You do not have permission to do this." };
  }

  const supabase = await createClient();

  const { data: team, error } = await supabase
    .from("teams")
    .update({ status: "APPROVED", rejection_note: null })
    .eq("id", teamId)
    .select("name, captain_email")
    .single();

  if (error) {
    return { success: false, error: "An error occurred while approving the team." };
  }

  try {
    await sendApprovalEmail({ teamName: team.name, captainEmail: team.captain_email });
  } catch (emailError) {
    console.error("Approval notification email failed:", emailError);
  }

  revalidatePath("/teams");
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
    return { success: false, error: "You do not have permission to do this." };
  }

  const supabase = await createClient();

  const { data: team, error } = await supabase
    .from("teams")
    .update({ status: "REJECTED", rejection_note: rejectionNote || null })
    .eq("id", teamId)
    .select("name, captain_email")
    .single();

  if (error) {
    return { success: false, error: "An error occurred while rejecting the team." };
  }

  try {
    await sendRejectionEmail({
      teamName: team.name,
      captainEmail: team.captain_email,
      rejectionNote,
    });
  } catch (emailError) {
    console.error("Rejection notification email failed:", emailError);
  }

  revalidatePath("/teams");
  revalidatePath("/panel");
  revalidatePath("/admin");

  return { success: true };
}

export async function removeTeam(teamId: string): Promise<ActionResult> {
  const user = await getAuthUser();
  if (user?.role !== "ADMIN") {
    return { success: false, error: "You do not have permission to do this." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("teams").delete().eq("id", teamId);

  if (error) {
    return { success: false, error: "An error occurred while deleting the team." };
  }

  revalidatePath("/teams");
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
    return { success: false, error: "You must be signed in." };
  }

  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (!team) {
    return { success: false, error: "Team not found." };
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
    return { success: false, error: "An error occurred while updating the profile." };
  }

  revalidatePath("/panel");
  revalidatePath("/teams");

  return { success: true };
}

export async function updateTeamMembers(members: TeamMemberInput[]): Promise<ActionResult> {
  const user = await getAuthUser();
  if (!user || user.role !== "TEAM") {
    return { success: false, error: "You must be signed in." };
  }

  const parsed = z
    .array(teamMemberSchema)
    .min(1, "You must have at least one member.")
    .safeParse(members);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (!team) {
    return { success: false, error: "Team not found." };
  }

  const { error: deleteError } = await supabase
    .from("team_members")
    .delete()
    .eq("team_id", team.id);

  if (deleteError) {
    return { success: false, error: "An error occurred while updating members." };
  }

  const { error: insertError } = await supabase.from("team_members").insert(
    parsed.data.map((m) => ({
      team_id: team.id,
      full_name: m.fullName,
      email: m.email,
      role: m.role,
    }))
  );

  if (insertError) {
    return { success: false, error: "An error occurred while updating members." };
  }

  revalidatePath("/panel");
  revalidatePath("/teams");
  revalidatePath(`/teams/${team.id}`);

  return { success: true };
}
