import { createClient } from '@supabase/supabase-js';

export function createSupabaseServiceRole() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ?? "",
  );
}