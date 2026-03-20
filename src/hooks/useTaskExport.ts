import { useState, useCallback, useRef, useEffect } from 'react';
import { taskExportService } from '@/services/taskExportService';
import { toast } from 'sonner';

export type ExportStatus = 'idle' | 'processing' | 'done' | 'failed' | 'downloading';

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

interface UseTaskExportReturn {
  status: ExportStatus;
  progress: number;
  exportId: string | null;
  error: string | null;
  startExport: (filters?: ExportFilters) => Promise<void>;
  cancelExport: () => void;
  downloadExport: () => Promise<void>;
  reset: () => void;
}

export const useTaskExport = (
  pollingInterval: number = 2000,
  maxRetries: number = 300
): UseTaskExportReturn => {
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [exportId, setExportId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollingTimeoutRef = useRef<NodeJS.Timeout>();
  const retriesRef = useRef(0);
  const isMountedRef = useRef(true);

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
    async (id: string) => {
      if (!isMountedRef.current) {
        console.log('🛑 Component unmounted, stop polling');
        return;
      }

      try {
        console.log(`📊 Task poll attempt ${retriesRef.current + 1} for id:`, id);
        const statusResponse = await taskExportService.checkExportStatus(id);

        if (!isMountedRef.current) return;

        console.log('📋 Task status received:', statusResponse.status);

        // Update progress
        if (retriesRef.current < maxRetries) {
          const estimatedProgress = Math.min(
            90,
            30 + (retriesRef.current / maxRetries) * 60
          );
          setProgress(estimatedProgress);
        }

        // Check if done (status is "completed" for tasks)
        if (statusResponse.status === 'completed' || statusResponse.isFile) {
          console.log('✅ Task export ready!');
          setProgress(100);
          setStatus('done');
          toast.success('Task export is ready for download');
          return;
        }

        // Check if failed
        if (statusResponse.status === 'failed') {
          console.error('❌ Task export failed');
          setStatus('failed');
          setError('Export failed. Please try again.');
          toast.error('Export failed. Please try again.');
          return;
        }

        // Still processing
        retriesRef.current += 1;

        if (retriesRef.current >= maxRetries) {
          console.error('❌ Task export max retries');
          setStatus('failed');
          setError('Export operation timed out. Please try again.');
          toast.error('Export operation timed out. Please try again.');
          return;
        }

        console.log(`⏳ Status: ${statusResponse.status}, retrying in ${pollingInterval}ms...`);

        // Schedule next poll - use a ref to avoid closure issues
        if (isMountedRef.current) {
          pollingTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              poll(id);
            }
          }, pollingInterval);
        }
      } catch (err) {
        if (!isMountedRef.current) return;

        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Task poll error:', errorMessage);
        setError(errorMessage);
        setStatus('failed');
        toast.error(`Failed to check export status: ${errorMessage}`);
      }
    },
    [pollingInterval, maxRetries]
  );

  const startExport = useCallback(async (filters?: ExportFilters) => {
    if (status !== 'idle') {
      console.log('⚠️ Task export already in progress');
      toast.error('An export is already in progress');
      return;
    }

    setStatus('processing');
    setProgress(30);
    setError(null);
    retriesRef.current = 0;

    try {
      console.log('🚀 Starting task export with filters:', filters);
      const response = await taskExportService.startExport(filters);

      if (!isMountedRef.current) return;

      const id = response.export_id;
      if (!id) {
        throw new Error('No export ID received from server');
      }

      console.log('✅ Got export id:', id);
      setExportId(id);
      toast.success('Task export started, waiting for file generation...');

      // Start polling immediately - use setTimeout to ensure state is updated
      console.log('▶️ Starting task export polling with setTimeout...');
      setTimeout(() => {
        if (isMountedRef.current) {
          console.log('📍 About to call task poll function');
          poll(id);
        }
      }, 100);
    } catch (err) {
      if (!isMountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Start task export failed:', errorMessage);
      setError(errorMessage);
      setStatus('failed');
      setProgress(0);
      toast.error(`Failed to start export: ${errorMessage}`);
    }
  }, [status, poll]);

  const downloadExport = useCallback(async () => {
    if (!exportId) {
      toast.error('No export ID available');
      return;
    }

    setStatus('downloading');

    try {
      await taskExportService.downloadExport(
        exportId,
        `tasks-export-${new Date().toISOString().split('T')[0]}.xlsx`
      );

      if (!isMountedRef.current) return;

      setStatus('idle');
      toast.success('Export downloaded successfully');
      reset();
    } catch (err) {
      if (!isMountedRef.current) return;

      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setStatus('done');
      toast.error(`Failed to download export: ${errorMessage}`);
    }
  }, [exportId]);

  const cancelExport = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }
    setStatus('idle');
    setProgress(0);
    setError(null);
    setExportId(null);
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
    setExportId(null);
    retriesRef.current = 0;
  }, []);

  return {
    status,
    progress,
    exportId,
    error,
    startExport,
    cancelExport,
    downloadExport,
    reset,
  };
};
