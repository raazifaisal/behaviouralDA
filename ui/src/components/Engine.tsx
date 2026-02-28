"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Engine() {
  const container = useRef<HTMLDivElement>(null);
  const gridContainer = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const number1Ref = useRef<HTMLSpanElement>(null);
  const number2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate grid dots
      if (gridContainer.current) {
        const dots = gridContainer.current.children;
        gsap.fromTo(dots, 
          { scale: 0, opacity: 0 },
          { 
            scale: 1, opacity: 0.5, 
            stagger: {
              grid: [10, 10],
              from: "center",
              amount: 1.5
            },
            scrollTrigger: {
              trigger: container.current,
              start: "top center",
              end: "center center",
              scrub: true,
            }
          }
        );

        // Rotation effect
        gsap.to(gridContainer.current, {
          rotateX: 45,
          rotateZ: 45,
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      }

      // Text reveal
      gsap.from([headerRef.current, bodyRef.current], {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        }
      });

      // Number counters
      gsap.fromTo(number1Ref.current, { innerHTML: 0 }, {
        innerHTML: 17,
        duration: 2,
        snap: { innerHTML: 1 },
        scrollTrigger: {
          trigger: number1Ref.current,
          start: "top 80%",
        }
      });

      gsap.fromTo(number2Ref.current, { innerHTML: 0 }, {
        innerHTML: 4,
        duration: 2,
        snap: { innerHTML: 1 },
        scrollTrigger: {
          trigger: number2Ref.current,
          start: "top 80%",
        }
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative min-h-screen w-full flex flex-col items-center justify-center bg-void py-24 overflow-hidden perspective-1000">
      
      {/* Background Grid Animation */}
      <div 
        ref={gridContainer}
        className="absolute inset-0 z-0 flex flex-wrap gap-4 items-center justify-center opacity-20 pointer-events-none"
        style={{ width: '150vw', height: '150vh', left: '-25vw', top: '-25vh', transformStyle: 'preserve-3d' }}
      >
        {Array.from({ length: 200 }).map((_, i) => (
          <div key={i} className="w-2 h-2 bg-bone rounded-full" />
        ))}
      </div>

      <div className="z-10 max-w-4xl px-6 text-center space-y-12">
        <h2 ref={headerRef} className="font-serif text-4xl md:text-6xl text-bone">
          I didn't just track grades. I tracked behavior.
        </h2>
        
        <p ref={bodyRef} className="font-mono text-muted text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          I analyzed the OULAD dataset—millions of clicks, forum posts, and submission timestamps. I realized early intervention isn't about knowing who failed the midterm; it's about knowing who stopped checking the syllabus on a Tuesday. I engineered a machine learning architecture capable of flagging burnout 4 weeks before it becomes a dropout statistic.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12 pt-16">
          <div className="text-center space-y-2">
            <div className="font-serif text-6xl md:text-8xl text-bone">
              <span ref={number1Ref}>0</span>
            </div>
            <div className="font-mono text-muted text-sm tracking-widest uppercase">Behavioral Features</div>
          </div>
          
          <div className="w-px h-16 bg-muted/30 hidden md:block"></div>

          <div className="text-center space-y-2">
            <div className="font-serif text-6xl md:text-8xl text-bone">
              <span ref={number2Ref}>0</span>
              <span className="text-4xl md:text-6xl">-Week</span>
            </div>
            <div className="font-mono text-muted text-sm tracking-widest uppercase">Early Warning</div>
          </div>
        </div>
      </div>

    </section>
  );
}
