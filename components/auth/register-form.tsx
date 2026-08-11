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
import { createClient } from "@/lib/supabase";
import {
  teamApplicationSchema,
  MAIN_GAME_OPTIONS,
  MEMBER_ROLE_OPTIONS,
} from "@/lib/validation/team";
import { registerTeamWithAccount } from "@/lib/actions/auth-actions";

const registerFormSchema = z
  .object({
    email: z.string().email("Geçerli bir e-posta girin."),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı."),
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
      members: [{ fullName: "", email: "", role: "Kaptan" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const onSubmit = async (values: RegisterFormInput) => {
    const result = await registerTeamWithAccount(values);

    if (!result.success) {
      const message = result.error ?? "Kayıt başarısız oldu.";
      if (message.includes("e-posta")) {
        form.setError("email", { message });
      }
      toast.error(message);
      return;
    }

    // Account + team application are already created server-side.
    // Sign in client-side purely to establish the session cookie.
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (signInError) {
      toast.success("Hesabınız ve takım başvurunuz oluşturuldu. Lütfen giriş yapın.");
      router.push("/giris");
      return;
    }

    toast.success("Hesabınız oluşturuldu ve takım başvurunuz gönderildi.");
    router.push("/panel");
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-textSecondary">
            Hesap Bilgileri
          </h2>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="ornek@eposta.com" {...field} />
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
                <FormLabel>Şifre</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" placeholder="En az 8 karakter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 border-t border-border pt-6">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-textSecondary">
            Takım Bilgileri
          </h2>

          <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
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

          <div className="grid gap-5 sm:grid-cols-2">
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
                <FormLabel>Kaptan E-postası</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="kaptan@ornek.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Hesap oluşturuluyor..." : "Kayıt Ol ve Başvur"}
        </Button>
      </form>
    </Form>
  );
}
