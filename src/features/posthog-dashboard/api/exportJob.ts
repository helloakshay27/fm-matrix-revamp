/**
 * Excel downloads of a dashboard's activity, made in the background on the server.
 *
 *   1. GET <adoption>/active_users_export?<filters>&background=1  -> 202 { job_id, status }
 *   2. GET <adoption>/export_status?job_id=…  every second or two  -> status queued | running | done | failed
 *   3. GET <adoption>/export_download?job_id=…                      -> the .xlsx
 *
 * So no request waits for the file (a month of a large app is 300,000 rows), and the page can show what
 * is happening. A server without background downloads answers step 1 with the file itself, which is used
 * as it is.
 */

import type { AxiosInstance } from 'axios';

/** What the download is doing, for the loader next to the button. */
export type ExportPhase = 'starting' | 'preparing' | 'downloading';

/** One GET, never throwing on an HTTP error status: the caller's own client (fetch or axios). */
export interface ExportResponse {
  status: number;
  contentType: string;
  /** Content-Disposition, when the browser may read it. */
  disposition?: string | null;
  json(): Promise<any>;
  blob(): Promise<Blob>;
}
export type ExportGet = (url: string) => Promise<ExportResponse>;

export interface ExportJobOptions {
  /** The download URL with the dashboard's filters: <adoption>/active_users_export?… */
  exportUrl: string;
  /** The same URL up to and including /adoption, for export_status and export_download. */
  adoptionUrl: string;
  get: ExportGet;
  onPhase?: (phase: ExportPhase) => void;
  pollMs?: number;
  maxWaitMs?: number;
}

export interface ExportJobResult {
  blob: Blob;
  /** The server's file name (active_users_<from>_to_<to>.xlsx); null when it gave none. */
  filename: string | null;
}

interface ExportJob {
  job_id: string;
  status: 'queued' | 'running' | 'done' | 'failed';
  filename?: string | null;
  error?: string | null;
}

/** The file name in a Content-Disposition header, if any. */
export function filenameFrom(disposition: string | null | undefined): string | null {
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition || '');
  return match ? decodeURIComponent(match[1].trim()) : null;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const isJson = (contentType: string) => contentType.toLowerCase().includes('json');

async function failure(res: ExportResponse, what: string): Promise<Error> {
  let detail = '';
  if (isJson(res.contentType)) {
    try {
      const body = await res.json();
      detail = body?.message || body?.error || '';
    } catch {
      /* not JSON after all */
    }
  }
  return new Error(`${what} failed (${res.status})${detail ? `: ${detail}` : ''}`);
}

export async function runExportJob({
  exportUrl,
  adoptionUrl,
  get,
  onPhase,
  pollMs = 1500,
  maxWaitMs = 20 * 60_000,
}: ExportJobOptions): Promise<ExportJobResult> {
  onPhase?.('starting');
  const first = await get(`${exportUrl}${exportUrl.includes('?') ? '&' : '?'}background=1`);
  if (first.status >= 400) throw await failure(first, 'Export');
  if (!isJson(first.contentType)) return { blob: await first.blob(), filename: filenameFrom(first.disposition) };

  let job: ExportJob = await first.json();
  if (!job?.job_id) throw new Error('Export failed: the server did not start a download');
  const base = adoptionUrl.replace(/\/+$/, '');
  const id = encodeURIComponent(job.job_id);
  const started = Date.now();
  onPhase?.('preparing');
  while (job.status === 'queued' || job.status === 'running') {
    if (Date.now() - started > maxWaitMs) throw new Error('Export failed: the file is taking too long. Please try again.');
    await sleep(pollMs);
    const res = await get(`${base}/export_status?job_id=${id}`);
    if (res.status >= 400) throw await failure(res, 'Export');
    job = await res.json();
  }
  if (job.status !== 'done') throw new Error(`Export failed: ${job.error || 'please try again'}`);

  onPhase?.('downloading');
  const file = await get(`${base}/export_download?job_id=${id}`);
  if (file.status >= 400) throw await failure(file, 'Download');
  return { blob: await file.blob(), filename: job.filename || null };
}

/** An ExportGet on fetch, with the request options the dashboard's other calls use. */
export const fetchGet =
  (init: RequestInit = {}): ExportGet =>
  async (url) => {
    const res = await fetch(url, { cache: 'no-store', ...init });
    return {
      status: res.status,
      contentType: res.headers.get('content-type') || '',
      disposition: res.headers.get('content-disposition'),
      json: () => res.json(),
      blob: () => res.blob(),
    };
  };

/** An ExportGet on a dashboard's axios client (its base URL and sign-in header), whatever the status. */
export const axiosGet =
  (client: AxiosInstance): ExportGet =>
  async (url) => {
    const res = await client.get(url, { responseType: 'blob', validateStatus: () => true, timeout: 5 * 60_000 });
    const blob: Blob = res.data instanceof Blob ? res.data : new Blob([res.data ?? '']);
    const header = (name: string) => (res.headers?.[name] == null ? null : String(res.headers[name]));
    return {
      status: res.status,
      contentType: header('content-type') || '',
      disposition: header('content-disposition'),
      json: async () => JSON.parse(await blob.text()),
      blob: async () => blob,
    };
  };
