"use server";

import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase-admin";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export type UploadMediaResult =
  | { success: true; url: string }
  | { success: false; error: string };

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
    return { success: false, error: "Geçersiz dosya." };
  }
  if (folder !== "team-logos" && folder !== "event-images") {
    return { success: false, error: "Geçersiz klasör." };
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { success: false, error: "Yalnızca JPG, JPEG veya PNG dosyaları yüklenebilir." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { success: false, error: "Dosya boyutu en fazla 5 MB olabilir." };
  }

  const admin = createAdminClient();
  const ext = file.type === "image/png" ? "png" : "jpg";
  const path = `${folder}/${randomUUID()}.${ext}`;

  const { error } = await admin.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    return { success: false, error: "Görsel yüklenemedi. Lütfen tekrar deneyin." };
  }

  const { data } = admin.storage.from("media").getPublicUrl(path);
  return { success: true, url: data.publicUrl };
}
