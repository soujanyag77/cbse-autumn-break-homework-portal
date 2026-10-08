import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpenCheck,
  Lock,
  Unlock,
  PlusCircle,
  Database,
  Leaf,
  Printer,
  Sparkles,
  School,
  FileCode2,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'student' | 'teacher';
  setActiveTab: (tab: 'student' | 'teacher') => void;
  isStaffUnlocked: boolean;
  onOpenPinModal: () => void;
  onLockStaff: () => void;
  isSupabaseLive: boolean;
  onOpenSchemaModal: () => void;
  onPrint: () => void;
  totalAssignmentsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isStaffUnlocked,
  onOpenPinModal,
  onLockStaff,
  isSupabaseLive,
  onOpenSchemaModal,
  onPrint,
  totalAssignmentsCount,
}) => {
  const handleTeacherTabClick = () => {
    if (!isStaffUnlocked) {
      onOpenPinModal();
    } else {
      setActiveTab('teacher');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-amber-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Header Title */}
          <div 
            onClick={() => setActiveTab('student')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 animate-pulse-subtle text-amber-100" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-700 text-amber-200 p-0.5 rounded-full border border-white">
                <School className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                  CBSE Portal • Oct 2026
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Autumn Break Active
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight group-hover:text-amber-700 transition-colors">
                Holiday Homework Portal
              </h1>
            </div>
          </div>

          {/* Center Tabs: Dual Role Architecture */}
          <nav className="hidden md:flex items-center p-1 bg-amber-100/60 rounded-2xl border border-amber-200 shadow-inner">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-amber-900 shadow-md border border-amber-200/60'
                  : 'text-amber-900/70 hover:text-amber-950 hover:bg-white/50'
              }`}
            >
              <BookOpenCheck className="w-4 h-4 text-amber-600" />
              <span>Student & Parent Zone</span>
              <span className="ml-1 bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full text-xs font-semibold">
                {totalAssignmentsCount}
              </span>
            </button>

            <button
              onClick={handleTeacherTabClick}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'teacher'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'text-amber-900/70 hover:text-amber-950 hover:bg-white/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Teacher Staff Room</span>
              {isStaffUnlocked ? (
                <span className="flex items-center text-[10px] bg-emerald-800 text-white px-1.5 py-0.5 rounded-md uppercase font-black">
                  <Unlock className="w-3 h-3 mr-0.5" /> PIN OK
                </span>
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-600" />
              )}
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Supabase Status / Schema Modal Trigger */}
            <button
              onClick={onOpenSchemaModal}
              title={isSupabaseLive ? 'Connected to Supabase DB' : 'Using Local Storage Fallback Mode. Click for SQL Schema setup.'}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isSupabaseLive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">
                {isSupabaseLive ? 'Supabase Live' : 'Local Storage Mode'}
              </span>
              <FileCode2 className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {/* Print Action */}
            <button
              onClick={onPrint}
              title="Print Holiday Homework List"
              className="p-2 rounded-xl text-slate-700 bg-white border border-amber-200 hover:bg-amber-50 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-amber-800" />
            </button>

            {/* Quick Upload Button on Mobile/Desktop */}
            <button
              onClick={handleTeacherTabClick}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white px-3.5 py-2 rounded-xl text-sm font-bold shadow-md shadow-amber-600/20 hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Post Assignment</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-amber-200/60 bg-amber-50/50">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'student'
                ? 'bg-white text-amber-900 shadow-sm border border-amber-200'
                : 'text-slate-600'
            }`}
          >
            <BookOpenCheck className="w-4 h-4 text-amber-600" />
            <span>Student Board ({totalAssignmentsCount})</span>
          </button>

          <button
            onClick={handleTeacherTabClick}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'teacher'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'text-slate-600'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Teacher Upload</span>
            {!isStaffUnlocked && <Lock className="w-3 h-3 text-amber-500" />}
          </button>
        </div>

      </div>
    </header>
  );
};
