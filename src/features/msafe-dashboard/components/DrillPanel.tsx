import { X } from 'lucide-react';
import { resolveDrill } from '../data/drillContent';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

export function DrillPanel() {
  const { drill, closeDrill, showToast } = useMsafeDashboard();
  if (!drill) return null;

  const content = resolveDrill(drill.id, drill.title);
  const crumb = content.crumb || drill.crumb;
  const title = content.title || drill.title;

  return (
    <>
      <div className="drill-scrim open" onClick={closeDrill} aria-hidden />
      <aside className="drill open" role="dialog" aria-label={title}>
        <div className="drill-hd">
          <div>
            <div className="crumb">{crumb}</div>
            <h3>{title}</h3>
          </div>
          <button type="button" className="drill-close" onClick={closeDrill} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="drill-body">
          {content.body}
          {content.actions && content.actions.length > 0 ? (
            <div className="dr-actions">
              {content.actions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  className={`dr-btn${a.variant === 'sec' ? ' sec' : ''}${a.variant === 'err' ? ' err' : ''}`}
                  onClick={() => showToast(`${a.label} · queued`)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
