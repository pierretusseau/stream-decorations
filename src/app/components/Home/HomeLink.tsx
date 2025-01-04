import React from 'react'
import Link from "next/link";

function HomeLink({
  href,
  title,
  subtitle,
}: {
  href: string
  title: string
  subtitle?: string
}) {
  const linkStyles = [
    "h-[100px] w-[150px] bg-neutral-900 rounded-lg hover:bg-neutral-800",
    "flex flex-col gap-1 items-center text-center",
    "p-4",
    "transition"
  ].join(' ')

  return (
    <Link href={href} className={linkStyles}>
      <p className="font-bold">{title}</p>
      <p className="text-xs text-neutral-600 mt-auto">{subtitle}</p>
    </Link>
  )
}

export default HomeLink