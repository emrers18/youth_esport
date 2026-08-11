import { createClient } from "@/lib/supabase-server";

// Escapes characters that have special meaning in a PostgREST filter string
// (commas separate conditions, parentheses group them, backslash escapes).
function escapePostgrestFilterValue(value: string) {
  return value.replace(/[\\,()]/g, (char) => `\\${char}`);
}

export async function getApprovedTeams(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("teams")
    .select("*, team_members(count)")
    .eq("status", "APPROVED")
    .order("created_at", { ascending: false });

  if (search) {
    const term = escapePostgrestFilterValue(search);
    query = query.or(
      `name.ilike.%${term}%,tag.ilike.%${term}%,country.ilike.%${term}%,main_game.ilike.%${term}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((t) => ({
    ...t,
    _count: { members: t.team_members?.[0]?.count ?? 0 },
  }));
}

export async function getFeaturedTeams(limit = 4) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teams")
    .select("*, team_members(count)")
    .eq("status", "APPROVED")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((t) => ({
    ...t,
    _count: { members: t.team_members?.[0]?.count ?? 0 },
  }));
}

export async function getTeamById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teams")
    .select("*, team_members(*), events(*)")
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    ...data,
    members: data.team_members ?? [],
    _count: { members: (data.team_members ?? []).length },
  };
}

export async function getHomeStats() {
  const supabase = await createClient();

  const [teamsRes, eventsRes, membersRes, countriesRes] = await Promise.all([
    supabase
      .from("teams")
      .select("id", { count: "exact", head: true })
      .eq("status", "APPROVED"),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase
      .from("team_members")
      .select("id, teams!inner(status)", { count: "exact", head: true })
      .eq("teams.status", "APPROVED"),
    supabase
      .from("teams")
      .select("country")
      .eq("status", "APPROVED"),
  ]);

  const uniqueCountries = new Set(
    (countriesRes.data ?? []).map((t) => t.country)
  );

  return {
    teams: teamsRes.count ?? 0,
    events: eventsRes.count ?? 0,
    participants: membersRes.count ?? 0,
    countries: uniqueCountries.size,
  };
}

export async function getUpcomingEvents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*, teams!inner(id, name), event_participants(count)")
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((e) => ({
    ...e,
    imageUrl: e.image_url,
    team: e.teams,
    _count: { participants: e.event_participants?.[0]?.count ?? 0 },
  }));
}

export async function getPastEvents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*, teams!inner(id, name), event_participants(count)")
    .lt("date", new Date().toISOString())
    .order("date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((e) => ({
    ...e,
    imageUrl: e.image_url,
    team: e.teams,
    _count: { participants: e.event_participants?.[0]?.count ?? 0 },
  }));
}

export async function getEventById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*, teams!inner(id, name, status)")
    .eq("id", id)
    .single();

  if (error) return null;

  return {
    ...data,
    team: data.teams,
  };
}

export async function getProjectOutputs() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_outputs")
    .select("*")
    .order("publish_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// --- Admin queries ---

export async function getPendingTeams() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teams")
    .select("*, team_members(*)")
    .eq("status", "PENDING")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((t) => ({
    ...t,
    members: t.team_members ?? [],
  }));
}

export async function getApprovedTeamsAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("teams")
    .select("*, team_members(count), events(count)")
    .eq("status", "APPROVED")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((t) => ({
    ...t,
    _count: {
      members: t.team_members?.[0]?.count ?? 0,
      events: t.events?.[0]?.count ?? 0,
    },
  }));
}

export async function getAllEventsAdmin() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*, teams!inner(id, name)")
    .order("date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((e) => ({
    ...e,
    team: e.teams,
  }));
}
