// use supabase hook
import { createSupabaseClientRole } from "@/services/supabase.client";
import type { SupabaseClient } from "@supabase/supabase-js";


let supabase: SupabaseClient;

export function useSupabase() {
  if (!supabase) {
    supabase = createSupabaseClientRole();
  }
  return supabase;
}