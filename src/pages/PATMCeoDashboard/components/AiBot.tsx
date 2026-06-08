import { useState, useRef, useEffect } from 'react';

const AI_SYSTEM_PROMPT = `You are the PATM AI Assistant — an embedded analytics bot inside the Lockated PATM CEO Dashboard, used by Chetan Bafna (CEO).

PATM = Project & Task Management. Internal tool tracking all Lockated / GoPhygital company work.

LIVE DATA — 07 May 2026:
PROJECTS: 39 total · 15 healthy · 16 at risk · 8 critical
TASKS: 22,218 total · 5,312 done (23.9%) · 2,192 overdue (9.9%) · 7,141 open · 2,773 in progress
TO-DOS: 1,879 open · 1,493 done · 80 overdue
ISSUES: 1,852 total · 175 open · 31 reopened · 907 completed · 688 closed
MILESTONES: 1,616 total · 142 done (8.8%) · 1,161 in progress (avg 9.5% complete) · 142 "closed" at only 49% done — false closure
SPRINTS: 9 total · 1 active (Sprint 9, 58% complete) · 1 overrunning 111 days (Sprint 8) · 7 abandoned/test (Sprints 3–7)

CRITICAL PROJECTS:
- Parking: 0% complete, 29 days no activity, Abdul Ghaffar owner
- PTW (Permit to Work): 2% complete, 29 days no activity, Abdul Ghaffar owner
- HSE App: 38% complete, 3 days quiet, Shahab Tufail owner
- MSafe: 28% complete, 2 days quiet, Vinayak Mane owner
- Brokers CP App: 0%, stalled, Kshitij Rasal owner
- Hi Society: Active but 284 open issues, highest issue source
- ZUWOS: Critical
69% of projects have no end date set.

TOP 10 OVERDUE TASK OWNERS:
1. Sadanand Gupta — 1,214 overdue tasks
2. Mahendra Lungare — 440
3. Bilal Shaikh — 410
4. Pooja Jadhav — 402
5. Abdul Ghaffar — 398 (zero velocity — 0 tasks completed this month)

KEY METRICS:
- Execution Score: 58/100 · Avg Cycle Time: 16.2d · Overdue Rate: 9.9% · MoM Follow-through: 11%

Your job: Answer Chetan sir's questions directly and helpfully. Be concise (2–4 sentences). Always end with the single most important action if applicable.`;

type Message = { role: 'bot' | 'user'; text: string; time: string };

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

interface AiBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AiBot({ isOpen, onToggle }: AiBotProps) {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [keyError, setKeyError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && savedKey) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen, savedKey]);

  function saveKey() {
    if (!apiKey.startsWith('sk-')) {
      setKeyError(true);
      return;
    }
    setSavedKey(apiKey);
    setKeyError(false);
  }

  async function send(text: string) {
    if (isLoading || !text.trim()) return;
    const userMsg: Message = { role: 'user', text, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setShowSuggestions(false);
    historyRef.current.push({ role: 'user', content: text });
    setIsLoading(true);

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': savedKey!,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: AI_SYSTEM_PROMPT,
          messages: historyRef.current,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        const msg = (err as any)?.error?.message || `API error ${resp.status}`;
        setMessages((prev) => [...prev, { role: 'bot', text: '⚠️ ' + msg + (resp.status === 401 ? ' — check your API key.' : ''), time: now() }]);
        if (resp.status === 401) {
          setSavedKey(null);
          historyRef.current = [];
        }
      } else {
        const data = await resp.json();
        const reply = data.content?.[0]?.text || 'No response received.';
        setMessages((prev) => [...prev, { role: 'bot', text: reply, time: now() }]);
        historyRef.current.push({ role: 'assistant', content: reply });
        if (historyRef.current.length > 16) historyRef.current = historyRef.current.slice(-16);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: '⚠️ Network error — make sure you are connected.', time: now() }]);
    }

    setIsLoading(false);
  }

  function handleKeydown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function formatText(text: string) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  return (
    <>
      {/* FAB */}
      <button className="ai-fab" onClick={onToggle} title="Ask AI about this dashboard">
        <span className="ai-fab-icon">✦</span>
        <span className="ai-fab-badge">AI</span>
      </button>

      {/* PANEL */}
      <div className={`ai-panel${isOpen ? ' open' : ''}`}>
        {/* Header */}
        <div className="ai-panel-head">
          <div className="ai-panel-logo">✦</div>
          <div>
            <div className="ai-panel-title">PATM AI Assistant</div>
            <div className="ai-panel-sub">Ask anything about this dashboard</div>
          </div>
          <button className="ai-panel-close" onClick={onToggle}>✕</button>
        </div>

        {!savedKey ? (
          /* API Key Setup */
          <div className="ai-setup">
            <div style={{ fontSize: 36 }}>✦</div>
            <div className="ai-setup-title">Connect your Anthropic API key</div>
            <div className="ai-setup-sub">
              Your key stays in memory only — never stored, never sent anywhere except Anthropic's API. One session, one key.
            </div>
            <input
              type="password"
              className="ai-key-input"
              placeholder="sk-ant-api03-..."
              autoComplete="off"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setKeyError(false); }}
              style={keyError ? { borderColor: '#E7848E' } : undefined}
            />
            <button className="ai-key-btn" onClick={saveKey}>Activate AI Assistant →</button>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)', textAlign: 'center', lineHeight: 1.6 }}>
              Get your key at console.anthropic.com<br />
              This is a demo — the bot reads real PATM data loaded in this dashboard
            </div>
          </div>
        ) : (
          /* Chat */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <div className="ai-messages" id="aiMessages">
              {/* Intro */}
              <div className="ai-msg bot">
                <div className="ai-msg-avatar bot">✦</div>
                <div>
                  <div className="ai-msg-bubble">
                    Hi Chetan sir 👋 I have full context of today's PATM data — 22,218 tasks, 39 projects, 9 sprints, and all team metrics.<br /><br />Ask me anything. I'll give you direct answers, not just numbers.
                  </div>
                  <div className="ai-msg-time">{now()}</div>
                </div>
              </div>

              {messages.map((m, i) => (
                <div key={i} className={`ai-msg ${m.role}`}>
                  <div className={`ai-msg-avatar ${m.role}`}>{m.role === 'bot' ? '✦' : 'CB'}</div>
                  <div>
                    <div className="ai-msg-bubble" dangerouslySetInnerHTML={{ __html: formatText(m.text) }} />
                    <div className="ai-msg-time">{m.time}</div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="ai-msg bot">
                  <div className="ai-msg-avatar bot">✦</div>
                  <div className="ai-msg-bubble" style={{ padding: '8px 14px' }}>
                    <div className="ai-dot-pulse">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {showSuggestions && (
              <div className="ai-suggestions">
                {['What needs action today?', 'Who is most overdue?', 'Sprint health summary', 'Which projects are critical?', 'Why is backlog growing?'].map((s) => (
                  <button key={s} className="ai-sug" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            )}

            <div className="ai-input-row">
              <textarea
                ref={inputRef}
                className="ai-textarea"
                placeholder="Ask about tasks, sprints, team, projects…"
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                }}
                onKeyDown={handleKeydown}
              />
              <button className="ai-send" disabled={isLoading} onClick={() => send(input)}>
                <svg viewBox="0 0 24 24">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
            <div className="ai-powered">Powered by Claude · Anthropic</div>
          </div>
        )}
      </div>
    </>
  );
}
