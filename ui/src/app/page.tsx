import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import MainExperience from "@/components/MainExperience";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="bg-void min-h-screen">
        <Hero />
        <MainExperience />
      </main>
    </SmoothScroll>
  );
}
