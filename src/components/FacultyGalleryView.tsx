import React, { useState } from 'react';
import { 
  Search, 
  ScanFace, 
  Fingerprint, 
  UserPlus, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  X,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import type { Faculty } from '../types';

interface FacultyGalleryViewProps {
  facultyList: Faculty[];
  onSelectFacultyForScan: (faculty: Faculty) => void;
  onOpenEnrollModal: () => void;
  onDeleteFaculty?: (id: string) => void;
}

export const FacultyGalleryView: React.FC<FacultyGalleryViewProps> = ({
  facultyList,
  onSelectFacultyForScan,
  onOpenEnrollModal,
  onDeleteFaculty,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVectorFaculty, setSelectedVectorFaculty] = useState<Faculty | null>(null);

  const filteredFaculty = facultyList.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-12 border-b border-border/70">
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        {/* Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 panel p-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Faculty Gallery & Vectors</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Enrolled faculty profiles, registered 512-d ArcFace vector embeddings, and access clearance levels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-3.5 py-2 text-xs min-w-[260px]">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, department, role..."
                className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <button
              onClick={onOpenEnrollModal}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90 active:scale-95 shrink-0 cursor-pointer"
            >
              <UserPlus className="size-4" />
              <span>Enrol Faculty</span>
            </button>
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredFaculty.map(faculty => (
            <div 
              key={faculty.id}
              className="panel p-6 space-y-5 transition-all hover:border-primary/40 hover:shadow-glow relative group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={faculty.avatarUrl} 
                    alt={faculty.name} 
                    className="size-16 rounded-2xl object-cover border border-border shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">{faculty.name}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        <CheckCircle2 className="size-3" /> Enrolled
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-primary mt-0.5">{faculty.designation}</p>
                    <p className="text-xs text-muted-foreground">{faculty.department}</p>
                  </div>
                </div>

                {onDeleteFaculty && facultyList.length > 1 && (
                  <button
                    onClick={() => onDeleteFaculty(faculty.id)}
                    className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center cursor-pointer"
                    title="Remove Faculty Profile"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>

              {/* Details List */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border/60">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span className="truncate">{faculty.office_location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5 text-primary shrink-0" />
                  <span className="truncate">{faculty.contact_info.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-3.5 text-primary shrink-0" />
                  <span>{faculty.contact_info.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-3.5 text-primary shrink-0" />
                  <span>Joined: {faculty.joiningDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <button
                  onClick={() => setSelectedVectorFaculty(faculty)}
                  className="flex items-center gap-2 text-xs font-mono font-semibold text-primary hover:underline cursor-pointer"
                >
                  <Fingerprint className="size-4" />
                  <span>Inspect 512-d ArcFace Vector</span>
                </button>

                <button
                  onClick={() => onSelectFacultyForScan(faculty)}
                  className="flex items-center gap-1.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border/80 px-3.5 py-1.5 text-xs font-semibold text-foreground transition-all cursor-pointer"
                >
                  <ScanFace className="size-3.5 text-primary" />
                  <span>Test Scan in Kiosk</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Vector Inspector Modal */}
        {selectedVectorFaculty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-rise">
            <div className="panel max-w-2xl w-full p-6 space-y-4 bg-background border border-border/80 rounded-2xl shadow-glow">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-3">
                  <Fingerprint className="size-6 text-primary" />
                  <div>
                    <h3 className="text-base font-bold">{selectedVectorFaculty.name}</h3>
                    <p className="text-xs font-mono text-muted-foreground">512-Dimensional ArcFace Vector Inspection</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVectorFaculty(null)}
                  className="size-8 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-emerald-400 max-h-[260px] overflow-y-auto space-y-2 border border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                  <span>VECTOR_LENGTH: 512-d</span>
                  <span>NORMALIZED_L2_NORM: 1.0000</span>
                </div>
                <p className="break-all leading-relaxed opacity-90">
                  [{selectedVectorFaculty.face_embedding.slice(0, 120).map(n => n.toFixed(4)).join(', ')}, ... {selectedVectorFaculty.face_embedding.length - 120} more dimensions]
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedVectorFaculty(null)}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
