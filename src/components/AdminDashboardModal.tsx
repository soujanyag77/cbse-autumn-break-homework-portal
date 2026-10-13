import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Layers,
  X,
  PlusCircle,
  FileText,
  BarChart3,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  Database,
  Cloud,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { Assignment, GradeLevel, ACADEMIC_STAGES, SUBJECTS_BY_STAGE, getStageForClass } from '@/types/homework';
import { SubjectIcon, getSubjectTheme } from './SubjectIcon';
import { getSupabaseCredentials, saveSupabaseCredentials, getSupabaseClient, testSupabaseConnection } from '@/lib/supabase';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  onDeleteAssignment: (id: string) => void;
  onOpenUpload: () => void;
}

const ALL_GRADES: GradeLevel[] = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8',
  'Class 9', 'Class 10',
  'Class 11', 'Class 12',
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  assignments,
  onDeleteAssignment,
  onOpenUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'manage' | 'pending' | 'cloud'>('manage');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'All'>('All');

  // Cloud Config state
  const [cloudUrl, setCloudUrl] = useState('');
  const [cloudKey, setCloudKey] = useState('');
  const [cloudStatus, setCloudStatus] = useState<{ isConfigured: boolean; isFromEnv: boolean }>({
    isConfigured: false,
    isFromEnv: false,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    tableOk: boolean;
    bucketOk: boolean;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setCloudUrl(creds.url);
      setCloudKey(creds.key);
      setCloudStatus({ isConfigured: creds.isConfigured, isFromEnv: creds.isFromEnv });
      setTestResult(null);
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testSupabaseConnection();
      setTestResult({
        tested: true,
        ...result,
      });
    } catch (e: any) {
      setTestResult({
        tested: true,
        success: false,
        message: e.message || 'Connection test failed',
        tableOk: false,
        bucketOk: false,
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  // 1. Compute Analytics
  const totalUploaded = assignments.length;
  const totalFiles = assignments.reduce((acc, a) => acc + (a.files ? a.files.length : 0), 0);
  
  const activeGradesSet = new Set(assignments.map((a) => a.class_grade));
  const activeGradesCount = activeGradesSet.size;

  // 2. Generate Pending Matrix (Class & Subject combinations without any homework)
  const pendingItems: { grade: GradeLevel; subject: string; stage: string }[] = [];
  const uploadedMatrix = new Set(
    assignments.map((a) => `${a.class_grade}:::${a.subject.toLowerCase()}`)
  );

  ALL_GRADES.forEach((grade) => {
    const stage = getStageForClass(grade);
    const subjects = SUBJECTS_BY_STAGE[stage];
    subjects.forEach((subj) => {
      const key = `${grade}:::${subj.toLowerCase()}`;
      if (!uploadedMatrix.has(key)) {
        pendingItems.push({ grade, subject: subj, stage });
      }
    });
  });

  // Filtered Uploads list
  const filteredUploads = assignments.filter((item) => {
    if (selectedGrade !== 'All' && item.class_grade !== selectedGrade) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchTeacher = item.teacher_name.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);
      if (!matchTitle && !matchTeacher && !matchSubject) return false;
    }
    return true;
  });

  // Filtered Pending list
  const filteredPending = pendingItems.filter((item) => {
    if (selectedGrade !== 'All' && item.grade !== selectedGrade) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.subject.toLowerCase().includes(q) || item.grade.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSaveCloudSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(cloudUrl, cloudKey);
    const creds = getSupabaseCredentials();
    setCloudStatus({ isConfigured: creds.isConfigured, isFromEnv: creds.isFromEnv });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    handleTestConnection();
  };

  const sqlCode = `-- Supabase SQL Schema for CBSE Autumn Break Portal
CREATE TABLE IF NOT EXISTS public.assignments (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    teacher_name TEXT NOT NULL,
    teacher_phone TEXT NOT NULL,
    teacher_email TEXT,
    class_grade TEXT NOT NULL,
    section TEXT NOT NULL,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    due_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.assignment_files (
    id TEXT PRIMARY KEY,
    assignment_id TEXT REFERENCES public.assignments(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT DEFAULT 0,
    file_type TEXT NOT NULL,
    storage_path TEXT,
    public_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Public Insert assignments" ON public.assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete assignments" ON public.assignments FOR DELETE USING (true);

CREATE POLICY "Public Read assignment_files" ON public.assignment_files FOR SELECT USING (true);
CREATE POLICY "Public Insert assignment_files" ON public.assignment_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete assignment_files" ON public.assignment_files FOR DELETE USING (true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('holiday-homework', 'holiday-homework', true)
ON CONFLICT (id) DO NOTHING;
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFBF7] rounded-3xl border-2 border-rose-300 shadow-2xl w-full max-w-5xl overflow-hidden relative my-6 animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
                <span>CBSE Admin Control Dashboard</span>
                <span className="text-[10px] bg-rose-500/30 text-rose-300 font-bold px-2 py-0.5 rounded-md border border-rose-500/40">
                  Admin Unlocked
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage Homework Uploads, Delete Requests, & Track Pending Subject Submissions
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

        {/* Analytics Top Cards */}
        <div className="p-6 border-b border-amber-200/80 bg-amber-50/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Total Uploaded</div>
              <div className="text-2xl font-black text-amber-900 mt-1">{totalUploaded}</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Saved & Active</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Active Classes</div>
              <div className="text-2xl font-black text-orange-900 mt-1">{activeGradesCount} / 12</div>
              <div className="text-[11px] text-slate-600 font-semibold mt-0.5">Classes Submitted</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Attached Worksheets</div>
              <div className="text-2xl font-black text-indigo-900 mt-1">{totalFiles}</div>
              <div className="text-[11px] text-indigo-700 font-semibold mt-0.5">Files & Worksheets</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Pending Subjects</div>
              <div className="text-2xl font-black text-rose-700 mt-1">{pendingItems.length}</div>
              <div className="text-[11px] text-rose-600 font-semibold mt-0.5">Not Uploaded Yet</div>
            </div>

          </div>
        </div>

        {/* Admin Navigation Tabs & Filters */}
        <div className="p-6 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
            {/* View Switcher Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-amber-100/70 p-1 rounded-2xl border border-amber-200">
              <button
                onClick={() => setActiveTab('manage')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'manage'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-amber-900 hover:bg-white/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Uploaded Assignments ({filteredUploads.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pending')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'pending'
                    ? 'bg-rose-700 text-white shadow-sm'
                    : 'text-rose-900 hover:bg-rose-100/60'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Pending / Missing ({filteredPending.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('cloud')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  activeTab === 'cloud'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-emerald-950 hover:bg-white/50'
                }`}
              >
                <Cloud className="w-4 h-4 text-emerald-300" />
                <span>Cloud Sync & Sharing</span>
                {cloudStatus.isConfigured ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
            </div>

            {/* Quick Upload Action */}
            <button
              onClick={() => {
                onClose();
                onOpenUpload();
              }}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-800 hover:to-orange-700 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Assignment</span>
            </button>
          </div>

          {/* TAB 1: UPLOADED ASSIGNMENTS TABLE */}
          {activeTab === 'manage' && (
            <>
              {/* Search & Class Filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter by title, teacher, or subject..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-amber-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-600 flex-shrink-0">Filter Class:</span>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value as GradeLevel | 'All')}
                    className="py-2 px-3 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer w-full sm:w-auto"
                  >
                    <option value="All">All Classes</option>
                    {ALL_GRADES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="max-h-[45vh] overflow-y-auto border border-amber-200 rounded-2xl bg-white">
                {filteredUploads.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-amber-100/70 border-b border-amber-200 font-bold text-slate-800 sticky top-0">
                      <tr>
                        <th className="p-3">Class & Subject</th>
                        <th className="p-3">Assignment Title</th>
                        <th className="p-3">Teacher</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3 text-center">Files</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {filteredUploads.map((item) => (
                        <tr key={item.id} className="hover:bg-amber-50/50 transition-colors">
                          <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                                {item.class_grade}
                              </span>
                              <span className="text-amber-900 flex items-center gap-1 font-extrabold">
                                <SubjectIcon subject={item.subject} className="w-3.5 h-3.5 text-amber-700" />
                                {item.subject}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 font-medium text-slate-800 max-w-xs truncate">
                            {item.title}
                          </td>
                          <td className="p-3 font-semibold text-slate-700 whitespace-nowrap">
                            {item.teacher_name}
                          </td>
                          <td className="p-3 text-slate-600 font-bold whitespace-nowrap">
                            {item.due_date}
                          </td>
                          <td className="p-3 text-center font-bold text-amber-800">
                            {item.files ? item.files.length : 0}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => onDeleteAssignment(item.id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1.5 rounded-xl transition-all inline-flex items-center space-x-1"
                              title="Delete Upload requested by teacher"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 font-medium">
                    No matching uploaded assignments found.
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: PENDING ASSIGNMENTS MATRIX */}
          {activeTab === 'pending' && (
            <div className="max-h-[45vh] overflow-y-auto space-y-3 pr-1">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-medium text-amber-900 leading-relaxed">
                <strong>Pending Submissions Tracker:</strong> Below is a list of subject areas across Class 1 to Class 12 that currently do not have any holiday homework uploaded.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredPending.map((p, idx) => (
                  <div
                    key={`${p.grade}-${p.subject}-${idx}`}
                    className="p-3 bg-white border border-rose-200/80 hover:border-rose-300 rounded-2xl shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
                        <SubjectIcon subject={p.subject} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-black text-slate-900">{p.grade}</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">({p.stage})</span>
                        </div>
                        <p className="text-xs font-extrabold text-rose-900 truncate">{p.subject}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD DATABASE SETTINGS (SUPABASE) */}
          {activeTab === 'cloud' && (
            <div className="max-h-[52vh] overflow-y-auto space-y-4 pr-1">
              
              {/* Status Header */}
              <div className={`p-4 rounded-2xl border ${
                cloudStatus.isConfigured
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                <div className="flex items-center space-x-2 font-black text-sm">
                  {cloudStatus.isConfigured ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Cloud Database Configured {cloudStatus.isFromEnv ? '(via Vercel Environment)' : '(via Current Browser)'}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-700" />
                      <span>Local Storage Mode Active (Uploads only saved on this browser)</span>
                    </>
                  )}
                </div>
                <p className="text-xs mt-1 font-medium leading-relaxed">
                  {cloudStatus.isConfigured
                    ? 'Your Supabase credentials are set. Use the "Test Live Connection" button below to confirm that both your database table and storage bucket are active.'
                    : 'Uploads are currently stored in this browser only. To make uploads visible to everyone across all phones and browsers, connect Supabase below.'}
                </p>
              </div>

              {/* Crucial Guide: Why other browsers don't see uploads */}
              <div className="bg-sky-50 border border-sky-300 rounded-2xl p-4 space-y-2 text-xs text-sky-950">
                <h4 className="font-black text-sky-900 flex items-center gap-1.5 text-sm">
                  <ExternalLink className="w-4 h-4 text-sky-700" />
                  Why do other browsers/devices not see uploads yet?
                </h4>
                <p className="leading-relaxed">
                  Web browsers have separate, isolated offline storage. Saving credentials in this popup connects <strong>this browser</strong>, but to make uploads appear automatically on <strong>every student&apos;s and parent&apos;s phone and laptop without them having to configure anything</strong>:
                </p>
                <div className="bg-white/80 p-3 rounded-xl border border-sky-200 space-y-1.5 font-medium">
                  <div className="font-bold text-sky-900">3-Step Checklist for All Devices:</div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-800">
                    <li>Create your free project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-sky-700 underline font-bold">supabase.com</a> and run the SQL script below in the SQL Editor.</li>
                    <li>Go to your <strong>Vercel Dashboard</strong> ➔ Your Project ➔ <strong>Settings</strong> ➔ <strong>Environment Variables</strong>.</li>
                    <li>Add:
                      <div className="mt-1 font-mono text-[11px] bg-slate-900 text-amber-200 p-2 rounded-lg">
                        NEXT_PUBLIC_SUPABASE_URL = your-supabase-project-url<br/>
                        NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-public-key
                      </div>
                    </li>
                    <li>In Vercel, go to <strong>Deployments</strong> ➔ Click the three dots ➔ <strong>Redeploy</strong>. Once redeployed, every browser and phone on earth will automatically see all uploaded files!</li>
                  </ol>
                </div>
              </div>

              {/* Form to paste Supabase credentials */}
              <form onSubmit={handleSaveCloudSettings} className="bg-white p-5 rounded-2xl border border-amber-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-700" />
                  Supabase Cloud Credentials (This Device)
                </h4>

                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Supabase Project URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://your-project.supabase.co"
                      value={cloudUrl}
                      onChange={(e) => setCloudUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Supabase Anon Public API Key
                    </label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOi..."
                      value={cloudKey}
                      onChange={(e) => setCloudKey(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-100">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTesting || !cloudUrl.trim() || !cloudKey.trim()}
                      className="bg-sky-700 hover:bg-sky-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition-all disabled:opacity-50 flex items-center space-x-1"
                    >
                      {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                      <span>{isTesting ? 'Testing...' : 'Test Live Connection'}</span>
                    </button>

                    {saveSuccess && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Saved!
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save & Connect Cloud
                  </button>
                </div>

                {/* Test Results Card */}
                {testResult && (
                  <div className={`mt-3 p-3 rounded-xl border text-xs leading-relaxed ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      {testResult.success ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Connection Test Passed!</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Connection Test Failed:</span>
                        </>
                      )}
                    </div>
                    <p className="font-medium text-[11px] mb-2">{testResult.message}</p>
                    <div className="flex flex-wrap items-center gap-3 font-semibold text-[11px]">
                      <span className={testResult.tableOk ? 'text-emerald-700' : 'text-rose-700'}>
                        Table &apos;assignments&apos;: {testResult.tableOk ? '✓ Found' : '✗ Missing'}
                      </span>
                      <span className={testResult.bucketOk ? 'text-emerald-700' : 'text-rose-700'}>
                        Bucket &apos;holiday-homework&apos;: {testResult.bucketOk ? '✓ Found' : '✗ Missing'}
                      </span>
                    </div>
                  </div>
                )}
              </form>

              {/* SQL Script Quick Copy */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">Supabase SQL Editor Script:</span>
                  <button
                    onClick={copySql}
                    className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied' : 'Copy SQL Script'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Run this in your Supabase SQL Editor once to create the tables and storage bucket.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
