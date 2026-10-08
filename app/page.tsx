import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Clients } from "@/components/sections/Clients";
import { About } from "@/components/sections/About";
import { WorldMap } from "@/components/sections/WorldMap";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Clients />
        <Process />
        <WorldMap />
        <Testimonials />
        <About />
      </main>
      <Footer />
    </>
  );
}
