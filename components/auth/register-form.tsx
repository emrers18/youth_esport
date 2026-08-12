"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
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

const registerFormSchema = z
  .object({
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
  })
  .extend(teamApplicationSchema.shape);

type RegisterFormInput = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
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

  const onSubmit = async (values: RegisterFormInput) => {
    const result = await registerTeamWithAccount(values);

    if (!result.success) {
      const message = result.error ?? "Registration failed.";
      if (message.includes("email")) {
        form.setError("email", { message });
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-textSecondary">
            Account Details
          </h2>
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
                <FormControl>
                  <Input type="password" autoComplete="new-password" placeholder="At least 8 characters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 border-t border-border pt-6">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-textSecondary">
            Team Details
          </h2>

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
                    <Input placeholder="Turkey" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Briefly introduce your team and your goals."
                    className="min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="captainEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Captain Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="captain@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Logo</FormLabel>
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
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-textPrimary">Active Members and Roles</p>
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
                className="hud-corners relative grid gap-3 rounded-md border border-border bg-surface p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
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
                  aria-label="Remove member"
                  className="text-danger hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" size="lg" variant="gold" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating account..." : "Sign Up and Apply"}
        </Button>
      </form>
    </Form>
  );
}
