import React, { useState } from 'react';
import { Eye, Brain, Fingerprint, ShieldCheck, ChevronRight } from 'lucide-react';

export const PipelineSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const PIPELINE = [
    {
      step: "01",
      title: "Detect & align",
      icon: Eye,
      summary: "RetinaFace locates faces in the frame, then 68-point landmarks align and normalise each crop.",
      details: "RetinaFace computes single-stage multi-task face detection using Feature Pyramid Networks (FPN). It extracts 5 facial landmark points (eyes, nose, mouth corners) to apply spatial affine transformation matrix normalization."
    },
    {
      step: "02",
      title: "Embed",
      icon: Brain,
      summary: "A fine-tuned ArcFace CNN converts every aligned face into a 512-dimension identity vector.",
      details: "Additive Angular Margin Loss (ArcFace) projects normalized 112x112 RGB face crops onto a hyper-spherical feature space with margin penalty m=0.5, yielding a deterministic 512-d unit normalized embedding vector."
    },
    {
      step: "03",
      title: "Match",
      icon: Fingerprint,
      summary: "Cosine similarity against the faculty gallery returns the closest identity with a confidence score.",
      details: "FAISS (Facebook AI Similarity Search) index performs high-throughput dot-product cosine similarity operations across enrolled faculty vectors. Matches with score > 60% are returned instantly."
    },
    {
      step: "04",
      title: "Verify & log",
      icon: ShieldCheck,
      summary: "Liveness screening rejects spoofs before attendance and access events are written to the log.",
      details: "MobileNet anti-spoofing classifier conducts texture analysis, micro-expression jitter checking, and reflection screening to ensure physical presence before persisting timestamped attendance audit logs."
    },
  ];

  return (
    <section className="border-b border-border/70 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">The recognition pipeline</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Four deep learning stages run per frame, end to end, on edge or GPU. Click any stage to inspect algorithm details.
            </p>
          </div>
        </div>

        {/* 4 Pipeline Stage Grid */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStepIndex === idx;
            return (
              <article
                key={stage.step}
                onClick={() => setActiveStepIndex(isSelected ? null : idx)}
                className={`panel group p-5 transition-all cursor-pointer select-none ${
                  isSelected ? 'border-primary shadow-glow bg-secondary/30' : 'hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-mono text-xs font-bold text-muted-foreground">{stage.step}</span>
                </div>

                <h3 className="mt-4 text-base font-bold text-foreground flex items-center justify-between">
                  <span>{stage.title}</span>
                  <ChevronRight className={`size-4 text-muted-foreground transition-transform ${isSelected ? 'rotate-90 text-primary' : ''}`} />
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.summary}</p>

                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-foreground leading-normal bg-background/60 p-2.5 rounded-lg border">
                    <span className="font-bold text-primary block mb-1">Algorithm Telemetry:</span>
                    {stage.details}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
