// Drill-down panel body templates - ported 1:1 from club_management_dashboard_v6.html.
// Each function returns an HTML string rendered via dangerouslySetInnerHTML inside DrillPanel.
import { planTableData } from './clubDashboardData';

export function tbl(headers: (string | number)[], rows: (string | number)[][]): string {
  return (
    '<table><tr>' +
    headers.map((h) => `<th>${h}</th>`).join('') +
    '</tr>' +
    rows.map((row) => '<tr>' + row.map((c) => `<td>${c}</td>`).join('') + '</tr>').join('') +
    '</table>'
  );
}

export const activeMembersHTML = () => tbl(['Plan', 'Members', '%'], planTableData as (string | number)[][]);
export const todayBookingsHTML = () => tbl(['Amenity', 'Bookings'], [['Padel Court 1', '6'], ['Badminton A', '5'], ['Gym', '4'], ['All Day', '3']]);
export const occupancyHTML = () => tbl(['Amenity', 'Utilisation'], [['Padel Court 1', '82%'], ['CRG FL Court', '76%'], ['Badminton A', '70%'], ['Gym', '55%'], ['Kabaddi', '38%']]);
export const collectionsHTML = () => tbl(['Status', 'Amount'], [['Paid', '₹4.2L'], ['Pending', '₹38,000'], ['Overdue', '₹12,000']]);
export const ticketsHTML = () => tbl(['Category', 'Open'], [['Facility', '5'], ['Billing', '4'], ['Membership', '2']]);
export const renewalsHTML = () => tbl(['Member', 'Plan', 'Status'], [['Aarav Mehta', 'Annual', 'Retry D3'], ['Priya Kapoor', 'Quarterly', 'Retry D1']]);
export const renewalRowHTML = (n: string, p: string, s: string) => tbl(['Field', 'Value'], [['Member', n], ['Plan', p], ['Retry Status', s]]);
export const noShowHTML = (n: string, a: string, s: string) => tbl(['Field', 'Value'], [['Member', n], ['Amenity', a], ['Slot', s], ['Penalty', '₹100 deducted']]);
export const invoiceHTML = (a: string, amt: string, age: string) => tbl(['Field', 'Value'], [['Account', a], ['Amount', amt], ['Aged', age]]);
export const eventHTML = (n: string, fill: string, rev: string) => tbl(['Field', 'Value'], [['Event', n], ['Seats', fill], ['Revenue', rev]]);
export const revenueAllHTML = () => tbl(['Branch', 'Revenue'], [['Branch A', '₹12.4L'], ['Branch B', '₹10.1L'], ['Branch C', '₹8.9L'], ['Branch D', '₹7.2L']]);
export const membersAllHTML = () => tbl(['Branch', 'Members'], [['Branch A', '312'], ['Branch B', '248'], ['Branch C', '201'], ['Branch D', '151']]);
export const occAllHTML = () => tbl(['Branch', 'Utilisation'], [['Branch A', '74%'], ['Branch B', '68%'], ['Branch C', '58%'], ['Branch D', '44%']]);
export const arpuAllHTML = () => tbl(['Branch', 'ARPU'], [['Branch A', '₹3,974'], ['Branch B', '₹4,073'], ['Branch C', '₹4,428'], ['Branch D', '₹4,768']]);
export const renewConvAllHTML = () => tbl(['Branch', 'Conv %'], [['Branch A', '87%'], ['Branch B', '81%'], ['Branch C', '76%'], ['Branch D', '69%']]);
export const vendorAllHTML = () => tbl(['Branch', 'Outstanding'], [['Branch A', '₹85K'], ['Branch B', '₹64.2K'], ['Branch C', '₹91K'], ['Branch D', '₹70.5K']]);
// Builds the Branch Overview > "Group Memberships" drill table from the live
// getGroupMemberships() response, instead of the wireframe's static example rows.
export function groupsTableHTML(groups: { group_name: string; plan: string; members: number; payment_frequency: string; expiry: string; status: string }[]): string {
  if (!groups.length) {
    return '<div class="chart-sub">No active group memberships for the selected range.</div>';
  }
  return tbl(
    ['Group Name', 'Plan', 'Members', 'Payment Freq.', 'Expiry', 'Status'],
    groups.map((g) => [g.group_name, g.plan, g.members, g.payment_frequency, g.expiry, g.status])
  );
}
export const groupRowHTML = (n: string, c: string, p: string, e: string) => tbl(['Field', 'Value'], [['Group', n], ['Members', c], ['Plan', p], ['Expiry', e]]);
export const memberDaysHTML = (n: string, p: string, d: string, f: string) => tbl(['Field', 'Value'], [['Member', n], ['Plan', p], ['Days Remaining', d], ['Free Bookings Left', f]]);
export const cancelHTML = (n: string, t: string, a: string, s: string, r: string) => tbl(['Field', 'Value'], [['Member', n], ['Type', t], ['Amenity', a], ['Slot', s], ['Reason', r]]);
export const pendingHTML = (n: string, t: string, p: string, f: string, a: string, s: string) => tbl(['Field', 'Value'], [['Member', n], ['Type', t], ['Plan', p], ['For', f], ['Amount', a], ['Since', s]]);
export const coachDrillHTML = (coach: string, amenity: string, slot: string, session: string, booker: string) =>
  tbl(['Field', 'Value'], [['Coach / Staff', coach], ['Amenity', amenity], ['Time Slot', slot], ['Session Type', session], ['Booked By', booker], ['Status', 'Confirmed']]);

export function branchHTML(name: string, rev: string, occ: string, risk: string, backlog: string, health: 'ok' | 'warn' | 'err') {
  const bc = health === 'ok' ? 'b-ok' : health === 'warn' ? 'b-warn' : 'b-err';
  const bt = health === 'ok' ? 'Healthy' : health === 'warn' ? 'Watch' : 'At Risk';
  return (
    `<div style="margin-bottom:10px"><span class="badge ${bc}">${bt}</span></div>` +
    tbl(['Metric', 'Value'], [['Revenue (MTD)', rev], ['Amenity Utilisation', occ], ['Renewal Risk', risk + ' members'], ['Ticket Backlog', backlog + ' open']])
  );
}
