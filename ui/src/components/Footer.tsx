"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0,
          duration: 1.5,
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
          }
        }
      );

      gsap.fromTo(creditsRef.current,
        { opacity: 0 },
        { 
          opacity: 1,
          duration: 2,
          delay: 0.5,
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={container} className="relative min-h-[50vh] w-full flex flex-col items-center justify-center bg-void px-6 py-24">
      <div className="max-w-3xl text-center space-y-16">
        <p ref={textRef} className="font-serif text-3xl md:text-5xl leading-tight text-bone">
          "I built this because a single well-timed message can change a trajectory. Data shouldn't just measure failure; it should prevent it."
        </p>
        
        <div ref={creditsRef} className="pt-12 border-t border-muted/20">
          <div className="font-mono text-muted text-sm space-y-2">
            <p>Engineered & Designed by: <span className="text-bone">Raazi Faisal Mohiddin</span></p>
            <p>ID: <span className="text-bone">22MIA1103</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
