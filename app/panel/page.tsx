import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusIcon, UsersIcon, CalendarIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { TeamProfileForm } from "@/components/team-profile-form";
import { ButtonLink } from "@/components/ui/button-link";
import { getAuthUser, createClient } from "@/lib/supabase-server";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TeamPanelPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/giris?callbackUrl=/panel");
  }

  const supabase = await createClient();

  const { data: team } = await supabase
    .from("teams")
    .select("*, events(*, id, title, date), team_members(count)")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (!team) {
    return (
      <div>
        <PageHeader title="Takım Paneli" />
        <div className="container-app flex flex-col items-center gap-4 pb-20 text-center">
          <p className="max-w-md text-textSecondary">
            Henüz bir takım başvurunuz yok. Bridges projesine katılmak için
            takımınızı oluşturun.
          </p>
          <ButtonLink href="/takimlar/yeni" className="shadow-glow">
            <PlusIcon className="size-4" />
            Takımını Oluştur
          </ButtonLink>
        </div>
      </div>
    );
  }

  const memberCount = team.team_members?.[0]?.count ?? 0;
  const events = team.events ?? [];

  return (
    <div>
      <PageHeader title="Takım Paneli" />

      <div className="container-app flex flex-col gap-10 pb-20">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-xl font-bold text-textPrimary">
                <span className="text-primary">[{team.tag}]</span> {team.name}
              </h2>
              <StatusBadge status={team.status} />
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-textSecondary">
              <UsersIcon className="size-3.5" aria-hidden="true" />
              {memberCount} üye · {team.country} · {team.main_game}
            </p>
          </div>
          {team.status === "REJECTED" && team.rejection_note && (
            <div className="max-w-md rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              <strong>Ret notu:</strong> {team.rejection_note}
            </div>
          )}
        </div>

        <section>
          <h2 className="font-heading text-xl font-bold text-textPrimary">Profil Düzenle</h2>
          <div className="mt-4 max-w-xl">
            <TeamProfileForm
              defaultValues={{
                name: team.name,
                tag: team.tag,
                mainGame: team.main_game,
                country: team.country,
                description: team.description,
                captainEmail: team.captain_email,
              }}
            />
          </div>
        </section>

        {team.status === "APPROVED" && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-textPrimary">Etkinliklerim</h2>
              <ButtonLink href="/etkinlikler/yeni" size="sm" variant="outline">
                <PlusIcon className="size-4" />
                Yeni Etkinlik
              </ButtonLink>
            </div>

            {events.length === 0 ? (
              <p className="mt-4 text-sm text-textSecondary">
                Henüz bir etkinlik oluşturmadınız.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-2">
                {events.map((event: { id: string; title: string; date: string }) => (
                  <li key={event.id}>
                    <Link
                      href={`/etkinlikler/${event.id}`}
                      className="flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-textPrimary transition-colors hover:border-primary/40"
                    >
                      <CalendarIcon className="size-4 text-primary" aria-hidden="true" />
                      {event.title}
                      <span className="ml-auto text-xs text-textSecondary">
                        {formatEventDate(event.date)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
