import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttachmentDropzoneProps {
  /** Called with the newly picked/dropped files */
  onFilesAdded: (files: File[]) => void;
  /** Number of files already chosen, used for the status line */
  fileCount?: number;
  multiple?: boolean;
  /** Native `accept` string, e.g. "image/*,.pdf" */
  accept?: string;
  title?: string;
  className?: string;
}

export const AttachmentDropzone: React.FC<AttachmentDropzoneProps> = ({
  onFilesAdded,
  fileCount = 0,
  multiple = true,
  accept,
  title = 'Drop a file or choose one',
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const emit = (files: File[]) => {
    if (files.length) onFilesAdded(multiple ? files : files.slice(0, 1));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        emit(Array.from(e.dataTransfer.files));
      }}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 cursor-pointer text-center transition-colors',
        isDragging ? 'border-brand bg-brand-selected' : 'border-[#E5E0D3] hover:border-gray-400',
        className
      )}
    >
      <Upload className="w-6 h-6 text-gray-900" />
      <p className="text-base font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-400">
        {fileCount === 0 ? 'No file chosen' : `${fileCount} file${fileCount > 1 ? 's' : ''} chosen`}
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          emit(Array.from(e.target.files || []));
          e.target.value = '';
        }}
      />
    </div>
  );
};
