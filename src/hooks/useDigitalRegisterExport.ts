import { useState, useCallback, useRef, useEffect } from 'react';
import { assetExportService } from '@/services/assetExportService';
import { toast } from 'sonner';

export type DigitalRegisterStatus = 'idle' | 'processing' | 'done' | 'failed';

interface UseDigitalRegisterExportReturn {
  status: DigitalRegisterStatus;
  error: string | null;
  startExport: () => Promise<void>;
  reset: () => void;
}

export const useDigitalRegisterExport = (): UseDigitalRegisterExportReturn => {
  const [status, setStatus] = useState<DigitalRegisterStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('idle');
    setError(null);
  }, []);

  const startExport = useCallback(async () => {
    if (status !== 'idle') return;

    setStatus('processing');
    setError(null);

    try {
      // Step 1 — get export key
      const data = await assetExportService.startDigitalRegisterExport();
      const export_key = data.export_key;

      if (!export_key) throw new Error('No export key received from server');
      if (!isMountedRef.current) return;

      // Step 2 — poll every 4 seconds
      intervalRef.current = setInterval(async () => {
        if (!isMountedRef.current) {
          clearInterval(intervalRef.current!);
          return;
        }

        try {
          const { status: pollStatus, error: pollError } =
            await assetExportService.checkDigitalRegisterExportStatus(export_key);

          if (pollStatus === 'done') {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            if (!isMountedRef.current) return;
            setStatus('done');
            // Step 3 — download via browser navigation
            assetExportService.downloadDigitalRegisterExport(export_key);
            toast.success('Download started!');
          } else if (pollStatus === 'failed') {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            if (!isMountedRef.current) return;
            const msg = pollError || 'Export failed. Please try again.';
            setStatus('failed');
            setError(msg);
            toast.error(msg);
          }
          // 'processing' → keep polling
        } catch (err) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          if (!isMountedRef.current) return;
          const msg = err instanceof Error ? err.message : 'Unknown error';
          setStatus('failed');
          setError(msg);
          toast.error(`Export status check failed: ${msg}`);
        }
      }, 4000);
    } catch (err) {
      if (!isMountedRef.current) return;
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setStatus('failed');
      setError(msg);
      toast.error(`Failed to start export: ${msg}`);
    }
  }, [status]);

  return { status, error, startExport, reset };
};
