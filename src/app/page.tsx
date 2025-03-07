'use client';

import HomeLink from "@/components/Home/HomeLink";
import Header from "@/components/Header";
import HomeDynamicModules from "@/components/Home/HomeDynamicModules";

export default function Home() {
  const date = new Date()

  return (
    <div className="bg-neutral-950 text-neutral-50 min-h-screen flex flex-col gap-10">
      <Header />
      <main className="flex flex-col gap-12 p-4">
        <section>
          <h2>Dynamic Modules</h2>
          <div className="flex flex-wrap gap-8">
            <HomeDynamicModules />
          </div>
        </section>
        <section>
          <h2>Decorations</h2>
          <div className="flex flex-wrap gap-8">
            <HomeLink
              href="/announces"
              title="Announces"
              subtitle="400x100"
            />
            <HomeLink
              href="/twitch/last-follower"
              title="Twitch Last Follower"
              // subtitle="400x100"
            />
            <HomeLink
              href="/twitch/cam-layout"
              title="Cam Layout"
              subtitle="314x228"
            />
          </div>
        </section>
        <section>
          <h2>MHWI - All Weapons All Monsters</h2>
          <div className="flex flex-wrap gap-8">
            <HomeLink
              href="/amaw/sidebar"
              title="AMAW Sidebar"
              subtitle="432x1440"
            />
            <HomeLink
              href="/amaw/tracker"
              title="AMAW Tracker"
              subtitle="2560x200"
            />
            <HomeLink
              href="/amaw/table"
              title="AMAW Table"
            />
            <HomeLink
              href="/amaw/monsters"
              title="AMAW Monsters"
              subtitle="1250x980"
            />
            <HomeLink
              href="/amaw/weapons"
              title="AMAW Weapons"
              subtitle="220x1104"
            />
            <HomeLink
              href="/amaw/last-hunt"
              title="AMAW Last Hunt"
              // subtitle="220x1104"
            />
            <HomeLink
              href="/amaw/total"
              title="AMAW Total"
              subtitle="340x170"
            />
            <HomeLink
              href="/amaw/random-hunt"
              title="AMAW Random Hunt"
              subtitle="650x300"
            />
          </div>
        </section>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-auto">
        &copy;{date.getFullYear()} Pierre &quot;Kobaru&quot; Tusseau
      </footer>
    </div>
  );
}
