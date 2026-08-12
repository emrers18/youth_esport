import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, MapPinIcon, UsersIcon, CalendarIcon, GamepadIcon } from "lucide-react";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { StatusBadge } from "@/components/status-badge";
import { RoleBadge } from "@/components/role-badge";
import { GridBackground } from "@/components/effects/grid-background";
import { getTeamById } from "@/lib/data";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamById(id);

  if (!team) {
    notFound();
  }

  return (
    <div>
      <div className="relative overflow-hidden border-b border-border">
        <GridBackground className="opacity-40" />
        <div className="container-app relative flex flex-col gap-6 py-10">
          <Link
            href="/teams"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-textSecondary transition-colors hover:text-primary"
          >
            <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
            All Teams
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="hud-corners relative w-32 shrink-0 sm:w-40">
              <MediaPlaceholder
                imageUrl={team.logo_url}
                alt={`${team.name} logo`}
                aspect="square"
                label="Logo Coming Soon"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl font-bold tracking-wide text-textPrimary sm:text-4xl">
                  <span className="text-gold-dark">[{team.tag}]</span> {team.name}
                </h1>
                {team.status !== "APPROVED" && <StatusBadge status={team.status} />}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-textSecondary">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-primaryAlt/30 bg-primaryAlt/10 px-2.5 py-1 font-medium text-primaryAlt">
                  <GamepadIcon className="size-3.5" aria-hidden="true" />
                  {team.main_game}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPinIcon className="size-4" aria-hidden="true" />
                  {team.country}
                </span>
                <span className="flex items-center gap-1.5">
                  <UsersIcon className="size-4" aria-hidden="true" />
                  {team._count.members} members
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-app grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="font-heading text-lg font-semibold text-textPrimary">About</h2>
            <p className="mt-3 text-textSecondary">{team.description}</p>
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold text-textPrimary">Roster</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {team.members.map((member: { id: string; full_name: string; role: string }) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-textPrimary transition-colors hover:border-primary/30"
                >
                  {member.full_name}
                  <RoleBadge role={member.role} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {team.events.length > 0 && (
          <aside className="flex h-fit flex-col gap-3 rounded-lg border border-border bg-surface p-5">
            <h2 className="font-heading text-lg font-semibold text-textPrimary">
              Events Organized
            </h2>
            <ul className="flex flex-col gap-2">
              {team.events.map((event: { id: string; title: string; date: string }) => (
                <li key={event.id}>
                  <Link
                    href={`/events/${event.id}`}
                    className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-textPrimary transition-colors hover:border-primary/40"
                  >
                    <CalendarIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="line-clamp-1">{event.title}</span>
                    <span className="ml-auto shrink-0 text-xs text-textSecondary">
                      {formatEventDate(event.date)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
