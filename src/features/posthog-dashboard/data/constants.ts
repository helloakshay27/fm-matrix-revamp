export type Device = 'all' | 'desktop' | 'mobile';
export type DateRange = 7 | 30 | 90;

/**
 * Viewing tier. The events carry no region dimension, so the middle tier groups by the one
 * real hierarchy the platform has above a site: its company.
 * t1 = Site Manager (one site) · t2 = Regional (one company) · t3 = Management (whole tenant).
 */
export type Tier = 't1' | 't2' | 't3';

/** A site on the tenant, from `/pms/sites.json?all_sites=true`. */
export interface Site {
  id: string;
  name: string;
  companyId?: string;
  companyName?: string;
}

/** A company and the sites under it — the Regional tier's grouping. */
export interface SiteGroup {
  id: string;
  name: string;
  siteIds: string[];
}

/** Groups the site list by company; sites with no `company_id` are left out. */
export function groupSites(sites: Site[], names: Record<string, string> = {}): SiteGroup[] {
  const byCompany = new Map<string, SiteGroup>();
  for (const s of sites) {
    if (!s.companyId) continue;
    const g = byCompany.get(s.companyId) ?? {
      id: s.companyId,
      name: names[s.companyId] ?? s.companyName ?? `Company ${s.companyId}`,
      siteIds: [],
    };
    g.siteIds.push(s.id);
    byCompany.set(s.companyId, g);
  }
  return [...byCompany.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Role bars are coloured by position — the API returns whatever roles exist in the data. */
export const ROLE_COLORS: string[] = [
  'var(--phg-orange)',
  'var(--phg-blue)',
  'var(--phg-green)',
  'var(--phg-midgray)',
  'var(--phg-amber)',
  'var(--phg-red)',
];

/**
 * The site-wise table costs one `traffic_session` call per site (there is no per-site
 * endpoint), so the fan-out is capped. Sites beyond this are reported as skipped rather
 * than silently dropped.
 */
export const SITE_FANOUT_LIMIT = 50;

/** Week windows each look-back endpoint asks for (the API's own defaults). */
export const TREND_WEEKS = 8;
export const GROWTH_WEEKS = 6;
export const RETENTION_WEEKS = 8;

/** User-defined KPI benchmarks: rate metrics start with a suggested target, count metrics start blank. */
export const BM_DEFAULTS: Record<string, number> = {
  U5: 6, U6: 20, A1: 75, A2: 30, A3: 5, A5: 60, A6: 4, 'F-adopt': 50, 'F-comp': 70, 'F-step': 25,
};

export interface InfoEntry {
  t: string;
  f: string;
  d: string;
}

/** Plain-language "how this is calculated" explanations, keyed by tile id or chart key. */
export const INFO: Record<string, InfoEntry> = {
  U1: { t: 'Active Users (U1)', f: 'Count of distinct employees who were active at least once in a 7-day window (weekly active users, WAU).', d: 'Each person is counted only once no matter how many times they log in. This is your reach — how many of your team actually showed up in the week.' },
  U2: { t: 'Screen Views (U2)', f: 'Total number of screens/pages opened across everyone, added up over the selected date range.', d: 'Unlike active users, this counts every screen opened — so it climbs when people browse more deeply, not just when more people log in.' },
  U3: { t: 'Sessions (U3)', f: 'Total number of visits in the selected range. A session is one continuous visit that ends after about 30 minutes of no activity.', d: "If one person logs in three separate times, that's three sessions. It measures how often people are coming back, not just how many people." },
  U5: { t: 'Session Duration (U5)', f: 'Total time everyone spent in the app ÷ total number of sessions.', d: 'The average length of a single visit, shown in minutes and seconds. A session ends after ~30 minutes of inactivity, so this reflects real time-in-app.' },
  U6: { t: 'Bounce Rate (U6)', f: 'Sessions where the person viewed only one screen and took no further action ÷ total sessions, shown as a percentage.', d: 'A "bounce" is a visit where someone opened the app but left without doing anything. Lower is better — it means people are finding a reason to stay.' },
  U8: { t: 'Recently Online (U8)', f: 'Count of distinct employees who were active in the last ~30 minutes.', d: 'A near-live pulse of who is in the app right now. It moves up and down through the day rather than reflecting the whole date range.' },
  A1: { t: 'Seat Utilisation (A1)', f: 'Weekly active users (WAU) ÷ total seats (licences purchased), shown as a percentage.', d: 'Of all the logins you pay for, what share are actually being used each week. A low number means licences are sitting idle.' },
  A2: { t: 'Stickiness (A2)', f: 'Average daily active users ÷ monthly active users, shown as a percentage (DAU ÷ MAU).', d: 'Of the people who use the app in a month, what share use it on any given day. Roughly 30% means the average active user shows up ~9 days a month. Higher means more habitual use.' },
  A3: { t: 'Adoption Trend (A3)', f: 'The change in weekly active users now versus four weeks ago, expressed as a percentage rise or fall.', d: 'A simple momentum reading: a positive number means more of your team is engaging than a month ago, a negative number means engagement is slipping.' },
  A5: { t: '14-Day Activation (A5)', f: 'New joiners who completed a first meaningful action within 14 days of getting access ÷ all new joiners in that window, as a percentage.', d: '"Activated" means a new user got past just logging in and actually did something real. It shows how well newcomers get off the ground in their first two weeks.' },
  A6: { t: 'Module Breadth (A6)', f: 'Count of the modules that had at least one action in the range, out of every module the app exposes.', d: 'How much of the platform is genuinely in use versus sitting idle. A low number means people are only touching one or two areas of what they pay for.' },
  'F-adopt': { t: 'Workflow Adoption (F-adopt)', f: "Active users who started at least one of this module's workflows ÷ active users who could use them, as a percentage.", d: "For the module you're viewing, how many of the relevant people have actually begun using its workflows at all." },
  'F-comp': { t: 'Completion Rate (F-comp)', f: 'Workflow runs that reached the final step ÷ workflow runs that were started, as a percentage.', d: 'Of the processes people begin (e.g. a ticket, an audit), how many they carry through to the end rather than abandoning partway.' },
  'F-step': { t: 'Biggest Step Drop (F-step)', f: 'At the single worst step in the workflow, the share of runs that fail to move on to the next step, as a percentage.', d: 'Pinpoints the one place people most often get stuck or give up. Lower is better; a high number flags a confusing or heavy step to fix first.' },
  'F-vol': { t: 'Usage Volume (F-vol)', f: 'Total count of workflow runs started in this module during the selected range.', d: 'The raw amount of work flowing through the module — how many tickets, audits or tasks were kicked off. Shows overall throughput.' },
  'chart.usage': { t: 'Usage over time', f: 'For each day in the range, the solid line plots the chosen measure — Visitors (distinct active people), Views (screens opened) or Sessions (visits). The faint dashed line is the same measure for the immediately preceding period of equal length.', d: 'Lets you spot the trend and compare it like-for-like against the previous period. The short dashed tail at the end is a simple projection of where the current pace is heading.' },
  'chart.device': { t: 'Device breakdown', f: 'Sessions split by the device they came from — Desktop, Mobile and Tablet — each shown as a share of total sessions.', d: 'Tells you how staff are reaching the tool. A heavy mobile/tablet share usually means people working on the move rather than at a desk.' },
  'chart.adoptTrend': { t: 'Adoption trend', f: 'Weekly active users (WAU) plotted for each of the last 8 weeks, with the faint dashed line showing the prior comparison period.', d: 'Shows whether more of your team is engaging week over week, or whether active usage has flattened or fallen.' },
  'chart.growth': { t: 'Growth accounting', f: 'Each week, active users are split into New (first-ever active), Returning (active the prior week too) and Resurrected (came back after a gap) above the line, with Dormant (were active before, not this week) shown below the line.', d: 'Explains why your active-user number moved: bars above zero are gains, the bar below zero is the loss. If losses regularly outweigh gains, growth is at risk.' },
  'chart.retention': { t: 'Retention cohorts', f: 'People are grouped by the week they first became active (a "cohort"), shown one per row. Each cell reads what percentage of that group came back in week 0, week 1, week 2, and so on.', d: 'Reading left to right shows how well each joining group sticks around. Darker cells mean more people retained. It answers "once people start, do they keep coming back?"' },
  'chart.role': { t: 'Usage by role', f: 'Active people broken down by their role (Admin, Supervisor, Technician, Occupant), each shown as a share within the group.', d: 'Shows which types of user are actually engaging. If a key role such as Technicians is under-represented, adoption may be uneven.' },
  'chart.siteHealth': { t: 'Site league table', f: 'One row per site in scope, showing its active users, sessions, average session length and bounce rate, plus the change in active users versus the previous period — ranked busiest first so sites with no events sit at the bottom. Status flags a sudden drop (active users down 25%+), a site to watch, or a healthy site.', d: 'A leaderboard to see which sites are adopting well and which are lagging or dropping and may need attention. There is no per-site endpoint, so each row is its own traffic_session call — the table only loads on the All-sites scope, and rows appear as each call lands.' },
  'chart.funnel': { t: 'Workflow funnel', f: 'For the flagship workflow of the selected module, the number of runs still present at each successive step, from start to finish. The percentage on each step is the drop from the step before it.', d: 'Each bar is narrower than the one above because some runs drop off. The highlighted step is the single biggest drop — where people most often get stuck.' },
  'chart.flowList': { t: 'Screens in this module', f: 'Every sub-path under the selected module, with the users, events and sessions recorded on it. Per-path completion (F-comp) needs a flow_key event property that is not instrumented yet, so it reads as a dash.', d: 'A per-screen scorecard so you can see which specific parts of the module are being used and which are ignored.' },
  'chart.path': { t: 'Where people start', f: 'The screen each session lands on first, listed with its Visitors, Views and Bounce rate. The small arrows show the change versus the previous period.', d: 'Shows the most common entry points into the app — what people actually come to the tool to do first.' },
};
