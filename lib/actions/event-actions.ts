"use server";

import { revalidatePath } from "next/cache";
import { createClient, getAuthUser } from "@/lib/supabase-server";
import { eventSchema, type EventInput } from "@/lib/validation/event";
import type { ActionResult } from "@/lib/actions/team-actions";

export async function createEvent(input: EventInput): Promise<ActionResult> {
  const user = await getAuthUser();
  if (!user || user.role !== "TEAM") {
    return { success: false, error: "You must be signed in to create an event." };
  }

  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("id, status")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (!team || team.status !== "APPROVED") {
    return { success: false, error: "Only approved teams can create events." };
  }

  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const { title, description, date, location, imageUrl, galleryUrls, capacity } = parsed.data;

  const { error } = await supabase.from("events").insert({
    title,
    description,
    date: new Date(date).toISOString(),
    location,
    image_url: imageUrl || null,
    gallery_urls: galleryUrls ?? [],
    capacity,
    team_id: team.id,
  });

  if (error) {
    return { success: false, error: "An error occurred while creating the event." };
  }

  revalidatePath("/events");
  revalidatePath("/panel");

  return { success: true };
}

export async function removeEvent(eventId: string): Promise<ActionResult> {
  const user = await getAuthUser();
  if (user?.role !== "ADMIN") {
    return { success: false, error: "You do not have permission to do this." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    return { success: false, error: "An error occurred while deleting the event." };
  }

  revalidatePath("/events");
  revalidatePath("/admin");

  return { success: true };
}

export async function publishEvent(eventId: string): Promise<ActionResult> {
  const user = await getAuthUser();
  if (user?.role !== "ADMIN") {
    return { success: false, error: "You do not have permission to do this." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .update({ status: "PUBLISHED" })
    .eq("id", eventId);

  if (error) {
    return { success: false, error: "An error occurred while publishing the event." };
  }

  revalidatePath("/events");
  revalidatePath("/admin");

  return { success: true };
}

export async function toggleEventParticipation(eventId: string): Promise<ActionResult> {
  const user = await getAuthUser();
  if (!user || user.role !== "TEAM") {
    return { success: false, error: "You must be signed in to participate." };
  }

  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("id, status")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (!team || team.status !== "APPROVED") {
    return { success: false, error: "Only approved teams can participate in events." };
  }

  // Check existing participation
  const { data: existing } = await supabase
    .from("event_participants")
    .select("id")
    .eq("event_id", eventId)
    .eq("team_id", team.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("event_participants").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("event_participants")
      .insert({ event_id: eventId, team_id: team.id });
  }

  revalidatePath(`/events/${eventId}`);

  return { success: true };
}
