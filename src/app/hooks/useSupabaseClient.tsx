'use client'

import { createClient } from '@supabase/supabase-js'

const useSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_DB_URL || !process.env.NEXT_PUBLIC_ANON_KEY) {
    throw new Error('Couldn\'t find required env variables for Supabase')
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_DB_URL, process.env.NEXT_PUBLIC_ANON_KEY)

  const getMonsters = async () => {
    const { data, error } = await supabase
      .from('monsters')
      .select()

    if (error) throw new Error(error.message)
    return data
  }

  return {
    getMonsters
  }
}

export default useSupabaseClient