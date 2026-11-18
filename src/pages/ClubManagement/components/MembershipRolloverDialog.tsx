import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiClient } from '@/utils/apiClient';
import { getApiErrorMessage } from '../apiErrorMessage';

export type RolloverMode = 'renewal' | 'upgrade';

interface Plan {
  id: number;
  name: string;
  price?: string | number | null;
  renewal_terms?: string | null;
  duration_in_months?: number | null;
  user_limit?: number | null;
  day_pass?: boolean;
  active?: boolean;
}

interface RolloverQuote {
  start_date: string;
  end_date: string;
  current: { plan_id?: number; plan_name?: string; start_date?: string; end_date?: string; paid_total?: number };
  plan: { id: number; name: string; price: number; duration_in_months?: number; cgst_percent: number; sgst_percent: number };
  payment: { base_amount: number; discount: number; adjustment_amount: number; adjustment_note?: string | null };
  credit: { amount: number; remaining_days?: number; total_days?: number };
  warnings: string[];
}

export interface RolloverResult {
  change_type?: RolloverMode;
  club_member_ids: number[];
  new_allocation: { id: number; membership_plan_name: string };
  previous_allocation_id?: number | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: RolloverMode;
  /** Membership being moved on: a club member id (single member), or an allocation id (group). */
  target: { kind: 'member' | 'allocation'; id: number | string };
  currentPlanId?: number | null;
  onDone: (result: RolloverResult) => void;
}

const money = (n: number) => `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('en-GB') : '-');
const num = (v: string) => (v === '' || Number.isNaN(Number(v)) ? 0 : Number(v));

const basePath = (target: Props['target']) =>
  target.kind === 'member' ? `/club_members/${target.id}` : `/club_member_allocations/${target.id}`;

/**
 * Renew an expired membership (optionally on another plan) or upgrade an active one.
 * The backend suggests dates and amounts (GET rollover_quote); the admin can edit them, and the invoice is created
 * for the chosen plan when the form is submitted (POST renew / upgrade).
 */
export const MembershipRolloverDialog: React.FC<Props> = ({ open, onOpenChange, mode, target, currentPlanId, onDone }) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planId, setPlanId] = useState<number | null>(mode === 'renewal' ? currentPlanId ?? null : null);
  const [startOverride, setStartOverride] = useState('');
  const [endOverride, setEndOverride] = useState('');
  const [quote, setQuote] = useState<RolloverQuote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Editable amounts (initialised from the quote).
  const [base, setBase] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [credit, setCredit] = useState('0');
  const [cgstPct, setCgstPct] = useState('0');
  const [sgstPct, setSgstPct] = useState('0');

  const isUpgrade = mode === 'upgrade';

  // Start fresh each time the dialog opens.
  useEffect(() => {
    if (!open) return;
    setPlanId(mode === 'renewal' ? currentPlanId ?? null : null);
    setStartOverride('');
    setEndOverride('');
    setQuote(null);
    setQuoteError(null);
  }, [open, mode, currentPlanId]);

  useEffect(() => {
    if (!open) return;
    apiClient
      .get('/membership_plans.json')
      .then((res) => {
        const list: Plan[] = (res.data?.plans ?? []).filter((p: Plan) => !p.day_pass && p.active !== false);
        setPlans(list);
      })
      .catch((e) => toast.error(getApiErrorMessage(e, 'Failed to load membership plans')));
  }, [open]);

  const loadQuote = useCallback(async () => {
    if (!planId) {
      setQuote(null);
      return;
    }
    setLoadingQuote(true);
    setQuoteError(null);
    try {
      const params: Record<string, string | number> = { type: mode, new_membership_plan_id: planId };
      if (startOverride) params.start_date = startOverride;
      if (endOverride) params.end_date = endOverride;
      const res = await apiClient.get(`${basePath(target)}/rollover_quote.json`, { params });
      const q: RolloverQuote = res.data;
      setQuote(q);
      setBase(String(q.payment.base_amount ?? 0));
      setDiscount(String(q.payment.discount ?? 0));
      setCredit(String(q.payment.adjustment_amount ?? 0));
      setCgstPct(String(q.plan.cgst_percent ?? 0));
      setSgstPct(String(q.plan.sgst_percent ?? 0));
    } catch (e) {
      setQuote(null);
      setQuoteError(getApiErrorMessage(e, 'Could not price this change'));
    } finally {
      setLoadingQuote(false);
    }
  }, [planId, startOverride, endOverride, mode, target]);

  useEffect(() => {
    if (open) loadQuote();
  }, [open, loadQuote]);

  const totals = useMemo(() => {
    const taxable = Math.max(num(base) - num(discount) - (isUpgrade ? num(credit) : 0), 0);
    const cgst = round2((taxable * num(cgstPct)) / 100);
    const sgst = round2((taxable * num(sgstPct)) / 100);
    return { taxable: round2(taxable), cgst, sgst, tax: round2(cgst + sgst), total: round2(taxable + cgst + sgst) };
  }, [base, discount, credit, cgstPct, sgstPct, isUpgrade]);

  const startDate = startOverride || quote?.start_date || '';
  const endDate = endOverride || quote?.end_date || '';
  const selectablePlans = isUpgrade ? plans.filter((p) => p.id !== currentPlanId) : plans;
  const canSubmit = !!quote && !quoteError && !loadingQuote && !submitting && !!planId;

  const submit = async () => {
    if (!quote || !planId) return;
    setSubmitting(true);
    const toastId = toast.loading(isUpgrade ? 'Upgrading membership...' : 'Renewing membership...');
    try {
      const discountAmount = num(discount);
      const res = await apiClient.post(`${basePath(target)}/${isUpgrade ? 'upgrade' : 'renew'}.json`, {
        new_membership_plan_id: planId,
        start_date: startDate,
        end_date: endDate,
        payment: {
          base_amount: num(base),
          discount: discountAmount,
          discount_percent: num(base) ? round2((discountAmount / num(base)) * 100) : 0,
          adjustment_amount: isUpgrade ? num(credit) : 0,
          adjustment_note: isUpgrade ? quote.payment.adjustment_note ?? undefined : undefined,
          cgst: totals.cgst,
          sgst: totals.sgst,
          igst: 0,
          total_tax: totals.tax,
          total_amount: totals.total,
          landed_amount: totals.total,
          payment_status: 'pending',
          payment_mode: 'online',
        },
      });
      toast.success(res.data?.message || (isUpgrade ? 'Membership upgraded' : 'Membership renewed'), { id: toastId });
      onOpenChange(false);
      onDone(res.data as RolloverResult);
    } catch (e) {
      toast.error(getApiErrorMessage(e, isUpgrade ? 'Failed to upgrade membership' : 'Failed to renew membership'), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !submitting && onOpenChange(o)}>
      <DialogContent className="sm:max-w-[720px] w-[95vw] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isUpgrade ? 'Upgrade membership' : 'Renew membership'}</DialogTitle>
          <DialogDescription>
            {isUpgrade
              ? 'The new plan starts now and keeps the current end date. You are charged the new plan price less a credit for the unused part of the current plan.'
              : 'Start a new membership period, on the same plan or a different one. A new invoice is created for the plan you choose; the expired period is kept in the history.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label className="text-sm font-medium">{isUpgrade ? 'Upgrade to' : 'Plan'}</Label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectablePlans.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => {
                    setPlanId(p.id);
                    setEndOverride('');
                  }}
                  className={`text-left rounded-lg border p-3 transition ${
                    planId === p.id ? 'border-brand bg-brand-selected' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-[#1a1a1a]">{p.name}</span>
                    {p.id === currentPlanId && <span className="text-xs text-gray-500">Current plan</span>}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{p.price != null ? money(Number(p.price)) : ''}</div>
                  {p.duration_in_months ? <div className="text-xs text-gray-500">{p.duration_in_months} months</div> : null}
                </button>
              ))}
              {selectablePlans.length === 0 && <div className="text-sm text-gray-500">No plans available.</div>}
            </div>
          </div>

          {quote && (
            <div className="text-sm text-gray-600">
              Current: <span className="font-medium">{quote.current.plan_name}</span>, {fmtDate(quote.current.start_date)} to{' '}
              {fmtDate(quote.current.end_date)}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rollover-start">Start date</Label>
              <Input
                id="rollover-start"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartOverride(e.target.value);
                  setEndOverride('');
                }}
                disabled={!planId}
              />
            </div>
            <div>
              <Label htmlFor="rollover-end">End date</Label>
              <Input
                id="rollover-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndOverride(e.target.value)}
                disabled={!planId}
              />
              {isUpgrade && <p className="text-xs text-gray-500 mt-1">An upgrade keeps the current end date by default.</p>}
            </div>
          </div>

          {loadingQuote && (
            <div className="flex items-center text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Calculating...
            </div>
          )}

          {quoteError && (
            <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> <span>{quoteError}</span>
            </div>
          )}

          {quote && quote.warnings?.length > 0 && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                {quote.warnings.map((w) => (
                  <div key={w}>{w}</div>
                ))}
              </div>
            </div>
          )}

          {quote && (
            <div className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="font-medium text-[#1a1a1a]">Invoice for {quote.plan.name}</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="rollover-base">Plan price</Label>
                  <Input id="rollover-base" type="number" min="0" step="0.01" value={base} onChange={(e) => setBase(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="rollover-discount">Discount</Label>
                  <Input id="rollover-discount" type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                </div>
                {isUpgrade && (
                  <div>
                    <Label htmlFor="rollover-credit">Credit (unused plan)</Label>
                    <Input id="rollover-credit" type="number" min="0" step="0.01" value={credit} onChange={(e) => setCredit(e.target.value)} />
                  </div>
                )}
                <div>
                  <Label htmlFor="rollover-cgst">CGST %</Label>
                  <Input id="rollover-cgst" type="number" min="0" step="0.01" value={cgstPct} onChange={(e) => setCgstPct(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="rollover-sgst">SGST %</Label>
                  <Input id="rollover-sgst" type="number" min="0" step="0.01" value={sgstPct} onChange={(e) => setSgstPct(e.target.value)} />
                </div>
              </div>
              {isUpgrade && quote.payment.adjustment_note && <p className="text-xs text-gray-500">{quote.payment.adjustment_note}</p>}

              <div className="border-t pt-3 text-sm space-y-1">
                <div className="flex justify-between"><span>Taxable value</span><span>{money(totals.taxable)}</span></div>
                <div className="flex justify-between"><span>CGST</span><span>{money(totals.cgst)}</span></div>
                <div className="flex justify-between"><span>SGST</span><span>{money(totals.sgst)}</span></div>
                <div className="flex justify-between font-semibold text-base pt-1"><span>Total payable</span><span>{money(totals.total)}</span></div>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> The invoice is created as unpaid; mark it paid from the membership&rsquo;s invoices.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="fm-action-bar">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!canSubmit} className="bg-brand hover:bg-brand-hover text-white">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isUpgrade ? 'Upgrade & create invoice' : 'Renew & create invoice'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MembershipRolloverDialog;
