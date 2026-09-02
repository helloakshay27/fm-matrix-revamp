import React, { useState } from 'react';
import { SYSTEM_PROMPTS } from '../clubDashboardData';

interface ChatMsg {
  id: number;
  role: 'user' | 'bot';
  text: string;
  typing?: boolean;
}

let msgId = 0;

export const AIChatWidget: React.FC<{ persona: 'branch' | 'super' }> = ({ persona }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: ++msgId, role: 'bot', text: "Hi! I'm your AI analyst for The Recess Club. Ask me anything about your dashboard data – trends, anomalies, what to prioritise, or what the numbers mean." },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const ctxLabel = persona === 'branch' ? 'Branch Manager · Worli' : 'Super Admin · All Branches';

  const send = async () => {
    const msg = input.trim();
    if (!msg) return;
    setInput('');
    setMessages((prev) => [...prev, { id: ++msgId, role: 'user', text: msg }]);
    const newHistory = [...history, { role: 'user' as const, content: msg }];
    setHistory(newHistory);
    const typingId = ++msgId;
    setMessages((prev) => [...prev, { id: typingId, role: 'bot', text: 'Thinking...', typing: true }]);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPTS[persona],
          messages: newHistory,
        }),
      });
      const data = await res.json();
      const reply = data.content && data.content[0] ? data.content[0].text : 'Sorry, could not process that.';
      setMessages((prev) => prev.filter((m) => m.id !== typingId).concat({ id: ++msgId, role: 'bot', text: reply }));
      setHistory((prev) => {
        const next = [...prev, { role: 'assistant' as const, content: reply }];
        return next.length > 20 ? next.slice(-20) : next;
      });
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== typingId).concat({ id: ++msgId, role: 'bot', text: 'Unable to connect. Please check your internet connection.' }));
    }
  };

  return (
    <>
      <button id="aiChatBtn" onClick={() => setOpen((o) => !o)}>✨ AI Insights</button>
      {open && (
        <div id="aiChatPanel">
          <div className="chat-header">
            <div>
              <div className="chat-title-main">✨ AI Insights</div>
              <div className="chat-ctx-lbl">{ctxLabel}</div>
            </div>
            <button className="chat-close-btn" onClick={() => setOpen(false)}>×</button>
          </div>
          <div id="chatMessages">
            {messages.map((m) => (
              <div key={m.id} className={'chat-msg ' + m.role + (m.typing ? ' typing' : '')}>{m.text}</div>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Ask about your data..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') send(); }}
            />
            <button className="chat-send-btn" onClick={send}>➤</button>
          </div>
          <div className="chat-footer-lbl">Powered by Claude · The Recess Club · Dashboard context active</div>
        </div>
      )}
    </>
  );
};
