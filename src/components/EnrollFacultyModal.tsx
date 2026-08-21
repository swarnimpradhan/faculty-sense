import React, { useState } from 'react';
import { X, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Faculty, Department } from '../types';
import { generate512dEmbedding } from '../utils/biometricsEngine';

interface EnrollFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (newFaculty: Faculty) => void;
}

export const EnrollFacultyModal: React.FC<EnrollFacultyModalProps> = ({
  isOpen,
  onClose,
  onEnroll,
}) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<Department>('Computer Science & IT');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [email, setEmail] = useState('');
  const [officeLocation, setOfficeLocation] = useState('Block I, Room 204');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const newId = `FAC-${Date.now().toString().slice(-4)}`;
      const embedding = generate512dEmbedding(`${newId}-${name}`);

      const newFaculty: Faculty = {
        id: newId,
        name: name.trim(),
        department,
        designation,
        office_location: officeLocation,
        contact_info: {
          email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@christuniversity.in`,
          phone: '+91 98450 ' + Math.floor(10000 + Math.random() * 90000)
        },
        face_embedding: embedding,
        avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0],
        enrolledAt: new Date().toISOString(),
        samplePhotosCount: 5
      };

      onEnroll(newFaculty);
      setIsGenerating(false);
      onClose();
      
      // Reset
      setName('');
      setEmail('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-rise">
      <div className="panel max-w-lg w-full overflow-hidden bg-background shadow-glow border border-border/80 rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 p-5 bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UserPlus className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Enrol New Faculty Member</h2>
              <p className="text-xs text-muted-foreground">Extract 512-d ArcFace vector & add to knowledge base</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Priya Sharma"
              className="w-full rounded-xl border border-border bg-secondary/20 px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:bg-background transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full rounded-xl border border-border bg-secondary/20 px-3 py-2.5 text-xs outline-none focus:border-primary focus:bg-background transition-all"
              >
                <option value="Computer Science & IT">Computer Science & IT</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="School of Law">School of Law</option>
                <option value="School of Business & Management">School of Business & Management</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Physics & Basic Sciences">Physics & Basic Sciences</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Associate Professor"
                className="w-full rounded-xl border border-border bg-secondary/20 px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:bg-background transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya.sharma@christuniversity.in"
                className="w-full rounded-xl border border-border bg-secondary/20 px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:bg-background transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Office Location</label>
              <input
                type="text"
                value={officeLocation}
                onChange={(e) => setOfficeLocation(e.target.value)}
                placeholder="Block I, Room 204"
                className="w-full rounded-xl border border-border bg-secondary/20 px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:bg-background transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Faculty Face Photo URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 rounded-xl border border-border bg-secondary/20 px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:bg-background transition-all"
              />
              <img src={avatarUrl} alt="Preview" className="size-9 rounded-xl object-cover border border-border shrink-0" />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-border/70">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-border bg-secondary/40 hover:bg-secondary transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !name.trim()}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="size-4 animate-spin" />
                  <span>Computing 512-d ArcFace Vector...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  <span>Enrol & Save Vector</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
