import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, AlertCircle } from 'lucide-react';
import { useTaskExport } from '@/hooks/useTaskExport';

interface ExportFilters {
  dateFrom?: string;
  dateTo?: string;
  checklist?: string;
  type?: string;
  assignedTo?: string;
  supplierId?: string;
  taskId?: string;
  assetGroupId?: string;
  assetSubGroupId?: string;
  scheduleType?: string;
  searchChecklist?: string;
  searchTaskId?: string;
  taskCategory?: string;
  [key: string]: string | undefined;
}

interface TaskExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters?: ExportFilters;
}

export const TaskExportModal: React.FC<TaskExportModalProps> = ({
  isOpen,
  onClose,
  filters,
}) => {
  const { status, progress, error, startExport, downloadExport, reset } =
    useTaskExport();

  const isProcessing = status === 'processing';
  const isDone = status === 'done';
  const isFailed = status === 'failed';
  const isDownloading = status === 'downloading';

  // Auto-start export when modal opens
  useEffect(() => {
    if (isOpen && status === 'idle') {
      startExport(filters);
    }
  }, [isOpen, status, startExport, filters]);

  // Reset on close
  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Task Export
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {isProcessing && (
              <>
                <div className="flex flex-col items-center space-y-4">
                  {/* Spinner */}
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
                  </div>
                  <p className="text-center text-gray-700 font-medium">
                    Generating export file...
                  </p>
                  <p className="text-center text-sm text-gray-500">
                    Please wait while we prepare your tasks data
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            )}

            {isDone && (
              <>
                <div className="flex flex-col items-center space-y-4">
                  {/* Success Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-center text-gray-700 font-medium">
                    Export is ready!
                  </p>
                  <p className="text-center text-sm text-gray-500">
                    Your task data has been generated and is ready to download
                  </p>
                </div>
              </>
            )}

            {isDownloading && (
              <>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
                  </div>
                  <p className="text-center text-gray-700 font-medium">
                    Downloading file...
                  </p>
                </div>
              </>
            )}

            {isFailed && (
              <>
                <div className="flex flex-col items-center space-y-4">
                  {/* Error Icon */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-center text-gray-700 font-medium">
                    Export failed
                  </p>
                  <p className="text-center text-sm text-gray-500">
                    {error || 'An error occurred while processing your export'}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            {isDone && (
              <Button
                onClick={() => {
                  downloadExport();
                }}
                disabled={isDownloading}
                className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {isDownloading ? (
                  <>
                    <Download className="h-4 w-4 animate-pulse" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download Now
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
