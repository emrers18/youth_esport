import { PlusIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { TeamCard } from "@/components/team-card";
import { TeamSearch } from "@/components/team-search";
import { EmptyState } from "@/components/empty-state";
import { PixelShield } from "@/components/effects/pixel-icons";
import { FadeIn } from "@/components/effects/fade-in";
import { ButtonLink } from "@/components/ui/button-link";
import { getAuthUser } from "@/lib/supabase-server";
import { getApprovedTeams } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TeamsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [teams, user] = await Promise.all([getApprovedTeams(q), getAuthUser()]);

  const createHref = user
    ? user.role === "TEAM"
      ? "/teams/new"
      : "/panel"
    : "/login";

  return (
    <div>
      <PageHeader
        title="Teams"
        description="Discover the approved teams taking part in the Bridges project."
      />

      <div className="container-app pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TeamSearch defaultValue={q} />
          <ButtonLink href={createHref} className="shadow-glow">
            <PlusIcon className="size-4" />
            Create Your Team
          </ButtonLink>
        </div>

        {teams.length === 0 ? (
          <EmptyState
            icon={PixelShield}
            title={q ? `No results found for "${q}".` : "There are no approved teams yet."}
            description={!q ? "Be the first to create a team and lead the list." : undefined}
          />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team, i) => (
              <FadeIn key={team.id} delay={i * 60}>
                <TeamCard
                  team={{
                    id: team.id,
                    name: team.name,
                    tag: team.tag,
                    logoUrl: team.logo_url,
                  }}
                />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
