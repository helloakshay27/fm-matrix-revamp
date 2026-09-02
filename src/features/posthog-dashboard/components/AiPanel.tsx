import { useEffect, useRef, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { getAIData } from '../data/aiData';
import { simAnswer, simInsight, type ChartKey, type Insight } from '../data/aiInsights';
import { INFO } from '../data/constants';

interface Message {
  role: 'bot' | 'user';
  kind: 'typing' | 'insight' | 'text';
  text?: string;
  insight?: Insight;
}

function InsightBody({ insight }: { insight: Insight }) {
  return (
    <>
      <p className="ai-k">Analysis</p>
      <p className="ai-lead">{insight.head}</p>
      {insight.pts.length > 0 && <ul>{insight.pts.map((p, i) => <li key={i}>{p}</li>)}</ul>}
      {insight.why && <><p className="ai-k">Why it matters</p><p>{insight.why}</p></>}
      {insight.rec && <><p className="ai-k">Recommendation</p><p>{insight.rec}</p></>}
      {insight.sug && <p className="ai-sug">Ask a follow-up, e.g. "{insight.sug}"</p>}
    </>
  );
}

export function AiPanel() {
  const { aiPanel, closeAiPanel, vm } = useDashboard();
  const chartKey = aiPanel?.chartKey as ChartKey | undefined;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const insight = chartKey ? simInsight(chartKey, getAIData(chartKey, vm), vm.scopeLabel) : null;

  useEffect(() => {
    if (!chartKey) return;
    setMessages([{ role: 'bot', kind: 'typing', text: 'Generating insight…' }]);
    setThinking(true);
    const t = setTimeout(() => {
      setMessages([{ role: 'bot', kind: 'insight', insight: insight! }]);
      setThinking(false);
    }, 420);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartKey]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages]);

  if (!aiPanel || !chartKey) {
    return <div className="ai-backdrop" />;
  }

  const send = (question: string) => {
    const q = question.trim();
    if (!q || thinking) return;
    setMessages((m) => [...m, { role: 'user', kind: 'text', text: q }, { role: 'bot', kind: 'typing', text: 'Thinking…' }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const answer = simAnswer(chartKey, getAIData(chartKey, vm), vm.scopeLabel, q);
      setMessages((m) => [...m.slice(0, -1), { role: 'bot', kind: 'text', text: answer }]);
      setThinking(false);
    }, 420);
  };

  const suggestions: string[] = [];
  if (insight?.sug) suggestions.push(insight.sug.charAt(0).toUpperCase() + insight.sug.slice(1));
  for (const s of ['Why did this change?', 'Which sites or roles stand out?', 'What should I do next?']) {
    if (suggestions.length < 4) suggestions.push(s);
  }

  const info = INFO[chartKey];

  return (
    <>
      <div className="ai-backdrop open" onClick={closeAiPanel} />
      <div className="ai-panel open">
        <div className="ai-head">
          <div>
            <div className="ai-h-t"><span className="sp">✦</span><span>{info?.t ?? chartKey}</span></div>
            <div className="ai-h-s">{vm.scopeLabel} · last {vm.state.date} days</div>
          </div>
          <button className="ai-x" aria-label="Close" onClick={closeAiPanel}>✕</button>
        </div>
        <div className="ai-sim">
          <span>✦</span><span>Insight calculated from the live dashboard data for the selected filters.</span>
        </div>
        <div className="ai-body" ref={bodyRef}>
          {messages.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role}`}>
              {m.kind === 'typing' && <span className="ai-typing">{m.text}</span>}
              {m.kind === 'insight' && m.insight && <InsightBody insight={m.insight} />}
              {m.kind === 'text' && <p>{m.text}</p>}
            </div>
          ))}
        </div>
        <div className="ai-chips">
          {suggestions.map((s) => (
            <button key={s} className="ai-chip" onClick={() => send(s)}>{s}</button>
          ))}
        </div>
        <div className="ai-foot">
          <textarea
            className="ai-input"
            rows={1}
            placeholder="Ask a question about this chart…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
          />
          <button className="ai-send" onClick={() => send(input)}>Ask</button>
        </div>
      </div>
    </>
  );
}
