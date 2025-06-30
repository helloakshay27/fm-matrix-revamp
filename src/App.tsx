import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/Layout';
import { SetupLayout } from '@/components/SetupLayout';
import { LayoutProvider } from '@/contexts/LayoutContext';

const FitoutChecklistDashboard = lazy(() => import('@/pages/FitoutChecklistDashboard').then(module => ({ default: module.FitoutChecklistDashboard })));
const FitoutViolationDashboard = lazy(() => import('@/pages/FitoutViolationDashboard').then(module => ({ default: module.FitoutViolationDashboard })));
const EventsDashboard = lazy(() => import('@/pages/EventsDashboard').then(module => ({ default: module.default })));
const AttendanceDashboard = lazy(() => import('@/pages/AttendanceDashboard').then(module => ({ default: module.AttendanceDashboard })));
const AirlineDashboard = lazy(() => import('@/pages/AirlineDashboard').then(module => ({ default: module.AirlineDashboard })));
const MetricCardsDashboard = lazy(() => import('@/pages/MetricCardsDashboard').then(module => ({ default: module.MetricCardsDashboard })));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/fitout/checklist" element={<FitoutChecklistDashboard />} />
                <Route path="/fitout/violation" element={<FitoutViolationDashboard />} />
                <Route path="/events" element={<EventsDashboard />} />
                <Route path="/maintenance/attendance" element={<AttendanceDashboard />} />
                <Route path="/airline" element={<AirlineDashboard />} />
                <Route path="/metric-cards" element={<MetricCardsDashboard />} />
                {/* Add other routes here as needed */}
              </Routes>
            </Suspense>
            <Toaster />
          </div>
        </Router>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
