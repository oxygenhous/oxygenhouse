import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = "https://vbdqhwedkikkbpvhfwwj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiZHFod2Vka2lra2Jwdmhmd3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NDYwNDYsImV4cCI6MjEwMDAyMjA0Nn0.QCvbOF3yp2m4p0drUZZJkre0p8eh7PjskOGlfsV1U0Q";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY
  );
}
