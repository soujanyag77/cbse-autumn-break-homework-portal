import React from 'react';
import {
  BookOpen,
  Calculator,
  Microscope,
  Atom,
  FlaskConical,
  Cpu,
  Palette,
  Leaf,
  Globe,
  FileText,
  Binary,
  Code,
  Sparkles,
} from 'lucide-react';

interface SubjectIconProps {
  subject: string;
  className?: string;
}

export const SubjectIcon: React.FC<SubjectIconProps> = ({ subject, className = 'w-5 h-5' }) => {
  const normalized = subject.toLowerCase().trim();

  if (normalized.includes('english') || normalized.includes('hindi') || normalized.includes('sanskrit') || normalized.includes('telugu') || normalized.includes('language')) {
    return <BookOpen className={className} />;
  }
  if (normalized.includes('math') || normalized.includes('geometry') || normalized.includes('algebra')) {
    return <Calculator className={className} />;
  }
  if (normalized.includes('evs') || normalized.includes('environment') || normalized.includes('nature') || normalized.includes('tree')) {
    return <Leaf className={className} />;
  }
  if (normalized.includes('physics')) {
    return <Atom className={className} />;
  }
  if (normalized.includes('chemistry')) {
    return <FlaskConical className={className} />;
  }
  if (normalized.includes('biology') || (normalized.includes('science') && !normalized.includes('social') && !normalized.includes('computer'))) {
    return <Microscope className={className} />;
  }
  if (normalized.includes('social science') || normalized.includes('history') || normalized.includes('geography') || normalized.includes('civics') || normalized.includes('sst')) {
    return <Globe className={className} />;
  }
  if (normalized.includes('computer science') || normalized.includes('cs') || normalized.includes('python')) {
    return <Code className={className} />;
  }
  if (normalized.includes('ai') || normalized.includes('artificial intelligence') || normalized.includes('computer')) {
    return <Cpu className={className} />;
  }
  if (normalized.includes('art') || normalized.includes('twau') || normalized.includes('craft') || normalized.includes('drawing')) {
    return <Palette className={className} />;
  }

  return <FileText className={className} />;
};

export function getSubjectTheme(subject: string): { bg: string; text: string; border: string; accent: string } {
  const norm = subject.toLowerCase();
  if (norm.includes('evs') || norm.includes('nature') || norm.includes('environment')) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', accent: 'bg-emerald-600' };
  }
  if (norm.includes('physics') || norm.includes('chemistry') || norm.includes('biology') || norm.includes('science')) {
    return { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200', accent: 'bg-purple-600' };
  }
  if (norm.includes('math')) {
    return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', accent: 'bg-amber-600' };
  }
  if (norm.includes('computer') || norm.includes('ai') || norm.includes('cs')) {
    return { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200', accent: 'bg-indigo-600' };
  }
  if (norm.includes('social') || norm.includes('sst') || norm.includes('history')) {
    return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200', accent: 'bg-orange-600' };
  }
  if (norm.includes('art') || norm.includes('craft') || norm.includes('twau')) {
    return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200', accent: 'bg-rose-600' };
  }
  return { bg: 'bg-amber-100/50', text: 'text-amber-900', border: 'border-amber-300', accent: 'bg-amber-700' };
}
