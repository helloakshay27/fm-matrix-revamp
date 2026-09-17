import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendarDashboard } from '../context/calendarDashboardStore';

/** Resolves the currently logged-in user's profile details from localStorage / session. */
function getLoggedInUserInfo(): { initial: string; displayName: string; email?: string } {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      const full = `${parsed.firstname || ''} ${parsed.lastname || ''}`.trim();
      const name =
        full ||
        parsed.name ||
        parsed.first_name ||
        parsed.username ||
        parsed.email?.split('@')[0] ||
        '';

      if (name) {
        return {
          initial: name.charAt(0).toUpperCase(),
          displayName: full || parsed.name || name,
          email: parsed.email,
        };
      }
    }

    const fallbackEmail =
      typeof window !== 'undefined'
        ? localStorage.getItem('email') || localStorage.getItem('username')
        : null;

    if (fallbackEmail) {
      const name = fallbackEmail.split('@')[0];
      return {
        initial: name.charAt(0).toUpperCase(),
        displayName: name,
        email: fallbackEmail,
      };
    }
  } catch {
    // ignore
  }

  return { initial: 'U', displayName: 'Logged-in user' };
}

export function Topbar() {
  const navigate = useNavigate();
  const { page, setPage, theme, toggleTheme, navCollapsed, toggleNav, isLive, isLoading } =
    useCalendarDashboard();
  const [userInfo, setUserInfo] = useState(getLoggedInUserInfo);

  useEffect(() => {
    const handleStorageChange = () => setUserInfo(getLoggedInUserInfo());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleBack = () => {
    // 1. If currently on a secondary layer (Adoption or Workflow), step back to Traffic & Session
    if (page !== 'pgTraffic') {
      setPage('pgTraffic');
      return;
    }

    // 2. If browser has internal navigation history in this tab session, go back
    if (
      window.history.state &&
      typeof window.history.state.idx === 'number' &&
      window.history.state.idx > 0
    ) {
      const currentPath = window.location.pathname;
      navigate(-1);

      // Fallback safeguard if history.go was ignored or stayed on same path
      setTimeout(() => {
        if (window.location.pathname === currentPath) {
          navigate('/employee/calendar');
        }
      }, 150);
      return;
    }

    // 3. If arriving from an internal referrer that is not this exact path
    if (
      typeof document !== 'undefined' &&
      document.referrer &&
      document.referrer.startsWith(window.location.origin)
    ) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.pathname !== window.location.pathname) {
          navigate(refUrl.pathname + refUrl.search);
          return;
        }
      } catch {
        // ignore
      }
    }

    // 4. Default fallback when directly opened or refreshed: return to Unified Calendar
    navigate('/employee/calendar');
  };

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
      <button
        type="button"
        className="back"
        aria-label="Back"
        onClick={handleBack}
        title={page !== 'pgTraffic' ? 'Back to Traffic & Session' : 'Back to Calendar'}
      >
        ←
      </button>
      <span className="topbar-title">Calendar App Analytics</span>
      <div className="spacer" />
      <span className="rule" />
      <button type="button" className="iconbtn theme-btn" id="themeBtn" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
        <svg className="i-moon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16.5 11.8A7 7 0 0 1 8.2 3.5a7 7 0 1 0 8.3 8.3Z" />
        </svg>
        <svg className="i-sun" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="10" cy="10" r="3.6" />
          <path d="M10 1.8v1.7M10 16.5v1.7M18.2 10h-1.7M3.5 10H1.8M15.8 4.2l-1.2 1.2M5.4 14.6l-1.2 1.2M15.8 15.8l-1.2-1.2M5.4 5.4 4.2 4.2" />
        </svg>
      </button>
      <span
        className="badge-sample"
        style={isLive ? { background: 'var(--green-tint)', color: 'var(--green)', borderColor: 'var(--green)' } : undefined}
      >
        {isLoading ? 'Loading…' : isLive ? 'Live · appid 29' : 'Wireframe · sample data'}
      </span>
      <div
        className="avatar"
        title={`${userInfo.displayName}${userInfo.email ? ` (${userInfo.email})` : ''}`}
        aria-label={`Logged in as ${userInfo.displayName}`}
      >
        {userInfo.initial}
      </div>
    </header>
  );
}

