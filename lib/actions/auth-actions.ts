"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendTeamApplicationEmail } from "@/lib/email";
import { teamApplicationSchema } from "@/lib/validation/team";

const registerTeamSchema = z
  .object({
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
  })
  .extend(teamApplicationSchema.shape);

export type RegisterTeamInput = z.infer<typeof registerTeamSchema>;
export type RegisterTeamState = { success: boolean; error?: string };

/**
 * Creates the auth account and the team application in one atomic,
 * server-side step (service role — bypasses RLS) so the applicant never
 * has to re-enter team details after signing up, regardless of whether
 * the auth session is established immediately (e.g. pending email
 * confirmation would otherwise strand a half-completed application).
 */
export async function registerTeamWithAccount(
  input: RegisterTeamInput
): Promise<RegisterTeamState> {
  const parsed = registerTeamSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const { email, password, name, tag, mainGame, country, description, captainEmail, logoUrl, members } =
    parsed.data;

  const admin = createAdminClient();

  const { data: userData, error: createUserError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "TEAM" },
  });

  if (createUserError) {
    const message = createUserError.message.toLowerCase().includes("already been registered")
      ? "This email address is already registered."
      : createUserError.message;
    return { success: false, error: message };
  }

  const userId = userData.user.id;

  const { data: team, error: teamError } = await admin
    .from("teams")
    .insert({
      name,
      tag,
      main_game: mainGame,
      country,
      description,
      captain_email: captainEmail,
      logo_url: logoUrl || null,
      owner_user_id: userId,
    })
    .select("id")
    .single();

  if (teamError) {
    return {
      success: false,
      error: "Your account was created but the team application could not be saved. Please sign in and try again from your panel.",
    };
  }

  if (members.length > 0) {
    const { error: membersError } = await admin.from("team_members").insert(
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

  return { success: true };
}
