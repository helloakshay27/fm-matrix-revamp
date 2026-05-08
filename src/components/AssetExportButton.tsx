import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { useAssetExport } from '@/hooks/useAssetExport';

interface AssetExportButtonProps {
  className?: string;
}

export const AssetExportButton: React.FC<AssetExportButtonProps> = ({
  className = '',
}) => {
  const { status, progress, error, startExport, cancelExport, downloadExport } =
    useAssetExport();

  const isLoading = status === 'processing' || status === 'downloading';
  const isDone = status === 'done';
  const isFailed = status === 'failed';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Button */}
      <Button
        onClick={() => {
          if (isDone) {
            downloadExport();
          } else if (status === 'processing') {
            cancelExport();
          } else {
            startExport();
          }
        }}
        disabled={status === 'processing' || status === 'downloading'}
        variant={isDone ? 'default' : isFailed ? 'destructive' : 'outline'}
        className="gap-2"
      >
        {status === 'downloading' ? (
          <>
            <Download className="h-4 w-4 animate-pulse" />
            Downloading...
          </>
        ) : status === 'processing' ? (
          <>
            <Download className="h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : isDone ? (
          <>
            <Download className="h-4 w-4" />
            Download Export
          </>
        ) : isFailed ? (
          <>
            <X className="h-4 w-4" />
            Export Failed
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Export Assets
          </>
        )}
      </Button>

      {/* Progress Bar */}
      {isLoading && status !== 'downloading' && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Progress Text */}
      {(isLoading || isDone) && (
        <p className="text-xs text-gray-600">
          {status === 'downloading'
            ? 'Downloading export...'
            : status === 'processing'
              ? `Processing... ${Math.round(progress)}%`
              : isDone
                ? 'Export ready! Click to download'
                : ''}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Cancel Button during processing */}
      {isLoading && status === 'processing' && (
        <Button
          onClick={cancelExport}
          variant="ghost"
          size="sm"
          className="text-xs"
        >
          Cancel
        </Button>
      )}
    </div>
  );
};
