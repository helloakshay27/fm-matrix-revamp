import { useDashboard } from '../context/DashboardContext';
import type { Tier } from '../data/constants';
import { Menu, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const TIER_OPTIONS: { value: Tier; label: string; hint: string }[] = [
  { value: 't1', label: 'Site Manager', hint: 'One or more sites' },
  { value: 't2', label: 'Regional', hint: 'One company and all of its sites' },
  { value: 't3', label: 'Management', hint: 'All sites for the organisation' },
];

export function Header() {
  const { vm, setTier, setTheme, setNavCollapsed } = useDashboard();
  const { state } = vm;
  const { user } = useAuthStore();

  const getInitials = (name?: string) => {
    if (!name) return 'PS';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(user?.name);

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
      <button className="back" aria-label="Back">
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
      
      <div className="avatar" title={user?.name || 'Guest'}>{initials}</div>
    </header>
  );
}
