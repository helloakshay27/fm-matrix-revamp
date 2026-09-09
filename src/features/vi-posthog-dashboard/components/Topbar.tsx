import { useNavigate } from 'react-router-dom';
import { useViDashboard } from '../context/viDashboardStore';

export function Topbar() {
  const navigate = useNavigate();
  const { vm, theme, toggleTheme, navCollapsed, toggleNav } = useViDashboard();
  const navLabel = `${navCollapsed ? 'Expand' : 'Collapse'} navigation`;
  const themeLabel = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;

  return (
    <header className="topbar">
      <button
        type="button"
        className="iconbtn nav-toggle"
        onClick={toggleNav}
        aria-label={navLabel}
        aria-expanded={!navCollapsed}
        title={navLabel}
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" />
          <line x1="8" y1="3.5" x2="8" y2="16.5" />
        </svg>
      </button>
      <button type="button" className="back" aria-label="Back" onClick={() => navigate(-1)}>
        ←
      </button>
      <span className="topbar-title">Vi my Workspace Analytics</span>
      <div className="spacer" />
      <span className="rule" />
      <button type="button" className="iconbtn theme-btn" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
        <svg className="i-moon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16.5 11.8A7 7 0 0 1 8.2 3.5a7 7 0 1 0 8.3 8.3Z" />
        </svg>
        <svg className="i-sun" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="10" cy="10" r="3.6" />
          <path d="M10 1.8v1.7M10 16.5v1.7M18.2 10h-1.7M3.5 10H1.8M15.8 4.2l-1.2 1.2M5.4 14.6l-1.2 1.2M15.8 15.8l-1.2-1.2M5.4 5.4 4.2 4.2" />
        </svg>
      </button>
      {vm.generatedAt && (
        <span className="badge-sample" title="generated_at from the Layer-1 response">
          Updated {new Date(vm.generatedAt).toLocaleString()}
        </span>
      )}
      <div className="avatar">VW</div>
    </header>
  );
}
