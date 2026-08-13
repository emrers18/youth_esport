"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { teamMemberSchema, MEMBER_ROLE_OPTIONS } from "@/lib/validation/team";
import { updateTeamMembers } from "@/lib/actions/team-actions";

const teamMembersFormSchema = z.object({
  members: z.array(teamMemberSchema).min(1, "You must add at least one member."),
});

type TeamMembersFormInput = z.infer<typeof teamMembersFormSchema>;

export function TeamMembersForm({
  defaultValues,
}: {
  defaultValues: TeamMembersFormInput;
}) {
  const router = useRouter();

  const form = useForm<TeamMembersFormInput>({
    resolver: zodResolver(teamMembersFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const onSubmit = async (values: TeamMembersFormInput) => {
    const result = await updateTeamMembers(values.members);
    if (result.success) {
      toast.success("Team members updated.");
      router.refresh();
    } else {
      toast.error(result.error ?? "Update failed.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
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

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ fullName: "", email: "", role: "Substitute Player" })}
          >
            <PlusIcon className="size-4" />
            Add Member
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Members"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
