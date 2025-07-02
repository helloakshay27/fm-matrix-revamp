
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LayoutProvider } from './contexts/LayoutContext';
import Index from './pages/Index';
import { TicketDashboard } from './pages/TicketDashboard';
import { AssetAuditDashboard } from './pages/AssetAuditDashboard';
import { MarketPlaceAllPage } from './pages/MarketPlaceAllPage';
import { MarketPlaceInstalledPage } from './pages/MarketPlaceInstalledPage';
import { MarketPlaceUpdatesPage } from './pages/MarketPlaceUpdatesPage';
import { LeaseManagementPage } from './pages/LeaseManagementPage';
import { LoyaltyRuleEnginePage } from './pages/LoyaltyRuleEnginePage';
import { CloudTelephonyPage } from './pages/CloudTelephonyPage';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/maintenance/ticket" element={<TicketDashboard />} />
            <Route path="/maintenance/audit/assets" element={<AssetAuditDashboard />} />
            <Route path="/market-place/all" element={<MarketPlaceAllPage />} />
            <Route path="/market-place/installed" element={<MarketPlaceInstalledPage />} />
            <Route path="/market-place/updates" element={<MarketPlaceUpdatesPage />} />
            <Route path="/market-place/lease-management" element={<LeaseManagementPage />} />
            <Route path="/market-place/loyalty-rule-engine" element={<LoyaltyRuleEnginePage />} />
            <Route path="/market-place/cloud-telephony" element={<CloudTelephonyPage />} />
            <Route path="/market-place/accounting" element={<MarketPlaceAllPage />} />
          </Routes>
        </Layout>
      </Router>
    </LayoutProvider>
  );
}

export default App;
