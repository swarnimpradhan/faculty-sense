import React from 'react';
import { 
  Camera, 
  Bot, 
  Users, 
  FileText, 
  UserPlus, 
  Sliders,
  ShieldCheck
} from 'lucide-react';
import type { UserRole } from '../types';

export type ActiveTab = 'kiosk' | 'agent' | 'directory' | 'logs' | 'enrollment' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  facultyCount: number;
  logsCount: number;
  currentRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  facultyCount,
  logsCount,
  currentRole,
}) => {
  return (
    <aside className="app-sidebar">
      {/* Group 1: OVERVIEW */}
      <div>
        <div className="sidebar-group-title">Overview</div>
        <div className="sidebar-nav-list">
          <button 
            className={`sidebar-nav-item ${activeTab === 'kiosk' ? 'active' : ''}`}
            onClick={() => onTabChange('kiosk')}
          >
            <Camera size={16} className="nav-icon" />
            <span>Live CV Scanner</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'agent' ? 'active' : ''}`}
            onClick={() => onTabChange('agent')}
          >
            <Bot size={16} className="nav-icon" />
            <span>Agentic AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Group 2: FACULTY CARE */}
      <div>
        <div className="sidebar-group-title">Faculty Care</div>
        <div className="sidebar-nav-list">
          <button 
            className={`sidebar-nav-item ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => onTabChange('directory')}
          >
            <Users size={16} className="nav-icon" />
            <span>Faculty Directory</span>
            <span className="nav-badge-count">{facultyCount}</span>
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => onTabChange('logs')}
          >
            <FileText size={16} className="nav-icon" />
            <span>Attendance Logs</span>
            <span className="nav-badge-count">{logsCount}</span>
          </button>
        </div>
      </div>

      {/* Group 3: ADMINISTRATION */}
      <div>
        <div className="sidebar-group-title">Administration</div>
        <div className="sidebar-nav-list">
          {currentRole === 'admin' && (
            <button 
              className={`sidebar-nav-item ${activeTab === 'enrollment' ? 'active' : ''}`}
              onClick={() => onTabChange('enrollment')}
            >
              <UserPlus size={16} className="nav-icon" />
              <span>Enroll Faculty</span>
            </button>
          )}

          <button 
            className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => onTabChange('settings')}
          >
            <Sliders size={16} className="nav-icon" />
            <span>System Settings</span>
          </button>
        </div>
      </div>

      {/* System Status Footer Box */}
      <div className="mt-auto bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck size={15} className="text-slate-900" />
          <span>InsightFace ArcFace 512-d</span>
        </div>
        <div className="flex justify-between text-slate-500 text-[11px] font-medium">
          <span>FAISS Cosine Index:</span>
          <span className="font-bold text-slate-800">Operational</span>
        </div>
      </div>
    </aside>
  );
};
