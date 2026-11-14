// How often a card asks the API again while the page is on screen (api/liveRefresh.ts).
import { describe, expect, it } from 'vitest';
import { LIVE_POLL_MS, REFRESHING_POLL_MS, liveRefetchInterval } from '../api/liveRefresh';

const q = (data: unknown) => ({ state: { data } });

describe('liveRefetchInterval', () => {
  it('asks again after a few seconds while the server works out newer numbers', () => {
    expect(liveRefetchInterval(q({ meta: { metric: 'traffic_session', cache: { live: true, refreshing: true } } }))).toBe(REFRESHING_POLL_MS);
  });
  it('asks again once a minute for a live range', () => {
    expect(liveRefetchInterval(q({ meta: { metric: 'traffic_session', cache: { live: true, refreshing: false } } }))).toBe(LIVE_POLL_MS);
    expect(liveRefetchInterval(q({ meta: { metric: 'traffic_session' } }))).toBe(LIVE_POLL_MS); // just worked out
  });
  it('does not ask again for a range that has ended, or for anything that is not a usage-analytics answer', () => {
    expect(liveRefetchInterval(q({ meta: { metric: 'growth', cache: { live: false, refreshing: false } } }))).toBe(false);
    expect(liveRefetchInterval(q({ sites: [{ id: 1 }] }))).toBe(false);
    expect(liveRefetchInterval(q({ meta: { page: 1 } }))).toBe(false);
    expect(liveRefetchInterval(q(undefined))).toBe(false);
    expect(liveRefetchInterval(q(null))).toBe(false);
  });
});
