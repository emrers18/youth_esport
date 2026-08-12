import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { EventParticipationButton } from "@/components/event-participation-button";
import { CapacityBar } from "@/components/capacity-bar";
import { FadeIn } from "@/components/effects/fade-in";
import { getEventById } from "@/lib/data";
import { formatEventDate } from "@/lib/format";
import { getAuthUser, createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const galleryPlaceholders = Array.from({ length: 3 });

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, user] = await Promise.all([getEventById(id), getAuthUser()]);

  if (!event) {
    notFound();
  }

  let isParticipating = false;
  let canParticipate = false;

  if (user?.role === "TEAM") {
    const supabase = await createClient();
    const { data: team } = await supabase
      .from("teams")
      .select("id, status")
      .eq("owner_user_id", user.id)
      .maybeSingle();

    if (team?.status === "APPROVED") {
      canParticipate = true;
      const { data: participation } = await supabase
        .from("event_participants")
        .select("id")
        .eq("event_id", event.id)
        .eq("team_id", team.id)
        .maybeSingle();
      isParticipating = !!participation;
    }
  }

  const supabase = await createClient();
  const { count: participantCount } = await supabase
    .from("event_participants")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event.id);

  return (
    <div className="container-app py-12">
      <FadeIn className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <MediaPlaceholder imageUrl={event.image_url} alt={event.title} aspect="video" />

          <div>
            <h1 className="font-heading text-3xl font-bold tracking-wide text-textPrimary">
              {event.title}
            </h1>
            <Link
              href={`/takimlar/${event.team.id}`}
              className="mt-1 inline-block text-sm font-medium text-primaryAlt hover:underline"
            >
              Düzenleyen: {event.team.name}
            </Link>
          </div>

          <p className="whitespace-pre-line text-textSecondary">{event.description}</p>

          <div>
            <h2 className="font-heading text-lg font-semibold text-textPrimary">
              Medya Galerisi
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {galleryPlaceholders.map((_, i) => (
                <MediaPlaceholder key={i} aspect="square" />
              ))}
            </div>
          </div>
        </div>

        <aside className="hud-corners flex h-fit flex-col gap-4 rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center gap-2 text-sm text-textPrimary">
            <CalendarIcon className="size-4 text-primary" aria-hidden="true" />
            {formatEventDate(event.date)}
          </div>
          <div className="flex items-center gap-2 text-sm text-textPrimary">
            <MapPinIcon className="size-4 text-primary" aria-hidden="true" />
            {event.location}
          </div>

          <CapacityBar current={participantCount ?? 0} capacity={event.capacity} />

          <EventParticipationButton
            eventId={event.id}
            isParticipating={isParticipating}
            canParticipate={canParticipate}
            isLoggedIn={!!user}
          />
        </aside>
      </FadeIn>
    </div>
  );
}
