"use client";

import { useState } from "react";
import Problem from "./Problem";
import Dataset from "./Dataset";
import Engine from "./Engine";
import Models from "./Models";
import InteractiveProtagonist from "./InteractiveProtagonist";
import Climax from "./Climax";
import Footer from "./Footer";

export default function MainExperience() {
  // Shared state between InteractiveProtagonist (Ch 2) and Climax (Ch 4)
  const [digitalFootprint, setDigitalFootprint] = useState(50); // 0-100
  const [deadlineState, setDeadlineState] = useState<"On-Time" | "Riding Deadline" | "Late Submissions">("On-Time");
  const [echoState, setEchoState] = useState<"Silent" | "Occasional" | "Active">("Occasional");
  const [momentum, setMomentum] = useState(50); // 0-100

  return (
    <>
      <Problem />
      <Dataset />
      <Engine />
      <Models />
      <InteractiveProtagonist 
        digitalFootprint={digitalFootprint} setDigitalFootprint={setDigitalFootprint}
        deadlineState={deadlineState} setDeadlineState={setDeadlineState}
        echoState={echoState} setEchoState={setEchoState}
        momentum={momentum} setMomentum={setMomentum}
      />
      <Climax 
        digitalFootprint={digitalFootprint}
        deadlineState={deadlineState}
        echoState={echoState}
        momentum={momentum}
      />
      <Footer />
    </>
  );
}
