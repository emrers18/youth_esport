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
      <ButtonLink href="/login" className="w-full">
        Sign In to Join
      </ButtonLink>
    );
  }

  if (!canParticipate) {
    return (
      <Button className="w-full" disabled title="Only approved teams can participate.">
        Participation Is for Approved Teams Only
      </Button>
    );
  }

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleEventParticipation(eventId);
      if (result.success) {
        toast.success(isParticipating ? "You left the event." : "You joined the event.");
        router.refresh();
      } else {
        toast.error(result.error ?? "The action failed.");
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
      {isPending ? "Processing..." : isParticipating ? "Leave Event" : "Join Event"}
    </Button>
  );
}
