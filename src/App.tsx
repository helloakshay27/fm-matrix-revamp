
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { InvoiceApprovalsPage } from './pages/InvoiceApprovalsPage';
import { AssetGroupsPage } from './pages/AssetGroupsPage';
import { SnaggingDashboard } from './pages/SnaggingDashboard';
import { SnaggingDetailsPage } from './pages/SnaggingDetailsPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<SnaggingDashboard />} />
              <Route path="/transitioning/snagging" element={<SnaggingDashboard />} />
              <Route path="/transitioning/snagging/details/:id" element={<SnaggingDetailsPage />} />
              <Route path="/settings/asset-setup/approval-matrix" element={<InvoiceApprovalsPage />} />
              <Route path="/settings/asset-setup/asset-groups" element={<AssetGroupsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
