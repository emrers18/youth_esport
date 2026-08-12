import { FileTextIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { PixelTrophy } from "@/components/effects/pixel-icons";
import { FadeIn } from "@/components/effects/fade-in";
import { getProjectOutputs } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProjectOutputsPage() {
  const outputs = await getProjectOutputs();

  return (
    <div>
      <PageHeader
        title="Project Outputs"
        description="Guides, reports, and training materials produced as part of the Bridges project."
      />

      <div className="container-app pb-16">
        {outputs.length === 0 ? (
          <EmptyState icon={PixelTrophy} title="There are no published outputs yet." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outputs.map((output, i) => (
              <FadeIn key={output.id} delay={i * 60}>
                <Card className="hud-corners border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex size-12 items-center justify-center rounded-md border border-border bg-background text-primary">
                      <FileTextIcon className="size-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-textPrimary">
                      {output.title}
                    </h3>
                    <p className="text-sm text-textSecondary">{output.description}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs text-textSecondary">
                        {formatDate(output.publish_date)}
                      </span>
                      <a
                        href={output.file_url ?? "#"}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Download →
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        )}

        {outputs.length > 0 && (
          <FadeIn className="mt-16">
            <h2 className="font-heading text-2xl font-bold tracking-wide text-textPrimary">
              Timeline
            </h2>
            <ol className="mt-6 flex flex-col gap-6 border-l border-border pl-6">
              {outputs.map((output, i) => (
                <li key={output.id} className="relative">
                  <span
                    className="animate-pulse-glow absolute -left-[29px] top-1.5 size-3 rounded-full border-2 border-background bg-primary"
                    aria-hidden="true"
                  />
                  <FadeIn delay={i * 60}>
                    <span className="text-xs font-semibold text-textSecondary">
                      {formatDate(output.publish_date)}
                    </span>
                    <p className="font-medium text-textPrimary">{output.title}</p>
                  </FadeIn>
                </li>
              ))}
            </ol>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
