'server-only'

import { createClient } from "@supabase/supabase-js"

const options = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  }
}

export const createSupaClient = async (
  service_key: string
) => {
  if (!service_key) throw Error ('no key')

  return createClient<DatabaseDecorations>(
    process.env.NEXT_PUBLIC_SUPABASE_DECORATIONS_URL!,
    service_key,
    options
  );
}