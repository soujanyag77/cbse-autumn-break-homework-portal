import React, { useState } from 'react';
import { Database, X, Copy, Check, Sparkles, Server } from 'lucide-react';

interface SupabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLive: boolean;
}

export const SupabaseSchemaModal: React.FC<SupabaseSchemaModalProps> = ({
  isOpen,
  onClose,
  isLive,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sqlCode = `-- CBSE Autumn Break Holiday Homework Portal - Supabase SQL Schema
-- Run this in your Supabase SQL Editor (https://supabase.com)

-- 1. Create assignments table
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

-- 2. Create assignment_files table
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

-- 3. Enable RLS (Row Level Security) or Public Access Policies
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Public Insert Access assignments" ON public.assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Access assignments" ON public.assignments FOR DELETE USING (true);

CREATE POLICY "Public Read Access assignment_files" ON public.assignment_files FOR SELECT USING (true);
CREATE POLICY "Public Insert Access assignment_files" ON public.assignment_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Access assignment_files" ON public.assignment_files FOR DELETE USING (true);

-- 4. Create Public Storage Bucket named 'holiday-homework'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('holiday-homework', 'holiday-homework', true)
ON CONFLICT (id) DO NOTHING;
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FDFBF7] rounded-3xl border-2 border-amber-300 shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200 my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Supabase Integration Setup</span>
                {isLive ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/40">
                    Connected Live
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/40">
                    Local Fallback Active
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">Database Schema & Environment Configuration</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-slate-700 leading-relaxed font-medium">
            <strong className="text-amber-900 font-bold block mb-1">Graceful Storage Fallback Architecture:</strong>
            If Supabase keys (<code className="bg-amber-100 px-1 rounded text-amber-900">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 rounded text-amber-900">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>) are not supplied in <code className="bg-amber-100 px-1 rounded text-amber-900">.env.local</code>, the application automatically uses LocalStorage with 6 pre-filled realistic CBSE homework assignments!
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">Supabase SQL Migration Script:</span>
              <button
                onClick={copySql}
                className="flex items-center space-x-1 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'SQL Copied!' : 'Copy SQL Script'}</span>
              </button>
            </div>

            <pre className="bg-slate-900 text-amber-200 p-4 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 select-all">
              {sqlCode}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};
