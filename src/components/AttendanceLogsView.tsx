import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import type { Faculty, AttendanceLog, UserRole } from '../types';

interface AttendanceLogsViewProps {
  logs: AttendanceLog[];
  facultyList: Faculty[];
  currentUserRole: UserRole;
  onAddManualLog: (facultyId: string) => void;
}

export const AttendanceLogsView: React.FC<AttendanceLogsViewProps> = ({
  logs,
  facultyList,
  currentUserRole,
  onAddManualLog,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredLogs = logs.filter(log => {
    const faculty = facultyList.find(f => f.id === log.faculty_id);
    const facultyName = faculty?.name || '';
    
    const matchesSearch = 
      facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.faculty_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.camera_location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || log.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Log ID', 'Faculty ID', 'Faculty Name', 'Date', 'Check-In Time', 'Status', 'Confidence %', 'Location'];
    const rows = filteredLogs.map(l => {
      const f = facultyList.find(fac => fac.id === l.faculty_id);
      return [
        l.id,
        l.faculty_id,
        `"${f?.name || 'Unknown'}"`,
        l.date,
        l.check_in_time,
        l.status,
        `${l.confidence_score}%`,
        `"${l.camera_location}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Faculty_Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="logs-controls-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            placeholder="Search logs by Faculty Name, ID, or Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="directory-search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="dept-select-filter"
          >
            <option value="ALL">All Statuses ({logs.length})</option>
            <option value="present">Present</option>
            <option value="late">Late Check-in</option>
            <option value="absent">Absent</option>
          </select>

          {currentUserRole === 'admin' && (
            <button className="btn-secondary-glass" onClick={() => onAddManualLog(facultyList[0]?.id || 'FAC-1001')}>
              <Plus size={15} /> Manual Log Override
            </button>
          )}

          <button className="btn-primary-glow" onClick={exportCSV}>
            <Download size={15} /> Export CSV Report
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel overflow-hidden p-0">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Timestamp & Date</th>
              <th>Faculty Member</th>
              <th>Faculty ID</th>
              <th>Gate / Location</th>
              <th>Status</th>
              <th>ArcFace Confidence</th>
              <th>Agentic Anomaly Flag</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => {
              const faculty = facultyList.find(f => f.id === log.faculty_id);

              return (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td>
                    <div className="font-mono text-cyan-400 font-bold">{log.check_in_time}</div>
                    <div className="text-[11px] text-slate-400">{log.date}</div>
                  </td>
                  <td>
                    <div className="table-user-cell">
                      {faculty?.avatarUrl && (
                        <img src={faculty.avatarUrl} alt={faculty.name} className="table-avatar" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-100">{faculty?.name || log.faculty_id}</div>
                        <div className="text-xs text-slate-400">{faculty?.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-slate-300 text-xs">{log.faculty_id}</td>
                  <td className="text-slate-300 text-xs">{log.camera_location}</td>
                  <td>
                    <span className={`status-badge ${log.status === 'present' ? 'present' : log.status === 'late' ? 'late' : 'denied'}`}>
                      {log.status === 'present' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                      <span className="capitalize">{log.status}</span>
                    </span>
                  </td>
                  <td>
                    <span className="confidence-tag">{log.confidence_score}% Match</span>
                  </td>
                  <td>
                    {log.anomaliesFlagged && log.anomaliesFlagged.length > 0 ? (
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
                        <AlertTriangle size={13} />
                        <span>{log.anomaliesFlagged[0]}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">None (Normal Check-in)</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
