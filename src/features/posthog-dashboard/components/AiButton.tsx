import { useDashboard } from '../context/DashboardContext';

export function AiButton({ chartKey }: { chartKey: string }) {
  const { openAiPanel } = useDashboard();
  return (
    <button
      className="ai-btn"
      title="Generate insight with AI"
      aria-label="Generate insight with AI"
      onClick={(e) => { e.stopPropagation(); openAiPanel(chartKey); }}
    >
      <span className="sp">✦</span><span className="lbl-ai">Insight</span>
    </button>
  );
}
