import React from 'react';
import {
  FileText,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  Download,
  Eye,
  Paperclip,
  FileSpreadsheet,
  Film,
} from 'lucide-react';
import { HomeworkFile } from '@/types/homework';

interface AttachmentTrayProps {
  files: HomeworkFile[];
  onPreviewFile?: (file: HomeworkFile) => void;
}

export const AttachmentTray: React.FC<AttachmentTrayProps> = ({ files, onPreviewFile }) => {
  if (!files || files.length === 0) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    const ext = fileType.toLowerCase().replace('.', '');
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return <ImageIcon className="w-4 h-4 text-emerald-600" />;
    }
    if (['zip', 'rar', '7z', 'tar'].includes(ext)) {
      return <FileArchive className="w-4 h-4 text-amber-600" />;
    }
    if (['py', 'js', 'ts', 'html', 'css', 'sql', 'cpp', 'java'].includes(ext)) {
      return <FileCode className="w-4 h-4 text-indigo-600" />;
    }
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
      return <Film className="w-4 h-4 text-purple-600" />;
    }
    return <FileText className="w-4 h-4 text-sky-600" />;
  };

  const getFormatBadgeColor = (fileType: string) => {
    const ext = fileType.toLowerCase().replace('.', '');
    if (['pdf'].includes(ext)) return 'bg-rose-100 text-rose-800 border-rose-300';
    if (['docx', 'doc'].includes(ext)) return 'bg-sky-100 text-sky-800 border-sky-300';
    if (['png', 'jpg', 'jpeg'].includes(ext)) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (['py', 'sql'].includes(ext)) return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    if (['zip'].includes(ext)) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  const handleDownload = (file: HomeworkFile) => {
    const link = document.createElement('a');
    link.href = file.public_url;
    link.download = file.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4 pt-3 border-t border-amber-200/60">
      <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 mb-2">
        <Paperclip className="w-3.5 h-3.5 text-amber-700" />
        <span>Attached Worksheets & Reference Files ({files.length}):</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2.5 bg-amber-50/50 hover:bg-amber-50 border border-amber-200/80 rounded-2xl transition-all group"
          >
            <div className="flex items-center space-x-2.5 min-w-0 flex-1">
              <div className="p-2 rounded-xl bg-white border border-amber-200/80 shadow-xs">
                {getFileIcon(file.file_type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate group-hover:text-amber-900">
                  {file.file_name}
                </p>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-md border ${getFormatBadgeColor(file.file_type)}`}>
                    .{file.file_type.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {formatFileSize(file.file_size)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Preview & Download */}
            <div className="flex items-center space-x-1 ml-2">
              {onPreviewFile && (
                <button
                  onClick={() => onPreviewFile(file)}
                  title="Quick View / Preview File"
                  className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => handleDownload(file)}
                title="Download Attached File"
                className="flex items-center space-x-1 bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl shadow-xs transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
