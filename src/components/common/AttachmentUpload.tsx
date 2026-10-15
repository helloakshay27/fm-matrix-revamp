import React, { useId, useRef } from 'react';
import { Plus, X } from 'lucide-react';

// Add Asset page ka "Asset Image" / attachments upload box (AddAssetPage.tsx ~line 12665)
// ka shared version. Colors theme tokens se — hex mat daalo.

interface AttachmentUploadProps {
  /** Section label, e.g. "Company Logo" */
  label?: string;
  /** "Choose ..." text, e.g. "Choose Logo" */
  chooseText?: string;
  /** Upload button text, e.g. "Upload Logo" */
  uploadText?: string;
  /** Text jab koi file select nahi hai */
  emptyText?: string;
  accept?: string;
  multiple?: boolean;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onRemove?: (index: number) => void;
  disabled?: boolean;
  /** Diya ho to native file picker ki jagah ye chalega (e.g. crop/ratio modal kholna) */
  onBrowse?: () => void;
}

export const AttachmentUpload = ({
  label,
  chooseText = 'Choose File',
  uploadText = 'Upload File',
  emptyText = 'No file chosen',
  accept,
  multiple = false,
  files,
  onFilesSelected,
  onRemove,
  disabled = false,
  onBrowse,
}: AttachmentUploadProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) onFilesSelected(selected);
    // Same file dobara select ho sake isliye value reset
    e.target.value = '';
  };

  return (
    <div>
      {label && <h3 className="text-sm font-semibold text-gray-700 mb-4">{label}</h3>}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        <label
          htmlFor={inputId}
          className="cursor-pointer block"
          onClick={
            onBrowse
              ? (e) => {
                  e.preventDefault();
                  if (!disabled) onBrowse();
                }
              : undefined
          }
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-brand font-medium text-xs sm:text-sm">{chooseText}</span>
            <span className="text-gray-500 text-xs sm:text-sm">
              {files.length > 0
                ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
                : emptyText}
            </span>
          </div>
        </label>
        {files.length > 0 && (
          <div className="mt-2 space-y-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-gray-100 p-2 rounded text-left"
              >
                <span className="text-xs sm:text-sm truncate">{file.name}</span>
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-2">
          <button
            type="button"
            onClick={() => (onBrowse ? onBrowse() : inputRef.current?.click())}
            disabled={disabled}
            className="text-xs sm:text-sm bg-[var(--color-bg)] text-brand px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-brand-selected flex items-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2 text-brand" />
            {uploadText}
          </button>
        </div>
      </div>
    </div>
  );
};
