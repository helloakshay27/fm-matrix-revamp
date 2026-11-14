// The background Excel download (api/exportJob.ts): start the job, poll it, fetch the file, and the
// fallbacks (a server that sends the file at once, errors, a job that never ends).
import { describe, expect, it } from 'vitest';
import { filenameFrom, runExportJob, type ExportGet, type ExportPhase, type ExportResponse } from '../api/exportJob';

const json = (status: number, body: unknown): ExportResponse => ({
  status,
  contentType: 'application/json; charset=utf-8',
  json: async () => body,
  blob: async () => new Blob([JSON.stringify(body)]),
});
const xlsx = (bytes: string, disposition?: string): ExportResponse => ({
  status: 200,
  contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  disposition,
  json: async () => { throw new Error('not JSON'); },
  blob: async () => new Blob([bytes]),
});

/** A fake server: answers each URL from the list in turn and records what was asked. */
function server(answers: Array<[RegExp, ExportResponse]>) {
  const asked: string[] = [];
  const get: ExportGet = async (url) => {
    asked.push(url);
    const i = answers.findIndex(([re]) => re.test(url));
    if (i < 0) throw new Error(`unexpected ${url}`);
    return answers.splice(i, 1)[0][1];
  };
  return { asked, get };
}

const BASE = 'https://api.test/commercial/lease/adoption';
const EXPORT = `${BASE}/active_users_export?from=2026-10-16&to=2026-11-14`;

describe('runExportJob', () => {
  it('starts the job, polls until it is done and fetches the file', async () => {
    const { asked, get } = server([
      [/active_users_export/, json(202, { job_id: 'abc', status: 'queued' })],
      [/export_status/, json(200, { job_id: 'abc', status: 'running' })],
      [/export_status/, json(200, { job_id: 'abc', status: 'done', filename: 'active_users_2026-10-16_to_2026-11-14.xlsx' })],
      [/export_download/, xlsx('FILE')],
    ]);
    const phases: ExportPhase[] = [];
    const { blob, filename } = await runExportJob({ exportUrl: EXPORT, adoptionUrl: `${BASE}/`, get, onPhase: (p) => phases.push(p), pollMs: 0 });
    expect(asked).toEqual([
      `${EXPORT}&background=1`,
      `${BASE}/export_status?job_id=abc`,
      `${BASE}/export_status?job_id=abc`,
      `${BASE}/export_download?job_id=abc`,
    ]);
    expect(await blob.text()).toBe('FILE');
    expect(filename).toBe('active_users_2026-10-16_to_2026-11-14.xlsx');
    expect(phases).toEqual(['starting', 'preparing', 'downloading']);
  });

  it('uses the file as it is when the server sends it at once (no background downloads there)', async () => {
    const { asked, get } = server([[/active_users_export/, xlsx('OLD', 'attachment; filename="active_users_x.xlsx"')]]);
    const { blob, filename } = await runExportJob({ exportUrl: `${BASE}/active_users_export`, adoptionUrl: BASE, get, pollMs: 0 });
    expect(asked).toEqual([`${BASE}/active_users_export?background=1`]);
    expect(await blob.text()).toBe('OLD');
    expect(filename).toBe('active_users_x.xlsx');
  });

  it('reports a job that failed on the server with its reason', async () => {
    const { get } = server([
      [/active_users_export/, json(202, { job_id: 'abc', status: 'queued' })],
      [/export_status/, json(200, { job_id: 'abc', status: 'failed', error: 'The server is busy' })],
    ]);
    await expect(runExportJob({ exportUrl: EXPORT, adoptionUrl: BASE, get, pollMs: 0 })).rejects.toThrow('The server is busy');
  });

  it('reports a refused download (a 422 with a message) and an expired job (404)', async () => {
    const refused = server([[/active_users_export/, json(422, { error: 'ArgumentError', message: 'site_id is required' })]]);
    await expect(runExportJob({ exportUrl: EXPORT, adoptionUrl: BASE, get: refused.get, pollMs: 0 })).rejects.toThrow(/422.*site_id is required/);
    const expired = server([
      [/active_users_export/, json(202, { job_id: 'abc', status: 'queued' })],
      [/export_status/, json(404, { error: 'NotFound', message: 'No such export' })],
    ]);
    await expect(runExportJob({ exportUrl: EXPORT, adoptionUrl: BASE, get: expired.get, pollMs: 0 })).rejects.toThrow(/404/);
  });

  it('gives up on a job that never finishes', async () => {
    const get: ExportGet = async (url) =>
      url.includes('active_users_export') ? json(202, { job_id: 'abc', status: 'queued' }) : json(200, { job_id: 'abc', status: 'running' });
    await expect(runExportJob({ exportUrl: EXPORT, adoptionUrl: BASE, get, pollMs: 1, maxWaitMs: 20 })).rejects.toThrow(/taking too long/);
  });

  it('reads the file name from Content-Disposition', () => {
    expect(filenameFrom('attachment; filename="a b.xlsx"; filename*=UTF-8\'\'a%20b.xlsx')).toBe('a b.xlsx');
    expect(filenameFrom("attachment; filename*=UTF-8''r%C3%A9sum%C3%A9.xlsx")).toBe('résumé.xlsx');
    expect(filenameFrom(null)).toBeNull();
  });
});
