
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { Index } from '@/pages/Index';
import { NotFound } from '@/pages/NotFound';
import { RoleDashboard } from '@/pages/settings/RoleDashboard';
import { ApprovalMatrixPage } from '@/pages/settings/ApprovalMatrixPage';
import { ApprovalMatrixDashboard } from '@/pages/settings/ApprovalMatrixDashboard';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/settings" element={<Layout />}>
            <Route path="roles/role" element={<RoleDashboard />} />
            <Route path="approval-matrix" element={<ApprovalMatrixPage />} />
            <Route path="approval-matrix-dashboard" element={<ApprovalMatrixDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
