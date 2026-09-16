import Image from "next/image";
import Link from "next/link";
import { GlobeIcon, MailIcon } from "lucide-react";
import type { SVGProps } from "react";
import { partners } from "@/lib/partners";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/outputs", label: "Project Outputs" },
  { href: "/teams", label: "Teams" },
  { href: "/events", label: "Events" },
];

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

const contacts = [
  { Icon: GlobeIcon, label: "Website", href: "https://ifall.se/" },
  { Icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/_ifall/" },
  { Icon: MailIcon, label: "Email", href: "mailto:info@ifall.se" },
  { Icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/ifallsverige" },
  { Icon: YoutubeIcon, label: "YouTube", href: "https://www.youtube.com/@integrationforalla4345" },
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
            {partners.map((partner) => {
              const logo = (
                <Image
                  src={partner.src}
                  alt={`${partner.name} logo`}
                  width={partner.width}
                  height={partner.height}
                  className="h-full w-full object-contain"
                />
              );
              const className =
                "flex h-20 w-32 items-center justify-center rounded-md border border-border bg-background p-2";
              return partner.href ? (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${partner.name} website`}
                  className={`${className} transition-colors hover:border-primary`}
                >
                  {logo}
                </a>
              ) : (
                <div key={partner.name} className={className}>
                  {logo}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide text-textPrimary">
            Contact
          </h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {contacts.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                aria-label={label}
                title={href.replace(/^mailto:/, "")}
                className="flex size-9 items-center justify-center rounded-md border border-border bg-background text-textSecondary transition-colors hover:text-primary"
              >
                <Icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
          <a
            href="mailto:info@ifall.se"
            className="mt-3 inline-block text-sm text-textSecondary transition-colors hover:text-primary"
          >
            info@ifall.se
          </a>
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
