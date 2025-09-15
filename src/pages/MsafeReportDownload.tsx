import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';

const MsafeReportDownload = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const pollCountRef = useRef(0);

  const clearPoll = () => {
    if (pollTimerRef.current) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearPoll();
  }, []);

  const getBaseUrl = () => {
    const fromLS = localStorage.getItem('baseUrl');
    return fromLS ? `https://${fromLS}` : 'https://fm-uat-api.lockated.com';
  };

  const fetchStatusOnce = async (): Promise<{ state?: string; status?: string; url?: string; download_url?: string; message?: string } | null> => {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('selectedCompanyId');
    const baseUrl = getBaseUrl();

    if (!token || !companyId) {
      setStatus('error');
      setMessage(!token ? 'Missing auth token in localStorage.' : 'Missing selectedCompanyId in localStorage.');
      return null;
    }

    // Use dedicated status endpoint to check current/previous export status
    const url = `${baseUrl}/krcc_forms/krcc_export_status?company_id=${encodeURIComponent(companyId)}`;
    try {
      const resp = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) {
        // If there's no existing export/status yet, this may return non-200; treat as no data
        return null;
      }
      const data = await resp.json().catch(() => ({}));
      return data as any;
    } catch (e) {
      return { status: 'error', message: e instanceof Error ? e.message : 'Network error' } as any;
    }
  };

  // Start a 5-minute polling loop against the export_status endpoint
  const beginPolling = () => {
    clearPoll();
    pollTimerRef.current = window.setInterval(async () => {
      const baseUrl = getBaseUrl();
      pollCountRef.current += 1;
      const data = await fetchStatusOnce();
      const state = (data?.state || data?.status || '').toString().toLowerCase();
      const dl = data?.url || data?.download_url;

      if (state === 'completed') {
        clearPoll();
        setStatus('completed');
        setMessage('Report is ready to download.');
        if (dl) setDownloadUrl((dl as string).startsWith('http') ? (dl as string) : `${baseUrl}${dl}`);
      } else if (state === 'error' || state === 'failed') {
        clearPoll();
        setStatus('error');
        setMessage((data as any)?.message || 'Export failed. Please try again.');
      } else if (state === 'processing' || state === 'in_progress' || state === 'queued') {
        setStatus('processing');
        setMessage('Generating report. We will check again in about 5 minutes...');
      } else {
        // Treat unknown or not_started as idle so button stays enabled
        clearPoll();
        setStatus('idle');
        setMessage((data as any)?.message || 'No report generation found for today.');
      }

      // Safety timeout ~30 minutes (6 polls x 5m)
      if (pollCountRef.current >= 6) {
        clearPoll();
        setStatus('error');
        setMessage('Request timed out. Please try again later.');
      }
    }, 300000);
  };

  // On first load, try to show any existing export status/download from the status endpoint
  useEffect(() => {
    (async () => {
      const data = await fetchStatusOnce();
      if (!data) return;
      const baseUrl = getBaseUrl();
      const state = (data?.state || data?.status || '').toString().toLowerCase();
      const dl = (data as any)?.url || (data as any)?.download_url;

      if (state === 'completed') {
        setStatus('completed');
        setMessage('Latest report is ready to download.');
        if (dl) setDownloadUrl((dl as string).startsWith('http') ? (dl as string) : `${baseUrl}${dl}`);
      } else if (state === 'processing' || state === 'in_progress' || state === 'queued') {
        setStatus('processing');
        setMessage('An export is already in progress. We will check again in about 5 minutes.');
        pollCountRef.current = 0;
        beginPolling();
      } else if (state === 'not_started' || state === '') {
        // No export yet today; keep button enabled and show message
        setStatus('idle');
        setMessage((data as any)?.message || 'No report generation found for today.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startExport = useCallback(async () => {
    // Do not trigger if an export is already in progress
    if (status === 'processing') {
      return;
    }
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('selectedCompanyId');
    const baseUrl = getBaseUrl();

    if (!token || !companyId) {
      setIsModalOpen(true);
      setStatus('error');
      setMessage(!token ? 'Missing auth token in localStorage.' : 'Missing selectedCompanyId in localStorage.');
      return;
    }

    // Pre-check the status endpoint to avoid starting if already processing or already completed
    const pre = await fetchStatusOnce();
    const preState = (pre?.state || pre?.status || '').toString().toLowerCase();
    const preUrl = pre?.url || pre?.download_url;
    if (preState === 'processing' || preState === 'in_progress' || preState === 'queued') {
      setStatus('processing');
      setMessage('An export is already in progress. We will check again in about 5 minutes.');
      pollCountRef.current = 0;
      beginPolling();
      return;
    }
    if (preState === 'completed' && preUrl) {
      setStatus('completed');
      setMessage('Latest report is ready to download.');
      setDownloadUrl((preUrl as string).startsWith('http') ? (preUrl as string) : `${baseUrl}${preUrl}`);
      return;
    }

    setIsModalOpen(true);
    setStatus('processing');
    setMessage('Preparing your report...');
    setDownloadUrl(null);
    pollCountRef.current = 0;

    const startUrl = `${baseUrl}/krcc_forms/krcc_export?company_id=${encodeURIComponent(companyId)}`;
    try {
      // Start export (GET)
      const resp = await fetch(startUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const json: any = await resp.json().catch(() => ({}));
      const initialState = (json?.state || json?.status || '').toString().toLowerCase();
      const maybeUrl = json?.url || json?.download_url;

      if (maybeUrl && initialState === 'completed') {
        setStatus('completed');
        setMessage('Report is ready to download.');
        setDownloadUrl(maybeUrl.startsWith('http') ? maybeUrl : `${baseUrl}${maybeUrl}`);
        return;
      }

      // Begin polling against the status endpoint until completed
      beginPolling();
    } catch (error: any) {
      clearPoll();
      setStatus('error');
      setMessage(error?.message || 'Unexpected error while starting export.');
    }
  }, []);

  const handleClose = () => {
    if (status === 'processing') return; // Block closing while processing
    clearPoll();
    setIsModalOpen(false);
    setStatus('idle');
    setMessage('');
    setDownloadUrl(null);
  };

  return (
    <div className="relative p-6 sm:p-8">
      <div className="max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
         Msafe User Report Download
        </h1>
        <p className="text-gray-600 mb-6">
          Generate and download the latest Msafe User report for your records.
        </p>

        {/* Current status from export_status API */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-gray-600">Current export status</p>
              <p className="text-base font-medium text-gray-900 capitalize">
                {status === 'idle' ? 'No recent export found' : status}
              </p>
              {message && (
                <p className="mt-1 text-sm text-gray-600">{message}</p>
              )}
            </div>
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-[#F2EEE9] px-3 py-2 text-sm font-medium text-[#BF213E]"
              >
                Click to Download
              </a>
            )}
          </div>
        </div>

        <Button onClick={startExport} disabled={status === 'processing' || status === 'completed'} className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed">
          <FileText className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          {/* Overlay with blur */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal content */}
          <div className="relative z-10 w-[90%] max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              {status === 'processing' ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : status === 'completed' ? (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
              ) : (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600">!</span>
              )}
              <h2 className="text-lg font-semibold">MSafe Report Export</h2>
            </div>

            <p className="mt-3 text-sm text-gray-700">
              {message || (status === 'processing' ? 'Generating report, please wait...' : '')}
            </p>

            {status === 'completed' && downloadUrl && (
              <div className="mt-4">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Open Download
                </a>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              {status !== 'processing' ? (
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
              ) : (
                <Button variant="secondary" disabled>
                  Processing...
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MsafeReportDownload;