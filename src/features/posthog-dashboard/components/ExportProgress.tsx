import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ExportPhase } from '../api/exportJob';

/**
 * The loader of a dashboard's Excel download (Recent Activity's download button): the button's icon
 * turns into a spinner and a line under the heading says what is happening and for how long; a failed
 * download says so for a few seconds. Shared by every dashboard page in this app.
 */
export function useExportDownload() {
  const [phase, setPhase] = useState<ExportPhase | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  /** Runs one download (ignored while another is running); the task reports its phases. */
  const run = useCallback(async (task: (onPhase: (phase: ExportPhase) => void) => Promise<void>) => {
    if (busy.current) return;
    busy.current = true;
    setError(null);
    setPhase('starting');
    setStartedAt(Date.now());
    try {
      await task(setPhase);
    } catch (err) {
      console.error('Failed to download user activity export', err);
      setError(err instanceof Error && err.message ? err.message : 'Download failed');
    } finally {
      busy.current = false;
      setPhase(null);
      setStartedAt(null);
    }
  }, []);

  useEffect(() => {
    if (!error) return undefined;
    const timer = window.setTimeout(() => setError(null), 8000);
    return () => window.clearTimeout(timer);
  }, [error]);

  return { busy: phase !== null, phase, startedAt, error, run };
}

/** A small spinning ring, drawn in the text colour (no stylesheet needed). */
export const ExportSpinner: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    viewBox="0 0 20 20"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    data-testid="export-spinner"
  >
    <circle cx="10" cy="10" r="7" opacity="0.25" />
    <path d="M17 10a7 7 0 0 0-7-7" strokeLinecap="round">
      <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="0.8s" repeatCount="indefinite" />
    </path>
  </svg>
);

const PHASE_TEXT: Record<ExportPhase, string> = {
  starting: 'Starting download…',
  preparing: 'Preparing Excel file…',
  downloading: 'Downloading…',
};

/** The line under the heading while a download runs, or after one failed. Nothing otherwise. */
export const ExportStatus: React.FC<{ phase: ExportPhase | null; startedAt: number | null; error: string | null }> = ({
  phase,
  startedAt,
  error,
}) => {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!phase) return undefined;
    const timer = window.setInterval(() => tick((n) => n + 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  if (!phase && !error) return null;
  const seconds = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;
  return (
    <div
      role="status"
      aria-live="polite"
      className="export-status"
      title={error || undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        lineHeight: 1.3,
        margin: '4px 0 6px',
        color: error ? '#b42318' : 'inherit',
        opacity: error ? 1 : 0.75,
      }}
    >
      {phase ? (
        <>
          <ExportSpinner size={12} />
          <span>
            {PHASE_TEXT[phase]}
            {seconds >= 2 ? ` ${seconds}s` : ''}
          </span>
        </>
      ) : (
        <span>Download failed. Please try again.</span>
      )}
    </div>
  );
};
