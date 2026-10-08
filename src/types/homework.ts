export type GradeLevel = 
  | 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5'
  | 'Class 6' | 'Class 7' | 'Class 8'
  | 'Class 9' | 'Class 10'
  | 'Class 11' | 'Class 12';

export type AcademicStage = 'Primary' | 'Middle' | 'Secondary' | 'Senior Secondary';

export type SectionChoice = 'All Sections' | 'Section A' | 'Section B' | 'Section C' | 'Section D';

export interface HomeworkFile {
  id: string;
  assignment_id?: string;
  file_name: string;
  file_size: number; // in bytes
  file_type: string; // extension or mime type (pdf, docx, png, etc.)
  storage_path?: string;
  public_url: string;
  content_preview?: string; // For mock previewing text/code files
}

export interface Assignment {
  id: string;
  created_at: string;
  teacher_name: string;
  teacher_phone: string;
  teacher_email?: string;
  class_grade: GradeLevel;
  section: SectionChoice | string;
  subject: string;
  title: string;
  instructions: string;
  due_date: string; // ISO string YYYY-MM-DD
  files: HomeworkFile[];
  is_verified_staff?: boolean;
}

export interface FilterState {
  classGrade: GradeLevel | 'All Classes';
  academicStage: AcademicStage | 'All Stages';
  subject: string | 'All Subjects';
  searchQuery: string;
  sortBy: 'due_date_asc' | 'due_date_desc' | 'created_newest';
}

export const ACADEMIC_STAGES: Record<AcademicStage, GradeLevel[]> = {
  'Primary': ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
  'Middle': ['Class 6', 'Class 7', 'Class 8'],
  'Secondary': ['Class 9', 'Class 10'],
  'Senior Secondary': ['Class 11', 'Class 12'],
};

export const SUBJECTS_BY_STAGE: Record<AcademicStage, string[]> = {
  'Primary': [
    'English',
    'Hindi',
    'Sanskrit',
    'Telugu',
    'Maths',
    'EVS',
    'Computers',
    'Art & Craft / TWAU',
  ],
  'Middle': [
    'English',
    'Hindi',
    'Sanskrit',
    'Telugu',
    'Maths',
    'Science',
    'Social Science',
    'AI Foundation',
    'Computers',
    'TWAU',
  ],
  'Secondary': [
    'English',
    'Hindi',
    'Telugu',
    'Sanskrit',
    'Mathematics',
    'Science',
    'Social Science',
    'Artificial Intelligence',
    'Computer Applications',
  ],
  'Senior Secondary': [
    'Physics',
    'Chemistry',
    'Biology',
    'Mathematics',
    'Computer Science (CS)',
    'Artificial Intelligence (AI)',
    'English Core',
    'Hindi Core',
  ],
};

export function getStageForClass(grade: GradeLevel): AcademicStage {
  if (['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'].includes(grade)) return 'Primary';
  if (['Class 6', 'Class 7', 'Class 8'].includes(grade)) return 'Middle';
  if (['Class 9', 'Class 10'].includes(grade)) return 'Secondary';
  return 'Senior Secondary';
}

export function getSubjectsForClass(grade: GradeLevel | 'All Classes'): string[] {
  if (grade === 'All Classes') {
    // Unique list of all subjects
    const all = [
      ...SUBJECTS_BY_STAGE['Primary'],
      ...SUBJECTS_BY_STAGE['Middle'],
      ...SUBJECTS_BY_STAGE['Secondary'],
      ...SUBJECTS_BY_STAGE['Senior Secondary'],
    ];
    return Array.from(new Set(all));
  }
  const stage = getStageForClass(grade as GradeLevel);
  return SUBJECTS_BY_STAGE[stage];
}
