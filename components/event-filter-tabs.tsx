"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

export function EventFilterTabs({ active }: { active: "upcoming" | "past" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="inline-flex rounded-md border border-border bg-surface p-1">
      {tabs.map((tab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("filter", tab.value);
        const isActive = active === tab.value;
        return (
          <Link
            key={tab.value}
            href={`${pathname}?${params.toString()}`}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-textPrimary shadow-glow"
                : "text-textSecondary hover:text-textPrimary"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
