import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { EventForm } from "@/components/event-form";
import { getAuthUser, createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?callbackUrl=/events/new");
  }
  if (user.role !== "TEAM") {
    redirect("/events");
  }

  const supabase = await createClient();
  const { data: team } = await supabase
    .from("teams")
    .select("name, status")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (!team || team.status !== "APPROVED") {
    redirect("/panel");
  }

  return (
    <div>
      <PageHeader
        title="Create Event"
        description={`Publish a new event on behalf of ${team.name}.`}
      />
      <div className="container-app max-w-3xl pb-20">
        <EventForm />
      </div>
    </div>
  );
}
