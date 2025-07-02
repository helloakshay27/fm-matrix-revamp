
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { SetupLayout } from '@/components/SetupLayout';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import { MarketPlaceInstalledPage } from '@/pages/MarketPlaceInstalledPage';
import MarketPlaceAllPage from '@/pages/MarketPlaceAllPage';
import { MarketPlaceUpdatesPage } from '@/pages/MarketPlaceUpdatesPage';
import { MarketPlaceAccountingPage } from '@/pages/MarketPlaceAccountingPage';
import { MarketPlaceAccountingDetailsPage } from '@/pages/MarketPlaceAccountingDetailsPage';
import { MarketPlaceAccountingEditPage } from '@/pages/MarketPlaceAccountingEditPage';
import { MarketPlaceCostCenterPage } from '@/pages/MarketPlaceCostCenterPage';
import LeaseManagementDetailPage from '@/pages/LeaseManagementDetailPage';
import LoyaltyRuleEngineDetailPage from '@/pages/LoyaltyRuleEngineDetailPage';
import { LoyaltyRuleEngineDashboard } from '@/pages/LoyaltyRuleEngineDashboard';
import { TaskDashboard } from '@/pages/TaskDashboard';
import { TaskDetailsPage } from '@/pages/TaskDetailsPage';
import { TaskListDashboard } from '@/pages/TaskListDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Market Place Routes */}
        <Route path="/market-place/installed" element={<Layout><MarketPlaceInstalledPage /></Layout>} />
        <Route path="/market-place/all" element={<Layout><MarketPlaceAllPage /></Layout>} />
        <Route path="/market-place/updates" element={<Layout><MarketPlaceUpdatesPage /></Layout>} />
        <Route path="/market-place/accounting" element={<Layout><MarketPlaceAccountingPage /></Layout>} />
        <Route path="/market-place/accounting/details/:id" element={<Layout><MarketPlaceAccountingDetailsPage /></Layout>} />
        <Route path="/market-place/accounting/edit/:id" element={<Layout><MarketPlaceAccountingEditPage /></Layout>} />
        <Route path="/market-place/cost-center" element={<Layout><MarketPlaceCostCenterPage /></Layout>} />
        <Route path="/market-place/lease-management" element={<Layout><LeaseManagementDetailPage /></Layout>} />
        <Route path="/market-place/loyalty-rule-engine" element={<Layout><LoyaltyRuleEngineDetailPage /></Layout>} />
        <Route path="/create-rule-engine" element={<Layout><LoyaltyRuleEngineDashboard /></Layout>} />
        
        {/* Task Management Routes */}
        <Route path="/maintenance/task" element={<Layout><TaskDashboard /></Layout>} />
        <Route path="/maintenance/task/details/:id" element={<Layout><TaskDetailsPage /></Layout>} />
        <Route path="/maintenance/task/list" element={<Layout><TaskListDashboard /></Layout>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
