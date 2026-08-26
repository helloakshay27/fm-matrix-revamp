import './msafe-dashboard.css';
import { MsafeDashboardProvider, useMsafeDashboard } from './context/MsafeDashboardContext';
import { ViShellBanner } from './components/ViShellBanner';
import { PageToolbar } from './components/PageToolbar';
import { CircleManagerFilterBar } from './components/CircleManagerFilterBar';
import { PageHeader } from './components/PageHeader';
import { AlertStrip } from './components/AlertStrip';
import { KpiOverview } from './components/KpiOverview';
import { DrillPanel } from './components/DrillPanel';
import { AnalyticsModal } from './components/AnalyticsModal';
import { ToastStack } from './components/ToastStack';
import { UsersSection } from './sections/UsersSection';
import { KrccSection } from './sections/KrccSection';
import { TrainingSection } from './sections/TrainingSection';
import { LmcSection } from './sections/LmcSection';
import { SmtSection } from './sections/SmtSection';
import { HeatmapSection } from './sections/HeatmapSection';
import { MyDashboardSection } from './sections/MyDashboardSection';
import { Shield } from 'lucide-react';

function MsafeMain() {
  const { module, openAcc, setModule } = useMsafeDashboard();

  const goModule = (key: 'msafe' | 'mydashboard') => {
    setModule(key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ViShellBanner />
      <PageToolbar />
      <CircleManagerFilterBar />

      {/* Black module-tabs bar — always visible; M-Safe tab is back control on My Dashboard */}
      <nav className="module-tabs">
        <button
          type="button"
          className={`mtab ${module === 'msafe' ? 'active' : ''}`}
          onClick={() => goModule('msafe')}
        >
          <Shield size={14} />
          M-Safe
        </button>
      </nav>

      {/* M-Safe content */}
      <main
        className={`content module-content ${module === 'msafe' ? 'active' : ''}`}
        id="content-msafe"
      >
        <PageHeader />
        {/* Priority Actions / notification strip hidden per request. <AlertStrip /> */}
        <KpiOverview />
        <div
          id="acc-users"
          className={`msafe-acc-anchor ${openAcc === 'users' ? 'nav-highlight' : ''}`}
        >
          <UsersSection />
        </div>
        <div
          id="acc-krcc"
          className={`msafe-acc-anchor ${openAcc === 'krcc' ? 'nav-highlight' : ''}`}
        >
          <KrccSection />
        </div>
        <div
          id="acc-training"
          className={`msafe-acc-anchor ${openAcc === 'training' ? 'nav-highlight' : ''}`}
        >
          <TrainingSection />
        </div>
        <div id="acc-lmc" className={`msafe-acc-anchor ${openAcc === 'lmc' ? 'nav-highlight' : ''}`}>
          <LmcSection />
        </div>
        <div id="acc-smt" className={`msafe-acc-anchor ${openAcc === 'smt' ? 'nav-highlight' : ''}`}>
          <SmtSection />
        </div>
        <HeatmapSection />
        <div className="footer">
          M-Safe Dashboard v1 · Wireframe · GoPhygital / Lockated for Vodafone Idea · All data shown is
          illustrative dummy data pending DB integration · July 2026
        </div>
      </main>

      {/* My Dashboard content — black bar stays above; M-Safe tab returns here */}
      <main
        className={`content module-content ${module === 'mydashboard' ? 'active' : ''}`}
        id="content-mydashboard"
      >
        <MyDashboardSection />
      </main>

      <AnalyticsModal />
      <DrillPanel />
      <ToastStack />
    </>
  );
}

export function MsafeDashboardPage() {
  return (
    <div className="msafe-dash">
      <MsafeDashboardProvider>
        <MsafeMain />
      </MsafeDashboardProvider>
    </div>
  );
}

export default MsafeDashboardPage;
