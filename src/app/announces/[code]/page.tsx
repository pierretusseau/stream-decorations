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

export default async function AnnouncesPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const announces = await getAnnounces()

  if (!code) {
    return <div className="text-[500px]">Provide a code</div>
  } else {
    return <Announces
      code={code}
      announces={announces}
    />
  }
}