import React from 'react';
import { 
  Activity, 
  ScanFace, 
  Database, 
  BadgeCheck, 
  UserPlus, 
  GaugeCircle, 
  Cpu, 
  LayoutGrid,
  ShieldCheck
} from 'lucide-react';
import heroImage from '../assets/hero-recognition.jpg';

interface HeroSectionProps {
  onStartRecognition: () => void;
  onViewGallery: () => void;
  onOpenEnrollModal: () => void;
  enrolledCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartRecognition,
  onViewGallery,
  onOpenEnrollModal,
  enrolledCount,
}) => {
  const STATS = [
    { label: "Faculty enrolled", value: enrolledCount.toString(), icon: UserPlus },
    { label: "Recognition accuracy", value: "99.4%", icon: GaugeCircle },
    { label: "Avg. inference latency", value: "34 ms", icon: Cpu },
    { label: "Vector dimension", value: "512-d ArcFace", icon: LayoutGrid },
  ];

  return (
    <section className="grid-backdrop border-b border-border/70 py-12 lg:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Left Column Text & Controls */}
        <div className="animate-rise space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Activity className="size-3.5 text-primary" /> AIML · Computer Vision · Deep Learning
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl tracking-tight">
            Know every face on
            <span className="bg-gradient-to-r from-primary via-slate-700 to-primary bg-clip-text text-transparent"> campus</span>, in milliseconds.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            FacultyIQ turns any camera into a biometric perception desk. 512-dimensional ArcFace embeddings identify staff, MobileNet anti-spoofing stops liveness spoofs, and FAISS vector matching logs attendance instantly.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onStartRecognition}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            >
              <ScanFace className="size-4" />
              <span>Start Live Recognition</span>
            </button>

            <button
              onClick={onViewGallery}
              className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary active:scale-95 cursor-pointer"
            >
              <Database className="size-4" />
              <span>View Faculty Gallery</span>
            </button>

            <button
              onClick={onOpenEnrollModal}
              className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/10 active:scale-95 cursor-pointer"
            >
              <UserPlus className="size-4" />
              <span>Enrol Faculty</span>
            </button>
          </div>

          {/* Telemetry Stats Grid */}
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="panel px-4 py-3.5 transition-all hover:border-primary/40">
                  <Icon className="size-4 text-primary" />
                  <dd className="text-display mt-2 text-xl font-bold tracking-tight">{stat.value}</dd>
                  <dt className="text-[11px] font-medium text-muted-foreground">{stat.label}</dt>
                </div>
              );
            })}
          </dl>
        </div>

        {/* Right Column Cyber Recognition Graphic */}
        <div className="panel relative overflow-hidden p-2 shadow-glow animate-rise">
          <img
            src={heroImage}
            alt="Faculty face being analysed by biometric landmarks"
            className="w-full rounded-2xl object-cover grayscale contrast-[1.06]"
          />
          <div className="pointer-events-none absolute inset-2 overflow-hidden rounded-2xl">
            <div className="animate-scanline h-28 w-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
          </div>

          <div className="absolute top-6 right-6 flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 text-xs font-mono font-semibold backdrop-blur shadow-sm">
            <ShieldCheck className="size-4 text-emerald-600" />
            FAISS Index: Operational
          </div>

          <div className="absolute bottom-6 left-6 flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-background/90 px-4 py-2 text-xs font-semibold backdrop-blur shadow-lg">
            <BadgeCheck className="size-4 text-emerald-600 animate-pulse" />
            <span>Prof. Swarnim Pradhan · <strong>99.8% Match Verified</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};
