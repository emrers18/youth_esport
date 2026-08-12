import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { EventForm } from "@/components/event-form";
import { getAuthUser, createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/giris?callbackUrl=/etkinlikler/yeni");
  }
  if (user.role !== "TEAM") {
    redirect("/etkinlikler");
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
        title="Etkinlik Oluştur"
        description={`${team.name} adına yeni bir etkinlik yayınla.`}
      />
      <div className="container-app max-w-3xl pb-20">
        <EventForm />
      </div>
    </div>
  );
}
