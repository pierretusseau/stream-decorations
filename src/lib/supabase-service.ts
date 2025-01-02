'server-only'

import { createClient } from "@supabase/supabase-js"

const options = {
  // auth: {
  //   autoRefreshToken: true,
  //   persistSession: true,
  //   detectSessionInUrl: true
  // }
}

export const createSupaClient = async (service_key: string) => {
  if (!service_key) throw Error ('no key')

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    service_key,
    options
  );
}