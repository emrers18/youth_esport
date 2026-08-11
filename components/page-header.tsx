import { cn } from "@/lib/utils";
import { GridBackground } from "@/components/effects/grid-background";

export function PageHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <GridBackground className="opacity-30" />
      <div className={cn("container-app relative py-12 sm:py-16", className)}>
        <h1 className="font-heading text-3xl font-bold tracking-wide text-textPrimary sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-balance text-textSecondary">{description}</p>
        )}
      </div>
    </div>
  );
}
