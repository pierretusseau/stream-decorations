import React from 'react'
import supabase from '@//lib/supabase-browser'
import AmawWeapons from '@/app/components/AmawWeapons'

export const dynamic = 'force-dynamic'

const getWeapons = async () => {
  const { data, error } = await supabase
    .from('weapons')
    .select()
    .order('id')
  
  if (error) throw new Error(error.message)

  return data
}

export default async function AmawWaponsPage() {
  const weapons = await getWeapons()
  return (
    <AmawWeapons
      weapons={weapons}
    />
  )
}