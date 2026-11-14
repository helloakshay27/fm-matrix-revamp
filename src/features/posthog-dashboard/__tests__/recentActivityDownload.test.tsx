// @vitest-environment jsdom
// The Recent Activity download button of FM, Panchshil Pulse (and the other pages using this sidebar):
// while the server makes the file it shows a spinner and says what is happening; a failed download says so.
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

const download = vi.hoisted(() => ({ fn: vi.fn() }));
vi.mock('../api/queries', () => ({
  useRecentActiveUsers: () => ({ data: { users: [] }, isLoading: false, error: null }),
}));
vi.mock('../api/adoptionApi', () => ({
  activityUserLabel: () => 'someone',
  downloadRecentActiveUsers: (...args: unknown[]) => download.fn(...args),
}));

import { RecentActivitySidebar } from '../components/RecentActivitySidebar';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const filters = { enabled: true, allowEmptySites: true, siteIds: [], api: '/commercial/pulse/adoption' } as never;
let root: Root | null = null;
let host: HTMLDivElement | null = null;

function mount() {
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  act(() => root!.render(<RecentActivitySidebar filters={filters} filtersSettled />));
  return host;
}
const button = () => host!.querySelector<HTMLButtonElement>('button[aria-label="Download recent activity"]')!;
const status = () => host!.querySelector('[role="status"]');

afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  download.fn.mockReset();
  vi.restoreAllMocks();
});

describe('Recent Activity download', () => {
  it('shows a loader while the file is made, then saves it', async () => {
    const createObjectURL = vi.fn(() => 'blob:x');
    Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    let finish!: (b: Blob) => void;
    download.fn.mockImplementation((_f: unknown, onPhase: (p: string) => void) => new Promise<Blob>((resolve) => {
      onPhase('preparing');
      finish = resolve;
    }));
    mount();
    await act(async () => { button().click(); });

    expect(download.fn).toHaveBeenCalledWith(filters, expect.any(Function));
    expect(status()?.textContent).toContain('Preparing Excel file…');
    expect(button().disabled).toBe(true);
    expect(button().getAttribute('aria-busy')).toBe('true');
    expect(host!.querySelectorAll('[data-testid="export-spinner"]').length).toBeGreaterThan(0);

    await act(async () => { finish(new Blob(['x'])); });
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(status()).toBeNull();
    expect(host!.querySelector('[data-testid="export-spinner"]')).toBeNull();
    expect(button().disabled).toBe(false);
  });

  it('says when a download failed', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    download.fn.mockRejectedValue(new Error('Export failed: The server is busy'));
    mount();
    await act(async () => { button().click(); });
    expect(status()?.textContent).toContain('Download failed');
    expect(status()?.getAttribute('title')).toContain('The server is busy');
  });
});
