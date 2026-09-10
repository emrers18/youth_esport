import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton, TeamCardSkeleton } from "@/components/skeletons";

// The header text is static, so it renders for real here rather than as a
// placeholder — it paints instantly and doesn't move when the data lands.
export default function TeamsLoading() {
  return (
    <div>
      <PageHeader
        title="Teams"
        description="Discover the approved teams taking part in the Bridges project."
      />

      <div className="container-app pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-full max-w-sm" />
          <Skeleton className="h-9 w-40" />
        </div>

        <div className="mt-8">
          <CardGridSkeleton count={6} Item={TeamCardSkeleton} />
        </div>
      </div>
    </div>
  );
}
