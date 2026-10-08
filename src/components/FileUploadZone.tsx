import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileArchive,
  Image as ImageIcon,
  FileCode,
  Trash2,
  CheckCircle,
  Plus,
  AlertCircle,
} from 'lucide-react';

interface FileUploadZoneProps {
  selectedFiles: File[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  selectedFiles,
  onFilesSelected,
  onRemoveFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      onFilesSelected([...selectedFiles, ...newFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      onFilesSelected([...selectedFiles, ...newFiles]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) {
      return <ImageIcon className="w-5 h-5 text-emerald-600" />;
    }
    if (['zip', 'rar', '7z'].includes(ext)) {
      return <FileArchive className="w-5 h-5 text-amber-600" />;
    }
    if (['py', 'js', 'sql', 'cpp', 'html'].includes(ext)) {
      return <FileCode className="w-5 h-5 text-indigo-600" />;
    }
    return <FileText className="w-5 h-5 text-sky-600" />;
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-amber-600 bg-amber-100/70 scale-[1.01]'
            : 'border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png,.zip,.mp4,.py,.sql"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 border border-amber-300 shadow-sm">
          <UploadCloud className="w-6 h-6 animate-pulse" />
        </div>

        <h4 className="text-sm font-black text-slate-800">
          Drag & Drop Worksheets or Files Here
        </h4>
        <p className="text-xs text-slate-600 mt-1 font-medium">
          or <span className="text-amber-700 font-bold underline">browse files from device</span>
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">.PDF</span>
          <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">.DOCX</span>
          <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">.PPTX</span>
          <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">.PNG / .JPG</span>
          <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">.ZIP / .PY</span>
        </div>
      </div>

      {/* Selected Files List with Trash button */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Attached Files ({selectedFiles.length}):</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-amber-700 text-xs font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add More Files
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {selectedFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3 bg-white border border-amber-200 rounded-2xl shadow-xs"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                    {getFileIcon(file.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(idx);
                  }}
                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-all"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
