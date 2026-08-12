import { cn } from "@/lib/utils";

export function CapacityBar({
  current,
  capacity,
  label = "Teams",
  className,
}: {
  current: number;
  capacity: number;
  label?: string;
  className?: string;
}) {
  const pct = capacity > 0 ? Math.min(100, Math.round((current / capacity) * 100)) : 0;
  const isFull = current >= capacity;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between text-xs text-textSecondary">
        <span>{label}</span>
        <span className={cn("font-semibold tabular-nums", isFull ? "text-danger" : "text-textPrimary")}>
          {current}/{capacity}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-background ring-1 ring-border">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isFull
              ? "bg-danger"
              : "bg-linear-to-r from-primary to-secondary"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
