import React from 'react'
import supabase from '@/lib/supabase-browser-amaw'
import AmawTracker from '@/app/components/AmawTracker'

// Bundle WEBP => PNG
// https://www.reddit.com/r/software/comments/q78y0c/i_have_a_ton_of_webp_images_need_them_in_png_how/

export const dynamic = 'force-dynamic'

const getMonsters = async () => {
  const { data, error } = await supabase
    .from('monsters')
    .select()
    .order('id')
  
  if (error) throw new Error(error.message)

  return data
}

const getWeapons = async () => {
  const { data, error } = await supabase
    .from('weapons')
    .select()
    .order('id')
  
  if (error) throw new Error(error.message)

  return data
}

export default async function AmawTrackerPage() {
  const monsters = await getMonsters()
  const weapons = await getWeapons()
  
  return <AmawTracker
    monsters={monsters}
    weapons={weapons}
  />
}