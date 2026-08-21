import React from 'react';
import { ScanFace, Sliders, CheckCircle2 } from 'lucide-react';
import type { SystemConfig } from '../types';

interface ModelsTableViewProps {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
  onOpenAssistant: () => void;
}

export const ModelsTableView: React.FC<ModelsTableViewProps> = ({
  config,
  setConfig,
  onOpenAssistant,
}) => {
  const MODELS = [
    { name: "RetinaFace-R50", task: "Face detection & 68-point alignment", metric: "mAP 96.4%", latency: "12 ms", status: "Deployed" },
    { name: "ArcFace-512", task: "Identity embeddings (512-d)", metric: "LFW 99.6%", latency: "14 ms", status: "Deployed" },
    { name: "MobileNet-AS", task: "Anti-spoof / liveness classifier", metric: "FAR 0.4%", latency: "5 ms", status: "Deployed" },
    { name: "ResNet-Pose", task: "Head pose & occlusion estimation", metric: "MAE 2.1°", latency: "3 ms", status: "Deployed" },
  ];

  return (
    <section className="py-12 border-b border-border/70">
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        {/* Title & Threshold Slider Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 panel p-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Models in production</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Deep neural networks driving real-time inference, landmark estimation, and vector matching.
            </p>
          </div>

          {/* Threshold Control */}
          <div className="flex items-center gap-4 bg-secondary/50 p-3.5 rounded-xl border border-border/70 min-w-[320px]">
            <Sliders className="size-4 text-primary shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Matching Threshold:</span>
                <span className="font-mono text-primary font-bold">{config.matchingThreshold}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                step="1"
                value={config.matchingThreshold}
                onChange={(e) => setConfig({ ...config, matchingThreshold: Number(e.target.value) })}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Models Telemetry Table */}
        <div className="panel overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/40 text-xs font-mono uppercase tracking-wider text-muted-foreground border-b border-border/70">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Model Name</th>
                <th className="px-6 py-3.5 font-semibold">Perception Task</th>
                <th className="px-6 py-3.5 font-semibold">Benchmark</th>
                <th className="px-6 py-3.5 font-semibold">Inference Latency</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {MODELS.map((m) => (
                <tr key={m.name} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-foreground">{m.name}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{m.task}</td>
                  <td className="px-6 py-4 font-mono text-xs text-primary font-semibold">{m.metric}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{m.latency}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="size-3 text-emerald-600" /> {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Callout Box */}
        <div className="panel p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ScanFace className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Need help tuning threshold or embeddings?</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Vision Assist walks through RetinaFace detection, ArcFace cosine metrics, and liveness anti-spoofing parameters.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90 active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Ask Vision Assist</span>
          </button>
        </div>
      </div>
    </section>
  );
};
