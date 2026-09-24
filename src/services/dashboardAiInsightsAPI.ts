import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

/**
 * AI Insights for a dashboard chart.
 *
 * The button on each chart posts its own `chart_code` plus whatever the dashboard's
 * site and date filters currently hold. The backend looks that code up in
 * DashboardAiInsights — which knows the chart's fact table, real date column and path
 * to site_id — writes one read-only SELECT, runs it behind the same SQL guardrail the
 * chat assistant uses, and reads the rows back as insights, gaps and patterns.
 *
 * Generation runs in Sidekiq (two model round trips plus a query, 5-15s), so the POST
 * returns a request_id and the client polls.
 *
 * site_ids is MANDATORY; the date range is optional. Site access is resolved
 * server-side from the authenticated user, so what is sent here can only ever NARROW
 * the scope, never widen it.
 */

export interface InsightMetric {
  label: string;
  value: string | number;
  hint?: string | null;
}

/** insights / gaps / patterns all share this shape. */
export interface InsightItem {
  title: string;
  detail: string;
}

export interface ChartInsights {
  headline: string;
  summary: string;
  metrics: InsightMetric[];
  insights: InsightItem[];
  gaps: InsightItem[];
  patterns: InsightItem[];
  recommendations: string[];
}

export interface ChartSource {
  table: string;
  date_column: string;
  site_path?: string;
  api?: string | null;
}

export interface QueuedResponse {
  success: boolean;
  status: 'queued';
  request_id: string;
  chart_code: string;
  chart: { name: string; module: string; source: ChartSource };
  scope: { site_ids: number[]; from_date?: string | null; to_date?: string | null };
  poll_url: string;
  error?: string;
}

export interface InsightsResult {
  success: boolean;
  status: 'ready' | 'pending';
  request_id: string;
  chart_code: string;
  chart?: { name: string; module: string; source: ChartSource };
  insights?: ChartInsights;
  meta?: {
    row_count: number;
    attempts: number;
    cached: boolean;
    generated_at: string;
    /** The SQL that produced the figures, so an insight can be audited. */
    sql: string;
  };
  error?: string;
}

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: getAuthHeader(),
});

const BASE = '/openclaw_dashboard_assistance';

export const dashboardAiInsightsAPI = {
  /** Enqueue generation. Returns a request_id to poll. */
  async request(params: {
    chartCode: string;
    siteIds: (string | number)[];
    fromDate?: string;
    toDate?: string;
    refresh?: boolean;
    signal?: AbortSignal;
  }): Promise<QueuedResponse> {
    const res = await fetch(getFullUrl(`${BASE}/ai_insights`), {
      method: 'POST',
      headers: headers(),
      signal: params.signal,
      body: JSON.stringify({
        chart_code: params.chartCode,
        site_ids: params.siteIds,
        from_date: params.fromDate,
        to_date: params.toDate,
        refresh: params.refresh ? 1 : undefined,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok && res.status !== 202) {
      throw new Error(body?.error || `Could not start insights (${res.status})`);
    }
    return body as QueuedResponse;
  },

  /** 202 while the job is still working, 200 once it has written the result. */
  async result(requestId: string, signal?: AbortSignal): Promise<InsightsResult> {
    const res = await fetch(
      getFullUrl(`${BASE}/ai_insights/${encodeURIComponent(requestId)}`),
      { headers: headers(), signal }
    );
    const body = await res.json().catch(() => ({}));
    if (res.status === 202) return { ...(body as InsightsResult), status: 'pending' };
    return body as InsightsResult;
  },

  /** Every chart_code the button can be wired to, grouped by module. */
  async charts(): Promise<Record<string, { code: string; name: string }[]>> {
    const res = await fetch(getFullUrl(`${BASE}/ai_insights_charts`), { headers: headers() });
    if (!res.ok) return {};
    const body = await res.json().catch(() => ({}));
    return body?.modules ?? {};
  },
};

/**
 * Poll until the job writes a result, the caller aborts, or we give up.
 *
 * Generation is 5-15s on a warm database and longer when the model retries a failed
 * query, so the ceiling is generous.
 */
export async function pollForInsights(
  requestId: string,
  opts: { intervalMs?: number; timeoutMs?: number; signal?: AbortSignal } = {}
): Promise<InsightsResult> {
  const interval = opts.intervalMs ?? 2500;
  const deadline = Date.now() + (opts.timeoutMs ?? 120000);

  while (Date.now() < deadline) {
    if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    const r = await dashboardAiInsightsAPI.result(requestId, opts.signal);
    if (r.status !== 'pending') return r;

    await new Promise((res) => setTimeout(res, interval));
  }
  throw new Error('Insights are taking longer than expected. Try a narrower date range.');
}
