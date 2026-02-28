"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const particle = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Particle drift
      gsap.to(particle.current, {
        scale: 2,
        opacity: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Headline fade in
      if (headline.current) {
        const text = headline.current;
        text.innerHTML = text.innerText
          .split(" ")
          .map((word) => `<span class="inline-block overflow-hidden"><span class="word-inner inline-block opacity-0 translate-y-full">${word}</span></span>`)
          .join(" ");

        gsap.to(".word-inner", {
          opacity: 1,
          y: 0,
          duration: 1.5,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.5,
        });
        
        // Fade out on scroll
        gsap.to(text, {
          opacity: 0,
          y: -50,
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative h-screen w-full flex flex-col items-center justify-center bg-void px-6 overflow-hidden">
      {/* Abstract Background Animation */}
      <div className="absolute inset-0 z-0 opacity-40">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-bone"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              opacity: Math.random() * 0.4 + 0.2
            }}
          />
        ))}
        {/* Glowing orb in center */}
        <div 
          ref={particle} 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bone/20 rounded-full blur-[100px]"
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-30px) translateX(20px); }
          66% { transform: translateY(20px) translateX(-20px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
      `}</style>
      
      <div className="z-10 text-center max-w-4xl mt-32">
        <h1 ref={headline} className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight text-bone">
          Students don't drop out overnight. They slip away in silence.
        </h1>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center text-center px-6">
        <p className="font-mono text-muted text-sm md:text-base max-w-2xl animate-pulse">
          Universities see the empty seat. I built a system to catch the signals, weeks before the fade happens.
        </p>
      </div>
    </section>
  );
}
