"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Models() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".model-stat",
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, scale: 1, duration: 1, stagger: 0.2,
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
          <h2 className="font-serif text-4xl md:text-6xl text-bone">The Predictive Engine</h2>
          <p className="font-mono text-muted text-lg max-w-2xl mx-auto">
            I engineered a dual-layer Random Forest architecture. The first model identifies early-stage risk using only the first 4 weeks of data. The second tracks continuous full-term risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="text-center space-y-4 model-stat p-8 border border-white/10 bg-black/50">
            <div className="font-mono text-muted uppercase tracking-widest text-sm">Early Warning Model</div>
            <div className="font-serif text-5xl md:text-7xl text-bone">4-Week</div>
            <p className="font-mono text-muted text-sm">Predicts dropout using only the first month of activity, buying crucial time for intervention.</p>
          </div>
          <div className="text-center space-y-4 model-stat p-8 border border-white/10 bg-black/50">
            <div className="font-mono text-muted uppercase tracking-widest text-sm">Full Term Accuracy</div>
            <div className="font-serif text-5xl md:text-7xl text-safe">85%+</div>
            <p className="font-mono text-muted text-sm">High precision in identifying at-risk students across the entire semester using temporal features.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
