import React from 'react'
import supabase from '@//lib/supabase-browser'
import AmawMonsters from '@/app/components/AmawMonsters'

export const dynamic = 'force-dynamic'

const getMonsters = async () => {
  const { data, error } = await supabase
    .from('monsters')
    .select()
    .order('id')
  
  if (error) throw new Error(error.message)

  return data
}
export default async function AmawTablePage() {
  const monsters = await getMonsters()

  return (
    <AmawMonsters
      monsters={monsters}
    />
  )
}