import React, { useEffect } from 'react'
import useSettingsStore from "@/store/useSettingsStore";
import useDecorationsStore, { setDecorations } from "@/store/useDecorationsStore";
import HomeLink from '@/components/Home/HomeLink';

function HomeDynamicModules() {

  const decoServiceKey = useSettingsStore((state) => state.supabase_decorations_service_key)
  const decorations = useDecorationsStore((state) => state.decorations)

  useEffect(() => {
    if (!decoServiceKey) return
    fetch(`api/decorations/modules?key=${decoServiceKey}`, {
      method: "GET"
    }).then(res => res.json())
      .then(res => {
        const { data, body, code } = res
        if (code !== 200) throw new Error(body.message)
        setDecorations(data)
      }).catch(err => {
        console.error('Error while fetching decorations from Supabase')
        console.error(err)
      })
  }, [decoServiceKey])
  return (
    <>
      {decorations.map(decoration => <HomeLink
        key={`dynamic-module-${decoration.id}`}
        href={`twitch/${decoration.type}/${decoration.code}`}
        title={`twitch/${decoration.type}/[code]`}
        large
      />)}
    </>
  )
}

export default HomeDynamicModules