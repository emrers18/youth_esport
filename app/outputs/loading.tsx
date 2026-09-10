import { PageHeader } from "@/components/page-header";
import { CardGridSkeleton, OutputCardSkeleton } from "@/components/skeletons";

export default function OutputsLoading() {
  return (
    <div>
      <PageHeader
        title="Project Outputs"
        description="Guides, reports, and training materials produced as part of the Bridges project."
      />

      <div className="container-app pb-16">
        <CardGridSkeleton count={6} Item={OutputCardSkeleton} />
      </div>
    </div>
  );
}
