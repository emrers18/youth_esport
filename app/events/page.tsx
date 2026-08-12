import { PlusIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EventCard } from "@/components/event-card";
import { EventFilterTabs } from "@/components/event-filter-tabs";
import { EmptyState } from "@/components/empty-state";
import { PixelJoystick } from "@/components/effects/pixel-icons";
import { FadeIn } from "@/components/effects/fade-in";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { getAuthUser, createClient } from "@/lib/supabase-server";
import { getUpcomingEvents, getPastEvents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const activeFilter = filter === "past" ? "past" : "upcoming";

  const [events, user] = await Promise.all([
    activeFilter === "past" ? getPastEvents() : getUpcomingEvents(),
    getAuthUser(),
  ]);

  let canCreate = false;
  if (user?.role === "TEAM") {
    const supabase = await createClient();
    const { data: team } = await supabase
      .from("teams")
      .select("status")
      .eq("owner_user_id", user.id)
      .maybeSingle();
    canCreate = team?.status === "APPROVED";
  }

  return (
    <div>
      <PageHeader
        title="Events"
        description="Tournaments, workshops, and meetups organized as part of the Bridges project."
      />

      <div className="container-app pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <EventFilterTabs active={activeFilter} />
          {canCreate ? (
            <ButtonLink href="/events/new" className="shadow-glow">
              <PlusIcon className="size-4" />
              Create Event
            </ButtonLink>
          ) : (
            <Button
              disabled
              className="shadow-glow"
              title={
                user
                  ? "Only approved teams can create events."
                  : "You must be signed in to create an event."
              }
            >
              <PlusIcon className="size-4" />
              Create Event
            </Button>
          )}
        </div>

        {events.length === 0 ? (
          <EmptyState
            icon={PixelJoystick}
            title={
              activeFilter === "past"
                ? "There are no past events yet."
                : "There are no upcoming events."
            }
          />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <FadeIn key={event.id} delay={i * 60}>
                <EventCard event={event} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
