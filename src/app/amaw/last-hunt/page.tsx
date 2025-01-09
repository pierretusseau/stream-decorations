import React from 'react'
import supabase from '@/lib/supabase-browser-amaw'
import AmawLastHunt from '@/app/components/AmawLastHunt'

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

export default async function AmawLastHuntPage() {
  const monsters = await getMonsters()
  const weapons = await getWeapons()

  return (
    <AmawLastHunt
      monsters={monsters}
      weapons={weapons}
    />
  )
}