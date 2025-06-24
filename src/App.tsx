import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Import incident pages
import { IncidentListDashboard } from './pages/IncidentListDashboard';
import { IncidentDetailsPage } from './pages/IncidentDetailsPage';
import { AddIncidentPage } from './pages/AddIncidentPage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/" element={<Layout />}>
            {/* Safety routes */}
            <Route path="/safety/incident" element={<IncidentListDashboard />} />
            <Route path="/safety/incident/add" element={<AddIncidentPage />} />
            <Route path="/safety/incident/:id" element={<IncidentDetailsPage />} />
            
            {/* Keep the old maintenance routes for backward compatibility */}
            <Route path="/maintenance/incident" element={<IncidentListDashboard />} />
            <Route path="/maintenance/incident/add" element={<AddIncidentPage />} />
            <Route path="/maintenance/incident/:id" element={<IncidentDetailsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
