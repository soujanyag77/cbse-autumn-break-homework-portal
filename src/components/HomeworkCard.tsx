import React, { useState } from 'react';
import {
  Calendar,
  UserCheck,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Share2,
  Trash2,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Assignment, HomeworkFile } from '@/types/homework';
import { SubjectIcon, getSubjectTheme } from './SubjectIcon';
import { AttachmentTray } from './AttachmentTray';

interface HomeworkCardProps {
  assignment: Assignment;
  isStaffUnlocked?: boolean;
  isAdminUnlocked?: boolean;
  onDeleteAssignment?: (id: string) => void;
  onRequestAdminDelete?: (id: string) => void;
  onPreviewFile?: (file: HomeworkFile) => void;
}

export const HomeworkCard: React.FC<HomeworkCardProps> = ({
  assignment,
  isStaffUnlocked = false,
  isAdminUnlocked = false,
  onDeleteAssignment,
  onRequestAdminDelete,
  onPreviewFile,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const theme = getSubjectTheme(assignment.subject);

  // Formatted Due Date
  const dueDateObj = new Date(assignment.due_date);
  const formattedDueDate = dueDateObj.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate days remaining to due date
  const today = new Date();
  const diffTime = dueDateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const instructionsLimit = 160;
  const needsTruncation = assignment.instructions.length > instructionsLimit;
  const displayedInstructions =
    needsTruncation && !isExpanded
      ? assignment.instructions.substring(0, instructionsLimit) + '...'
      : assignment.instructions;

  // Clean WhatsApp phone number for link
  const cleanPhone = assignment.teacher_phone.replace(/\D/g, '');
  const waMessage = encodeURIComponent(
    `Respected ${assignment.teacher_name}, I am a student/parent writing regarding the CBSE Autumn Break Homework for ${assignment.class_grade} (${assignment.subject}): "${assignment.title}". I had a query regarding...`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`;

  const copyCardLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Header Bar */}
      <div>
        <div className={`p-4 sm:p-5 border-b border-amber-100 ${theme.bg}`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            
            {/* Class & Subject Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-xs">
                {assignment.class_grade}
              </span>
              <span className={`flex items-center space-x-1 text-xs font-extrabold px-2.5 py-1 rounded-xl border ${theme.border} ${theme.text} bg-white shadow-xs`}>
                <SubjectIcon subject={assignment.subject} className="w-3.5 h-3.5" />
                <span>{assignment.subject}</span>
              </span>
              {assignment.section && (
                <span className="text-[11px] font-bold text-slate-600 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-lg">
                  {assignment.section}
                </span>
              )}
            </div>

            {/* Admin Delete Button */}
            {onDeleteAssignment && (
              <button
                onClick={() => {
                  if (onRequestAdminDelete && !isAdminUnlocked) {
                    onRequestAdminDelete(assignment.id);
                  } else {
                    onDeleteAssignment(assignment.id);
                  }
                }}
                title="Delete Assignment (Admin PIN Required)"
                className="text-rose-600 hover:text-rose-800 p-1.5 rounded-xl hover:bg-rose-100/80 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

          </div>

          {/* Assignment Title */}
          <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug group-hover:text-amber-800 transition-colors">
            {assignment.title}
          </h3>

          {/* Due Date Indicator */}
          <div className="flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Due Date: <strong className="text-slate-900">{formattedDueDate}</strong></span>
            </div>

            {diffDays >= 0 ? (
              <span className="flex items-center space-x-1 text-[11px] font-extrabold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                <Clock className="w-3 h-3 text-amber-700" />
                <span>{diffDays === 0 ? 'Due Today' : `${diffDays} days left`}</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                Past Due
              </span>
            )}
          </div>
        </div>

        {/* Instructions Body */}
        <div className="p-4 sm:p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Assignment Instructions:
          </div>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
            {displayedInstructions}
          </p>

          {/* Read More Collapsible Drawer Trigger */}
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center space-x-1 focus:outline-none"
            >
              <span>{isExpanded ? 'Show Less' : 'Read Full Instructions'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* File Attachments Tray */}
          <AttachmentTray files={assignment.files} onPreviewFile={onPreviewFile} />
        </div>
      </div>

      {/* Teacher Contact Footer */}
      <div className="p-4 bg-amber-50/40 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Teacher Info */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-200/80 border border-amber-300 text-amber-900 flex items-center justify-center font-black text-sm shadow-xs">
            {assignment.teacher_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-900">{assignment.teacher_name}</span>
              {assignment.is_verified_staff && (
                <span className="flex items-center text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-md border border-emerald-300" title="Verified CBSE Staff Teacher">
                  <UserCheck className="w-3 h-3 mr-0.5" /> Verified
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Subject Faculty</div>
          </div>
        </div>

        {/* WhatsApp Help Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={copyCardLink}
            title="Copy Assignment Link"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-white border border-amber-200/80 transition-all text-xs"
          >
            {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-amber-800" />}
          </button>

          {assignment.teacher_phone && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-2xl text-xs font-bold shadow-xs hover:shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Doubts</span>
            </a>
          )}
        </div>
      </div>

    </div>
  );
};
