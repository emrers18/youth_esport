"use server";

import { createClient } from "@/lib/supabase-server";

export type RegisterState = {
  error?: string;
  success?: boolean;
};

export async function registerTeamAccount(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "E-posta ve şifre gerekli." };
  }

  if (password.length < 8) {
    return { error: "Şifre en az 8 karakter olmalı." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: "TEAM" },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Bu e-posta adresi zaten kayıtlı." };
    }
    return { error: error.message };
  }

  return { success: true };
}
