import React from 'react'
import AmawRandomHunt from '@/components/AmawRandomHunt'
import supabase from '@/lib/supabase-browser-amaw'

export const dynamic = 'force-dynamic'

const getWeapons = async () => {
  const { data, error } = await supabase
    .from('weapons')
    .select()
    .order('id')
  
  if (error) throw new Error(error.message)

  return data
}

export default async function AmawRandomHuntPage() {
  const weapons = await getWeapons()
  return (
    <AmawRandomHunt weapons={weapons}/>
  )
}