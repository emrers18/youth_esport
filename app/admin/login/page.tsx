import { ShieldIcon } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <ShieldIcon className="size-8 text-primary" aria-hidden="true" />
          <h1 className="font-heading text-2xl font-bold tracking-wide text-textPrimary">
            Admin Login
          </h1>
          <p className="text-sm text-textSecondary">
            This area is for project administrators only.
          </p>
        </div>

        <LoginForm variant="admin" callbackUrl={callbackUrl ?? "/admin"} />
      </div>
    </div>
  );
}
