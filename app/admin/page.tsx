import { UsersIcon, MapPinIcon, CalendarIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { PendingTeamActions } from "@/components/admin/pending-team-actions";
import { ConfirmRemoveButton } from "@/components/admin/confirm-remove-button";
import { EventRowActions } from "@/components/admin/event-row-actions";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  getPendingTeams,
  getApprovedTeamsAdmin,
  getAllEventsAdmin,
} from "@/lib/data";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [pendingTeams, approvedTeams, events] = await Promise.all([
    getPendingTeams(),
    getApprovedTeamsAdmin(),
    getAllEventsAdmin(),
  ]);

  return (
    <div>
      <PageHeader
        title="Admin Panel"
        description="Manage team applications and review events."
      />

      <div className="container-app pb-20">
        <Tabs defaultValue="pending">
          <TabsList className="bg-surface">
            <TabsTrigger value="pending">
              Pending Teams
              {pendingTeams.length > 0 && (
                <span className="ml-1.5 rounded-full bg-warning/20 px-1.5 py-0.5 text-[10px] font-bold text-warning">
                  {pendingTeams.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved Teams</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingTeams.length === 0 ? (
              <p className="text-textSecondary">There are no pending applications.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {pendingTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-lg font-semibold text-textPrimary">
                          {team.name}
                        </h3>
                        <StatusBadge status={team.status} />
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-textSecondary">
                        <MapPinIcon className="size-3.5" aria-hidden="true" />
                        {team.country}
                        <span className="mx-1">·</span>
                        <UsersIcon className="size-3.5" aria-hidden="true" />
                        {team.members.length} members
                      </p>
                      <p className="mt-2 max-w-2xl text-sm text-textSecondary">
                        {team.description}
                      </p>
                    </div>
                    <PendingTeamActions teamId={team.id} teamName={team.name} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {approvedTeams.length === 0 ? (
              <p className="text-textSecondary">There are no approved teams.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {approvedTeams.map((team) => (
                  <div
                    key={team.id}
                    className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-textPrimary">
                        {team.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-textSecondary">
                        <MapPinIcon className="size-3.5" aria-hidden="true" />
                        {team.country}
                        <span className="mx-1">·</span>
                        <UsersIcon className="size-3.5" aria-hidden="true" />
                        {team._count.members} members
                        <span className="mx-1">·</span>
                        <CalendarIcon className="size-3.5" aria-hidden="true" />
                        {team._count.events} events
                      </p>
                    </div>
                    <ConfirmRemoveButton
                      kind="team"
                      id={team.id}
                      itemLabel={team.name}
                      confirmDescription="The team and all associated members/events will be permanently deleted."
                      successMessage={`${team.name} removed.`}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            {events.length === 0 ? (
              <p className="text-textSecondary">There are no events yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-textPrimary">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-sm text-textSecondary">
                        {event.team.name} · {formatEventDate(event.date)}
                      </p>
                    </div>
                    <EventRowActions
                      eventId={event.id}
                      eventTitle={event.title}
                      status={event.status}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
