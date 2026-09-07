import type { TileSpec } from '@/features/posthog-dashboard/data/metrics';

/**
 * The Calendar dashboard labels its metrics in the wireframe's words, not FM Matrix's.
 *
 * Both dashboards render the same tiles from the same shared `metrics.ts` builders, so rather
 * than fork those builders the FM-numbered `TileSpec`s are relabelled on the way to the view —
 * the same approach `vi-posthog-dashboard/data/viMetricIds.ts` takes.
 *
 * `infoKey` keeps the ORIGINAL FM id, because the Calendar `i` popovers are keyed by the
 * wireframe's own KPI_INFO labels while the shared INFO dictionary is keyed by FM ids.
 */
export interface CalendarTileSpec extends TileSpec {
  /** The FM-numbered id this tile came from. */
  infoKey: string;
  /** Label the wireframe's KPI_INFO dictionary is keyed by, for the `i` popover. */
  infoLabel: string;
}

/**
 * FM id → the label the Calendar wireframe uses, and the KPI_INFO key behind its `i` popover.
 *
 * Where the wireframe's label and the shared builder's metric mean the same thing the label
 * is simply restated; where they differ the entry says so in a comment. Anything not listed
 * keeps the shared builder's own label.
 */
const LABELS: Record<string, { label: string; info: string }> = {
  // ── Layer 1 · Traffic & Session ─────────────────────────────────────────
  U1: { label: 'Active Users', info: 'Active Users' },
  U2: { label: 'Screen Views', info: 'Screen Views' },
  U3: { label: 'Sessions', info: 'Total Sessions' },
  U5: { label: 'Session Duration', info: 'Average Session Duration' },
  U6: { label: 'Bounce Rate', info: 'Bounce Rate' },
  U8: { label: 'Recently Online', info: 'Recently Online' },

  // ── Layer 2 · Adoption & Engagement ─────────────────────────────────────
  // A1 reports active accounts, not a percentage — see asActiveAccounts below.
  A1: { label: 'Account Utilisation', info: 'Feature Adoption Rate' },
  A2: { label: 'Stickiness', info: 'Average Sessions per User' },
  A3: { label: 'Adoption Trend', info: 'Feature Usage Frequency' },
  A5: { label: '14-Day Activation', info: 'Day 7 Retention' },
  A6: { label: 'Module Breadth', info: 'Module Breadth' },

  // ── Layer 3 · Workflow Usage ────────────────────────────────────────────
  'F-adopt': { label: 'Workflow Adoption', info: 'Workflow Adoption' },
  'F-comp': { label: 'Completion Rate', info: 'Workflow Completion Rate' },
  'F-step': { label: 'Biggest Step Drop', info: 'Drop-off Rate' },
  'F-vol': { label: 'Usage Volume', info: 'Successful Completions' },
};

/**
 * A1 reports active accounts, not a utilisation percentage.
 *
 * The endpoint is explicit that it cannot resolve the denominator itself:
 *
 *   a1: "Seat count (licensed_seats) is billing data, not in events — pass ?licensed_seats=N.
 *        Without it, value is null; used_seats still returns."
 *
 * This dashboard sends no such param — the wireframe's 9,200 "registered accounts" ceiling was
 * an invented figure and has been deleted rather than shipped as a live denominator. The
 * shared builder then renders the tile as "—" with a "set licensed seats" hint, which points
 * at a control that does not exist here. `used_seats` is a real number on the same response,
 * so the tile shows that instead: an honest count rather than a permanently empty percentage.
 */
function asActiveAccounts(spec: TileSpec): TileSpec {
  // The shared builder puts "<n> active · set licensed seats" in `sub` when the denominator is
  // missing; that count is the only place used_seats reaches this layer.
  const activeCount = spec.sub?.match(/^([0-9.,KM]+) active/)?.[1];
  if (!activeCount) return spec;
  return {
    ...spec,
    disp: activeCount,
    sub: 'accounts active in range',
    unit: undefined,
    // No target comparison: a headcount has no meaningful benchmark the way a percentage does.
    raw: 0,
  };
}

function relabel(input: TileSpec): CalendarTileSpec {
  const spec = input.id === 'A1' ? asActiveAccounts(input) : input;
  const mapped = LABELS[input.id];
  return {
    ...spec,
    infoKey: input.id,
    infoLabel: mapped?.info ?? spec.label,
    // Drop the shared builder's "(U1)"-style id suffix — the wireframe does not number tiles.
    label: mapped?.label ?? spec.label.replace(/\s*\(([UAF][\w-]*)\)$/, ''),
  };
}

export const toCalendarTiles = (tiles: TileSpec[]): CalendarTileSpec[] => tiles.map(relabel);
