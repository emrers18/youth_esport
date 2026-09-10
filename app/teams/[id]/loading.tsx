import { Skeleton } from "@/components/ui/skeleton";
import { DetailHeroSkeleton } from "@/components/skeletons";

export default function TeamDetailLoading() {
  return (
    <div>
      <DetailHeroSkeleton />

      <div className="container-app grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <div>
            <Skeleton className="h-5 w-20" />
            <div className="mt-3 flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          <div>
            <Skeleton className="h-5 w-20" />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-11 rounded-md" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex h-fit flex-col gap-3 rounded-lg border border-border bg-surface p-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
