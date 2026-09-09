import { useEffect } from 'react';
import './vi-posthog-dashboard.css';
import { ControlBar } from './components/ControlBar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ViDashboardProvider } from './context/ViDashboardContext';
import { useViDashboard } from './context/viDashboardStore';
import { PAGE_TITLES } from './data/pages';
import { AdoptionSection } from './sections/AdoptionSection';
import { TrafficSection } from './sections/TrafficSection';
import { WorkflowSection } from './sections/WorkflowSection';

function DashboardLayout() {
  const { vm, page, theme, navCollapsed, toggleNav } = useViDashboard();

  /* `[` toggles the navigation rail. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '[' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable) return;
      e.preventDefault();
      toggleNav();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [toggleNav]);

  return (
    <div className={`vi-ph${navCollapsed ? ' nav-collapsed' : ''}`} data-theme={theme}>
      <Topbar />
      <div className="shell">
        <Sidebar />
        <main className="main">
          <div className="page-head">
            <h2>{PAGE_TITLES[page]}</h2>
            <p className="page-sub">
              Vi my Workspace · {vm.scopeLabel} · {vm.range.from} → {vm.range.to}
            </p>
          </div>

          <ControlBar />

          {page === 'pgTraffic' && <TrafficSection />}
          {page === 'pgAdopt' && <AdoptionSection />}
          {page === 'pgFlows' && <WorkflowSection />}

          <Footer />
        </main>
      </div>
    </div>
  );
}

/**
 * Vi my Workspace · Usage Analytics.
 *
 * Same nine FM Adoption Analytics endpoints, same query contract, caching and refresh
 * behaviour as `/posthog-dashboard`; the tenant it reports on comes from `api/adoptionApi.ts`.
 */
export function ViPosthogDashboardPage() {
  return (
    <ViDashboardProvider>
      <DashboardLayout />
    </ViDashboardProvider>
  );
}

export default ViPosthogDashboardPage;
