import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileCheck,
  Leaf,
  GraduationCap,
  Download,
  AlertCircle,
  TreePine,
} from 'lucide-react';

interface HeroProps {
  totalAssignments: number;
  totalFiles: number;
  onQuickFilterStage: (stage: any) => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalAssignments,
  totalFiles,
  onQuickFilterStage,
}) => {
  // Reopening date target: October 26, 2026 08:00 AM IST
  const REOPENING_DATE = new Date('2026-10-26T08:00:00+05:30');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const difference = REOPENING_DATE.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-900/5 border-b border-amber-200/70 pt-8 pb-10 sm:py-12">
      {/* Decorative Autumn Leaves Floating Background */}
      <div className="absolute top-4 left-6 text-amber-500/20 animate-float pointer-events-none">
        <Leaf className="w-16 h-16" />
      </div>
      <div className="absolute top-12 right-12 text-orange-500/20 animate-float pointer-events-none" style={{ animationDelay: '1.5s' }}>
        <TreePine className="w-20 h-20" />
      </div>
      <div className="absolute bottom-4 right-1/4 text-amber-600/15 animate-float pointer-events-none" style={{ animationDelay: '2.5s' }}>
        <Leaf className="w-12 h-12" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Main Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-amber-100/90 text-amber-900 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-amber-300 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Official CBSE Autumn Vacation Assignment Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              CBSE Autumn Break <br />
              <span className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 bg-clip-text text-transparent">
                Holiday Homework
              </span>{' '}
              <span className="text-amber-800 font-extrabold">(October 2026)</span>
            </h1>

            <p className="text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed font-medium max-w-2xl">
              Welcome Students & Parents! Access subject-wise holiday assignments, downloadable worksheets, project guides, and direct teacher query assistance across Class 1 to Class 12.
            </p>

            {/* Quick Grade Bands Navigation Shortcuts */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide mr-1">Quick Jump:</span>
              {[
                { label: 'Primary (Cl 1-5)', stage: 'Primary', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200' },
                { label: 'Middle (Cl 6-8)', stage: 'Middle', color: 'bg-sky-100 text-sky-900 border-sky-300 hover:bg-sky-200' },
                { label: 'Secondary (Cl 9-10)', stage: 'Secondary', color: 'bg-indigo-100 text-indigo-900 border-indigo-300 hover:bg-indigo-200' },
                { label: 'Sr Sec (Cl 11-12)', stage: 'Senior Secondary', color: 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200' },
              ].map((b) => (
                <button
                  key={b.stage}
                  onClick={() => onQuickFilterStage(b.stage)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all shadow-sm ${b.color}`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Stats Summary Chips */}
            <div className="pt-3 grid grid-cols-3 gap-3 max-w-lg">
              <div className="bg-white/80 backdrop-blur border border-amber-200 p-3 rounded-2xl text-center shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-amber-800">{totalAssignments}</div>
                <div className="text-[11px] font-bold text-slate-600 uppercase">Assignments</div>
              </div>

              <div className="bg-white/80 backdrop-blur border border-amber-200 p-3 rounded-2xl text-center shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-orange-800">12</div>
                <div className="text-[11px] font-bold text-slate-600 uppercase">Classes Covered</div>
              </div>

              <div className="bg-white/80 backdrop-blur border border-amber-200 p-3 rounded-2xl text-center shadow-sm">
                <div className="text-xl sm:text-2xl font-black text-emerald-800">{totalFiles}</div>
                <div className="text-[11px] font-bold text-slate-600 uppercase">Worksheets / Files</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Autumn Reopening Countdown Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-amber-500/30 relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400">
                    <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-amber-100">School Reopening Countdown</h3>
                    <p className="text-xs text-slate-400">Target Date: Oct 26, 2026 • 08:00 AM</p>
                  </div>
                </div>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-1 rounded-md uppercase border border-amber-500/30">
                  Late Oct 2026
                </span>
              </div>

              {/* Countdown Numbers Grid */}
              <div className="grid grid-cols-4 gap-2 text-center my-4">
                <div className="bg-slate-800/90 border border-amber-500/30 p-2.5 sm:p-3 rounded-2xl">
                  <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Days</span>
                </div>

                <div className="bg-slate-800/90 border border-amber-500/30 p-2.5 sm:p-3 rounded-2xl">
                  <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Hours</span>
                </div>

                <div className="bg-slate-800/90 border border-amber-500/30 p-2.5 sm:p-3 rounded-2xl">
                  <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Mins</span>
                </div>

                <div className="bg-slate-800/90 border border-amber-500/30 p-2.5 sm:p-3 rounded-2xl">
                  <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Secs</span>
                </div>
              </div>

              {/* Guidelines Note Box */}
              <div className="mt-4 bg-amber-950/60 border border-amber-500/30 rounded-2xl p-3.5 flex items-start space-x-3 text-xs text-amber-200">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong className="text-white">Submission Notice:</strong> All practical files, scrapbooks, and worksheets must be submitted to respective subject teachers on the first day of school reopening.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
