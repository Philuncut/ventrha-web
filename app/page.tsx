import { Hero } from "@/components/sections/hero";
import { DataOrbit } from "@/components/sections/data-orbit";
import { WorldSplit } from "@/components/sections/world-split";
import { Features } from "@/components/sections/features";
import { Showcase } from "@/components/sections/showcase";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main id="top" className="flex flex-1 flex-col">
      <Hero />
      <DataOrbit />
      <WorldSplit />
      <Features />
      <Showcase />
      <Contact />
    </main>
  );
}
