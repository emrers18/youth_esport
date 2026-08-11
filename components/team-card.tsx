import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export type TeamCardData = {
  id: string;
  name: string;
  tag: string;
};

export function TeamCard({ team }: { team: TeamCardData }) {
  return (
    <Link href={`/takimlar/${team.id}`} className="group block">
      <Card className="hud-corners relative overflow-hidden border-border bg-surface transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-glow">
        <CardContent className="flex flex-col gap-3 p-5">
          <div>
            <span className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-background/80 px-2 py-0.5 font-heading text-xs font-bold tracking-widest text-primary">
              {team.tag}
            </span>
            <h3 className="mt-2 font-heading text-lg font-semibold text-textPrimary transition-colors group-hover:text-primary">
              {team.name}
            </h3>
          </div>

          <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Detay Gör
            <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
