import React from 'react';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { GradeLevel, getSubjectsForClass, FilterState } from '@/types/homework';
import { SubjectIcon } from './SubjectIcon';

interface FilterBarProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  totalResults: number;
}

const ALL_CLASSES: GradeLevel[] = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8',
  'Class 9', 'Class 10',
  'Class 11', 'Class 12',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  setFilterState,
  totalResults,
}) => {
  // Dynamically load available subjects based on selected class
  const availableSubjects = getSubjectsForClass(filterState.classGrade);

  const handleClassSelect = (grade: GradeLevel | 'All Classes') => {
    setFilterState((prev) => ({
      ...prev,
      classGrade: grade,
      // Reset subject if selected subject is not in new class list
      subject: grade === 'All Classes' ? prev.subject : (
        getSubjectsForClass(grade).includes(prev.subject) ? prev.subject : 'All Subjects'
      ),
    }));
  };

  const handleSubjectSelect = (subj: string) => {
    setFilterState((prev) => ({ ...prev, subject: subj }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState((prev) => ({
      ...prev,
      sortBy: e.target.value as FilterState['sortBy'],
    }));
  };

  const resetFilters = () => {
    setFilterState({
      classGrade: 'All Classes',
      academicStage: 'All Stages',
      subject: 'All Subjects',
      searchQuery: '',
      sortBy: 'due_date_asc',
    });
  };

  const isFilterActive =
    filterState.classGrade !== 'All Classes' ||
    filterState.subject !== 'All Subjects' ||
    filterState.searchQuery.trim() !== '' ||
    filterState.sortBy !== 'due_date_asc';

  return (
    <div className="bg-white border-y border-amber-200 shadow-sm sticky top-20 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        
        {/* Row 1: Search Input & Sort Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-700" />
            <input
              type="text"
              value={filterState.searchQuery}
              onChange={handleSearchChange}
              placeholder="Search homework title, keyword, topic, or teacher's name..."
              className="w-full pl-10 pr-10 py-2.5 bg-amber-50/40 border border-amber-200/90 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-800 placeholder-slate-400 font-medium transition-all"
            />
            {filterState.searchQuery && (
              <button
                onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector & Reset button */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-amber-50/80 border border-amber-200 rounded-2xl px-3 py-1.5 text-xs font-semibold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-700" />
              <span>Sort:</span>
              <select
                value={filterState.sortBy}
                onChange={handleSortChange}
                className="bg-transparent text-amber-950 font-bold focus:outline-none cursor-pointer"
              >
                <option value="due_date_asc">Due Date (Earliest First)</option>
                <option value="due_date_desc">Due Date (Latest First)</option>
                <option value="created_newest">Recently Posted</option>
              </select>
            </div>

            {isFilterActive && (
              <button
                onClick={resetFilters}
                className="flex items-center space-x-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-2xl transition-all"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

        </div>

        {/* Row 2: Horizontal Scrollable Class Selector Pill Buttons */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-600" /> Select Class Grade:
            </span>
            <span className="text-xs font-bold text-slate-600">
              Showing <strong className="text-amber-800">{totalResults}</strong> assignments
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {/* All Classes Pill */}
            <button
              onClick={() => handleClassSelect('All Classes')}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shadow-sm ${
                filterState.classGrade === 'All Classes'
                  ? 'bg-gradient-to-r from-amber-700 to-orange-600 text-white ring-2 ring-amber-400 ring-offset-1'
                  : 'bg-amber-50/80 text-amber-950 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              All Classes (1-12)
            </button>

            {/* Individual Class Pills (Class 1 to Class 12) */}
            {ALL_CLASSES.map((grade) => {
              const isSelected = filterState.classGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => handleClassSelect(grade)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-800 text-white shadow-md ring-2 ring-amber-400'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                  }`}
                >
                  {grade}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Dynamic Subject Filter Pills */}
        <div className="pt-1 border-t border-amber-100">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold uppercase text-slate-600 flex-shrink-0 mr-1">
              Subject Filter:
            </span>

            {/* All Subjects Pill */}
            <button
              onClick={() => handleSubjectSelect('All Subjects')}
              className={`flex-shrink-0 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterState.subject === 'All Subjects'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-emerald-50/70 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              All Subjects
            </button>

            {/* Dynamic Subjects List */}
            {availableSubjects.map((subj) => {
              const isSelected = filterState.subject === subj;
              return (
                <button
                  key={subj}
                  onClick={() => handleSubjectSelect(subj)}
                  className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-700'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 hover:text-amber-900'
                  }`}
                >
                  <SubjectIcon subject={subj} className="w-3.5 h-3.5 text-amber-600" />
                  <span>{subj}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
