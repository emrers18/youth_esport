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
  "Other",
] as const;

export const MEMBER_ROLE_OPTIONS = [
  "Captain",
  "IGL (In-Game Leader)",
  "Duelist / Fragger",
  "Support",
  "Coach",
  "Analyst",
  "Substitute Player",
] as const;

export const teamMemberSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  role: z.string().min(2, "Specify a role."),
});

export const teamApplicationSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters."),
  tag: z
    .string()
    .min(2, "Team tag must be at least 2 characters.")
    .max(6, "Team tag can be at most 6 characters."),
  mainGame: z.string().min(2, "Specify a main game."),
  country: z.string().min(2, "Specify a country."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(1000, "Description can be at most 1000 characters."),
  captainEmail: z.string().email("Enter a valid captain email address."),
  logoUrl: z.string().optional(),
  members: z
    .array(teamMemberSchema)
    .min(1, "You must add at least one member."),
});

export type TeamApplicationInput = z.infer<typeof teamApplicationSchema>;
