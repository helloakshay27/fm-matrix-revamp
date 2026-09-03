import React, { useState } from 'react';
import { INSIGHT_SYSTEM_PROMPT } from '../clubDashboardData';
import { getAiInsight, type AiInsightPayload } from '@/services/clubDashboardApi';

export interface AiInsightSource {
  path: string;
  params?: Record<string, string | number | undefined>;
}

interface AiInsightBlockProps {
  // Live mode: re-requests the chart's own data endpoint with ai_insights=true and reads
  // { summary, key_findings, insights, recommendations } off the response.
  source?: AiInsightSource;
  // Legacy mode: for charts with no backing API yet - calls Anthropic directly with a
  // hardcoded data summary. Ignored when `source` is provided.
  ctxText?: string;
}

const severityBadgeClass = (severity?: string): string => {
  switch (severity) {
    case 'positive':
      return 'b-ok';
    case 'warning':
      return 'b-warn';
    case 'negative':
      return 'b-err';
    case 'info':
      return 'b-blue';
    default:
      return 'b-lav';
  }
};

const priorityBadgeClass = (priority?: string): string => {
  switch (priority) {
    case 'high':
      return 'b-err';
    case 'medium':
      return 'b-warn';
    case 'low':
      return 'b-ok';
    default:
      return 'b-lav';
  }
};

export const AiInsightBlock: React.FC<AiInsightBlockProps> = ({ source, ctxText }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [payload, setPayload] = useState<AiInsightPayload | null>(null);
  const [staticText, setStaticText] = useState('');

  const generateLive = async (src: AiInsightSource) => {
    const res = await getAiInsight(src.path, src.params);
    if (res.status !== 'success') {
      throw new Error('Insight generation failed');
    }
    setPayload(res);
  };

  const generateStatic = async (text: string) => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: INSIGHT_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: 'Generate insight for this chart data: ' + text }],
      }),
    });
    const data = await res.json();
    const reply = data.content && data.content[0] ? data.content[0].text : 'Unable to generate insight.';
    setStaticText(reply);
  };

  const generate = async () => {
    setStatus('loading');
    try {
      if (source) {
        await generateLive(source);
      } else if (ctxText) {
        await generateStatic(ctxText);
      }
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const sectionLabel: React.CSSProperties = {
    fontWeight: 600,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '.04em',
    color: 'var(--sage)',
    margin: '10px 0 4px',
  };

  return (
    <div className="ai-insight-block">
      <div className="aib-header">
        <span className="aib-label">✨ Chart Insight</span>
      </div>
      <div className="aib-body">
        {status === 'idle' && (
          <div className="aib-text">Click Generate Insight for AI analysis of this chart.</div>
        )}
        {status === 'loading' && <div className="aib-text">Analysing chart data...</div>}
        {status === 'error' && (
          <div className="aib-text">Unable to generate an insight right now. Please try again.</div>
        )}
        {status === 'done' && source && payload && (
          <div className="aib-text filled">
            {payload.summary && <p style={{ margin: '0 0 4px' }}>{payload.summary}</p>}

            {payload.key_findings.length > 0 && (
              <>
                <div style={sectionLabel}>Key Findings</div>
                <ul style={{ margin: '0 0 0 16px', padding: 0 }}>
                  {payload.key_findings.map((finding, i) => (
                    <li key={i}>{finding}</li>
                  ))}
                </ul>
              </>
            )}

            {payload.insights.length > 0 && (
              <>
                <div style={sectionLabel}>Insights</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {payload.insights.map((item, i) => (
                    <div key={i} style={{ border: '1px solid var(--card-border)', borderRadius: 8, padding: '6px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <span style={{ fontWeight: 600 }}>{item.title}</span>
                        <span className={'badge ' + severityBadgeClass(item.severity)}>
                          {item.metric || item.severity || ''}
                        </span>
                      </div>
                      <div style={{ marginTop: 2 }}>{item.observation}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {payload.recommendations.length > 0 && (
              <>
                <div style={sectionLabel}>Recommendations</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {payload.recommendations.map((rec, i) => (
                    <div key={i} style={{ border: '1px solid var(--card-border)', borderRadius: 8, padding: '6px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <span style={{ fontWeight: 600 }}>{rec.action}</span>
                        {rec.priority && (
                          <span className={'badge ' + priorityBadgeClass(rec.priority)}>{rec.priority}</span>
                        )}
                      </div>
                      <div style={{ marginTop: 2 }}>{rec.rationale}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!payload.summary &&
              payload.key_findings.length === 0 &&
              payload.insights.length === 0 &&
              payload.recommendations.length === 0 &&
              'No insight returned for this chart.'}
          </div>
        )}
        {status === 'done' && !source && <div className="aib-text filled">{staticText}</div>}
        <button className="aib-btn" onClick={generate} disabled={status === 'loading'} style={{ marginTop: 10 }}>
          {status === 'loading' ? 'Generating...' : status === 'done' ? '✨ Regenerate' : '✨ Generate Insight'}
        </button>
      </div>
    </div>
  );
};
