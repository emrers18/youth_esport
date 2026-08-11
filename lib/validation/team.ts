import { z } from "zod";

export const MAIN_GAME_OPTIONS = [
  "Valorant",
  "League of Legends",
  "Counter-Strike 2",
  "Rocket League",
  "Fortnite",
  "EA Sports FC",
  "Overwatch 2",
  "Dota 2",
  "Diğer",
] as const;

export const MEMBER_ROLE_OPTIONS = [
  "Kaptan",
  "IGL (In-Game Leader)",
  "Duelist / Fragger",
  "Support",
  "Coach",
  "Analist",
  "Yedek Oyuncu",
] as const;

export const teamMemberSchema = z.object({
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalı."),
  email: z.string().email("Geçerli bir e-posta girin."),
  role: z.string().min(2, "Rol belirtin."),
});

export const teamApplicationSchema = z.object({
  name: z.string().min(2, "Takım adı en az 2 karakter olmalı."),
  tag: z
    .string()
    .min(2, "Takım etiketi en az 2 karakter olmalı.")
    .max(6, "Takım etiketi en fazla 6 karakter olabilir."),
  mainGame: z.string().min(2, "Ana oyun belirtin."),
  country: z.string().min(2, "Ülke belirtin."),
  description: z
    .string()
    .min(20, "Açıklama en az 20 karakter olmalı.")
    .max(1000, "Açıklama en fazla 1000 karakter olabilir."),
  captainEmail: z.string().email("Geçerli bir kaptan e-postası girin."),
  logoUrl: z.string().optional(),
  members: z
    .array(teamMemberSchema)
    .min(1, "En az bir üye eklemelisiniz."),
});

export type TeamApplicationInput = z.infer<typeof teamApplicationSchema>;
