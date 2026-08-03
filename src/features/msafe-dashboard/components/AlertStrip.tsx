import { ALERTS } from '../data/mockData';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

export function AlertStrip() {
  const { openDrill } = useMsafeDashboard();
  return (
    <div className="alert-strip">
      <span className="a-lbl">⚡ Priority Actions</span>
      {ALERTS.map((a) => (
        <button
          key={a.id}
          type="button"
          className={`alert-chip ${a.warn ? 'warn' : ''}`}
          onClick={() => openDrill(a.id)}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
