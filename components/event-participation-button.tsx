"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { toggleEventParticipation } from "@/lib/actions/event-actions";

export function EventParticipationButton({
  eventId,
  isParticipating,
  canParticipate,
  isLoggedIn,
}: {
  eventId: string;
  isParticipating: boolean;
  canParticipate: boolean;
  isLoggedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <ButtonLink href="/giris" className="w-full">
        Katılmak için Giriş Yap
      </ButtonLink>
    );
  }

  if (!canParticipate) {
    return (
      <Button className="w-full" disabled title="Yalnızca onaylı takımlar katılabilir.">
        Katılım Yalnızca Onaylı Takımlar İçin
      </Button>
    );
  }

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleEventParticipation(eventId);
      if (result.success) {
        toast.success(isParticipating ? "Katılımdan ayrıldınız." : "Etkinliğe katıldınız.");
        router.refresh();
      } else {
        toast.error(result.error ?? "İşlem başarısız oldu.");
      }
    });
  };

  return (
    <Button
      className="w-full"
      variant={isParticipating ? "outline" : "default"}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "İşleniyor..." : isParticipating ? "Katılımdan Ayrıl" : "Etkinliğe Katıl"}
    </Button>
  );
}
