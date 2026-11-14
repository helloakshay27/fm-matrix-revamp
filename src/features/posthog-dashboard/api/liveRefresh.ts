/**
 * Keeps a dashboard's cards live: how often a card asks the usage-analytics API again while the page is
 * on screen (TanStack Query `refetchInterval`, which pauses by itself while the tab is hidden).
 *
 * The API answers at once from its store. When an answer for a range that includes today is older than
 * about a minute, it works the numbers out again in the background and says so (meta.cache.refreshing):
 * the card then asks again after a few seconds and shows the new numbers. Otherwise it asks once a
 * minute. A range that has ended (meta.cache.live === false) does not change, so it is not asked again,
 * and neither is anything that is not a usage-analytics answer (sites lists, other APIs: no meta.metric).
 */
export const LIVE_POLL_MS = 60_000;
export const REFRESHING_POLL_MS = 5_000;

interface AnswerMeta {
  metric?: string;
  cache?: { live?: boolean; refreshing?: boolean };
}

// The parameter is deliberately loose (any): a typed one would take part in TanStack Query's inference
// of each query's data type and turn it into `unknown` where queryFn takes ({ signal }).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function liveRefetchInterval(query: { state: { data?: any } }): number | false {
  const meta = (query.state.data as { meta?: AnswerMeta } | null | undefined)?.meta;
  if (!meta || typeof meta !== 'object' || !meta.metric) return false;
  if (meta.cache?.refreshing) return REFRESHING_POLL_MS;
  if (meta.cache?.live === false) return false;
  return LIVE_POLL_MS;
}
