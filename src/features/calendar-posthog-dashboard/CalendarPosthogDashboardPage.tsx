import { useEffect } from 'react';
import './calendar-posthog-dashboard.css';
import { ControlBar } from './components/ControlBar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { CalendarDashboardProvider } from './context/CalendarDashboardContext';
import { useCalendarDashboard } from './context/calendarDashboardStore';
import { PAGE_TITLES } from './data/pages';
import { AdoptionSection } from './sections/AdoptionSection';
import { TrafficSection } from './sections/TrafficSection';
import { WorkflowSection } from './sections/WorkflowSection';

function DashboardLayout() {
  const { vm, page, theme, navCollapsed, toggleNav } = useCalendarDashboard();

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
    <div className={`cal-ph${navCollapsed ? ' nav-collapsed' : ''}`} data-theme={theme}>
      <Topbar />
      <div className="shell">
        <Sidebar />
        <main className="main">
          <div className="page-head">
            <h2>{PAGE_TITLES[page]}</h2>
            <p className="page-sub">
              Calendar App · {vm.scopeLabel} · {vm.range.from} → {vm.range.to}
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
 * Calendar App · Usage Analytics.
 *
 * The approved `Calendar_Dashboard_v1_FM_structure` wireframe on the same three-layer shell
 * the rest of this dashboard family uses, reading the same nine FM Adoption Analytics
 * endpoints as `/posthog-dashboard` and `/vi-posthog-dashboard` — same query contract, same
 * caching and refresh behaviour. The tenant it reports on comes from `api/adoptionApi.ts`.
 */
export function CalendarPosthogDashboardPage() {
  return (
    <CalendarDashboardProvider>
      <DashboardLayout />
    </CalendarDashboardProvider>
  );
}

export default CalendarPosthogDashboardPage;
