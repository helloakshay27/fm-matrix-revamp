import React from "react";
import { useNavigate } from "react-router-dom";
import { usePulseDashboard } from "../../contexts/PulseDashboardContext";

export const Topbar: React.FC = () => {
  const { collapsed, setCollapsed, theme, setTheme, vm } = usePulseDashboard();
  const navigate = useNavigate();

  const handleToggleNav = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const nextThemeLabel = theme === 'dark' ? 'light' : 'dark';
  const freshStamp = vm.generatedAt ? `Data generated ${vm.generatedAt}` : "Live data";

  return (
    <header className="topbar">
      <button
        className="iconbtn nav-toggle"
        id="navToggle"
        aria-label={(collapsed ? 'Expand' : 'Collapse') + ' navigation'}
        aria-expanded={!collapsed}
        title={(collapsed ? 'Expand' : 'Collapse') + ' navigation'}
        onClick={handleToggleNav}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" />
          <line x1="8" y1="3.5" x2="8" y2="16.5" />
        </svg>
      </button>
      <button
        className="back"
        aria-label="Back"
        onClick={() => navigate(-1)}
      >
        &#8592;
      </button>
      <span className="topbar-title">Pulse Analytics</span>
      <div className="spacer"></div>
      <span className="rule"></span>
      <button
        className="iconbtn"
        id="themeBtn"
        aria-label={`Switch to ${nextThemeLabel} theme`}
        title={`Switch to ${nextThemeLabel} theme`}
        onClick={handleToggleTheme}
      >
        <svg
          className="i-moon"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16.5 11.8A7 7 0 0 1 8.2 3.5a7 7 0 1 0 8.3 8.3Z" />
        </svg>
        <svg
          className="i-sun"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="3.6" />
          <path d="M10 1.8v1.7M10 16.5v1.7M18.2 10h-1.7M3.5 10H1.8M15.8 4.2l-1.2 1.2M5.4 14.6l-1.2 1.2M15.8 15.8l-1.2-1.2M5.4 5.4 4.2 4.2" />
        </svg>
      </button>
      <span className="badge-sample" title={freshStamp}>Live &middot; PostHog analytics</span>
      <div className="avatar">PP</div>
    </header>
  );
};
