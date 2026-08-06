import { Download, Settings } from 'lucide-react';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';

export function PageHeader() {
  const { pageTitle, scopeText, showToast } = useMsafeDashboard();
  return (
    <div className="page-hd">
      <div>
        <h2>{pageTitle}</h2>
        <div className="sub">
          <span className="live-dot" />
          Live · Last synced 2 min ago · <span>{scopeText}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          className="tb-icon-btn"
          title="Export"
          onClick={() => showToast('Export started · full dashboard snapshot')}
        >
          <Download size={16} />
        </button>
        <button type="button" className="tb-icon-btn" title="Configure" onClick={() => showToast('Configure panel coming soon')}>
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
