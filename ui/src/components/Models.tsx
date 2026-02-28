"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";

const VIZ_BASE = "/artifacts/viz";

function VizImage({ src, title, fullWidth }: { src: string; title: string; fullWidth: boolean }) {
  const [error, setError] = useState(false);
  return (
    <div className="w-full">
      <p className="font-mono text-muted text-sm mb-2">{title}</p>
      {error ? (
        <div className="rounded-lg border border-white/10 bg-black/30 p-6 font-mono text-muted text-sm">
          Image not loaded — run the notebook&apos;s last cell to export viz, then serve from the FastAPI backend.
        </div>
      ) : (
        <img
          src={src}
          alt={title}
          onError={() => setError(true)}
          className={`rounded-lg border border-white/10 bg-black/30 w-full ${fullWidth ? "" : "max-h-[380px] object-contain object-left"}`}
        />
      )}
    </div>
  );
}

const VIZ_LIST = [
  { file: "dashboard_summary.png", title: "Dashboard summary (all panels)", fullWidth: true },
  { file: "model_roc_early.png", title: "4-week early dropout model — ROC curve (AUC 0.81)", fullWidth: false },
  { file: "model_feature_importance.png", title: "Full at-risk model — RF feature importance (top 10)" },
  { file: "model_risk_score_distribution.png", title: "Risk score distribution" },
  { file: "model_kmeans_clusters.png", title: "k-Means clusters (engagement × late submission)" },
  { file: "model_risk_by_imd.png", title: "Risk score by IMD band" },
  { file: "dataset_outcome_distribution.png", title: "Dataset — Outcome distribution" },
  { file: "dataset_dropout_timing.png", title: "Dataset — Dropout timing" },
  { file: "dataset_module_withdrawal.png", title: "Dataset — Module withdrawal rates" },
  { file: "dataset_engagement_trajectories.png", title: "Dataset — Engagement trajectories by outcome" },
  { file: "dataset_heatmap_sample.png", title: "Dataset — Student × week (sample)" },
  { file: "dataset_decline_by_outcome.png", title: "Dataset — Decline rate by outcome" },
];

// Portal wrapper — renders children into document.body to escape stacking-context issues
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function Models() {
  const container = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [metrics, setMetrics] = useState<Record<string, Record<string, number | string>> | null>(null);
  const lenis = useLenis();

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

  const openModal = () => {
    setModalOpen(true);
    fetch(`${VIZ_BASE}/metrics.json`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setMetrics(data || null))
      .catch(() => setMetrics(null));
  };

  const closeModal = () => setModalOpen(false);

  // Pause Lenis + lock body scroll while modal is open
  useEffect(() => {
    if (!modalOpen) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [modalOpen, lenis]);

  // Escape key closes the modal
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

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

        <div className="flex justify-center">
          <button
            type="button"
            onClick={openModal}
            className="font-mono text-bone underline underline-offset-4 focus:outline-none focus:ring-0"
          >
            See detailed results
          </button>
        </div>
      </div>

      {/* Modal — rendered into document.body via portal to avoid stacking-context / Lenis issues */}
      <Portal>
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              key="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: "fixed", inset: 0, zIndex: 9999 }}
              className="flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
              onClick={closeModal}
            >
              <motion.div
                key="modal-card"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "tween", duration: 0.2 }}
                style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
                className="relative w-full max-w-5xl bg-void border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Sticky header + close button */}
                <div className="shrink-0 flex items-center justify-between px-8 pt-8 pb-4 md:px-12">
                  <h3 className="font-serif text-3xl text-bone">Detailed results</h3>
                  <button
                    type="button"
                    aria-label="Close"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-bone hover:bg-white/20 focus:outline-none"
                    onClick={closeModal}
                  >
                    <span className="text-xl leading-none">×</span>
                  </button>
                </div>

                {/* Scrollable body — data-lenis-prevent tells Lenis to leave this element alone */}
                <div
                  data-lenis-prevent
                  className="flex-1 min-h-0 overflow-y-scroll px-8 pb-12 md:px-12 space-y-12"
                >
                  {metrics && (
                    <div className="space-y-6">
                      <h4 className="font-mono text-muted uppercase tracking-widest text-sm">Model metrics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(metrics).map(([modelKey, m]) => (
                          <div key={modelKey} className="p-4 rounded-xl bg-black/50 border border-white/10">
                            <div className="font-mono text-safe text-sm mb-2 capitalize">
                              {modelKey.replace(/_/g, " ")}
                            </div>
                            <ul className="space-y-1 text-sm text-muted font-mono list-none">
                              {typeof m.accuracy === "number" && <li>Accuracy: {(m.accuracy * 100).toFixed(1)}%</li>}
                              {typeof m.precision === "number" && <li>Precision: {(m.precision * 100).toFixed(1)}%</li>}
                              {typeof m.recall === "number" && <li>Recall: {(m.recall * 100).toFixed(1)}%</li>}
                              {typeof m.f1 === "number" && <li>F1: {m.f1.toFixed(3)}</li>}
                              {m.roc_auc != null && <li>ROC-AUC: {String(m.roc_auc)}</li>}
                              {m.cv_accuracy != null && <li>CV accuracy: {String(m.cv_accuracy)}</li>}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <h4 className="font-mono text-muted uppercase tracking-widest text-sm">
                      Visualizations ({VIZ_LIST.length} charts)
                    </h4>
                    <p className="font-mono text-muted text-xs">
                      Scroll to see ROC curve, feature importance, risk distributions, and dataset charts.
                    </p>
                    <div className="space-y-8">
                      {VIZ_LIST.map(({ file, title, fullWidth }) => (
                        <VizImage
                          key={file}
                          src={`${VIZ_BASE}/${file}`}
                          title={title}
                          fullWidth={!!fullWidth}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </section>
  );
}
