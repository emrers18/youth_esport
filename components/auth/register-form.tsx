"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  useWatch,
  type FieldErrors,
  type FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/image-upload";
import {
  teamApplicationSchema,
  MAIN_GAME_OPTIONS,
  MEMBER_ROLE_OPTIONS,
} from "@/lib/validation/team";
import { registerTeamWithAccount } from "@/lib/actions/auth-actions";
import { cn } from "@/lib/utils";

const registerFormSchema = z
  .object({
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
  })
  .extend(teamApplicationSchema.shape);

type RegisterFormInput = z.infer<typeof registerFormSchema>;

/**
 * The form is one react-hook-form instance split across steps, so values
 * survive moving back and forth. "Next" only validates the current step's
 * fields; the full schema still runs on the final submit.
 */
const STEPS: {
  title: string;
  description: string;
  fields: FieldPath<RegisterFormInput>[];
}[] = [
  {
    title: "Account",
    description: "The email and password you will use for Team Login.",
    fields: ["email", "password"],
  },
  {
    title: "Team",
    description: "Tell us who your team is and what you play.",
    fields: ["name", "tag", "mainGame", "country", "captainEmail", "description"],
  },
  {
    title: "Members",
    description: "Add your logo and everyone on the active roster.",
    fields: ["logoUrl", "members"],
  },
  {
    title: "Review",
    description: "Check everything before you submit your application.",
    fields: [],
  },
];

const DESCRIPTION_MAX = 1000;

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);
  const isLastStep = step === STEPS.length - 1;

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      name: "",
      tag: "",
      mainGame: "",
      country: "",
      description: "",
      captainEmail: "",
      logoUrl: "",
      members: [{ fullName: "", email: "", role: "Captain" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const values = useWatch({ control: form.control });

  // Move focus to the new step's heading so keyboard and screen reader users
  // land at the start of the step instead of on a button that no longer exists.
  useEffect(() => {
    if (!hasNavigated.current) return;
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [step]);

  const goTo = (target: number) => {
    hasNavigated.current = true;
    setStep(target);
  };

  const goNext = async () => {
    const valid = await form.trigger(STEPS[step].fields, { shouldFocus: true });
    if (!valid) return;

    // Most teams register with the captain's own address — save them retyping it.
    if (step === 0 && !form.getValues("captainEmail")) {
      form.setValue("captainEmail", form.getValues("email"));
    }
    goTo(step + 1);
  };

  const onSubmit = async (data: RegisterFormInput) => {
    const result = await registerTeamWithAccount(data);

    if (!result.success) {
      const message = result.error ?? "Registration failed.";
      if (message.includes("email")) {
        form.setError("email", { message });
        goTo(0);
      }
      toast.error(message);
      return;
    }

    // Account + team application are already created server-side, and the
    // session was established there too — clear the form now so stale/
    // sensitive input doesn't linger.
    form.reset();

    if (!result.signedIn) {
      toast.success("Your account and team application have been created. Please sign in.");
      router.push("/login");
      return;
    }

    toast.success("Your account was created and your team application was submitted.");
    router.push("/panel");
    router.refresh();
  };

  // If the final submit fails validation (e.g. a field was cleared), jump back
  // to the first step that contains an error.
  const onInvalid = (errors: FieldErrors<RegisterFormInput>) => {
    const firstBad = STEPS.findIndex((s) =>
      s.fields.some((f) => f.split(".")[0] in errors),
    );
    if (firstBad !== -1) goTo(firstBad);
    toast.error("Some details need fixing before you can submit.");
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Pressing Enter mid-wizard advances a step rather than submitting.
    if (!isLastStep) {
      void goNext();
      return;
    }
    void form.handleSubmit(onSubmit, onInvalid)(e);
  };

  const current = STEPS[step];
  const descriptionLength = values.description?.length ?? 0;

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} noValidate className="flex flex-col gap-8">
        {/* Stepper */}
        <nav aria-label="Registration progress">
          <p className="mb-3 text-sm text-textSecondary sm:hidden">
            Step {step + 1} of {STEPS.length}:{" "}
            <span className="font-semibold text-textPrimary">{current.title}</span>
          </p>
          <ol className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={s.title} className="flex flex-1 items-center gap-2 last:flex-none">
                  <button
                    type="button"
                    onClick={() => done && goTo(i)}
                    disabled={!done}
                    aria-current={active ? "step" : undefined}
                    aria-label={`Step ${i + 1}: ${s.title}${done ? " (completed)" : ""}`}
                    className={cn(
                      "flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      done && "cursor-pointer",
                      !done && "cursor-default",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-200",
                        done && "border-primary bg-primary text-primary-foreground",
                        active && "border-primary bg-primary/15 text-primary",
                        !done && !active && "border-border bg-background text-textSecondary",
                      )}
                    >
                      {done ? <CheckIcon className="size-4" aria-hidden="true" /> : i + 1}
                    </span>
                    <span
                      className={cn(
                        "hidden text-sm font-medium sm:inline",
                        active ? "text-textPrimary" : "text-textSecondary",
                      )}
                    >
                      {s.title}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-px flex-1 transition-colors duration-300",
                        i < step ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step content */}
        <div key={step} className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-2 duration-300 motion-reduce:animate-none">
          <div>
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="font-heading text-xl font-bold tracking-wide text-textPrimary outline-none"
            >
              {current.title}
            </h2>
            <p className="mt-1 text-sm text-textSecondary">{current.description}</p>
          </div>

          {step === 0 && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className="pr-11"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-pressed={showPassword}
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-textSecondary outline-none transition-colors hover:text-textPrimary focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="size-4" aria-hidden="true" />
                        ) : (
                          <EyeIcon className="size-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    <FormDescription>At least 8 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Aurora Wolves" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem className="sm:w-32">
                      <FormLabel>Team Tag</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="AWL"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          maxLength={6}
                          className="uppercase"
                        />
                      </FormControl>
                      <FormDescription>2–6 letters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="mainGame"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Game</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a game" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MAIN_GAME_OPTIONS.map((game) => (
                            <SelectItem key={game} value={game}>
                              {game}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input autoComplete="country-name" placeholder="Turkey" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="captainEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Captain Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="captain@example.com" {...field} />
                    </FormControl>
                    <FormDescription>Pre-filled with your account email — change it if someone else captains.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly introduce your team and your goals."
                        className="min-h-28"
                        maxLength={DESCRIPTION_MAX}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between gap-4 text-xs text-textSecondary">
                      <span>Minimum 20 characters.</span>
                      <span className="tabular-nums">
                        {descriptionLength}/{DESCRIPTION_MAX}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Team Logo <span className="font-normal text-textSecondary">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        folder="team-logos"
                        aspect="square"
                        label="Team logo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-textPrimary">
                    Active Members and Roles{" "}
                    <span className="font-normal text-textSecondary">({fields.length})</span>
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ fullName: "", email: "", role: "Substitute Player" })}
                  >
                    <PlusIcon className="size-4" />
                    Add Member
                  </Button>
                </div>

                {fields.map((member, index) => (
                  <div
                    key={member.id}
                    className="hud-corners relative grid gap-3 rounded-md border border-border bg-background/40 p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
                  >
                    <span className="absolute -top-2.5 left-3 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold tracking-wide text-textSecondary">
                      #{index + 1}
                    </span>
                    <FormField
                      control={form.control}
                      name={`members.${index}.fullName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`members.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="member@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`members.${index}.role`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MEMBER_ROLE_OPTIONS.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                      aria-label={`Remove member ${index + 1}`}
                      className="text-danger hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <ReviewCard title="Account" onEdit={() => goTo(0)}>
                <ReviewRow label="Email" value={values.email} />
                <ReviewRow label="Password" value="••••••••" />
              </ReviewCard>

              <ReviewCard title="Team" onEdit={() => goTo(1)}>
                <ReviewRow label="Name" value={`${values.name} [${values.tag}]`} />
                <ReviewRow label="Main Game" value={values.mainGame} />
                <ReviewRow label="Country" value={values.country} />
                <ReviewRow label="Captain Email" value={values.captainEmail} />
                <ReviewRow label="Description" value={values.description} wide />
              </ReviewCard>

              <ReviewCard title="Members" onEdit={() => goTo(2)}>
                <ReviewRow label="Logo" value={values.logoUrl ? "Uploaded" : "Not added"} />
                <div className="sm:col-span-2">
                  <dt className="text-xs text-textSecondary">Roster</dt>
                  <dd className="mt-1">
                    <ul className="flex flex-col gap-1 text-sm text-textPrimary">
                      {values.members?.map((m, i) => (
                        <li key={i} className="flex flex-wrap gap-x-2">
                          <span className="font-medium">{m.fullName}</span>
                          <span className="text-textSecondary">· {m.role}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </ReviewCard>

              <p className="text-sm text-textSecondary">
                After you submit, project admins will review your application. You can
                follow its status from your team panel.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button type="button" variant="ghost" size="lg" onClick={() => goTo(step - 1)}>
              <ArrowLeftIcon className="size-4" />
              Back
            </Button>
          ) : (
            <span className="hidden sm:block" />
          )}

          {isLastStep ? (
            <Button type="submit" size="lg" variant="gold" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting..." : "Sign Up and Apply"}
            </Button>
          ) : (
            <Button type="submit" size="lg">
              Continue
              <ArrowRightIcon className="size-4" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-md border border-border bg-background/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-textSecondary">
          {title}
        </h3>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit} aria-label={`Edit ${title}`}>
          <PencilIcon className="size-3.5" />
          Edit
        </Button>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function ReviewRow({ label, value, wide }: { label: string; value?: string; wide?: boolean }) {
  return (
    <div className={cn(wide && "sm:col-span-2")}>
      <dt className="text-xs text-textSecondary">{label}</dt>
      <dd className="mt-0.5 wrap-break-word whitespace-pre-line text-sm text-textPrimary">
        {value || "—"}
      </dd>
    </div>
  );
}
