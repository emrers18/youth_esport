import { HourglassIcon, LogInIcon, UserPlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    Icon: UserPlusIcon,
    title: "Sign up & apply",
    description:
      "Create your account and fill in your team details, logo and members in a single form.",
  },
  {
    Icon: HourglassIcon,
    title: "Wait for approval",
    description:
      "Project admins review your application. You can follow its status in your team panel.",
  },
  {
    Icon: LogInIcon,
    title: "Log in & play",
    description:
      "Once approved, sign in with Team Login to manage your profile, gallery and join events.",
  },
];

/**
 * The three-step path from visitor to active team. Shared by the homepage
 * and the login page so new teams see the same explanation wherever they land.
 */
export function JoinSteps({
  layout = "row",
  className,
}: {
  layout?: "row" | "column";
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "grid gap-4",
        layout === "row" ? "md:grid-cols-3" : "grid-cols-1",
        className,
      )}
    >
      {steps.map(({ Icon, title, description }, i) => (
        <li
          key={title}
          className="flex gap-4 rounded-md border border-border bg-background/60 p-4"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-heading text-base font-semibold text-textPrimary">
              <span className="text-primary">{i + 1}.</span> {title}
            </p>
            <p className="text-sm leading-relaxed text-textSecondary">{description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
