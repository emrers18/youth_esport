"use client";

import { useState, useTransition } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { approveTeam, rejectTeam } from "@/lib/actions/team-actions";

export function PendingTeamActions({ teamId, teamName }: { teamId: string; teamName: string }) {
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveTeam(teamId);
      if (result.success) {
        toast.success(`${teamName} approved.`);
      } else {
        toast.error(result.error ?? "The action failed.");
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectTeam(teamId, note || undefined);
      if (result.success) {
        toast.success(`${teamName} rejected.`);
        setDialogOpen(false);
      } else {
        toast.error(result.error ?? "The action failed.");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={handleApprove} disabled={isPending} className="bg-secondary text-background hover:bg-secondary/90">
        <CheckIcon className="size-4" />
        Approve
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger
          render={
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              className="border-danger/40 text-danger hover:bg-danger/10"
            />
          }
        >
          <XIcon className="size-4" />
          Reject
        </DialogTrigger>
        <DialogContent className="border-border bg-surface">
          <DialogHeader>
            <DialogTitle className="font-heading text-textPrimary">
              Reject {teamName}&apos;s application
            </DialogTitle>
            <DialogDescription className="text-textSecondary">
              You can optionally add a rejection note that will be sent to the team.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-24"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReject} disabled={isPending} className="bg-danger text-textPrimary hover:bg-danger/90">
              {isPending ? "Submitting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
