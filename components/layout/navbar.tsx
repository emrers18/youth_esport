"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
type Session = {
  user: {
    id: string;
    email: string;
    role: "TEAM" | "ADMIN";
  };
} | null;
import {
  GamepadIcon,
  MenuIcon,
  ShieldIcon,
  ChevronDownIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const panelHref = isAdmin ? "/admin" : "/panel";
  const panelLabel = isAdmin ? "Admin Paneli" : "Panelim";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Çıkış yapıldı.");
    setOpen(false);
    router.push("/");
    router.refresh();
  };

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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" className="gap-1.5 pr-2.5" />
                }
              >
                {panelLabel}
                <ChevronDownIcon className="size-3.5 text-textSecondary" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="truncate text-textSecondary">
                    {user.email}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<Link href={panelHref} />}
                >
                  <LayoutDashboardIcon className="size-4" aria-hidden="true" />
                  {panelLabel}
                </DropdownMenuItem>
                {!isAdmin && (
                  <DropdownMenuItem render={<Link href="/admin/giris" />}>
                    <ShieldIcon className="size-4" aria-hidden="true" />
                    Admin Girişi
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOutIcon className="size-4" aria-hidden="true" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <ButtonLink href="/giris">Takım Girişi</ButtonLink>
              <div className="h-6 w-px bg-border" aria-hidden="true" />
              <Link
                href="/admin/giris"
                className="flex items-center gap-1 text-xs text-textSecondary transition-colors hover:text-primary"
                aria-label="Admin girişi"
              >
                <ShieldIcon className="size-3.5" aria-hidden="true" />
                Admin
              </Link>
            </>
          )}
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

              {user ? (
                <>
                  <p className="truncate px-3 py-1 text-xs text-textSecondary">{user.email}</p>
                  <ButtonLink href={panelHref} onClick={() => setOpen(false)} className="w-full">
                    <LayoutDashboardIcon className="size-4" aria-hidden="true" />
                    {panelLabel}
                  </ButtonLink>
                  {!isAdmin && (
                    <Link
                      href="/admin/giris"
                      onClick={() => setOpen(false)}
                      className="mt-2 flex items-center gap-1.5 px-3 py-2 text-xs text-textSecondary"
                    >
                      <ShieldIcon className="size-3.5" aria-hidden="true" />
                      Admin girişi
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="mt-2 w-full justify-center border-danger/40 text-danger hover:bg-danger/10"
                  >
                    <LogOutIcon className="size-4" aria-hidden="true" />
                    Çıkış Yap
                  </Button>
                </>
              ) : (
                <>
                  <ButtonLink href="/giris" onClick={() => setOpen(false)} className="w-full">
                    Takım Girişi
                  </ButtonLink>
                  <Link
                    href="/admin/giris"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center gap-1.5 px-3 py-2 text-xs text-textSecondary"
                  >
                    <ShieldIcon className="size-3.5" aria-hidden="true" />
                    Admin girişi
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
