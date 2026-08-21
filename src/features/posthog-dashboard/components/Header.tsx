import { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { Tier } from '../data/constants';
import { Menu, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { getUser } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';

const TIER_OPTIONS: { value: Tier; label: string; hint: string }[] = [
  { value: 't1', label: 'Site Manager', hint: 'One or more sites' },
  // { value: 't2', label: 'Regional', hint: 'One company and all of its sites' },
  { value: 't3', label: 'Management', hint: 'All sites for the organisation' },
];

export function Header() {
  const navigate = useNavigate();
  const { vm, setTier, setTheme, setNavCollapsed } = useDashboard();
  const { state } = vm;
  const { user: storeUser } = useAuthStore();
  const [currentUser, setCurrentUser] = useState(() => getUser());

  useEffect(() => {
    setCurrentUser(getUser());
  }, []);

  const getDisplayName = (): string => {
    if (currentUser) {
      const full = `${currentUser.firstname || ''} ${currentUser.lastname || ''}`.trim();
      if (full) return full;
      if ((currentUser as any).name) return (currentUser as any).name;
      if (currentUser.email) return currentUser.email.split('@')[0];
    }
    if (storeUser?.name) return storeUser.name;
    if (storeUser?.email) return storeUser.email.split('@')[0];

    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const full = `${parsed.firstname || ''} ${parsed.lastname || ''}`.trim();
        if (full) return full;
        if (parsed.name) return parsed.name;
        if (parsed.email) return parsed.email.split('@')[0];
      }
    } catch {
      // ignore
    }
    return '';
  };

  const displayName = getDisplayName();

  const getInitials = (name?: string) => {
    if (!name || !name.trim()) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(displayName);

  const tierAvailable = (t: Tier) => t === 't1' || t === 't3';

  return (
    <header className="topbar">
      <button 
        className="iconbtn nav-toggle" 
        onClick={() => setNavCollapsed(!state.navCollapsed)}
        aria-label="Collapse navigation" 
        title="Collapse navigation"
      >
        <Menu size={17} />
      </button>
      <button className="back" aria-label="Back" onClick={() => navigate(-1)}>
        <ArrowLeft size={17} />
      </button>
      <span className="topbar-title">Adoption Analytics</span>
      <div className="spacer"></div>

      <div className="topbar-tier">
        <span className="tt-label">View as</span>
        <div className="seg tier" role="group" aria-label="View as">
          {TIER_OPTIONS.map((t) => (
            <button
              key={t.value}
              className={state.tier === t.value ? 'on' : ''}
              disabled={!tierAvailable(t.value)}
              title={tierAvailable(t.value) ? t.hint : 'Needs a company grouping'}
              onClick={() => tierAvailable(t.value) && setTier(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <span className="rule"></span>
      <button 
        className="iconbtn" 
        onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
        aria-label="Switch theme" 
        title="Switch theme"
      >
        {state.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      
      {vm.generatedAt ? (
        <span className="badge-sample" title={`generated_at: ${vm.generatedAt}`}>
          Live · sample data
        </span>
      ) : (
        <span className="badge-sample">Wireframe · sample data</span>
      )}
      
      <div className="avatar" title={displayName || 'User'}>{initials}</div>
    </header>
  );
}
