
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LayoutProvider } from './contexts/LayoutContext';
import { ApprovalMatrixDashboard } from './pages/settings/ApprovalMatrixDashboard';
import { AssetGroupsDashboard } from './pages/setup/AssetGroupsDashboard';
import { AssetSetupApprovalMatrix } from './pages/settings/AssetSetupApprovalMatrix';
import { AssetSetupGroups } from './pages/settings/AssetSetupGroups';

function App() {
  return (
    <LayoutProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/settings/approval-matrix" replace />} />
            <Route path="/settings/approval-matrix" element={<ApprovalMatrixDashboard />} />
            <Route path="/setup/groups" element={<AssetGroupsDashboard />} />
            <Route path="/settings/asset-setup/approval-matrix" element={<AssetSetupApprovalMatrix />} />
            <Route path="/settings/asset-setup/groups" element={<AssetSetupGroups />} />
            {/* Add more routes as needed */}
          </Routes>
        </Layout>
      </Router>
    </LayoutProvider>
  );
}

export default App;
