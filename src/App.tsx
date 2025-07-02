
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Index from './pages/Index';
import { FitoutChecklistDashboard } from './pages/FitoutChecklistDashboard';
import { AssetAuditDashboard } from './pages/AssetAuditDashboard';
import { DesignInsightsDashboard } from './pages/DesignInsightsDashboard';
import { FitoutRequestListDashboard } from './pages/FitoutRequestListDashboard';
import { FitoutViolationDashboard } from './pages/FitoutViolationDashboard';
import { FitoutSetupDashboard } from './pages/FitoutSetupDashboard';
import { TrainingListDashboard } from './pages/TrainingListDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/transitioning/fitout/checklist" element={<FitoutChecklistDashboard />} />
          <Route path="/maintenance/audit/assets" element={<AssetAuditDashboard />} />
          <Route path="/transitioning/design-insights" element={<DesignInsightsDashboard />} />
          <Route path="/transitioning/fitout/request-list" element={<FitoutRequestListDashboard />} />
          <Route path="/transitioning/fitout/violations" element={<FitoutViolationDashboard />} />
          <Route path="/transitioning/fitout/setup" element={<FitoutSetupDashboard />} />
          <Route path="/safety/training-list" element={<TrainingListDashboard />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
