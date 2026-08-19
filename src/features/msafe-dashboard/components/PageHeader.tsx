import { useMsafeDashboard } from '../context/MsafeDashboardContext';

export function PageHeader() {
  const { pageTitle, scopeText } = useMsafeDashboard();
  return (
    <div className="page-hd">
      <div>
        <h2>{pageTitle}</h2>
        <div className="sub">
          <span className="live-dot" />
          Live · Last synced 2 min ago · <span>{scopeText}</span>
        </div>
      </div>
    </div>
  );
}
