import { useState, useCallback, useRef, useEffect } from 'react';
import { assetExportService } from '@/services/assetExportService';
import { toast } from 'sonner';

export type ExportStatus = 'idle' | 'processing' | 'done' | 'failed' | 'downloading';

export type ExportType = 'excel' | 'digital_register';

interface UseAssetExportReturn {
  status: ExportStatus;
  progress: number;
  exportKey: string | null;
  error: string | null;
  startExport: (type?: ExportType) => Promise<void>;
  cancelExport: () => void;
  downloadExport: () => Promise<void>;
  reset: () => void;
}

export const useAssetExport = (
  pollingInterval: number = 2000,
  maxRetries: number = 300
): UseAssetExportReturn => {
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [exportKey, setExportKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollingTimeoutRef = useRef<NodeJS.Timeout>();
  const retriesRef = useRef(0);
  const isMountedRef = useRef(true);
  const exportTypeRef = useRef<ExportType>('excel');

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  const poll = useCallback(
    async (key: string) => {
      if (!isMountedRef.current) {
        console.log('🛑 Component unmounted, stop polling');
        return;
      }

      try {
        console.log(`📊 Poll attempt ${retriesRef.current + 1} for key:`, key);
        const statusResponse = exportTypeRef.current === 'digital_register'
          ? await assetExportService.checkDigitalRegisterExportStatus(key)
          : await assetExportService.checkExportStatus(key);

        if (!isMountedRef.current) return;

        console.log('📋 Status received:', statusResponse.status);

        // Update progress
        if (retriesRef.current < maxRetries) {
          const estimatedProgress = Math.min(
            90,
            30 + (retriesRef.current / maxRetries) * 60
          );
          setProgress(estimatedProgress);
        }

        // Check if done
        if (statusResponse.status === 'done' || statusResponse.isFile) {
          console.log('✅ Export ready!');
          setProgress(100);
          setStatus('done');
          toast.success('Asset export is ready for download');
          return;
        }

        // Check if failed
        if (statusResponse.status === 'failed') {
          console.error('❌ Export failed');
          setStatus('failed');
          setError('Export failed. Please try again.');
          toast.error('Export failed. Please try again.');
          return;
        }

        // Still processing
        retriesRef.current += 1;

        if (retriesRef.current >= maxRetries) {
          console.error('❌ Max retries');
          setStatus('failed');
          setError('Export operation timed out. Please try again.');
          toast.error('Export operation timed out. Please try again.');
          return;
        }

        const interval = exportTypeRef.current === 'digital_register' ? 4000 : pollingInterval;
        console.log(`⏳ Status: ${statusResponse.status}, retrying in ${interval}ms...`);

        // Schedule next poll - use a ref to avoid closure issues
        if (isMountedRef.current) {
          pollingTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              poll(key);
            }
          }, interval);
        }
      } catch (err) {
        if (!isMountedRef.current) return;

        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Poll error:', errorMessage);
        setError(errorMessage);
        setStatus('failed');
        toast.error(`Failed to check export status: ${errorMessage}`);
      }
    },
    [pollingInterval, maxRetries]
  );

  const startExport = useCallback(async (type: ExportType = 'excel') => {
    if (status !== 'idle') {
      console.log('⚠️ Export already in progress');
      toast.error('An export is already in progress');
      return;
    }

    exportTypeRef.current = type;
    setStatus('processing');
    setProgress(30);
    setError(null);
    retriesRef.current = 0;

    try {
      console.log('🚀 Starting export...', type);
      const response = type === 'digital_register'
        ? await assetExportService.startDigitalRegisterExport()
        : await assetExportService.startExport();

      if (!isMountedRef.current) return;

      const key = response.export_key;
      if (!key) {
        throw new Error('No export key received from server');
      }

      console.log('✅ Got key:', key);
      setExportKey(key);
      toast.success('Asset export started, waiting for file generation...');

      // Start polling immediately - use setTimeout to ensure state is updated
      console.log('▶️ Starting polling with setTimeout...');
      setTimeout(() => {
        if (isMountedRef.current) {
          console.log('📍 About to call poll function');
          poll(key);
        }
      }, 100);
    } catch (err) {
      if (!isMountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Start export failed:', errorMessage);
      setError(errorMessage);
      setStatus('failed');
      setProgress(0);
      toast.error(`Failed to start export: ${errorMessage}`);
    }
  }, [status, poll]);

  const downloadExport = useCallback(async () => {
    if (!exportKey) {
      toast.error('No export key available');
      return;
    }

    setStatus('downloading');

    try {
      if (exportTypeRef.current === 'digital_register') {
        // Browser navigation — the server returns the file as an attachment
        assetExportService.downloadDigitalRegisterExport(exportKey);
        toast.success('Download started');
        reset();
      } else {
        await assetExportService.downloadExport(
          exportKey,
          `assets-export-${new Date().toISOString().split('T')[0]}.xlsx`
        );
        if (!isMountedRef.current) return;
        setStatus('idle');
        toast.success('Export downloaded successfully');
        reset();
      }
    } catch (err) {
      if (!isMountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Download failed:', errorMessage);
      setError(errorMessage);
      setStatus('done');
      toast.error(`Failed to download export: ${errorMessage}`);
    }
  }, [exportKey]);

  const cancelExport = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
    setStatus('idle');
    setProgress(0);
    setError(null);
    setExportKey(null);
    retriesRef.current = 0;
    toast.info('Export cancelled');
  }, []);

  const reset = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
    setStatus('idle');
    setProgress(0);
    setError(null);
    setExportKey(null);
    retriesRef.current = 0;
    exportTypeRef.current = 'excel';
  }, []);

  return {
    status,
    progress,
    exportKey,
    error,
    startExport,
    cancelExport,
    downloadExport,
    reset,
  };
};
