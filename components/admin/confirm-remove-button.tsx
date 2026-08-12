"use client";

import { useState, useTransition } from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { removeTeam } from "@/lib/actions/team-actions";
import { removeEvent } from "@/lib/actions/event-actions";

export function ConfirmRemoveButton({
  kind,
  id,
  itemLabel,
  confirmDescription,
  successMessage,
}: {
  kind: "team" | "event";
  id: string;
  itemLabel: string;
  confirmDescription: string;
  successMessage: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = kind === "team" ? await removeTeam(id) : await removeEvent(id);
      if (result.success) {
        toast.success(successMessage);
        setOpen(false);
      } else {
        toast.error(result.error ?? "The action failed.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            variant="outline"
            className="border-danger/40 text-danger hover:bg-danger/10"
            aria-label={`Remove ${itemLabel}`}
          />
        }
      >
        <Trash2Icon className="size-4" />
        Remove
      </DialogTrigger>
      <DialogContent className="border-border bg-surface">
        <DialogHeader>
          <DialogTitle className="font-heading text-textPrimary">Remove {itemLabel}?</DialogTitle>
          <DialogDescription className="text-textSecondary">{confirmDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending} className="bg-danger text-textPrimary hover:bg-danger/90">
            {isPending ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
