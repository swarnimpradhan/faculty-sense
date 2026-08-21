import React from 'react';
import { 
  ScanFace, 
  UserPlus, 
  Activity, 
  Users, 
  Cpu, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import type { UserRole } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEnrollModal: () => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenEnrollModal,
  currentUserRole,
  setCurrentUserRole,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveTab('hero')}
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <ScanFace className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-display text-base font-bold tracking-tight">FacultyIQ</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-secondary/80 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live 512-d
              </span>
            </div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
              AI Faculty Recognition Platform
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-secondary/40 p-1.5 text-xs md:flex">
          {[
            { id: 'hero', label: 'Pipeline & Overview', icon: Activity },
            { id: 'scanner', label: 'Live CV Desk', icon: ScanFace },
            { id: 'gallery', label: 'Faculty Gallery', icon: Users },
            { id: 'models', label: 'AI Models', icon: Cpu },
            { id: 'logs', label: 'Audit Logs', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Role Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-xs">
            <ShieldCheck className="size-3.5 text-muted-foreground" />
            <select 
              value={currentUserRole} 
              onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              className="bg-transparent font-mono text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              <option value="admin">Role: Admin</option>
              <option value="faculty">Role: Faculty</option>
              <option value="student">Role: Student</option>
            </select>
          </div>

          {/* Enroll Button */}
          <button
            onClick={onOpenEnrollModal}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90 active:scale-95"
          >
            <UserPlus className="size-4" />
            <span>Enrol Faculty</span>
          </button>
        </div>
      </div>
    </header>
  );
};
