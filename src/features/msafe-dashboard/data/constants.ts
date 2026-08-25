export const C = {
  terra: '#DA7756',
  sage: '#798C5E',
  teal: '#9EC8BA',
  lav: '#CECBF6',
  blue: '#6B9BCC',
  ok: '#108C72',
  warn: '#EDC488',
  err: '#E7848E',
  border: '#C4B89D',
  dark: '#2C2C2C',
  vi: '#EE2737',
  viDark: '#C81F2C',
  bg: '#F6F4EE',
} as const;

export const CIRCLES = [
  'Maharashtra & Goa',
  'Tamil Nadu',
  'Karnataka',
  'UP East',
  'UP West',
  'Andhra Pradesh',
  'Delhi NCR',
  'Kolkata',
  'Bihar',
  'Assam',
  'NESA',
  'Kerala',
  'Gujarat',
  'Rajasthan',
  'MP & Chhattisgarh',
  'Punjab',
  'Haryana',
  'Odisha',
  'J&K',
  'HP',
  'Telangana',
  'Chennai',
] as const;

export const FUNCTIONS = [
  'Sales',
  'Sales & Distribution',
  'Technology',
  'Postpaid',
  'Customer Service',
  'Finance',
  'HR',
  'Marketing',
] as const;

export const ZONES = [
  'All Zones',
  'Worli',
  'Andheri',
  'Thane',
  'Pune',
  'Nashik',
  'Nagpur',
  'Kolhapur',
  'Goa',
] as const;

export const INFO_TEXTS: Record<string, string> = {
  // KPI cards (Overview)
  'kpi-users':
    'Count of every user record in M-Safe · Internal FTE + External NON-FTE combined · does not include deleted users.',
  'krcc-filled':
    'Users who have submitted their KRCC form, regardless of approval outcome · (Total Registered − Not Started).',
  'kpi-krcc':
    'KRCC records with status = "Completed" · shown as count and as a % of total registered users.',
  'krcc-not-started':
    'Users registered in M-Safe who have not yet initiated their KRCC form.',
  'kpi-lmc':
    'Distinct LMC records created today (00:00 to now) across all managers. A user counted once even if reviewed by multiple managers.',
  'train-category-kpi':
    'Average completion % across all 5 training categories (Statutory Compliance, Technical Safety, Behavioral Safety, Emergency Response, Induction).',
  'train-uservise-kpi':
    'Distinct users who have passed at least their required training · shown as count and as % of total registered users.',
  'train-pass-internal':
    '(Internal FTE Passed ÷ Internal FTE Total) × 100 · Internal training records only.',
  'train-pass-external':
    '(External NON-FTE Passed ÷ External NON-FTE Total) × 100 · External training records only.',
  'kpi-smt':
    'Count of SMT visit records created in the current calendar month · one entry per visit per site.',
  // Heatmap
  heatmap:
    'Each cell shows % compliance for that circle × module. Green >95%, Teal 85-95%, Amber 70-85%, Red <70%. Click any cell for the underlying user list.',
  'priority-circles':
    'Ranked by weighted score across all 5 modules · circles at the bottom receive support-focus attention. Weights: KRCC 30%, LMC 25%, Training 20%, SMT 15%, External 10%.',
  // Users
  'user-comp':
    'Split of total users by employment type · Internal FTE (Vodafone Idea employees) vs External NON-FTE (contractors, channel partners, vendors).',
  'user-reg':
    'Users first registered in M-Safe per calendar month · reflects new joiners onboarding into the safety system. Always shows the trailing 12 months — the applied date filter does not affect this chart.',
  'user-circle':
    'Users assigned to each VIL circle · stacked by employment type · top 15 circles by user count.',
  'user-func':
    'Distribution across department/function values (Sales, Technology, HR etc.).',
  // KRCC
  'krcc-status':
    'KRCC clearance status distribution · Cleared = check completed · Pending = initiated but not closed · Not Started = user registered but check not yet begun.',
  'krcc-aging':
    'How long each pending KRCC has been open · calculated from KRCC initiation date to today. Always a live snapshot as of today — the applied date filter does not affect this chart.',
  'krcc-circle':
    '% KRCC-cleared users per circle · (Cleared ÷ Total Registered in Circle) × 100. Bar color reflects the compliance band: green ≥98%, amber 95%–<98%, red <95%.',
  'krcc-category':
    'Cleared KRCC records grouped by check category (Electrical Safety, PPE Compliance, Fire Safety, Working at Height, General Safety, Vehicle Safety).',
  'krcc-turnaround':
    'Average number of calendar days from KRCC initiation to clearance, by circle.',
  // LMC
  'lmc-daily':
    'Distinct LMC records per day for the last 30 calendar days · counts every unique manager-reportee sign-off.',
  'lmc-week':
    'This week: LMC sign-off count per day · bars are shaded by relative day performance.',
  'lmc-managers':
    'Top managers ranked by LMC records created in the last 30 days · one point per LMC signed.',
  'lmc-func':
    'LMC sign-offs grouped by the "function" field on the manager profile.',
  'lmc-status':
    'Current status distribution of every LMC record in the system this month.',
  'lmc-trend-12mo':
    'Monthly LMC sign-off volume over the last 12 months — long-term view vs the 30-day daily chart above.',
  // Training
  'train-pf':
    'Pass = training record has status "Passed" · Fail = status "Failed" · pending records excluded. for "Defensive Driving, "Work @ Height" , "Underground", "Electrical" for intrnal training only',

  'train-int-ext':
    'Pass rate for internal FTE vs external NON-FTE users · calculated separately over each cohort.',
  'train-name':
    'Number of training records per training programme name · top 5 shown.',
  'train-category':
    'Training records rolled up into 5 higher-level categories (Statutory Compliance, Technical Safety, Emergency Response, Behavioral Safety, Induction) · same underlying records as "Training by Name", grouped differently.',
  'train-function-status':
    'Pass/Fail/Pending training breakdown by function · toggle Internal/External to switch which cohort each function\'s numbers reflect.',
  'train-circle-status':
    'Pass/Fail/Pending % of training records by circle · bars are stacked to 100%.',
  'train-score':
    'Distribution of actual scores where recorded · records with null score excluded (n=15,842 of 27,413).',
  'train-fails':
    'Latest training records with status = Failed · users must re-attempt within 7 days of failure.',
  // SMT
  'smt-circle':
    'SMT visits logged this calendar month per circle · ranked top-to-bottom.',
  'smt-func':
    'SMT visits grouped by the function of the senior manager who logged the visit.',
  'smt-freq':
    'How many times each site received an SMT visit last quarter · buckets from 1-visit to 7+ visits.',
  'smt-recent':
    'Most recent SMT visit records · newest first.',
  'smt-progress':
    'Circles working toward the 20-visits/month target · shows current visit count vs target.',
  'smt-role-wise':
    'Same 11 roles on the X-axis for every circle · use Previous/Next Circle to switch circles — each role shows a grouped bar per month (Apr–Mar) from monthly_data, not total_smt_visits · hover a bar for its exact circle/role/month value.',
  // Directory
  directory:
    'Every M-Safe user with real-time status across all three checks (Training, KRCC, LMC). Click any row for full drill-down.',
};

export type AccordionKey = 'users' | 'krcc' | 'training' | 'lmc' | 'smt' | null;
export type Persona = 'admin' | 'circle';
export type ModuleView = 'msafe' | 'mydashboard';
export type StatusCode = 'ok' | 'pending' | 'fail' | 'na';
