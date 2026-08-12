import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { TeamApplicationForm } from "@/components/team-application-form";
import { getAuthUser, createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function NewTeamPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/giris?callbackUrl=/takimlar/yeni");
  }
  if (user.role !== "TEAM") {
    redirect("/takimlar");
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
        title="Takımını Oluştur"
        description="Aşağıdaki formu doldurarak Bridges projesine katılmak için başvurunu gönder. Başvurun admin onayından sonra Takımlar sayfasında görünür olacak."
      />
      <div className="container-app max-w-3xl pb-20">
        <TeamApplicationForm />
      </div>
    </div>
  );
}
