import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component — safe to ignore
            // when middleware handles session refresh.
          }
        },
      },
    }
  );
}

/**
 * Returns the current authenticated user + their role from user_profiles.
 * Returns null if unauthenticated.
 *
 * Wrapped in React.cache so its two round trips are shared across the whole
 * request. The root layout needs the user for the navbar, and several pages
 * (/teams, /events, /panel, /events/[id]) need it again for their own
 * authorization checks — without this, each of those call sites re-queries
 * Supabase on every single navigation.
 */
export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    role: (profile?.role ?? "TEAM") as "TEAM" | "ADMIN",
  };
});
