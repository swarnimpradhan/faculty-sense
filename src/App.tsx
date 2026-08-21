import { useState, useEffect } from 'react';
import type { 
  Faculty, 
  Schedule, 
  AttendanceLog, 
  LeaveRecord, 
  UserRole, 
  SystemConfig 
} from './types';
import { 
  INITIAL_FACULTY, 
  INITIAL_SCHEDULE, 
  INITIAL_ATTENDANCE_LOGS, 
  INITIAL_LEAVE_RECORDS 
} from './data/knowledgeBase';
import { handlePassiveRecognitionEvent } from './utils/agentEngine';

// Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PipelineSection } from './components/PipelineSection';
import { LiveKioskView } from './components/LiveKioskView';
import { FacultyGalleryView } from './components/FacultyGalleryView';
import { ModelsTableView } from './components/ModelsTableView';
import { AttendanceLogsView } from './components/AttendanceLogsView';
import { VisionAssistChat } from './components/VisionAssistChat';
import { EnrollFacultyModal } from './components/EnrollFacultyModal';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('hero');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('admin');

  // Persistence State
  const [facultyList, setFacultyList] = useState<Faculty[]>(() => {
    const saved = localStorage.getItem('FS_FACULTY_KB');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse faculty KB', e);
      }
    }
    localStorage.setItem('FS_FACULTY_KB', JSON.stringify(INITIAL_FACULTY));
    return INITIAL_FACULTY;
  });

  const [schedules] = useState<Schedule[]>(INITIAL_SCHEDULE);
  const [leaveRecords] = useState<LeaveRecord[]>(INITIAL_LEAVE_RECORDS);

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(() => {
    const saved = localStorage.getItem('FS_ATTENDANCE_LOGS');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse attendance logs', e);
      }
    }
    localStorage.setItem('FS_ATTENDANCE_LOGS', JSON.stringify(INITIAL_ATTENDANCE_LOGS));
    return INITIAL_ATTENDANCE_LOGS;
  });

  const [config, setConfig] = useState<SystemConfig>({
    cameraLocation: 'Main Campus Entrance Gate 1',
    matchingThreshold: 60,
    antiSpoofingStrictness: 0.85,
    autoCheckIn: true,
    temporalSmoothingFrames: 3,
    soundEnabled: true
  });

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [selectedFacultyForScan, setSelectedFacultyForScan] = useState<Faculty | null>(null);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('FS_FACULTY_KB', JSON.stringify(facultyList));
  }, [facultyList]);

  useEffect(() => {
    localStorage.setItem('FS_ATTENDANCE_LOGS', JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  // Handle Passive Perception Event
  const handleRecognitionSuccess = (faculty: Faculty, confidence: number, location: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = attendanceLogs.find(l => l.faculty_id === faculty.id && l.date === today);

    if (existingLog) return;

    const ctx = {
      facultyList,
      schedules,
      attendanceLogs,
      leaveRecords,
      currentUserRole
    };

    const { log, agentAlert } = handlePassiveRecognitionEvent(faculty, confidence, location, ctx);

    setAttendanceLogs(prev => [log, ...prev]);

    if (agentAlert) {
      setActiveAlert(agentAlert);
      setTimeout(() => setActiveAlert(null), 6000);
    }
  };

  const handleAddFaculty = (newFaculty: Faculty) => {
    setFacultyList(prev => [newFaculty, ...prev]);
  };

  const handleDeleteFaculty = (id: string) => {
    setFacultyList(prev => prev.filter(f => f.id !== id));
  };

  const handleSelectFacultyForScan = (faculty: Faculty) => {
    setSelectedFacultyForScan(faculty);
    setActiveTab('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Sticky Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEnrollModal={() => setIsEnrollModalOpen(true)}
        currentUserRole={currentUserRole}
        setCurrentUserRole={setCurrentUserRole}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Agent Anomaly Toast Banner */}
        {activeAlert && (
          <div className="mx-auto max-w-7xl px-6 pt-4">
            <div className="bg-amber-500/15 border border-amber-500/40 p-4 rounded-2xl text-amber-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-pulse">
              <span>{activeAlert}</span>
              <button onClick={() => setActiveAlert(null)} className="font-bold text-amber-950 px-2 py-0.5 rounded-lg hover:bg-amber-200 cursor-pointer">✕</button>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'hero' && (
          <>
            <HeroSection 
              onStartRecognition={() => setActiveTab('scanner')}
              onViewGallery={() => setActiveTab('gallery')}
              onOpenEnrollModal={() => setIsEnrollModalOpen(true)}
              enrolledCount={facultyList.length}
            />
            <PipelineSection />
            <LiveKioskView 
              facultyList={facultyList}
              config={config}
              onRecognitionSuccess={handleRecognitionSuccess}
              selectedFacultyFromGallery={selectedFacultyForScan}
            />
            <ModelsTableView 
              config={config}
              setConfig={setConfig}
              onOpenAssistant={() => setIsAssistantOpen(true)}
            />
          </>
        )}

        {activeTab === 'scanner' && (
          <LiveKioskView 
            facultyList={facultyList}
            config={config}
            onRecognitionSuccess={handleRecognitionSuccess}
            selectedFacultyFromGallery={selectedFacultyForScan}
          />
        )}

        {activeTab === 'gallery' && (
          <FacultyGalleryView 
            facultyList={facultyList}
            onSelectFacultyForScan={handleSelectFacultyForScan}
            onOpenEnrollModal={() => setIsEnrollModalOpen(true)}
            onDeleteFaculty={handleDeleteFaculty}
          />
        )}

        {activeTab === 'models' && (
          <ModelsTableView 
            config={config}
            setConfig={setConfig}
            onOpenAssistant={() => setIsAssistantOpen(true)}
          />
        )}

        {activeTab === 'logs' && (
          <AttendanceLogsView 
            logs={attendanceLogs}
            facultyList={facultyList}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/70 py-8 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <p>FacultyIQ · Faculty Recognition Platform with consent-based enrolment and 512-d ArcFace vector embeddings.</p>
          <p>© 2026 FacultyIQ AIML Perception Gate.</p>
        </div>
      </footer>

      {/* Floating Vision Assist Chatbot */}
      <VisionAssistChat 
        isOpenExternal={isAssistantOpen}
        onCloseExternal={() => setIsAssistantOpen(false)}
        onToggleExternal={() => setIsAssistantOpen(prev => !prev)}
      />

      {/* Modal Dialog for Faculty Enrollment */}
      <EnrollFacultyModal 
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onEnroll={handleAddFaculty}
      />
    </div>
  );
}

export default App;
