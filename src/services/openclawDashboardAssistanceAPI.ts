import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

/**
 * OpenClaw Dashboard Assistance — natural-language querying of FM data.
 *
 *   ask_ai        -> the only way to send text. Rails classifies the turn (new question,
 *                    follow-up, clarification, append, reformat) and routes it.
 *   result        -> polled until the agent posts the structured answer
 *   conversations -> the sidebar: our durable history
 *   charges       -> what the AI has cost, by organization
 *
 * The backend resolves site access from the authenticated user, so site_ids sent from
 * here are a *narrowing* selection only — they can never widen what the user may see.
 */

/** What Rails decided this turn was. See DashboardAssistIntentClassifier. */
export type AssistantIntent =
  | 'new_question' | 'follow_up' | 'clarification' | 'append' | 'reformat';

export interface IntentInfo {
  name: AssistantIntent;
  confidence?: number;
  reason?: string;
  /** True for everything except new_question — render it under the previous answer. */
  continuation: boolean;
}

export interface Conversation {
  id: number;
  name: string;
  named: boolean;
  name_locked: boolean;
  generation: number;
  status: 'active' | 'rotated' | 'archived';
  question_count: number;
  created_at: string;
  last_activity_at: string | null;
  root_session_id: number | null;
  previous_session_id: number | null;
  openclaw_session_id?: string;
  continued_from_brief?: boolean;
  tokens: { input: number; output: number; context: number };
}

export interface ConversationTurn {
  question_id: number;
  request_id: string;
  question: string;
  intent: AssistantIntent;
  status: string;
  asked_at: string;
  duration_ms: number | null;
  site_ids: number[] | null;
  period: { from: string | null; to: string | null };
  answer: {
    id: number;
    response: AssistantAnswer | null;
    outcome: 'ok' | 'needs_input' | 'error';
    rows: number | null;
    error: string | null;
    feedback: number | null;
    answered_at: string;
    export_url: string;
  } | null;
}

export interface Pagination {
  page: number;
  per_page: number;
  total_pages: number;
  total_entries: number;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  pagination: Pagination;
}

export interface ConversationDetail {
  conversation: Conversation;
  turns: ConversationTurn[];
  pagination: Pagination;
}

export interface ChargeRow {
  id: number;
  created_at: string;
  provider: string;
  model: string;
  source: string;
  asked_by: number;
  user_name: string | null;
  organization_id: number | null;
  organization_name: string | null;
  request_id: string | null;
  tokens: { input: number; output: number; cached: number; total: number };
  actual_charges: string;
  applied_charges: string;
  margin_multiplier: string;
  currency: string;
  /** 'estimated' means the model was not in the rate card and a default rate was used. */
  cost_basis: 'computed' | 'provider' | 'estimated';
  rates: { input: string | null; output: string | null; cached: string | null };
  billed_at: string | null;
}

export interface ChargesResponse {
  totals: {
    rows: number;
    input_tokens: number;
    output_tokens: number;
    actual_charges: string;
    applied_charges: string;
    margin: string;
    currency: string;
  };
  charges: ChargeRow[];
  filters: { organizations: { id: number; name: string }[] };
  pagination: Pagination;
}

export interface ChargeFilters {
  organizationId?: number | string;
  provider?: string;
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
}

const emptyPagination = (perPage: number): Pagination => ({
  page: 1, per_page: perPage, total_pages: 0, total_entries: 0,
});

export interface AssistantSession {
  id?: string;
  generation?: number;
  rotated_this_turn?: boolean;
  rotate_at_percent?: number;
  context_used_tokens?: number;
  context_limit_tokens?: number;
  context_used_percent?: number;
}

export interface AskAiResponse {
  success: boolean;
  request_id: string;
  status: string;
  asked_question: string;
  question_id?: number;
  /** What Rails classified this turn as — drives how the UI renders it. */
  intent?: IntentInfo;
  session?: { id: number; name: string; generation: number; question_count: number };
  context?: Record<string, unknown>;
  agent?: { reply?: string; needs_input?: boolean };
  poll_url?: string;
  error?: string;
}

export interface AnswerTable {
  columns: string[];
  rows: (string | number | null)[][];
}

export interface AnswerSection {
  title: string;
  body?: string;
  table?: AnswerTable | null;
}

export interface AssistantAnswer {
  headline?: string;
  summary?: string;
  metrics?: { label: string; value: string | number }[];
  table?: AnswerTable | null;
  sections?: AnswerSection[];
  period?: { from?: string | null; to?: string | null };
  sites?: string[];
  caveats?: string[];
  row_count?: number;
  truncated?: boolean;
}

export interface ProgressResponse {
  phase:
    | 'queued' | 'thinking' | 'retrying' | 'summarizing'
    | 'needs_input' | 'done' | 'failed' | 'unknown';
  label: string;
  done: boolean;
  attempts: number;
  /** ask_ai is async now, so the agent's first reply arrives here, not in ask(). */
  needs_input?: boolean;
  reply?: string | null;
  session?: AssistantSession | null;
  row_count?: number | null;
  last_error?: string | null;
  steps?: { attempt: number; ok: boolean; error?: string; row_count?: number }[];
}

export interface ResultResponse {
  pending: boolean;
  needsInput?: boolean;
  reply?: string | null;
  user_id?: number;
  asked_question?: string;
  response?: AssistantAnswer | string;
}

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: getAuthHeader(),
});

export interface Greeting {
  greeting: string;
  subtitle: string;
  user_name: string;
  first_name: string;
  time_of_day: string;
  local_time: string;
  date: string;
}

export const openclawDashboardAssistanceAPI = {
  async greeting(): Promise<Greeting | null> {
    try {
      const res = await fetch(getFullUrl('/openclaw_dashboard_assistance/greeting'), {
        headers: headers(),
      });
      return res.ok ? ((await res.json()) as Greeting) : null;
    } catch {
      return null;
    }
  },

  async suggestions(): Promise<string[]> {
    try {
      const res = await fetch(getFullUrl('/openclaw_dashboard_assistance/suggestions'), {
        headers: headers(),
      });
      if (!res.ok) return [];
      const b = await res.json();
      return Array.isArray(b?.suggestions) ? b.suggestions : [];
    } catch {
      return [];
    }
  },

  /** Download the stored answer as a file. Built in Rails from the same structured data. */
  exportUrl(requestId: string, format: 'xlsx' | 'csv' | 'pdf'): string {
    return getFullUrl(
      `/openclaw_dashboard_assistance/export/${encodeURIComponent(requestId)}?format=${format}`
    );
  },

  /**
   * The ONLY way to send the user's text. There used to be a separate `reply()` for
   * answering the agent's clarifying question, and the UI had to decide which to call —
   * a decision it cannot make correctly, because whether the agent is waiting on an
   * answer is server state. Rails classifies the turn now and returns what it decided
   * in `intent`.
   */
  async ask(params: {
    question: string;
    siteIds?: (string | number)[];
    fromDate?: string;
    toDate?: string;
    sessionId?: number | null;
    /** Only for a UI affordance that genuinely knows, e.g. a "show as table" button. */
    intent?: AssistantIntent;
  }): Promise<AskAiResponse> {
    const res = await fetch(getFullUrl('/openclaw_dashboard_assistance/ask_ai'), {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        question: params.question,
        site_ids: params.siteIds,
        from_date: params.fromDate,
        to_date: params.toDate,
        session_id: params.sessionId ?? undefined,
        intent: params.intent,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
    return body as AskAiResponse;
  },

  // ---------------------------------------------------------------- conversations

  /** The sidebar. Our own durable history, not OpenClaw's live session state. */
  async conversations(page = 1, perPage = 20): Promise<ConversationListResponse> {
    const res = await fetch(
      getFullUrl(`/openclaw_dashboard_assistance/conversations?page=${page}&per_page=${perPage}`),
      { headers: headers() }
    );
    if (!res.ok) return { conversations: [], pagination: emptyPagination(perPage) };
    return (await res.json()) as ConversationListResponse;
  },

  /**
   * Start a new conversation.
   *
   * `continueFrom` is the difference between "new chat" and "carry on in a fresh
   * session": passing it links the two so the rolling brief travels across and the
   * assistant still remembers what was discussed.
   */
  async createConversation(opts: { continueFrom?: number; name?: string } = {}): Promise<Conversation> {
    const res = await fetch(getFullUrl('/openclaw_dashboard_assistance/conversations'), {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ continue_from: opts.continueFrom, name: opts.name }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || `Could not start a new chat (${res.status})`);
    return body.conversation as Conversation;
  },

  /** Replay one conversation. `chain` includes earlier generations of the same thread. */
  async conversation(id: number, opts: { chain?: boolean; page?: number } = {}): Promise<ConversationDetail> {
    const q = new URLSearchParams();
    if (opts.chain) q.set('chain', '1');
    if (opts.page) q.set('page', String(opts.page));
    const res = await fetch(
      getFullUrl(`/openclaw_dashboard_assistance/conversations/${id}?${q}`),
      { headers: headers() }
    );
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || `Could not load that conversation (${res.status})`);
    return body as ConversationDetail;
  },

  async renameConversation(id: number, name: string): Promise<Conversation> {
    const res = await fetch(getFullUrl(`/openclaw_dashboard_assistance/conversations/${id}`), {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ name }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || `Could not rename (${res.status})`);
    return body.conversation as Conversation;
  },

  // ---------------------------------------------------------------- charges

  async charges(filters: ChargeFilters = {}): Promise<ChargesResponse> {
    const q = new URLSearchParams();
    if (filters.organizationId) q.set('organization_id', String(filters.organizationId));
    if (filters.provider) q.set('provider', filters.provider);
    if (filters.from) q.set('from', filters.from);
    if (filters.to) q.set('to', filters.to);
    q.set('page', String(filters.page ?? 1));
    q.set('per_page', String(filters.perPage ?? 10));

    const res = await fetch(getFullUrl(`/openclaw_dashboard_assistance/charges?${q}`), {
      headers: headers(),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || `Could not load charges (${res.status})`);
    return body as ChargesResponse;
  },

  /** 202 while the agents are still working, 200 once the answer is posted. */
  async result(requestId: string): Promise<ResultResponse> {
    const res = await fetch(
      getFullUrl(`/openclaw_dashboard_assistance/result/${encodeURIComponent(requestId)}`),
      { headers: headers() }
    );
    if (res.status === 202) return { pending: true };
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
    return { pending: false, ...body };
  },

  /** Real phase of an in-flight request, derived from recorded query attempts. */
  async progress(requestId: string): Promise<ProgressResponse | null> {
    try {
      const res = await fetch(
        getFullUrl(`/openclaw_dashboard_assistance/progress/${encodeURIComponent(requestId)}`),
        { headers: headers() }
      );
      if (!res.ok) return null;
      return (await res.json()) as ProgressResponse;
    } catch {
      return null;
    }
  },

  async sessions(): Promise<Record<string, unknown>> {
    const res = await fetch(getFullUrl('/openclaw_dashboard_assistance/sessions'), {
      headers: headers(),
    });
    return res.json().catch(() => ({}));
  },
};

/**
 * Poll `result` until the summary agent posts, the caller aborts, or we give up.
 * Agent turns routinely take 30-90s (think -> query -> retry -> summarise), so the
 * default ceiling is generous.
 */
export async function pollForAnswer(
  requestId: string,
  opts: {
    intervalMs?: number;
    timeoutMs?: number;
    signal?: AbortSignal;
    onProgress?: (p: ProgressResponse) => void;
  } = {}
): Promise<ResultResponse> {
  const interval = opts.intervalMs ?? 2500;
  const deadline = Date.now() + (opts.timeoutMs ?? 300000);

  while (Date.now() < deadline) {
    if (opts.signal?.aborted) throw new DOMException('Aborted', 'AbortError');

    const r = await openclawDashboardAssistanceAPI.result(requestId);
    if (!r.pending) return r;

    const p = await openclawDashboardAssistanceAPI.progress(requestId);
    if (p) {
      opts.onProgress?.(p);
      // The agent asked the user something — there will be no result until they reply.
      if (p.needs_input) return { pending: false, response: undefined, needsInput: true, reply: p.reply };
      if (p.phase === 'failed') return { pending: false, response: p.reply || undefined };
    }
    await new Promise((res) => setTimeout(res, interval));
  }
  throw new Error('The assistant is taking longer than expected. Try a narrower date range.');
}
