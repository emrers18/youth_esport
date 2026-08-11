import { AnimatedCounter } from "@/components/animated-counter";

export function StatCounter({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-glow-primary font-heading text-4xl font-bold tracking-wide text-primary sm:text-5xl">
        <AnimatedCounter value={value} />
      </span>
      <span className="text-sm text-textSecondary">{label}</span>
    </div>
  );
}
