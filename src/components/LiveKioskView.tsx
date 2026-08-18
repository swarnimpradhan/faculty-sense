import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Scan, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  MapPin,
  Check,
  Unlock
} from 'lucide-react';
import type { Faculty, SystemConfig } from '../types';
import { processCameraFrame, type RecognitionResult } from '../utils/biometricsEngine';

interface LiveKioskViewProps {
  facultyList: Faculty[];
  config: SystemConfig;
  onRecognitionSuccess: (faculty: Faculty, confidence: number, location: string) => void;
}

export const LiveKioskView: React.FC<LiveKioskViewProps> = ({
  facultyList,
  config,
  onRecognitionSuccess,
}) => {
  const [selectedDemoFaculty, setSelectedDemoFaculty] = useState<Faculty>(facultyList[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsWebcamActive(true);
      }
    } catch {
      alert('Webcam stream unavailable. Using simulated live target picker on the right panel.');
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
    }, 700);
  };

  useEffect(() => {
    return () => stopWebcam();
  }, []);

  return (
    <div className="space-y-6">
      {/* Pulse Clinic Style Hero Greeting Banner */}
      <div className="hero-greeting-card">
        <div className="hero-subtitle">FACULTY HEALTH & BIOMETRICS</div>
        <h1 className="hero-title">Hello, Admin</h1>
        <p className="hero-description">
          Your faculty recognition events, schedule timetables, and vector logs, in one place.
        </p>

        {/* Featured Next Appointment / Active Perception Banner */}
        <div className="hero-featured-banner">
          <div>
            <div className="featured-label">ACTIVE PERCEPTION GATE</div>
            <div className="featured-details">{config.cameraLocation} · ArcFace 512-d</div>
            <div className="featured-subdetails">FAISS Cosine Similarity Index Threshold: {config.matchingThreshold}%</div>
          </div>
          <button className="secondary-pill-btn" onClick={() => alert('Gate location updated!')}>
            Change Gate
          </button>
        </div>
      </div>

      {/* Main Kiosk Perception Grid */}
      <div className="kiosk-main-layout">
        {/* Video / Scanning Viewport */}
        <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <MapPin size={14} className="text-slate-900" />
              <span>Location: {config.cameraLocation}</span>
            </div>

            <div className="flex gap-2">
              <button 
                className="secondary-pill-btn"
                onClick={isWebcamActive ? stopWebcam : startWebcam}
              >
                <Camera size={14} />
                <span>{isWebcamActive ? 'Stop Webcam' : 'Start Webcam'}</span>
              </button>

              <button 
                className="primary-action-pill"
                onClick={triggerScan}
                disabled={isScanning}
              >
                <Scan size={14} />
                <span>{isScanning ? 'Extracting Vector...' : 'Trigger Perception Frame Scan'}</span>
              </button>
            </div>
          </div>

          <div className="video-frame-container relative">
            {isWebcamActive ? (
              <video ref={videoRef} className="video-feed" playsInline muted />
            ) : (
              <div className="text-center p-12 text-slate-400 space-y-3">
                <Camera size={44} className="mx-auto text-slate-300" />
                <div className="text-sm font-extrabold text-slate-700">Webcam Not Streamed</div>
                <div className="text-xs text-slate-400">Select a faculty profile on the right to simulate live CV perception scan.</div>
              </div>
            )}

            {/* Simulated Canvas HUD Overlay */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full" />
          </div>

          {/* Recognition Result Pill */}
          {recognitionResult && (
            <div className={`p-4 rounded-2xl border transition-all ${
              recognitionResult.matchFound 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-md' 
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {recognitionResult.matchFound ? (
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <AlertTriangle size={24} />
                    </div>
                  )}
                  <div>
                    <div className="font-extrabold text-base flex items-center gap-2">
                      {recognitionResult.matchFound && recognitionResult.faculty 
                        ? `${recognitionResult.faculty.name}` 
                        : 'Unrecognized Face / Low Cosine Score'}
                      {recognitionResult.matchFound && (
                        <span className="text-[11px] font-bold bg-emerald-700 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Unlock size={11} /> ACCESS GRANTED
                        </span>
                      )}
                    </div>
                    <div className="text-xs opacity-90 mt-0.5">
                      ArcFace 512-d Match Confidence: <strong>{recognitionResult.confidence}%</strong> · Liveness: <strong>PASSED (Score: {recognitionResult.livenessScore})</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`status-pill ${recognitionResult.matchFound ? 'green' : 'amber'}`}>
                    {recognitionResult.matchFound ? '• Match Verified' : '• Verification Flagged'}
                  </span>
                  {recognitionResult.matchFound && recognitionResult.faculty && (
                    <div className="text-[11px] text-emerald-800 font-bold mt-1">
                      {recognitionResult.faculty.designation}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Simulated Live Target Picker */}
        <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm space-y-3 flex flex-col">
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <Sparkles size={16} />
            <span>Simulated Live Target Picker</span>
          </div>
          <p className="text-xs text-slate-500">
            Click any enrolled faculty profile to trigger real-time detection & 512-d vector matching against FAISS index.
          </p>

          <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
            {facultyList.map(faculty => (
              <div 
                key={faculty.id}
                onClick={() => setSelectedDemoFaculty(faculty)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  selectedDemoFaculty.id === faculty.id 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                }`}
              >
                <img src={faculty.avatarUrl} alt={faculty.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-xs truncate">{faculty.name}</div>
                  <div className={`text-[11px] truncate ${selectedDemoFaculty.id === faculty.id ? 'text-slate-300' : 'text-slate-500'}`}>
                    {faculty.designation}
                  </div>
                </div>
                {selectedDemoFaculty.id === faculty.id && (
                  <Check size={16} className="text-white shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pulse Clinic Style 3-Column Cards */}
      <div className="pulse-dashboard-grid">
        {/* Card 1 */}
        <div className="dash-card">
          <div className="card-header-title">Faculty Presence Overview</div>
          <div className="card-row-item">
            <div>
              <div className="row-item-title">Dr. Ananya Sharma</div>
              <div className="row-item-sub">Check-in: 08:52 AM · Gate 1</div>
            </div>
            <span className="status-pill green">• On track</span>
          </div>
          <div className="card-row-item">
            <div>
              <div className="row-item-title">Dr. Vikramaditya Rao</div>
              <div className="row-item-sub">Check-in: 09:14 AM · Block I Gate</div>
            </div>
            <span className="status-pill amber">• Repeat soon</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="dash-card">
          <div className="card-header-title">Recent Vector Results</div>
          <div className="card-row-item">
            <div>
              <div className="row-item-title">FAISS 512-d Cosine Index</div>
              <div className="row-item-sub">Released today · inside usual range</div>
            </div>
            <span className="status-pill green">• Reviewed</span>
          </div>
          <div className="card-row-item">
            <div>
              <div className="row-item-title">ArcFace Model Backbone</div>
              <div className="row-item-sub">ResNet-100 pretrained</div>
            </div>
            <span className="status-pill blue">• Note</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="dash-card">
          <div className="card-header-title">Biometric Health & Spoof Protection</div>
          <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-2.5 rounded-xl border border-emerald-200">
            Up to date - next check at annual review
          </div>
          <div className="card-row-item">
            <div>
              <div className="row-item-title">Liveness Texture Analysis</div>
              <div className="row-item-sub">98.4% Confidence Passed</div>
            </div>
            <span className="text-xs text-slate-500 font-semibold">12 Aug 2026</span>
          </div>
        </div>
      </div>

      {/* Pulse Clinic Style Activity Stream */}
      <div className="activity-stream-card">
        <div className="card-header-title mb-3">Recent Activity</div>
        <div className="activity-list">
          <div className="activity-row">
            <div>
              <div className="activity-title">Biometric 512-d embedding verified for Dr. Ananya Sharma</div>
              <div className="activity-sub">Verified at Main Campus Entrance Gate 1 before release · 08:52 AM</div>
            </div>
            <span className="status-pill blue">• Results</span>
          </div>

          <div className="activity-row">
            <div>
              <div className="activity-title">Late check-in anomaly flagged for Dr. Vikramaditya Rao</div>
              <div className="activity-sub">Checked in at 09:14 AM vs 09:00 AM scheduled lecture start time</div>
            </div>
            <span className="status-pill green">• Medication</span>
          </div>

          <div className="activity-row">
            <div>
              <div className="activity-title">Attendance log entry #LOG-4921 synchronized to Postgres</div>
              <div className="activity-sub">Processed by Agentic AI LangGraph passive event engine · 09:55 AM</div>
            </div>
            <span className="status-pill dark">• Billing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
