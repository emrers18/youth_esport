import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(2000, "Description can be at most 2000 characters."),
  date: z.string().min(1, "Select a date and time."),
  location: z.string().min(2, "Specify a location."),
  imageUrl: z.string().optional(),
  galleryUrls: z.array(z.string()).max(6, "You can add up to 6 gallery photos.").optional(),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1."),
});

export type EventInput = z.infer<typeof eventSchema>;
