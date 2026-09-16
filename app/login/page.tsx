import { ArrowRightIcon, GamepadIcon } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { JoinSteps } from "@/components/join-steps";
import { ButtonLink } from "@/components/ui/button-link";

export default async function TeamLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-12 sm:py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-surface md:grid-cols-2">
        {/* Sign in — first on mobile, right-hand column on desktop */}
        <section
          aria-labelledby="login-heading"
          className="flex flex-col justify-center p-6 sm:p-10 md:order-2"
        >
          <div className="mb-8 flex flex-col gap-2">
            <GamepadIcon className="size-8 text-primary" aria-hidden="true" />
            <h1
              id="login-heading"
              className="font-heading text-3xl font-bold tracking-wide text-textPrimary"
            >
              Team Login
            </h1>
            <p className="text-base text-textSecondary">
              Already registered? Sign in to open your team panel.
            </p>
          </div>

          <LoginForm variant="team" callbackUrl={callbackUrl} />
        </section>

        {/* New team guidance */}
        <section
          aria-labelledby="join-heading"
          className="flex flex-col gap-6 border-t border-border bg-background/40 p-6 sm:p-10 md:order-1 md:border-t-0 md:border-r"
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              New team?
            </p>
            <h2
              id="join-heading"
              className="font-heading text-2xl font-bold tracking-wide text-textPrimary"
            >
              How to join the arena
            </h2>
            <p className="text-base text-textSecondary">
              You don&apos;t need an account yet — registering creates it for you.
            </p>
          </div>

          <JoinSteps layout="column" />

          <ButtonLink href="/register" size="lg" variant="gold" className="w-full">
            Register Your Team
            <ArrowRightIcon className="size-4" />
          </ButtonLink>
        </section>
      </div>
    </div>
  );
}
