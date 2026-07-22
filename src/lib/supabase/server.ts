import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = "https://vbdqhwedkikkbpvhfwwj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiZHFod2Vka2lra2Jwdmhmd3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NDYwNDYsImV4cCI6MjEwMDAyMjA0Nn0.QCvbOF3yp2m4p0drUZZJkre0p8eh7PjskOGlfsV1U0Q";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
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
            // called from a Server Component; safe to ignore because
            // middleware.ts refreshes the session on every request
          }
        },
      },
    }
  );
}
