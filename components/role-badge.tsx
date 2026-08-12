import { Crown, Target, Swords, Shield, Megaphone, ChartLine, UserRoundCog } from "lucide-react";
import { cn } from "@/lib/utils";

const roleIconMap: Record<string, typeof Crown> = {
  Captain: Crown,
  "IGL (In-Game Leader)": Target,
  "Duelist / Fragger": Swords,
  Support: Shield,
  Coach: Megaphone,
  Analyst: ChartLine,
  "Substitute Player": UserRoundCog,
};

export function RoleBadge({ role, className }: { role: string; className?: string }) {
  const Icon = roleIconMap[role] ?? UserRoundCog;
  const isCaptain = role === "Captain";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        isCaptain
          ? "border-warning/40 bg-warning/10 text-warning"
          : "border-primaryAlt/30 bg-primaryAlt/10 text-primaryAlt",
        className
      )}
    >
      <Icon className="size-3" aria-hidden="true" />
      {role}
    </span>
  );
}
