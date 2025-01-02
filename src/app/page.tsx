'use client';

import HomeLink from "@/app/components/Home/HomeLink";

export default function Home() {
  const date = new Date()

  return (
    <div className="bg-neutral-950 text-neutral-50 h-screen flex flex-col gap-10">
      <main className="flex flex-wrap gap-8 p-4">
        <HomeLink
          href="/amaw-sidebar"
          title="AMAW Sidebar"
          subtitle="432x1440"
        />
        <HomeLink
          href="/amaw-tracker"
          title="AMAW Tracker"
          subtitle="2560x200"
        />
        <HomeLink
          href="/amaw-table"
          title="AMAW Table"
        />
        <HomeLink
          href="/amaw-monsters"
          title="AMAW Monsters"
        />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-auto">
        &copy;{date.getFullYear()} Pierre &quot;Kobaru&quot; Tusseau
      </footer>
    </div>
  );
}
