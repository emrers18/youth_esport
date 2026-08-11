"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
type Session = {
  user: {
    id: string;
    email: string;
    role: "TEAM" | "ADMIN";
  };
} | null;
import { GamepadIcon, MenuIcon, ShieldIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/ciktilar", label: "Proje Çıktıları" },
  { href: "/takimlar", label: "Takımlar" },
  { href: "/etkinlikler", label: "Etkinlikler" },
];

export function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const accountHref = session?.user ? "/panel" : "/giris";
  const accountLabel = session?.user ? "Panel" : "Takım Girişi";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2 font-heading text-lg font-bold tracking-wide text-textPrimary"
        >
          <GamepadIcon
            className="size-6 text-primary transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
            aria-hidden="true"
          />
          YouthArena
          <span className="text-primary transition-[text-shadow] duration-300 group-hover:text-glow-primary">
            Esports
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Ana navigasyon">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  active ? "text-primary" : "text-textSecondary"
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink href={accountHref}>{accountLabel}</ButtonLink>
          <div className="h-6 w-px bg-border" aria-hidden="true" />
          <Link
            href={session?.user?.role === "ADMIN" ? "/admin" : "/admin/giris"}
            className="flex items-center gap-1 text-xs text-textSecondary transition-colors hover:text-primary"
            aria-label="Admin girişi"
          >
            <ShieldIcon className="size-3.5" aria-hidden="true" />
            Admin
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Menüyü aç" />
            }
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-border bg-surface">
            <SheetHeader>
              <SheetTitle className="font-heading text-textPrimary">Menü</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Mobil navigasyon">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-textPrimary hover:bg-background"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" aria-hidden="true" />
              <ButtonLink href={accountHref} onClick={() => setOpen(false)} className="w-full">
                {accountLabel}
              </ButtonLink>
              <Link
                href={session?.user?.role === "ADMIN" ? "/admin" : "/admin/giris"}
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-1.5 px-3 py-2 text-xs text-textSecondary"
              >
                <ShieldIcon className="size-3.5" aria-hidden="true" />
                Admin girişi
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
