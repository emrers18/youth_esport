import Link from "next/link";
import { CalendarIcon, MapPinIcon, ArrowRightIcon } from "lucide-react";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { CapacityBar } from "@/components/capacity-bar";
import { Card, CardContent } from "@/components/ui/card";
import { formatEventDate } from "@/lib/format";

export type EventCardData = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  imageUrl: string | null;
  capacity: number;
  team: { id: string; name: string };
  _count?: { participants: number };
};

export function EventCard({ event }: { event: EventCardData }) {
  return (
    <Card className="hud-corners group relative overflow-hidden border-border bg-surface py-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
      <Link
        href={`/events/${event.id}`}
        className="absolute inset-0 z-10"
        aria-label={event.title}
      />
      <MediaPlaceholder
        imageUrl={event.imageUrl}
        alt={`${event.title} image`}
        aspect="video"
        className="rounded-none transition-transform duration-500 group-hover:scale-105"
      />
      <CardContent className="flex flex-col gap-3 p-5">
        <h3 className="font-heading text-lg font-semibold text-textPrimary line-clamp-1 transition-colors group-hover:text-primary">
          {event.title}
        </h3>

        <Link
          href={`/teams/${event.team.id}`}
          className="relative z-20 w-fit text-xs font-medium text-primaryAlt hover:underline"
        >
          {event.team.name}
        </Link>

        <p className="line-clamp-2 text-sm text-textSecondary">{event.description}</p>

        <div className="flex flex-col gap-1.5 text-sm text-textSecondary">
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="size-3.5" aria-hidden="true" />
            {formatEventDate(event.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPinIcon className="size-3.5" aria-hidden="true" />
            {event.location}
          </span>
        </div>

        <CapacityBar current={event._count?.participants ?? 0} capacity={event.capacity} />

        <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          View Details
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}
