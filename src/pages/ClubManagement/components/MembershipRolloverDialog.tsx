import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, AlertTriangle, CheckCircle2, Check, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
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

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    '& fieldset': { borderColor: '#d1d5db' },
    '&:hover fieldset': { borderColor: '#9ca3af' },
    '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--color-primary)' },
};

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

  const totals = useMemo(() => {
    const taxable = Math.max(num(base) - num(discount) - (isUpgrade ? num(credit) : 0), 0);
    const cgst = round2((taxable * num(cgstPct)) / 100);
    const sgst = round2((taxable * num(sgstPct)) / 100);
    return { taxable: round2(taxable), cgst, sgst, tax: round2(cgst + sgst), total: round2(taxable + cgst + sgst) };
  }, [base, discount, credit, cgstPct, sgstPct, isUpgrade]);

  const startDate = startOverride || quote?.start_date || '';
  const endDate = endOverride || quote?.end_date || '';
  // Dates are YYYY-MM-DD, so a string comparison orders them correctly.
  const dateError =
    startDate && endDate && endDate.slice(0, 10) < startDate.slice(0, 10) ? 'End date cannot be before the start date' : null;

  // Re-price whenever the plan or dates change, but not for an invalid date range.
  useEffect(() => {
    if (open && !dateError) loadQuote();
  }, [open, loadQuote, dateError]);
  const selectablePlans = isUpgrade ? plans.filter((p) => p.id !== currentPlanId) : plans;
  const canSubmit = !!quote && !quoteError && !loadingQuote && !submitting && !!planId && !dateError;

  const amountFieldProps = {
    type: 'number',
    size: 'small' as const,
    fullWidth: true,
    inputProps: { min: 0, step: 0.01 },
    InputLabelProps: { shrink: true },
    sx: fieldStyles,
  };

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
    <Dialog
      open={open}
      onClose={() => !submitting && onOpenChange(false)}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ pb: 1 }}>
        <div className="text-lg font-semibold text-[#1a1a1a]">{isUpgrade ? 'Upgrade membership' : 'Renew membership'}</div>
        <div className="text-sm font-normal text-gray-500 mt-1">
          {isUpgrade
            ? 'The new plan starts now and keeps the current end date. You are charged the new plan price less a credit for the unused part of the current plan.'
            : 'Start a new membership period, on the same plan or a different one. A new invoice is created for the plan you choose; the expired period is kept in the history.'}
        </div>
      </DialogTitle>

      <DialogContent dividers>
        <div className="space-y-5">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <div className="text-sm font-semibold text-[#1a1a1a]">{isUpgrade ? 'Upgrade to' : 'Choose a plan'}</div>
              {selectablePlans.length > 0 && (
                <div className="text-xs text-gray-500">
                  {selectablePlans.length} plan{selectablePlans.length === 1 ? '' : 's'} available
                </div>
              )}
            </div>
            {/* Not role="radio": theme.css paints every span inside [role="radio"] as a filled circle. */}
            <div aria-label="Membership plan" className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectablePlans.map((p) => {
                const selected = planId === p.id;
                const isCurrent = p.id === currentPlanId;
                return (
                  <button
                    type="button"
                    aria-pressed={selected}
                    key={p.id}
                    onClick={() => {
                      setPlanId(p.id);
                      setEndOverride('');
                    }}
                    className={`group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      selected
                        ? 'border-brand bg-brand-selected ring-1 ring-brand shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Radio indicator */}
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        selected ? 'border-brand bg-brand text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'
                      }`}
                    >
                      {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="truncate font-medium text-[#1a1a1a]" title={p.name}>
                          {p.name}
                        </span>
                        {isCurrent && (
                          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            Current plan
                          </span>
                        )}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={`text-lg font-semibold ${selected ? 'text-brand' : 'text-[#1a1a1a]'}`}>
                          {p.price != null ? money(Number(p.price)) : '—'}
                        </span>
                        {p.duration_in_months ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            <CalendarDays className="h-3 w-3" />
                            {p.duration_in_months} month{p.duration_in_months === 1 ? '' : 's'}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </button>
                );
              })}
              {selectablePlans.length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                  No plans available.
                </div>
              )}
            </div>
          </div>

          {quote && (
            <div className="text-sm text-gray-600">
              Current: <span className="font-medium">{quote.current.plan_name}</span>, {fmtDate(quote.current.start_date)} to{' '}
              {fmtDate(quote.current.end_date)}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              type="date"
              fullWidth
              label="Start date"
              value={startDate}
              onChange={(e) => {
                setStartOverride(e.target.value);
                setEndOverride('');
              }}
              disabled={!planId}
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
            <TextField
              type="date"
              fullWidth
              label="End date"
              value={endDate}
              onChange={(e) => setEndOverride(e.target.value)}
              disabled={!planId}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: startDate || undefined }}
              sx={fieldStyles}
              error={!!dateError}
              helperText={dateError ?? (isUpgrade ? 'An upgrade keeps the current end date by default.' : '')}
            />
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
                <TextField label="Plan price" {...amountFieldProps} value={base} onChange={(e) => setBase(e.target.value)} />
                <TextField label="Discount" {...amountFieldProps} value={discount} onChange={(e) => setDiscount(e.target.value)} />
                {isUpgrade && (
                  <TextField
                    label="Credit (unused plan)"
                    {...amountFieldProps}
                    value={credit}
                    onChange={(e) => setCredit(e.target.value)}
                  />
                )}
                <TextField label="CGST %" {...amountFieldProps} value={cgstPct} onChange={(e) => setCgstPct(e.target.value)} />
                <TextField label="SGST %" {...amountFieldProps} value={sgstPct} onChange={(e) => setSgstPct(e.target.value)} />
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
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={!canSubmit} className="bg-brand hover:bg-brand-hover text-white">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isUpgrade ? 'Upgrade & create invoice' : 'Renew & create invoice'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MembershipRolloverDialog;
