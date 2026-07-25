import './posthog-dashboard.css';
import { DashboardProvider } from './context/DashboardContext';
import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { TierNote, BenchmarkNote } from './components/TierNote';
import { InfoPopover } from './components/InfoPopover';
import { AiPanel } from './components/AiPanel';
import { Reveal } from './components/Reveal';
import { Footer } from './components/Footer';
import { TrafficSection } from './sections/TrafficSection';
import { AdoptionSection } from './sections/AdoptionSection';
import { WorkflowSection } from './sections/WorkflowSection';

export function PosthogDashboardPage() {
  return (
    <div className="phg-dashboard">
      <DashboardProvider>
        <Header />
        <ControlBar />
        <div className="phg-wrap">
          <TierNote />
          <BenchmarkNote />
          <Reveal><TrafficSection /></Reveal>
          <Reveal><AdoptionSection /></Reveal>
          <Reveal><WorkflowSection /></Reveal>
          <Reveal><Footer /></Reveal>
        </div>
        <InfoPopover />
        <AiPanel />
      </DashboardProvider>
    </div>
  );
}

export default PosthogDashboardPage;
