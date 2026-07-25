import { fmtC, pct } from './format';
import type {
  UsageChartData, GrowthWeek, RoleShare, SiteHealthRow, RegionRow, FunnelData, FlowRow, PathRow,
} from './metrics';

export type ChartKey =
  | 'chart.usage' | 'chart.device' | 'chart.adoptTrend' | 'chart.growth' | 'chart.retention'
  | 'chart.role' | 'chart.siteHealth' | 'chart.region' | 'chart.funnel' | 'chart.flowList' | 'chart.path';

export interface AIDataMap {
  'chart.usage': UsageChartData;
  'chart.device': { rows: [string, number][] };
  'chart.adoptTrend': { cur: number[]; prev: number[] };
  'chart.growth': { weeks: GrowthWeek[] };
  'chart.retention': { cohorts: (number | null)[][] };
  'chart.role': { roles: RoleShare[] };
  'chart.siteHealth': { rows: SiteHealthRow[] } | null;
  'chart.region': { rows: RegionRow[] } | null;
  'chart.funnel': FunnelData;
  'chart.flowList': { rows: FlowRow[] };
  'chart.path': { rows: PathRow[] };
}

export interface Insight {
  head: string;
  pts: string[];
  why: string;
  rec: string;
  sug: string;
}

const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
const chg = (a: number, b: number) => (b === 0 ? 0 : Math.round(((a - b) / b) * 100));

const EMPTY_INSIGHT: Insight = { head: 'No data is loaded for this view yet — widen the date range or change the scope filter and try again.', pts: [], sug: '', why: '', rec: '' };

/** Deterministic simulated insight, computed from the chart's own on-screen data (no external calls). */
export function simInsight<K extends ChartKey>(chartKey: K, d: AIDataMap[K] | null | undefined, scope: string): Insight {
  if (!d) return EMPTY_INSIGHT;
  let head = '', pts: string[] = [], sug = '', why = '', rec = '';

  switch (chartKey) {
    case 'chart.usage': {
      const data = d as AIDataMap['chart.usage'];
      const ct = sum(data.cur), pt = sum(data.prev), ch = chg(ct, pt);
      const pk = data.cur.indexOf(Math.max(...data.cur)), lo = data.cur.indexOf(Math.min(...data.cur));
      head = `${data.measure.charAt(0).toUpperCase() + data.measure.slice(1)} are ${ch >= 0 ? 'up ' : 'down '}${Math.abs(ch)}% versus the previous period across ${scope}.`;
      pts = [
        `This period totals ≈ ${fmtC(ct)} against ≈ ${fmtC(pt)} in the prior period of equal length.`,
        `Peak was ${data.labels[pk]} (${fmtC(data.cur[pk])}); the quietest was ${data.labels[lo]} (${fmtC(data.cur[lo])}).`,
        ch >= 0 ? 'The recent trajectory is holding up.' : 'Momentum is softening toward the end of the range.',
      ];
      why = 'Session volume is the earliest adoption signal — a sustained move here shows up in every metric below within weeks.';
      rec = ch < 0
        ? 'Pinpoint the week the decline started, then use the role and site cards below to see who went quiet — target the biggest contributor with a re-engagement nudge this week.'
        : 'Protect the momentum: identify what changed recently (rollout, training, comms) and keep it running; set this level as the new baseline target.';
      sug = ch < 0 ? 'which sites or roles are driving the drop?' : 'is this broad-based or concentrated in a few sites?';
      break;
    }
    case 'chart.device': {
      const data = d as AIDataMap['chart.device'];
      const rows = data.rows.slice().sort((a, b) => b[1] - a[1]);
      const top = rows[0];
      const mob = (data.rows.find((r) => r[0] === 'Mobile') ?? ['', 0])[1] + (data.rows.find((r) => r[0] === 'Tablet') ?? ['', 0])[1];
      head = `${top[0]} is the main way people reach the app (${pct(top[1])} of sessions) in ${scope}.`;
      pts = [
        `Mobile + tablet together are ${pct(mob)} of sessions — a signal of field / on-the-move usage.`,
        `Desktop share: ${pct((data.rows.find((r) => r[0] === 'Desktop') ?? ['', 0])[1])}.`,
      ];
      why = 'The device mix tells you where UX and training effort pays off — a mismatch between how staff should work and how they reach the app hides friction.';
      rec = mob >= 0.5
        ? 'Prioritise mobile-first workflows — QR/scan entry points and short forms — since most sessions happen on the move.'
        : 'A desktop-heavy mix for field-oriented teams suggests access friction — verify field staff have working mobile logins and know the app is on their phones.';
      sug = 'should we prioritise mobile-friendly workflows?';
      break;
    }
    case 'chart.adoptTrend': {
      const data = d as AIDataMap['chart.adoptTrend'];
      const f = data.cur[0], l = data.cur[data.cur.length - 1], ch = chg(l, f);
      head = `Weekly active users are ${ch >= 0 ? 'up ' : 'down '}${Math.abs(ch)}% over the 8-week window in ${scope}.`;
      pts = [
        `Started around ${fmtC(f)} active users and ended near ${fmtC(l)}.`,
        ch >= 0 ? 'Engagement is trending in the right direction.' : 'Active usage is slipping — worth pairing with the growth-accounting view below.',
      ];
      why = 'Weekly active users is the headline adoption number — a slide here means paid seats going unused.';
      rec = ch < 0
        ? 'Open the growth-accounting card to see whether the leak is dormancy or weak new-user inflow, and target that side first.'
        : 'Lock in the gain: set the current level as the target on the KPI tile above and watch for regression.';
      sug = 'what is causing the change week to week?';
      break;
    }
    case 'chart.growth': {
      const data = d as AIDataMap['chart.growth'];
      const w = data.weeks[data.weeks.length - 1];
      const gains = w.nw + w.res, losses = w.dorm;
      head = `${gains > losses ? 'Gains are outpacing losses' : 'Losses are outpacing new + resurrected users'} in the latest week for ${scope}.`;
      pts = [
        `Latest week: ${w.nw} new, ${w.res} resurrected, ${w.ret} returning, and ${w.dorm} went dormant.`,
        gains > losses ? 'Net growth is positive for now.' : 'If this persists, the active-user base will shrink.',
      ];
      why = 'Growth composition shows whether adoption is self-sustaining or leaking — dormancy that outpaces gains shrinks the active base within weeks.';
      rec = gains > losses
        ? 'Keep the onboarding cadence that is feeding new users, and watch the dormant line weekly for reversals.'
        : 'Run a win-back: identify the roles or sites going dormant and re-onboard them with a manager-led first workflow.';
      sug = 'which roles or sites are going dormant?';
      break;
    }
    case 'chart.retention': {
      const data = d as AIDataMap['chart.retention'];
      const w1 = data.cohorts.map((c) => c[1]).filter((x): x is number => x != null);
      const avg = w1.length ? Math.round(sum(w1) / w1.length) : 0;
      head = `About ${avg}% of a joining group is still active one week after they start, in ${scope}.`;
      pts = [
        'Retention decays fastest in the first weeks, as is normal — the goal is to flatten that early curve.',
        avg < 50 ? "A sub-50% week-1 figure suggests onboarding isn't sticking." : 'Week-1 retention is reasonably healthy.',
      ];
      why = "Early retention decides whether onboarding converts to habit — rollout effort is lost if week 1 doesn't stick.";
      rec = avg < 50
        ? 'Add a guided first-week task — a manager-assigned checklist or ticket — so every joiner completes one real workflow in week one.'
        : 'Focus on flattening the curve after week 4 by tying a recurring duty (checklist, reading, report) to the app.';
      sug = 'what happens to retention after week 4?';
      break;
    }
    case 'chart.role': {
      const data = d as AIDataMap['chart.role'];
      const rs = data.roles.slice().sort((a, b) => b.share - a.share);
      const top = rs[0], bot = rs[rs.length - 1];
      head = `${top.name} are the most engaged role (${pct(top.share)}), while ${bot.name} are the least (${pct(bot.share)}) in ${scope}.`;
      pts = [
        'A wide gap between roles means adoption is uneven — one group carries usage.',
        `Lifting the lowest role (${bot.name}) is usually the fastest way to raise overall engagement.`,
      ];
      why = 'Uneven role adoption means usage is single-threaded — it depends on one group, and their turnover puts it at risk.';
      rec = `Lift the ${bot.name} group first: assign them the workflows built for their role and set the expectation through their managers.`;
      sug = `how do I re-engage the ${bot.name} group?`;
      break;
    }
    case 'chart.siteHealth': {
      const data = d as AIDataMap['chart.siteHealth'];
      if (!data) { head = `No sites in scope for ${scope}.`; break; }
      const rows = data.rows.slice().sort((a, b) => a.util - b.util);
      const weak = rows[0];
      const drops = data.rows.filter((r) => r.drop);
      head = `The weakest site is ${weak.name} (${pct(weak.util)} seat utilisation) in ${scope}.`;
      pts = [
        drops.length ? `${drops.length} site(s) flagged a sudden drop: ${drops.map((r) => r.name).join(', ')}.` : 'No sudden drops flagged this period.',
        `Top and bottom sites differ by ${Math.round((rows[rows.length - 1].util - weak.util) * 100)} points of utilisation.`,
      ];
      why = 'Site spread shows whether adoption is a portfolio habit or a few champion sites — a sudden-drop flag is the earliest churn warning available.';
      rec = drops.length
        ? `Contact the flagged site(s) — ${drops.map((r) => r.name).join(', ')} — this week; a sudden drop is a leading indicator, not noise.`
        : `Pair ${weak.name} with the strongest site in its region for a practice transfer.`;
      sug = `what should ${weak.name} focus on first?`;
      break;
    }
    case 'chart.region': {
      const data = d as AIDataMap['chart.region'];
      if (!data) { head = `Region roll-up is not available for ${scope}.`; break; }
      const rows = data.rows.slice().sort((a, b) => b.util - a.util);
      const best = rows[0], worst = rows[rows.length - 1];
      head = `${best.reg} leads on adoption (${pct(best.util)}), ${worst.reg} trails (${pct(worst.util)}).`;
      pts = [
        `Active users: ${rows.map((r) => `${r.reg} ${fmtC(r.wau)}`).join(', ')}.`,
        `The gap between best and worst region is ${Math.round((best.util - worst.util) * 100)} points.`,
      ];
      why = 'Regional gaps compound: a trailing region drags portfolio utilisation and usually traces back to a handful of sites.';
      rec = `Drill into ${worst.reg}'s site table to find the dragging sites, and replicate ${best.reg}'s operating rhythm there.`;
      sug = `which sites are dragging ${worst.reg} down?`;
      break;
    }
    case 'chart.funnel': {
      const data = d as AIDataMap['chart.funnel'];
      const first = data.reaches[0], last = data.reaches[data.reaches.length - 1];
      const overall = Math.round((last / first) * 100);
      head = `The biggest drop-off in "${data.flowLabel}" is a ${data.worstDrop}% fall at "${data.steps[data.worst]}" in ${scope}.`;
      pts = [
        `Overall, ${overall}% of started runs reach the final step (${fmtC(last)} of ${fmtC(first)}).`,
        `Fixing the "${data.steps[data.worst]}" step is the highest-leverage improvement.`,
      ];
      why = `Every drop at "${data.steps[data.worst]}" is started work that never finished — completion, not traffic, is what this workflow exists for.`;
      rec = `Fix the "${data.steps[data.worst]}" step first: reduce form friction if it's an entry step, nudge or delegate if it's an approval, retrain if it's setup. One step, one action.`;
      sug = `why do people drop at "${data.steps[data.worst]}"?`;
      break;
    }
    case 'chart.flowList': {
      const data = d as AIDataMap['chart.flowList'];
      const byA = data.rows.slice().sort((a, b) => a.adopt - b.adopt);
      const byC = data.rows.slice().sort((a, b) => a.comp - b.comp);
      head = `"${byA[0].label}" has the lowest adoption (${pct(byA[0].adopt)}) and "${byC[0].label}" the lowest completion (${pct(byC[0].comp)}).`;
      pts = [
        "Low adoption is a discovery/training problem; low completion is a friction problem — they need different fixes.",
        `Highest-volume flow this period: "${data.rows.slice().sort((a, b) => b.vol - a.vol)[0].label}".`,
      ];
      why = "Low adoption and low completion need different fixes — training won't remove friction, and UX polish won't create discovery.";
      rec = `Start with "${byA[0].label}": run a short role-targeted training push; then walk the funnel of "${byC[0].label}" to find its friction step.`;
      sug = 'is low adoption a training gap or a workflow-design gap?';
      break;
    }
    case 'chart.path': {
      const data = d as AIDataMap['chart.path'];
      const byV = data.rows.slice().sort((a, b) => b.vis - a.vis);
      const byB = data.rows.slice().sort((a, b) => b.bo - a.bo);
      head = `Most sessions start at "${byV[0].path}" (${fmtC(byV[0].vis)} visitors) in ${scope}.`;
      pts = [
        `"${byB[0].path}" has the highest bounce (${pct(byB[0].bo, 1)}) — people arrive but leave without acting.`,
        'The top entry point is a good candidate for surfacing key actions and nudges.',
      ];
      why = 'Entry pages are where habits form — high bounce on a work page means people arrive with intent and leave without acting.';
      rec = `On "${byB[0].path}", surface the primary action above the fold or shorten the path to it, then recheck the bounce next period.`;
      sug = `how do I reduce the bounce on "${byB[0].path}"?`;
      break;
    }
    default:
      head = `Here is what this view shows for ${scope}.`;
  }
  return { head, pts, sug, why, rec };
}

/** Keyword-routed follow-up answers, always grounded in the chart's own data. */
export function simAnswer<K extends ChartKey>(chartKey: K, d: AIDataMap[K] | null | undefined, scope: string, q: string): string {
  const ins = simInsight(chartKey, d, scope);
  const ql = q.toLowerCase();
  const has = (...w: string[]) => w.some((x) => ql.includes(x));
  if (has('why', 'reason', 'cause', 'driver', 'driving'))
    return `From this view's data, the movement is associated with: ${ins.pts.join(' ')} I can highlight what changed, but a dashboard shows correlation, not proof of cause — treat these as leads to verify with the team.`;
  if (has('which', 'where', 'who', 'site', 'region', 'role', 'worst', 'best', 'top', 'lowest', 'highest'))
    return `${ins.head} ${ins.pts.join(' ')}`;
  if (has('compare', 'vs', 'versus', 'previous', 'last', 'prior', 'trend', 'change'))
    return `${ins.head} The comparison shown is like-for-like against the immediately preceding period of equal length, for ${scope}.`;
  if (has('target', 'benchmark', 'goal', 'on track'))
    return `This view isn't tied to a single KPI target — targets are set on the KPI tiles above. Relative to a healthy range, though: ${ins.head}`;
  if (has('recommend', 'should', 'action', 'do', 'fix', 'improve', 'next', 'how'))
    return ins.rec ? `Recommendation, based on this data: ${ins.rec}` : `Suggested next step, based on this data: ${ins.pts[ins.pts.length - 1]}`;
  return `${ins.head} ${ins.pts.join(' ')}${ins.sug ? ` You could also ask: "${ins.sug}"` : ''}`;
}
