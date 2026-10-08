import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Send,
  X,
  Phone,
  Mail,
  User,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GradeLevel, SectionChoice, getSubjectsForClass, Assignment } from '@/types/homework';
import { FileUploadZone } from './FileUploadZone';
import { saveAssignment } from '@/lib/homeworkService';

interface TeacherUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isStaffUnlocked: boolean;
  onUnlockStaff: (pin: string) => boolean;
  onAssignmentCreated: (assignment: Assignment) => void;
  onSwitchToStudentView: () => void;
}

const ALL_GRADES: GradeLevel[] = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8',
  'Class 9', 'Class 10',
  'Class 11', 'Class 12',
];

const SECTIONS: SectionChoice[] = [
  'All Sections',
  'Section A',
  'Section B',
  'Section C',
  'Section D',
];

export const TeacherUploadModal: React.FC<TeacherUploadModalProps> = ({
  isOpen,
  onClose,
  isStaffUnlocked,
  onUnlockStaff,
  onAssignmentCreated,
  onSwitchToStudentView,
}) => {
  // Form Fields state
  const [teacherName, setTeacherName] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [selectedClass, setSelectedClass] = useState<GradeLevel>('Class 5');
  const [selectedSection, setSelectedSection] = useState<SectionChoice>('All Sections');
  const [selectedSubject, setSelectedSubject] = useState<string>('Maths');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-25');
  const [files, setFiles] = useState<File[]>([]);

  // Submission UX state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formError, setFormError] = useState('');
  const [submittedAssignment, setSubmittedAssignment] = useState<Assignment | null>(null);

  // Auto-update subject when class changes
  useEffect(() => {
    const subjects = getSubjectsForClass(selectedClass);
    if (!subjects.includes(selectedSubject)) {
      setSelectedSubject(subjects[0] || 'English');
    }
  }, [selectedClass]);

  if (!isOpen) return null;



  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setTeacherPhone(val);
    }
  };

  const handleSubmitHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!teacherName.trim()) {
      setFormError('Please enter Teacher Full Name.');
      return;
    }
    if (!teacherPhone || teacherPhone.length < 10) {
      setFormError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }
    if (!title.trim()) {
      setFormError('Please enter an Assignment Title.');
      return;
    }
    if (!instructions.trim()) {
      setFormError('Please enter detailed Assignment Instructions.');
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(20);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
      }, 200);

      const created = await saveAssignment(
        {
          teacher_name: teacherName,
          teacher_phone: teacherPhone,
          teacher_email: teacherEmail,
          class_grade: selectedClass,
          section: selectedSection,
          subject: selectedSubject,
          title: title,
          instructions: instructions,
          due_date: dueDate,
          files: [],
        },
        files
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback if confetti fails
      }

      setSubmittedAssignment(created);
      onAssignmentCreated(created);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setInstructions('');
    setFiles([]);
    setSubmittedAssignment(null);
    setUploadProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFBF7] rounded-3xl border-2 border-amber-300 shadow-2xl w-full max-w-3xl overflow-hidden relative my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight">
                Teacher Staff Upload Portal
              </h3>
              <p className="text-xs text-amber-100/90 font-medium">
                Post CBSE Autumn Holiday Homework & Attach Worksheets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Success State vs Submission Form */}
        {submittedAssignment ? (
          /* SUCCESS CONFIRMATION STATE */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300 shadow-md">
              <CheckCircle className="w-9 h-9 text-emerald-700 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Published Successfully!
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-2">
                Homework Posted to Student Board
              </h4>
              <p className="text-sm text-slate-600 mt-1 max-w-lg mx-auto">
                Your holiday homework for <strong>{submittedAssignment.class_grade} ({submittedAssignment.subject})</strong> titled &quot;{submittedAssignment.title}&quot; is now active and accessible to all students and parents!
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-amber-200">
              <button
                onClick={() => {
                  onClose();
                  onSwitchToStudentView();
                }}
                className="w-full sm:w-auto bg-amber-800 hover:bg-amber-900 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition-all text-sm flex items-center justify-center space-x-2"
              >
                <ArrowRight className="w-4 h-4" />
                <span>View on Student Board</span>
              </button>

              <button
                onClick={handleResetForm}
                className="w-full sm:w-auto bg-white hover:bg-amber-50 text-slate-800 font-bold border border-amber-300 px-6 py-3 rounded-2xl shadow-sm transition-all text-sm"
              >
                Post Another Assignment
              </button>
            </div>
          </div>
        ) : (
          /* SUBMISSION FORM */
          <form onSubmit={handleSubmitHomework} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl text-xs font-bold text-rose-800 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Section 1: Teacher Contact Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-700" /> Teacher Contact Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="e.g. Ms. Sunita Sharma"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Phone <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={teacherPhone}
                      onChange={handlePhoneChange}
                      placeholder="10-digit number"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Staff Email ID <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      placeholder="teacher@school.edu.in"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Academic Selection */}
            <div className="space-y-3 pt-3 border-t border-amber-200/60">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-700" /> Academic Grade & Subject
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Class Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class Grade</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value as GradeLevel)}
                    className="w-full py-2 px-3 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    {ALL_GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Section Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value as SectionChoice)}
                    className="w-full py-2 px-3 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    {SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                {/* Subject Select (Dynamically populated) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full py-2 px-3 bg-white border border-amber-200 rounded-xl text-xs font-bold text-amber-900 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    {getSubjectsForClass(selectedClass).map((subj) => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Homework Details */}
            <div className="space-y-3 pt-3 border-t border-amber-200/60">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-700" /> Assignment Topic & Instructions
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assignment Title / Topic <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Autumn Science Journal: Leaf Adaptations & Local Trees"
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700" />
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Instructions & Guidelines <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Provide step-by-step instructions, notebook pages to solve, required materials, or scrapbooking guidelines..."
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-2xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Section 4: File Upload Zone */}
            <div className="pt-3 border-t border-amber-200/60">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-2">
                Attach Worksheets & Documents
              </h4>
              <FileUploadZone
                selectedFiles={files}
                onFilesSelected={(newFiles) => setFiles(newFiles)}
                onRemoveFile={(idx) => setFiles(files.filter((_, i) => i !== idx))}
              />
            </div>

            {/* Upload Progress Indicator */}
            {isSubmitting && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-amber-900">
                  <span>Publishing assignment...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-orange-600 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button Footer */}
            <div className="pt-4 border-t border-amber-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 hover:from-amber-800 hover:to-orange-700 text-white font-black px-6 py-2.5 rounded-2xl shadow-md text-xs flex items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Uploading...' : 'Publish Holiday Homework'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
