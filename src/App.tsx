
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LayoutProvider } from './contexts/LayoutContext';
import Index from './pages/Index';
import { TicketDashboard } from './pages/TicketDashboard';

// Market Place Pages
import { MarketPlaceAllPage } from './pages/MarketPlaceAllPage';
import { MarketPlaceInstalledPage } from './pages/MarketPlaceInstalledPage';
import { MarketPlaceUpdatesPage } from './pages/MarketPlaceUpdatesPage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            {/* Maintenance Routes */}
            <Route path="/maintenance/ticket" element={<TicketDashboard />} />
            {/* Market Place Routes */}
            <Route path="/market-place/all" element={<MarketPlaceAllPage />} />
            <Route path="/market-place/installed" element={<MarketPlaceInstalledPage />} />
            <Route path="/market-place/updates" element={<MarketPlaceUpdatesPage />} />
          </Route>
        </Routes>
      </Router>
    </LayoutProvider>
  );
}

export default App;
