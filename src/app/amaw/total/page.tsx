import React from 'react'
import supabase from '@/lib/supabase-browser-amaw'
import AmawTotal from '@/components/AmawTotal'

export const dynamic = 'force-dynamic'

const getMonsters = async () => {
  const { data, error } = await supabase
    .from('monsters')
    .select('id')
  
  if (error) throw new Error(error.message)

  return data
}

const getWeapons = async () => {
  const { data, error } = await supabase
    .from('weapons')
    .select('id')
  
  if (error) throw new Error(error.message)

  return data
}

export default async function AmawTotalPage() {
  const monsters = await getMonsters()
  const weapons = await getWeapons()

  return (
    <AmawTotal
      monsters={monsters}
      weapons={weapons}
    />
  )
}