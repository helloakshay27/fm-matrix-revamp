import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/utils/apiClient';
import { getApiErrorMessage } from '../apiErrorMessage';
import { downloadLockAccountBillInvoice } from '../lockAccountBillInvoiceUtils';

interface HistoryInvoice {
  id: number;
  bill_number: string | null;
  status: string | null;
  total_amount: number | null;
  bill_date: string | null;
  due_date: string | null;
}

interface RenewalPeriod {
  period_number: number;
  start_date: string | null;
  end_date: string | null;
  renewed_at: string | null;
  plan: { id: number | null; name: string | null };
  plan_snapshot: Record<string, unknown> | null;
  payment: {
    base_amount: number | string | null;
    discount: number | string | null;
    adjustment_amount: number | string | null;
    adjustment_note: string | null;
    total_amount: number | string | null;
    payment_status: string | null;
  } | null;
  invoices: HistoryInvoice[];
}

interface HistoryVersion {
  version: number;
  club_member_id: number;
  allocation_id: number | null;
  membership_number: string | null;
  change_type: 'new' | 'renewal' | 'upgrade';
  status: string | null;
  is_current: boolean;
  superseded_at: string | null;
  superseded_by_change_type: 'renewal' | 'upgrade' | null;
  plan: { id: number | null; name: string | null };
  start_date: string | null;
  end_date: string | null;
  payment: {
    base_amount: number | string | null;
    discount: number | string | null;
    adjustment_amount: number | string | null;
    adjustment_note: string | null;
    total_tax: number | string | null;
    total_amount: number | string | null;
    payment_status: string | null;
  } | null;
  invoices: HistoryInvoice[];
  renewal_periods?: RenewalPeriod[];
}

interface Props {
  /** Any version of the membership: the whole chain is returned. */
  clubMemberId: number | string;
  /** The version the page is showing (marked "Viewing"): by member id on a single-member page, by allocation id on a group page. */
  viewingClubMemberId?: number | string;
  viewingAllocationId?: number | string;
  onOpenVersion?: (version: { club_member_id: number; allocation_id: number | null }) => void;
  /** Change to reload (after a renewal / upgrade). */
  refreshKey?: number;
}

const money = (n: number | string | null | undefined) =>
  `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString('en-GB') : '-');

const CHANGE_LABEL: Record<string, string> = { new: 'Original', renewal: 'Renewal', upgrade: 'Upgrade' };
const REPLACED_LABEL: Record<string, string> = { renewal: 'Renewed', upgrade: 'Upgraded' };

const stateBadge = (v: HistoryVersion) => {
  if (!v.is_current) {
    return <Badge className="bg-gray-100 text-gray-700 border-0">{REPLACED_LABEL[v.superseded_by_change_type ?? ''] ?? 'Replaced'}</Badge>;
  }
  if (v.status === 'expired') return <Badge className="bg-red-100 text-red-800 border-0">Expired</Badge>;
  return <Badge className="bg-green-100 text-green-800 border-0">Current</Badge>;
};

export const MembershipHistoryTab: React.FC<Props> = ({
  clubMemberId,
  viewingClubMemberId,
  viewingAllocationId,
  onOpenVersion,
  refreshKey = 0,
}) => {
  const isViewing = (v: HistoryVersion) =>
    viewingAllocationId != null ? String(v.allocation_id) === String(viewingAllocationId) : String(v.club_member_id) === String(viewingClubMemberId);
  const [versions, setVersions] = useState<HistoryVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [expandedPeriods, setExpandedPeriods] = useState<Record<number, boolean>>({});

  const togglePeriods = (allocationId: number) =>
    setExpandedPeriods((prev) => ({ ...prev, [allocationId]: !prev[allocationId] }));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/club_members/${clubMemberId}/membership_history.json`);
      setVersions([...(res.data?.versions ?? [])].reverse()); // newest first
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Failed to load membership history'));
    } finally {
      setLoading(false);
    }
  }, [clubMemberId]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const download = async (version: HistoryVersion, invoice: HistoryInvoice) => {
    setDownloadingId(invoice.id);
    try {
      await downloadLockAccountBillInvoice({
        id: invoice.id,
        bill_number: invoice.bill_number,
        resource_type: 'ClubMemberAllocation',
        resource_id: version.allocation_id,
      });
    } catch (e) {
      toast.error(getApiErrorMessage(e, 'Failed to download invoice'));
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading history...
      </div>
    );
  }

  if (versions.length === 0) return <div className="text-sm text-gray-500">No history found.</div>;

  return (
    <div className="space-y-4">
      {versions.length === 1 && (
        <p className="text-sm text-gray-500">This membership has not been renewed or upgraded yet.</p>
      )}
      {versions.map((v) => (
        <div key={v.club_member_id} className="rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#1a1a1a]">
                Version {v.version} · {CHANGE_LABEL[v.change_type] ?? v.change_type}
              </span>
              {stateBadge(v)}
              {isViewing(v) && (
                <Badge className="bg-brand-selected text-brand border-0">Viewing</Badge>
              )}
            </div>
            {onOpenVersion && !isViewing(v) && (
              <Button variant="outline" size="sm" onClick={() => onOpenVersion({ club_member_id: v.club_member_id, allocation_id: v.allocation_id })}>
                Open this version
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-gray-500">Plan</div>
              <div className="font-medium">{v.plan?.name ?? '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Period</div>
              <div className="font-medium">
                {fmtDate(v.start_date)} to {fmtDate(v.end_date)}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Membership no.</div>
              <div className="font-medium">{v.membership_number ?? '-'}</div>
            </div>
          </div>

          {v.payment && (
            <div className="text-sm rounded-md bg-gray-50 p-3 space-y-1">
              <div className="flex justify-between"><span>Plan price</span><span>{money(v.payment.base_amount)}</span></div>
              {Number(v.payment.discount) > 0 && (
                <div className="flex justify-between"><span>Discount</span><span>- {money(v.payment.discount)}</span></div>
              )}
              {Number(v.payment.adjustment_amount) > 0 && (
                <div className="flex justify-between">
                  <span>{v.payment.adjustment_note || 'Credit for unused plan'}</span>
                  <span>- {money(v.payment.adjustment_amount)}</span>
                </div>
              )}
              <div className="flex justify-between"><span>Tax</span><span>{money(v.payment.total_tax)}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>{money(v.payment.total_amount)}</span></div>
            </div>
          )}

          <div>
            <div className="text-sm text-gray-500 mb-1">Invoices</div>
            {v.invoices.length === 0 ? (
              <div className="text-sm text-gray-400">No invoice for this version.</div>
            ) : (
              <div className="divide-y rounded-md border border-gray-200">
                {v.invoices.map((inv) => (
                  <div key={inv.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                    <div>
                      <span className="font-medium">{inv.bill_number || 'Invoice number pending payment'}</span>
                      <span className="text-gray-500"> · {fmtDate(inv.bill_date)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{money(inv.total_amount)}</span>
                      <Badge
                        className={`border-0 ${inv.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {inv.status ?? '-'}
                      </Badge>
                      <Button variant="outline" size="sm" disabled={downloadingId === inv.id} onClick={() => download(v, inv)}>
                        {downloadingId === inv.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Renewal period history (in-place renewals) */}
          {v.renewal_periods && v.renewal_periods.length > 0 && (
            <div className="border-t border-gray-100 pt-3">
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => v.allocation_id != null && togglePeriods(v.allocation_id)}
              >
                {expandedPeriods[v.allocation_id ?? -1]
                  ? <ChevronDown className="h-4 w-4" />
                  : <ChevronRight className="h-4 w-4" />}
                Renewal History ({v.renewal_periods.length} previous {v.renewal_periods.length === 1 ? 'period' : 'periods'})
              </button>

              {expandedPeriods[v.allocation_id ?? -1] && (
                <div className="mt-2 space-y-3 pl-4 border-l-2 border-gray-200">
                  {[...v.renewal_periods].reverse().map((period) => (
                    <div key={period.period_number} className="rounded-md border border-gray-200 p-3 space-y-2 bg-gray-50">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-sm font-medium text-gray-700">
                          Period {period.period_number} · {period.plan?.name ?? '-'}
                        </span>
                        <span className="text-xs text-gray-400">
                          Renewed {fmtDate(period.renewed_at)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="text-gray-400">Period </span>
                          {fmtDate(period.start_date)} – {fmtDate(period.end_date)}
                        </div>
                        {period.payment && (
                          <div>
                            <span className="text-gray-400">Total </span>
                            <span className="font-medium">{money(period.payment.total_amount)}</span>
                            {period.payment.payment_status && (
                              <Badge
                                className={`ml-1 border-0 text-[10px] px-1 py-0 ${
                                  period.payment.payment_status.toLowerCase() === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {period.payment.payment_status}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {period.invoices.length > 0 && (
                        <div className="divide-y rounded border border-gray-200 bg-white">
                          {period.invoices.map((inv) => (
                            <div key={inv.id} className="flex flex-wrap items-center justify-between gap-2 px-2 py-1.5 text-xs">
                              <div>
                                <span className="font-medium">{inv.bill_number || 'Pending'}</span>
                                <span className="text-gray-400"> · {fmtDate(inv.bill_date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>{money(inv.total_amount)}</span>
                                <Badge
                                  className={`border-0 text-[10px] px-1 ${inv.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                >
                                  {inv.status ?? '-'}
                                </Badge>
                                <Button
                                  variant="outline" size="sm"
                                  disabled={downloadingId === inv.id}
                                  onClick={() => download(v, inv)}
                                >
                                  {downloadingId === inv.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      ))}
    </div>
  );
};

export default MembershipHistoryTab;
