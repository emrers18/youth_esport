import type { Metadata } from "next";
import { Rajdhani, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { CometTrail } from "@/components/effects/comet-trail";
import { getAuthUser } from "@/lib/supabase-server";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "YouthEsportsArena | Bridges: Anti Discriminatory Language and Esports",
  description:
    "The official website and participant management tool of the Bridges: Anti Discriminatory Language and Esports Erasmus+ project.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser();

  // Build a session-like object for Navbar compatibility
  const session = user
    ? { user: { id: user.id, email: user.email, role: user.role } }
    : null;

  return (
    <html
      lang="en"
      className={`${rajdhani.variable} ${inter.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-textPrimary font-body antialiased">
        <CometTrail />
        <Navbar session={session} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors theme="dark" />
      </body>
    </html>
  );
}
