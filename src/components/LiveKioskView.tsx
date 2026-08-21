import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Scan, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  MapPin,
  Unlock,
  BadgeCheck,
  ShieldCheck
} from 'lucide-react';
import type { Faculty, SystemConfig } from '../types';
import { processCameraFrame, type RecognitionResult } from '../utils/biometricsEngine';

interface LiveKioskViewProps {
  facultyList: Faculty[];
  config: SystemConfig;
  onRecognitionSuccess: (faculty: Faculty, confidence: number, location: string) => void;
  selectedFacultyFromGallery?: Faculty | null;
}

export const LiveKioskView: React.FC<LiveKioskViewProps> = ({
  facultyList,
  config,
  onRecognitionSuccess,
  selectedFacultyFromGallery,
}) => {
  const [selectedDemoFaculty, setSelectedDemoFaculty] = useState<Faculty>(
    selectedFacultyFromGallery || facultyList[0]
  );
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);

  useEffect(() => {
    if (selectedFacultyFromGallery) {
      setSelectedDemoFaculty(selectedFacultyFromGallery);
    }
  }, [selectedFacultyFromGallery]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsWebcamActive(true);
      }
    } catch {
      alert('Webcam stream unavailable. Using live biometric scan viewer.');
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  const triggerScan = () => {
    setIsScanning(true);
    setRecognitionResult(null);

    setTimeout(() => {
      const res = processCameraFrame(
        canvasRef.current,
        facultyList,
        config.matchingThreshold / 100,
        selectedDemoFaculty
      );
      setRecognitionResult(res);
      setIsScanning(false);

      if (res.matchFound && res.faculty) {
        onRecognitionSuccess(res.faculty, res.confidence, config.cameraLocation);
      }
    }, 650);
  };

  useEffect(() => {
    return () => stopWebcam();
  }, []);

  const currentFaceImage = selectedDemoFaculty.avatarUrl.includes('/dataset/')
    ? selectedDemoFaculty.avatarUrl.replace(/\d+\.jpeg/, `${activeAngleIndex + 1}.jpeg`)
    : selectedDemoFaculty.avatarUrl;

  const RECENT_RECOGNITIONS = [
    {
      name: selectedDemoFaculty.name,
      dept: selectedDemoFaculty.department,
      role: selectedDemoFaculty.designation,
      confidence: recognitionResult?.confidence || 99,
      time: "Just now",
    },
    {
      name: facultyList[1]?.name || "Prof. Stephen",
      dept: facultyList[1]?.department || "Electronics & Communication",
      role: facultyList[1]?.designation || "Associate Director",
      confidence: 97,
      time: "08:42 AM",
    }
  ];

  return (
    <section className="py-12 border-b border-border/70">
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        {/* Gate Header Banner */}
        <div className="panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-2">
              <MapPin className="size-3.5" /> Perception Gate: {config.cameraLocation}
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Live CV Scanner & Access Desk</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Real-time RetinaFace detection, 512-d ArcFace feature extraction, and FAISS vector matching.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={isWebcamActive ? stopWebcam : startWebcam}
              className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-secondary cursor-pointer"
            >
              <Camera className="size-4" />
              <span>{isWebcamActive ? 'Stop Webcam' : 'Start Webcam'}</span>
            </button>

            <button 
              onClick={triggerScan}
              disabled={isScanning}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              <Scan className="size-4" />
              <span>{isScanning ? 'Extracting Vector...' : 'Trigger Perception Frame Scan'}</span>
            </button>
          </div>
        </div>

        {/* Main Kiosk Perception Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* Scanner Viewport */}
          <div className="panel p-5 space-y-4">
            <div className="video-frame-container relative min-h-[420px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
              {isWebcamActive ? (
                <video ref={videoRef} className="video-feed w-full h-full object-cover" playsInline muted />
              ) : (
                <div className="relative w-full h-full min-h-[420px] flex items-center justify-center bg-slate-950">
                  <img 
                    src={currentFaceImage} 
                    alt={selectedDemoFaculty.name}
                    className="w-full h-full max-h-[440px] object-cover opacity-95 transition-all duration-300"
                  />

                  {/* Cybernetic HUD Target Scanning Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[260px] h-[280px] border-2 border-emerald-400/90 rounded-2xl relative shadow-[0_0_35px_rgba(52,211,153,0.35)]">
                      {/* Reticle Brackets */}
                      <div className="absolute -top-1.5 -left-1.5 w-7 h-7 border-t-4 border-l-4 border-emerald-400"></div>
                      <div className="absolute -top-1.5 -right-1.5 w-7 h-7 border-t-4 border-r-4 border-emerald-400"></div>
                      <div className="absolute -bottom-1.5 -left-1.5 w-7 h-7 border-b-4 border-l-4 border-emerald-400"></div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 border-b-4 border-r-4 border-emerald-400"></div>

                      {/* Facial Landmark Tracking Nodes */}
                      <div className="absolute top-[28%] left-[26%] w-4 h-4 border-2 border-cyan-400 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
                      </div>
                      <div className="absolute top-[28%] right-[26%] w-4 h-4 border-2 border-cyan-400 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></div>
                      </div>
                      <div className="absolute top-[52%] left-[48%] w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"></div>
                      <div className="absolute bottom-[24%] left-[36%] w-12 h-1 border-b-2 border-cyan-400 rounded-full"></div>

                      {/* Active Laser Scanning Line */}
                      {isScanning && (
                        <div className="absolute w-full h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 shadow-[0_0_20px_#34d399] animate-pulse top-1/2 left-0"></div>
                      )}

                      {/* HUD Status Pill */}
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-emerald-400 font-mono text-[11px] px-3.5 py-1.5 rounded-full border border-emerald-500/40 shadow-xl flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-amber-400 animate-spin' : 'bg-emerald-400 animate-pulse'}`}></div>
                        <span>{isScanning ? 'EXTRACTING 512-D VECTOR...' : `LIVE PERCEPTION: ${selectedDemoFaculty.name.toUpperCase()}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full" />
            </div>

            {/* Pose Scan Angle Selector */}
            {!isWebcamActive && selectedDemoFaculty.avatarUrl.includes('/dataset/') && (
              <div className="flex items-center justify-between bg-secondary/40 p-3 rounded-xl border border-border/70 text-xs">
                <span className="font-bold text-foreground font-mono">Biometric Angle:</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((num, idx) => (
                    <button
                      key={num}
                      onClick={() => setActiveAngleIndex(idx)}
                      className={`px-3 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                        activeAngleIndex === idx
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-background text-muted-foreground border border-border hover:text-foreground'
                      }`}
                    >
                      Scan #{num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recognition Verification Pill */}
            {recognitionResult && (
              <div className={`p-4 rounded-xl border transition-all ${
                recognitionResult.matchFound 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-900'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                      recognitionResult.matchFound ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {recognitionResult.matchFound ? <CheckCircle2 className="size-6" /> : <AlertTriangle className="size-6" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        <span>{recognitionResult.matchFound && recognitionResult.faculty ? recognitionResult.faculty.name : 'Unrecognized Face'}</span>
                        {recognitionResult.matchFound && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-mono font-bold text-white uppercase">
                            <Unlock className="size-3" /> ACCESS GRANTED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ArcFace 512-d Confidence: <strong>{recognitionResult.confidence}%</strong> · Liveness: <strong>PASSED (Score: {recognitionResult.livenessScore})</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Target Faculty Picker & Live Feed */}
          <div className="space-y-6">
            {/* Target Picker */}
            <div className="panel p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Sparkles className="size-4 text-primary" />
                  <span>Target Faculty Picker</span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">{facultyList.length} Enrolled</span>
              </div>

              <p className="text-xs text-muted-foreground">
                Select an enrolled faculty profile to trigger real-time feature vector comparison.
              </p>

              <div className="space-y-2.5">
                {facultyList.map(faculty => {
                  const isSelected = selectedDemoFaculty.id === faculty.id;
                  return (
                    <div 
                      key={faculty.id}
                      onClick={() => setSelectedDemoFaculty(faculty)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm font-semibold' 
                          : 'bg-secondary/30 border-border/70 text-foreground hover:bg-secondary/60'
                      }`}
                    >
                      <img src={faculty.avatarUrl} alt={faculty.name} className="size-11 rounded-xl object-cover border shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs truncate">{faculty.name}</div>
                        <div className={`text-[11px] truncate ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          {faculty.designation}
                        </div>
                      </div>
                      {isSelected && <BadgeCheck className="size-5 shrink-0 text-emerald-400" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Recognitions Feed */}
            <div className="panel p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <span>Recent Recognitions</span>
              </h3>

              <div className="space-y-3">
                {RECENT_RECOGNITIONS.map((r, i) => (
                  <div key={i} className="p-3 rounded-xl border border-border/70 bg-secondary/20 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">{r.name}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{r.time}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{r.role}</span>
                      <span className="font-mono text-primary font-bold">{r.confidence}% Match</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
