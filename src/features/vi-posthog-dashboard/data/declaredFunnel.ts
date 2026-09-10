import type { ApiDeclaredWorkflow, ViWorkflowUsageResponse } from '../api/adoptionApi';
import type { ViWorkflow } from './workflows';

/**
 * A workflow's funnel, measured against the events the catalogue declares for it.
 *
 * There are three things the endpoint can give us, in descending order of trust, and this
 * picks the best one available:
 *
 *   1. `workflows[]` — the server's own declared-flow block. It reads named flows out of
 *      `config/workflows.yml` and computes each with `windowFunnel(1800)` over that flow's
 *      ordered steps, so the reach is properly SEQUENCED: a user counted at step 3 really did
 *      pass steps 1 and 2. It also reports `instrumented` per step, which separates "nobody
 *      got this far" from "this event is not emitted anywhere in the tenant".
 *   2. `flows[]` — per-event distinct-user counts for the whole app surface. Real numbers, but
 *      NOT sequenced: step 3's users are not known to have passed step 2. Used only until Vi's
 *      flows exist in the YAML above.
 *   3. Nothing — the step list with no numbers, which is what the card showed before.
 *
 * Why not the endpoint's `funnel`? That one is auto-derived from whichever events happen to be
 * busiest in scope, so its steps are a heuristic guess at a journey, not this workflow's
 * declared one — and it can only scope by `$pathname`, which mobile events do not carry.
 *
 * The step names come from the catalogue (`Vi_Dashboard_v1_FM_structure.html` via
 * workflows.ts); every number comes from the API.
 */

export type FunnelSource = 'declared' | 'events' | 'none';

export interface DeclaredFunnelStep {
  /** The catalogue event name. */
  step: string;
  /** Users who reached it, or null before the event list has loaded. */
  users: number | null;
  /** Raw event volume for this step, from the app-wide event list. */
  events: number | null;
  /** Sessions the step was fired in, from the app-wide event list. */
  sessions: number | null;
  /** Share of the funnel's entrants still present, 0..1. */
  ofEntrants: number | null;
  /** Drop from the previous step as a percentage; null on the first step. */
  dropPct: number | null;
  /** No user has reached this step in the window. */
  awaiting: boolean;
  /**
   * The tenant emits this event nowhere at all — a gap in the app's instrumentation, not a
   * drop-off. Only the declared source can tell the two apart; it is false otherwise.
   */
  uninstrumented: boolean;
}

export interface DeclaredFunnel {
  steps: DeclaredFunnelStep[];
  /** Users on the first step — the denominator every later step is read against. */
  entrants: number;
  /** Index of the biggest drop, or null when nothing has fired. */
  worst: number | null;
  /** True when not one declared step has been reached. */
  empty: boolean;
  /** Which of the three sources above produced these numbers. */
  source: FunnelSource;
  /** Completion rate, only available from the declared source. */
  completionPct: number | null;
  /**
   * False when the server flags missing instrumentation on this flow, so a low completion
   * rate may be a measurement gap rather than user behaviour.
   */
  dataComplete: boolean;
}

/** Matches our catalogue entry to the server's declared flow — by key, else by first step. */
function findDeclared(
  workflow: ViWorkflow,
  declared: ApiDeclaredWorkflow[],
): ApiDeclaredWorkflow | undefined {
  const byKey = declared.find((d) => d.key === workflow.key);
  if (byKey) return byKey;
  // Keys are each spec's own; the event names are the shared contract, so fall back to those.
  const first = workflow.steps[0];
  return declared.find((d) => d.steps.some((s) => s.step === first));
}

/** Event volume and session counts per event name, for the screens table. */
type Volumes = Map<string, { events: number; sessions: number }>;

const volumesOf = (wf: ViWorkflowUsageResponse | undefined): Volumes =>
  new Map((wf?.flows ?? []).map((f) => [f.path, { events: f.events, sessions: f.sessions }]));

function fromDeclared(d: ApiDeclaredWorkflow, vol: Volumes): DeclaredFunnel {
  const entrants = d.steps[0]?.reach ?? 0;
  const steps: DeclaredFunnelStep[] = d.steps.map((s) => ({
    step: s.step,
    users: s.reach,
    // The declared block reports sequenced reach only, so volume still comes off the raw
    // event list — a step nobody reached in sequence can still have fired out of order.
    events: vol.get(s.step)?.events ?? 0,
    sessions: vol.get(s.step)?.sessions ?? 0,
    ofEntrants: entrants > 0 ? s.reach / entrants : null,
    dropPct: s.drop_pct,
    awaiting: s.reach === 0,
    uninstrumented: !s.instrumented,
  }));
  return {
    steps,
    entrants,
    worst: worstOf(steps, entrants),
    empty: entrants === 0,
    source: 'declared',
    completionPct: d.completion_pct,
    dataComplete: d.data_complete,
  };
}

function worstOf(steps: DeclaredFunnelStep[], entrants: number): number | null {
  if (entrants <= 0) return null;
  const drops = steps.map((s) => s.dropPct ?? -Infinity);
  const worst = Math.max(...drops);
  return worst > 0 ? drops.indexOf(worst) : null;
}

export function toDeclaredFunnel(
  workflow: ViWorkflow,
  wf: ViWorkflowUsageResponse | undefined,
): DeclaredFunnel {
  const vol = volumesOf(wf);
  const declared = wf?.workflows?.length ? findDeclared(workflow, wf.workflows) : undefined;
  if (declared) return fromDeclared(declared, vol);

  const loaded = wf != null;
  const users = new Map((wf?.flows ?? []).map((f) => [f.path, f.users]));
  const reaches = workflow.steps.map((s) => (loaded ? (users.get(s) ?? 0) : null));
  const entrants = reaches[0] ?? 0;

  const steps: DeclaredFunnelStep[] = workflow.steps.map((step, i) => {
    const now = reaches[i];
    const before = i > 0 ? reaches[i - 1] : null;
    return {
      step,
      users: now,
      events: loaded ? (vol.get(step)?.events ?? 0) : null,
      sessions: loaded ? (vol.get(step)?.sessions ?? 0) : null,
      ofEntrants: now == null || entrants === 0 ? null : now / entrants,
      // A drop needs both ends; the first step has nothing to fall from, and a step after an
      // empty one has no base to express the fall as a share of.
      dropPct:
        now == null || before == null || before === 0 ? null : ((before - now) / before) * 100,
      awaiting: loaded && (now ?? 0) === 0,
      // Only the declared source knows this; an absent event here may simply be unreached.
      uninstrumented: false,
    };
  });

  return {
    steps,
    entrants,
    worst: worstOf(steps, entrants),
    empty: loaded && entrants === 0,
    source: loaded ? 'events' : 'none',
    completionPct: null,
    dataComplete: true,
  };
}
