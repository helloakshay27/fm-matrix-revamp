
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { InvoiceApprovalsPage } from './pages/InvoiceApprovalsPage';
import { AssetGroupsPage } from './pages/AssetGroupsPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/settings/asset-setup/approval-matrix" element={<InvoiceApprovalsPage />} />
              <Route path="/settings/asset-setup/asset-groups" element={<AssetGroupsPage />} />
            </Routes>
          </Layout>
        </Router>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
