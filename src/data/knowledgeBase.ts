import type { Faculty, Schedule, AttendanceLog, LeaveRecord, User } from '../types';
import trainedBiometrics from './biometrics_trained.json';

export const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'FAC-2001',
    name: 'Prof. Swarnim Pradhan',
    department: 'Computer Science & IT',
    designation: 'Lead AI Research Engineer & Director',
    office_location: 'Block I, AI & Biometrics Lab 501',
    contact_info: {
      email: 'swarnim.pradhan@christuniversity.in',
      phone: '+91 98450 99001'
    },
    face_embedding: trainedBiometrics.swarnim,
    avatarUrl: '/dataset/Swarnim/1.jpeg',
    status: 'Active',
    joiningDate: '2017-07-10',
    enrolledAt: '2026-02-01T08:00:00Z',
    samplePhotosCount: 5
  },
  {
    id: 'FAC-2002',
    name: 'Prof. Stephen',
    department: 'Electronics & Communication',
    designation: 'Associate Director of Biometrics & Perception',
    office_location: 'Block III, Vision Systems Lab 310',
    contact_info: {
      email: 'stephen@christuniversity.in',
      phone: '+91 98450 99002'
    },
    face_embedding: trainedBiometrics.stephen,
    avatarUrl: '/dataset/Stephen/1.jpeg',
    status: 'Active',
    joiningDate: '2019-03-15',
    enrolledAt: '2026-02-01T08:30:00Z',
    samplePhotosCount: 5
  }
];

export const INITIAL_SCHEDULE: Schedule[] = [
  {
    id: 'SCH-201',
    faculty_id: 'FAC-2001',
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:30',
    subject: 'CS401 Agentic AI & Deep Learning',
    class_section: '4 BTech CSE-A',
    room: 'AI Research Lab, Block I',
    session_type: 'lecture'
  },
  {
    id: 'SCH-202',
    faculty_id: 'FAC-2001',
    day_of_week: 'Wednesday',
    start_time: '11:00',
    end_time: '12:30',
    subject: 'CS502 Multi-Agent Perception Systems',
    class_section: '2 MTech AI',
    room: 'Room 501, Block I',
    session_type: 'lab'
  },
  {
    id: 'SCH-203',
    faculty_id: 'FAC-2002',
    day_of_week: 'Monday',
    start_time: '10:30',
    end_time: '12:00',
    subject: 'ECE405 Embedded Computer Vision',
    class_section: '4 BTech ECE',
    room: 'Vision Systems Lab, Block III',
    session_type: 'lab'
  },
  {
    id: 'SCH-204',
    faculty_id: 'FAC-2002',
    day_of_week: 'Friday',
    start_time: '14:00',
    end_time: '15:30',
    subject: 'ECE509 ArcFace & FAISS Signal Processing',
    class_section: 'MTech ECE',
    room: 'Room 310, Block III',
    session_type: 'lecture'
  }
];

export const INITIAL_ATTENDANCE_LOGS: AttendanceLog[] = [
  {
    id: 'LOG-9000',
    faculty_id: 'FAC-2001',
    date: '2026-08-18',
    check_in_time: '08:30:12',
    source: 'face_recognition',
    confidence_score: 99.8,
    camera_location: 'Main Campus Entrance Gate 1',
    status: 'present'
  },
  {
    id: 'LOG-9000B',
    faculty_id: 'FAC-2002',
    date: '2026-08-18',
    check_in_time: '08:42:05',
    source: 'face_recognition',
    confidence_score: 99.4,
    camera_location: 'Block III Vision Gate',
    status: 'present'
  }
];

export const INITIAL_LEAVE_RECORDS: LeaveRecord[] = [];

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-01',
    name: 'Administrator (Dean Office)',
    role: 'admin'
  },
  {
    id: 'USR-SWARNIM',
    name: 'Prof. Swarnim Pradhan',
    role: 'faculty',
    linked_faculty_id: 'FAC-2001'
  },
  {
    id: 'USR-STEPHEN',
    name: 'Prof. Stephen',
    role: 'faculty',
    linked_faculty_id: 'FAC-2002'
  },
  {
    id: 'USR-03',
    name: 'Student Portal Access',
    role: 'student'
  }
];
