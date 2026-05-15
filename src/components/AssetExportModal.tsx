import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, AlertCircle, FileSpreadsheet, BookOpen } from 'lucide-react';
import { useAssetExport } from '@/hooks/useAssetExport';
import { useDigitalRegisterExport } from '@/hooks/useDigitalRegisterExport';
import type { ExportType } from '@/hooks/useAssetExport';

interface AssetExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetExportModal: React.FC<AssetExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Both hooks always called (React rules of hooks)
  const excel = useAssetExport();
  const digitalRegister = useDigitalRegisterExport();

  const [view, setView] = useState<'choose' | 'export'>('choose');
  const [selectedType, setSelectedType] = useState<ExportType | null>(null);

  // Reset to selection screen whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setView('choose');
      setSelectedType(null);
      excel.reset();
      digitalRegister.reset();
    }
  }, [isOpen]);

  const handleClose = () => {
    excel.reset();
    digitalRegister.reset();
    setView('choose');
    setSelectedType(null);
    onClose();
  };

  const handleContinue = () => {
    if (!selectedType) return;
    setView('export');
    if (selectedType === 'digital_register') {
      digitalRegister.startExport();
    } else {
      excel.startExport('excel');
    }
  };

  // Derive display state from the active export
  const isDigital = selectedType === 'digital_register';
  const activeStatus = isDigital ? digitalRegister.status : excel.status;
  const activeError = isDigital ? digitalRegister.error : excel.error;

  const isProcessing = activeStatus === 'processing';
  const isDone = activeStatus === 'done';
  const isFailed = activeStatus === 'failed';
  const isDownloading = !isDigital && excel.status === 'downloading';

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
            <h2 className="text-lg font-semibold text-gray-900">Export Assets</h2>
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

            {/* Step 1 — choose export type */}
            {view === 'choose' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Select the type of export you want to download:</p>

                <button
                  type="button"
                  onClick={() => setSelectedType('excel')}
                  className={`w-full flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedType === 'excel'
                      ? 'border-[#C72030] bg-[#fdf4f4]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`mt-0.5 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                    selectedType === 'excel' ? 'bg-[#C72030]/10' : 'bg-gray-100'
                  }`}>
                    <FileSpreadsheet className={`w-5 h-5 ${selectedType === 'excel' ? 'text-[#C72030]' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Asset Master Dump</p>
                    <p className="text-sm text-gray-500 mt-0.5">Export all asset data as an Excel spreadsheet</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('digital_register')}
                  className={`w-full flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedType === 'digital_register'
                      ? 'border-[#C72030] bg-[#fdf4f4]'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`mt-0.5 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                    selectedType === 'digital_register' ? 'bg-[#C72030]/10' : 'bg-gray-100'
                  }`}>
                    <BookOpen className={`w-5 h-5 ${selectedType === 'digital_register' ? 'text-[#C72030]' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Digital Asset Register</p>
                    <p className="text-sm text-gray-500 mt-0.5">(Ind AS 16 (PPE), Ind AS 36 (Impairment), Ind AS 38 (Intangibles); IFRS 16 (Leases))</p>
                  </div>
                </button>
              </div>
            )}

            {/* Step 2 — progress / done / failed */}
            {view === 'export' && (
              <>
                {isProcessing && (
                  <>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
                      </div>
                      <p className="text-center text-gray-700 font-medium">
                        Generating export file...
                      </p>
                      <p className="text-center text-sm text-gray-500">
                        {isDigital
                          ? 'Building your digital register — this may take a minute'
                          : 'Please wait while we prepare your assets data'}
                      </p>
                    </div>

                    {/* Progress bar only for excel */}
                    {!isDigital && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-semibold text-gray-900">
                            {Math.round(excel.progress)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 ease-out rounded-full"
                            style={{ width: `${excel.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {isDone && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-center text-gray-700 font-medium">
                      {isDigital ? 'Download started!' : 'Export is ready!'}
                    </p>
                    <p className="text-center text-sm text-gray-500">
                      {isDigital
                        ? 'Your digital register is downloading. You can close this window.'
                        : 'Your asset data has been generated and is ready to download'}
                    </p>
                  </div>
                )}

                {isDownloading && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
                    </div>
                    <p className="text-center text-gray-700 font-medium">Downloading file...</p>
                  </div>
                )}

                {isFailed && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-center text-gray-700 font-medium">Export failed</p>
                    <p className="text-center text-sm text-gray-500">
                      {activeError || 'An error occurred while processing your export'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {view === 'choose' ? 'Cancel' : 'Close'}
            </button>

            {view === 'choose' && (
              <Button
                onClick={handleContinue}
                disabled={!selectedType}
                className="flex-1 bg-[#C72030] hover:bg-[#a31a28] text-white disabled:opacity-50"
              >
                Continue
              </Button>
            )}

            {/* Download Now button — only for excel when ready */}
            {view === 'export' && !isDigital && isDone && (
              <Button
                onClick={() => excel.downloadExport()}
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
