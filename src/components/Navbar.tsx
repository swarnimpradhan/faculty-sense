import React from 'react';
import { 
  Activity, 
  Search, 
  Bell, 
  Camera,
  ChevronRight
} from 'lucide-react';
import type { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  activeGate: string;
  todayCount: number;
  onLaunchKiosk: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onChangeRole,
  todayCount,
  onLaunchKiosk,
}) => {
  return (
    <header className="app-navbar">
      <div className="nav-left-group">
        {/* Pulse Clinic Brand Logo */}
        <div className="brand-logo-container">
          <div className="brand-icon-wrapper">
            <Activity size={18} />
          </div>
          <span>Faculty Sense</span>
        </div>

        {/* Breadcrumb Trail */}
        <div className="breadcrumb-trail">
          <span>Overview</span>
          <ChevronRight size={12} />
          <span className="breadcrumb-active">Faculty Health & Biometrics</span>
        </div>
      </div>

      <div className="nav-right-group">
        {/* Command Search Pill with ⌘K */}
        <div className="search-command-pill">
          <Search size={14} />
          <input type="text" placeholder="Go to..." readOnly />
          <span className="command-kbd">⌘K</span>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-800">
          <span className="text-slate-400 font-semibold">Role:</span>
          <select 
            value={currentRole} 
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="bg-transparent border-none text-xs font-extrabold text-slate-900 outline-none cursor-pointer"
          >
            <option value="admin">Admin (Full Access)</option>
            <option value="faculty">Faculty Member</option>
            <option value="student">Student</option>
          </select>
        </div>

        {/* Notifications Bell */}
        <div className="notification-btn" title="3 Recent Biometric Alerts">
          <Bell size={16} />
          <span className="notification-badge">{todayCount > 0 ? todayCount : 3}</span>
        </div>

        {/* Pulse Clinic Style Black Action Button */}
        <button className="primary-action-pill" onClick={onLaunchKiosk}>
          <Camera size={14} />
          <span>Launch Live Kiosk</span>
        </button>
      </div>
    </header>
  );
};
