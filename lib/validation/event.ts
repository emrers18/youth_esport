import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalı."),
  description: z
    .string()
    .min(20, "Açıklama en az 20 karakter olmalı.")
    .max(2000, "Açıklama en fazla 2000 karakter olabilir."),
  date: z.string().min(1, "Tarih ve saat seçin."),
  location: z.string().min(2, "Konum belirtin."),
  imageUrl: z.string().optional(),
  capacity: z.coerce.number().int().min(1, "Kontenjan en az 1 olmalı."),
});

export type EventInput = z.infer<typeof eventSchema>;
