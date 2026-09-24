import { getBaseUrl, getToken } from '@/utils/auth';

export interface DashboardQueryParams {
  token?: string;
  site_id?: string | number;
  from_date?: string;
  to_date?: string;
}

export type DashboardValue = string | number | boolean | null | DashboardValue[] | { [key: string]: DashboardValue };
export type DashboardResponse = Record<string, DashboardValue>;

export const FM_API_ENDPOINTS = {
  crm: {
    leaseOverview: '/fm_dashboard/crm/lease_overview.json',
    eventsOverview: '/fm_dashboard/crm/events_overview.json',
    broadcastOverview: '/fm_dashboard/crm/broadcast_overview.json',
    walletOverview: '/fm_dashboard/crm/wallet_overview.json',
    walletDistribution: '/fm_dashboard/crm/wallet_distribution.json',
    walletTransactions: '/fm_dashboard/crm/wallet_transactions.json',
  },
  finance: {
    pendingApprovals: '/fm_dashboard/procurement/pending_approvals.json',
    draftPrs: '/fm_dashboard/requisitions/draft_prs.json',
    procurementPipeline: '/fm_dashboard/procurement/procurement_pipeline.json',
    pendingRequisitionValue: '/fm_dashboard/requisitions/pending_value.json',
    prSrSplit: '/fm_dashboard/procurement/pr_sr_split.json',
    overdueInvoices: '/fm_dashboard/invoices/overdue_invoices.json',
    approvalQueue: '/fm_dashboard/approvals/approval_queue.json',
    topPendingRecords: '/fm_dashboard/approvals/top_pending_records.json',
  },
} as const;

const getApiBaseUrl = () =>
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_API_BASE_URL as string | undefined) ||
  getBaseUrl() ||
  'http://localhost:3000';

function buildUrl(endpoint: string, params: DashboardQueryParams): string {
  const query = new URLSearchParams();
  const token = params.token ?? getToken() ?? '';
  query.set('token', token);
  Object.entries(params).forEach(([key, value]) => {
    if (key !== 'token' && value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });

  return `${getApiBaseUrl().replace(/\/$/, '')}${endpoint}?${query.toString()}`;
}

export async function fetchDashboardData<T extends DashboardResponse = DashboardResponse>(
  endpoint: string,
  params: Omit<DashboardQueryParams, 'token'> = {}
): Promise<T> {
  const response = await fetch(buildUrl(endpoint, params));
  if (!response.ok) {
    throw new Error(`Dashboard API error: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

const crm = FM_API_ENDPOINTS.crm;
const finance = FM_API_ENDPOINTS.finance;

export const fetchLeaseOverview = (params: DashboardQueryParams) => fetchDashboardData(crm.leaseOverview, params);
export const fetchEventsOverview = (params: DashboardQueryParams) => fetchDashboardData(crm.eventsOverview, params);
export const fetchBroadcastOverview = (params: DashboardQueryParams) => fetchDashboardData(crm.broadcastOverview, params);
export const fetchWalletOverview = (params: DashboardQueryParams) => fetchDashboardData(crm.walletOverview, params);
export const fetchWalletDistribution = (params: DashboardQueryParams) => fetchDashboardData(crm.walletDistribution, params);
export const fetchWalletTransactions = (params: DashboardQueryParams) => fetchDashboardData(crm.walletTransactions, params);
export const fetchPendingApprovals = (params: DashboardQueryParams) => fetchDashboardData(finance.pendingApprovals, params);
export const fetchDraftPrs = (params: DashboardQueryParams) => fetchDashboardData(finance.draftPrs, params);
export const fetchProcurementPipeline = (params: DashboardQueryParams) => fetchDashboardData(finance.procurementPipeline, params);
export const fetchPendingRequisitionValue = (params: DashboardQueryParams) => fetchDashboardData(finance.pendingRequisitionValue, params);
export const fetchPrSrSplit = (params: DashboardQueryParams) => fetchDashboardData(finance.prSrSplit, params);
export const fetchOverdueInvoices = (params: DashboardQueryParams) => fetchDashboardData(finance.overdueInvoices, params);
export const fetchApprovalQueue = (params: DashboardQueryParams) => fetchDashboardData(finance.approvalQueue, params);
export const fetchTopPendingRecords = (params: DashboardQueryParams) => fetchDashboardData(finance.topPendingRecords, params);