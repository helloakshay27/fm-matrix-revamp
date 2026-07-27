export type Tier = 't1' | 't2' | 't3';
export type Device = 'all' | 'desktop' | 'mobile';
export type DateRange = 7 | 30 | 90;

export interface Site {
  id: string;
  name: string;
  region: string;
  seats: number;
}

export interface Flow {
  key: string;
  label: string;
  flagship?: boolean;
  steps: string[];
}

export interface Module {
  key: string;
  name: string;
  bucket: string;
  flows: Flow[];
  paths: string[];
}

export interface Role {
  key: string;
  name: string;
  color: string;
  prov: number;
}

export const SITES: Site[] = [
  { id: 'bkc', name: 'Mumbai — BKC Tower', region: 'West', seats: 120 },
  { id: 'powai', name: 'Mumbai — Powai Campus', region: 'West', seats: 85 },
  { id: 'pune', name: 'Pune — Hinjewadi', region: 'West', seats: 70 },
  { id: 'blr', name: 'Bengaluru — Whitefield', region: 'South', seats: 95 },
  { id: 'del', name: 'Delhi — Aerocity', region: 'North', seats: 60 },
  { id: 'ggn', name: 'Gurgaon — Cyber Hub', region: 'North', seats: 55 },
];

export const REGIONS: string[] = ['West', 'South', 'North'];

export const MODULES: Module[] = [
  {
    key: 'helpdesk', name: 'Helpdesk', bucket: 'Maintenance',
    flows: [
      { key: 'helpdesk.ticket_create', label: 'Ticket creation', flagship: true, steps: ['Open form', 'Category', 'Details', 'Attachment', 'Submit'] },
      { key: 'helpdesk.ticket_find', label: 'Find ticket', steps: ['Open list', 'Search', 'Open result'] },
      { key: 'helpdesk.triage_assign', label: 'Triage & assign', steps: ['Open ticket', 'Set priority', 'Assign'] },
      { key: 'helpdesk.ticket_close', label: 'Ticket close', steps: ['Open ticket', 'Resolution note', 'Close'] },
    ],
    paths: ['/maintenance/ticket', '/maintenance/ticket/new', '/maintenance/ticket/list', '/maintenance/asset', '/mobile/ticket'],
  },
  {
    key: 'ppm', name: 'PPM', bucket: 'Maintenance',
    flows: [
      { key: 'ppm.schedule_create', label: 'Schedule creation', flagship: true, steps: ['Open wizard', 'Asset/scope', 'Frequency', 'Checklist', 'Publish'] },
      { key: 'ppm.task_execute', label: 'Task execution', flagship: false, steps: ['Open task', 'Checklist', 'Readings/photos', 'Complete'] },
      { key: 'ppm.reschedule', label: 'Reschedule', steps: ['Open task', 'Pick date', 'Confirm'] },
    ],
    paths: ['/vas/tasks', '/vas/schedule', '/vas/task/execute', '/mobile/lmc', '/vas/calendar'],
  },
  {
    key: 'audit', name: 'Audit', bucket: 'Maintenance',
    flows: [
      { key: 'audit.schedule_create', label: 'Audit setup', flagship: true, steps: ['Open wizard', 'Template', 'Scope', 'Schedule'] },
      { key: 'audit.conduct', label: 'Conduct audit', flagship: false, steps: ['Open audit', 'Questions', 'Evidence', 'Submit'] },
      { key: 'audit.template_use', label: 'Template use', steps: ['Open templates', 'Select', 'Apply'] },
    ],
    paths: ['/audit/list', '/audit/conduct', '/audit/template', '/mobile/audit', '/audit/report'],
  },
  {
    key: 'assets', name: 'Assets', bucket: 'Maintenance',
    flows: [
      { key: 'assets.register', label: 'Asset registration', flagship: true, steps: ['Open form', 'Identity', 'Location', 'Specs', 'Save'] },
      { key: 'assets.detail_complete', label: 'Detail enrichment', steps: ['Open asset', 'Config tab', 'Save'] },
      { key: 'assets.status_update', label: 'Status update', steps: ['Scan/Open', 'New status', 'Confirm'] },
    ],
    paths: ['/maintenance/asset', '/maintenance/asset/new', '/maintenance/asset/detail', '/mobile/asset-scan', '/maintenance/asset/list'],
  },
  {
    key: 'amc', name: 'AMC', bucket: 'Maintenance',
    flows: [
      { key: 'amc.create', label: 'Contract creation', flagship: true, steps: ['Open form', 'Vendor', 'Coverage', 'Schedule', 'Save'] },
      { key: 'amc.visit_log', label: 'Visit logging', flagship: false, steps: ['Open contract', 'Log visit', 'Attach report', 'Save'] },
      { key: 'amc.renew', label: 'Renewal', steps: ['Renewal prompt', 'Review terms', 'Confirm'] },
    ],
    paths: ['/finance/amc', '/finance/amc/new', '/finance/amc/visit', '/finance/pending-approvals', '/finance/service-pr'],
  },
  {
    key: 'incident', name: 'Incident', bucket: 'Safety',
    flows: [
      { key: 'incident.report', label: 'Incident reporting', flagship: true, steps: ['Open form', 'Time & building', 'Categorise', 'Assess', 'Describe & disclaim', 'Submit'] },
      { key: 'incident.status_progress', label: 'Status progression', flagship: false, steps: ['Open incident', 'Update status', 'Comment', 'Save'] },
      { key: 'incident.investigation', label: 'Investigation & CAPA', steps: ['Open edit', 'Root cause', 'Actions', 'Save'] },
      { key: 'incident.find', label: 'Find incident', steps: ['Open list', 'Search/filter', 'Open result'] },
    ],
    paths: ['/safety/incident', '/safety/incident/add', '/safety/incident/new-details', '/safety/incident#analytics', '/mobile/incident'],
  },
  {
    key: 'permit', name: 'Permit', bucket: 'Safety',
    flows: [
      { key: 'permit.raise', label: 'Permit raise', flagship: true, steps: ['Open form', 'Basic details', 'Permit details', 'Attachments', 'Raise'] },
      { key: 'permit.approve', label: 'Approval decision', flagship: false, steps: ['Open queue', 'Open item', 'Decide'] },
      { key: 'permit.extend', label: 'Extension', steps: ['Open permit', 'Request extension', 'Extension approved'] },
      { key: 'permit.close', label: 'Closure', steps: ['Open permit', 'Submit closure', 'Closure approved'] },
    ],
    paths: ['/safety/permit', '/safety/permit/add', '/safety/permit/details', '/safety/permit/pending-approvals', '/safety/permit/checklist'],
  },
  {
    key: 'msafe', name: 'M-Safe', bucket: 'Safety',
    flows: [
      { key: 'msafe.ext_approve', label: 'External-user approval', flagship: true, steps: ['Open external list', 'Review pending', 'Approve'] },
      { key: 'msafe.reassign', label: 'Reportees reassign', flagship: false, steps: ['Open form', 'Fetch reportees', 'Select', 'Reassign'] },
      { key: 'msafe.report_pull', label: 'Report download', steps: ['Open report', 'Generate', 'Download'] },
      { key: 'msafe.hierarchy_check', label: 'Hierarchy lookup', steps: ['Open form', 'Enter identifier', 'Submit'] },
    ],
    paths: ['/safety/m-safe', '/safety/m-safe/non-fte-users', '/safety/m-safe/reportees-reassign', '/safety/report/msafe-detail-report', '/safety/check-hierarchy-levels'],
  },
  {
    key: 'procurement', name: 'Procurement', bucket: 'Finance',
    flows: [
      { key: 'procure.pr_create', label: 'PR creation', flagship: true, steps: ['Open form', 'Supplier details', 'Item details', 'Attach', 'Submit'] },
      { key: 'procure.approve', label: 'Approval decision', flagship: false, steps: ['Open queue', 'Open item', 'Decide'] },
      { key: 'procure.convert', label: 'PR → PO/WO conversion', steps: ['Open form', 'Select PR', 'Details', 'Submit'] },
      { key: 'procure.grn', label: 'Goods receipt (GRN)', steps: ['Open form', 'Select PO', 'Quantities & batches', 'Submit'] },
      { key: 'procure.draft_recover', label: 'Draft recovery', steps: ['Draft auto-saved', 'Reopen draft', 'Submit'] },
    ],
    paths: ['/finance/material-pr', '/finance/service-pr', '/finance/po', '/finance/wo', '/finance/grn-srn', '/finance/pending-approvals', '/finance/auto-saved-pr'],
  },
  {
    key: 'gdn', name: 'GDN', bucket: 'Finance',
    flows: [
      { key: 'gdn.raise', label: 'GDN raise', flagship: true, steps: ['Open form', 'Basic details', 'Inventory rows', 'Submit'] },
      { key: 'gdn.approve', label: 'Approval decision', flagship: false, steps: ['Open queue', 'Open item', 'Decide'] },
      { key: 'gdn.find', label: 'Find GDN', steps: ['Open list', 'Search/filter', 'Open result'] },
    ],
    paths: ['/finance/gdn', '/finance/gdn/request-add', '/finance/gdn/pending-approvals', '/finance/wbs'],
  },
  {
    key: 'gatepass', name: 'Gate Pass', bucket: 'Security',
    flows: [
      { key: 'gatepass.inward_create', label: 'Inward pass creation', flagship: true, steps: ['Open form', 'Visitor details', 'Gate pass details', 'Item rows', 'Submit'] },
      { key: 'gatepass.outward_create', label: 'Outward pass creation', flagship: false, steps: ['Open form', 'Returnable status', 'Expected return date', 'Item rows', 'Submit'] },
      { key: 'gatepass.handover', label: 'Returnable closure (handover)', steps: ['Returnable submitted', 'Handover recorded'] },
      { key: 'gatepass.find', label: 'Find & review pass', steps: ['Open list', 'Search/filter', 'Open detail'] },
    ],
    paths: ['/security/gate-pass/inwards', '/security/gate-pass/inwards/add', '/security/gate-pass/outwards', '/security/gate-pass/outwards/add'],
  },
  {
    key: 'visitor', name: 'Visitor', bucket: 'Security',
    flows: [
      { key: 'visitor.lifecycle', label: 'Visitor lifecycle', flagship: true, steps: ['Visitor created', 'Approved', 'Checked in', 'Checked out'] },
      { key: 'visitor.preregister', label: 'Pre-registration', flagship: false, steps: ['Open modal', 'Mobile lookup', 'Registration submitted'] },
      { key: 'visitor.analytics', label: 'Analytics consumption', steps: ['Open analytics tab', 'Filter/interact', 'Export tile'] },
      { key: 'visitor.staff_onboard', label: 'Staff onboarding', steps: ['Open form', 'Details & validity', 'Schedule grid', 'Submit'] },
    ],
    paths: ['/security/visitor', '/security/staff', '/security/staff/add'],
  },
  {
    key: 'vehicle', name: 'Vehicle', bucket: 'Security',
    flows: [
      { key: 'vehicle.log', label: 'Vehicle in/out logging', flagship: true, steps: ['Vehicle at gate', 'Entry logged', 'Exit logged'] },
      { key: 'vehicle.register', label: 'Vehicle registration', flagship: false, steps: ['Open form', 'Slot & sticker', 'QR issued'] },
    ],
    paths: ['/security/vehicle/r-vehicles', '/security/vehicle/r-vehicles/history', '/security/vehicle/g-vehicles'],
  },
  {
    key: 'patrolling', name: 'Patrolling', bucket: 'Security',
    flows: [
      { key: 'patrol.execute', label: 'Patrol execution', flagship: true, steps: ['Slot scheduled', 'Checkpoint scanned', 'Checklist submitted', 'Completed in grace'] },
      { key: 'patrol.setup', label: 'Patrol setup', flagship: false, steps: ['Open form', 'Validity & checklist', 'Schedule', 'Checkpoints', 'Submit'] },
      { key: 'patrol.review', label: 'Response review & escalation', steps: ['Open response', 'Review missed', 'Raise ticket/incident'] },
    ],
    paths: ['/security/patrolling', '/security/patrolling/create', '/security/patrolling/response'],
  },
  {
    key: 'metering', name: 'Metering & Readings', bucket: 'Utility',
    flows: [
      { key: 'meter.reading_capture', label: 'Reading capture', flagship: true, steps: ['Meter configured', 'Reading recorded', 'Consumption derived'] },
      { key: 'meter.reading_fix', label: 'Reading correction', flagship: false, steps: ['Open register', 'Open edit', 'Update'] },
      { key: 'meter.import', label: 'Bulk import', steps: ['Open import', 'Upload file', 'Validated'] },
      { key: 'meter.analytics', label: 'Analytics view', steps: ['Open analytics', 'Adjust range', 'Export chart'] },
    ],
    paths: ['/utility/energy', '/utility/water', '/utility/stp', '/utility/daily-readings'],
  },
  {
    key: 'ubilling', name: 'Utility Billing', bucket: 'Utility',
    flows: [
      { key: 'ubill.generate', label: 'Bill generation', flagship: true, steps: ['Open wizard', 'Scope & consumption', 'Adjustment factor', 'Rate entered', 'Submit'] },
      { key: 'ubill.compile', label: 'Manual compile', flagship: false, steps: ['Open form', 'Entity & period', 'Consumption & rate', 'Submit'] },
      { key: 'ubill.close', label: 'Billing status closure', steps: ['Request created', 'Status advanced'] },
    ],
    paths: ['/utility/utility-consumption', '/utility/utility-consumption/generate-bill', '/utility/utility-request', '/utility/utility-request/add', '/utility/ev-consumption', '/utility/solar-generator'],
  },
];

export const ROLES: Role[] = [
  { key: 'admin', name: 'Admin', color: 'var(--phg-orange)', prov: 0.06 },
  { key: 'supervisor', name: 'Supervisor', color: 'var(--phg-blue)', prov: 0.18 },
  { key: 'technician', name: 'Technician', color: 'var(--phg-green)', prov: 0.46 },
  { key: 'occupant', name: 'Occupant', color: 'var(--phg-midgray)', prov: 0.3 },
];

export const GOALS: { value: string; label: string }[] = [
  { value: 'helpdesk.ticket_create', label: 'Goal: Ticket creation' },
  { value: 'ppm.task_execute', label: 'Goal: PPM task done' },
  { value: 'audit.conduct', label: 'Goal: Audit conducted' },
  { value: 'incident.report', label: 'Goal: Incident reported' },
  { value: 'permit.raise', label: 'Goal: Permit raised' },
  { value: 'procure.pr_create', label: 'Goal: PR submitted' },
  { value: 'gdn.raise', label: 'Goal: GDN raised' },
  { value: 'gatepass.inward_create', label: 'Goal: Gate pass created' },
  { value: 'visitor.lifecycle', label: 'Goal: Visitor checked in' },
  { value: 'patrol.execute', label: 'Goal: Patrol checkpoint completed' },
  { value: 'meter.reading_capture', label: 'Goal: Meter reading recorded' },
  { value: 'ubill.generate', label: 'Goal: Utility bill generated' },
];

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
  A6: { t: 'Module Breadth (A6)', f: 'Count of the core modules (Helpdesk, PPM, Audit, Assets, AMC) that had at least one action in the range, shown out of five.', d: 'How much of the platform is genuinely in use versus sitting idle. A low number means people are only touching one or two areas of what they pay for.' },
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
  'chart.siteHealth': { t: 'Site league table', f: 'One row per site in scope, showing its seat utilisation (A1), its trend versus the prior period (A3), and flagship-workflow completion, ranked from lowest utilisation upward. Status flags a sudden drop, a site to watch, or a healthy site.', d: 'A leaderboard to see which sites are adopting well and which are lagging or dropping and may need attention.' },
  'chart.region': { t: 'Region roll-up', f: 'Figures aggregated to region level (West, South, North): number of sites, active users, seat utilisation (A1) and trend (A3), with a health status.', d: 'The management-level summary — how adoption compares across regions before drilling into individual sites.' },
  'chart.funnel': { t: 'Workflow funnel', f: 'For the flagship workflow of the selected module, the number of runs still present at each successive step, from start to finish. The percentage on each step is the drop from the step before it.', d: 'Each bar is narrower than the one above because some runs drop off. The highlighted step is the single biggest drop — where people most often get stuck.' },
  'chart.flowList': { t: 'Flows in this module', f: "For every workflow in the module, its adoption (F-adopt), completion (F-comp) and volume (F-vol). A star marks the flagship flow.", d: 'A per-workflow scorecard so you can see which specific processes are working and which are being ignored or abandoned.' },
  'chart.path': { t: 'Where people start', f: 'The screen each session lands on first, listed with its Visitors, Views and Bounce rate. The small arrows show the change versus the previous period.', d: 'Shows the most common entry points into the app — what people actually come to the tool to do first.' },
};
