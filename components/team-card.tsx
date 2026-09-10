import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, GamepadIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PixelShield } from "@/components/effects/pixel-icons";

export type TeamCardData = {
  id: string;
  name: string;
  tag: string;
  logoUrl?: string | null;
  country?: string | null;
  mainGame?: string | null;
  memberCount?: number | null;
};

type TeamCardProps = { team: TeamCardData };

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/teams/${team.id}`} className="group block h-full">
      <Card className="hud-corners hud-corners-gold relative h-full gap-0 overflow-hidden border border-border bg-surface p-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold/50 group-hover:shadow-glow-gold">
        {/* Crest banner — the logo reads as an emblem rather than a thumbnail,
            and object-contain keeps wide or tall logos from being cropped. */}
        <div className="relative flex h-32 items-center justify-center overflow-hidden border-b border-border bg-background">
          <div className="bg-grid-pattern absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent" aria-hidden="true" />

          {team.logoUrl ? (
            <Image
              src={team.logoUrl}
              alt={`${team.name} logo`}
              width={128}
              height={128}
              className="relative size-24 object-contain transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <PixelShield className="relative size-20 text-primary/40 transition-transform duration-500 group-hover:scale-110" />
          )}

          <span className="absolute left-3 top-3 inline-flex items-center rounded-md border border-gold/40 bg-surface/90 px-2 py-0.5 font-heading text-xs font-bold tracking-widest text-gold-dark">
            {team.tag}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="font-heading text-lg font-semibold leading-tight text-textPrimary transition-colors group-hover:text-primary">
            {team.name}
          </h3>

          {team.mainGame && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-md border border-primaryAlt/30 bg-primaryAlt/10 px-2.5 py-1 text-xs font-medium text-primaryAlt">
              <GamepadIcon className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="line-clamp-1">{team.mainGame}</span>
            </span>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-textSecondary">
            {team.country && (
              <span className="flex min-w-0 items-center gap-1.5">
                <MapPinIcon className="size-4 shrink-0" aria-hidden="true" />
                <span className="line-clamp-1">{team.country}</span>
              </span>
            )}
            {typeof team.memberCount === "number" && (
              <span className="flex shrink-0 items-center gap-1.5">
                <UsersIcon className="size-4" aria-hidden="true" />
                {team.memberCount} {team.memberCount === 1 ? "member" : "members"}
              </span>
            )}
          </div>

          {/* mt-auto pins the CTA to the bottom so cards in a row stay aligned
              even when names wrap to a different number of lines. */}
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary">
            View Details
            <ArrowRightIcon
              className="size-3.5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </Card>
    </Link>
  );
}
