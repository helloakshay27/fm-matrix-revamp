import type { TileSpec } from '@/features/posthog-dashboard/data/metrics';

/**
 * Vi my Workspace numbers its metrics differently from FM Matrix.
 *
 * Both dashboards render the same tiles from the same shared `metrics.ts` builders, but the
 * Vi Chart Calculation & Instrumentation Reference (§7.0–7.2) assigns its own IDs:
 * Session Duration is U4 here and U5 there, Bounce is U5 here and U6 there, and so on.
 * Rather than fork the shared builders, the FM-numbered `TileSpec`s are relabelled on the
 * way to the view.
 *
 * `infoKey` keeps the ORIGINAL id so the shared INFO dictionary (which is keyed by the FM
 * numbering) still resolves each tile's formula popover.
 */
export interface ViTileSpec extends TileSpec {
  /** Key into the shared INFO dictionary — the FM-numbered id this tile came from. */
  infoKey: string;
}

/** FM id → Vi id, per §7.1 (Layer 1) and §7.2 (Layer 2) of the reference. */
const ID_MAP: Record<string, string> = {
  // Layer 1 — Traffic & Session
  U1: 'U1', // Active Users
  U2: 'U2', // Screen Views
  U3: 'U3', // Sessions
  U5: 'U4', // Session Duration   (FM U5)
  U6: 'U5', // Bounce Rate        (FM U6)
  U8: 'U6', // Recently Online    (FM U8)
  // Layer 2 — Adoption & Engagement
  A1: 'A1', // Seat Utilisation
  A2: 'A2', // Stickiness
  A3: 'A3', // Adoption Trend
  A5: 'A4', // 14-Day Activation  (FM A5)
  A6: 'A5', // Module Breadth     (FM A6)
  // Layer 3 — Workflow packs keep their names in both documents
  'F-adopt': 'F-adopt',
  'F-comp': 'F-comp',
  'F-step': 'F-step',
  'F-vol': 'F-vol',
};

/**
 * KPI targets, keyed by the Vi ids above.
 *
 * Deliberately empty. The shared FM engine seeds suggested targets here (75% seat
 * utilisation, 20% bounce, and so on), but those are invented numbers, and a tile that
 * stamps "✓ on target" on a live metric by comparing it against a hardcoded constant is
 * reporting a verdict nobody set. Every tile therefore starts at "set a target" and only
 * judges against a threshold the viewer has actually entered.
 *
 * Populate this map if the business ever agrees real targets per metric.
 */
export const VI_BM_DEFAULTS: Record<string, number> = {};

/**
 * A1 on this dashboard reports active seats, not a utilisation percentage.
 *
 * The endpoint is explicit that it cannot resolve the denominator itself:
 *
 *   a1: "Seat count (licensed_seats) is billing data, not in events — pass ?licensed_seats=N.
 *        Without it, value is null; used_seats still returns."
 *
 * This dashboard has no seat input and sends no such param, so seat_utilisation.value is null
 * on every response. The shared builder then renders the tile as "—" with a
 * "set licensed seats" hint — an instruction pointing at a control that does not exist here.
 * used_seats is a real number on the same response, so the tile shows that instead: an honest
 * count rather than a permanently empty percentage plus a dead-end prompt.
 *
 * If licensed seats ever become available FROM AN API (not typed in by a viewer), restore the
 * percentage by passing the param in api/adoptionApi.ts and delete this transform.
 */
function asActiveSeats(spec: TileSpec): TileSpec {
  // The shared builder puts "<n> active · set licensed seats" in `sub` when the denominator is
  // missing; that count is the only place used_seats reaches this layer.
  const activeCount = spec.sub?.match(/^([0-9.,KM]+) active/)?.[1];
  if (!activeCount) return spec;
  return {
    ...spec,
    label: 'Active Seats (A1)',
    disp: activeCount,
    sub: 'unique employees active in range',
    unit: undefined,
    // No target comparison: a headcount has no meaningful benchmark the way a percentage does.
    raw: 0,
  };
}

/** Rewrites a tile's id and its `(Un)` / `(An)` label suffix to the Vi numbering. */
function relabel(input: TileSpec): ViTileSpec {
  const spec = input.id === 'A1' ? asActiveSeats(input) : input;
  const viId = ID_MAP[input.id] ?? input.id;
  return {
    ...spec,
    id: viId,
    infoKey: input.id,
    label: spec.label.replace(/\(([UAF][\w-]*)\)$/, `(${viId})`),
  };
}

export const toViTiles = (tiles: TileSpec[]): ViTileSpec[] => tiles.map(relabel);
