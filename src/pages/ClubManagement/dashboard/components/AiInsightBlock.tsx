import React, { useState } from 'react';
import { INSIGHT_SYSTEM_PROMPT } from '../clubDashboardData';

export const AiInsightBlock: React.FC<{ ctxText: string }> = ({ ctxText }) => {
  const [text, setText] = useState('Click Generate Insight for AI analysis of this chart.');
  const [filled, setFilled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState('✨ Generate Insight');

  const generateInsight = async () => {
    setLoading(true);
    setLabel('Generating...');
    setText('Analysing chart data...');
    setFilled(false);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: INSIGHT_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: 'Generate insight for this chart data: ' + ctxText }],
        }),
      });
      const data = await res.json();
      const reply = data.content && data.content[0] ? data.content[0].text : 'Unable to generate insight.';
      setText(reply);
      setFilled(true);
      setLabel('✨ Regenerate');
    } catch {
      setText('Unable to connect. Please check your internet connection and try again.');
      setFilled(false);
      setLabel('✨ Generate Insight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-insight-block">
      <div className="aib-header">
        <span className="aib-label">✨ Chart Insight</span>
      </div>
      <div className="aib-body">
        <div className={'aib-text' + (filled ? ' filled' : '')}>{text}</div>
        <button className="aib-btn" onClick={generateInsight} disabled={loading}>
          {label}
        </button>
      </div>
    </div>
  );
};
