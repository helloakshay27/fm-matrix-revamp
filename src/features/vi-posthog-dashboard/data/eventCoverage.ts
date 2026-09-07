import type { ViWorkflowUsageResponse } from '../api/adoptionApi';

/**
 * Instrumentation coverage, derived from the events actually firing — nothing hardcoded.
 *
 * `workflow_usage` returns `flows`: every custom event fired in scope, with its own user,
 * event and session counts. With `scope_mode: 'app'` that is the whole Vi my Workspace event
 * surface for the range, so the module list, the per-module volumes and the reach percentages
 * below are all read off live data rather than a checked-in catalogue.
 *
 * Module grouping is the event name's first segment, the same shape the API itself uses to
 * derive its web module tree from `$pathname` (`tickets_list_viewed` -> `tickets`). A trailing
 * "s" is normalised away so `ticket_list_item_clicked` and `tickets_list_viewed` land on one
 * module instead of two. It is a naming convention, not a registry — an event that does not
 * follow it groups under its own first word, which is still a truthful statement about the
 * events that exist.
 *
 * NOT derived here: which instrumentation generation (modern typed events vs legacy GA
 * events) an event belongs to. The API exposes no generation flag, and the two cannot be told
 * apart by name — the catalogue's modern set is "View / Action / Failure typed", and Action
 * events are `*_clicked`, exactly like the legacy click events. Any suffix rule would
 * misfile them, so this reports reach per module and leaves the split to the caveat text.
 */

export interface ModuleCoverageRow {
  /** Module name, derived from the event-name prefix. */
  module: string;
  /** Distinct users on the module's single most-reaching event. */
  users: number;
  /** Share of active users that event reached — 0..1, null when active users is unknown. */
  reach: number | null;
  /** How many distinct events this module fires. */
  events: number;
  /** Total event volume across them. */
  volume: number;
}

export interface EventCoverage {
  rows: ModuleCoverageRow[];
  moduleCount: number;
  eventCount: number;
  volume: number;
  /** The reach denominator, straight from traffic_session. */
  activeUsers: number | null;
}

const EMPTY: EventCoverage = {
  rows: [],
  moduleCount: 0,
  eventCount: 0,
  volume: 0,
  activeUsers: null,
};

/** The event name's first segment — 'tickets_list_viewed' -> 'tickets'. */
const headOf = (event: string) => event.split('_')[0] || event;

/**
 * Grouping key: the head with any trailing "s" removed, so `ticket_list_item_clicked` and
 * `tickets_list_viewed` are one module. Only the key is de-pluralised — the label keeps
 * whichever spelling the events themselves use most, rather than inventing "Tickets" or
 * "Msafes" from a rule.
 */
const keyOf = (event: string) => headOf(event).replace(/s$/, '');

/** 'tickets' -> 'Tickets'. */
const titleCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

export function toEventCoverage(
  wf: ViWorkflowUsageResponse | undefined,
  activeUsers: number | null,
): EventCoverage {
  const flows = wf?.flows ?? [];
  if (flows.length === 0) return { ...EMPTY, activeUsers };

  type Acc = { users: number; events: number; volume: number; heads: Map<string, number> };
  const byModule = new Map<string, Acc>();
  for (const f of flows) {
    const key = keyOf(f.path);
    const acc = byModule.get(key) ?? { users: 0, events: 0, volume: 0, heads: new Map() };
    // Per-event user counts cannot be unioned — the API returns no overlap between them — so
    // the module's reach is its best single event: "at least this many users got here".
    acc.users = Math.max(acc.users, f.users);
    acc.events += 1;
    acc.volume += f.events;
    const head = headOf(f.path);
    acc.heads.set(head, (acc.heads.get(head) ?? 0) + 1);
    byModule.set(key, acc);
  }

  const rows: ModuleCoverageRow[] = [...byModule.entries()]
    .map(([key, a]) => ({
      module: titleCase([...a.heads.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] ?? key),
      users: a.users,
      reach: activeUsers ? a.users / activeUsers : null,
      events: a.events,
      volume: a.volume,
    }))
    .sort((x, y) => y.users - x.users || y.volume - x.volume);

  return {
    rows,
    moduleCount: rows.length,
    eventCount: flows.length,
    volume: flows.reduce((n, f) => n + f.events, 0),
    activeUsers,
  };
}
