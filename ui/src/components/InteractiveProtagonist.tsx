"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  digitalFootprint: number;
  setDigitalFootprint: (v: number) => void;
  deadlineState: "On-Time" | "Riding Deadline" | "Late Submissions";
  setDeadlineState: (v: "On-Time" | "Riding Deadline" | "Late Submissions") => void;
  echoState: "Silent" | "Occasional" | "Active";
  setEchoState: (v: "Silent" | "Occasional" | "Active") => void;
  momentum: number;
  setMomentum: (v: number) => void;
}

export default function InteractiveProtagonist({
  digitalFootprint, setDigitalFootprint,
  deadlineState, setDeadlineState,
  echoState, setEchoState,
  momentum, setMomentum
}: Props) {
  const [story, setStory] = useState("");

  // Dynamic story generation logic
  useEffect(() => {
    // If overall "health" is high, show High Engagement State
    // health can be roughly calculated from the 4 metrics
    const footprintScore = digitalFootprint; // 0-100
    const deadlineScore = deadlineState === "On-Time" ? 100 : (deadlineState === "Riding Deadline" ? 50 : 0);
    const echoScore = echoState === "Active" ? 100 : (echoState === "Occasional" ? 50 : 0);
    const momentumScore = momentum; // 0-100
    
    const overallHealth = (footprintScore + deadlineScore + echoScore + momentumScore) / 4;

    if (overallHealth > 60) {
      setStory("Your student is locked in. They log in frequently, hit their deadlines, and actively shape the forum discussions. To my model, their digital heartbeat is strong and consistent.");
    } else {
      setStory("Your student started strong, but the pattern is shattering. Logins are erratic, and assignments are drifting past deadlines. To a professor, they are just a name on a roster. But to my model, they are flashing red.");
    }
  }, [digitalFootprint, deadlineState, echoState, momentum]);

  return (
    <section className="min-h-screen w-full flex flex-col md:flex-row bg-void border-t border-muted/20">
      
      {/* Left: The Abstract Student (Visual) */}
      <div className="flex-1 border-r border-muted/20 relative overflow-hidden flex items-center justify-center p-12 min-h-[50vh] md:min-h-screen">
        <div className="absolute top-12 left-12">
          <p className="font-serif text-3xl text-bone">Let's build a student.</p>
          <p className="font-mono text-muted mt-2">Watch how my model reads their digital footprint.</p>
        </div>

        {/* Abstract CSS animated silhouette / heartbeat dots */}
        <div className="relative w-48 h-64 md:w-64 md:h-96 flex items-center justify-center">
          {/* We generate the glowing background and the SVG based on health */}
          <motion.div 
            className="absolute inset-0 rounded-full blur-3xl"
            animate={{ 
              backgroundColor: overallHealth(digitalFootprint, deadlineState, echoState, momentum) > 60 ? 'rgba(75, 255, 209, 0.2)' : (overallHealth(digitalFootprint, deadlineState, echoState, momentum) > 40 ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 75, 62, 0.2)'),
              scale: deadlineState !== "On-Time" ? [1, 1.2, 1] : [1, 1.05, 1],
              opacity: momentum < 40 ? 0.4 : 0.8
            }}
            transition={{ 
              duration: deadlineState !== "On-Time" ? 0.5 : 2, 
              repeat: Infinity 
            }}
          />
          
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1352 1920" 
            className="relative z-10 w-full h-full drop-shadow-2xl"
            animate={{
              fill: overallHealth(digitalFootprint, deadlineState, echoState, momentum) > 60 ? '#4BFFD1' : (overallHealth(digitalFootprint, deadlineState, echoState, momentum) > 40 ? '#FFA500' : '#FF4B3E'),
              opacity: 0.5 + (digitalFootprint / 200)
            }}
            transition={{ duration: 1 }}
          >
            <path d="m6410 18943c-242-26-464-72-658-137-177-60-249-92-467-206-615-325-899-443-1195-499-63-12-126-24-138-27-13-3-35-17-48-31-37-40-33-97 13-164 81-120 206-235 331-305 45-26 82-48 82-49 0-2-20-55-45-118-118-302-197-700-211-1065-3-81-7-172-9-202-5-84 13-381 31-499 8-59 26-154 38-212l23-105-59-62c-112-120-159-256-159-462 0-217 50-352 175-475 73-73 166-129 269-164l52-18 45-124c54-147 113-277 174-388 25-45 43-81 40-81-2 0-432 291-956 647-1128 765-1125 763-1150 763-40 0-84-31-122-86-25-36-42-52-48-46s-9 81-9 178c2 201-15 519-30 589-49 214-224 289-376 161-18-15-48-58-66-95l-32-68-145 200c-219 302-271 347-404 347-165 0-259-168-191-343 6-14-2-13-46 10-45 24-65 28-134 28-72 0-86-3-123-28-55-36-86-96-86-167-1-69 24-121 104-219 33-41 60-75 60-76 0-2-28 6-62 17-243 77-413-151-254-339 15-18 68-58 117-89l91-58-54-13c-96-25-159-92-166-177-7-87 44-156 144-195 18-7 135-25 261-40 196-23 233-30 261-49 130-93 359-142 572-122 60 6 115 12 122 15 7 2 25-6 40-18l28-22-41-58c-52-73-60-120-27-164 12-18 795-666 1738-1439s1723-1414 1733-1423c17-17 16-38-18-537-44-660-187-2783-220-3269-13-203-27-395-29-425-3-30-67-395-141-810-75-415-165-915-200-1110-58-322-528-2938-610-3395-19-104-45-247-57-317l-22-128 22-42c11-24 29-55 39-71 18-27 17-29-21-135-64-177-64-178-39-223l22-40-31-50c-60-95-44-213 35-266l33-23h463c501 0 504 0 529 55 7 16 12 75 12 149 0 100 3 126 16 136 8 8 20 22 25 32 6 11 149 527 318 1146 169 620 501 1834 737 2699s431 1569 435 1565c3-4 315-1204 694-2667 378-1463 694-2681 701-2706 8-25 23-54 34-64 18-16 20-31 20-148v-129l34-34 34-34h467c458 0 468 0 502 21 44 27 73 85 73 146 0 48-28 123-56 154-13 15-13 20 5 50 12 19 21 44 21 55 0 12-20 77-45 145s-45 129-45 134c0 6 16 35 35 65 20 32 35 68 35 86 0 17-13 109-29 205-17 96-141 836-276 1644-135 809-288 1722-340 2030-290 1724-271 1598-299 2020-45 673-221 3276-256 3790-19 275-19 290-2 306 9 9 546 450 1192 980 2150 1763 2267 1859 2278 1885 20 43 14 70-33 140l-46 68 28 22c15 13 35 21 43 19 8-3 58-9 110-15 205-24 423 21 580 119 41 26 63 30 250 51 236 26 284 37 339 75 145 100 82 304-105 343l-36 7 95 62c103 66 149 118 168 186 44 166-125 297-308 239-35-11-63-18-63-15 0 2 25 34 57 71 72 86 103 151 103 220 0 67-18 109-63 149-81 71-185 70-329-5-4-2-1 13 8 34 9 20 16 65 16 100 2 86-30 148-97 189-43 27-57 30-124 30-140-1-159-18-444-414-75-103-98-129-103-115-25 80-64 136-121 173-88 58-181 51-258-20-88-81-104-168-114-618-4-195-10-316-16-318-5-1-22 16-37 40-44 70-74 92-121 92-39-1-117-51-1027-669-542-368-1006-684-1033-702-26-19-49-34-52-34s22 51 54 113c66 126 124 258 171 393l32 91 58 18c195 59 339 199 407 392 25 73 27 89 27 243 0 155-1 170-27 245-32 90-101 201-153 243l-35 29 25 120c75 358 86 790 30 1228-84 653-325 1186-714 1575-396 396-935 637-1569 700-95 9-600 12-681 3z" transform="matrix(.1 0 0 -.1 0 1920)" stroke="none" vector-effect="non-scaling-stroke"/>
          </motion.svg>
        </div>
      </div>

      {/* Right: The Controls & Story */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 space-y-12">
        
        <div className="flex gap-2 mb-8 flex-wrap">
          <button onClick={() => { setDigitalFootprint(85); setDeadlineState("On-Time"); setEchoState("Active"); setMomentum(90); }} className="px-4 py-2 text-xs font-mono border border-safe text-safe bg-safe/10 hover:bg-safe/20 transition-colors">Preset: Secure</button>
          <button onClick={() => { setDigitalFootprint(50); setDeadlineState("Riding Deadline"); setEchoState("Occasional"); setMomentum(40); }} className="px-4 py-2 text-xs font-mono border border-bone text-bone bg-bone/10 hover:bg-bone/20 transition-colors">Preset: Borderline</button>
          <button onClick={() => { setDigitalFootprint(15); setDeadlineState("Late Submissions"); setEchoState("Silent"); setMomentum(15); }} className="px-4 py-2 text-xs font-mono border border-risk text-risk bg-risk/10 hover:bg-risk/20 transition-colors">Preset: High Risk</button>
        </div>

        <div className="space-y-10">
          {/* Slider 1: Digital Footprint */}
          <div className="space-y-4">
            <div className="flex justify-between items-center font-mono text-sm">
              <span className="text-bone">Digital Footprint</span>
              <span className="text-muted">{digitalFootprint}%</span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={digitalFootprint} onChange={(e) => setDigitalFootprint(Number(e.target.value))}
              className="w-full h-1 bg-muted/30 rounded-lg appearance-none cursor-pointer accent-bone"
            />
          </div>

          {/* Toggle: The Midnight Oil */}
          <div className="space-y-4 border-t border-muted/20 pt-8">
            <div className="flex justify-between items-center font-mono text-sm">
              <span className="text-bone">The Midnight Oil</span>
            </div>
            <div className="flex space-x-4">
              {["On-Time", "Riding Deadline", "Late Submissions"].map(state => (
                <button 
                  key={state}
                  onClick={() => setDeadlineState(state as any)}
                  className={`flex-1 py-3 border font-mono text-xs transition-colors ${deadlineState === state ? (state === 'On-Time' ? 'border-safe text-safe bg-safe/10' : (state === 'Late Submissions' ? 'border-risk text-risk bg-risk/10' : 'border-orange-400 text-orange-400 bg-orange-400/10')) : 'border-muted/30 text-muted hover:border-muted'}`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Segmented: The Echo Chamber */}
          <div className="space-y-4 border-t border-muted/20 pt-8">
            <div className="flex justify-between items-center font-mono text-sm">
              <span className="text-bone">The Echo Chamber (Forums)</span>
            </div>
            <div className="flex space-x-4">
              {["Silent", "Occasional", "Active"].map(state => (
                <button 
                  key={state}
                  onClick={() => setEchoState(state as any)}
                  className={`flex-1 py-3 border font-mono text-xs transition-colors ${echoState === state ? 'border-bone text-bone bg-bone/10' : 'border-muted/30 text-muted hover:border-muted'}`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Slider 4: The Momentum */}
          <div className="space-y-4 border-t border-muted/20 pt-8">
            <div className="flex justify-between items-center font-mono text-sm">
              <span className="text-bone">The Momentum</span>
              <span className="text-muted">{momentum < 40 ? 'Fading' : (momentum > 70 ? 'Locked In' : 'Neutral')}</span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={momentum} onChange={(e) => setMomentum(Number(e.target.value))}
              className="w-full h-1 bg-muted/30 rounded-lg appearance-none cursor-pointer accent-bone"
            />
          </div>
        </div>

        {/* Dynamic Story Output */}
        <div className="bg-muted/5 p-6 border-l-2 border-bone">
          <p className="font-serif text-lg leading-relaxed text-bone/90 min-h-[120px]">
            {story}
          </p>
        </div>

      </div>
    </section>
  );
}

// Helper to calculate color logic for the dots
function overallHealth(digitalFootprint: number, deadlineState: string, echoState: string, momentum: number) {
  const footprintScore = digitalFootprint;
  const deadlineScore = deadlineState === "On-Time" ? 100 : (deadlineState === "Riding Deadline" ? 50 : 0);
  const echoScore = echoState === "Active" ? 100 : (echoState === "Occasional" ? 50 : 0);
  const momentumScore = momentum;
  return (footprintScore + deadlineScore + echoScore + momentumScore) / 4;
}
