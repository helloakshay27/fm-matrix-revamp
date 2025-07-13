
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LayoutProvider } from './contexts/LayoutContext';
import { Layout } from './components/Layout';
import { SetupLayout } from './components/SetupLayout';
import { ApprovalMatrixDashboard } from './pages/settings/ApprovalMatrixDashboard';
import { InvoiceApprovalsPage } from './pages/settings/InvoiceApprovalsPage';
import { PendingApprovalsDashboard } from './pages/PendingApprovalsDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<div className="p-8"><h1 className="text-2xl font-bold">Dashboard</h1></div>} />
              <Route path="finance/pending-approvals" element={<PendingApprovalsDashboard />} />
              <Route path="*" element={<div className="p-8"><h1 className="text-2xl font-bold">Page Not Found</h1></div>} />
            </Route>
            <Route path="/setup" element={<SetupLayout />}>
              <Route path="approval-matrix" element={<ApprovalMatrixDashboard />} />
              <Route path="invoice-approvals" element={<InvoiceApprovalsPage />} />
            </Route>
            <Route path="/settings" element={<Layout />}>
              <Route path="approval-matrix/setup" element={<ApprovalMatrixDashboard />} />
              <Route path="invoice-approvals" element={<InvoiceApprovalsPage />} />
            </Route>
          </Routes>
        </Router>
      </LayoutProvider>
    </QueryClientProvider>
  );
}

export default App;
