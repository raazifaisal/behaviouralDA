"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  digitalFootprint: number;
  deadlineState: "On-Time" | "Riding Deadline" | "Late Submissions";
  echoState: "Silent" | "Occasional" | "Active";
  momentum: number;
}

export default function Climax({ digitalFootprint, deadlineState, echoState, momentum }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to interpolate slider values
  const interpolate = (val: number, min: number, max: number) => {
    return min + (val / 100) * (max - min);
  };

  const handleInference = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Map UI State to API Payload
    const payload = {
      features: {
        // 1. Digital Footprint (impacts full and early models)
        total_clicks: interpolate(digitalFootprint, 15, 4500),
        active_days: interpolate(digitalFootprint, 2, 85),
        login_freq_per_week: interpolate(digitalFootprint, 1, 35),
        avg_session_intensity: interpolate(digitalFootprint, 5, 80),
        
        // Explicit early features for digital footprint impact
        clicks_wk1_4: interpolate(digitalFootprint, 5, 1200),
        active_days_wk1_4: interpolate(digitalFootprint, 1, 28),
        submissions_wk1_4: interpolate(digitalFootprint, 0, 8),
        
        // 2. The Midnight Oil
        // high late submissions = 1.0 late rate, making late score very high
        // riding deadline = 0.5 late rate
        late_sub_rate: deadlineState === "Late Submissions" ? 0.90 : (deadlineState === "Riding Deadline" ? 0.40 : 0.02),
        avg_days_late: deadlineState === "Late Submissions" ? 8 : (deadlineState === "Riding Deadline" ? 2 : 0),
        
        // 3. The Echo Chamber
        forum_clicks: echoState === 'Silent' ? 0 : (echoState === 'Occasional' ? 25 : 450),
        
        // 4. The Momentum
        // momentum slider: 0 = fading, 100 = locked in
        // fading means low score, low engagement rate
        engagement_decline_rate: interpolate(momentum, 0.0, 1.5), // 0 momentum -> 0.0 rate (very bad), 100 momentum -> 1.5 rate (very good)
        score_trend: interpolate(momentum, -30, 15), // 0 momentum -> -30 trend
        avg_score: interpolate(momentum, 10, 95),    // 0 momentum -> 10 avg score
        min_score: interpolate(momentum, 0, 85),
        early_scores_avg: interpolate(momentum, 20, 90),
        
        // 5. Hidden Background Defaults
        early_dropout_flag: momentum < 30 ? 1 : 0, // dynamic early flag based on momentum
        imd_band_num: 1, // lowest socio-economic band to show highest baseline risk
        num_of_prev_attempts: 0,
        studied_credits: 60,
        peak_activity_week: 12,
        activity_std: 15.5
      }
    };

    try {
      // Assuming backend is served on same domain or we configure proxy in real deployment.
      // Since it's a static export next to backend, fetch to /api/predict/all works perfectly.
      const res = await fetch('/api/predict/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("API not accessible. Are you running the FastAPI backend?");
      const data = await res.json();
      
      // Artificial delay for dramatic effect
      setTimeout(() => {
        setResult(data);
        setIsLoading(false);
      }, 2000);

    } catch (err: any) {
      setTimeout(() => {
        setError(err.message);
        setIsLoading(false);
      }, 1000);
    }
  };

    // High Risk: model is genuinely confident (≥70% at-risk OR ≥55% dropout) OR risk score clearly high
    const isRisk = (result?.at_risk_probability >= 0.70) ||
                   (result?.dropout_probability >= 0.55) ||
                   (result?.risk_score >= 68);
    // Borderline: model flags at-risk but with moderate confidence, or risk score in the middle band
    const isBorderline = !isRisk && (
      result?.predicted_at_risk ||
      result?.predicted_dropout ||
      result?.risk_score >= 35 ||
      result?.burnout_risk_level === 'Medium'
    );

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-1000"
      style={{
        backgroundColor: '#040404',
      }}
    >
      {/* Dynamic ambient glow based on result */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none transition-colors duration-1000"
        style={{
          background: result 
            ? `radial-gradient(circle at center, ${isRisk ? 'var(--color-risk)' : (isBorderline ? '#FFA500' : 'var(--color-safe)')} 0%, transparent 70%)` 
            : 'radial-gradient(circle at center, var(--color-muted) 0%, transparent 70%)'
        }}
      />

      <div className="z-10 w-full max-w-2xl relative">
        <div className={`backdrop-blur-xl border p-8 md:p-12 transition-colors duration-1000 ${
          result 
            ? (isRisk ? 'bg-risk/5 border-risk/30' : (isBorderline ? 'bg-orange-500/5 border-orange-500/30' : 'bg-safe/5 border-safe/30')) 
            : 'bg-bone/5 border-muted/20'
        }`}>
          
          <AnimatePresence mode="wait">
            {!result && !isLoading && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-8"
              >
                <h2 className="font-serif text-3xl text-bone">The Inference</h2>
                <p className="font-mono text-muted text-sm">
                  System ready. Data matrix compiled. 17 variables aligned.
                </p>
                <button 
                  onClick={handleInference}
                  className="group relative px-8 py-4 bg-bone text-void font-mono font-bold tracking-widest uppercase overflow-hidden"
                >
                  <span className="relative z-10">[ Run Live Inference ]</span>
                  <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
                </button>
              </motion.div>
            )}

            {isLoading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-6"
              >
                <div className="font-mono text-bone tracking-widest animate-pulse">
                  SCANNING NEURAL VECTORS...
                </div>
                <div className="flex justify-center gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div 
                      key={i}
                      className="w-2 h-2 bg-bone"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="text-center border-b border-white/10 pb-8">
                  <div className={`font-serif text-5xl md:text-7xl mb-4 ${isRisk ? 'text-risk drop-shadow-[0_0_15px_rgba(255,75,62,0.5)]' : (isBorderline ? 'text-orange-400 drop-shadow-[0_0_15px_rgba(255,165,0,0.5)]' : 'text-safe drop-shadow-[0_0_15px_rgba(75,255,209,0.5)]')}`}>
                    {isRisk ? 'High Risk' : (isBorderline ? 'Borderline' : 'Secure')}
                  </div>
                  <div className="font-mono text-muted">
                    At-Risk Probability: {(result.at_risk_probability * 100).toFixed(1)}% <br/>
                    Dropout Probability: {(result.dropout_probability * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="font-mono text-sm text-bone">Diagnostics:</div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono text-muted">
                    <div>Risk Score: <span className="text-bone">{result.risk_score}/100</span></div>
                    <div>Burnout Level: <span className="text-bone">{result.burnout_risk_level}</span></div>
                  </div>
                  
                  {result.recommended_interventions && result.recommended_interventions.length > 0 && (
                    <div className="mt-6 p-4 bg-black/50 border border-white/10">
                      <div className="font-mono text-xs text-bone mb-2">Intervention Protocol:</div>
                      <ul className="space-y-2 text-xs font-mono text-muted">
                        {result.recommended_interventions.map((rec: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className={isRisk ? 'text-risk' : (isBorderline ? 'text-orange-400' : 'text-safe')}>&gt;</span> {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-4 text-center">
                  <button 
                    onClick={() => setResult(null)}
                    className="font-mono text-xs text-muted hover:text-bone transition-colors"
                  >
                    [ Reset System ]
                  </button>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-risk font-mono text-sm space-y-4"
              >
                <div>ERROR: {error}</div>
                <button 
                  onClick={() => setError(null)}
                  className="underline text-muted"
                >
                  Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
