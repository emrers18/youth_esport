import Link from "next/link";
import { GamepadIcon } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default async function TeamLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <GamepadIcon className="size-8 text-primary" aria-hidden="true" />
          <h1 className="font-heading text-2xl font-bold tracking-wide text-textPrimary">
            Takım Girişi
          </h1>
          <p className="text-sm text-textSecondary">
            Takım panelinize erişmek için giriş yapın.
          </p>
        </div>

        <LoginForm variant="team" callbackUrl={callbackUrl} />

        <p className="mt-6 text-center text-sm text-textSecondary">
          Hesabınız yok mu?{" "}
          <Link href="/kayit" className="font-semibold text-primary hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
