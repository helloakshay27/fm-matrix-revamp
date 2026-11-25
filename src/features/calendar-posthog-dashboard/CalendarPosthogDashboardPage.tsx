import { useEffect, useState } from 'react';
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
  const [chartTooltip, setChartTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  function updateChartTooltip(
    target: EventTarget,
    position?: { x: number; y: number },
  ) {
    const element =
      target instanceof Element ? target.closest('[data-chart-tooltip]') : null;
    const text = element?.getAttribute('data-chart-tooltip');
    if (!element || !text) {
      setChartTooltip(null);
      return;
    }

    const rect = element.getBoundingClientRect();
    const x = position?.x ?? rect.left;
    const y = position?.y ?? rect.bottom;
    const nextTooltip = {
      text,
      x: Math.max(8, Math.min(x + 12, window.innerWidth - 260)),
      y: Math.max(8, Math.min(y + 12, window.innerHeight - 180)),
    };
    setChartTooltip((current) =>
      current?.text === text &&
      Math.abs(current.x - nextTooltip.x) < 12 &&
      Math.abs(current.y - nextTooltip.y) < 12
        ? current
        : nextTooltip,
    );
  }

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
        <main
          className="main"
          onPointerMove={(event) =>
            updateChartTooltip(event.target, {
              x: event.clientX,
              y: event.clientY,
            })
          }
          onPointerLeave={() => setChartTooltip(null)}
          onFocus={(event) => updateChartTooltip(event.target)}
          onBlur={(event) => {
            const nextTarget = event.relatedTarget;
            if (
              !(nextTarget instanceof Element) ||
              !nextTarget.closest('[data-chart-tooltip]')
            ) {
              setChartTooltip(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setChartTooltip(null);
          }}
        >
          <div className="page-head">
            <h2 id="pageTitle">{PAGE_TITLES[page]}</h2>
            <p className="page-sub">
              <span id="custName">Calendar App &mdash; Personal Productivity App</span> &middot;{' '}
              <span id="scopeLabel">{vm.scopeLabel}</span>
            </p>
          </div>

          <ControlBar />

          {page === 'pgTraffic' && <TrafficSection />}
          {page === 'pgAdopt' && <AdoptionSection />}
          {page === 'pgFlows' && <WorkflowSection />}

          <Footer />
          {chartTooltip && (
            <div
              className="chart-tooltip"
              role="tooltip"
              style={{ left: chartTooltip.x, top: chartTooltip.y }}
            >
              {chartTooltip.text}
            </div>
          )}
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
