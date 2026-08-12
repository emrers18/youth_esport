import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { TeamApplicationForm } from "@/components/team-application-form";
import { getAuthUser, createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function NewTeamPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?callbackUrl=/teams/new");
  }
  if (user.role !== "TEAM") {
    redirect("/teams");
  }

  const supabase = await createClient();
  const { data: existingTeam } = await supabase
    .from("teams")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (existingTeam) {
    redirect("/panel");
  }

  return (
    <div>
      <PageHeader
        title="Create Your Team"
        description="Fill out the form below to submit your application to join the Bridges project. Your application will appear on the Teams page once approved by an admin."
      />
      <div className="container-app max-w-3xl pb-20">
        <TeamApplicationForm />
      </div>
    </div>
  );
}
