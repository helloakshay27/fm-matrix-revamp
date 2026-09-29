import type {
  WorkflowFunnelStep,
  WorkflowUsageResponse,
} from "../../posthog-dashboard/api/adoptionApi";

/* ---------------------------------------------------------------------------
 * Pulse-only Layer 3 fallback for `workflow_usage`.
 *
 * The shared top-level KPIs come back null and `funnel` empty for Pulse
 * (module=pulse, sub_module=traffic-session), while the response does carry a
 * per-workflow `workflows[]` block with the same four measures. This adapter
 * promotes the one relevant `panchshil_pulse` record into the top-level shape
 * the shared `buildFlows` already understands — the same fallback the Calendar
 * tenant applies at `CalendarDashboardContext.tsx` when `wf.funnel` is empty.
 *
 * Deliberately additive: with no matching record the original response object is
 * returned untouched, so `flows` / `entry_screens` / `f_adopt` keep their
 * existing mapping and FM, Vi and Calendar are unaffected.
 * ------------------------------------------------------------------------- */

/** The array also carries other tenants' apps (Runwal, Godrej, Vi) — match ours only. */
const PULSE_APP = "panchshil_pulse";

export interface PulseWorkflowStep {
  step: string;
  reach: number | null;
  drop_pct: number | null;
}

export interface PulseWorkflowRecord {
  app?: string;
  flow_key?: string;
  name?: string;
  adoption_pct: number | null;
  completion_pct: number | null;
  biggest_drop_pct: number | null;
  volume: number | null;
  steps?: PulseWorkflowStep[] | null;
}

type WithWorkflows = WorkflowUsageResponse & {
  workflows?: PulseWorkflowRecord[] | null;
};

const norm = (s: string) => s.trim().toLowerCase().replace(/[\s_-]+/g, "");

const num = (v: number | null | undefined): number | null =>
  typeof v === "number" && isFinite(v) ? v : null;

/** The one `panchshil_pulse` record this screen should read: prefer the active
 *  module/sub-module selection, else the first record — Calendar's `find(...) ?? [0]`. */
export function selectPulseWorkflow(
  wf: WithWorkflows | undefined,
  selection?: string | null
): PulseWorkflowRecord | null {
  const mine = (wf?.workflows ?? []).filter((w) => w && w.app === PULSE_APP);
  if (!mine.length) return null;
  if (selection) {
    const hit = mine.find(
      (w) =>
        (typeof w.flow_key === "string" && norm(w.flow_key) === norm(selection)) ||
        (typeof w.name === "string" && norm(w.name) === norm(selection))
    );
    if (hit) return hit;
  }
  return mine[0];
}

/** Steps of the selected workflow, as shared funnel steps. Empty when unusable. */
function funnelFromWorkflow(w: PulseWorkflowRecord): WorkflowFunnelStep[] {
  const steps = (w.steps ?? []).filter((s) => s && typeof s.step === "string" && s.step);
  if (!steps.length) return [];

  // The shared funnel highlights the single worst step, so mark it from the
  // returned drop_pct values rather than leaving every bar unmarked.
  let worst = -1;
  let worstDrop = -Infinity;
  steps.forEach((s, i) => {
    const d = num(s.drop_pct);
    if (d != null && d > worstDrop) {
      worstDrop = d;
      worst = i;
    }
  });

  return steps.map((s, i) => ({
    step: s.step,
    // A step with no recorded reach is shown full width rather than 0% wide,
    // matching the Calendar tenant's Layer 3 rendering of the same block.
    reach: num(s.reach) ?? 100,
    drop_pct: num(s.drop_pct),
    biggest: i === worst,
  }));
}

export function adaptPulseWorkflowUsage(
  wf: WorkflowUsageResponse | undefined,
  selection?: string | null
): WorkflowUsageResponse | undefined {
  if (!wf) return wf;
  const rec = selectPulseWorkflow(wf as WithWorkflows, selection);
  if (!rec) return wf;

  const k = wf.kpis;
  const funnel =
    wf.funnel && wf.funnel.length > 0 ? wf.funnel : funnelFromWorkflow(rec);

  return {
    ...wf,
    kpis: {
      f_adopt: { value: num(k?.f_adopt?.value) ?? num(rec.adoption_pct), delta_pct: k?.f_adopt?.delta_pct ?? null },
      f_comp: { value: num(k?.f_comp?.value) ?? num(rec.completion_pct), delta_pct: k?.f_comp?.delta_pct ?? null },
      f_step: { value: num(k?.f_step?.value) ?? num(rec.biggest_drop_pct), delta_pct: k?.f_step?.delta_pct ?? null },
      f_vol: { value: num(k?.f_vol?.value) ?? num(rec.volume), delta_pct: k?.f_vol?.delta_pct ?? null },
    },
    funnel,
  };
}
