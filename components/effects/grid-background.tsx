import { cn } from "@/lib/utils";

/**
 * Decorative animated circuit-grid overlay. Purely visual (aria-hidden) —
 * used behind hero/section headers for an esports HUD feel.
 */
export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-grid-pattern animate-grid-pan [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
      <div className="absolute -left-24 top-0 size-72 rounded-full bg-primary/25 blur-[100px] animate-float-orb" />
      <div
        className="absolute -right-16 top-24 size-64 rounded-full bg-secondary/20 blur-[100px] animate-float-orb"
        style={{ animationDelay: "-3s" }}
      />
    </div>
  );
}
