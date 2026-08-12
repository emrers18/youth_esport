import Link from "next/link";
import { GamepadIcon } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-2xl rounded-lg border border-border bg-surface p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <GamepadIcon className="size-8 text-primary" aria-hidden="true" />
          <h1 className="font-heading text-2xl font-bold tracking-wide text-textPrimary">
            Team Registration
          </h1>
          <p className="text-sm text-textSecondary">
            Create your account and submit your team application at the same time.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-textSecondary">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
