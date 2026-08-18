import React from 'react';
import { 
  Sliders, 
  Lock
} from 'lucide-react';
import type { SystemConfig, UserRole } from '../types';

interface SettingsViewProps {
  config: SystemConfig;
  onUpdateConfig: (newConfig: SystemConfig) => void;
  currentUserRole: UserRole;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  onUpdateConfig,
  currentUserRole,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Sliders size={22} className="text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white">System & Perception Parameters</h2>
              <p className="text-xs text-slate-400">Configure CV/DL detection thresholds, FAISS index similarity, and RBAC matrix.</p>
            </div>
          </div>
          <div className="text-xs bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-full text-amber-400 font-bold uppercase flex items-center gap-1">
            <Lock size={12} /> Clearance: {currentUserRole}
          </div>
        </div>

        <div className="settings-grid">
          {/* Setting 1: Gate Location */}
          <div className="setting-card glass-panel p-4">
            <div className="setting-label">Perception Camera Location</div>
            <div className="setting-desc mb-3">Defines the source metadata tag recorded in attendance_logs.</div>
            <select 
              value={config.cameraLocation}
              onChange={(e) => onUpdateConfig({ ...config, cameraLocation: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs p-2.5 rounded-lg outline-none"
            >
              <option value="Main Campus Entrance Gate 1">Main Campus Entrance Gate 1</option>
              <option value="Block I Department Gate">Block I Department Gate</option>
              <option value="Block IV Law Gate">Block IV Law Gate</option>
              <option value="Block III Electronics Gate">Block III Electronics Gate</option>
            </select>
          </div>

          {/* Setting 2: Matching Cosine Threshold */}
          <div className="setting-card glass-panel p-4">
            <div className="flex justify-between items-center mb-1">
              <div className="setting-label">FAISS Cosine Similarity Threshold</div>
              <span className="font-mono text-xs font-bold text-cyan-400">{config.matchingThreshold}%</span>
            </div>
            <div className="setting-desc mb-3">Empirically tuned boundary to balance False Accepts (FAR) vs False Rejects (FRR).</div>
            <input 
              type="range"
              min="40"
              max="90"
              value={config.matchingThreshold}
              onChange={(e) => onUpdateConfig({ ...config, matchingThreshold: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Setting 3: Anti-Spoofing Strictness */}
          <div className="setting-card glass-panel p-4">
            <div className="flex justify-between items-center mb-1">
              <div className="setting-label">Anti-Spoofing Liveness Strictness</div>
              <span className="font-mono text-xs font-bold text-emerald-400">{Math.round(config.antiSpoofingStrictness * 100)}%</span>
            </div>
            <div className="setting-desc mb-3">CelebA-Spoof trained binary CNN texture analysis threshold.</div>
            <input 
              type="range"
              min="70"
              max="99"
              value={Math.round(config.antiSpoofingStrictness * 100)}
              onChange={(e) => onUpdateConfig({ ...config, antiSpoofingStrictness: Number(e.target.value) / 100 })}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Setting 4: Temporal Smoothing */}
          <div className="setting-card glass-panel p-4 flex justify-between items-center">
            <div>
              <div className="setting-label">Temporal Frame Smoothing</div>
              <div className="setting-desc">Requires 3 consecutive matching frames before finalizing decision.</div>
            </div>
            <span className="font-mono text-xs text-purple-400 font-bold bg-purple-950/60 px-3 py-1 rounded border border-purple-500/40">
              3 Frames
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
