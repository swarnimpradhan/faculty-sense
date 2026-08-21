import React, { useState } from 'react';
import { Search, CheckCircle2, MapPin } from 'lucide-react';
import type { AttendanceLog, Faculty } from '../types';

interface AttendanceLogsViewProps {
  logs: AttendanceLog[];
  facultyList: Faculty[];
}

export const AttendanceLogsView: React.FC<AttendanceLogsViewProps> = ({
  logs,
  facultyList,
}) => {
  const [filterTerm, setFilterTerm] = useState('');

  const getFacultyName = (facultyId: string) => {
    const f = facultyList.find(item => item.id === facultyId);
    return f ? f.name : facultyId;
  };

  const filteredLogs = logs.filter(log => {
    const name = getFacultyName(log.faculty_id).toLowerCase();
    const loc = log.camera_location.toLowerCase();
    const query = filterTerm.toLowerCase();
    return name.includes(query) || loc.includes(query) || log.id.toLowerCase().includes(query);
  });

  return (
    <section className="py-12 border-b border-border/70">
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 panel p-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Attendance Audit Logs</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Immutable biometric attendance events recorded across camera perception gates.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-3.5 py-2 text-xs min-w-[280px]">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              placeholder="Filter by faculty, gate location, ID..."
              className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="panel overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/40 text-xs font-mono uppercase tracking-wider text-muted-foreground border-b border-border/70">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Event ID</th>
                <th className="px-6 py-3.5 font-semibold">Faculty Member</th>
                <th className="px-6 py-3.5 font-semibold">Gate Location</th>
                <th className="px-6 py-3.5 font-semibold">Check-in Time</th>
                <th className="px-6 py-3.5 font-semibold">ArcFace Score</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-foreground">{log.id}</td>
                  <td className="px-6 py-4 font-semibold text-xs text-foreground">
                    {getFacultyName(log.faculty_id)}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-primary shrink-0" />
                    <span>{log.camera_location}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {log.date} · {log.check_in_time}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-emerald-600">
                    {log.confidence_score}% Match
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="size-3 text-emerald-600" /> Verified Present
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
