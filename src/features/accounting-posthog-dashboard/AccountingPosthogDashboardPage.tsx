import { useEffect } from 'react';
import './accounting-posthog-dashboard.css';
import { ControlBar } from './components/ControlBar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { AccountingDashboardProvider } from './context/AccountingDashboardContext';
import { useAccountingDashboard } from './context/accountingDashboardStore';
import { PAGE_TITLES } from './data/pages';
import { AdoptionSection } from './sections/AdoptionSection';
import { TrafficSection } from './sections/TrafficSection';
import { WorkflowSection } from './sections/WorkflowSection';

function DashboardLayout() {
  const { vm, page, theme, navCollapsed, toggleNav } = useAccountingDashboard();

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
    <div className={`acc-ph${navCollapsed ? ' nav-collapsed' : ''}`} data-theme={theme}>
      <Topbar />
      <div className="shell">
        <Sidebar />
        <main className="main">
          <div className="page-head">
            <h2 id="pageTitle">{PAGE_TITLES[page]}</h2>
            <p className="page-sub">
              <span id="custName">Club Management &middot; Accounting module</span> &middot;{' '}
              <span id="scopeLabel">{vm.scopeLabel}</span>
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
 * Club Management · Accounting Analytics.
 *
 * Copy of the Calendar dashboard laid out per the Accounting wireframe, on the same three-layer shell
 * the rest of this dashboard family uses, reading the same nine FM Adoption Analytics
 * endpoints as `/posthog-dashboard` and `/vi-posthog-dashboard` — same query contract, same
 * caching and refresh behaviour. The tenant it reports on comes from `api/adoptionApi.ts`.
 */
export function AccountingPosthogDashboardPage() {
  return (
    <AccountingDashboardProvider>
      <DashboardLayout />
    </AccountingDashboardProvider>
  );
}

export default AccountingPosthogDashboardPage;
