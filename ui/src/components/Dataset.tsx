"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Dataset() {
  const container = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current?.children || [],
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 1, stagger: 0.2,
          scrollTrigger: { trigger: container.current, start: "top 60%" }
        }
      );
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative min-h-[80vh] w-full flex flex-col items-center justify-center bg-void px-6 py-24 border-t border-muted/20">
      <div className="max-w-5xl w-full space-y-16">
        <div className="text-center space-y-6">
          <h2 className="font-serif text-4xl md:text-6xl text-bone">The Digital Heartbeat</h2>
          <p className="font-mono text-muted text-lg max-w-2xl mx-auto">
            Using the Open University Learning Analytics Dataset (OULAD), I analyzed the digital footprints of over 32,000 students. I transformed raw server logs into behavioral vectors.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-muted/20 bg-bone/5 space-y-4 transition-all duration-300 ease-out hover:scale-105 hover:border-bone/40 hover:shadow-[0_0_40px_rgba(245,245,240,0.2)] hover:bg-bone/10">
            <h3 className="font-mono text-bone text-xl">1. The Footprint</h3>
            <p className="font-mono text-muted text-sm">Aggregated clicks, active days, and session intensity. How often do they show up?</p>
          </div>
          <div className="p-6 border border-muted/20 bg-bone/5 space-y-4 transition-all duration-300 ease-out hover:scale-105 hover:border-bone/40 hover:shadow-[0_0_40px_rgba(245,245,240,0.2)] hover:bg-bone/10">
            <h3 className="font-mono text-bone text-xl">2. The Midnight Oil</h3>
            <p className="font-mono text-muted text-sm">Late submission rates and average days late. Are they constantly racing against the clock?</p>
          </div>
          <div className="p-6 border border-muted/20 bg-bone/5 space-y-4 transition-all duration-300 ease-out hover:scale-105 hover:border-bone/40 hover:shadow-[0_0_40px_rgba(245,245,240,0.2)] hover:bg-bone/10">
            <h3 className="font-mono text-bone text-xl">3. The Momentum</h3>
            <p className="font-mono text-muted text-sm">Engagement decline over time and grade trajectory. Is their energy fading as the semester progresses?</p>
          </div>
        </div>
      </div>
    </section>
  );
}
