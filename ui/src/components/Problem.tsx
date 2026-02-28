"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Problem() {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, y: 0, duration: 1.5,
          scrollTrigger: { trigger: container.current, start: "top 70%" }
        }
      );
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative min-h-screen w-full flex flex-col items-center justify-center bg-void px-6 py-24 border-t border-muted/20">
      <div className="max-w-4xl text-center space-y-12">
        <h2 className="font-serif text-4xl md:text-6xl text-bone">The Invisible Crisis</h2>
        <p ref={textRef} className="font-mono text-muted text-lg md:text-xl leading-relaxed">
          Higher education has a blind spot. When a student drops out, the system only sees the final act—a missed exam, an unrenewed enrollment. But dropout isn't an event; it's a process. It begins with a slow, silent fade. Missed deadlines, shrinking forum participation, and drifting engagement are the whispers of burnout. I wanted to hear them before it was too late.
        </p>
      </div>
    </section>
  );
}
