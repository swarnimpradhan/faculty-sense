import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  BookOpen
} from 'lucide-react';
import type { Faculty, Schedule, Department } from '../types';

interface FacultyDirectoryViewProps {
  facultyList: Faculty[];
  schedules: Schedule[];
}

export const FacultyDirectoryView: React.FC<FacultyDirectoryViewProps> = ({
  facultyList,
  schedules,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const departments: Department[] = [
    'Computer Science & IT',
    'Electronics & Communication',
    'School of Law',
    'School of Business & Management',
    'Mechanical Engineering',
    'Physics & Basic Sciences'
  ];

  const filteredFaculty = facultyList.filter(f => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.office_location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || f.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const getFacultySchedule = (facultyId: string) => {
    return schedules.filter(s => s.faculty_id === facultyId);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="directory-controls-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            placeholder="Search faculty by Name, ID, Designation, or Office..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="directory-search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <select 
            value={selectedDept} 
            onChange={(e) => setSelectedDept(e.target.value)}
            className="dept-select-filter"
          >
            <option value="ALL">All Departments ({facultyList.length})</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="staff-grid">
        {filteredFaculty.map(faculty => {
          const facultySchedules = getFacultySchedule(faculty.id);

          return (
            <div 
              key={faculty.id}
              className="staff-card glass-panel"
              onClick={() => setSelectedFaculty(faculty)}
            >
              <div className="card-top-row">
                <div className="avatar-wrapper">
                  <img src={faculty.avatarUrl} alt={faculty.name} className="staff-avatar" />
                  <span className={`status-indicator ${faculty.status === 'Active' ? 'present' : 'absent'}`}></span>
                </div>
                <div className="biometric-tag">
                  <ShieldCheck size={13} />
                  <span>ArcFace 512-d</span>
                </div>
              </div>

              <div className="staff-main-info">
                <h3 className="staff-name">{faculty.name}</h3>
                <span className="staff-id">{faculty.id}</span>
                <div className="staff-role">{faculty.designation}</div>
                <div className="staff-dept">{faculty.department}</div>
              </div>

              <div className="staff-card-footer">
                <div className="location-info">
                  <MapPin size={13} />
                  <span>{faculty.office_location}</span>
                </div>
                <span className="text-cyan-400 font-mono text-[11px] font-bold">
                  {facultySchedules.length} Sessions/Wk
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Detail Modal */}
      {selectedFaculty && (
        <div className="modal-backdrop" onClick={() => setSelectedFaculty(null)}>
          <div className="staff-detail-modal glass-panel" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedFaculty(null)}>✕</button>

            <div className="modal-header-profile">
              <img src={selectedFaculty.avatarUrl} alt={selectedFaculty.name} className="detail-avatar" />
              <div className="detail-header-meta">
                <h2>{selectedFaculty.name}</h2>
                <div className="detail-id-row">
                  <span className="font-mono text-cyan-400 font-bold">{selectedFaculty.id}</span>
                  <span className="bullet">•</span>
                  <span className="text-emerald-400 font-semibold">{selectedFaculty.status}</span>
                </div>
                <div className="detail-role">{selectedFaculty.designation}</div>
                <div className="detail-dept">{selectedFaculty.department}</div>
              </div>
            </div>

            <div className="modal-tabs-body">
              <div className="detail-section">
                <h4><MapPin size={15} className="inline mr-1 text-cyan-400"/> Contact & Office Details</h4>
                <div className="info-grid">
                  <div className="info-item"><Mail size={14}/> {selectedFaculty.contact_info.email}</div>
                  <div className="info-item"><Phone size={14}/> {selectedFaculty.contact_info.phone}</div>
                  <div className="info-item"><MapPin size={14}/> {selectedFaculty.office_location}</div>
                  <div className="info-item"><Calendar size={14}/> Joined {selectedFaculty.joiningDate}</div>
                </div>
              </div>

              <div className="detail-section">
                <h4><BookOpen size={15} className="inline mr-1 text-purple-400"/> Timetable & Academic Schedule</h4>
                <div className="space-y-2">
                  {getFacultySchedule(selectedFaculty.id).map(sch => (
                    <div key={sch.id} className="glass-panel p-3 text-xs flex justify-between items-center bg-slate-900/60 border border-slate-800">
                      <div>
                        <div className="font-bold text-white text-sm">{sch.subject} ({sch.class_section})</div>
                        <div className="text-slate-400">{sch.room} • Type: <span className="uppercase text-cyan-400">{sch.session_type}</span></div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400">{sch.day_of_week}</div>
                        <div className="font-mono text-slate-300">{sch.start_time} - {sch.end_time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h4><ShieldCheck size={15} className="inline mr-1 text-emerald-400"/> 512-d ArcFace Biometric Vector Profile</h4>
                <div className="biometrics-card">
                  <div className="bio-row">
                    <span>Enrolled Vector Standard:</span>
                    <span className="text-emerald-400 font-bold">512-d ArcFace (InsightFace)</span>
                  </div>
                  <div className="bio-row">
                    <span>Sample Photos Enrolled:</span>
                    <span className="text-amber-400 font-bold">{selectedFaculty.samplePhotosCount} Images</span>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-slate-400 mb-1">Normalized 512-d Embedding Matrix:</div>
                    <div className="vector-sample-bar">
                      {selectedFaculty.face_embedding.slice(0, 32).map((val, idx) => (
                        <div 
                          key={idx} 
                          className="vector-cell"
                          style={{ opacity: Math.max(0.2, Math.abs(val)) }}
                          title={`Dim ${idx}: ${val}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
