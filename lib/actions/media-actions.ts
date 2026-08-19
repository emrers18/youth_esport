"use server";

import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase-admin";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export type UploadMediaResult =
  | { success: true; url: string }
  | { success: false; error: string };

/**
 * Sniffs the real file signature instead of trusting the client-supplied
 * `file.type` — that field is just a caller-declared multipart header and
 * is trivial to spoof for anyone calling this action directly (it isn't
 * gated by auth, see below), so it can't be used to decide what actually
 * gets stored and served back with a matching Content-Type.
 */
async function sniffImageType(file: File): Promise<"image/jpeg" | "image/png" | null> {
  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47 &&
    header[4] === 0x0d &&
    header[5] === 0x0a &&
    header[6] === 0x1a &&
    header[7] === 0x0a
  ) {
    return "image/png";
  }
  return null;
}

/**
 * Uploads via the service-role client so this works even before an auth
 * session exists (e.g. the registration form uploads a team logo before
 * the account itself is created) — storage RLS only grants INSERT to
 * `authenticated`, which the browser anon client can't satisfy there.
 */
export async function uploadMedia(formData: FormData): Promise<UploadMediaResult> {
  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File)) {
    return { success: false, error: "Invalid file." };
  }
  if (folder !== "team-logos" && folder !== "event-images" && folder !== "event-gallery") {
    return { success: false, error: "Invalid folder." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { success: false, error: "File size must be at most 5 MB." };
  }

  const sniffedType = await sniffImageType(file);
  if (!sniffedType) {
    return { success: false, error: "Only JPG, JPEG, or PNG files can be uploaded." };
  }

  const admin = createAdminClient();
  const ext = sniffedType === "image/png" ? "png" : "jpg";
  const path = `${folder}/${randomUUID()}.${ext}`;

  const { error } = await admin.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: sniffedType,
  });

  if (error) {
    return { success: false, error: "Failed to upload image. Please try again." };
  }

  const { data } = admin.storage.from("media").getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}
