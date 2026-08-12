"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon, CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
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
import {
  teamApplicationSchema,
  type TeamApplicationInput,
  MAIN_GAME_OPTIONS,
  MEMBER_ROLE_OPTIONS,
} from "@/lib/validation/team";
import { createTeamApplication } from "@/lib/actions/team-actions";

export function TeamApplicationForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<TeamApplicationInput>({
    resolver: zodResolver(teamApplicationSchema),
    defaultValues: {
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

  const nameValue = form.watch("name");
  const tagValue = form.watch("tag");

  const onSubmit = async (values: TeamApplicationInput) => {
    const result = await createTeamApplication(values);
    if (result.success) {
      setSubmitted(true);
    } else {
      toast.error(result.error ?? "Failed to submit application.");
    }
  };

  if (submitted) {
    return (
      <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-lg border border-secondary/30 bg-secondary/10 px-6 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--color-secondary)_18%,transparent),transparent_60%)]" />
        <CheckCircle2Icon className="relative size-12 text-secondary animate-pulse-glow" aria-hidden="true" />
        <h2 className="relative font-heading text-2xl font-bold text-textPrimary">
          Application Received
        </h2>
        <p className="relative max-w-md text-textSecondary">
          Your team application has been sent to our admin team. You&apos;ll be
          notified by email once it&apos;s reviewed. You can track the status from
          your Team Panel.
        </p>
        <ButtonLink href="/panel" className="relative shadow-glow">
          Go to My Panel
        </ButtonLink>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {(nameValue || tagValue) && (
          <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm">
            <span className="text-textSecondary">Preview:</span>
            <span className="font-heading font-semibold tracking-wide text-primary">
              {tagValue ? `[${tagValue.toUpperCase()}]` : ""} {nameValue || "Team Name"}
            </span>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
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

        <div className="grid gap-6 sm:grid-cols-2">
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
                  className="min-h-28"
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

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="self-start shadow-glow">
          {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
}
