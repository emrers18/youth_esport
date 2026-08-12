"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { updateTeamProfile } from "@/lib/actions/team-actions";
import { MAIN_GAME_OPTIONS } from "@/lib/validation/team";

const profileSchema = z.object({
  name: z.string().min(2, "Takım adı en az 2 karakter olmalı."),
  tag: z.string().min(2, "Takım etiketi en az 2 karakter olmalı.").max(6),
  mainGame: z.string().min(2, "Ana oyun belirtin."),
  country: z.string().min(2, "Ülke belirtin."),
  description: z.string().min(20, "Açıklama en az 20 karakter olmalı.").max(1000),
  captainEmail: z.string().email("Geçerli bir e-posta girin."),
  logoUrl: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

export function TeamProfileForm({
  defaultValues,
}: {
  defaultValues: ProfileInput;
}) {
  const router = useRouter();

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = async (values: ProfileInput) => {
    const result = await updateTeamProfile(values);
    if (result.success) {
      toast.success("Profil güncellendi.");
      router.refresh();
    } else {
      toast.error(result.error ?? "Güncelleme başarısız oldu.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Takım Adı</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Takım Etiketi</FormLabel>
                <FormControl>
                  <Input
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
                  <Input {...field} />
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
                <Textarea className="min-h-28" {...field} />
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
                <Input type="email" {...field} />
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
              <FormLabel>Takım Logosu</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  folder="team-logos"
                  aspect="square"
                  label="Takım logosu"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} className="self-start">
          {form.formState.isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </Button>
      </form>
    </Form>
  );
}
