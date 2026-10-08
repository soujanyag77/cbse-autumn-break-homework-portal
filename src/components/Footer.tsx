import React from 'react';
import { Leaf, GraduationCap, School, Heart, ShieldCheck, HelpCircle } from 'lucide-react';

interface FooterProps {
  onOpenTeacherRoom: () => void;
  onOpenSchemaModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTeacherRoom, onOpenSchemaModal }) => {
  return (
    <footer className="bg-slate-900 text-amber-100/90 border-t-4 border-amber-600 pt-10 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
          
          {/* Column 1: Portal Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                <Leaf className="w-6 h-6 text-amber-100" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  CBSE Autumn Break Portal
                </h3>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">October 2026 Edition</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Official online portal for CBSE Affiliated Senior Secondary Schools providing centralized access to Autumn Vacation holiday homework assignments, practical projects, worksheets, and direct teacher assistance across Class 1 to Class 12.
            </p>

            <div className="inline-flex items-center space-x-2 bg-slate-800 text-amber-300 px-3 py-1 rounded-xl text-xs border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified CBSE Staff Upload Portal Active</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li>
                <a href="#top" className="hover:text-amber-400 transition-colors">
                  • Student & Parent Browsing Zone
                </a>
              </li>
              <li>
                <button onClick={onOpenTeacherRoom} className="hover:text-amber-400 transition-colors text-left">
                  • Teacher Staff Room (Upload)
                </button>
              </li>
              <li>
                <button onClick={onOpenSchemaModal} className="hover:text-amber-400 transition-colors text-left">
                  • Supabase Database & Integration
                </button>
              </li>
              <li>
                <span className="text-slate-500">• CBSE Academic Calendar 2026-27</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Reopening Notice */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Autumn Vacation Timeline
            </h4>
            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl space-y-2 text-xs text-slate-300">
              <div className="flex justify-between font-bold">
                <span>Vacation Period:</span>
                <span className="text-amber-400">Mid-October 2026</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>School Reopening:</span>
                <span className="text-emerald-400">Oct 26, 2026 (Mon)</span>
              </div>
              <div className="pt-2 border-t border-slate-700/80 text-[11px] text-slate-400 leading-snug">
                * Note: Submission registers and practical files must be submitted on the morning of school reopening.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>
            © October 2026 CBSE Autumn Break Holiday Homework Portal. All rights reserved.
          </p>
          <div className="flex items-center space-x-1">
            <span>Designed for CBSE Young Learners & Parents</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
