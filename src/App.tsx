import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { Index } from './pages/Index';
import { NotFound } from './pages/NotFound';
import { IncidentListDashboard } from './pages/IncidentListDashboard';
import { IncidentDetailsPage } from './pages/IncidentDetailsPage';
import { AddIncidentPage } from './pages/AddIncidentPage';
import ParkingBookingsDashboard from './pages/ParkingBookingsDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              
              {/* Safety Routes */}
              <Route path="/safety/incident" element={<IncidentListDashboard />} />
              <Route path="/safety/incident/add" element={<AddIncidentPage />} />
              <Route path="/safety/incident/:id" element={<IncidentDetailsPage />} />
              
              {/* Keep existing maintenance routes for backward compatibility */}
              <Route path="/maintenance/incident" element={<IncidentListDashboard />} />
              <Route path="/maintenance/incident/add" element={<AddIncidentPage />} />
              <Route path="/maintenance/incident/:id" element={<IncidentDetailsPage />} />
              
              {/* VAS Routes */}
              <Route path="/vas/parking" element={<ParkingBookingsDashboard />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
