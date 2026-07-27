import { useDashboard } from '../context/DashboardContext';

export function AiButton({ chartKey }: { chartKey: string }) {
  const { openAiPanel } = useDashboard();
  return (
    <button
      className="phg-ai-btn"
      title="Generate insight with AI"
      aria-label="Generate insight with AI"
      onClick={(e) => { e.stopPropagation(); openAiPanel(chartKey); }}
    >
      <span className="phg-sp">✦</span><span className="phg-lbl-ai">Insight</span>
    </button>
  );
}
