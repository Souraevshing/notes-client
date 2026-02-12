import { createClient } from "@supabase/supabase-js";

import { env } from "@/types/env";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL and Anon Key must be provided in environment variables",
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
