import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton, EventCardSkeleton } from "@/components/skeletons";

export default function EventsLoading() {
  return (
    <div>
      <PageHeader
        title="Events"
        description="Tournaments, workshops, and meetups organized as part of the Bridges project."
      />

      <div className="container-app pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-9 w-36" />
        </div>

        <div className="mt-8">
          <CardGridSkeleton count={6} Item={EventCardSkeleton} />
        </div>
      </div>
    </div>
  );
}
