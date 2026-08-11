"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { eventSchema, type EventInput } from "@/lib/validation/event";
import { createEvent } from "@/lib/actions/event-actions";

export function EventForm() {
  const router = useRouter();

  const form = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      imageUrl: "",
      capacity: 20,
    },
  });

  const onSubmit = async (values: EventInput) => {
    const result = await createEvent(values);
    if (result.success) {
      toast.success("Etkinlik oluşturuldu.");
      router.push("/etkinlikler");
    } else {
      toast.error(result.error ?? "Etkinlik oluşturulamadı.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Başlık</FormLabel>
              <FormControl>
                <Input placeholder="Bridges Açılış Turnuvası" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarih ve Saat</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konum</FormLabel>
                <FormControl>
                  <Input placeholder="İstanbul, Türkiye" {...field} />
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
                <Textarea className="min-h-32" placeholder="Etkinliği tanıtın." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel>Kontenjan</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <p className="text-sm font-medium text-textPrimary">Etkinlik Görseli</p>
          <div className="mt-2 flex aspect-video w-full max-w-sm flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface text-textSecondary">
            <ImageIcon className="size-6 opacity-60" aria-hidden="true" />
            <span className="text-xs font-medium">Görsel Yakında</span>
          </div>
          <p className="mt-1 text-xs text-textSecondary">
            Dosya yükleme entegrasyonu sonraki fazda eklenecek.
          </p>
        </div>

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="self-start">
          {form.formState.isSubmitting ? "Oluşturuluyor..." : "Etkinliği Oluştur"}
        </Button>
      </form>
    </Form>
  );
}
