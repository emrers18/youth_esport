import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusIcon, UsersIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { TeamProfileForm } from "@/components/team-profile-form";
import { TeamMembersForm } from "@/components/team-members-form";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/empty-state";
import { CapacityBar } from "@/components/capacity-bar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getAuthUser, createClient } from "@/lib/supabase-server";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type OrganizedEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
};

type ParticipantTeam = {
  id: string;
  name: string;
  tag: string;
  country: string;
};

type TeamMemberRow = {
  full_name: string;
  email: string;
  role: string;
};

type ParticipatingEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
  organizerTeam: { id: string; name: string; tag: string } | null;
};

export default async function TeamPanelPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?callbackUrl=/panel");
  }

  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("*, events(*), team_members(*)")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (!team) {
    return (
      <div>
        <PageHeader title="Team Panel" />
        <div className="container-app flex flex-col items-center gap-4 pb-20 text-center">
          <p className="max-w-md text-textSecondary">
            You don&apos;t have a team application yet. Create your team to
            join the Bridges project.
          </p>
          <ButtonLink href="/teams/new" className="shadow-glow">
            <PlusIcon className="size-4" />
            Create Your Team
          </ButtonLink>
        </div>
      </div>
    );
  }

  const teamMembers = (team.team_members ?? []) as TeamMemberRow[];
  const memberCount = teamMembers.length;
  const organizedEvents = ((team.events ?? []) as OrganizedEvent[]).slice().sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const participantsByEvent: Record<string, ParticipantTeam[]> = {};
  let participatingEvents: ParticipatingEvent[] = [];

  if (team.status === "APPROVED") {
    const organizedEventIds = organizedEvents.map((event) => event.id);

    const [participantsRes, participatingRes] = await Promise.all([
      organizedEventIds.length > 0
        ? supabase
            .from("event_participants")
            .select("event_id, teams(id, name, tag, country)")
            .in("event_id", organizedEventIds)
        : Promise.resolve<{ data: { event_id: string; teams: ParticipantTeam | null }[] | null }>({
            data: [],
          }),
      supabase
        .from("event_participants")
        .select("events(id, title, date, location, capacity, teams(id, name, tag))")
        .eq("team_id", team.id),
    ]);

    const participantRows = (participantsRes.data ?? []) as unknown as {
      event_id: string;
      teams: ParticipantTeam | null;
    }[];

    for (const row of participantRows) {
      if (!row.teams) continue;
      (participantsByEvent[row.event_id] ??= []).push(row.teams);
    }

    const participatingRows = (participatingRes.data ?? []) as unknown as {
      events: (OrganizedEvent & { teams: { id: string; name: string; tag: string } | null }) | null;
    }[];

    participatingEvents = participatingRows
      .map((row) => row.events)
      .filter((event): event is NonNullable<typeof event> => !!event)
      .map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        organizerTeam: event.teams,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  return (
    <div>
      <PageHeader title="Team Panel" />

      <div className="container-app flex flex-col gap-10 pb-20">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-xl font-bold text-textPrimary">
                <span className="text-gold-dark">[{team.tag}]</span> {team.name}
              </h2>
              <StatusBadge status={team.status} />
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-textSecondary">
              <UsersIcon className="size-3.5" aria-hidden="true" />
              {memberCount} members · {team.country} · {team.main_game}
            </p>
          </div>
          {team.status === "REJECTED" && team.rejection_note && (
            <div className="max-w-md rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              <strong>Rejection note:</strong> {team.rejection_note}
            </div>
          )}
        </div>

        <section>
          <h2 className="font-heading text-xl font-bold text-textPrimary">Edit Profile</h2>
          <div className="mt-4 max-w-xl">
            <TeamProfileForm
              defaultValues={{
                name: team.name,
                tag: team.tag,
                mainGame: team.main_game,
                country: team.country,
                description: team.description,
                captainEmail: team.captain_email,
                logoUrl: team.logo_url ?? undefined,
              }}
            />
          </div>
        </section>

        <section>
          <h2 className="font-heading text-xl font-bold text-textPrimary">Team Members</h2>
          <div className="mt-4 max-w-3xl">
            <TeamMembersForm
              defaultValues={{
                members:
                  teamMembers.length > 0
                    ? teamMembers.map((member) => ({
                        fullName: member.full_name,
                        email: member.email,
                        role: member.role,
                      }))
                    : [{ fullName: "", email: "", role: "Captain" }],
              }}
            />
          </div>
        </section>

        {team.status === "APPROVED" && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-textPrimary">Events</h2>
              <ButtonLink href="/events/new" size="sm" variant="outline">
                <PlusIcon className="size-4" />
                New Event
              </ButtonLink>
            </div>

            <Tabs defaultValue="organized" className="mt-4">
              <TabsList>
                <TabsTrigger value="organized">
                  Organized by Me ({organizedEvents.length})
                </TabsTrigger>
                <TabsTrigger value="participating">
                  Joined by Me ({participatingEvents.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="organized">
                {organizedEvents.length === 0 ? (
                  <EmptyState
                    icon={CalendarIcon}
                    title="You haven't created any events yet."
                    description="Create a new event for your team to invite other teams."
                  />
                ) : (
                  <ul className="mt-2 flex flex-col gap-3">
                    {organizedEvents.map((event) => {
                      const participants = participantsByEvent[event.id] ?? [];
                      return (
                        <li
                          key={event.id}
                          className="hud-corners rounded-lg border border-border bg-surface p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <Link href={`/events/${event.id}`} className="group flex flex-col gap-1">
                              <span className="flex items-center gap-2 font-heading text-base font-semibold text-textPrimary group-hover:text-primary">
                                <CalendarIcon className="size-4 text-primary" aria-hidden="true" />
                                {event.title}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-textSecondary">
                                <MapPinIcon className="size-3.5" aria-hidden="true" />
                                {event.location} · {formatEventDate(event.date)}
                              </span>
                            </Link>
                            <div className="w-full sm:w-40">
                              <CapacityBar current={participants.length} capacity={event.capacity} />
                            </div>
                          </div>

                          <div className="mt-3 border-t border-border pt-3">
                            <p className="mb-2 text-xs font-semibold tracking-wide text-textSecondary uppercase">
                              Participating Teams ({participants.length})
                            </p>
                            {participants.length === 0 ? (
                              <p className="text-sm text-textSecondary">
                                No participating teams yet.
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {participants.map((participant) => (
                                  <Link
                                    key={participant.id}
                                    href={`/teams/${participant.id}`}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-textPrimary transition-colors hover:border-primary/40 hover:text-primary"
                                  >
                                    <span className="font-heading font-bold text-gold-dark">
                                      [{participant.tag}]
                                    </span>
                                    {participant.name}
                                    <span className="text-textSecondary">· {participant.country}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </TabsContent>

              <TabsContent value="participating">
                {participatingEvents.length === 0 ? (
                  <EmptyState
                    icon={UsersIcon}
                    title="You haven't joined any events yet."
                    description="You can join an event you're interested in from the Events page."
                  />
                ) : (
                  <ul className="mt-2 flex flex-col gap-2">
                    {participatingEvents.map((event) => (
                      <li key={event.id}>
                        <Link
                          href={`/events/${event.id}`}
                          className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-textPrimary transition-colors hover:border-primary/40"
                        >
                          <CalendarIcon className="size-4 text-primary" aria-hidden="true" />
                          {event.title}
                          {event.organizerTeam && (
                            <span className="text-xs text-textSecondary">
                              · Organized by: {event.organizerTeam.name}
                            </span>
                          )}
                          <span className="ml-auto flex items-center gap-1.5 text-xs text-textSecondary">
                            <MapPinIcon className="size-3.5" aria-hidden="true" />
                            {event.location} · {formatEventDate(event.date)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </section>
        )}
      </div>
    </div>
  );
}
