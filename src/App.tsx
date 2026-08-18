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
import { Navbar } from './components/Navbar';
import { Sidebar, type ActiveTab } from './components/Sidebar';
import { LiveKioskView } from './components/LiveKioskView';
import { AgentChatView } from './components/AgentChatView';
import { FacultyDirectoryView } from './components/FacultyDirectoryView';
import { AttendanceLogsView } from './components/AttendanceLogsView';
import { EnrollmentView } from './components/EnrollmentView';
import { SettingsView } from './components/SettingsView';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('kiosk');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('admin');

  // Persistence State
  const [facultyList, setFacultyList] = useState<Faculty[]>(() => {
    const saved = localStorage.getItem('FS_FACULTY_KB');
    return saved ? JSON.parse(saved) : INITIAL_FACULTY;
  });

  const [schedules] = useState<Schedule[]>(INITIAL_SCHEDULE);
  const [leaveRecords] = useState<LeaveRecord[]>(INITIAL_LEAVE_RECORDS);

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(() => {
    const saved = localStorage.getItem('FS_ATTENDANCE_LOGS');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_LOGS;
  });

  const [config, setConfig] = useState<SystemConfig>({
    cameraLocation: 'Main Campus Entrance Gate 1',
    matchingThreshold: 60, // 0.60 Cosine
    antiSpoofingStrictness: 0.85,
    autoCheckIn: true,
    temporalSmoothingFrames: 3,
    soundEnabled: true
  });

  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('FS_FACULTY_KB', JSON.stringify(facultyList));
  }, [facultyList]);

  useEffect(() => {
    localStorage.setItem('FS_ATTENDANCE_LOGS', JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  // Handle Passive Perception Event (Triggered by Live CV Check-In)
  const handleRecognitionSuccess = (faculty: Faculty, confidence: number, location: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingLog = attendanceLogs.find(l => l.faculty_id === faculty.id && l.date === today);

    if (existingLog) return; // Already checked in today

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

  const handleAddManualLog = (facultyId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0];

    const manualLog: AttendanceLog = {
      id: `LOG-MAN-${Math.floor(1000 + Math.random() * 9000)}`,
      faculty_id: facultyId,
      date: today,
      check_in_time: nowTime,
      source: 'manual_override',
      confidence_score: 100,
      camera_location: `${config.cameraLocation} (Admin Override)`,
      status: 'present'
    };

    setAttendanceLogs(prev => [manualLog, ...prev]);
  };

  const todayCount = attendanceLogs.filter(l => l.date === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="app-shell">
      <Navbar 
        currentRole={currentUserRole}
        onChangeRole={setCurrentUserRole}
        activeGate={config.cameraLocation}
        todayCount={todayCount}
        onLaunchKiosk={() => setActiveTab('kiosk')}
      />

      <div className="app-body">
        <Sidebar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          facultyCount={facultyList.length}
          logsCount={attendanceLogs.length}
          currentRole={currentUserRole}
        />

        <main className="main-content-viewport">
          {/* Agentic Anomaly Toast Notification */}
          {activeAlert && (
            <div className="mb-4 glass-panel bg-amber-950/80 border border-amber-500/50 p-4 rounded-xl text-amber-200 text-xs flex items-center justify-between shadow-xl animate-pulse">
              <div>{activeAlert}</div>
              <button onClick={() => setActiveAlert(null)} className="text-amber-400 font-bold ml-4">✕</button>
            </div>
          )}

          {activeTab === 'kiosk' && (
            <LiveKioskView 
              facultyList={facultyList}
              config={config}
              onRecognitionSuccess={handleRecognitionSuccess}
            />
          )}

          {activeTab === 'agent' && (
            <AgentChatView 
              facultyList={facultyList}
              schedules={schedules}
              attendanceLogs={attendanceLogs}
              leaveRecords={leaveRecords}
              currentUserRole={currentUserRole}
            />
          )}

          {activeTab === 'directory' && (
            <FacultyDirectoryView 
              facultyList={facultyList}
              schedules={schedules}
            />
          )}

          {activeTab === 'logs' && (
            <AttendanceLogsView 
              logs={attendanceLogs}
              facultyList={facultyList}
              currentUserRole={currentUserRole}
              onAddManualLog={handleAddManualLog}
            />
          )}

          {activeTab === 'enrollment' && (
            <EnrollmentView 
              onAddFaculty={handleAddFaculty}
              onNavigateToDirectory={() => setActiveTab('directory')}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              config={config}
              onUpdateConfig={setConfig}
              currentUserRole={currentUserRole}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
