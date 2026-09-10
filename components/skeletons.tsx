import type { ReactElement } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholders that mirror the real components one-for-one — same
 * wrapper, same padding, same block sizes. Anything that drifts from the
 * real layout shows up as a visible jump the moment the data lands, which
 * looks worse than showing nothing at all.
 */

/** Mirrors <TeamCard>. */
export function TeamCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex h-32 items-center justify-center border-b border-border bg-background">
        <Skeleton className="size-24 rounded-md bg-primary/10" />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-6 w-28 rounded-md" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="mt-2 h-4 w-24" />
      </div>
    </div>
  );
}

/** Mirrors <EventCard>. */
export function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <Skeleton className="aspect-video rounded-none" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

/** Mirrors the output card on /outputs. */
export function OutputCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-col gap-3">
        <Skeleton className="size-12 rounded-md" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="mt-1 flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

/** Repeats a skeleton across the same grid the real list uses. */
export function CardGridSkeleton({
  count = 6,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
  Item,
}: {
  count?: number;
  columns?: string;
  Item: () => ReactElement;
}) {
  return (
    <div className={`grid gap-6 ${columns}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Item key={i} />
      ))}
    </div>
  );
}

/** Mirrors the stats strip on the homepage. */
export function StatsStripSkeleton() {
  return (
    <div className="container-app relative grid grid-cols-2 divide-x divide-border py-16 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

/**
 * Mirrors the hero band on the team/event detail pages, where the real title
 * isn't known ahead of time so it has to be a placeholder too.
 */
export function DetailHeroSkeleton() {
  return (
    <div className="border-b border-border">
      <div className="container-app flex flex-col gap-6 py-10">
        <Skeleton className="h-4 w-24" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Skeleton className="size-32 shrink-0 rounded-md sm:size-40" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-64" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-7 w-28 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-md" />
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
