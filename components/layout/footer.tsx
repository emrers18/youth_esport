import Image from "next/image";
import Link from "next/link";
import { Share2Icon, AtSignIcon, PlaySquareIcon, Link2Icon } from "lucide-react";
import { partners } from "@/lib/partners";

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

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-app grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-textPrimary">
            <Image
              src="/gallery/Erasmus+_Logo.svg"
              alt="Erasmus+ logo"
              width={312}
              height={89}
              className="h-9 w-auto"
            />
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
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex h-14 w-24 items-center justify-center rounded-md border border-border bg-background p-2"
              >
                <Image
                  src={partner.src}
                  alt={`${partner.name} logo`}
                  width={partner.width}
                  height={partner.height}
                  className="h-full w-full object-contain"
                />
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
          <p>© {new Date().getFullYear()} YouthEsportsArena. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
