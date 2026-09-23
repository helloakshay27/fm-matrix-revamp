import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles, X, Maximize2, Minimize2, Send, Loader2, AlertTriangle, RotateCcw,
  ChevronDown, ChevronRight, FileSpreadsheet, FileText, FileDown,
  MessageSquarePlus, History, Check, Pencil,
} from 'lucide-react';
import { getAuthHeader } from '@/config/apiConfig';
import {
  openclawDashboardAssistanceAPI,
  pollForAnswer,
  type AssistantAnswer,
  type AnswerTable,
  type AssistantSession,
  type ProgressResponse,
  type Greeting,
  type Conversation,
  type IntentInfo,
} from '@/services/openclawDashboardAssistanceAPI';

const BRAND = '#C72030';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text?: string;               // the agent's working narrative — secondary
  answer?: AssistantAnswer;    // the structured answer — primary
  error?: string;
  pending?: boolean;
  phase?: string;              // live label while pending
  attempts?: number;
  requestId?: string;          // for download + clarification reply
  awaitingReply?: boolean;     // the agent asked THIS message's question
  intent?: IntentInfo;         // what Rails decided this turn was
}

interface Props {
  siteIds: (string | number)[];
  fromDate?: string;
  toDate?: string;
}

const RELATIVE = (iso?: string | null) => {
  if (!iso) return '';
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return days < 30 ? `${days}d ago` : new Date(iso).toLocaleDateString();
};

/**
 * Past conversations.
 *
 * Names come from the backend, which asks a model to title a conversation about five
 * minutes in — early enough to be useful, late enough that the title describes the
 * conversation rather than its opening sentence. A name typed here locks that: the
 * auto-namer will not overwrite a human's choice.
 */
const ConversationList: React.FC<{
  conversations: Conversation[];
  currentId: number | null;
  loading: boolean;
  onOpen: (id: number) => void;
  onRename: (id: number, name: string) => void;
  onClose: () => void;
}> = ({ conversations, currentId, loading, onOpen, onRename, onClose }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState('');

  const commit = (id: number) => {
    const name = draft.trim();
    if (name) onRename(id, name);
    setEditingId(null);
  };

  return (
    <div className="absolute inset-x-0 top-[57px] bottom-0 z-10 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Conversations
        </span>
        <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-100"
                aria-label="Back to chat">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center gap-2 px-4 py-6 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: BRAND }} /> Loading…
          </div>
        )}
        {!loading && conversations.length === 0 && (
          <p className="px-4 py-6 text-sm text-gray-500">
            No past conversations yet. Ask something and it will appear here.
          </p>
        )}
        {conversations.map((c) => (
          <div key={c.id}
               className={`group flex items-start gap-2 border-b border-gray-50 px-4 py-2.5
                           ${c.id === currentId ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
            <div className="min-w-0 flex-1">
              {editingId === c.id ? (
                <div className="flex items-center gap-1">
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commit(c.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="w-full rounded border border-gray-300 px-1.5 py-0.5 text-sm
                               focus:border-gray-400 focus:outline-none"
                  />
                  <button onClick={() => commit(c.id)} className="rounded p-1 text-gray-500 hover:bg-gray-200"
                          aria-label="Save name">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => onOpen(c.id)} className="block w-full text-left">
                  <span className="block truncate text-sm font-medium text-gray-900">{c.name}</span>
                  <span className="mt-0.5 block text-[11px] text-gray-500">
                    {c.question_count} question{c.question_count === 1 ? '' : 's'}
                    {' · '}{RELATIVE(c.last_activity_at || c.created_at)}
                    {/* A rotated session is the same conversation continued in a fresh
                        OpenClaw session. Said plainly so a gap in context is explicable. */}
                    {c.generation > 1 && ` · continued (part ${c.generation})`}
                  </span>
                </button>
              )}
            </div>
            {editingId !== c.id && (
              <button
                onClick={() => { setEditingId(c.id); setDraft(c.name); }}
                className="rounded p-1 text-gray-300 opacity-0 transition hover:bg-gray-200
                           hover:text-gray-600 group-hover:opacity-100"
                aria-label="Rename conversation"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const uid = () => Math.random().toString(36).slice(2);

// Shown only if /suggestions is unreachable. The live list is AI-generated from ED.md
// and sampled at random per open, so these are a floor, not the normal path.
const SUGGESTIONS = [
  'How many tickets were raised, by site?',
  'Top 5 incident categories this period',
  'Which site has the highest energy consumption?',
  'Show me checklist completion by site',
];

/** Markdown with GitHub tables. Without remark-gfm a pipe table renders as one long line,
 *  which is exactly how the agent's category breakdown used to look. */
const Markdown: React.FC<{ children: string }> = ({ children }) => (
  <div className="text-sm leading-relaxed text-gray-800 [&_p]:my-1.5 [&_ul]:my-1.5 [&_ul]:list-disc
                  [&_ul]:pl-5 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold
                  [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[12px]
                  [&_h1]:mt-3 [&_h1]:text-base [&_h1]:font-semibold
                  [&_h2]:mt-3 [&_h2]:text-sm [&_h2]:font-semibold
                  [&_h3]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold">
    <div className="overflow-x-auto [&_table]:my-2 [&_table]:w-full [&_table]:border-collapse [&_table]:text-xs
                    [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left
                    [&_th]:font-medium [&_td]:border [&_td]:border-gray-200 [&_td]:px-2 [&_td]:py-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  </div>
);


/** Sub-labels cycled inside a real phase. The PHASE is real (from the progress endpoint,
 *  which reads recorded query attempts); the sub-label just stops a 60s wait looking frozen. */
const PHASE_STEPS: Record<string, string[]> = {
  queued:      ['Queued', 'Waiting for a free slot'],
  dispatching: ['Thinking', 'Reading the schema'],
  thinking:    ['Thinking', 'Understanding the question', 'Reading the schema',
                'Picking tables', 'Checking the columns', 'Writing the query',
                'Calling tools', 'Querying'],
  retrying:    ['Fixing the query', 'Re-reading the schema', 'Rewriting SQL', 'Querying'],
  summarizing: ['Fetching data', 'Reading the rows', 'Structuring results', 'Summarising'],
  needs_input: ['Waiting for your answer'],
  done:        ['Done'],
  failed:      ['Could not complete'],
};

const PhaseTicker: React.FC<{ phase: string; detail?: string }> = ({ phase, detail }) => {
  const steps = PHASE_STEPS[phase] || PHASE_STEPS.thinking;
  // Driven off elapsed time rather than a counter reset on every phase update. The
  // earlier version reset to step 0 whenever the polled phase changed, so with a 2.5s
  // poll and a 2.2s tick it never got past the first two words.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2000);
    return () => clearInterval(t);
  }, []);
  const i = steps.length > 1 ? tick % steps.length : 0;
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Loader2 className="h-4 w-4 animate-spin" style={{ color: BRAND }} />
      <span>{steps[i]}</span>
      {detail && <span className="text-xs text-gray-400">· {detail}</span>}
    </div>
  );
};

/** The agent's working narrative. Useful, but not the answer — collapsed by default
 *  once the structured answer has arrived. */
const WorkingNotes: React.FC<{ text: string; defaultOpen: boolean }> = ({ text, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-md border border-gray-200">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left text-xs font-medium text-gray-600 hover:bg-gray-50"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        How I worked it out
      </button>
      {open && <div className="border-t border-gray-100 px-2.5 py-2"><Markdown>{text}</Markdown></div>}
    </div>
  );
};

const DataTable: React.FC<{ table: AnswerTable }> = ({ table }) => (
  <div className="max-h-72 overflow-auto rounded-md border border-gray-200">
    <table className="w-full text-sm">
      <thead className="sticky top-0 bg-gray-100">
        <tr>
          {table.columns.map((c) => (
            <th key={c} className="px-3 py-2 text-left font-medium text-gray-700">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, i) => (
          <tr key={i} className="border-t border-gray-100">
            {row.map((cell, j) => (
              <td key={j} className="px-3 py-1.5 text-gray-800">
                {typeof cell === 'number' ? cell.toLocaleString() : cell ?? '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Structured answer from MYSQLSummaryAgent. */
const AnswerBlock: React.FC<{ answer: AssistantAnswer }> = ({ answer }) => (
  <div className="space-y-3">
    {answer.headline && (
      <p className="text-[15px] font-semibold leading-snug text-gray-900">{answer.headline}</p>
    )}
    {answer.summary && <p className="text-sm leading-relaxed text-gray-700">{answer.summary}</p>}

    {!!answer.metrics?.length && (
      <div className="grid grid-cols-2 gap-2">
        {answer.metrics.map((m, i) => (
          <div key={i} className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
            <div className="text-[11px] uppercase tracking-wide text-gray-500">{m.label}</div>
            <div className="text-lg font-semibold text-gray-900">
              {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
            </div>
          </div>
        ))}
      </div>
    )}

    {answer.table?.columns?.length ? <DataTable table={answer.table} /> : null}

    {/* analytical answers arrive as sections rather than one table */}
    {!!answer.sections?.length && (
      <div className="space-y-3">
        {answer.sections.map((sec, i) => (
          <div key={i} className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wide"
                 style={{ color: BRAND }}>
              {sec.title}
            </div>
            {sec.body && <Markdown>{sec.body}</Markdown>}
            {sec.table?.columns?.length ? <DataTable table={sec.table} /> : null}
          </div>
        ))}
      </div>
    )}

    {(answer.period?.from || answer.sites?.length) && (
      <p className="text-xs text-gray-500">
        {answer.period?.from ? `${answer.period.from} → ${answer.period.to}` : 'All time'}
        {answer.sites?.length ? ` · ${answer.sites.join(', ')}` : ''}
      </p>
    )}

    {!!answer.caveats?.length && (
      <ul className="space-y-1 rounded-md bg-amber-50 px-3 py-2">
        {answer.caveats.map((c, i) => (
          <li key={i} className="flex gap-2 text-xs text-amber-800">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
            <span>{c}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const DownloadBar: React.FC<{ requestId: string }> = ({ requestId }) => {
  const [err, setErr] = useState<string | null>(null);
  const get = async (fmt: 'xlsx' | 'csv' | 'pdf') => {
    setErr(null);
    try {
      const res = await fetch(openclawDashboardAssistanceAPI.exportUrl(requestId, fmt), {
        headers: { Authorization: getAuthHeader() },
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.hint || b?.error || `Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const name = res.headers.get('content-disposition')?.match(/filename="?([^"]+)"?/)?.[1]
        || `assistant_answer.${fmt}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = name; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr((e as Error).message);
    }
  };
  const btn = 'flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-[11px] text-gray-600 hover:bg-gray-50';
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-gray-400">Download</span>
        <button className={btn} onClick={() => get('xlsx')}><FileSpreadsheet className="h-3 w-3" /> Excel</button>
        <button className={btn} onClick={() => get('csv')}><FileDown className="h-3 w-3" /> CSV</button>
        <button className={btn} onClick={() => get('pdf')}><FileText className="h-3 w-3" /> PDF</button>
      </div>
      {err && <p className="text-[11px] text-red-600">{err}</p>}
    </div>
  );
};

export const AiAssistantChat: React.FC<Props> = ({ siteIds, fromDate, toDate }) => {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<AssistantSession | null>(null);
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // Set while the agent is waiting on an answer to its own question. Rails decides this
  // authoritatively now; this is only kept so the composer can say so on screen.
  const [awaitingFor, setAwaitingFor] = useState<string | null>(null);
  // Which conversation we are in. Null until the first turn, when Rails names one.
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const loadSuggestions = useCallback(() => {
    setSuggestions([]);
    openclawDashboardAssistanceAPI.suggestions().then((s) => s.length && setSuggestions(s));
  }, []);

  // Refetched on every open, not once per mount: the backend keeps an AI-generated pool
  // and samples five at random, so each open shows a different set. The greeting is
  // refetched too so the clock and time-of-day stay right.
  useEffect(() => {
    if (!open) return;
    openclawDashboardAssistanceAPI.greeting().then((g) => g && setGreeting(g));
    loadSuggestions();
  }, [open, loadSuggestions]);

  // Esc closes the history panel first, then fullscreen, then the panel itself.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (showHistory) setShowHistory(false);
      else if (fullscreen) setFullscreen(false);
      else setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, fullscreen, showHistory]);

  const loadConversations = useCallback(async () => {
    try {
      const r = await openclawDashboardAssistanceAPI.conversations(1, 20);
      setConversations(r.conversations);
    } catch {
      setConversations([]);
    }
  }, []);

  useEffect(() => { if (showHistory) loadConversations(); }, [showHistory, loadConversations]);

  /**
   * "New chat" — but linked to the one we were in.
   *
   * `continueFrom` is what makes this different from wiping the screen: the new session
   * inherits a rolling brief, so the assistant still knows what was discussed. Without
   * it, starting a new chat would throw away weeks of context the user expects it to have.
   */
  const startNewChat = useCallback(async () => {
    try {
      const conv = await openclawDashboardAssistanceAPI.createConversation({
        continueFrom: conversationId ?? undefined,
      });
      setConversationId(conv.id);
      setMessages([]);
      setAwaitingFor(null);
      setShowHistory(false);
      loadSuggestions();
    } catch (e) {
      setMessages((m) => [...m, { id: uid(), role: 'assistant',
        error: (e as Error).message || 'Could not start a new chat.' }]);
    }
  }, [conversationId, loadSuggestions]);

  /** Replay a past conversation into the transcript. */
  const openConversation = useCallback(async (id: number) => {
    setLoadingHistory(true);
    try {
      const d = await openclawDashboardAssistanceAPI.conversation(id, { chain: true });
      const replayed: Message[] = [];
      d.turns.forEach((t) => {
        replayed.push({ id: uid(), role: 'user', text: t.question });
        replayed.push({
          id: uid(), role: 'assistant',
          requestId: t.request_id,
          answer: t.answer?.response ?? undefined,
          error: t.answer?.outcome === 'error' ? (t.answer.error ?? 'That turn failed.') : undefined,
          intent: t.intent ? { name: t.intent, continuation: t.intent !== 'new_question' } : undefined,
        });
      });
      setMessages(replayed);
      setConversationId(id);
      setAwaitingFor(null);
      setShowHistory(false);
    } catch (e) {
      setMessages((m) => [...m, { id: uid(), role: 'assistant',
        error: (e as Error).message || 'Could not load that conversation.' }]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const renameConversation = useCallback(async (id: number, name: string) => {
    try {
      const c = await openclawDashboardAssistanceAPI.renameConversation(id, name);
      setConversations((list) => list.map((x) => (x.id === id ? c : x)));
    } catch { /* leave the old name on screen */ }
  }, []);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;

      if (!siteIds.length) {
        setMessages((m) => [...m, { id: uid(), role: 'assistant',
          error: 'Select at least one site before asking.' }]);
        return;
      }

      setInput('');
      setBusy(true);
      const pendingId = uid();
      setMessages((m) => [
        ...m,
        { id: uid(), role: 'user', text: question },
        { id: pendingId, role: 'assistant', pending: true },
      ]);

      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        // One endpoint for everything the user types. Rails works out whether this is a
        // new question, a follow-up, an answer to the agent's own question, or a request
        // to reshape the last answer — it can see whether the agent is mid-question and
        // this component cannot.
        const ask = await openclawDashboardAssistanceAPI.ask({
          question, siteIds, fromDate, toDate, sessionId: conversationId,
        });
        setAwaitingFor(null);
        if (ask.session?.id && ask.session.id !== conversationId) {
          setConversationId(ask.session.id);
        }

        setMessages((m) =>
          m.map((msg) =>
            msg.id === pendingId
              ? { ...msg, phase: 'queued', requestId: ask.request_id, intent: ask.intent }
              : msg
          )
        );

        const final = await pollForAnswer(ask.request_id, {
          signal: ctrl.signal,
          onProgress: (pr: ProgressResponse) => {
            if (pr.session) setSession(pr.session);
            setMessages((m) =>
              m.map((msg) =>
                msg.id === pendingId
                  ? { ...msg, phase: pr.phase, attempts: pr.attempts,
                      text: pr.reply?.trim() || msg.text }
                  : msg
              )
            );
          },
        });

        // A clarifying question: show it and hand control back to the user.
        if (final.needsInput) {
          setAwaitingFor(ask.request_id);
          setMessages((m) =>
            m.map((msg) =>
              msg.id === pendingId
                ? { ...msg, pending: false, awaitingReply: true,
                    text: final.reply?.trim() || msg.text }
                : msg
            )
          );
          setBusy(false);
          return;
        }

        const answer = final.response;
        setMessages((m) =>
          m.map((msg) =>
            msg.id === pendingId
              ? {
                  ...msg,
                  pending: false,
                  text: typeof answer === 'string' ? answer : msg.text,
                  answer: typeof answer === 'object' && answer ? answer : undefined,
                }
              : msg
          )
        );
      } catch (e) {
        if ((e as Error)?.name === 'AbortError') return;
        setMessages((m) =>
          m.map((msg) =>
            msg.id === pendingId
              ? { ...msg, pending: false, error: (e as Error).message || 'Something went wrong.' }
              : msg
          )
        );
      } finally {
        setBusy(false);
      }
    },
    [busy, siteIds, fromDate, toDate, awaitingFor]
  );

  // ----------------------------------------------------------------- launcher
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ask AI about this dashboard"
        className="fixed bottom-6 left-6 z-[60] flex items-center gap-2 rounded-full px-4 py-3
                   text-white shadow-lg transition-transform hover:scale-105
                   focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ backgroundColor: BRAND }}
      >
        <Sparkles className="h-5 w-5" />
        <span className="text-sm font-medium">Ask AI</span>
      </button>
    );
  }

  const pct = session?.context_used_percent;

  // ----------------------------------------------------------------- panel
  return (
    <>
      {fullscreen && (
        <div className="fixed inset-0 z-[59] bg-black/40" onClick={() => setFullscreen(false)} />
      )}
      <div
        className={
          fullscreen
            ? 'fixed inset-4 z-[60] flex flex-col overflow-hidden rounded-xl bg-white shadow-2xl md:inset-8'
            : 'fixed bottom-6 left-6 z-[60] flex h-[600px] max-h-[calc(100vh-3rem)] w-[420px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-xl bg-white shadow-2xl'
        }
      >
        {/* header */}
        <div className="flex items-center gap-2 px-4 py-3 text-white" style={{ backgroundColor: BRAND }}>
          <Sparkles className="h-4 w-4" />
          <div className="flex-1">
            <div className="text-sm font-semibold leading-tight">Dashboard Assistant</div>
            <div className="text-[11px] opacity-80">
              {siteIds.length} site{siteIds.length === 1 ? '' : 's'}
              {fromDate && toDate ? ` · ${fromDate} → ${toDate}` : ' · no date filter'}
            </div>
          </div>
          <button onClick={() => setShowHistory((h) => !h)} aria-label="Past conversations"
                  title="Past conversations"
                  className={`rounded p-1 hover:bg-white/20 ${showHistory ? 'bg-white/20' : ''}`}>
            <History className="h-4 w-4" />
          </button>
          <button onClick={startNewChat} aria-label="New chat" title="New chat"
                  className="rounded p-1 hover:bg-white/20">
            <MessageSquarePlus className="h-4 w-4" />
          </button>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} aria-label="Clear the screen"
                    title="Clear the screen (the conversation is kept)"
                    className="rounded p-1 hover:bg-white/20">
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => setFullscreen((f) => !f)}
                  aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
                  className="rounded p-1 hover:bg-white/20">
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button onClick={() => setOpen(false)} aria-label="Close"
                  className="rounded p-1 hover:bg-white/20">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* context usage — the session rotates and archives itself when this fills */}
        {typeof pct === 'number' && (
          <div className="border-b border-gray-100 px-4 py-1.5">
            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <span>Context {pct}% used</span>
              {session?.rotated_this_turn && <span className="text-amber-600">new session started</span>}
            </div>
            <div className="mt-1 h-1 w-full rounded-full bg-gray-100">
              <div className="h-1 rounded-full transition-all"
                   style={{ width: `${Math.min(100, pct)}%`,
                            backgroundColor: pct > (session?.rotate_at_percent ?? 85) ? '#d97706' : BRAND }} />
            </div>
          </div>
        )}

        {/* past conversations — a drawer over the transcript, not a second column, so it
            works at 420px as well as fullscreen */}
        {showHistory && (
          <ConversationList
            conversations={conversations}
            currentId={conversationId}
            loading={loadingHistory}
            onOpen={openConversation}
            onRename={renameConversation}
            onClose={() => setShowHistory(false)}
          />
        )}

        {/* messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              {greeting ? (
                <div>
                  <p className="text-[15px] font-semibold text-gray-900">{greeting.greeting}</p>
                  <p className="text-xs text-gray-500">
                    {greeting.date} · {greeting.local_time}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">{greeting.subtitle}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Ask about the data behind this dashboard. I read the schema, write a
                  read-only query and report what it returns.
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wide text-gray-400">
                  Try asking
                </span>
                <button
                  onClick={loadSuggestions}
                  className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700"
                  aria-label="Show different suggestions"
                >
                  <RotateCcw className="h-3 w-3" /> Shuffle
                </button>
              </div>
              <div className="space-y-1.5">
                {(suggestions.length ? suggestions : SUGGESTIONS).map((s) => (
                  <button key={s} onClick={() => send(s)}
                          className="block w-full rounded-md border border-gray-200 px-3 py-2
                                     text-left text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm text-white"
                     style={{ backgroundColor: BRAND }}>
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="max-w-[95%] space-y-2">
                {/* the structured answer is the answer; everything else is supporting */}
                {m.answer && <AnswerBlock answer={m.answer} />}
                {m.answer && m.requestId && <DownloadBar requestId={m.requestId} />}

                {m.text && (
                  m.answer
                    ? <WorkingNotes text={m.text} defaultOpen={false} />
                    : <Markdown>{m.text}</Markdown>
                )}

                {m.pending && (
                  <PhaseTicker
                    phase={m.phase || 'queued'}
                    detail={m.attempts && m.attempts > 1 ? `attempt ${m.attempts}` : undefined}
                  />
                )}
                {m.error && (
                  <div className="flex gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{m.error}</span>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* composer */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
              }}
              rows={1}
              placeholder={awaitingFor
                ? 'Answer the question above…'
                : 'Ask about tickets, assets, energy, incidents…'}
              className="max-h-32 flex-1 resize-none rounded-md border border-gray-200 px-3 py-2
                         text-sm outline-none focus:border-gray-400"
            />
            <button
              onClick={() => send(input)}
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="rounded-md p-2 text-white disabled:opacity-40"
              style={{ backgroundColor: BRAND }}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1.5 text-[10px] text-gray-400">
            Read-only. Answers cover only the sites you have access to.
          </p>
        </div>
      </div>
    </>
  );
};

export default AiAssistantChat;
