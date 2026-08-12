import { CheckCircle2Icon, ClockIcon, XCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type TeamStatus = "PENDING" | "APPROVED" | "REJECTED";

const statusConfig: Record<
  TeamStatus,
  { label: string; className: string; Icon: typeof ClockIcon }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-warning/15 text-warning border-warning/30",
    Icon: ClockIcon,
  },
  APPROVED: {
    label: "Approved",
    className: "bg-secondary/15 text-secondary border-secondary/30",
    Icon: CheckCircle2Icon,
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-danger/15 text-danger border-danger/30",
    Icon: XCircleIcon,
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: TeamStatus;
  className?: string;
}) {
  const { label, className: statusClassName, Icon } = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold tracking-wide",
        statusClassName,
        className
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
