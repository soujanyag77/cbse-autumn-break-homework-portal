'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FilterBar } from '@/components/FilterBar';
import { HomeworkCard } from '@/components/HomeworkCard';
import { TeacherUploadModal } from '@/components/TeacherUploadModal';
import { AdminPinModal } from '@/components/AdminPinModal';
import { FilePreviewModal } from '@/components/FilePreviewModal';
import { SupabaseSchemaModal } from '@/components/SupabaseSchemaModal';
import { Footer } from '@/components/Footer';
import { Assignment, FilterState, HomeworkFile, getStageForClass } from '@/types/homework';
import { fetchAssignments, deleteAssignment } from '@/lib/homeworkService';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  BookOpen,
  Sparkles,
  Inbox,
  AlertCircle,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'student' | 'teacher'>('student');
  const [isStaffUnlocked, setIsStaffUnlocked] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<HomeworkFile | null>(null);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);

  const [filterState, setFilterState] = useState<FilterState>({
    classGrade: 'All Classes',
    academicStage: 'All Stages',
    subject: 'All Subjects',
    searchQuery: '',
    sortBy: 'due_date_asc',
  });

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Load Assignments on Mount
  const loadData = async () => {
    setIsLoading(true);
    try {
      const { assignments: fetched, isFromSupabase } = await fetchAssignments();
      setAssignments(fetched);
      setIsSupabaseLive(isFromSupabase);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Teacher PIN Unlock (PIN: 102026) or Admin PIN (PIN: 992026)
  const handleUnlockStaff = (pin: string): boolean => {
    const trimmed = pin.trim();
    if (trimmed === '102026' || trimmed === '992026') {
      setIsStaffUnlocked(true);
      if (trimmed === '992026') setIsAdminUnlocked(true);
      return true;
    }
    return false;
  };

  // Admin PIN Unlock (PIN: 992026)
  const handleUnlockAdmin = (pin: string): boolean => {
    if (pin.trim() === '992026') {
      setIsAdminUnlocked(true);
      setIsStaffUnlocked(true);
      return true;
    }
    return false;
  };

  const handleLockStaff = () => {
    setIsStaffUnlocked(false);
    setIsAdminUnlocked(false);
  };

  // Open Staff Room Tab
  const handleOpenTeacherRoom = () => {
    setIsTeacherModalOpen(true);
  };

  // Handle Quick Jump from Hero
  const handleQuickFilterStage = (stage: string) => {
    setFilterState((prev) => ({
      ...prev,
      classGrade: 'All Classes',
      academicStage: stage as any,
      subject: 'All Subjects',
      searchQuery: '',
    }));
    const el = document.getElementById('assignments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this assignment upload?')) {
      await deleteAssignment(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleRequestAdminDelete = (id: string) => {
    if (isAdminUnlocked) {
      handleDelete(id);
    } else {
      setPendingDeleteId(id);
      setIsAdminModalOpen(true);
    }
  };

  const handleAssignmentCreated = (newAssignment: Assignment) => {
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  // Filter & Sort Logic
  const filteredAssignments = assignments.filter((item) => {
    // 1. Class filter
    if (filterState.classGrade !== 'All Classes' && item.class_grade !== filterState.classGrade) {
      return false;
    }

    // 2. Stage filter
    if (filterState.academicStage !== 'All Stages') {
      const itemStage = getStageForClass(item.class_grade);
      if (itemStage !== filterState.academicStage) return false;
    }

    // 3. Subject filter
    if (filterState.subject !== 'All Subjects' && item.subject !== filterState.subject) {
      return false;
    }

    // 4. Search Query filter
    if (filterState.searchQuery.trim() !== '') {
      const q = filterState.searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchTeacher = item.teacher_name.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchInstructions = item.instructions.toLowerCase().includes(q);
      const matchGrade = item.class_grade.toLowerCase().includes(q);

      if (!matchTitle && !matchTeacher && !matchSubject && !matchInstructions && !matchGrade) {
        return false;
      }
    }

    return true;
  });

  // Sorting Logic
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (filterState.sortBy === 'due_date_asc') {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    if (filterState.sortBy === 'due_date_desc') {
      return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
    }
    if (filterState.sortBy === 'created_newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });

  // Calculate total files attached across all assignments
  const totalFilesCount = assignments.reduce(
    (acc, item) => acc + (item.files ? item.files.length : 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1E293B]">
      
      {/* 1. Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'teacher') setIsTeacherModalOpen(true);
        }}
        isStaffUnlocked={isStaffUnlocked}
        onOpenPinModal={() => setIsTeacherModalOpen(true)}
        onLockStaff={handleLockStaff}
        isSupabaseLive={isSupabaseLive}
        onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
        onPrint={() => window.print()}
        totalAssignmentsCount={assignments.length}
      />

      {/* 2. Hero Section with Reopening Countdown */}
      <Hero
        totalAssignments={assignments.length}
        totalFiles={totalFilesCount}
        onQuickFilterStage={handleQuickFilterStage}
      />

      {/* 3. Interactive Filtering System */}
      <div id="assignments-section">
        <FilterBar
          filterState={filterState}
          setFilterState={setFilterState}
          totalResults={sortedAssignments.length}
        />
      </div>

      {/* 4. Homework Cards Grid & Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-amber-700 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-700">Loading Holiday Homework Entries...</p>
          </div>
        ) : sortedAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAssignments.map((item) => (
              <HomeworkCard
                key={item.id}
                assignment={item}
                isStaffUnlocked={isStaffUnlocked}
                isAdminUnlocked={isAdminUnlocked}
                onDeleteAssignment={handleDelete}
                onRequestAdminDelete={handleRequestAdminDelete}
                onPreviewFile={(file) => setPreviewFile(file)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-amber-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300">
              <Inbox className="w-8 h-8 text-amber-700" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">No Homework Found</h3>
              <p className="text-xs text-slate-600 mt-1">
                No assignments match your current class filter or search criteria. Try clearing search keywords or selecting &quot;All Classes&quot;.
              </p>
            </div>
            <button
              onClick={() =>
                setFilterState({
                  classGrade: 'All Classes',
                  academicStage: 'All Stages',
                  subject: 'All Subjects',
                  searchQuery: '',
                  sortBy: 'due_date_asc',
                })
              }
              className="bg-amber-800 hover:bg-amber-900 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-md transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </main>

      {/* 5. Modals */}
      <TeacherUploadModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        isStaffUnlocked={isStaffUnlocked}
        onUnlockStaff={handleUnlockStaff}
        onAssignmentCreated={handleAssignmentCreated}
        onSwitchToStudentView={() => setActiveTab('student')}
      />

      <AdminPinModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setPendingDeleteId(null);
        }}
        onUnlockAdmin={handleUnlockAdmin}
        onSuccess={() => {
          if (pendingDeleteId) {
            handleDelete(pendingDeleteId);
            setPendingDeleteId(null);
          }
        }}
        title="Admin Authorization Required"
        description="Please enter the Admin Security PIN to delete this assignment upload requested by the teacher."
      />

      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <SupabaseSchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        isLive={isSupabaseLive}
      />

      {/* 6. Footer */}
      <Footer
        onOpenTeacherRoom={handleOpenTeacherRoom}
        onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
      />

    </div>
  );
}
