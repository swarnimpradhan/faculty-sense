export type Department = 
  | 'Computer Science & IT'
  | 'Electronics & Communication'
  | 'School of Law'
  | 'School of Business & Management'
  | 'Mechanical Engineering'
  | 'Physics & Basic Sciences';

export type SessionType = 'lecture' | 'lab' | 'office_hours';

export type AttendanceStatus = 'present' | 'late' | 'absent';

export type UserRole = 'admin' | 'faculty' | 'student';

export interface Faculty {
  id: string; // e.g. "FAC-1001"
  name: string;
  department: Department;
  designation: string;
  office_location: string;
  contact_info: {
    email: string;
    phone: string;
  };
  face_embedding: number[]; // 512-dimensional ArcFace vector
  avatarUrl: string;
  status: 'Active' | 'On Leave' | 'Sabbatical';
  joiningDate: string;
  enrolledAt: string;
  samplePhotosCount: number;
}

export interface Schedule {
  id: string;
  faculty_id: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  start_time: string; // "09:00"
  end_time: string;   // "10:00"
  subject: string;
  class_section: string;
  room: string;
  session_type: SessionType;
}

export interface AttendanceLog {
  id: string;
  faculty_id: string;
  date: string; // "YYYY-MM-DD"
  check_in_time: string; // "HH:MM:SS"
  check_out_time?: string;
  source: 'face_recognition' | 'manual_override';
  confidence_score: number; // e.g. 0.96 (96%)
  camera_location: string;
  status: AttendanceStatus;
  anomaliesFlagged?: string[];
}

export interface LeaveRecord {
  id: string;
  faculty_id: string;
  date_range_start: string;
  date_range_end: string;
  reason_type: 'personal' | 'medical' | 'conference';
  approved_by: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  linked_faculty_id?: string;
}

export interface ToolCallTrace {
  toolName: string;
  args: Record<string, any>;
  output: any;
  executionTimeMs: number;
}

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent' | 'system_event';
  text: string;
  timestamp: string;
  roleContext?: UserRole;
  thoughtChain?: string[];
  toolCalls?: ToolCallTrace[];
  structuredData?: any;
}

export interface SystemConfig {
  cameraLocation: string;
  matchingThreshold: number; // default 0.60
  antiSpoofingStrictness: number; // 0 to 1
  autoCheckIn: boolean;
  temporalSmoothingFrames: number; // e.g. 3 frames
  soundEnabled: boolean;
}
