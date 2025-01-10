import React from 'react'
import supabase from '@/lib/supabase-browser-decorations'
import Announces from '@/components/Announces'

export const dynamic = 'force-dynamic'

const getAnnounces = async () => {
  const { data, error } = await supabase
    .from('announces')
    .select()
    .order('id')
  
  if (error) throw new Error(error.message)

  return data
}

export default async function AnnouncesPage() {
  const announces = await getAnnounces()

  return (
    <Announces
      announces={announces}
    />
  )
}