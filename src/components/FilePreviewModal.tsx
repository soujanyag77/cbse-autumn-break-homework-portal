import React from 'react';
import { X, Download, FileText, ExternalLink, Paperclip } from 'lucide-react';
import { HomeworkFile } from '@/types/homework';

interface FilePreviewModalProps {
  file: HomeworkFile | null;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose }) => {
  if (!file) return null;

  const ext = file.file_type.toLowerCase().replace('.', '');
  const isImage = ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.public_url;
    link.download = file.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-amber-200 shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-amber-100/80 border-b border-amber-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <Paperclip className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-900 truncate">{file.file_name}</h3>
              <p className="text-[11px] font-semibold text-slate-600 uppercase">
                Format: .{file.file_type}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-600 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Preview */}
        <div className="p-6 max-h-[70vh] overflow-y-auto flex items-center justify-center bg-slate-50">
          {isImage ? (
            <div className="text-center">
              <img
                src={file.public_url}
                alt={file.file_name}
                className="max-h-[50vh] max-w-full rounded-2xl border border-amber-200 shadow-md mx-auto object-contain"
              />
              <p className="text-xs text-slate-500 font-medium mt-3">Image Document Preview</p>
            </div>
          ) : (
            <div className="w-full bg-white p-5 rounded-2xl border border-amber-200 shadow-inner font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap overflow-x-auto">
              <div className="flex items-center space-x-2 border-b border-amber-100 pb-2 mb-3 font-sans text-xs font-bold text-amber-900">
                <FileText className="w-4 h-4 text-amber-700" />
                <span>Worksheet Text / Document Content Preview</span>
              </div>
              {file.content_preview ||
                `CBSE Autumn Break Homework Document: ${file.file_name}\n\nThis document contains complete step-by-step guidelines, questions, and reference diagrams for the assignment.\n\nClick the 'Download' button above to save the full file to your device.`}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
