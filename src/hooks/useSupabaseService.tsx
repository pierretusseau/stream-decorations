'use client'

import { createClient } from '@supabase/supabase-js'

const useSupabaseService = async (serviceKey?: string) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_DECORATIONS_URL
  if (!url) throw new Error('Couldn\'t find required env variables for Supabase')
  if (!serviceKey) throw new Error('No service key provided')

  const supabase = await createClient(url, serviceKey)

  return supabase
}

export default useSupabaseService