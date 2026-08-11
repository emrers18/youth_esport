"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon, CheckCircle2Icon, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
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
      members: [{ fullName: "", email: "", role: "Kaptan" }],
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
      toast.error(result.error ?? "Başvuru gönderilemedi.");
    }
  };

  if (submitted) {
    return (
      <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-lg border border-secondary/30 bg-secondary/10 px-6 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--color-secondary)_18%,transparent),transparent_60%)]" />
        <CheckCircle2Icon className="relative size-12 text-secondary animate-pulse-glow" aria-hidden="true" />
        <h2 className="relative font-heading text-2xl font-bold text-textPrimary">
          Başvurunuz Alındı
        </h2>
        <p className="relative max-w-md text-textSecondary">
          Takım başvurunuz admin ekibimize iletildi. İnceleme sonuçlandığında
          e-posta ile bilgilendirileceksiniz. Durumu Takım Panelinizden takip
          edebilirsiniz.
        </p>
        <ButtonLink href="/panel" className="relative shadow-glow">
          Panelime Git
        </ButtonLink>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {(nameValue || tagValue) && (
          <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm">
            <span className="text-textSecondary">Önizleme:</span>
            <span className="font-heading font-semibold tracking-wide text-primary">
              {tagValue ? `[${tagValue.toUpperCase()}]` : ""} {nameValue || "Takım Adı"}
            </span>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Takım Adı</FormLabel>
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
                <FormLabel>Takım Etiketi</FormLabel>
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
                <FormLabel>Ana Oyun</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Oyun seçin" />
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
                <FormLabel>Ülke</FormLabel>
                <FormControl>
                  <Input placeholder="Türkiye" {...field} />
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
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Takımınızı ve hedeflerinizi kısaca tanıtın."
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
              <FormLabel>Kaptan E-postası</FormLabel>
              <FormControl>
                <Input type="email" placeholder="kaptan@ornek.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <p className="text-sm font-medium text-textPrimary">Takım Logosu</p>
          <div className="group relative mt-2 flex aspect-square w-32 flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-border bg-surface text-textSecondary transition-colors hover:border-primary/50">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--color-primary)_12%,transparent),transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100" />
            <ImageIcon className="relative size-6 opacity-60" aria-hidden="true" />
            <span className="relative text-[10px] font-medium">Logo Yakında</span>
          </div>
          <p className="mt-1 text-xs text-textSecondary">
            Dosya yükleme entegrasyonu sonraki fazda eklenecek.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-textPrimary">Aktif Kişiler ve Rolleri</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ fullName: "", email: "", role: "Yedek Oyuncu" })}
            >
              <PlusIcon className="size-4" />
              Üye Ekle
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
                    <FormLabel>Ad Soyad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad Soyad" {...field} />
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
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="uye@ornek.com" {...field} />
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
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Rol seçin" />
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
                aria-label="Üyeyi kaldır"
                className="text-danger hover:bg-danger/10 hover:text-danger"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="self-start shadow-glow">
          {form.formState.isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
        </Button>
      </form>
    </Form>
  );
}
