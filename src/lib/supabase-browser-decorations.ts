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
const supabase = createClient<DatabaseDecorations>(
  process.env.NEXT_PUBLIC_SUPABASE_DECORATIONS_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_DECORATIONS_ANON_KEY!,
  options
);

export default supabase;