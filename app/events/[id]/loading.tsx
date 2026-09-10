import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <div className="container-app py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <Skeleton className="aspect-video rounded-md" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>

        <aside className="flex h-fit flex-col gap-4 rounded-lg border border-border bg-surface p-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-9 w-full rounded-md" />
        </aside>
      </div>
    </div>
  );
}
