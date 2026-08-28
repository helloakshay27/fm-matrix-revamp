import type { DashboardResponse, DashboardValue } from '../api/dashboardApi';
import { useDashboard } from '../context/DashboardContext';

type QueryResult = { data?: DashboardResponse; isLoading: boolean; error: Error | null; refetch: () => Promise<unknown> };

const titleize = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

function valueLabel(value: DashboardValue): string {
  if (Array.isArray(value)) return `${value.length} records`;
  if (value && typeof value === 'object') return `${Object.keys(value).length} fields`;
  return String(value ?? '—');
}

function DashboardPanel({ label, query }: { label: string; query: QueryResult }) {
  if (query.isLoading) return <article className="fm-panel"><div className="fm-panel-title">{label}</div><div className="fm-skeleton" /><div className="fm-skeleton short" /></article>;
  if (query.error) return <article className="fm-panel"><div className="fm-panel-title">{label}</div><p className="fm-error">{query.error.message}</p><button className="fm-retry" onClick={() => void query.refetch()}>Retry</button></article>;
  const data = query.data;
  if (!data || Object.keys(data).length === 0) return <article className="fm-panel"><div className="fm-panel-title">{label}</div><p className="fm-empty">No data for the selected filters.</p></article>;
  const scalarEntries = Object.entries(data).filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value)).slice(0, 6);
  const groupedEntries = Object.entries(data).filter(([, value]) => Array.isArray(value) || (value && typeof value === 'object')).slice(0, 2);
  return <article className="fm-panel">
    <div className="fm-panel-title">{label}</div>
    <div className="fm-metrics">{scalarEntries.map(([key, value]) => <div key={key}><span>{titleize(key)}</span><strong>{valueLabel(value)}</strong></div>)}</div>
    {groupedEntries.map(([key, value]) => <div className="fm-list" key={key}><span>{titleize(key)}</span><b>{valueLabel(value)}</b></div>)}
  </article>;
}

const crmPanels = [
  ['Lease overview', 'leaseOverview'], ['Events overview', 'eventsOverview'], ['Broadcast overview', 'broadcastOverview'], ['Wallet overview', 'walletOverview'],
  ['Wallet distribution', 'walletDistribution'], ['Wallet transactions', 'walletTransactions'],
] as const;
const financePanels = [
  ['Pending approvals', 'pendingApprovals'], ['Draft PRs', 'draftPrs'], ['Procurement pipeline', 'procurementPipeline'],
  ['Pending requisition value', 'pendingRequisitionValue'], ['PR vs SR split', 'prSrSplit'], ['Overdue invoices', 'overdueInvoices'],
  ['Approval queue', 'approvalQueue'], ['Top pending records', 'topPendingRecords'],
] as const;

export function FmDashboardSection() {
  const { vm } = useDashboard();
  const panels = vm.fm as Record<string, QueryResult>;
  return <section className="page on" id="pgFm"><div className="section">
    <div className="section-head"><h2>FM Matrix dashboards</h2><span className="layerpill">CRM · Finance</span><span className="sd">Live operational metrics for the selected sites and date range.</span></div>
    <div className="fm-section-head"><h3>CRM</h3><span>{vm.range.from} to {vm.range.to}</span></div>
    <div className="fm-grid">{crmPanels.map(([label, key]) => <DashboardPanel key={key} label={label} query={panels[key]} />)}</div>
    <div className="fm-section-head"><h3>Finance & procurement</h3><span>Token-authenticated live data</span></div>
    <div className="fm-grid">{financePanels.map(([label, key]) => <DashboardPanel key={key} label={label} query={panels[key]} />)}</div>
  </div></section>;
}