import { useState, useRef, useEffect } from "react";
import axios from "axios";

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

const phrases = ["Fetching", "Thinking", "Generating results"];

function ChatLoader() {
  const [i, setI] = useState(0);
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    const phraseTimer = setInterval(() => setI((prev) => (prev + 1) % phrases.length), 1400);
    const secTimer = setInterval(() => setSecs((prev) => prev + 1), 1000);
    return () => {
      clearInterval(phraseTimer);
      clearInterval(secTimer);
    };
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs text-white font-semibold">
          <span>{phrases[i]}</span>
          <span className="text-[10px] text-neutral-400">{secs}s</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="w-1 h-1 rounded-full bg-white/60 animate-bounce"
            style={{ animationDelay: `${d * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
};

type Message = { role: "bot" | "user"; text: string; time: string; durationMs?: number };

function now() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1).replace(/\.0$/, "")}s`;
}

interface AiBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AiBot({ isOpen, onToggle }: AiBotProps) {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [keyError, setKeyError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<{ role: string; content: string }[]>([]);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}") || {};
  const baseUrl = localStorage.getItem("baseUrl");

  function getCurrentUserId() {
    const userIdFromStorage =
      currentUser?.id ??
      currentUser?.user_id ??
      currentUser?.userId ??
      localStorage.getItem("userId") ??
      localStorage.getItem("user_id") ??
      "";

    return userIdFromStorage ? String(userIdFromStorage) : "";
  }

  function getCurrentUserInitials() {
    const fullName =
      currentUser?.firstname ||
      currentUser?.first_name ||
      currentUser?.firstName ||
      currentUser?.name ||
      currentUser?.full_name ||
      currentUser?.fullName ||
      "";

    const words = String(fullName).trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "U";
    if (words.length === 1) return words[0]?.[0]?.toUpperCase() || "U";

    const firstInitial = words[0][0]?.toUpperCase() || "";
    const lastInitial = words[words.length - 1][0]?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "U";
  }

  function extractReplyText(payload: unknown): string {
    if (typeof payload === "string") return payload;
    if (!payload || typeof payload !== "object") return "";

    const record = payload as Record<string, any>;
    const candidates = [
      record.reply,
      record.response,
      record.message,
      record.answer,
      record.text,
      record.output,
      record.data?.reply,
      record.data?.response,
      record.data?.message,
      record.data?.answer,
      record.data?.text,
      record.result?.reply,
      record.result?.message,
      record.result?.response,
    ];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim())
        return candidate.trim();
    }

    return "";
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && savedKey) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen, savedKey]);

  function saveKey() {
    if (!apiKey.startsWith("sk-")) {
      setKeyError(true);
      return;
    }
    setSavedKey(apiKey);
    setKeyError(false);
  }

  async function send(text: string) {
    if (isLoading || !text.trim()) return;
    const requestStartTime = Date.now();
    const userMsg: Message = { role: "user", text, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowSuggestions(false);
    historyRef.current.push({ role: "user", content: text });
    setIsLoading(true);

    try {
      const currentUserId = getCurrentUserId();
      const authToken = localStorage.getItem("token");

      const response = await axios.post(
        `https://${baseUrl}/patm_dashboard/patm_chat_bot.json`,
        {
          user: currentUserId ? Number(currentUserId) : 0,
          prompt: text,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
        }
      );

      const reply = extractReplyText(response.data) || "No response received.";
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: reply,
          time: now(),
          durationMs: Date.now() - requestStartTime,
        },
      ]);
      historyRef.current.push({ role: "assistant", content: reply });
      if (historyRef.current.length > 16)
        historyRef.current = historyRef.current.slice(-16);
    } catch (error) {
      const axiosError = error as {
        response?: { data?: unknown; status?: number };
        message?: string;
      };
      const msg =
        extractReplyText(axiosError.response?.data) ||
        (axiosError.response?.status
          ? `API error ${axiosError.response.status}`
          : axiosError.message ||
          "Network error — make sure you are connected.");

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ " + msg,
          time: now(),
          durationMs: Date.now() - requestStartTime,
        },
      ]);
    }

    setIsLoading(false);
  }

  function handleKeydown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function escapeHtml(text: string) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatInline(text: string) {
    const escaped = escapeHtml(text);
    return escaped
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  }

  function formatText(text: string) {
    const normalized = text.replace(/\r\n/g, "\n").trim();
    if (!normalized) return "";

    const lines = normalized.split("\n");
    const blocks: string[] = [];
    let index = 0;

    while (index < lines.length) {
      const line = lines[index].trim();

      if (!line) {
        index += 1;
        continue;
      }

      if (line.startsWith("|") && lines[index + 1]?.trim().startsWith("|")) {
        const rows: string[][] = [];
        while (index < lines.length && lines[index].trim().startsWith("|")) {
          rows.push(lines[index].trim().split("|").slice(1, -1).map((cell) => cell.trim()));
          index += 1;
        }

        const separatorIndex = rows.findIndex((row) => row.every((cell) => /^:?-{3,}:?$/.test(cell)));
        if (separatorIndex > 0) {
          const headers = rows[0];
          const bodyRows = rows.slice(separatorIndex + 1);
          const headerMarkup = headers.map((header) => `<th style="border:1px solid rgba(255,255,255,0.16);padding:8px 10px;text-align:left">${formatInline(header)}</th>`).join("");
          const bodyMarkup = bodyRows.map((row) => `<tr>${row.map((cell) => `<td style="border:1px solid rgba(255,255,255,0.16);padding:8px 10px">${formatInline(cell)}</td>`).join("")}</tr>`).join("");
          blocks.push(`<table style="width:100%;border-collapse:collapse;margin:8px 0 10px;font-size:13px"><thead><tr>${headerMarkup}</tr></thead><tbody>${bodyMarkup}</tbody></table>`);
          continue;
        }
      }

      if (/^#{1,6}\s+/.test(line)) {
        const level = Math.min(line.match(/^#+/)?.[0].length ?? 1, 3);
        const content = line.replace(/^#{1,6}\s+/, "");
        blocks.push(`<h${level}>${formatInline(content)}</h${level}>`);
        index += 1;
        continue;
      }

      if (/^[-*]\s+/.test(line)) {
        const items: string[] = [];
        while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
          items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
          index += 1;
        }
        blocks.push(`<ul>${items.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>`);
        continue;
      }

      if (/^\d+\.\s+/.test(line)) {
        const items: string[] = [];
        while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
          items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
          index += 1;
        }
        blocks.push(`<ol>${items.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ol>`);
        continue;
      }

      const paragraphLines = [line];
      index += 1;
      while (index < lines.length) {
        const nextLine = lines[index].trim();
        if (!nextLine || /^#{1,6}\s+/.test(nextLine) || /^[-*]\s+/.test(nextLine) || /^\d+\.\s+/.test(nextLine) || nextLine.startsWith("|")) {
          break;
        }
        paragraphLines.push(nextLine);
        index += 1;
      }

      blocks.push(`<p>${formatInline(paragraphLines.join(" "))}</p>`);
    }

    return blocks.join("");
  }

  return (
    <>
      {/* FAB */}
      {!isOpen && (
        <button
          className="ai-fab"
          onClick={onToggle}
          title="Ask AI about this dashboard"
        >
          <span className="ai-fab-icon">✦</span>
          <span className="ai-fab-badge">AI</span>
        </button>
      )}

      {/* PANEL */}
      <div className={`ai-panel${isOpen ? " open" : ""}`}>
        {/* Header */}
        <div className="ai-panel-head">
          <div className="ai-panel-logo">✦</div>
          <div>
            <div className="ai-panel-title">PATM AI Assistant</div>
            <div className="ai-panel-sub">
              Ask anything about this dashboard
            </div>
          </div>
          <button className="ai-panel-close" onClick={onToggle}>
            ✕
          </button>
        </div>

        {/* {!savedKey ? (
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
        ) : ( */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          <div className="ai-messages" id="aiMessages">
            {/* Intro */}
            {/* <div className="ai-msg bot">
              <div className="ai-msg-avatar bot">✦</div>
              <div>
                <div className="ai-msg-bubble">
                  Hi Chetan sir 👋 I have full context of today's PATM data — 22,218 tasks, 39 projects, 9 sprints, and all team metrics.<br /><br />Ask me anything. I'll give you direct answers, not just numbers.
                </div>
                <div className="ai-msg-time">{now()}</div>
              </div>
            </div> */}

            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                <div className={`ai-msg-avatar ${m.role}`}>
                  {m.role === "bot" ? "✦" : getCurrentUserInitials()}
                </div>
                <div>
                  <div
                    className="ai-msg-bubble"
                    dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
                  />
                  <div className="ai-msg-meta">
                    <div className="ai-msg-time">{m.time}</div>
                    {m.role === "bot" && m.durationMs != null && (
                      <div className="ai-msg-duration">
                        Generated in {formatDuration(m.durationMs)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="ai-msg bot">
                <div className="ai-msg-avatar bot">✦</div>
                {/* <div> */}
                <ChatLoader />
                {/* </div> */}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* {showSuggestions && (
            <div className="ai-suggestions">
              {['What needs action today?', 'Who is most overdue?', 'Sprint health summary', 'Which projects are critical?', 'Why is backlog growing?'].map((s) => (
                <button key={s} className="ai-sug" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )} */}

          <div className="ai-input-row">
            <textarea
              ref={inputRef}
              className="ai-textarea"
              placeholder="Ask about tasks, sprints, team, projects…"
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 100) + "px";
              }}
              onKeyDown={handleKeydown}
            />
            <button
              className="ai-send"
              disabled={isLoading}
              onClick={() => send(input)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <div className="ai-powered">Powered by PATM Chat API</div>
        </div>
        {/* )} */}
      </div>
    </>
  );
}
