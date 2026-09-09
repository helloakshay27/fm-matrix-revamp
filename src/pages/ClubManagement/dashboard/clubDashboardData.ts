// Static wireframe data for the Club Management Dashboard (v6).
// Ported 1:1 from the club_management_dashboard_v6.html wireframe.

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export const PALETTE = {
  terra: '#DA7756',
  sage: '#798C5E',
  teal: '#9EC8BA',
  lav: '#CECBF6',
  blue: '#6B9BCC',
  warn: '#EDC488',
  err: '#E7848E',
  ok: '#108C72',
  green: '#17572C',
  green2: '#2d8a4a',
};

export const D = {
  joins: [12, 15, 9, 18, 14, 14],
  expiries: [5, 7, 6, 4, 8, 6],
  planLabels: ['Annual', 'Quarterly', 'Monthly', 'Family', 'Corporate'],
  planCounts: [94, 61, 38, 29, 16],
  planRevenue: [52000, 31000, 24000, 17000, 14000],
  payPlanLabels: ['Yearly', 'Half-Yearly', 'Quarterly', 'Monthly'],
  payPlanCounts: [94, 29, 99, 16],
  occupancyByDay: [61, 58, 65, 63, 71, 82, 78],
  leadTime: [28, 35, 26, 11],
  cancelRate: [4.2, 5.1, 3.8, 4.5, 3.2, 2.9],
  collEfficiency: [76, 78, 80, 81, 83, 82],
  ticketAging: [5, 3, 2, 1],
  ticketCats: [5, 4, 2],
  eventNames: ['Festival CL', 'Indoor Football', 'Cricket #1', 'Cricket #2', 'Tennis', 'Fitness Boot'],
  eventFill: [73, 75, 80, 88, 60, 31],
  amenNames: ['Padel 1', 'Badminton A', 'Gym', 'All Day', 'Kabaddi', 'Chess'],
  capacity: [82, 70, 55, 44, 38, 31],
  cancelAmen: [4.1, 2.8, 1.9, 6.2, 3.5, 1.2],
  monthAmenLabels: ['Apr', 'May', 'Jun'],
  monthAmenData: [
    [30, 31, 32],
    [27, 28, 28],
    [24, 23, 22],
    [13, 12, 12],
    [6, 6, 6],
  ],
  bookTotals: {
    day: { total: 18, member: 15, guest: 2, staff: 1 },
    week: { total: 94, member: 64, guest: 20, staff: 10 },
    month: { total: 480, member: 326, guest: 106, staff: 48 },
    year: { total: 2840, member: 1931, guest: 624, staff: 285 },
  },
  refundTotals: { day: '₹0', week: '₹1,800', month: '₹8,400', year: '₹42,000' },
  refundCtx: {
    day: 'No refunds processed today.',
    week: '2 refunds this week.',
    month: '6 refunds this month.',
    year: '28 refunds this year.',
  },
  memPeriod: {
    month: {
      active: 238, joins: 14, expiry: 6, churn: '2.1%', retention: '96.8%',
      retCtx: 'vs 96.2% last month ▲', newCtx: 'vs 8 last month ▲75%', expCtx: '4 auto-renew set',
    },
    quarter: {
      active: 238, joins: 38, expiry: 18, churn: '2.4%', retention: '96.2%',
      retCtx: 'vs 96.0% last quarter ▲', newCtx: 'vs 31 last quarter ▲22%', expCtx: '14 auto-renew set',
    },
    year: {
      active: 238, joins: 112, expiry: 94, churn: '2.8%', retention: '95.8%',
      retCtx: 'YTD · below 3% target ✓', newCtx: 'vs 98 last year ▲14%', expCtx: '76 auto-renew set',
    },
  },
} as const;

export type MemPeriodKey = keyof typeof D.memPeriod;
export type BookPeriodKey = keyof typeof D.bookTotals;
export type RefundPeriodKey = keyof typeof D.refundTotals;

export const SA = {
  branchRev: [
    [10.1, 10.8, 11.2, 11.9, 12.0, 12.4],
    [8.9, 9.2, 9.4, 9.8, 9.9, 10.1],
    [9.1, 9.0, 8.8, 9.0, 9.0, 8.9],
    [8.4, 8.1, 7.9, 7.6, 7.4, 7.2],
  ],
  netGrowth: [
    [7, 8, 3, 14, 6, 8],
    [5, 6, 4, 9, 3, 6],
    [3, 4, 2, 6, 1, 3],
    [-1, 2, -2, 4, -3, -1],
  ],
  churnRate: [
    [2.4, 2.2, 2.1, 1.9, 2.3, 2.1],
    [3.1, 2.9, 3.0, 2.8, 2.7, 2.8],
    [3.8, 3.5, 3.6, 3.3, 3.4, 3.4],
    [5.1, 4.8, 4.9, 5.2, 4.6, 4.9],
  ],
  arpu: [3974, 4073, 4428, 4768],
  renewConv: [87, 81, 76, 69],
  payFail: [8.2, 7.8, 7.1, 6.9, 6.4, 6.1],
  revMix: [68, 22, 10],
  bookByType: [
    [218, 68, 26],
    [162, 54, 22],
    [131, 44, 18],
    [98, 32, 15],
  ],
  revCatByBranch: [
    [8.4, 2.4, 1.2, 0.5],
    [6.8, 2.0, 1.0, 0.4],
    [5.9, 1.7, 0.9, 0.3],
    [4.8, 1.4, 0.7, 0.3],
  ],
};

export const memTableData = MONTHS.map((m, i) => [m, D.joins[i], D.expiries[i], D.joins[i] - D.expiries[i]]);
export const planTableData = D.planLabels.map((l, i) => [l, D.planCounts[i], (D.planCounts[i] / 238 * 100).toFixed(1) + '%']);
export const revPlanTableData = D.planLabels.map((l, i) => [l, '₹' + D.planRevenue[i].toLocaleString(), (D.planRevenue[i] / 138000 * 100).toFixed(1) + '%']);
export const payPlanTableData = D.payPlanLabels.map((l, i) => [l, D.payPlanCounts[i], ['Lump sum', '2 instalments', '3 instalments', 'Monthly'][i]]);
export const weekdayTableData = [['Monday', '61%'], ['Tuesday', '58%'], ['Wednesday', '65%'], ['Thursday', '63%'], ['Friday', '71%'], ['Saturday', '82%'], ['Sunday', '78%']];
export const leadTimeTableData = [['Same day', '28%'], ['1-2 days', '35%'], ['3-7 days', '26%'], ['8+ days', '11%']];
export const collTrendTableData = MONTHS.map((m, i) => [m, D.collEfficiency[i] + '%']);
export const cancelTableData = MONTHS.map((m, i) => [m, D.cancelRate[i] + '%']);
export const ticketCatTableData = [['Facility', 5, '45%'], ['Billing', 4, '36%'], ['Membership', 2, '18%']];
export const eventTrendTableData = D.eventNames.map((n, i) => [n, D.eventFill[i] + '%', i >= 2 && i <= 3 ? '₹7,200+' : 'Comp.']);
export const monthAmenTableData = D.monthAmenLabels.map((m, i) => [m, D.monthAmenData[0][i] + '%', D.monthAmenData[1][i] + '%', D.monthAmenData[2][i] + '%', D.monthAmenData[3][i] + '%', D.monthAmenData[4][i] + '%']);
export const cancelAmenTableData = D.amenNames.map((n, i) => [n, D.cancelAmen[i] + '%']);
export const revAllTableData = MONTHS.map((m, i) => [m, '₹' + SA.branchRev[0][i] + 'L', '₹' + SA.branchRev[1][i] + 'L', '₹' + SA.branchRev[2][i] + 'L', '₹' + SA.branchRev[3][i] + 'L']);
export const memGrowthTableData = MONTHS.map((m, i) => [m, SA.netGrowth[0][i], SA.netGrowth[1][i], SA.netGrowth[2][i], SA.netGrowth[3][i]]);
export const churnTableData = MONTHS.map((m, i) => [m, SA.churnRate[0][i] + '%', SA.churnRate[1][i] + '%', SA.churnRate[2][i] + '%', SA.churnRate[3][i] + '%']);
export const arpuTableData = [['Branch A', '₹3,974'], ['Branch B', '₹4,073'], ['Branch C', '₹4,428'], ['Branch D', '₹4,768']];
export const payFailTableData = MONTHS.map((m, i) => [m, SA.payFail[i] + '%']);
export const bookTypeAllTableData = ['Branch A', 'Branch B', 'Branch C', 'Branch D'].map((b, i) => [b, SA.bookByType[i][0], SA.bookByType[i][1], SA.bookByType[i][2]]);
export const revCatAllTableData = ['Branch A', 'Branch B', 'Branch C', 'Branch D'].map((b, i) => [b, '₹' + SA.revCatByBranch[i][0] + 'L', '₹' + SA.revCatByBranch[i][1] + 'L', '₹' + SA.revCatByBranch[i][2] + 'L', '₹' + SA.revCatByBranch[i][3] + 'L']);

// Available-slots heatmap: rows = courts, cols = hourly slots
export const HEAT_HOURS = ['6a', '7a', '8a', '9a', '10a', '11a', '5p', '6p', '7p', '8p', '9p', '10p'];
export const HEAT_COURTS = ['Padel 1', 'Badminton A', 'Gym', 'All Day'];
export const HEAT_DATA = [
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 1, 2, 2, 1, 0, 0, 0, 1, 2],
  [4, 2, 7, 11, 15, 16, 9, 6, 7, 10, 13, 17],
  [8, 7, 5, 5, 8, 10, 7, 5, 5, 7, 9, 11],
];

export const CHART_CTX: Record<string, string> = {
  memChart: 'Branch A membership joins vs expiries over 6 months: Jan(joins:12,exp:5), Feb(15,7), Mar(9,6), Apr(18,4), May(14,8), Jun(14,6). Net 6-month gain: +46 members.',
  planChart: 'Membership plan distribution: Annual 94 (39%), Quarterly 61 (26%), Monthly 38 (16%), Family 29 (12%), Corporate 16 (7%). Total 238 active.',
  payPlanChart: 'Members by payment frequency: Yearly lump-sum 94, Half-yearly 29, Quarterly 99, Monthly 16. 53% of members pay in instalments.',
  revPlanChart: 'Monthly revenue by plan type: Annual ₹52K (38%), Quarterly ₹31K, Monthly ₹24K, Family ₹17K, Corporate ₹14K. Total ₹138K monthly membership revenue.',
  bookTypeChart: 'Monthly bookings: Members 326 (68%), Guests 106 (22%), Staff 48 (10%). Total 480 bookings this month.',
  heatmap: 'Available slots today per court per hour: Padel - 0 at peak (7-9AM, 6-10PM), 1 at shoulder. Badminton - 0-2 available. Gym - 2-17 available mid-day. All Day - 5-11 available. 0=fully booked, green=open.',
  weekdayChart: 'Avg amenity utilisation by day: Mon 61%, Tue 58%, Wed 65%, Thu 63%, Fri 71%, Sat 82%, Sun 78%. Weekend average 21pts higher than weekday average.',
  leadTimeChart: 'Booking advance time: Same day 28%, 1-2 days 35%, 3-7 days 26%, 8+ days 11%. 63% of bookings made within 48 hours of the slot.',
  monthAmenChart: 'Bookings by amenity share (Apr-Jun): Padel 30-32%, Badminton 27-28%, Gym 22-24%, All Day 12-13%, Others 6%. Padel consistently the highest.',
  cancelAmenChart: 'Cancellation rates: Padel 4.1%, Badminton 2.8%, Gym 1.9%, All Day Pass 6.2%, Kabaddi 3.5%, Chess 1.2%. Branch avg ~3.1%.',
  payChart: 'Collections status MTD: Paid ₹4.2L (82%), Pending ₹38K (7.5%), Overdue ₹12K (2.4%). Total billed ₹5.1L. Target is 80% collection efficiency.',
  collTrendChart: 'Collection efficiency trend Jan-Jun: 76%, 78%, 80%, 81%, 83%, 82%. Steady improvement over 6 months. Target 80%.',
  methodChart: 'Payment method split: UPI 44%, Card 38%, Wallet 12%, Bank Transfer 6%. UPI dominant.',
  cancelChart: 'Monthly cancellation rate Jan-Jun: 4.2%, 5.1%, 3.8%, 4.5%, 3.2%, 2.9%. Target <3%. Declining trend over past 3 months.',
  capacityBars: 'Amenity utilisation: Padel 82% (bottleneck), Badminton 70%, Gym 55%, All Day 44%, Kabaddi 38%, Chess 31% (underutilised).',
  ticketChart: 'Open tickets by age: 0-2 days 5 tickets, 3-5 days 3, 6-10 days 2, >10 days 1. Total 11 open. 3 risk SLA breach.',
  ticketCatChart: 'Ticket categories: Facility/Maintenance 5 (45%), Billing 4 (36%), Membership 2 (18%). Total 11 open.',
  eventTrendChart: 'Event fill rates: Festival CL 73%, Indoor Football 75%, Cricket #1 80%, Cricket #2 88%, Tennis 60%, Fitness Boot 31%. Paid events average 74%, complimentary 42%.',
  branchScorecard: 'Branch health: A Worli ₹12.4L +6% trend, 74% util, 2.1% churn - Healthy. B Bandra ₹10.1L +2%, 68%, 2.8% - Watch. C Thane ₹8.9L -3%, 58%, 3.4% - Watch. D Dadar ₹7.2L -14%, 44%, 4.9% - At Risk (3 months declining).',
  revAllChart: 'Revenue by branch Jan-Jun (₹L): A 10.1-12.4 (growing), B 8.9-10.1 (stable), C 9.1-8.9 (slight decline), D 8.4-7.2 (steady decline 6 months).',
  mixChart: 'Portfolio revenue mix: Membership 68%, Amenity fees 22%, Events 10%. Total MTD ₹38.6L across 4 branches.',
  memGrowthChart: 'Net membership growth per branch Jan-Jun: A +7,+8,+3,+14,+6,+8. B +5,+6,+4,+9,+3,+6. C +3,+4,+2,+6,+1,+3. D -1,+2,-2,+4,-3,-1 (negative 3 of 6 months).',
  churnChart: 'Monthly churn rate by branch: A 2.4-2.1% (improving), B 3.1-2.8% (stable), C 3.8-3.4% (stable), D 5.1-4.9% (elevated and persistent).',
  renewConvChart: 'Renewal conversion by branch: A 87%, B 81%, C 76%, D 69%. Portfolio avg 79%. Target 85%+.',
  arpuChart: 'ARPU per member per month: A ₹3,974, B ₹4,073, C ₹4,428, D ₹4,768. Higher ARPU at smaller/declining branches.',
  payFailChart: 'Payment failure rate Jan-Jun: 8.2%, 7.8%, 7.1%, 6.9%, 6.4%, 6.1%. Improving across all 4 branches as UPI adoption grows.',
  bookTypeAllChart: 'Cross-branch bookings: A(Members 218, Guests 68, Staff 26), B(162,54,22), C(131,44,18), D(98,32,15). Branch D guest share 27% vs A at 21%.',
  revCatAllChart: 'Revenue by booking category (₹L): A(Member Adult 8.4, Guest Adult 2.4, Member Child 1.2, Guest Child 0.5), B(6.8,2.0,1.0,0.4), C(5.9,1.7,0.9,0.3), D(4.8,1.4,0.7,0.3).',
};

export interface InfoEntry {
  match: string;
  title: string;
  calc: string;
  desc: string;
}

export const INFO: InfoEntry[] = [
  { match: 'New Joins vs Expiries', title: 'New Joins vs Expiries', calc: 'Count of new memberships activated minus memberships expired, per month over 6 months.', desc: 'Shows whether the membership base is growing or shrinking. Positive bars = more joined than left that month.' },
  { match: 'Plan Distribution', title: 'Membership Plan Distribution', calc: 'Count of active members grouped by plan type - Annual, Quarterly, Monthly, Family, Corporate.', desc: 'Annual plans provide the best revenue predictability. High monthly share = renewal risk.' },
  { match: 'Active Membership Days Remaining', title: 'Membership Days Remaining', calc: "Each member's expiry date minus today's date. Free bookings = plan quota minus used.", desc: 'Red <30 days, amber 30-60 days. Members in red need an immediate renewal call.' },
  { match: 'Upcoming Renewals', title: 'Upcoming Renewals', calc: 'All memberships expiring within the current month, sorted by date. Auto-renew status from payment settings.', desc: 'Focus on Retry status and non-auto-renew members first - these are the ones who will be lost without intervention.' },
  { match: 'Membership by Payment Plan', title: 'Membership by Payment Plan', calc: 'Members grouped by payment frequency - Yearly, Half-Yearly, Quarterly, Monthly.', desc: 'Instalment plans create predictable but lumpy monthly cash flow. Shifting to yearly improves cash-flow predictability.' },
  { match: 'Revenue by Plan Type', title: 'Revenue by Plan Type', calc: 'Total membership revenue attributed to each plan category for the current month.', desc: 'Annual plans typically generate disproportionate revenue vs member count - key input for pricing strategy.' },
  { match: 'Group Memberships', title: 'Group Memberships', calc: 'Active group membership plans and total individual members enrolled.', desc: 'Group plans show 94% renewal rate vs 87% for individual - retention benefit of shared commitment.' },
  { match: 'Total Bookings', title: 'Total Bookings', calc: 'Count of all bookings for the selected period, split by Member, Guest, Staff.', desc: 'The core activity metric. Guest share >20% = strong walk-in demand and conversion opportunity.' },
  { match: 'Bookings by Member Type', title: 'Bookings by Member Type', calc: 'Percentage share of bookings - Members vs Guests vs Staff.', desc: 'High guest booking share indicates untapped membership conversion potential.' },
  { match: 'Available Slots', title: 'Available Slots - Heatmap', calc: 'Total bookable slots minus confirmed bookings = empty slots right now, per court per hour.', desc: 'Red=fully booked, Amber=1 slot left, Teal=2-4 available, Green=5+. Tells you exactly where to sell.' },
  { match: 'No-Shows Today', title: 'No-Shows Today', calc: 'Bookings where the member did not check in within the slot window. Penalty applied per policy.', desc: 'No-shows waste capacity. Declining trend confirms the penalty policy is working.' },
  { match: 'Weekday vs Weekend', title: 'Weekday vs Weekend Utilisation', calc: 'Average amenity utilisation per day of the week across all active amenities.', desc: 'Low mid-week (Tue-Wed) is the clearest opportunity for off-peak incentives.' },
  { match: 'Booking Lead Time', title: 'Booking Lead Time Distribution', calc: 'Gap between booking creation and slot date, grouped into time buckets.', desc: '63% within 48 hours = very limited advance revenue visibility. Longer lead times help capacity planning.' },
  { match: 'Monthly Booking % by Amenity', title: 'Monthly Booking % by Amenity', calc: "Each amenity's booking count as a % of total bookings per month, stacked.", desc: 'Padel at 32% means any maintenance on Padel directly impacts total occupancy significantly.' },
  { match: 'Cancellation Rate by Amenity', title: 'Cancellation Rate by Amenity', calc: 'Cancelled / total bookings x 100, per amenity.', desc: 'High rate on All Day Pass (6.2%) suggests impulse booking - a cancellation policy or deposit would help.' },
  { match: 'Amenity Utilisation Analysis', title: 'Amenity Utilisation Analysis', calc: 'Average utilisation % per amenity across all operating hours for the current month.', desc: 'Above 75% = bottleneck. Below 40% = underutilised - consider corporate bookings or coaching to fill.' },
  { match: 'Collections Status', title: 'Collections Status', calc: 'Payment amounts by current status - Paid, Pending, Overdue.', desc: '82% first-attempt collection is above the 80% target. Pending and Overdue need active follow-up.' },
  { match: 'Collection Efficiency Trend', title: 'Collection Efficiency Trend', calc: '(Amount collected / Amount billed) x 100, per month over 6 months.', desc: 'Upward trend means payment processes are improving. Dips signal failed auto-pay or disputes.' },
  { match: 'Payment Method Mix', title: 'Payment Method Mix', calc: '% of payments received via each method - UPI, Card, Wallet, Bank Transfer.', desc: 'UPI and wallet have lower failure rates than cards. Shifting to UPI auto-pay improves efficiency.' },
  { match: 'Total Refund Amount', title: 'Total Refund Amount', calc: 'Sum of all refunds for the selected period.', desc: 'Refund rate above 3% of collected revenue signals a policy gap or process abuse to fix.' },
  { match: 'Cancellation Rate Trend', title: 'Cancellation Rate Trend', calc: 'Total cancelled / total bookings x 100, per month over 6 months.', desc: 'Declining trend confirms cancellation policies are working. A spike needs root-cause investigation.' },
  { match: 'Pending Payments', title: 'Pending Payments', calc: 'All invoices issued but not yet paid and not past due date.', desc: 'Sort by age. Annual renewals are highest value to chase first.' },
  { match: 'Overdue Invoices', title: 'Overdue Invoices', calc: 'Invoices where due date has passed by 7+ days with no payment received.', desc: 'These need immediate escalation - overdue amounts directly impact cash flow.' },
  { match: 'Open Tickets by Age', title: 'Open Tickets by Age', calc: 'Unresolved tickets grouped by age - 0-2 days, 3-5 days, 6-10 days, >10 days.', desc: 'Tickets aging beyond 5 days risk SLA breach. Prioritise the oldest bucket each morning.' },
  { match: 'Ticket Category', title: 'Ticket Category Distribution', calc: 'Open tickets grouped by category.', desc: 'The dominant category reveals the biggest operational pain point. Fix it systematically to reduce volume.' },
  { match: 'Registration Fill Rate', title: 'Event Registration Fill Rate', calc: '(Registered / Total capacity) x 100, per upcoming event.', desc: 'Events above 80% = near sellout, increase capacity. Below 40% = needs a promotional push.' },
  { match: 'Event Registration Trend', title: 'Event Registration Trend', calc: 'Fill rate % per recent event, colour coded green >=70%, amber >=50%, red <50%.', desc: 'Paid events consistently outperform complimentary. Supports nominal pricing for all events.' },
  { match: 'Coach Booking Schedule', title: 'Coach & Staff Schedule', calc: 'Coach or staff member booked for each time slot across each amenity. Session type and booker shown.', desc: 'Unassigned slots (No Coach badge) represent bookable time with no qualified staff - a product gap to fill proactively.' },
  { match: 'Branch Health Scorecard', title: 'Branch Health Scorecard', calc: 'Composite view of revenue, memberships, utilisation, ARPU, churn, renewal conversion per branch.', desc: 'Healthy = all metrics stable. Watch = 1-2 declining. At Risk = structural decline 3+ months.' },
  { match: 'Revenue by Branch', title: 'Revenue by Branch', calc: 'Total revenue per branch per month over 6 months.', desc: 'Diverging trends indicate different operational health levels between branches.' },
  { match: 'Revenue Mix', title: 'Revenue Mix - Portfolio', calc: 'Total portfolio revenue split by source - Membership, Amenity fees, Events.', desc: 'Membership >65% = predictable but vulnerable to churn. Events at 10% is underdeveloped.' },
  { match: 'Net Membership Growth', title: 'Net Membership Growth by Branch', calc: 'New joins minus expiries per branch per month.', desc: '3+ consecutive negative months = structural issue requiring direct intervention.' },
  { match: 'Churn Rate by Branch', title: 'Churn Rate by Branch', calc: '(Members who did not renew / Members due for renewal) x 100, per branch.', desc: 'Above 5% for 3+ months = the branch is bleeding revenue. Needs an immediate retention plan.' },
  { match: 'Renewal Conversion', title: 'Renewal Conversion by Branch', calc: '(Renewals completed / Renewals due) x 100, per branch.', desc: 'The gap between best and worst branch is the single biggest improvement opportunity.' },
  { match: 'ARPU by Branch', title: 'ARPU by Branch', calc: 'Total branch revenue / Active member count = ₹ per member per month.', desc: 'Higher ARPU at a declining branch often masks a pricing-vs-retention problem.' },
  { match: 'Payment Failure Rate', title: 'Payment Failure Rate Trend', calc: 'Failed payment attempts / Total payment attempts x 100, plotted per month.', desc: 'UPI auto-pay adoption typically drives the biggest improvement in this metric.' },
  { match: 'Bookings by Member Type - All', title: 'Bookings by Member Type - All Branches', calc: 'Bookings per branch split by Member, Guest, Staff.', desc: 'High guest share at a branch = untapped conversion opportunity into memberships.' },
  { match: 'Revenue by Booking Category - All', title: 'Revenue by Booking Category - All Branches', calc: 'Amenity revenue per branch, split by Member Adult, Guest Adult, Member Child, Guest Child.', desc: 'Low child revenue at a branch = opportunity to launch junior programs.' },
];

export function getInfo(match: string): InfoEntry {
  const found = INFO.find((i) => i.match === match);
  if (!found) throw new Error(`No INFO entry for "${match}"`);
  return found;
}

export const SYSTEM_PROMPTS: Record<'branch' | 'super', string> = {
  branch: 'You are an AI analytics assistant for The Recess Club - a premium sports club. You are embedded in the Branch Manager dashboard for Branch A (Worli). Key data: Active Memberships 238 (retention 96.8%, churn 2.1%), Collections MTD ₹4.2L of ₹5.1L billed (82% efficiency), Monthly Bookings 480 (Members 326, Guests 106, Staff 48), Amenity Utilisation 68%, Open Tickets 11 (3 aged >5d), Upcoming Renewals 9 (2 on retry, ₹38K at risk). Plan mix: Annual 39%, Quarterly 26%, Monthly 16%. Coaches on duty today: 4 (Amit Sharma, Priya Nair, Vikram Iyer, Karan Das) running 11 sessions. Be concise, data-driven, actionable. Max 3 sentences.',
  super: 'You are an AI analytics assistant for The Recess Club - a premium sports club. You are embedded in the Super Admin dashboard viewing all 4 branches. Portfolio Revenue MTD ₹38.6L, 912 active memberships, Avg utilisation 61%. Branch A Worli: ₹12.4L, 74% util, 2.1% churn - Healthy. Branch B Bandra: ₹10.1L, 68%, 2.8% - Watch. Branch C Thane: ₹8.9L, 58%, 3.4% - Watch. Branch D Dadar: ₹7.2L, 44%, 4.9% - At Risk (declining 3 months). Renewal conversion portfolio avg 79% (Branch D lowest 69%). Be strategic and comparative. Max 3 sentences.',
};

export const INSIGHT_SYSTEM_PROMPT =
  'You are an analytics assistant for The Recess Club, a premium sports club in Mumbai. Generate a concise 2-3 sentence insight for a club manager viewing this dashboard chart. Focus on the single most important pattern in the data and one specific recommended action. Be direct and specific. Do not start with "This chart shows" - start with the key finding.';
