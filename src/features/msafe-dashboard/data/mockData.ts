import type { StatusCode } from './constants';
import { C } from './constants';

export type DirectoryUser = {
  name: string;
  emp: string;
  type: 'Internal' | 'External';
  circle: string;
  role: string;
  tr: StatusCode;
  kr: StatusCode;
  lm: StatusCode;
  /** Raw overall-status label from the API (e.g. "In Progress", "Need Action"), when available. */
  overallLabel?: string;
  email?: string;
  mobile?: string;
};

export const DIRECTORY: DirectoryUser[] = [
  { name: 'Vaibhav Sawant', emp: '55003257', type: 'Internal', circle: 'Maharashtra', role: 'Territory Sales Exec', tr: 'ok', kr: 'ok', lm: 'ok' },
  { name: 'S Jeevanantham', emp: '22014513', type: 'Internal', circle: 'Tamil Nadu', role: 'Territory Sales Mgr', tr: 'ok', kr: 'ok', lm: 'ok' },
  { name: 'Nilesh Sutar', emp: '55003261', type: 'Internal', circle: 'Maharashtra', role: 'Territory Sales Exec', tr: 'ok', kr: 'pending', lm: 'na' },
  { name: 'Shivani Gupta', emp: '22014512', type: 'Internal', circle: 'Haryana', role: 'Opex & Billing Engg', tr: 'ok', kr: 'ok', lm: 'ok' },
  { name: 'Hirok Paul', emp: '55003248', type: 'Internal', circle: 'Assam & NESA', role: 'Territory Sales Exec', tr: 'ok', kr: 'pending', lm: 'na' },
  { name: 'Neeraj Gautam', emp: '55003246', type: 'Internal', circle: 'UP East', role: 'Territory Sales Exec', tr: 'fail', kr: 'na', lm: 'na' },
  { name: 'Sagar Teradal', emp: '22014510', type: 'Internal', circle: 'Karnataka', role: 'Territory Sales Exec', tr: 'ok', kr: 'ok', lm: 'ok' },
  { name: 'Sudhakar M', emp: '—', type: 'External', circle: 'Tamil Nadu', role: 'Marketing (Contractor)', tr: 'fail', kr: 'pending', lm: 'na' },
  { name: 'Jothika K', emp: '7200002285', type: 'External', circle: 'Tamil Nadu', role: 'Sales (Contractor)', tr: 'ok', kr: 'ok', lm: 'ok' },
  { name: 'Arbaz Shaikh', emp: 'S00253685', type: 'External', circle: 'Maharashtra', role: 'HR (Contractor)', tr: 'fail', kr: 'na', lm: 'na' },
  { name: 'Sadiq Basha A', emp: '9087733709', type: 'External', circle: 'Tamil Nadu', role: 'Sales (Contractor)', tr: 'ok', kr: 'pending', lm: 'na' },
  { name: 'Bobby Thakur', emp: '2003999989', type: 'External', circle: 'UP West', role: 'Postpaid (Contractor)', tr: 'ok', kr: 'ok', lm: 'ok' },
  { name: 'Bal Mukund Prajapati', emp: '—', type: 'External', circle: 'MP & CG', role: 'Sales (Contractor)', tr: 'fail', kr: 'na', lm: 'na' },
  { name: 'Alavudeen J', emp: 'Vi', type: 'External', circle: 'Tamil Nadu', role: 'Sales (Contractor)', tr: 'ok', kr: 'ok', lm: 'ok' },
  { name: 'DILEEP Kumar Verma', emp: '—', type: 'External', circle: 'MP & CG', role: 'Sales (Contractor)', tr: 'ok', kr: 'pending', lm: 'na' },
];

export const HEATMAP_DATA: Array<[string, number, number, number, number, number]> = [
  ['Maharashtra & Goa', 96, 92, 88, 95, 94],
  ['Tamil Nadu', 94, 91, 90, 96, 93],
  ['Karnataka', 92, 89, 87, 92, 91],
  ['UP East', 88, 84, 82, 88, 86],
  ['UP West', 87, 82, 80, 85, 83],
  ['Delhi NCR', 95, 93, 91, 94, 96],
  ['Bihar', 84, 74, 68, 62, 71],
  ['Assam', 82, 76, 71, 55, 70],
  ['Kolkata', 85, 78, 74, 70, 73],
  ['NESA', 83, 79, 75, 68, 74],
];

export const UNDERPERFORM = [
  { name: 'Bihar', score: 71.8, note: 'KRCC & LMC growth opportunity' },
  { name: 'Assam', score: 73.1, note: 'SMT visit coverage building' },
  { name: 'NESA', score: 75.6, note: 'External approval throughput ramping' },
  { name: 'Kolkata', score: 76.2, note: 'KRCC aging in focus' },
  { name: 'MP & Chhattisgarh', score: 81.4, note: 'LMC volume rebuilding' },
];

export const LMC_TOP = [
  { name: 'Shivaji Bakale', func: 'Sales · Maharashtra', count: 184 },
  { name: 'Suhail R', func: 'Sales · Tamil Nadu', count: 156 },
  { name: 'Feroj Shaikh', func: 'Sales · Maharashtra', count: 142 },
  { name: 'Shekhar Rana', func: 'Technology · Haryana', count: 128 },
  { name: 'Rakesh M', func: 'Sales · Karnataka', count: 118 },
  { name: 'Agnijeeta Banik', func: 'S&D · Assam', count: 96 },
  { name: 'Anoop Kumar', func: 'Sales · UP East', count: 88 },
];

export const TRAIN_FAILS = [
  { user: 'Bal Mukund Prajapati', tr: 'First Aid Training', type: 'External', date: '18 Jul 2026', score: 42 },
  { user: 'Alavudeen J', tr: 'Electrical Safety', type: 'External', date: '17 Jul 2026', score: 38 },
  { user: 'Sudhakar M', tr: 'Fire Handling', type: 'External', date: '17 Jul 2026', score: 44 },
  { user: 'Arbaz Shaikh', tr: 'Working at Heights', type: 'External', date: '16 Jul 2026', score: 41 },
  { user: 'Deepak Patel', tr: 'First Aid Training', type: 'External', date: '15 Jul 2026', score: 39 },
  { user: 'Yogesh Yadav', tr: 'Electrical Safety', type: 'Internal', date: '14 Jul 2026', score: 46 },
  { user: 'Niraj Rajput', tr: 'Fire Handling', type: 'External', date: '14 Jul 2026', score: 43 },
];

export const SMT_RECENT = [
  { name: 'Ashok Singh', func: 'Sales & Distribution', circle: 'UP West', area: 'Bareilly Zonal Office', date: 'Today 11:24' },
  { name: 'Mandeep Kaur', func: 'Postpaid', circle: 'Punjab', area: 'Gill Road', date: 'Today 10:12' },
  { name: 'Rahul Wahal', func: 'COO Office', circle: 'AP', area: 'Mehboob Nagar', date: 'Today 09:48' },
  { name: 'Arun Asawa', func: 'Finance', circle: 'Kolkata', area: 'Constantia', date: 'Today 09:22' },
  { name: 'Akila Thiyagarajan', func: 'Customer Service', circle: 'Tamil Nadu', area: 'Kumbakonam Store', date: 'Yesterday' },
  { name: 'Sourav Das', func: 'Sales & Distribution', circle: 'Bengal', area: 'Laxmikantapur', date: 'Yesterday' },
  { name: 'Anup Basak', func: 'Technology', circle: 'Kolkata', area: 'Siliguri MSC', date: '2 days ago' },
];

export const SMT_BELOW = [
  { name: 'Bihar', visits: 12, target: 20 },
  { name: 'NESA', visits: 14, target: 20 },
  { name: 'Odisha', visits: 15, target: 20 },
  { name: 'MP & Chhattisgarh', visits: 17, target: 20 },
  { name: 'Assam', visits: 18, target: 20 },
];

export const LMC_WEEK = [
  { label: 'Mon', pct: 92, val: '1,140', color: C.ok },
  { label: 'Tue', pct: 96, val: '1,204', color: C.ok },
  { label: 'Wed', pct: 81, val: '998', color: C.teal },
  { label: 'Thu', pct: 89, val: '1,102', color: C.ok },
  { label: 'Fri', pct: 100, val: '1,284', color: C.ok },
  { label: 'Sat', pct: 52, val: '641', color: C.warn },
  { label: 'Sun', pct: 18, val: '218', color: C.warn },
];

export const LMC_STATUS = [
  { label: 'Completed', pct: 88, val: '26,412', color: C.ok },
  { label: 'In Progress', pct: 8, val: '2,384', color: C.teal },
  { label: 'Pending', pct: 4, val: '1,138', color: C.warn },
];

export const SMT_FREQ = [
  { label: '1 visit only', pct: 38, val: '42', color: C.vi },
  { label: '2–3 visits', pct: 64, val: '78', color: C.warn },
  { label: '4–6 visits', pct: 88, val: '112', color: C.teal },
  { label: '7+ visits', pct: 100, val: '148', color: C.ok },
];

export const USER_COMP = [
  { name: 'Internal FTE', value: 19204, color: C.blue },
  { name: 'External NON-FTE', value: 8234, color: C.terra },
];

export const USER_REG_12MO = [
  { m: 'Aug', n: 142 }, { m: 'Sep', n: 182 }, { m: 'Oct', n: 210 }, { m: 'Nov', n: 268 },
  { m: 'Dec', n: 290 }, { m: 'Jan', n: 318 }, { m: 'Feb', n: 362 }, { m: 'Mar', n: 398 },
  { m: 'Apr', n: 442 }, { m: 'May', n: 478 }, { m: 'Jun', n: 520 }, { m: 'Jul', n: 412 },
];

export const USERS_PER_CIRCLE_STACKED = [
  { name: 'Maharashtra & Goa', Internal: 2148, External: 820 },
  { name: 'Tamil Nadu', Internal: 1980, External: 760 },
  { name: 'Karnataka', Internal: 1720, External: 690 },
  { name: 'UP East', Internal: 1520, External: 610 },
  { name: 'UP West', Internal: 1440, External: 580 },
  { name: 'Andhra Pradesh', Internal: 1280, External: 530 },
  { name: 'Delhi NCR', Internal: 1120, External: 470 },
  { name: 'Kolkata', Internal: 980, External: 410 },
  { name: 'Bihar', Internal: 880, External: 370 },
  { name: 'Assam', Internal: 740, External: 330 },
  { name: 'NESA', Internal: 680, External: 290 },
  { name: 'Kerala', Internal: 620, External: 270 },
  { name: 'Gujarat', Internal: 580, External: 250 },
  { name: 'Rajasthan', Internal: 540, External: 240 },
  { name: 'MP & CG', Internal: 510, External: 220 },
];

export const USERS_BY_FUNC = [
  { name: 'Sales', value: 8412, color: C.terra },
  { name: 'Sales & Distribution', value: 4820, color: C.sage },
  { name: 'Technology', value: 3120, color: C.blue },
  { name: 'Postpaid', value: 2680, color: C.teal },
  { name: 'Marketing', value: 1948, color: C.lav },
  { name: 'HR', value: 1642, color: C.warn },
  { name: 'Customer Service', value: 1284, color: C.err },
  { name: 'Finance', value: 1042, color: C.ok },
  { name: 'Others', value: 2490, color: '#B4A38A' },
];

export const KRCC_STATUS = [
  { name: 'Cleared', value: 23972, color: C.ok },
  { name: 'Pending', value: 2891, color: C.warn },
  { name: 'Not Started', value: 575, color: C.err },
];

export const KRCC_AGING = [
  { label: '0 – 3 days', pct: 34, val: '982', color: C.ok },
  { label: '4 – 7 days', pct: 58, val: '1,696', color: C.teal },
  { label: '8 – 14 days', pct: 38, val: '148', color: C.warn },
  { label: '15+ days · High Priority', pct: 18, val: '65', color: C.vi },
];

export const KRCC_BY_CIRCLE = [
  { name: 'Delhi', pct: 93, color: C.ok },
  { name: 'Mah', pct: 92, color: C.ok },
  { name: 'TN', pct: 91, color: C.teal },
  { name: 'Kar', pct: 89, color: C.teal },
  { name: 'Guj', pct: 88, color: C.teal },
  { name: 'UP-E', pct: 84, color: C.warn },
  { name: 'UP-W', pct: 82, color: C.warn },
  { name: 'MP', pct: 81, color: C.warn },
  { name: 'Assam', pct: 76, color: C.warn },
  { name: 'Bihar', pct: 74, color: C.vi },
  { name: 'Kol', pct: 78, color: C.warn },
  { name: 'NESA', pct: 79, color: C.warn },
];

export const KRCC_CATEGORY = [
  { name: 'Electrical Safety', value: 4820, color: C.terra },
  { name: 'PPE Compliance', value: 5240, color: C.ok },
  { name: 'Fire Safety', value: 4210, color: C.vi },
  { name: 'Working at Height', value: 3680, color: C.warn },
  { name: 'General Safety', value: 3132, color: C.sage },
  { name: 'Vehicle Safety', value: 2890, color: C.blue },
];

export const KRCC_TURNAROUND = [
  { name: 'Maharashtra & Goa', days: 3.2, color: C.ok },
  { name: 'Tamil Nadu', days: 3.6, color: C.ok },
  { name: 'Delhi NCR', days: 3.4, color: C.ok },
  { name: 'Karnataka', days: 4.1, color: C.teal },
  { name: 'Gujarat', days: 4.4, color: C.teal },
  { name: 'UP East', days: 5.6, color: C.warn },
  { name: 'Kolkata', days: 6.2, color: C.warn },
  { name: 'Assam', days: 7.4, color: C.vi },
  { name: 'Bihar', days: 8.9, color: C.vi },
];

export const TRAIN_PF = [
  { name: 'Pass', value: 25142, color: C.ok },
  { name: 'Fail', value: 2271, color: C.vi },
];

export const TRAIN_INT_EXT_BARS = [
  { group: 'INTERNAL FTE (n=19,204)', rows: [
    { label: 'Pass', pct: 94, val: '94.2%', color: C.ok },
    { label: 'Fail', pct: 6, val: '5.8%', color: C.vi },
  ]},
  { group: 'EXTERNAL NON-FTE (n=8,209)', rows: [
    { label: 'Pass', pct: 85, val: '85.9%', color: C.teal },
    { label: 'Fail', pct: 14, val: '14.1%', color: C.vi },
  ]},
];

export const TRAIN_BY_NAME = [
  { name: 'First Aid', value: 4820, color: C.sage },
  { name: 'Electrical', value: 3910, color: C.sage },
  { name: 'Fire', value: 2840, color: C.sage },
  { name: 'Heights', value: 2210, color: C.sage },
  { name: 'Chemical', value: 1420, color: C.sage },
  { name: 'Others', value: 1810, color: C.sage },
];

export const TRAIN_CATEGORY = [
  { name: 'Statutory Compliance', value: 6200, color: C.terra },
  { name: 'Technical Safety', value: 5400, color: C.blue },
  { name: 'Emergency Response', value: 2800, color: C.vi },
  { name: 'Behavioral Safety', value: 1600, color: C.sage },
  { name: 'Induction', value: 1010, color: C.lav },
];

export const TRAIN_SCORE = [
  { bucket: '0-40', n: 420, color: '#E7848E' },
  { bucket: '41-50', n: 812, color: '#EDC488' },
  { bucket: '51-60', n: 1041, color: '#EDC488' },
  { bucket: '61-70', n: 2140, color: '#9EC8BA' },
  { bucket: '71-80', n: 3820, color: '#9EC8BA' },
  { bucket: '81-90', n: 4610, color: '#108C72' },
  { bucket: '91-100', n: 2999, color: '#108C72' },
];

export const LMC_DAILY = [820,910,880,940,960,1020,540,240,1140,1204,998,1102,1284,641,218,1050,1140,1188,1220,1256,720,320,1290,1310,1298,1340,1360,780,290,1284]
  .map((n, i) => ({ d: `Day ${i + 1}`, n }));

export const LMC_BY_FUNC = [
  { name: 'Sales', value: 42, color: C.terra },
  { name: 'S&D', value: 28, color: C.sage },
  { name: 'Technology', value: 15, color: C.blue },
  { name: 'Postpaid', value: 10, color: C.teal },
  { name: 'Others', value: 5, color: C.warn },
];

export const LMC_TREND_12MO = [
  { m: 'Aug', n: 24200 }, { m: 'Sep', n: 25100 }, { m: 'Oct', n: 25800 }, { m: 'Nov', n: 26400 },
  { m: 'Dec', n: 27100 }, { m: 'Jan', n: 27800 }, { m: 'Feb', n: 28200 }, { m: 'Mar', n: 28900 },
  { m: 'Apr', n: 29400 }, { m: 'May', n: 29800 }, { m: 'Jun', n: 30100 }, { m: 'Jul', n: 29876 },
];

export const SMT_BY_CIRCLE = [
  { name: 'Mah & Goa', n: 38 },
  { name: 'Tamil Nadu', n: 36 },
  { name: 'Karnataka', n: 34 },
  { name: 'UP East', n: 32 },
  { name: 'UP West', n: 29 },
  { name: 'Andhra', n: 28 },
  { name: 'Delhi NCR', n: 26 },
  { name: 'Kolkata', n: 24 },
  { name: 'Bihar', n: 22 },
  { name: 'Assam', n: 18 },
  { name: 'NESA', n: 15 },
  { name: 'Kerala', n: 12 },
];

export const SMT_BY_FUNC = [
  { name: 'S&D', value: 32, color: C.sage },
  { name: 'Sales', value: 26, color: C.terra },
  { name: 'Tech', value: 15, color: C.blue },
  { name: 'Customer Svc', value: 12, color: C.teal },
  { name: 'Finance', value: 8, color: C.warn },
  { name: 'Others', value: 7, color: C.lav },
];

export type AnalyticsItem = {
  id: string;
  type: 'kpi' | 'chart';
  label: string;
};

export const ANALYTICS_CATALOG: { key: string; label: string; items: AnalyticsItem[] } = {
  key: 'msafe',
  label: 'M-Safe',
  items: [
    { id: 'kpi-users', type: 'kpi', label: 'Total Users' },
    { id: 'kpi-krcc', type: 'kpi', label: 'KRCC Approved' },
    { id: 'kpi-lmc', type: 'kpi', label: 'LMC — Today' },
    { id: 'kpi-training', type: 'kpi', label: 'Training Pass Rate · Internal' },
    { id: 'kpi-smt', type: 'kpi', label: 'SMT Visits · This Month' },
    { id: 'userComp', type: 'chart', label: 'User Composition (Internal vs External)' },
    { id: 'userReg', type: 'chart', label: 'New Registrations — Last 12 Months' },
    { id: 'circleUsers', type: 'chart', label: 'Users per Circle' },
    { id: 'userFunc', type: 'chart', label: 'Users by Department / Function' },
    { id: 'krccCircle', type: 'chart', label: 'KRCC Clearance % by Circle' },
    { id: 'krccCategory', type: 'chart', label: 'KRCC Cleared by Category' },
    { id: 'lmcDaily', type: 'chart', label: 'Daily LMC Volume — Last 30 Days' },
    { id: 'lmcFunc', type: 'chart', label: 'LMC by Function' },
    { id: 'lmcTrend12mo', type: 'chart', label: 'LMC Completion Trend — 12 Months' },
    { id: 'trainPF', type: 'chart', label: 'Training Pass vs Fail Rate' },
    { id: 'trainCategory', type: 'chart', label: 'Category-wise Trainings' },
    { id: 'smtCircle', type: 'chart', label: 'SMT Visits by Circle' },
    { id: 'smtFunc', type: 'chart', label: 'SMT Visits by Function' },
  ],
};

export const ALERTS = [
  { id: 'krcc-stale', label: '213 KRCC checks pending > 7 days', warn: false },
  { id: 'ext-approval-pending', label: '86 external approvals awaiting', warn: false },
  { id: 'train-fail', label: '34 training re-attempts due', warn: true },
  { id: 'smt-gap-circles', label: '5 circles building SMT visit coverage', warn: false },
];

export type KpiDef = {
  id: string;
  label: string;
  value: string;
  sub?: string;
  group: 'users' | 'krcc' | 'training' | 'lmc' | 'smt';
  color?: string;
  tint?: string;
  infoKey: string;
  download: string;
  /** When set, the KPI card's download button hits
   *  `msafe_dashboard_report/report_template?export_for=<exportFor>` for a server-generated
   *  Excel report instead of exporting the single on-screen value/sub client-side. */
  exportFor?: string;
  /** Hidden from the KPI Overview grid, but kept here in case it's needed again. */
  hidden?: boolean;
};

export const ADMIN_KPIS: KpiDef[] = [
  {
    id: 'users',
    label: 'Total Active Users',
    value: '27,438',
    group: 'users',
    color: C.terra,
    tint: 'rgba(218,119,86,.12)',
    infoKey: 'kpi-users',
    download: 'Users',
    exportFor: 'total_users',
  },
  {
    id: 'krcc-filled',
    label: 'KRCC Filled',
    value: '26,863',
    group: 'krcc',
    color: C.warn,
    tint: 'rgba(237,196,136,.22)',
    infoKey: 'krcc-filled',
    download: 'KRCC',
    exportFor: 'krcc_filled',
  },
  {
    id: 'krcc-approved',
    label: 'KRCC Approved',
    value: '23,972',
    sub: '(87.4%)',
    group: 'krcc',
    color: C.ok,
    tint: 'rgba(16,140,114,.14)',
    infoKey: 'kpi-krcc',
    download: 'KRCC',
    exportFor: 'krcc_approved',
  },
  {
    id: 'krcc-pending',
    label: 'KRCC Pending',
    value: '2,891',
    group: 'krcc',
    color: C.warn,
    tint: 'rgba(237,196,136,.22)',
    infoKey: 'krcc-pending',
    download: 'KRCC',
    exportFor: 'krcc_pending',
  },
  {
    id: 'krcc-rejected',
    label: 'KRCC Rejected',
    value: '2,891',
    sub: '(12.6%)',
    group: 'krcc',
    color: C.err,
    tint: 'rgba(231,132,142,.15)',
    infoKey: 'krcc-rejected',
    download: 'KRCC',
    exportFor: 'krcc_rejected',
  },
  {
    id: 'krcc-not-started',
    label: 'KRCC Not Started',
    value: '1,460',
    group: 'krcc',
    color: C.vi,
    tint: 'rgba(238,39,55,.12)',
    infoKey: 'krcc-not-started',
    download: 'KRCC',
    exportFor: 'krcc_not_started',
  },
  {
    id: 'train-cat',
    label: 'Category-wise Training Completed',
    value: '84.6%',
    group: 'training',
    color: C.blue,
    tint: 'rgba(107,155,204,.16)',
    infoKey: 'train-category-kpi',
    download: 'Training',
    hidden: true,
  },
  {
    id: 'train-user',
    label: 'User-wise Training Completion',
    value: '25,142',
    sub: '(91.6%)',
    group: 'training',
    color: C.teal,
    tint: 'rgba(158,200,186,.26)',
    infoKey: 'train-uservise-kpi',
    download: 'Training',
    hidden: true,
  },
  {
    id: 'train-int',
    label: 'Training Pass Rate · Internal',
    value: '94.2%',
    group: 'training',
    color: C.sage,
    tint: 'rgba(121,140,94,.16)',
    infoKey: 'train-pass-internal',
    download: 'Training',
    hidden: true,
  },
  {
    id: 'train-ext',
    label: 'Training Pass Rate · External',
    value: '85.9%',
    group: 'training',
    color: C.terra,
    tint: 'rgba(218,119,86,.14)',
    infoKey: 'train-pass-external',
    download: 'Training',
    hidden: true,
  },
  {
    id: 'lmc',
    label: 'LMC — Today',
    value: '1,284',
    group: 'lmc',
    color: C.blue,
    tint: 'rgba(107,155,204,.16)',
    infoKey: 'kpi-lmc',
    download: 'LMC',
    hidden: true,
  },
  {
    id: 'smt',
    label: 'SMT Visits · This Month',
    value: '438',
    group: 'smt',
    color: C.lav,
    tint: 'rgba(206,203,246,.28)',
    infoKey: 'kpi-smt',
    download: 'SMT Visits',
    hidden: true,
  },
];

export function overallStatus(u: DirectoryUser): { t: string; c: string } {
  const label = u.overallLabel?.trim();
  if (label) {
    const s = label.toLowerCase();
    if (/action|fail|reject/.test(s)) return { t: label, c: 'b-err' };
    if (/progress|pending/.test(s)) return { t: label, c: 'b-warn' };
    if (/clear|complete|compliant/.test(s)) return { t: label, c: 'b-ok' };
    return { t: label, c: 'b-warn' };
  }
  if (u.tr === 'fail' || u.kr === 'fail') return { t: 'Needs Action', c: 'b-err' };
  if (u.tr === 'pending' || u.kr === 'pending' || u.lm === 'pending' || u.kr === 'na' || u.lm === 'na') {
    return { t: 'In Progress', c: 'b-warn' };
  }
  return { t: 'Fully Cleared', c: 'b-ok' };
}

export function heatmapClass(v: number): string {
  if (v < 70) return 'c1';
  if (v < 85) return 'c2';
  if (v < 95) return 'c3';
  return 'c4';
}
