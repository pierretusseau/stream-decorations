'server-only'

import {
  createClient,
  // PostgrestError
} from "@supabase/supabase-js"

const options = {
  // db: {
  //   schema: 'public',
  // },
  // auth: {
  //   autoRefreshToken: true,
  //   persistSession: true,
  //   detectSessionInUrl: true
  // }
}

// const supabase = createClient<Database>(
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  options
);

export default supabase;