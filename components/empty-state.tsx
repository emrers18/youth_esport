import type { ComponentType } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      <Icon className="text-textSecondary opacity-60" />
      <p className="font-heading text-lg font-semibold text-textPrimary">{title}</p>
      {description && <p className="max-w-sm text-sm text-textSecondary">{description}</p>}
    </div>
  );
}
