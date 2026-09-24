import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import {
  openclawDashboardAssistanceAPI,
  type ChargeRow,
  type ChargesResponse,
} from '@/services/openclawDashboardAssistanceAPI';

const BRAND = '#C72030';
const PER_PAGE = 10;

/**
 * What the AI has cost, and what we bill for it.
 *
 * Two numbers per row, deliberately both shown:
 *   actual  — tokens x the rate card, i.e. what the provider costs us
 *   applied — actual x the margin (2x by default), i.e. what the customer pays
 *
 * OpenClaw does not report a cost for a turn, so `actual` is computed in Rails from
 * token counts. Rows priced from a model that is not in the rate card are marked
 * `estimated` and flagged here — an unpriced model must look like an estimate rather
 * than quietly passing for a real figure.
 */

const money = (v: string | number | null | undefined, dp = 6) => {
  const n = typeof v === 'string' ? parseFloat(v) : (v ?? 0);
  if (!Number.isFinite(n)) return '—';
  return `$${n.toFixed(dp)}`;
};

const num = (n: number | null | undefined) => (n ?? 0).toLocaleString();

const SOURCE_LABEL: Record<string, string> = {
  dashboard_assist_answer: 'Question',
  session_naming: 'Naming a chat',
  greeting: 'Greeting',
  suggestions: 'Suggestions',
};

const StatCard: React.FC<{ label: string; value: string; hint?: string; accent?: boolean }> = ({
  label, value, hint, accent,
}) => (
  <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
    <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
    <div className="mt-1 text-xl font-semibold" style={{ color: accent ? BRAND : '#111827' }}>
      {value}
    </div>
    {hint && <div className="mt-0.5 text-[11px] text-gray-400">{hint}</div>}
  </div>
);

export const AiChargesPage: React.FC = () => {
  const [data, setData] = useState<ChargesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [organizationId, setOrganizationId] = useState<string>('');
  const [provider, setProvider] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await openclawDashboardAssistanceAPI.charges({
        organizationId: organizationId || undefined,
        provider: provider || undefined,
        from: from || undefined,
        to: to || undefined,
        page,
        perPage: PER_PAGE,
      });
      setData(r);
    } catch (e) {
      setError((e as Error).message || 'Could not load charges.');
    } finally {
      setLoading(false);
    }
  }, [organizationId, provider, from, to, page]);

  useEffect(() => { load(); }, [load]);

  // Any filter change invalidates the page number — staying on page 4 of a filter that
  // now has one page shows an empty table and looks like a bug.
  const onFilter = (fn: () => void) => { fn(); setPage(1); };

  const providers = useMemo<string[]>(
    () => Array.from(new Set((data?.charges ?? []).map((c: ChargeRow) => c.provider))).sort(),
    [data]
  );

  const totals = data?.totals;
  const pagination = data?.pagination;
  const estimatedCount = (data?.charges ?? []).filter((c) => c.cost_basis === 'estimated').length;

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">AI Charges</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Token usage and cost per AI turn. Applied = actual × margin.
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm
                     text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* totals cover the whole filter, not just this page */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Turns" value={num(totals?.rows)} />
        <StatCard label="Input tokens" value={num(totals?.input_tokens)} />
        <StatCard label="Output tokens" value={num(totals?.output_tokens)} />
        <StatCard label="Actual cost" value={money(totals?.actual_charges, 4)} hint="what the provider costs" />
        <StatCard label="Applied" value={money(totals?.applied_charges, 4)} hint="what is billed" accent />
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Organization</span>
          <select
            value={organizationId}
            onChange={(e) => onFilter(() => setOrganizationId(e.target.value))}
            className="min-w-[220px] rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none"
          >
            <option value="">All organizations</option>
            {(data?.filters?.organizations ?? []).map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Provider</span>
          <select
            value={provider}
            onChange={(e) => onFilter(() => setProvider(e.target.value))}
            className="min-w-[140px] rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none"
          >
            <option value="">All</option>
            {providers.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">From</span>
          <input type="date" value={from} onChange={(e) => onFilter(() => setFrom(e.target.value))}
                 className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">To</span>
          <input type="date" value={to} onChange={(e) => onFilter(() => setTo(e.target.value))}
                 className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none" />
        </label>

        {(organizationId || provider || from || to) && (
          <button
            onClick={() => onFilter(() => { setOrganizationId(''); setProvider(''); setFrom(''); setTo(''); })}
            className="ml-auto text-sm text-gray-500 underline hover:text-gray-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {estimatedCount > 0 && (
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {estimatedCount} row{estimatedCount === 1 ? ' is' : 's are'} priced at a default rate
            because that model is not in the rate card. Add it to <code>config/ai_rate_card.yml</code>{' '}
            to price future turns exactly — existing rows keep the rate they were charged at.
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">User</th>
              <th className="px-3 py-2 font-medium">Organization</th>
              <th className="px-3 py-2 font-medium">Model</th>
              <th className="px-3 py-2 font-medium">Source</th>
              <th className="px-3 py-2 text-right font-medium">In</th>
              <th className="px-3 py-2 text-right font-medium">Out</th>
              <th className="px-3 py-2 text-right font-medium">Actual</th>
              <th className="px-3 py-2 text-right font-medium">Applied</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={9} className="px-3 py-8 text-center text-gray-500">
                <Loader2 className="mx-auto h-5 w-5 animate-spin" style={{ color: BRAND }} />
              </td></tr>
            )}
            {!loading && (data?.charges ?? []).length === 0 && (
              <tr><td colSpan={9} className="px-3 py-8 text-center text-gray-500">
                No charges for this filter.
              </td></tr>
            )}
            {!loading && (data?.charges ?? []).map((c: ChargeRow) => (
              <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                  {new Date(c.created_at).toLocaleString(undefined,
                    { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-3 py-2 text-gray-800">{c.user_name || `#${c.asked_by}`}</td>
                <td className="max-w-[200px] truncate px-3 py-2 text-gray-600"
                    title={c.organization_name || ''}>
                  {c.organization_name || '—'}
                </td>
                <td className="px-3 py-2">
                  <span className="text-gray-800">{c.model}</span>
                  {c.cost_basis === 'estimated' && (
                    <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                      estimated
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-600">{SOURCE_LABEL[c.source] || c.source}</td>
                <td className="px-3 py-2 text-right tabular-nums text-gray-700">{num(c.tokens.input)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-gray-700">{num(c.tokens.output)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-gray-700">{money(c.actual_charges)}</td>
                <td className="px-3 py-2 text-right font-medium tabular-nums" style={{ color: BRAND }}>
                  {money(c.applied_charges)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination — 10 per page */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {pagination.page} of {pagination.total_pages}
            {' · '}{num(pagination.total_entries)} charges
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1.5
                         disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
              disabled={pagination.page >= pagination.total_pages}
              className="flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1.5
                         disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:bg-gray-50"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChargesPage;
