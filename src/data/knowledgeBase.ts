import type { Faculty, Schedule, AttendanceLog, LeaveRecord, User } from '../types';
import { generate512dEmbedding } from '../utils/biometricsEngine';

export const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'FAC-1001',
    name: 'Dr. Ananya Sharma',
    department: 'Computer Science & IT',
    designation: 'Professor & Department Head',
    office_location: 'Block I, Room 304',
    contact_info: {
      email: 'ananya.sharma@christuniversity.in',
      phone: '+91 98450 11001'
    },
    face_embedding: generate512dEmbedding('FAC-1001-ananya'),
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    status: 'Active',
    joiningDate: '2018-06-15',
    enrolledAt: '2026-01-10T10:00:00Z',
    samplePhotosCount: 15
  },
  {
    id: 'FAC-1002',
    name: 'Dr. Vikramaditya Rao',
    department: 'Computer Science & IT',
    designation: 'Associate Professor',
    office_location: 'Block I, Room 308',
    contact_info: {
      email: 'vikram.rao@christuniversity.in',
      phone: '+91 98450 11002'
    },
    face_embedding: generate512dEmbedding('FAC-1002-vikram'),
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    status: 'Active',
    joiningDate: '2019-08-01',
    enrolledAt: '2026-01-11T11:30:00Z',
    samplePhotosCount: 12
  },
  {
    id: 'FAC-1003',
    name: 'Prof. Aisha Patel',
    department: 'School of Law',
    designation: 'Assistant Professor',
    office_location: 'Block IV, Room 102',
    contact_info: {
      email: 'aisha.patel@christuniversity.in',
      phone: '+91 98450 11003'
    },
    face_embedding: generate512dEmbedding('FAC-1003-aisha'),
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    status: 'Active',
    joiningDate: '2021-01-20',
    enrolledAt: '2026-01-12T09:15:00Z',
    samplePhotosCount: 14
  },
  {
    id: 'FAC-1004',
    name: 'Dr. Rajesh Iyer',
    department: 'Electronics & Communication',
    designation: 'Professor',
    office_location: 'Block III, Room 215',
    contact_info: {
      email: 'rajesh.iyer@christuniversity.in',
      phone: '+91 98450 11004'
    },
    face_embedding: generate512dEmbedding('FAC-1004-rajesh'),
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    status: 'Active',
    joiningDate: '2016-04-10',
    enrolledAt: '2026-01-14T14:20:00Z',
    samplePhotosCount: 15
  },
  {
    id: 'FAC-1005',
    name: 'Prof. Sneha Kulkarni',
    department: 'School of Business & Management',
    designation: 'Assistant Professor',
    office_location: 'Central Block, Room 405',
    contact_info: {
      email: 'sneha.kulkarni@christuniversity.in',
      phone: '+91 98450 11005'
    },
    face_embedding: generate512dEmbedding('FAC-1005-sneha'),
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    status: 'On Leave',
    joiningDate: '2022-07-01',
    enrolledAt: '2026-01-15T16:00:00Z',
    samplePhotosCount: 10
  }
];

export const INITIAL_SCHEDULE: Schedule[] = [
  // Monday
  {
    id: 'SCH-101',
    faculty_id: 'FAC-1001',
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '10:30',
    subject: 'CS401 Deep Learning Architectures',
    class_section: '4 BTech CSE-A',
    room: 'Lab 3, Block I',
    session_type: 'lecture'
  },
  {
    id: 'SCH-102',
    faculty_id: 'FAC-1001',
    day_of_week: 'Monday',
    start_time: '11:00',
    end_time: '12:30',
    subject: 'CS502 Agentic Systems Research',
    class_section: '2 MTech AI',
    room: 'Room 304, Block I',
    session_type: 'office_hours'
  },
  {
    id: 'SCH-103',
    faculty_id: 'FAC-1002',
    day_of_week: 'Monday',
    start_time: '09:30',
    end_time: '11:30',
    subject: 'CS302 Computer Vision & Pattern Rec',
    class_section: '3 BTech CSE-B',
    room: 'CV Lab 2, Block I',
    session_type: 'lab'
  },
  {
    id: 'SCH-104',
    faculty_id: 'FAC-1003',
    day_of_week: 'Monday',
    start_time: '10:00',
    end_time: '11:30',
    subject: 'LAW201 Constitutional Cyber Law',
    class_section: '3 BA LLB',
    room: 'Auditorium 2, Block IV',
    session_type: 'lecture'
  },
  {
    id: 'SCH-105',
    faculty_id: 'FAC-1004',
    day_of_week: 'Monday',
    start_time: '14:00',
    end_time: '16:00',
    subject: 'ECE405 Embedded AI Systems',
    class_section: '4 BTech ECE',
    room: 'Microprocessor Lab, Block III',
    session_type: 'lab'
  },
  // Wednesday
  {
    id: 'SCH-106',
    faculty_id: 'FAC-1004',
    day_of_week: 'Wednesday',
    start_time: '10:00',
    end_time: '11:30',
    subject: 'ECE301 VLSI Design',
    class_section: '3 BTech ECE-A',
    room: 'Room 215, Block III',
    session_type: 'lecture'
  },
  {
    id: 'SCH-107',
    faculty_id: 'FAC-1004',
    day_of_week: 'Wednesday',
    start_time: '14:00',
    end_time: '15:30',
    subject: 'ECE509 Signal Processing Research',
    class_section: 'MTech ECE',
    room: 'Room 215, Block III',
    session_type: 'office_hours'
  },
  // Friday
  {
    id: 'SCH-108',
    faculty_id: 'FAC-1001',
    day_of_week: 'Friday',
    start_time: '14:00',
    end_time: '15:30',
    subject: 'CS401 Neural Network Seminar',
    class_section: '4 BTech CSE-A',
    room: 'Seminar Hall 1',
    session_type: 'lecture'
  }
];

export const INITIAL_ATTENDANCE_LOGS: AttendanceLog[] = [
  {
    id: 'LOG-9001',
    faculty_id: 'FAC-1001',
    date: '2026-07-31',
    check_in_time: '08:52:14',
    check_out_time: '16:45:00',
    source: 'face_recognition',
    confidence_score: 98.4,
    camera_location: 'Main Campus Entrance Gate 1',
    status: 'present'
  },
  {
    id: 'LOG-9002',
    faculty_id: 'FAC-1002',
    date: '2026-07-31',
    check_in_time: '09:14:30',
    source: 'face_recognition',
    confidence_score: 96.1,
    camera_location: 'Block I Department Gate',
    status: 'present',
    anomaliesFlagged: ['Late check-in vs 09:00 schedule start']
  },
  {
    id: 'LOG-9003',
    faculty_id: 'FAC-1003',
    date: '2026-07-31',
    check_in_time: '09:55:10',
    source: 'face_recognition',
    confidence_score: 97.8,
    camera_location: 'Block IV Law Gate',
    status: 'present'
  },
  {
    id: 'LOG-9004',
    faculty_id: 'FAC-1004',
    date: '2026-07-31',
    check_in_time: '08:45:00',
    source: 'face_recognition',
    confidence_score: 99.1,
    camera_location: 'Main Campus Entrance Gate 1',
    status: 'present'
  }
];

export const INITIAL_LEAVE_RECORDS: LeaveRecord[] = [
  {
    id: 'LEV-501',
    faculty_id: 'FAC-1005',
    date_range_start: '2026-07-28',
    date_range_end: '2026-08-02',
    reason_type: 'conference',
    approved_by: 'Dean of Business Management'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-01',
    name: 'Administrator (Dean Office)',
    role: 'admin'
  },
  {
    id: 'USR-02',
    name: 'Dr. Ananya Sharma',
    role: 'faculty',
    linked_faculty_id: 'FAC-1001'
  },
  {
    id: 'USR-03',
    name: 'Student Portal Access',
    role: 'student'
  }
];
