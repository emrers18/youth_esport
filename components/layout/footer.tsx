import Link from "next/link";
import { GamepadIcon, Share2Icon, AtSignIcon, PlaySquareIcon, Link2Icon } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/outputs", label: "Project Outputs" },
  { href: "/teams", label: "Teams" },
  { href: "/events", label: "Events" },
];

const socials = [
  { Icon: Share2Icon, label: "Instagram" },
  { Icon: AtSignIcon, label: "X (Twitter)" },
  { Icon: PlaySquareIcon, label: "YouTube" },
  { Icon: Link2Icon, label: "LinkedIn" },
];

const partnerPlaceholders = Array.from({ length: 5 });

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-app grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-textPrimary">
            <GamepadIcon className="size-6 text-primary" aria-hidden="true" />
            YouthArena<span className="text-primary">Esports</span>
          </Link>
          <p className="text-sm text-textSecondary">
            The official website and participant management tool of the
            &ldquo;Bridges: Anti Discriminatory Language and Esports&rdquo; Erasmus+ project.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide text-textPrimary">
            Quick Links
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-textSecondary transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide text-textPrimary">
            Project Partners
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {partnerPlaceholders.map((_, i) => (
              <div
                key={i}
                className="flex h-10 w-20 items-center justify-center rounded-md border border-border bg-background text-[10px] text-textSecondary"
              >
                Logo
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide text-textPrimary">
            Follow Us
          </h3>
          <div className="mt-3 flex gap-3">
            {socials.map(({ Icon, label }) => (
              <span
                key={label}
                role="img"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-md border border-border bg-background text-textSecondary transition-colors hover:text-primary"
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-app flex flex-col gap-2 py-6 text-xs text-textSecondary sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-balance">
            This project is funded by the European Commission&apos;s Erasmus+
            Programme. The content on this website reflects the views only of
            the authors, and the European Commission cannot be held responsible
            for any use which may be made of the information contained herein.
          </p>
          <p>© {new Date().getFullYear()} YouthArenaEsports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
