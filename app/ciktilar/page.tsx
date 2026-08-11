import { FileTextIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { PixelTrophy } from "@/components/effects/pixel-icons";
import { getProjectOutputs } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProjectOutputsPage() {
  const outputs = await getProjectOutputs();

  return (
    <div>
      <PageHeader
        title="Proje Çıktıları"
        description="Bridges projesi kapsamında üretilen rehberler, raporlar ve eğitim materyalleri."
      />

      <div className="container-app pb-16">
        {outputs.length === 0 ? (
          <EmptyState icon={PixelTrophy} title="Henüz yayınlanmış bir çıktı bulunmuyor." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outputs.map((output) => (
              <Card
                key={output.id}
                className="hud-corners border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
              >
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
                      İndir →
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {outputs.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold tracking-wide text-textPrimary">
              Zaman Çizelgesi
            </h2>
            <ol className="mt-6 flex flex-col gap-6 border-l border-border pl-6">
              {outputs.map((output) => (
                <li key={output.id} className="relative">
                  <span
                    className="animate-pulse-glow absolute -left-[29px] top-1.5 size-3 rounded-full border-2 border-background bg-primary"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-semibold text-textSecondary">
                    {formatDate(output.publish_date)}
                  </span>
                  <p className="font-medium text-textPrimary">{output.title}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
