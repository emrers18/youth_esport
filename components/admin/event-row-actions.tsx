"use client";

import { useTransition } from "react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmRemoveButton } from "@/components/admin/confirm-remove-button";
import { publishEvent } from "@/lib/actions/event-actions";

type EventStatus = "PENDING_REVIEW" | "PUBLISHED";

export function EventRowActions({
  eventId,
  eventTitle,
  status,
}: {
  eventId: string;
  eventTitle: string;
  status: EventStatus;
}) {
  const [isPending, startTransition] = useTransition();

  const handlePublish = () => {
    startTransition(async () => {
      const result = await publishEvent(eventId);
      if (result.success) {
        toast.success(`${eventTitle} published.`);
      } else {
        toast.error(result.error ?? "The action failed.");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {status === "PENDING_REVIEW" && (
        <Button
          size="sm"
          onClick={handlePublish}
          disabled={isPending}
          className="bg-secondary text-background hover:bg-secondary/90"
        >
          <CheckIcon className="size-4" />
          Approve
        </Button>
      )}
      <ConfirmRemoveButton
        kind="event"
        id={eventId}
        itemLabel={eventTitle}
        confirmDescription="This event will be permanently removed."
        successMessage={`${eventTitle} removed.`}
      />
    </div>
  );
}
